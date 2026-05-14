import React from 'react';

export default function MetricCard({ title, tradValue, ngbbValue, delta, darkMode }) {
  const hasImprovement = delta && delta.startsWith('−');

  return (
    <div className={`rounded-xl p-4 transition-all ${
      darkMode ? 'bg-gray-800/60 border border-gray-700/50' : 'bg-white border border-gray-200 shadow-sm'
    }`}>
      <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {title}
      </div>
      <div className="flex items-end justify-between gap-4">
        {/* Traditional */}
        <div className="text-center">
          <div className={`text-[10px] mb-0.5 ${darkMode ? 'text-blue-400/70' : 'text-navy/60'}`}>Traditional</div>
          <div className={`font-mono text-lg font-bold ${darkMode ? 'text-blue-300' : 'text-navy'}`}>
            {tradValue ?? '—'}
          </div>
        </div>
        {/* NGBB */}
        <div className="text-center">
          <div className={`text-[10px] mb-0.5 ${darkMode ? 'text-teal-300/70' : 'text-teal/60'}`}>NGBB</div>
          <div className={`font-mono text-lg font-bold ${darkMode ? 'text-teal-300' : 'text-teal'}`}>
            {ngbbValue ?? '—'}
          </div>
        </div>
        {/* Delta */}
        {delta && (
          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            hasImprovement
              ? 'bg-emerald-500/20 text-emerald-400'
              : (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')
          }`}>
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}
