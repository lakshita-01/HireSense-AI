import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { IndustryKeyword } from '../models/IndustryKeyword.js';
import { generateEmbeddings } from '../services/embedding.service.js';
import { calculateCosineSimilarity } from '../utils/similarity.js';
import { calculateATSScore } from '../services/scoring.service.js';
import { getAIAnalysis, generateTailoredResume, generateCoverLetter, rewriteResumeWithSuggestions, getResumeEditRecommendations, applyRecommendation } from '../services/ai.service.js';
import { extractTextFromFile, generateResumePDF, generateResumeDocx, generateCoverLetterPDF, generateCoverLetterDocx } from '../services/document.service.js';
import { Analysis } from '../models/Analysis.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    const { role, targetJobRole, jobDescription, resumeText: pastedText } = req.body;

    let resumeText = '';

    // Handle pasted text
    if (pastedText) {
      resumeText = pastedText;
    }
    // Handle file upload
    else if (req.file) {
      resumeText = await extractTextFromFile(req.file);
    } else {
      return res.status(400).json({ message: "No resume provided" });
    }

    // 2. Get Job Template (if using predefined role)
    let industryData = null;
    if (role && !jobDescription) {
      industryData = await IndustryKeyword.findOne({ role: role || "Backend Developer" });
    }

    let foundKeywords = [];
    let similarity = 0;
    let scoringResult = {};

    // 3. Keyword Matching & Scoring
    if (industryData) {
      // Using predefined role template
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
      // Using custom job description - do full semantic analysis
      const [resumeVec, jobVec] = await Promise.all([
        generateEmbeddings(resumeText.substring(0, 1000)),
        generateEmbeddings(jobDescription.substring(0, 1000))
      ]);
      similarity = calculateCosineSimilarity(resumeVec, jobVec);

      // Extract keywords from job description for keyword matching
      const jdKeywords = jobDescription
        .toLowerCase()
        .match(/\b[a-z]{4,}\b/g) || [];
      const uniqueJdKeywords = [...new Set(jdKeywords)];
      
      // Find matching keywords in resume
      const resumeWords = resumeText.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
      const matchedJdKeywords = uniqueJdKeywords.filter(kw => 
        resumeWords.includes(kw)
      );

      // Calculate comprehensive score using the same weighted formula
      scoringResult = calculateATSScore({
        text: resumeText,
        matchCount: matchedJdKeywords.length,
        requiredCount: uniqueJdKeywords.length,
        similarity: similarity
      });

      // Store found keywords for reference
      foundKeywords = matchedJdKeywords;
    } else {
      // Fallback: basic scoring without job description
      scoringResult = {
        total: 50,
        breakdown: {
          keywordMatch: 50,
          semanticSimilarity: 50,
          impactMetrics: 50,
          techDepth: 50,
          formatting: 80
        }
      };
    }

    // 6. AI Recommendations
    const keywords = industryData 
      ? industryData.keywords 
      : (jobDescription ? jobDescription.split(' ').filter(w => w.length > 5) : []);
    
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
      fileName: req.file?.originalname || 'Pasted Text',
      role: industryData ? industryData.role : null,
      targetJobRole: targetJobRole || null,
      jobDescription: jobDescription || null,
      originalResumeText: resumeText, // Store the actual resume text
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

// Download tailored resume as PDF
router.get('/download/resume/:analysisId/pdf', async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.analysisId);
    if (!analysis || !analysis.tailoredResumeContent) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const pdfBuffer = await generateResumePDF(analysis.tailoredResumeContent, analysis.targetJobRole || 'Position');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="tailored-resume-${analysis.targetJobRole || 'resume'}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate PDF", error: error.message });
  }
});

// Download tailored resume as DOCX
router.get('/download/resume/:analysisId/docx', async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.analysisId);
    if (!analysis || !analysis.tailoredResumeContent) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const docxBuffer = await generateResumeDocx(analysis.tailoredResumeContent, analysis.targetJobRole || 'Position');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="tailored-resume-${analysis.targetJobRole || 'resume'}.docx"`);
    res.send(docxBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate DOCX", error: error.message });
  }
});

// Download cover letter as PDF
router.get('/download/cover-letter/:analysisId/pdf', async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.analysisId);
    if (!analysis || !analysis.coverLetter) {
      return res.status(404).json({ message: "Cover letter not found" });
    }

    const pdfBuffer = await generateCoverLetterPDF(analysis.coverLetter, analysis.targetJobRole || 'Position');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="cover-letter-${analysis.targetJobRole || 'letter'}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate PDF", error: error.message });
  }
});

// Download cover letter as DOCX
router.get('/download/cover-letter/:analysisId/docx', async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.analysisId);
    if (!analysis || !analysis.coverLetter) {
      return res.status(404).json({ message: "Cover letter not found" });
    }

    const docxBuffer = await generateCoverLetterDocx(analysis.coverLetter, analysis.targetJobRole || 'Position');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="cover-letter-${analysis.targetJobRole || 'letter'}.docx"`);
    res.send(docxBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate DOCX", error: error.message });
  }
});

// Endpoint to generate tailored resume for existing analysis
router.post('/tailored-resume/:analysisId', upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription, targetJobRole } = req.body;
    const analysis = await Analysis.findById(req.params.analysisId);

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    let resumeText = analysis.originalResumeText;
    if (req.file) {
      resumeText = await extractTextFromFile(req.file);
    }

    if (!resumeText) {
      return res.status(400).json({ message: "Resume text not found. Please upload a resume." });
    }

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
    
    let resumeText = '';
    if (req.file) {
      resumeText = await extractTextFromFile(req.file);
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    } else {
      return res.status(400).json({ message: "No resume provided" });
    }

    const coverLetter = await generateCoverLetter(resumeText, targetJobRole, jobDescription, "");
    res.json({ coverLetter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate cover letter", error: error.message });
  }
});

// Endpoint to rewrite resume with suggestions
router.post('/rewrite-resume', async (req, res) => {
  try {
    const { resumeText, jobRole, jobDescription, suggestions } = req.body;
    
    if (!resumeText || !jobRole || !jobDescription || !suggestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const rewrittenResume = await rewriteResumeWithSuggestions(resumeText, jobRole, jobDescription, suggestions);
    res.json({ rewrittenResume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to rewrite resume", error: error.message });
  }
});

// Endpoint to get recommendations for edited resume
router.post('/edit-recommendations', async (req, res) => {
  try {
    const { editedResumeText, jobRole, jobDescription } = req.body;

    if (!editedResumeText || !jobRole || !jobDescription) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const recommendations = await getResumeEditRecommendations(editedResumeText, jobRole, jobDescription);
    res.json({ recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get recommendations", error: error.message });
  }
});

// Endpoint to apply recommendation to resume
router.post('/apply-recommendation', async (req, res) => {
  try {
    const { resumeText, recommendation, jobRole, jobDescription } = req.body;

    if (!resumeText || !recommendation || !jobRole || !jobDescription) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedResume = await applyRecommendation(resumeText, recommendation, jobRole, jobDescription);
    res.json({ updatedResume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to apply recommendation", error: error.message });
  }
});

// Update analysis with edited resume
router.patch('/analysis/:analysisId', async (req, res) => {
  try {
    const { userEditedResume } = req.body;
    const analysis = await Analysis.findByIdAndUpdate(
      req.params.analysisId,
      { userEditedResume },
      { new: true }
    );
    
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }
    
    res.json({ success: true, analysis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update analysis", error: error.message });
  }
});

router.get('/roles', async (req, res) => {
  const roles = await IndustryKeyword.find().select('role');
  res.json(roles.map(r => r.role));
});

export default router;
