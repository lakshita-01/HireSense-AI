import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { IndustryKeyword } from '../models/IndustryKeyword.js';

dotenv.config();

const seedData = [
  {
    role: "Backend Developer",
    keywords: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Redis", "Docker", "Kubernetes", "Microservices", "REST API", "System Design", "AWS", "CI/CD"],
    weightage: { "System Design": 1.5, "Node.js": 1.2 }
  },
  {
    role: "Frontend Developer",
    keywords: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "GraphQL", "Web Performance", "Testing", "Webpack", "Responsive Design", "Accessibility"],
    weightage: { "React": 1.5, "Next.js": 1.3 }
  },
  {
    role: "Data Scientist",
    keywords: ["Python", "Pandas", "Scikit-Learn", "PyTorch", "TensorFlow", "SQL", "Statistics", "Machine Learning", "NLP", "Data Visualization", "Matplotlib"],
    weightage: { "Machine Learning": 1.5, "Python": 1.2 }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await IndustryKeyword.deleteMany({});
    await IndustryKeyword.insertMany(seedData);
    console.log("Database Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedDB();
