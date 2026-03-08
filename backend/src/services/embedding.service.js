import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Use Hugging Face Inference API with proper endpoint
const HF_API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2";
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;

export const generateEmbeddings = async (text) => {
  try {
    const response = await axios.post(
      HF_API_URL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
          "X-Wait-For-Model": "true"
        },
        timeout: 30000
      }
    );
    // Hugging Face inference API returns the vector as nested array [[...]]
    // Extract the first element to get the actual vector
    const embedding = Array.isArray(response.data?.[0]) ? response.data[0] : response.data;
    return embedding;
  } catch (error) {
    if (error.response?.status === 410 || error.message.includes('no longer supported')) {
      // Fallback: return zero vector if API is unavailable
      console.warn("HF API unavailable, using fallback");
      return new Array(384).fill(0);
    }
    console.error("Embedding Error:", error.response?.data || error.message);
    // Return zero vector of appropriate size (384 for MiniLM)
    return new Array(384).fill(0);
  }
};
