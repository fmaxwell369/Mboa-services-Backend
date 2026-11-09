import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';
import procedureRoutes from './routes/procedureRoutes.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/', (req, res) => res.json({ status: 'API OK' }));
app.use('/api/procedures', procedureRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/certifications', certificationRoutes);

// Gestion erreurs globale
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

export default app;