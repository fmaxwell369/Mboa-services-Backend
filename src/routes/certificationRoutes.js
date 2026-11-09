import express from 'express';
import {
  certifyDocument,
  rejectDocument,
  getMyCertifications,
  verifyByCode,
} from '../controllers/certificationController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public — vérification d'authenticité
router.get('/verify/:code', verifyByCode);

// Citizen
router.get('/mine', protect, authorize('citizen'), getMyCertifications);

// Agent / Admin
router.post('/:documentId', protect, authorize('agent', 'admin'), certifyDocument);
router.post('/:documentId/reject', protect, authorize('agent', 'admin'), rejectDocument);

export default router;
