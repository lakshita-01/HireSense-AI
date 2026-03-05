import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import analysisRoutes from './routes/analysis.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api', analysisRoutes);

app.get('/health', (req, res) => res.send('API Running'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
