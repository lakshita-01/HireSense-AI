import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, Loader2, CheckCircle, Briefcase } from 'lucide-react';

const ResumeUpload = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file || !jobRole || !jobDescription) {
      setError('Please fill all fields: resume, job role, and job description');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
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
    <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl max-w-3xl w-full border border-white/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Upload Your Resume
        </h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            Target Job Role
          </label>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g., Senior Full Stack Developer, Data Scientist, Product Manager"
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white font-medium text-gray-700 transition-all hover:border-indigo-300"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <FileText className="w-4 h-4 text-indigo-600" />
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the complete job description here for tailored resume analysis and optimization..."
            rows={8}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white font-medium text-gray-700 transition-all hover:border-indigo-300 resize-none"
          />
        </div>

        <div 
          className="border-2 border-dashed border-indigo-300 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 hover:border-indigo-400 group"
          onClick={() => document.getElementById('resume-input').click()}
        >
          <input 
            type="file" 
            id="resume-input" 
            className="hidden" 
            accept=".pdf"
            onChange={handleFileChange}
          />
          {file ? (
            <div className="flex items-center text-indigo-600 animate-in fade-in">
              <div className="p-2 bg-green-100 rounded-full mr-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <span className="font-semibold text-lg">{file.name}</span>
            </div>
          ) : (
            <>
              <div className="p-4 bg-indigo-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-12 h-12 text-indigo-600" />
              </div>
              <p className="text-gray-600 font-semibold text-center text-lg">
                Click to upload your resume
              </p>
              <p className="text-sm text-gray-400 mt-2">PDF Files Only (Max 10MB)</p>
            </>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-in fade-in">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !file || !jobRole || !jobDescription}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-3 w-6 h-6" />
              Analyzing & Tailoring Resume...
            </>
          ) : (
            <>
              <Upload className="mr-3 w-5 h-5" />
              Generate Tailored Resume
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;
