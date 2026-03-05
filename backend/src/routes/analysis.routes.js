import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { IndustryKeyword } from '../models/IndustryKeyword.js';
import { generateEmbeddings } from '../services/embedding.service.js';
import { calculateCosineSimilarity } from '../utils/similarity.js';
import { calculateATSScore } from '../services/scoring.service.js';
import { getAIAnalysis, generateTailoredResume, generateCoverLetter } from '../services/ai.service.js';
import { Analysis } from '../models/Analysis.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    const { role, targetJobRole, jobDescription } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // 1. Extract Text
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    // 2. Get Job Template (if using predefined role)
    let industryData = null;
    if (role && !jobDescription) {
      industryData = await IndustryKeyword.findOne({ role: role || "Backend Developer" });
    }

    let foundKeywords = [];
    let similarity = 0;
    let scoringResult = {};

    // 3. Keyword Matching & Scoring (only if using predefined role)
    if (industryData) {
      foundKeywords = industryData.keywords.filter(kw => 
        resumeText.toLowerCase().includes(kw.toLowerCase())
      );

      // 4. Semantic Similarity
      const [resumeVec, jobVec] = await Promise.all([
        generateEmbeddings(resumeText.substring(0, 1000)),
        generateEmbeddings(industryData.keywords.join(', '))
      ]);
      similarity = calculateCosineSimilarity(resumeVec, jobVec);

      // 5. Scoring
      scoringResult = calculateATSScore({
        text: resumeText,
        matchCount: foundKeywords.length,
        requiredCount: industryData.keywords.length,
        similarity: similarity
      });
    } else if (jobDescription && targetJobRole) {
      // If using custom job description, do semantic analysis
      const [resumeVec, jobVec] = await Promise.all([
        generateEmbeddings(resumeText.substring(0, 1000)),
        generateEmbeddings(jobDescription.substring(0, 1000))
      ]);
      similarity = calculateCosineSimilarity(resumeVec, jobVec);
      
      scoringResult = {
        total: Math.round(similarity * 100),
        breakdown: {
          semanticMatch: Math.round(similarity * 100),
          contentQuality: 75,
          formatting: 80
        }
      };
    }

    // 6. AI Recommendations
    const keywords = industryData ? industryData.keywords : jobDescription.split(' ').filter(w => w.length > 5);
    const recommendations = await getAIAnalysis(resumeText, keywords);

    // 7. Generate tailored content if job description provided
    let tailoredResumeContent = null;
    let coverLetter = null;

    if (jobDescription && targetJobRole) {
      [tailoredResumeContent, coverLetter] = await Promise.all([
        generateTailoredResume(resumeText, targetJobRole, jobDescription),
        generateCoverLetter(resumeText, targetJobRole, jobDescription, "")
      ]);
    }

    const analysis = new Analysis({
      fileName: req.file.originalname,
      role: industryData ? industryData.role : null,
      targetJobRole: targetJobRole || null,
      jobDescription: jobDescription || null,
      score: scoringResult.total || 0,
      breakdown: scoringResult.breakdown || {},
      recommendations: recommendations,
      tailoredResumeContent: tailoredResumeContent || null,
      coverLetter: coverLetter || null
    });

    await analysis.save();
    res.json(analysis);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Analysis failed", error: error.message });
  }
});

// Endpoint to generate tailored resume for existing analysis
router.post('/tailored-resume/:analysisId', async (req, res) => {
  try {
    const { jobDescription, targetJobRole } = req.body;
    const analysis = await Analysis.findById(req.params.analysisId);

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    // We'll need to store the resume text - for now we'll generate based on analysis data
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    const tailoredContent = await generateTailoredResume(resumeText, targetJobRole, jobDescription);
    
    analysis.tailoredResumeContent = tailoredContent;
    analysis.targetJobRole = targetJobRole;
    analysis.jobDescription = jobDescription;
    await analysis.save();

    res.json({ tailoredResumeContent: tailoredContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate tailored resume", error: error.message });
  }
});

// Endpoint to generate cover letter
router.post('/cover-letter', upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription, targetJobRole } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    const coverLetter = await generateCoverLetter(resumeText, targetJobRole, jobDescription, "");
    res.json({ coverLetter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate cover letter", error: error.message });
  }
});

router.get('/roles', async (req, res) => {
  const roles = await IndustryKeyword.find().select('role');
  res.json(roles.map(r => r.role));
});

export default router;
