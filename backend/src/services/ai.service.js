import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Call Groq API (Primary - fast and reliable)
const callGroqAPI = async (systemPrompt, userPrompt, maxTokens = 1000, temperature = 0.7) => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: maxTokens,
        temperature: temperature
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );
    return response.data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);
    return "";
  }
};

// Extract key details from resume
const extractResumeDetails = (resumeText) => {
  const lines = resumeText.split('\n').filter(line => line.trim().length > 0);
  let name = "Candidate";
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.match(/^[A-Z][a-z]+(\s+[A-Z][a-z]+)?$/) && trimmed.length < 50 && !trimmed.includes('@') && !trimmed.match(/\d/)) {
      name = trimmed;
      break;
    }
  }

  const email = resumeText.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || "";
  const phone = resumeText.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/)?.[0] || "";
  
  // Extract ALL links from resume
  const urlPattern = /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/gi;
  const allLinks = resumeText.match(urlPattern) || [];
  const linkedin = allLinks.find(link => link.includes('linkedin')) || "";
  const github = allLinks.find(link => link.includes('github')) || "";
  const portfolio = allLinks.find(link => !link.includes('linkedin') && !link.includes('github')) || "";

  const educationMatch = resumeText.match(/((?:Bachelor|Master|PhD|B\.?E\.?|B\.?Tech|M\.?Tech|M\.?S|M\.?B\.?A)[^.\n]*(?:University|Institute|College|Technology)?[^.\n]*\.?)/i);
  const education = educationMatch ? educationMatch[1].trim() : "";
  
  const expMatch = resumeText.match(/(\d+\+?\s*(?:years?|yrs?))\s*(?:of\s*)?(?:experience|exp)/i);
  const experience = expMatch ? expMatch[0] : "";

  let skills = "";
  const skillsSectionMatch = resumeText.match(/(?:Skills|Technical Skills|Core Competencies|Expertise)[:\s]*([\s\S]*?)(?=\n\s*(?:Education|Experience|Work|Project|Achievement|$))/i);
  if (skillsSectionMatch) {
    skills = skillsSectionMatch[1].trim().split('\n').slice(0, 5).join('; ');
  }

  const achievements = [];
  const achievementPatterns = [
    /(?:achieved|accomplished|attained)[^.\n]*(?:\d+%|\$\d+|\d+\s*(?:users|clients|projects|teams?))/gi,
    /(?:increased|improved|enhanced|optimized)[^.\n]*(?:\d+%|\$\d+|by\s+\d+)/gi,
    /(?:reduced|decreased|minimized)[^.\n]*(?:\d+%|\$\d+|by\s+\d+)/gi,
    /(?:led|managed|directed)[^.\n]*(?:team|group|project|initiative)[^.\n]*(?:\d+\s*(?:members|people|clients))?/gi,
    /(?:developed|created|built|implemented)[^.\n]*(?:system|platform|solution|application|product)[^.\n]*(?:using|with)?/gi
  ];

  for (const pattern of achievementPatterns) {
    const matches = resumeText.match(pattern);
    if (matches) {
      achievements.push(...matches.slice(0, 2));
    }
  }

  let currentRole = "";
  const rolePatterns = [
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Engineer|Developer|Manager|Lead|Architect|Scientist|Analyst|Designer|Director|VP|Chief|Head|Principal|Senior|Junior|Staff|Consultant))/
  ];
  for (const pattern of rolePatterns) {
    const match = resumeText.match(pattern);
    if (match) {
      currentRole = match[1] || match[0];
      break;
    }
  }

  let projects = "";
  const projectSection = resumeText.match(/(?:Projects|Key Projects|Selected Projects)[:\s]*([\s\S]*?)(?=\n\s*(?:Education|Skills|Experience|Achievements|$))/i);
  if (projectSection) {
    projects = projectSection[1].trim().split('\n').slice(0, 3).join('; ');
  }

  return {
    name, email, phone, education, experience, skills,
    achievements: [...new Set(achievements)].slice(0, 5),
    currentRole,
    linkedin, github, portfolio, allLinks,
    projects
  };
};

