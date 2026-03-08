import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Save, RefreshCw, Check, Loader2, Sparkles, Lightbulb, X, Download, Wand2, Play } from 'lucide-react';
import axios from 'axios';

const ResumeEditor = ({ 
  initialContent, 
  jobRole, 
  jobDescription, 
  originalResumeText,
  onSave,
  onClose,
  analysisId
}) => {
  const [editedContent, setEditedContent] = useState(initialContent || '');
  const [isEditing, setIsEditing] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showRecs, setShowRecs] = useState(true);
  const [applyingRec, setApplyingRec] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimeoutRef = useRef(null);

  // Auto-save on content change (debounced)
  useEffect(() => {
    if (!isEditing || !editedContent) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSave(false); // Silent save
    }, 3000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [editedContent, isEditing]);

  // Fetch recommendations when content changes (debounced)
  useEffect(() => {
    if (!isEditing || !editedContent) return;

    const timer = setTimeout(() => {
      fetchRecommendations();
    }, 2000);

    return () => clearTimeout(timer);
  }, [editedContent, isEditing]);

  const fetchRecommendations = async () => {
    if (loadingRecs) return;
    
    setLoadingRecs(true);
    try {
      const res = await axios.post('http://localhost:5000/api/edit-recommendations', {
        editedResumeText: editedContent,
        jobRole,
        jobDescription
      });
      setRecommendations(res.data.recommendations || []);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoadingRecs(false);
    }
  };

  const handleSave = async (showNotification = true) => {
    setSaving(true);
    try {
      await onSave(editedContent);
      setLastSaved(new Date());
      if (showNotification) {
        alert('Resume saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      if (showNotification) {
        alert('Failed to save resume. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleApplyRecommendation = async (recommendation, index) => {
    setApplyingRec(index);
    try {
      const res = await axios.post('http://localhost:5000/api/apply-recommendation', {
        resumeText: editedContent,
        recommendation,
        jobRole,
        jobDescription
      });
      
      if (res.data.updatedResume) {
        setEditedContent(res.data.updatedResume);
        // Remove applied recommendation
        setRecommendations(recommendations.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Failed to apply recommendation:', error);
      alert('Failed to apply recommendation. You can manually edit the resume.');
    } finally {
      setApplyingRec(null);
    }
  };

  const handleDownload = (format) => {
    try {
      // Create blob from content
      const blob = new Blob([editedContent], { type: 'text/plain;charset=utf-8' });
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

  const handleEnableEdit = () => {
    setIsEditing(true);
    fetchRecommendations();
  };

  const handleDisableEdit = () => {
    setIsEditing(false);
    setRecommendations([]);
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden group animate-reveal-up">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-gradient-shift"></div>

      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 relative z-10">
        <h3 className="text-2xl font-bold flex items-center text-white">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mr-3 shadow-lg shadow-emerald-500/30">
            <Edit3 className="w-6 h-6 text-white" />
          </div>
          <span>Edit Your <span className="text-gradient">Resume</span></span>
        </h3>

        <div className="flex flex-wrap gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={handleEnableEdit}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300"
              >
                <Edit3 className="w-4 h-4" />
                Edit Resume
              </button>
              <button
                onClick={() => handleDownload('txt')}
                className="flex items-center gap-2 px-5 py-2.5 glass text-slate-300 rounded-xl font-bold text-sm hover:bg-white/15 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleDisableEdit}
                className="flex items-center gap-2 px-5 py-2.5 glass text-slate-300 rounded-xl font-bold text-sm hover:bg-white/15 transition-all duration-300"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 transition-all duration-300"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => handleDownload('txt')}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </>
          )}
        </div>
      </div>

      {/* Last Saved Indicator */}
      {lastSaved && (
        <div className="mb-4 text-xs text-emerald-400 flex items-center gap-2">
          <Check className="w-3 h-3" />
          <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Area */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-[500px] p-6 bg-slate-900/80 border-2 border-emerald-500/30 rounded-2xl text-white font-mono text-sm leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 custom-scrollbar resize-none"
              placeholder="Edit your resume content here..."
            />
          ) : (
            <div className="glass-light rounded-2xl p-6 h-[500px] overflow-y-auto custom-scrollbar border border-white/10">
              <pre className="whitespace-pre-wrap text-sm text-slate-200 font-sans leading-relaxed">
                {editedContent}
              </pre>
            </div>
          )}

          {/* Status Bar */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="font-medium text-emerald-400">Editing Mode</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                  <span>View Mode</span>
                </>
              )}
            </div>
            <span>{editedContent.length} characters</span>
          </div>
        </div>

        {/* Recommendations Panel */}
        {showRecs && (
          <div className="lg:col-span-1">
            <div className="glass-light rounded-2xl p-6 h-[500px] overflow-y-auto custom-scrollbar border border-amber-500/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  Recommendations
                </h4>
                <button
                  onClick={() => setShowRecs(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {loadingRecs ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                  <p className="text-sm text-slate-400 mt-2">Analyzing your resume...</p>
                </div>
              ) : recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/20 rounded-xl hover:border-amber-400/40 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-slate-200 font-medium leading-relaxed group-hover:text-white transition-colors flex-1">
                          {rec}
                        </p>
                      </div>
                      <button
                        onClick={() => handleApplyRecommendation(rec, idx)}
                        disabled={applyingRec === idx}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 transition-all duration-300"
                      >
                        {applyingRec === idx ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Applying...
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" />
                            Apply
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : isEditing ? (
                <div className="text-center py-12">
                  <Lightbulb className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">Start editing to get AI-powered recommendations</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Edit3 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">Click "Edit Resume" to start editing and get recommendations</p>
                </div>
              )}

              {/* Refresh Button */}
              {recommendations.length > 0 && (
                <button
                  onClick={fetchRecommendations}
                  disabled={loadingRecs}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 glass text-slate-300 rounded-xl text-sm font-medium hover:bg-white/15 transition-all duration-300 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingRecs ? 'animate-spin' : ''}`} />
                  Refresh Recommendations
                </button>
              )}
            </div>
          </div>
        )}

        {/* Show Recommendations Toggle */}
        {!showRecs && (
          <button
            onClick={() => setShowRecs(true)}
            className="lg:col-span-1 flex items-center justify-center gap-2 px-4 py-12 glass-light border-2 border-dashed border-amber-500/30 rounded-2xl text-amber-400 font-medium hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-300"
          >
            <Lightbulb className="w-5 h-5" />
            Show Recommendations
          </button>
        )}
      </div>
    </div>
  );
};

export default ResumeEditor;
