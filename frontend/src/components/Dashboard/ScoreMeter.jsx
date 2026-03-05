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

  const activeColor = getColor(score);
  const gradientClass = getGradient(score);

  return (
    <div className="h-64 w-full flex flex-col items-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={data} 
            innerRadius={70} 
            outerRadius={90} 
            startAngle={180} 
            endAngle={0} 
            dataKey="value"
            stroke="none"
          >
            <Cell fill={activeColor} />
            <Cell fill="#f1f5f9" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-20 flex flex-col items-center">
        <span className={`text-6xl font-extrabold bg-gradient-to-br ${gradientClass} bg-clip-text text-transparent animate-in fade-in`}>
          {score}%
        </span>
        <span className="text-gray-500 uppercase tracking-widest text-xs font-bold mt-3 px-4 py-1 bg-gray-100 rounded-full">
          ATS Match
        </span>
      </div>
    </div>
  );
};

export default ScoreMeter;