export const getAIAnalysis = async (resumeText, jobKeywords) => {
  const systemPrompt = "You are a Senior ATS Specialist. Provide 3 concise, high-impact bullet points for resume improvement using the X-Y-Z formula (Accomplished [X] as measured by [Y] by doing [Z]). Keep each point under 20 words.";
  const userPrompt = `Analyze this resume against these keywords: ${jobKeywords.join(', ')}.\n\nResume: ${resumeText.substring(0, 2000)}`;

  const groqResponse = await callGroqAPI(systemPrompt, userPrompt, 300);
  if (groqResponse) {
    return groqResponse.split('\n').filter(line => line.trim().length > 10).map(line => line.replace(/^[\d\-\*•]+\s*/, '').trim()).slice(0, 3);
  }

  return ["Optimize your bullet points with measurable metrics.", "Increase keyword frequency for target role.", "Ensure clean PDF formatting."];
};

export const generateTailoredResume = async (resumeText, jobRole, jobDescription) => {
  const resumeDetails = extractResumeDetails(resumeText);
  
  const systemPrompt = "You are an expert resume writer. Provide CONCISE, actionable suggestions to tailor a resume for a specific job. Focus on projects, skills, and achievements. Keep it under 500 words.";
  const userPrompt = `Job Title: ${jobRole}
Job Description: ${jobDescription.substring(0, 1500)}
Candidate Details:
- Current Role: ${resumeDetails.currentRole}
- Skills: ${resumeDetails.skills}
- Projects: ${resumeDetails.projects}
- Achievements: ${resumeDetails.achievements.join('; ')}

Provide specific, concise suggestions for tailoring the resume to this role. Focus on highlighting relevant projects, skills, and achievements.`;

  const groqResponse = await callGroqAPI(systemPrompt, userPrompt, 800);
  if (groqResponse && groqResponse.length > 50) return groqResponse;

  return generateFallbackTailoredResume(jobRole, jobDescription);
};

const generateFallbackTailoredResume = (jobRole, jobDescription) => {
  const keywords = jobDescription.split(' ').filter(w => w.length > 5).slice(0, 10).join(', ');
  return `TAILORED RESUME SUGGESTIONS FOR: ${jobRole}\n\n1. HIGHLIGHT RELEVANT EXPERIENCE\n   - Emphasize projects aligning with: ${keywords}\n   - Quantify achievements with metrics (%, $, numbers)\n\n2. OPTIMIZE SKILLS SECTION\n   - Add key technologies from job description\n   - Group skills by category\n\n3. REFRAME ACHIEVEMENTS\n   - Use X-Y-Z formula\n   - Focus on impact and results\n\n4. KEYWORDS TO INCLUDE: ${keywords}`;
};

export const generateCoverLetter = async (resumeText, jobRole, jobDescription, candidateName = "") => {
  const resumeDetails = extractResumeDetails(resumeText);
  
  const systemPrompt = "You are an expert cover letter writer. Write a personalized, compelling cover letter using ONLY verified details from the resume. Format as a professional business letter. Keep it under 300 words.";
  const userPrompt = `JOB TARGET: ${jobRole}
JOB DESCRIPTION: ${jobDescription.substring(0, 1500)}
CANDIDATE'S VERIFIED DETAILS:
- Name: ${resumeDetails.name || candidateName}
- Current Role: ${resumeDetails.currentRole}
- Skills: ${resumeDetails.skills}
- Achievements: ${resumeDetails.achievements.join('; ')}
- Projects: ${resumeDetails.projects}
Contact: ${resumeDetails.email} | ${resumeDetails.phone}
Links: ${resumeDetails.linkedin} | ${resumeDetails.github}

Write a compelling cover letter mentioning 1-2 specific achievements. Connect their skills to job requirements.`;

  const groqResponse = await callGroqAPI(systemPrompt, userPrompt, 800);
  if (groqResponse && groqResponse.length > 100) {
    let letter = groqResponse.trim();
    if (!letter.toLowerCase().startsWith('dear')) letter = `Dear Hiring Manager,\n\n${letter}`;
    if (!letter.toLowerCase().includes('best regards')) letter = `${letter}\n\nBest regards,\n${resumeDetails.name || candidateName}`;
    return letter;
  }

  return generateFallbackCoverLetter(jobRole, candidateName || resumeDetails.name, resumeDetails);
};

const generateFallbackCoverLetter = (jobRole, candidateName, resumeDetails = {}) => {
  const { achievements = [], skills = '', currentRole = '' } = resumeDetails;
  return `Dear Hiring Manager,\n\nI am writing to express my enthusiastic interest in the ${jobRole} position. ${currentRole ? `As a ${currentRole} ` : ''}with a strong track record, I am excited about this opportunity.\n\n${achievements.length > 0 ? `In my recent work, I ${achievements[0]}.` : ''}\n\nMy expertise in ${skills || 'relevant technologies'} aligns well with this role's requirements.\n\nI would welcome the opportunity to discuss how my background aligns with your needs.\n\nBest regards,\n${candidateName}`;
};

