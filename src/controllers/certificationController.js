import Document from '../models/Document.js';
import Certification from '../models/Certification.js';
import { hashFile, generateCertCode } from '../utils/hash.js';

// POST /api/certifications/:documentId  (agent/admin)
// Valide un document et crée la certification
export async function certifyDocument(req, res) {
  try {
    const doc = await Document.findById(req.params.documentId);
    if (!doc) return res.status(404).json({ message: 'Document introuvable' });
    if (doc.status === 'certified')
      return res.status(400).json({ message: 'Déjà certifié' });

    // Vérifie que le fichier n'a pas été altéré
    const currentHash = hashFile(doc.filePath);
    if (currentHash !== doc.fileHash)
      return res.status(400).json({ message: 'Fichier altéré, certification refusée' });

    // TODO Phase 2 : générer le PDF avec tampon numérique ici
    // const stampedPath = await stampPdf(doc.filePath, code);

    const cert = await Certification.create({
      document: doc._id,
      agent: req.user._id,
      code: generateCertCode(),
      certifiedHash: doc.fileHash,
      certifiedFilePath: doc.filePath, // à remplacer par stampedPath en Phase 2
      notes: req.body.notes,
    });

    doc.status = 'certified';
    await doc.save();

    res.status(201).json(cert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// POST /api/certifications/:documentId/reject  (agent/admin)
export async function rejectDocument(req, res) {
  const doc = await Document.findById(req.params.documentId);
  if (!doc) return res.status(404).json({ message: 'Document introuvable' });

  doc.status = 'rejected';
  doc.rejectionReason = req.body.reason || 'Non conforme';
  await doc.save();

  res.json(doc);
}
// GET /api/certifications/mine  (citizen) — mes certifications
export async function getMyCertifications(req, res) {
  const docs = await Document.find({ owner: req.user._id }).select('_id');
  const ids = docs.map((d) => d._id);

  const certs = await Certification.find({ document: { $in: ids } })
    .populate('document', 'title status')
    .populate('agent', 'name')
    .sort('-createdAt');

  res.json(certs);
}

// GET /api/certifications/verify/:code  (PUBLIC — pas d'auth)
// Vérification d'authenticité via le code de certification
export async function verifyByCode(req, res) {
  const cert = await Certification.findOne({ code: req.params.code })
    .populate('document', 'title fileHash status')
    .populate('agent', 'name');

  if (!cert) return res.status(404).json({ valid: false, message: 'Code introuvable' });

  res.json({
    valid: true,
    code: cert.code,
    documentTitle: cert.document?.title,
    certifiedAt: cert.createdAt,
    certifiedBy: cert.agent?.name,
    certifiedHash: cert.certifiedHash,
  });
}