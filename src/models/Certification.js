import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true, unique: true },   // code public de vérification
    certifiedHash: { type: String, required: true },        // hash au moment de la certif
    certifiedFilePath: { type: String },                    // PDF avec tampon
    notes: String,
}, { timestamps: true });

export default mongoose.model('Certification', certificationSchema);