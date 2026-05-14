import * as d3 from 'd3';

const COLORS = {
  depot: '#1E3A5F', customerDefault: '#FFFFFF', customerBorder: '#1E3A5F',
  customerActive: '#0D7377', customerVisited: '#D6E4F0', visitedBorder: '#999',
  edgeUnvisited: '#CCCCCC', edgeCandidate: '#F59E0B', edgeAccepted: '#0D7377',
  edgeDiscarded: '#A63A3A', edgeOptimal: '#0D7377',
  bgLight: '#F8FAFC', bgDark: '#111827',
};

export function drawFrame(ctx, instance, frameState, colorScheme, width, height, timestamp = 0) {
  if (!instance || !frameState) return;
  const scaleX = d3.scaleLinear().domain([0, 100]).range([40, width - 40]);
  const scaleY = d3.scaleLinear().domain([0, 100]).range([40, height - 40]);
  const nodes = instance.nodes;

  ctx.clearRect(0, 0, width, height);

  // Background
  ctx.fillStyle = colorScheme === 'dark' ? COLORS.bgDark : COLORS.bgLight;
  ctx.fillRect(0, 0, width, height);

  // Subtle grid
  ctx.strokeStyle = colorScheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)';
  ctx.lineWidth = 0.5;
  for (let gx = 0; gx <= 100; gx += 10) {
    ctx.beginPath(); ctx.moveTo(scaleX(gx), scaleY(0)); ctx.lineTo(scaleX(gx), scaleY(100)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(scaleX(0), scaleY(gx)); ctx.lineTo(scaleX(100), scaleY(gx)); ctx.stroke();
  }

  // Unvisited edges (very faint)
  ctx.strokeStyle = COLORS.edgeUnvisited; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.15;
  ctx.setLineDash([]);
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (instance.dist[i][j] < instance.maxDist * 0.4) {
        ctx.beginPath();
        ctx.moveTo(scaleX(nodes[i].x), scaleY(nodes[i].y));
        ctx.lineTo(scaleX(nodes[j].x), scaleY(nodes[j].y));
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;

  // Active edges (current partial solution)
  if (frameState.activeEdges) {
    ctx.strokeStyle = colorScheme === 'teal' ? COLORS.edgeAccepted : COLORS.depot;
    ctx.lineWidth = 2; ctx.globalAlpha = 0.8; ctx.setLineDash([]);
    frameState.activeEdges.forEach(([from, to]) => {
      if (from < nodes.length && to < nodes.length) {
        ctx.beginPath();
        ctx.moveTo(scaleX(nodes[from].x), scaleY(nodes[from].y));
        ctx.lineTo(scaleX(nodes[to].x), scaleY(nodes[to].y));
        ctx.stroke();
      }
    });
    ctx.globalAlpha = 1;
  }

  // Candidate edge (animated dashes)
  if (frameState.candidateEdge) {
    const [from, to] = frameState.candidateEdge;
    if (from < nodes.length && to < nodes.length) {
      ctx.strokeStyle = COLORS.edgeCandidate; ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]); ctx.lineDashOffset = -(frameState.frame || 0) * 0.8;
      ctx.beginPath();
      ctx.moveTo(scaleX(nodes[from].x), scaleY(nodes[from].y));
      ctx.lineTo(scaleX(nodes[to].x), scaleY(nodes[to].y));
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Optimal route edges (thick, on top)
  if (frameState.isSolved && frameState.optimalRoute) {
    ctx.strokeStyle = COLORS.edgeOptimal; ctx.lineWidth = 3; ctx.globalAlpha = 1;
    ctx.setLineDash([]); ctx.shadowColor = COLORS.edgeOptimal; ctx.shadowBlur = 6;
    for (let i = 0; i < frameState.optimalRoute.length - 1; i++) {
      const from = frameState.optimalRoute[i], to = frameState.optimalRoute[i + 1];
      if (from < nodes.length && to < nodes.length) {
        ctx.beginPath();
        ctx.moveTo(scaleX(nodes[from].x), scaleY(nodes[from].y));
        ctx.lineTo(scaleX(nodes[to].x), scaleY(nodes[to].y));
        ctx.stroke();
      }
    }
    ctx.shadowBlur = 0;
  }

  // Draw nodes
  nodes.forEach((node) => {
    const px = scaleX(node.x), py = scaleY(node.y);
    if (node.isDepot) {
      // Depot: larger, dark navy
      ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.depot; ctx.fill();
      ctx.fillStyle = '#FFF'; ctx.font = 'bold 11px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('D', px, py);
    } else {
      const isActive = frameState.candidateEdge &&
        (frameState.candidateEdge[0] === node.id || frameState.candidateEdge[1] === node.id);
      const isOnOptimal = frameState.isSolved && frameState.optimalRoute?.includes(node.id);

      if (isActive) {
        // Pulse ring
        const pulseAlpha = 0.3 + 0.7 * (Math.sin((timestamp || 0) / 500 * Math.PI) * 0.5 + 0.5);
        ctx.globalAlpha = pulseAlpha;
        ctx.beginPath(); ctx.arc(px, py, 16, 0, Math.PI * 2);
        ctx.strokeStyle = COLORS.customerActive; ctx.lineWidth = 2; ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.customerActive; ctx.fill();
      } else if (isOnOptimal) {
        ctx.beginPath(); ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.customerActive; ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.customerDefault; ctx.fill();
        ctx.strokeStyle = COLORS.customerBorder; ctx.lineWidth = 1.5; ctx.stroke();
      }

      // Demand label
      ctx.fillStyle = isActive || isOnOptimal ? '#FFF' : COLORS.depot;
      ctx.font = '9px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(node.demand, px, py);
    }
  });
}
