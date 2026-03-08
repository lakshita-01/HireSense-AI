import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Lightbulb, TrendingUp, FileText, Mail, Copy, Check, Sparkles, Download, Zap, Star, Award, Wand2, Edit3, Loader2 } from 'lucide-react';
import axios from 'axios';
import ResumeEditor from './ResumeEditor';

const AnalysisDetails = ({ data }) => {
  const [copiedItem, setCopiedItem] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [rewrittenResume, setRewrittenResume] = useState(null);
  const [rewriting, setRewriting] = useState(false);
  const [userEditedResume, setUserEditedResume] = useState(null);

  const chartData = Object.entries(data.breakdown).map(([key, val]) => ({
    name: key.replace(/([A-Z])/g, ' $1').trim(),
    score: val
  }));

  const handleCopy = (text, itemName) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleRewriteResume = async () => {
    setRewriting(true);
    try {
      // Get suggestions from the analysis
      const suggestions = data.recommendations.join('\n');
      
      // Use the original resume text from the analysis data
      const resumeTextToUse = data.originalResumeText;
      
      if (!resumeTextToUse) {
        alert('Original resume text not available. Please try uploading your resume again.');
        setRewriting(false);
        return;
      }
      
      console.log('Rewriting resume with:', { 
        resumeTextLength: resumeTextToUse?.length,
        jobRole: data.targetJobRole || data.role,
        hasJobDescription: !!data.jobDescription,
        suggestionsCount: data.recommendations.length
      });

      const res = await axios.post('http://localhost:5000/api/rewrite-resume', {
        resumeText: resumeTextToUse,
        jobRole: data.targetJobRole || data.role,
        jobDescription: data.jobDescription,
        suggestions: suggestions
      });
      
      if (!res.data.rewrittenResume || res.data.rewrittenResume.length < 100) {
        throw new Error('Invalid response from server');
      }
      
      setRewrittenResume(res.data.rewrittenResume);
      setShowEditor(true);
    } catch (error) {
      console.error('Failed to rewrite resume:', error);
      alert('Failed to rewrite resume. Please try again. Make sure you uploaded a valid resume file.');
    } finally {
      setRewriting(false);
    }
  };

  const handleSaveEditedResume = async (editedContent) => {
    try {
      setUserEditedResume(editedContent);
      
      // Save to backend
      await axios.patch(`http://localhost:5000/api/analysis/${data._id}`, {
        userEditedResume: editedContent
      });
      
      console.log('Saved edited resume successfully');
    } catch (error) {
      console.error('Failed to save edited resume:', error);
      throw error;
    }
  };

  const handleDownloadRewritten = (format) => {
    const contentToDownload = userEditedResume || rewrittenResume || data.tailoredResumeContent;
    
    try {
      const blob = new Blob([contentToDownload], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume-${jobRole?.replace(/\s+/g, '-').toLowerCase() || 'tailored'}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download. Please copy the content manually.');
    }
  };

  return (
    <div className="w-full max-w-6xl space-y-8 animate-reveal-up">
      {/* Score Breakdown and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Breakdown Card */}
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden group hover:shadow-indigo-500/20 transition-all duration-500 animate-reveal-left">
          {/* Top Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-shift"></div>
          
          {/* Background Glow */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/15 transition-all duration-700"></div>

          {/* Header */}
          <h3 className="text-2xl font-bold mb-8 flex items-center text-white relative z-10">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mr-3 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span>Factor <span className="text-gradient">Breakdown</span></span>
          </h3>
          
          {/* Chart */}
          <div className="h-72 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={150} 
                  tick={{ fontSize: 13, fontWeight: 600, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    padding: '12px 16px',
                    color: 'white',
                    fontWeight: '600'
                  }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.15)' }}
                />
                <Bar dataKey="score" radius={[0, 12, 12, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.score > 70 ? 'url(#barGradient)' : '#475569'}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Bottom Stats */}
          <div className="mt-6 pt-6 border-t border-white/10 relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-slate-400 font-medium">Based on ATS algorithms</span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {chartData.length} factors analyzed
            </div>
          </div>
        </div>

        {/* AI Recommendations Card */}
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden group hover:shadow-amber-500/20 transition-all duration-500 animate-reveal-right">
          {/* Top Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 animate-gradient-shift"></div>
          
          {/* Background Glow */}
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/15 transition-all duration-700"></div>

          {/* Header */}
          <h3 className="text-2xl font-bold mb-8 flex items-center text-white relative z-10">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mr-3 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <span>AI <span className="text-gradient">Recommendations</span></span>
          </h3>
          
          {/* Recommendations List */}
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar relative z-10">
            {data.recommendations.map((rec, idx) => (
              <div 
                key={idx} 
                className="flex items-start p-5 glass-light rounded-2xl border border-amber-400/20 hover:shadow-xl hover:shadow-amber-500/10 hover:scale-[1.02] hover:border-amber-400/40 transition-all duration-300 group/item"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="p-2.5 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl mr-3 mt-0.5 shrink-0 group-hover/item:from-amber-500/30 group-hover/item:to-orange-500/30 transition-colors">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-slate-200 text-sm font-medium leading-relaxed flex-1">{rec}</p>
              </div>
            ))}
          </div>
          
          {/* Powered By */}
          <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <p className="text-xs text-slate-400 font-semibold">
                Powered by <span className="text-purple-400">Mistral-7B</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations Section */}
      {data.tailoredResumeContent && (
        <div className="glass-card p-10 rounded-3xl relative overflow-hidden group hover:shadow-amber-500/20 transition-all duration-500 animate-reveal-up">
          {/* Top Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 animate-gradient-shift"></div>

          {/* Background Glow */}
          <div className="absolute -left-32 -top-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/15 transition-all duration-700"></div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 relative z-10">
            <h3 className="text-3xl font-bold flex items-center text-white">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mr-4 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <span>AI <span className="text-gradient">Recommendations</span></span>
            </h3>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleRewriteResume}
                disabled={rewriting}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                {rewriting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Wand2 className="w-5 h-5" />
                )}
                {rewriting ? 'Rewriting...' : 'AI Rewrite Resume'}
              </button>
              <button
                onClick={() => setShowEditor(true)}
                className="flex items-center gap-2 px-5 py-3 glass text-slate-300 rounded-xl font-bold text-sm hover:bg-white/15 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <Edit3 className="w-5 h-5" />
                Edit & Optimize
              </button>
              <button
                onClick={() => handleCopy(data.tailoredResumeContent, 'suggestions')}
                className="flex items-center gap-2 px-5 py-3 glass text-slate-300 rounded-xl font-bold text-sm hover:bg-white/15 hover:text-white transition-all duration-300 hover:scale-105"
              >
                {copiedItem === 'suggestions' ? (
                  <><Check className="w-5 h-5 text-emerald-400" /> Copied!</>
                ) : (
                  <><Copy className="w-5 h-5" /> Copy Suggestions</>
                )}
              </button>
            </div>
          </div>

          {/* Recommendations Content */}
          <div className="glass-light rounded-2xl p-8 max-h-[400px] overflow-y-auto custom-scrollbar border border-white/10 relative z-10 group/content">
            <pre className="whitespace-pre-wrap text-sm text-slate-200 font-sans leading-relaxed">
              {data.tailoredResumeContent}
            </pre>
          </div>

          {/* Info Banner */}
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/20 rounded-xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-300 font-medium">How to Use These Recommendations</p>
              <p className="text-xs text-slate-400 mt-1">
                Review these AI-powered suggestions above, then click <strong className="text-amber-400">"AI Rewrite Resume"</strong> to automatically apply them, or <strong className="text-amber-400">"Edit & Optimize"</strong> to manually edit your resume with real-time AI recommendations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Your Uploaded Resume Section */}
      {data.originalResumeText && (
        <div className="glass-card p-10 rounded-3xl relative overflow-hidden group hover:shadow-indigo-500/20 transition-all duration-500 animate-reveal-up">
          {/* Top Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-shift"></div>

          {/* Background Glow */}
          <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700"></div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 relative z-10">
            <h3 className="text-3xl font-bold flex items-center text-white">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mr-4 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <span>Your <span className="text-gradient">Uploaded Resume</span></span>
            </h3>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCopy(data.originalResumeText, 'original')}
                className="flex items-center gap-2 px-5 py-3 glass text-slate-300 rounded-xl font-bold text-sm hover:bg-white/15 hover:text-white transition-all duration-300 hover:scale-105"
              >
                {copiedItem === 'original' ? (
                  <><Check className="w-5 h-5 text-emerald-400" /> Copied!</>
                ) : (
                  <><Copy className="w-5 h-5" /> Copy</>
                )}
              </button>
              <button
                onClick={() => setShowEditor(true)}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300"
              >
                <Edit3 className="w-5 h-5" />
                Edit This Resume
              </button>
            </div>
          </div>

          {/* Resume Content */}
          <div className="glass-light rounded-2xl p-8 max-h-[500px] overflow-y-auto custom-scrollbar border border-white/10 relative z-10 group/content">
            <pre className="whitespace-pre-wrap text-sm text-slate-200 font-sans leading-relaxed">
              {data.originalResumeText}
            </pre>
          </div>

          {/* Info Banner */}
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-400/20 rounded-xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-300 font-medium">Reference Document</p>
              <p className="text-xs text-slate-400 mt-1">
                This is your original uploaded resume. Use it as a reference while reviewing the AI recommendations above. Click <strong className="text-indigo-400">"Edit This Resume"</strong> to start optimizing it.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resume Editor */}
      {showEditor && (
        <div className="space-y-6">
          <ResumeEditor
            initialContent={userEditedResume || rewrittenResume || data.tailoredResumeContent}
            jobRole={data.targetJobRole || data.role}
            jobDescription={data.jobDescription}
            originalResumeText={data.originalResumeText}
            onSave={handleSaveEditedResume}
            onClose={() => setShowEditor(false)}
            analysisId={data._id}
          />
          
          {/* Download Section - All Download Options for Rewritten Resume */}
          {(userEditedResume || rewrittenResume) && (
            <div className="glass-card p-8 rounded-3xl relative overflow-hidden animate-reveal-up border-2 border-emerald-500/30">
              {/* Top Gradient Line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-gradient-shift"></div>
              
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 relative z-10">
                <h4 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/30">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <span>Download Your <span className="text-gradient">Optimized Resume</span></span>
                </h4>
              </div>
              
              <div className="flex flex-wrap gap-4 relative z-10">
                <button
                  onClick={() => handleDownloadRewritten('txt')}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-base hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300"
                >
                  <Download className="w-6 h-6" />
                  Download as Text
                </button>
                <a
                  href={`http://localhost:5000/api/download/resume/${data._id}/pdf`}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-bold text-base hover:shadow-2xl hover:shadow-red-500/40 hover:scale-105 transition-all duration-300"
                >
                  <Download className="w-6 h-6" />
                  Download as PDF
                </a>
                <a
                  href={`http://localhost:5000/api/download/resume/${data._id}/docx`}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-base hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
                >
                  <Download className="w-6 h-6" />
                  Download as DOCX
                </a>
              </div>
              
              {/* Info Cards */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                <div className="p-4 bg-emerald-500/10 border border-emerald-400/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-emerald-400">Text Format</span>
                  </div>
                  <p className="text-xs text-slate-400">Perfect for copying into online job application forms and text fields.</p>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-400/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-red-400">PDF Format</span>
                  </div>
                  <p className="text-xs text-slate-400">Best for emailing to recruiters and maintaining formatting.</p>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-blue-400">DOCX Format</span>
                  </div>
                  <p className="text-xs text-slate-400">Editable format for making final adjustments in Word or Google Docs.</p>
                </div>
              </div>
              
              <p className="mt-6 text-xs text-slate-400 text-center relative z-10">
                💡 <strong>Pro Tip:</strong> Download in all formats to have options ready for different application methods.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Cover Letter */}
      {data.coverLetter && (
        <div className="glass-card p-10 rounded-3xl relative overflow-hidden group hover:shadow-emerald-500/20 transition-all duration-500 animate-reveal-up">
          {/* Top Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-gradient-shift"></div>
          
          {/* Background Glow */}
          <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 relative z-10">
            <h3 className="text-3xl font-bold flex items-center text-white">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mr-4 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <span>Cover <span className="text-gradient">Letter</span></span>
            </h3>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCopy(data.coverLetter, 'cover')}
                className="flex items-center gap-2 px-5 py-3 glass text-slate-300 rounded-xl font-bold text-sm hover:bg-white/15 hover:text-white transition-all duration-300 hover:scale-105"
              >
                {copiedItem === 'cover' ? (
                  <><Check className="w-5 h-5 text-emerald-400" /> Copied!</>
                ) : (
                  <><Copy className="w-5 h-5" /> Copy</>
                )}
              </button>
              <a
                href={`http://localhost:5000/api/download/cover-letter/${data._id}/pdf`}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 transition-all duration-300"
              >
                <Download className="w-5 h-5" /> PDF
              </a>
              <a
                href={`http://localhost:5000/api/download/cover-letter/${data._id}/docx`}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
              >
                <Download className="w-5 h-5" /> DOCX
              </a>
            </div>
          </div>

          {/* Content */}
          <div className="glass-light rounded-2xl p-8 max-h-[500px] overflow-y-auto custom-scrollbar border border-white/10 relative z-10">
            <pre className="whitespace-pre-wrap text-sm text-slate-200 font-sans leading-relaxed">
              {data.coverLetter}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDetails;
