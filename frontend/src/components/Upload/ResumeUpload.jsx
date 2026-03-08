import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, Loader2, CheckCircle, Briefcase, Type, File, Sparkles, Zap, AlertCircle } from 'lucide-react';

const ResumeUpload = ({ onAnalysisComplete }) => {
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'paste'
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const ext = selectedFile.name.split('.').pop().toLowerCase();

      if (!['pdf', 'docx'].includes(ext)) {
        setError('Only PDF and DOCX files are supported');
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (uploadMode === 'file' && !file) {
      setError('Please upload a resume file');
      return;
    }

    if (uploadMode === 'paste' && !pastedText.trim()) {
      setError('Please paste your resume text');
      return;
    }

    if (!jobRole || !jobDescription) {
      setError('Please fill in job role and description');
      return;
    }

    setLoading(true);
    const formData = new FormData();

    if (uploadMode === 'file') {
      formData.append('resume', file);
    } else {
      formData.append('resumeText', pastedText);
    }

    formData.append('targetJobRole', jobRole);
    formData.append('jobDescription', jobDescription);

    try {
      const res = await axios.post('http://localhost:5000/api/analyze', formData);
      onAnalysisComplete(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong during analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 md:p-12 rounded-3xl max-w-4xl w-full border border-white/20 relative overflow-hidden group animate-reveal-up">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Top Glow Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-shift"></div>
      
      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-primary-500/30 rounded-tl-3xl"></div>
      <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-secondary-500/30 rounded-tr-3xl"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-secondary-500/30 rounded-bl-3xl"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-primary-500/30 rounded-br-3xl"></div>

      {/* Header Section */}
      <div className="flex items-center gap-4 mb-10 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
          <div className="relative p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/30">
            <FileText className="w-8 h-8 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Upload Your Resume
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">Get AI-powered insights in seconds</p>
        </div>
      </div>

      {/* Upload Mode Tabs - Enhanced */}
      <div className="flex gap-2 mb-8 bg-slate-900/50 p-2 rounded-2xl relative z-10 border border-white/10">
        <button
          onClick={() => setUploadMode('file')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
            uploadMode === 'file'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <File className="w-5 h-5" />
          <span>Upload File</span>
        </button>
        <button
          onClick={() => setUploadMode('paste')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
            uploadMode === 'paste'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Type className="w-5 h-5" />
          <span>Paste Text</span>
        </button>
      </div>

      <div className="space-y-6 relative z-10">
        {/* Job Role Input */}
        <div className="group/input">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
            <div className="p-1.5 bg-primary-500/20 rounded-lg">
              <Briefcase className="w-4 h-4 text-primary-400" />
            </div>
            Target Job Role
          </label>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g., Senior Full Stack Developer, Data Scientist"
            className="w-full p-5 bg-slate-900/50 border-2 border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white font-medium placeholder-slate-500 transition-all duration-300 hover:border-slate-600"
          />
        </div>

        {/* Job Description Input */}
        <div className="group/input">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
            <div className="p-1.5 bg-secondary-500/20 rounded-lg">
              <FileText className="w-4 h-4 text-secondary-400" />
            </div>
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the complete job description here..."
            rows={6}
            className="w-full p-5 bg-slate-900/50 border-2 border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white font-medium placeholder-slate-500 transition-all duration-300 hover:border-slate-600 resize-none custom-scrollbar"
          />
        </div>

        {/* File Upload / Paste Area */}
        {uploadMode === 'file' ? (
          <div
            className="border-2 border-dashed border-indigo-500/30 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gradient-to-br hover:from-indigo-500/10 hover:to-purple-500/10 hover:border-indigo-400/50 transition-all duration-300 group/upload"
            onClick={() => document.getElementById('resume-input').click()}
          >
            <input
              type="file"
              id="resume-input"
              className="hidden"
              accept=".pdf,.docx"
              onChange={handleFileChange}
            />
            {file ? (
              <div className="flex items-center gap-4 animate-scale-in">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full shadow-lg shadow-emerald-500/30">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg text-white block">{file.name}</span>
                  <span className="text-sm text-slate-400 font-medium">{(file.size / 1024).toFixed(2)} KB</span>
                </div>
              </div>
            ) : (
              <>
                <div className="relative mb-6 group-hover/upload:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative p-5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full border-2 border-indigo-400/30">
                    <Upload className="w-14 h-14 text-indigo-400" />
                  </div>
                </div>
                <p className="text-slate-300 font-bold text-center text-lg mb-2">
                  Click to upload your resume
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>PDF or DOCX (Max 10MB)</span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="group/input">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
              <div className="p-1.5 bg-accent-500/20 rounded-lg">
                <Type className="w-4 h-4 text-accent-400" />
              </div>
              Paste Resume Text
            </label>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your complete resume text here..."
              rows={12}
              className="w-full p-5 bg-slate-900/50 border-2 border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white font-medium placeholder-slate-500 transition-all duration-300 hover:border-slate-600 resize-none custom-scrollbar"
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-5 bg-red-500/10 border-l-4 border-red-500 rounded-2xl animate-scale-in flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleUpload}
          disabled={loading || (!file && !pastedText.trim()) || !jobRole || !jobDescription}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-6 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center transition-all duration-500 group/btn relative overflow-hidden"
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 blur-xl opacity-50 group-hover/btn:opacity-80 transition-opacity duration-500"></div>
          
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-3 w-6 h-6 relative z-10" />
              <span className="relative z-10">Analyzing & Tailoring Resume...</span>
            </>
          ) : (
            <>
              <Zap className="mr-3 w-5 h-5 relative z-10" />
              <span className="relative z-10">Generate Tailored Resume</span>
            </>
          )}
        </button>

        {/* Info Pills */}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full border border-slate-700/50">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-slate-400 font-medium">AI-Powered Analysis</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full border border-slate-700/50">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-400 font-medium">ATS Optimization</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full border border-slate-700/50">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400 font-medium">Instant Feedback</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
