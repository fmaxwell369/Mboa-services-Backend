import express from 'express';
import {
  createDocument,
  getMyDocuments,
  getAllDocuments,
  getDocument,
  getDocumentStats,
} from '../controllers/documentController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// Citizen
router.post('/', protect, authorize('citizen'), upload.single('file'), createDocument);
router.get('/mine', protect, authorize('citizen'), getMyDocuments);

// Staff
router.get('/', protect, authorize('agent', 'admin'), getAllDocuments);

router.get('/stats', protect, authorize('agent', 'admin'), getDocumentStats);

// Owner ou staff
router.get('/:id', protect, getDocument);

export default router;
