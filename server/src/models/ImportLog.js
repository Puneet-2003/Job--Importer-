import mongoose from 'mongoose';

const importLogSchema = new mongoose.Schema({
  fileName: String,
  importDateTime: { type: Date, default: Date.now },
  total: { type: Number, default: 0 },
  new: { type: Number, default: 0 },
  updated: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['waiting', 'processing', 'completed', 'failed'],
    default: 'waiting'
  }
});

export default mongoose.model('ImportLog', importLogSchema);