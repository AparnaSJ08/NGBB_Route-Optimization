import React from 'react';
import { Zap } from 'lucide-react';

export default function NodeReductionBadge({ tradNodes, ngbbNodes, visible, darkMode }) {
  if (!visible || !tradNodes || tradNodes === 0) return null;

  const reduction = Math.round((tradNodes - ngbbNodes) / tradNodes * 100);

  return (
    <div className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg shadow-xl transition-all duration-500 ${
      visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
    } bg-gradient-to-r from-teal to-cyan-500 text-white`}>
      <Zap size={20} className="animate-pulse" />
      <span>{reduction}% fewer nodes explored with NGBB</span>
    </div>
  );
}
