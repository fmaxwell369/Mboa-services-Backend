
import Procedure from '../models/Procedure.js';

// GET /api/procedures
// Catalogue public : uniquement les démarches actives
export async function getActiveProcedures(req, res) {
  try {
    const procedures = await Procedure.find({ status: 'active' })
      .sort({ title: 1 });

    res.json(procedures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/procedures/manage
// Toutes les démarches pour l'administrateur
export async function getAllProcedures(req, res) {
  try {
    const procedures = await Procedure.find()
      .populate('createdBy', 'name email')
      .sort({ updatedAt: -1 });

    res.json(procedures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// POST /api/procedures
// Créer une démarche
export async function createProcedure(req, res) {
  try {
    const procedure = await Procedure.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json(procedure);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// PATCH /api/procedures/:id
// Modifier une démarche
export async function updateProcedure(req, res) {
  try {
    const procedure = await Procedure.findById(req.params.id);

    if (!procedure) {
      return res.status(404).json({ message: 'Démarche introuvable' });
    }

    if (procedure.status === 'archived') {
      return res.status(400).json({
        message: 'Une démarche archivée ne peut plus être modifiée',
      });
    }

    const allowedFields = [
      'title',
      'description',
      'category',
      'responsibleAdministration',
      'eligibility',
      'requiredDocuments',
      'steps',
      'cost',
      'processingTime',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        procedure[field] = req.body[field];
      }
    });

    await procedure.save();

    res.json(procedure);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// PATCH /api/procedures/:id/deactivate
// Désactiver une démarche

export async function deactivateProcedure(req, res) {
  try {
    const procedure = await Procedure.findById(req.params.id);

    if (!procedure) {
      return res.status(404).json({
        message: 'Démarche introuvable',
      });
    }

    if (procedure.status === 'archived') {
      return res.status(400).json({
        message: 'Cette démarche est déjà archivée',
      });
    }

    procedure.status = 'inactive';
    await procedure.save();

    res.json(procedure);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}


// PATCH /api/procedures/:id/archive
// Archiver une démarche
export async function archiveProcedure(req, res) {
  try {
    const procedure = await Procedure.findByIdAndUpdate(
      req.params.id,
      { status: 'archived' },
      { new: true, runValidators: true }
    );

    if (!procedure) {
      return res.status(404).json({ message: 'Démarche introuvable' });
    }

    res.json(procedure);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
