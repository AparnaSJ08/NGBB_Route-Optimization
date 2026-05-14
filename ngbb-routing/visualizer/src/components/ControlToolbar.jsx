import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, FastForward } from 'lucide-react';

export default function ControlToolbar({ isPlaying, speed, onPlay, onPause, onStep, onReset, onRunToEnd, onSpeedChange, darkMode }) {
  const btnBase = `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-95`;
  const btnPrimary = `${btnBase} ${darkMode ? 'bg-teal/20 text-teal-light hover:bg-teal/30' : 'bg-teal/10 text-teal hover:bg-teal/20'}`;
  const btnSecondary = `${btnBase} ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`;

  return (
    <div className={`flex flex-wrap items-center gap-3 px-6 py-2 border-b ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
      {/* Play/Pause */}
      <button onClick={isPlaying ? onPause : onPlay} className={btnPrimary}>
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      {/* Step */}
      <button onClick={onStep} disabled={isPlaying} className={`${btnSecondary} ${isPlaying ? 'opacity-40 cursor-not-allowed' : ''}`}>
        <SkipForward size={14} /> Step
      </button>

      {/* Reset */}
      <button onClick={onReset} className={btnSecondary}>
        <RotateCcw size={14} /> Reset
      </button>

      {/* Run to End */}
      <button onClick={onRunToEnd} className={btnSecondary}>
        <FastForward size={14} /> End
      </button>

      {/* Divider */}
      <div className={`w-px h-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

      {/* Speed slider */}
      <label className="flex items-center gap-2 text-xs font-medium">
        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Speed</span>
        <input type="range" min="0.25" max="8" step="0.25" value={speed}
          onChange={e => onSpeedChange(parseFloat(e.target.value))}
          className="w-20 accent-teal" />
        <span className={`font-mono text-sm font-bold min-w-[2.5rem] ${darkMode ? 'text-teal-light' : 'text-teal'}`}>{speed}×</span>
      </label>
    </div>
  );
}
