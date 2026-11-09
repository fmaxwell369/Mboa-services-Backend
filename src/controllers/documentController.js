import Document from '../models/Document.js';
import { hashFile } from '../utils/hash.js';

// POST /api/documents  (citizen)
export async function createDocument(req, res) {
try {
    if (!req.file) return res.status(400).json({ message: 'Aucun fichier' });

    const fileHash = hashFile(req.file.path);

    const doc = await Document.create({
        owner: req.user._id,
        title: req.body.title,
        description: req.body.description,
        filePath: req.file.path,
        fileHash,
    });

    res.status(201).json(doc);
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
}

// GET /api/documents/mine  (citizen)
export async function getMyDocuments(req, res) {
    const docs = await Document.find({ owner: req.user._id }).sort('-createdAt');
    res.json(docs);
}

// GET /api/documents  (agent/admin) — tous les docs
export async function getAllDocuments(req, res) {
    const docs = await Document.find()
    .populate('owner', 'name email')
    .sort('-createdAt');
    res.json(docs);
}

// GET /api/documents/:id  (owner ou agent/admin)
export async function getDocument(req, res) {
    const doc = await Document.findById(req.params.id).populate('owner', 'name email');
    if (!doc) return res.status(404).json({ message: 'Document introuvable' });

    const isOwner = doc.owner._id.toString() === req.user._id.toString();
    const isStaff = ['agent', 'admin'].includes(req.user.role);
    if (!isOwner && !isStaff)
        return res.status(403).json({ message: 'Accès refusé' });

    res.json(doc);
}
// GET /api/documents/stats
export async function getDocumentStats(req, res) {
try {
const [total, pending, certified, rejected] = await Promise.all([
    Document.countDocuments(),
    Document.countDocuments({ status: 'pending' }),
    Document.countDocuments({ status: 'certified' }),
    Document.countDocuments({ status: 'rejected' }),
    ]);

res.json({
    total,
    pending,
    certified,
    rejected,
    });
} catch (err) {
    res.status(500).json({ message: err.message });
    }
}