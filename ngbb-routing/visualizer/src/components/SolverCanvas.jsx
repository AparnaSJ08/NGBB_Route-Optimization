import React, { useRef, useEffect } from 'react';
import { drawFrame } from '../utils/canvasRenderer';
import { deriveFrameState } from '../utils/solverState';
import { CheckCircle } from 'lucide-react';

export default function SolverCanvas({ label, result, currentFrame, colorScheme, darkMode, width = 540, height = 400 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!result || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');

    const render = (timestamp) => {
      const frameData = deriveFrameState(result, currentFrame);
      drawFrame(ctx, result.instance, frameData, darkMode ? 'dark' : colorScheme, width, height, timestamp);
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [result, currentFrame, colorScheme, darkMode, width, height]);

  const isSolved = result && currentFrame >= result.events.length - 1;
  const isTeal = colorScheme === 'teal';

  return (
    <div className="relative flex flex-col items-center">
      {/* Label */}
      <div className={`text-sm font-semibold mb-2 px-3 py-1 rounded-full ${
        isTeal
          ? (darkMode ? 'bg-teal/15 text-teal-light' : 'bg-teal/10 text-teal-dark')
          : (darkMode ? 'bg-navy/30 text-blue-300' : 'bg-navy/10 text-navy')
      }`}>
        {label}
      </div>

      {/* Canvas container */}
      <div className={`relative rounded-xl overflow-hidden shadow-lg ${
        darkMode ? 'shadow-black/30 ring-1 ring-gray-800' : 'shadow-gray-300/50 ring-1 ring-gray-200'
      }`}>
        <canvas ref={canvasRef} width={width} height={height}
          style={{ display: 'block' }} />

        {/* Solved badge overlay */}
        {isSolved && (
          <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-bounce-in ${
            isTeal ? 'bg-teal text-white' : 'bg-navy text-white'
          }`}>
            <CheckCircle size={14} />
            Solved in {result.solvedAtFrame} steps
          </div>
        )}
      </div>
    </div>
  );
}
