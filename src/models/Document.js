import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    filePath: { type: String, required: true },   // chemin local ou URL S3
    fileHash: { type: String, required: true },   // SHA-256 du fichier
    status: {
        type: String,
        enum: ['pending', 'certified', 'rejected'],
        default: 'pending',
    },
    rejectionReason: String,
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);