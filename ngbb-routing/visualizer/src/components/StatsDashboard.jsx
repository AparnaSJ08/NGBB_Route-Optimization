import React from 'react';
import MetricCard from './MetricCard';
import NodeReductionBadge from './NodeReductionBadge';
import { deriveFrameState } from '../utils/solverState';

export default function StatsDashboard({ tradResult, ngbbResult, frame, darkMode }) {
  const tradState = tradResult ? deriveFrameState(tradResult, frame) : null;
  const ngbbState = ngbbResult ? deriveFrameState(ngbbResult, frame) : null;

  const tradNodes = tradState?.nodesExplored ?? 0;
  const ngbbNodes = ngbbState?.nodesExplored ?? 0;

  const nodesDelta = tradNodes > 0
    ? `−${Math.round((tradNodes - ngbbNodes) / tradNodes * 100)}%` : null;

  const tradCost = tradState?.bestCost != null ? tradState.bestCost.toFixed(1) : '—';
  const ngbbCost = ngbbState?.bestCost != null ? ngbbState.bestCost.toFixed(1) : '—';

  const tradTime = tradState ? `${tradState.simulatedTimeMs}ms` : '—';
  const ngbbTime = ngbbState ? `${Math.round(ngbbState.nodesExplored * 0.6)}ms` : '—';

  const tradGap = tradState?.gap != null ? `${tradState.gap.toFixed(2)}%` : '—';
  const ngbbGap = ngbbState?.gap != null ? `${ngbbState.gap.toFixed(2)}%` : '—';

  const bothDone = tradResult && ngbbResult &&
    frame >= Math.max(tradResult.events.length, ngbbResult.events.length) - 1;

  return (
    <div className={`px-6 py-4 border-t ${darkMode ? 'bg-gray-900/70 border-gray-800' : 'bg-white border-gray-200'}`}>
      {/* Metric cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricCard title="Nodes Explored" tradValue={tradNodes} ngbbValue={ngbbNodes}
          delta={ngbbNodes < tradNodes ? nodesDelta : null} darkMode={darkMode} />
        <MetricCard title="Best Route Cost" tradValue={tradCost} ngbbValue={ngbbCost}
          darkMode={darkMode} />
        <MetricCard title="Solve Time" tradValue={tradTime} ngbbValue={ngbbTime}
          darkMode={darkMode} />
        <MetricCard title="Optimality Gap" tradValue={tradGap} ngbbValue={ngbbGap}
          darkMode={darkMode} />
      </div>

      {/* Node reduction badge */}
      <div className="flex justify-center">
        <NodeReductionBadge tradNodes={tradResult?.totalNodes} ngbbNodes={ngbbResult?.totalNodes}
          visible={bothDone} darkMode={darkMode} />
      </div>
    </div>
  );
}