// Rewrite resume with suggestions - PRESERVES LINKS, PROPER ATS FORMAT
export const rewriteResumeWithSuggestions = async (resumeText, jobRole, jobDescription, suggestions) => {
  const resumeDetails = extractResumeDetails(resumeText);
  
  const systemPrompt = `You are an expert ATS resume writer. Rewrite resumes following STRICT ATS FORMAT:
1. HEADER: Name | Email | Phone | LinkedIn | GitHub | Portfolio
2. PROFESSIONAL SUMMARY: 3-4 lines max
3. SKILLS: Categorized, relevant to target job
4. WORK EXPERIENCE: Reverse chronological, X-Y-Z formula bullets
5. PROJECTS: Only relevant ones with links
6. EDUCATION: Degree, University
7. CERTIFICATIONS: If any

CRITICAL: PRESERVE ALL LINKS from original resume. Keep it concise (max 2 pages). Use action verbs. Quantify achievements. Include job description keywords naturally. DO NOT invent experiences.`;

  const userPrompt = `JOB TARGET: ${jobRole}
JOB DESCRIPTION: ${jobDescription.substring(0, 1500)}
SUGGESTIONS TO IMPLEMENT: ${suggestions}

ORIGINAL RESUME:
${resumeText.substring(0, 3500)}

CANDIDATE DETAILS TO PRESERVE:
- Name: ${resumeDetails.name}
- Email: ${resumeDetails.email}
- Phone: ${resumeDetails.phone}
- LinkedIn: ${resumeDetails.linkedin}
- GitHub: ${resumeDetails.github}
- Portfolio: ${resumeDetails.portfolio}
- ALL LINKS: ${resumeDetails.allLinks.join(', ')}
- Current Role: ${resumeDetails.currentRole}
- Skills: ${resumeDetails.skills}
- Projects: ${resumeDetails.projects}
- Achievements: ${resumeDetails.achievements.join('; ')}

Rewrite this resume in proper ATS format order. PRESERVE ALL LINKS. Keep it focused and concise.`;

  const groqResponse = await callGroqAPI(systemPrompt, userPrompt, 2000);
  
  if (groqResponse && groqResponse.length > 200) {
    let rewritten = groqResponse.trim();
    
    // Ensure links are preserved
    if (resumeDetails.email && !rewritten.includes(resumeDetails.email)) {
      rewritten = `${resumeDetails.name}\n${resumeDetails.email}${resumeDetails.phone ? ' | ' + resumeDetails.phone : ''}\n${resumeDetails.linkedin}${resumeDetails.github ? '\n' + resumeDetails.github : ''}${resumeDetails.portfolio ? '\n' + resumeDetails.portfolio : ''}\n\n${rewritten}`;
    }
    return rewritten;
  }

  return resumeText;
};

// Get real-time recommendations for edited resume
export const getResumeEditRecommendations = async (editedResumeText, jobRole, jobDescription) => {
  const systemPrompt = "You are an ATS optimization expert. Provide 5 specific, actionable recommendations to improve resumes. Keep each under 20 words. Be specific.";
  const userPrompt = `JOB TARGET: ${jobRole}\nJOB DESCRIPTION: ${jobDescription.substring(0, 1000)}\nEDITED RESUME: ${editedResumeText.substring(0, 2000)}`;

  const groqResponse = await callGroqAPI(systemPrompt, userPrompt, 500);
  if (groqResponse) {
    return groqResponse.split('\n').filter(line => line.trim().length > 10).map(line => line.replace(/^[\d\-\*•]+\s*/, '').trim()).filter(line => line.length > 15).slice(0, 5);
  }

  return ["Add more quantifiable metrics to your achievements", "Include keywords from the job description", "Strengthen action verbs in bullet points", "Highlight relevant technical skills", "Ensure clear section headers"];
};

// Apply recommendation to resume
export const applyRecommendation = async (resumeText, recommendation, jobRole, jobDescription) => {
  const systemPrompt = "You are an expert resume editor. Apply this specific recommendation to the resume. Return ONLY the modified resume section, nothing else.";
  const userPrompt = `RESUME:\n${resumeText.substring(0, 2000)}\n\nRECOMMENDATION TO APPLY: ${recommendation}\n\nJOB TARGET: ${jobRole}\n\nApply this recommendation and return the improved resume content.`;

  const groqResponse = await callGroqAPI(systemPrompt, userPrompt, 1500);
  return groqResponse || resumeText;
};
