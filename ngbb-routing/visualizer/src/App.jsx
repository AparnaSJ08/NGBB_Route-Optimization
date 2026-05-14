import React, { useState, useEffect, useCallback, useRef } from 'react';
import HeaderBar from './components/HeaderBar';
import ControlToolbar from './components/ControlToolbar';
import SolverCanvas from './components/SolverCanvas';
import StatsDashboard from './components/StatsDashboard';
import VsBadge from './components/VsBadge';
import { generateInstance } from './utils/instanceGenerator';
import { runTraditionalSolver } from './utils/traditionalSolver';
import { runNGBBSolver } from './utils/ngbbSolver';

export default function App() {
  const [config, setConfig] = useState({
    nodeCount: 20, seed: 42, problemType: 'cvrp', vehicleCapacity: 50,
  });
  const [instance, setInstance] = useState(null);
  const [tradResult, setTradResult] = useState(null);
  const [ngbbResult, setNgbbResult] = useState(null);
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [darkMode, setDarkMode] = useState(true);

  // Generate instance + run solvers
  const generate = useCallback(() => {
    const inst = generateInstance(config.nodeCount, config.seed, config.problemType, config.vehicleCapacity);
    setInstance(inst);
    setTradResult(runTraditionalSolver(inst, config.seed));
    setNgbbResult(runNGBBSolver(inst, config.seed));
    setFrame(0);
    setIsPlaying(false);
  }, [config]);

  useEffect(() => { generate(); }, [generate]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !tradResult || !ngbbResult) return;
    let raf;
    let lastTime = 0;
    const tick = (now) => {
      if (now - lastTime > 1000 / (24 * speed)) {
        setFrame(f => {
          const maxFrame = Math.max(tradResult.events.length, ngbbResult.events.length) - 1;
          if (f >= maxFrame) { setIsPlaying(false); return f; }
          return f + 1;
        });
        lastTime = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, speed, tradResult, ngbbResult]);

  // Dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const maxFrame = tradResult && ngbbResult
    ? Math.max(tradResult.events.length, ngbbResult.events.length) - 1 : 0;

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    setConfig(prev => ({ ...prev, seed: Math.floor(Math.random() * 9999) }));
  };

  return (
    <div className={`app-grid font-display ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-slate-50 text-gray-900'} transition-colors duration-300`}>
      <HeaderBar
        config={config}
        onConfigChange={handleConfigChange}
        onGenerate={handleGenerate}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
      />
      <ControlToolbar
        isPlaying={isPlaying}
        speed={speed}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStep={() => setFrame(f => Math.min(f + 1, maxFrame))}
        onReset={() => { setFrame(0); setIsPlaying(false); }}
        onRunToEnd={() => { setFrame(maxFrame); setIsPlaying(false); }}
        onSpeedChange={setSpeed}
        darkMode={darkMode}
      />
      <div className="canvas-row px-4 py-2">
        <SolverCanvas label="Traditional B&B" result={tradResult} currentFrame={frame}
          colorScheme="navy" darkMode={darkMode} />
        <VsBadge tradResult={tradResult} ngbbResult={ngbbResult} frame={frame} />
        <SolverCanvas label="NGBB (Neural-Guided)" result={ngbbResult} currentFrame={frame}
          colorScheme="teal" darkMode={darkMode} />
      </div>
      <StatsDashboard tradResult={tradResult} ngbbResult={ngbbResult}
        frame={frame} darkMode={darkMode} />
    </div>
  );
}
