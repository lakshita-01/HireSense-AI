import React, { useState } from 'react';
import ResumeUpload from './components/Upload/ResumeUpload';
import ScoreMeter from './components/Dashboard/ScoreMeter';
import AnalysisDetails from './components/Dashboard/AnalysisDetails';
import ThreeBackground from './components/ThreeBackground';
import { Target, RotateCcw, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex flex-col items-center py-12 px-4 relative overflow-hidden">
      {/* 3D Animated Background */}
      <ThreeBackground />

      {/* Ambient Light Overlays */}
      <div className="absolute inset-0 bg-gradient-radial opacity-30 pointer-events-none"></div>

      {/* Animated Gradient Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-primary-600/10 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-gradient-to-tl from-secondary-600/10 to-transparent rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Animated Blobs */}
      <div
        className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"
      ></div>
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"
      ></div>
      <div
        className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"
      ></div>

      {/* Header */}
      <header className="text-center mb-12 relative z-10 animate-reveal-up">
        {/* Logo with Enhanced Effects */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative group">
            {/* Glow Ring */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-pulse-glow"></div>
            
            {/* Icon Container */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 rounded-3xl shadow-2xl shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Target className="w-16 h-16 text-white" />
              
              {/* Sparkle Effects */}
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-bounce-slow" />
              <Zap className="absolute -bottom-2 -left-2 w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title with Enhanced Gradient */}
        <h1 className="text-5xl md:text-8xl font-black text-gradient-animated tracking-tight mb-6 drop-shadow-2xl">
          HireSense AI
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 font-medium max-w-2xl mx-auto text-lg md:text-xl leading-relaxed animate-fade-in-up">
          Production-grade <span className="text-primary-400 font-semibold">ATS optimizer</span> with{" "}
          <span className="text-secondary-400 font-semibold">semantic matching</span> and{" "}
          <span className="text-accent-400 font-semibold">LLM-powered</span> recommendations.
        </p>

        {/* Feature Pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-primary-500/30 hover:border-primary-500/50 transition-colors duration-300">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-slate-200 font-medium">AI-Powered Analysis</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-secondary-500/30 hover:border-secondary-500/50 transition-colors duration-300">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-slate-200 font-medium">99% Accuracy</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-accent-500/30 hover:border-accent-500/50 transition-colors duration-300">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-200 font-medium">Real-time Scoring</span>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full flex flex-col items-center relative z-10">
        {!analysisResult ? (
          <div className="animate-reveal-up w-full max-w-4xl">
            <ResumeUpload onAnalysisComplete={setAnalysisResult} />
          </div>
        ) : (
          <div className="flex flex-col items-center w-full max-w-6xl animate-reveal-scale">
            {/* Results Card */}
            <div className="glass-card p-10 rounded-3xl w-full max-w-md mb-8 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
              {/* Animated Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Top Border Line */}
              <div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-shift"
              ></div>

              {/* Corner Accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary-500/50 rounded-tl-lg"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-secondary-500/50 rounded-tr-lg"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-secondary-500/50 rounded-bl-lg"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary-500/50 rounded-br-lg"></div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <h2 className="text-2xl font-bold text-white">
                  Results for: <span className="text-gradient">{analysisResult.targetJobRole || analysisResult.role}</span>
                </h2>
              </div>

              <ScoreMeter score={analysisResult.score} />
            </div>

            <AnalysisDetails data={analysisResult} />

            {/* Reset Button */}
            <button
              onClick={() => setAnalysisResult(null)}
              className="mt-12 group relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-500 overflow-hidden"
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              <RotateCcw className="w-6 h-6 relative z-10 group-hover:-rotate-180 transition-transform duration-500" />
              <span className="relative z-10">Analyze Another Resume</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 text-slate-400 text-sm relative z-10 glass-light rounded-2xl p-6 border border-white/10 w-full max-w-4xl animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-medium">© 2024 HireSense AI</span>
            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
            <span className="font-medium">Built with Hugging Face & React</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-emerald-400 font-semibold">All systems operational</span>
          </div>
        </div>
      </footer>

      {/* Noise texture overlay */}
      <div className="noise-overlay"></div>
    </div>
  );
}

export default App;

