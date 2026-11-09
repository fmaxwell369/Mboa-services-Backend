import crypto from 'crypto';
import fs from 'fs';

// Hash SHA-256 d'un fichier
export function hashFile(filePath) {
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

// Génère un code unique de certification (ex: CERT-8F3A-92K1)
export function generateCertCode() {
    const part = () => crypto.randomBytes(2).toString('hex').toUpperCase();
    return `CERT-${part()}-${part()}`;
}