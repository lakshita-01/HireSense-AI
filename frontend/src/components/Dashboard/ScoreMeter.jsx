import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ScoreMeter = ({ score }) => {
  const data = [
    { value: score },
    { value: 100 - score }
  ];

  const getColor = (s) => {
    if (s >= 75) return '#10b981';
    if (s >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getGradient = (s) => {
    if (s >= 75) return 'from-emerald-400 to-green-600';
    if (s >= 50) return 'from-amber-400 to-orange-600';
    return 'from-red-400 to-rose-600';
  };

  const getGlowColor = (s) => {
    if (s >= 75) return 'rgba(16, 185, 129, 0.5)';
    if (s >= 50) return 'rgba(245, 158, 11, 0.5)';
    return 'rgba(239, 68, 68, 0.5)';
  };

  const getLabel = (s) => {
    if (s >= 90) return 'Excellent';
    if (s >= 75) return 'Good';
    if (s >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  const activeColor = getColor(score);
  const gradientClass = getGradient(score);
  const glowColor = getGlowColor(score);
  const label = getLabel(score);

  return (
    <div className="h-72 w-full flex flex-col items-center relative">
      {/* Outer Glow Ring */}
      <div
        className="absolute top-1/2 left-1/2 w-56 h-56 rounded-full blur-3xl animate-pulse"
        style={{
          backgroundColor: glowColor,
          transform: 'translate(-50%, -50%)',
        }}
      ></div>

      {/* Animated Ring */}
      <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full border-2 opacity-20 animate-spin-slow"
        style={{
          borderColor: activeColor,
          borderStyle: 'dashed',
          transform: 'translate(-50%, -50%)',
        }}
      ></div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Background arc */}
          <Pie
            data={[{ value: 100 }]}
            innerRadius={70}
            outerRadius={90}
            startAngle={180}
            endAngle={0}
            dataKey="value"
            stroke="none"
            fill="#1e293b"
          />
          {/* Progress arc with gradient */}
          <Pie
            data={[{ value: score }]}
            innerRadius={70}
            outerRadius={90}
            startAngle={180}
            endAngle={0}
            dataKey="value"
            stroke="none"
            style={{ filter: `drop-shadow(0 0 12px ${glowColor})` }}
          >
            <Cell fill={activeColor} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Animated score display */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-scale-in">
        {/* Score Value */}
        <span className={`text-6xl md:text-7xl font-black bg-gradient-to-br ${gradientClass} bg-clip-text text-transparent drop-shadow-2xl`}>
          {score}%
        </span>

        {/* Label Badge */}
        <div
          className="mt-3 px-4 py-1.5 rounded-full animate-fade-in border backdrop-blur-sm"
          style={{
            backgroundColor: `${activeColor}15`,
            borderColor: `${activeColor}40`,
          }}
        >
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: activeColor }}
          >
            {label}
          </span>
        </div>

        {/* Status Indicator */}
        <div className="mt-3 flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: activeColor }}
          ></div>
          <span className="text-xs text-slate-400 font-medium">ATS Match Score</span>
        </div>
      </div>

      {/* Decorative Particles */}
      <div
        className="absolute top-4 left-4 w-2 h-2 rounded-full animate-ping"
        style={{ backgroundColor: activeColor }}
      ></div>
      <div
        className="absolute top-4 right-4 w-2 h-2 rounded-full animate-ping"
        style={{ backgroundColor: activeColor, animationDelay: '0.75s' }}
      ></div>
      <div
        className="absolute bottom-8 left-1/4 w-1.5 h-1.5 rounded-full animate-ping"
        style={{ backgroundColor: activeColor, animationDelay: '1.5s' }}
      ></div>
      <div
        className="absolute bottom-8 right-1/4 w-1.5 h-1.5 rounded-full animate-ping"
        style={{ backgroundColor: activeColor, animationDelay: '0.5s' }}
      ></div>
    </div>
  );
};

export default ScoreMeter;

