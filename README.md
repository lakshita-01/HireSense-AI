# HireSense AI - Product-Ready ATS Architecture

HireSense AI is a state-of-the-art Applicant Tracking System (ATS) that uses semantic analysis and Large Language Models (LLMs) to bridge the gap between resumes and job descriptions.

## 🚀 Key Features
- **Semantic Scoring**: Uses `sentence-transformers` for vector similarity rather than simple keyword counting.
- **7-Factor Weighted Logic**: Calculates scores based on keywords, tech depth, impact metrics, and formatting.
- **AI-Powered Rewriting**: Uses Mistral-7B via Hugging Face to provide actionable X-Y-Z formula bullet points.
- **Free LLM Tier**: Integrated with Hugging Face Inference API (no credit cards or high costs).

## 🛠️ Prerequisites
- Node.js (v18+)
- MongoDB (running locally or via Atlas)
- A Free Hugging Face API Key (Get one at [hf.co/settings/tokens](https://huggingface.co/settings/tokens))

## ⚙️ Installation

### 1. Backend Setup
    cd backend
    npm install
    
Create a `.env` file in the `backend/` directory:
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/hiresense
    HUGGINGFACE_API_KEY=hf_your_key_here

Seed the database with industry keywords:
    npm run seed

Start the server:
    npm run dev

### 2. Frontend Setup
    cd frontend
    npm install
    npm run dev

## 🚢 How to Run
1. Ensure MongoDB is running: `mongod`
2. Start Backend: `node backend/src/index.js`
3. Start Frontend: `npm run dev` in the frontend folder.
4. Upload a 1-page PDF resume and select "Backend Developer" or "Data Scientist".

## 📊 Evaluation Logic
The ATS score is calculated using the following weights:
- **35% Keyword Match**: Raw frequency of industry-standard tech stack.
- **25% Semantic Similarity**: Contextual overlap using vector embeddings.
- **15% Impact Metrics**: Presence of quantitative data (%, $, numbers).
- **15% Tech Depth**: Evaluation of senior-level terminology.
- **10% Formatting**: Evaluation of PDF structure compatibility.

## 📁 Project Structure
- `backend/src/services/embedding.service.js`: Vector generation.
- `backend/src/services/ai.service.js`: Mistral LLM integration for resume tips.
- `backend/src/utils/similarity.js`: Pure mathematical cosine similarity implementation.
- `frontend/src/components/Dashboard/ScoreMeter.jsx`: Recharts visual gauge.

## 💡 Troubleshooting
- **API Timeout**: Hugging Face free models can "sleep". If you get an error the first time, wait 30 seconds for the model to load and try again.
- **PDF Extraction**: Ensure the PDF is text-based (not scanned images).

