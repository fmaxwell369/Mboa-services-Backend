const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => res.json({ message: 'API OK' }));
// app.use('/api/users', require('./routes/userRoutes'));

// 404
app.use((req, res) => res.status(404).json({ message: 'Route introuvable' }));

// Erreurs
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Erreur serveur' });
});

module.exports = app;