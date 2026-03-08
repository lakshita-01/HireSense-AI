import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  fileName: String,
  role: String,
  targetJobRole: String,
  jobDescription: String,
  originalResumeText: String, // Store the actual resume text
  score: Number,
  breakdown: Object,
  recommendations: [String],
  tailoredResumeContent: String,
  rewrittenResume: String,
  userEditedResume: String,
  editRecommendations: [String],
  coverLetter: String,
  createdAt: { type: Date, default: Date.now }
});

export const Analysis = mongoose.model('Analysis', analysisSchema);
