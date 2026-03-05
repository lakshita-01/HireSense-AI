import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

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
          "Content-Type": "application/json"
        } 
      }
    );
    // Hugging Face inference API returns the vector directly for this model
    return response.data;
  } catch (error) {
    console.error("Embedding Error:", error.response?.data || error.message);
    // Return zero vector of appropriate size (384 for MiniLM)
    return new Array(384).fill(0);
  }
};
