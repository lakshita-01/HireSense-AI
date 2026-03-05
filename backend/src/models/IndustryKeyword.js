import mongoose from 'mongoose';

const keywordSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true },
  keywords: [String],
  weightage: { type: Object, default: {} }
});

export const IndustryKeyword = mongoose.model('IndustryKeyword', keywordSchema);
