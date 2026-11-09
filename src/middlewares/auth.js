import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Vérifie le token JWT
export async function protect(req, res, next) {
    try {
        let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ message: 'Non authentifié' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'Utilisateur introuvable' });

    next();
    } catch (err) {
        res.status(401).json({ message: 'Token invalide' });
    }
}

// Restreint à certains rôles
export function authorize(...roles) {
    return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Accès refusé' });
    }
        next();
    };
}