import React from 'react';
import { Sun, Moon, Shuffle } from 'lucide-react';

export default function HeaderBar({ config, onConfigChange, onGenerate, darkMode, onToggleDark }) {
  return (
    <header className={`flex flex-wrap items-center gap-4 px-6 py-3 border-b ${darkMode ? 'bg-gray-900/80 border-gray-800 backdrop-blur-sm' : 'bg-white/80 border-gray-200 backdrop-blur-sm'}`}>
      {/* Title */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal to-navy flex items-center justify-center">
          <span className="text-white font-extrabold text-sm">N</span>
        </div>
        <h1 className="text-lg font-bold tracking-tight">
          <span className="bg-gradient-to-r from-teal to-cyan-400 bg-clip-text text-transparent">NGBB</span>
          <span className={`ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium text-sm`}>Visualizer</span>
        </h1>
      </div>

      {/* Node count slider */}
      <label className="flex items-center gap-2 text-xs font-medium">
        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Nodes</span>
        <input type="range" min="10" max="60" step="1" value={config.nodeCount}
          onChange={e => onConfigChange('nodeCount', parseInt(e.target.value))}
          className="w-24 accent-teal" />
        <span className={`font-mono text-sm font-bold ${darkMode ? 'text-teal-light' : 'text-teal'}`}>{config.nodeCount}</span>
      </label>

      {/* Seed input */}
      <label className="flex items-center gap-2 text-xs font-medium">
        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Seed</span>
        <input type="number" min="0" max="9999" value={config.seed}
          onChange={e => onConfigChange('seed', parseInt(e.target.value) || 0)}
          className={`w-16 px-2 py-1 rounded text-sm font-mono ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border`} />
      </label>

      {/* Problem type */}
      <label className="flex items-center gap-2 text-xs font-medium">
        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Type</span>
        <select value={config.problemType} onChange={e => onConfigChange('problemType', e.target.value)}
          className={`px-2 py-1 rounded text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border`}>
          <option value="cvrp">CVRP</option>
          <option value="tsp">TSP</option>
        </select>
      </label>

      {/* Capacity (CVRP only) */}
      {config.problemType === 'cvrp' && (
        <label className="flex items-center gap-2 text-xs font-medium">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Capacity</span>
          <input type="number" min="20" max="100" value={config.vehicleCapacity}
            onChange={e => onConfigChange('vehicleCapacity', parseInt(e.target.value) || 50)}
            className={`w-14 px-2 py-1 rounded text-sm font-mono ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border`} />
        </label>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Generate button */}
      <button onClick={onGenerate}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal to-teal-dark text-white text-sm font-semibold hover:brightness-110 transition-all shadow-md shadow-teal/20 active:scale-95">
        <Shuffle size={14} /> New Instance
      </button>

      {/* Dark mode toggle */}
      <button onClick={onToggleDark}
        className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </header>
  );
}
