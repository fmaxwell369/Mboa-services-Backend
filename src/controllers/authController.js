import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

// POST /api/auth/register
export async function register(req, res) {
    try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email }))
        return res.status(400).json({ message: 'Email déjà utilisé' });

    // ⚠️ Sécurité : seul un admin peut créer un agent/admin.
    // Ici on force 'citizen' par défaut pour l'inscription publique.
    const user = await User.create({ name, email, password, role: 'citizen' });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: signToken(user._id),
    });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// POST /api/auth/login
export async function login(req, res) {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
        return res.status(401).json({ message: 'Identifiants invalides' });

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: signToken(user._id),
    });
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
}

// GET /api/auth/me
export async function getMe(req, res) {
    res.json(req.user);
}