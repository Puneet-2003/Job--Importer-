import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  company: String,
  location: String,
  description: String,
  category: String,
  applyUrl: String,
  publishedDate: Date,
  source: String
}, {
  timestamps: true
});

export default mongoose.model('Job', jobSchema);