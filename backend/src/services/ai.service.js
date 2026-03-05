import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HF_LLM_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;

export const getAIAnalysis = async (resumeText, jobKeywords) => {
  const prompt = `[INST] You are a Senior ATS Specialist. Analyze this resume against these keywords: ${jobKeywords.join(', ')}. 
  Resume Text: ${resumeText.substring(0, 2000)}
  Provide 3 concise, high-impact bullet points for improvement using the X-Y-Z formula. 
  Keep response very brief. [/INST]`;

  try {
    const response = await axios.post(
      HF_LLM_URL,
      { 
        inputs: prompt,
        parameters: { max_new_tokens: 250, temperature: 0.7 }
      },
      { headers: { Authorization: `Bearer ${HF_TOKEN}` } }
    );
    
    const text = response.data[0]?.generated_text || "";
    const cleaned = text.split('[/INST]').pop().trim();
    return cleaned.split('\n').filter(line => line.length > 5).slice(0, 3);
  } catch (error) {
    console.error("AI Analysis Error:", error.message);
    return ["Optimize your bullet points with measurable metrics.", "Increase keyword frequency for target role.", "Ensure clean PDF formatting."];
  }
};

export const generateTailoredResume = async (resumeText, jobRole, jobDescription) => {
  const prompt = `[INST] You are an expert resume writer. Analyze this resume and the job description provided, then suggest how to tailor the resume to better match the target role.

Job Title: ${jobRole}
Job Description: ${jobDescription.substring(0, 1500)}

Current Resume: ${resumeText.substring(0, 2000)}

Provide specific suggestions for tailoring the resume to this role, focusing on:
1. Key experiences to highlight
2. Skills to emphasize or add
3. Ways to reframe achievements for this specific role

Format your response with clear sections and actionable advice. [/INST]`;

  try {
    const response = await axios.post(
      HF_LLM_URL,
      { 
        inputs: prompt,
        parameters: { max_new_tokens: 600, temperature: 0.7 }
      },
      { headers: { Authorization: `Bearer ${HF_TOKEN}` } }
    );
    
    const text = response.data[0]?.generated_text || "";
    return text.split('[/INST]').pop().trim();
  } catch (error) {
    console.error("Tailored Resume Error:", error.message);
    return "Unable to generate tailored resume suggestions at this time.";
  }
};

export const generateCoverLetter = async (resumeText, jobRole, jobDescription, candidateName = "Candidate") => {
  const prompt = `[INST] You are an expert cover letter writer. Write a professional cover letter for the following job opportunity.

Job Title: ${jobRole}
Job Description: ${jobDescription.substring(0, 1500)}

Candidate Resume Summary: ${resumeText.substring(0, 1500)}

Write a compelling cover letter that:
1. Opens with a strong hook showing enthusiasm for the role
2. Highlights relevant experience from the resume
3. Connects achievements to the job requirements
4. Shows understanding of the company/role needs
5. Closes with a call to action

Keep it professional and concise (300-400 words). [/INST]`;

  try {
    const response = await axios.post(
      HF_LLM_URL,
      { 
        inputs: prompt,
        parameters: { max_new_tokens: 700, temperature: 0.7 }
      },
      { headers: { Authorization: `Bearer ${HF_TOKEN}` } }
    );
    
    const text = response.data[0]?.generated_text || "";
    const letterContent = text.split('[/INST]').pop().trim();
    return `Dear Hiring Manager,\n\n${letterContent}\n\nBest regards,\n${candidateName}`;
  } catch (error) {
    console.error("Cover Letter Error:", error.message);
    return "Unable to generate cover letter at this time.";
  }
};
