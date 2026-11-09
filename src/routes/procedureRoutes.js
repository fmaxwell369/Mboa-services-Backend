
import express from 'express';

import {
  getActiveProcedures,
  getAllProcedures,
  createProcedure,
  updateProcedure,
  deactivateProcedure,
  archiveProcedure,
} from '../controllers/procedureController.js';

import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Catalogue accessible aux utilisateurs authentifiés
router.get('/', protect, getActiveProcedures);

// Gestion réservée à l'administrateur
router.get('/manage', protect, authorize('admin'), getAllProcedures);
router.post('/', protect, authorize('admin'), createProcedure);
router.patch('/:id', protect, authorize('admin'), updateProcedure);
router.patch('/:id/deactivate', protect, authorize('admin'), deactivateProcedure);
router.patch('/:id/archive', protect, authorize('admin'), archiveProcedure);

export default router;
