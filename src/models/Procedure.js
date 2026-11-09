
import mongoose from 'mongoose';

const procedureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  responsibleAdministration: {
    type: String,
    required: true,
    trim: true,
  },
  eligibility: [{
    type: String,
    trim: true,
  }],
  requiredDocuments: [{
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    mandatory: { type: Boolean, default: true },
  }],
  steps: [{
    type: String,
    trim: true,
  }],
  cost: {
    type: Number,
    min: 0,
    default: 0,
  },
  processingTime: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Procedure', procedureSchema);
