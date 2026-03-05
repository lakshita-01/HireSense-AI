import React, { useState } from 'react';
import ResumeUpload from './components/Upload/ResumeUpload';
import ScoreMeter from './components/Dashboard/ScoreMeter';
import AnalysisDetails from './components/Dashboard/AnalysisDetails';
import { Target, RotateCcw } from 'lucide-react';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex flex-col items-center py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Header */}
      <header className="text-center mb-12 relative z-10">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-3xl shadow-2xl shadow-indigo-300 transform hover:scale-110 transition-transform duration-300">
            <Target className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight mb-3">
          HireSense AI
        </h1>
        <p className="text-slate-600 font-medium max-w-2xl mx-auto text-lg">
          Production-grade ATS optimizer with semantic matching and LLM-powered recommendations.
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full flex flex-col items-center relative z-10">
        {!analysisResult ? (
          <ResumeUpload onAnalysisComplete={setAnalysisResult} />
        ) : (
          <div className="flex flex-col items-center w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 mb-8 overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
               <div className="flex justify-between items-start mb-6">
                 <h2 className="text-2xl font-bold text-gray-800">
                   Results for: <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{analysisResult.targetJobRole || analysisResult.role}</span>
                 </h2>
               </div>
               <ScoreMeter score={analysisResult.score} />
            </div>

            <AnalysisDetails data={analysisResult} />

            <button 
              onClick={() => setAnalysisResult(null)}
              className="mt-12 flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <RotateCcw className="w-5 h-5" /> Analyze Another Resume
            </button>
          </div>
        )}
      </main>

      <footer className="mt-20 text-slate-500 text-sm relative z-10">
        © 2024 HireSense AI • Built with Hugging Face & React
      </footer>
    </div>
  );
}

export default App;
