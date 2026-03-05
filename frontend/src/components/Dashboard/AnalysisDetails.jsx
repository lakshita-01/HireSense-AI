import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Lightbulb, TrendingUp, Info, FileText, Mail, Copy, Check, Sparkles } from 'lucide-react';

const AnalysisDetails = ({ data }) => {
  const [copiedItem, setCopiedItem] = useState(null);

  const chartData = Object.entries(data.breakdown).map(([key, val]) => ({
    name: key.replace(/([A-Z])/g, ' $1').trim(),
    score: val
  }));

  const handleCopy = (text, itemName) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl space-y-8">
      {/* Score Breakdown and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60 relative overflow-hidden group hover:shadow-indigo-200/50 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700"></div>
          
          <h3 className="text-2xl font-bold mb-8 flex items-center text-gray-800 relative z-10">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mr-3 shadow-lg shadow-indigo-200">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span>Factor <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Breakdown</span></span>
          </h3>
          <div className="h-72 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 13, fontWeight: 600, fill: '#475569' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                    border: 'none', 
                    borderRadius: '16px', 
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    padding: '12px 16px'
                  }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                />
                <Bar dataKey="score" radius={[0, 12, 12, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.score > 70 ? 'url(#barGradient)' : '#cbd5e1'} 
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60 relative overflow-hidden group hover:shadow-amber-200/50 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all duration-700"></div>
          
          <h3 className="text-2xl font-bold mb-8 flex items-center text-gray-800 relative z-10">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mr-3 shadow-lg shadow-amber-200">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <span>AI <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Recommendations</span></span>
          </h3>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar relative z-10">
            {data.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-l-4 border-amber-400 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group/item">
                <div className="p-2 bg-amber-100 rounded-xl mr-3 mt-0.5 shrink-0 group-hover/item:bg-amber-200 transition-colors">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-gray-700 text-sm font-medium leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 relative z-10">
            <p className="text-xs text-gray-400 text-center font-semibold">
              🤖 Powered by Hugging Face Mistral-7B
            </p>
          </div>
        </div>
      </div>

      {/* Tailored Resume */}
      {data.tailoredResumeContent && (
        <div className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/60 relative overflow-hidden group hover:shadow-indigo-200/50 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700"></div>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 relative z-10">
            <h3 className="text-3xl font-bold flex items-center text-gray-800">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mr-4 shadow-lg shadow-indigo-200">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <span>Tailored <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Resume</span></span>
            </h3>
            <button
              onClick={() => handleCopy(data.tailoredResumeContent, 'resume')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              {copiedItem === 'resume' ? (
                <><Check className="w-5 h-5" /> Copied!</>
              ) : (
                <><Copy className="w-5 h-5" /> Copy Content</>
              )}
            </button>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-2xl p-8 max-h-[500px] overflow-y-auto custom-scrollbar border border-indigo-100 relative z-10">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
              {data.tailoredResumeContent}
            </pre>
          </div>
        </div>
      )}

      {/* Cover Letter */}
      {data.coverLetter && (
        <div className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/60 relative overflow-hidden group hover:shadow-emerald-200/50 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
          <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 relative z-10">
            <h3 className="text-3xl font-bold flex items-center text-gray-800">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mr-4 shadow-lg shadow-emerald-200">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <span>Cover <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Letter</span></span>
            </h3>
            <button
              onClick={() => handleCopy(data.coverLetter, 'cover')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-sm hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              {copiedItem === 'cover' ? (
                <><Check className="w-5 h-5" /> Copied!</>
              ) : (
                <><Copy className="w-5 h-5" /> Copy Letter</>
              )}
            </button>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-emerald-50/30 rounded-2xl p-8 max-h-[500px] overflow-y-auto custom-scrollbar border border-emerald-100 relative z-10">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
              {data.coverLetter}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDetails;
