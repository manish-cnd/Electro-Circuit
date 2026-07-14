import React, { useEffect, useRef, useCallback, useState } from 'react';
import useStore from '../../store/useStore';
import { X, Maximize2, Minimize2, Trash2 } from 'lucide-react';

const COLORS = ['#22c55e', '#06b6d4', '#f97316', '#a855f7', '#eab308', '#ef4444', '#3b82f6', '#10b981'];

/**
 * WaveformPanel — Real-time timing diagram drawn on HTML5 Canvas.
 * Shows square-wave signal traces for all monitored nodes.
 */
export default function WaveformPanel() {
  const waveformData = useStore(s => s.waveformData);
  const nodes = useStore(s => s.nodes);
  const toggleNodeMonitored = useStore(s => s.toggleNodeMonitored);
  const toggleWaveform = useStore(s => s.toggleWaveformPanel);
  const isRunning = useStore(s => s.isRunning);

  const canvasRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const animRef = useRef(null);

  const panelHeight = expanded ? 240 : 160;
  const rowH = 36;
  const labelW = 80;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Background
    ctx.fillStyle = '#060d1a';
    ctx.fillRect(0, 0, W, H);

    const entries = Object.entries(waveformData);
    if (entries.length === 0) {
      ctx.fillStyle = '#1e2d40';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('No signals monitored. Right-click a node → "Monitor"', W / 2, H / 2);
      ctx.fillText('or click the eye icon on any gate to track its waveform.', W / 2, H / 2 + 18);
      return;
    }

    // Grid lines
    ctx.strokeStyle = '#1e2d40';
    ctx.lineWidth = 0.5;
    for (let x = labelW; x < W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    entries.forEach(([nodeId, data], idx) => {
      const color = COLORS[idx % COLORS.length];
      const values = data.values || [];
      const y = idx * rowH;

      // Row background (alternating)
      ctx.fillStyle = idx % 2 === 0 ? 'rgba(26,34,53,0.4)' : 'rgba(15,23,42,0.4)';
      ctx.fillRect(0, y, W, rowH);

      // Label
      ctx.fillStyle = color;
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(data.label || nodeId.slice(0, 8), 6, y + rowH / 2 + 4);

      // Separator
      ctx.strokeStyle = '#1e2d40';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(labelW, y);
      ctx.lineTo(labelW, y + rowH);
      ctx.stroke();

      // Signal trace
      if (values.length === 0) return;

      const traceW = W - labelW;
      const xStep = Math.max(2, traceW / Math.max(values.length, 1));
      const highY = y + 6;
      const lowY = y + rowH - 8;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
      ctx.beginPath();

      let prevX = labelW;
      let prevY = values[0] === 1 ? highY : lowY;
      ctx.moveTo(prevX, prevY);

      values.forEach((val, i) => {
        const curX = labelW + i * xStep;
        const curY = val === 1 ? highY : lowY;

        if (curY !== prevY) {
          // Vertical transition
          ctx.lineTo(curX, prevY);
          ctx.lineTo(curX, curY);
        } else {
          ctx.lineTo(curX, curY);
        }
        prevX = curX;
        prevY = curY;
      });
      ctx.lineTo(W, prevY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Current value badge
      const lastVal = values[values.length - 1] ?? 0;
      ctx.fillStyle = lastVal === 1 ? color : '#374151';
      ctx.beginPath();
      ctx.roundRect(W - 28, y + rowH / 2 - 8, 22, 16, 4);
      ctx.fill();
      ctx.fillStyle = lastVal === 1 ? '#000' : '#94a3b8';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(lastVal, W - 17, y + rowH / 2 + 3);
    });

    // Time axis
    const lastRow = entries.length * rowH;
    ctx.fillStyle = '#1e2d40';
    ctx.fillRect(labelW, lastRow > 0 ? lastRow : H - 16, W - labelW, 16);
    ctx.fillStyle = '#374151';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 10; i++) {
      const x = labelW + (i / 10) * (W - labelW);
      ctx.fillText(i * 10, x, (lastRow > 0 ? lastRow : H - 16) + 11);
    }
  }, [waveformData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      draw();
    });
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, [draw]);

  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        draw();
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      draw();
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isRunning, draw]);

  // Monitored nodes picker
  const monitorableNodes = nodes.filter(n => {
    const type = n.data?.gateType || '';
    return !['INPUT', 'CLOCK'].includes(type);
  });

  return (
    <div
      className="shrink-0 flex flex-col animate-slide-up"
      style={{
        height: panelHeight + 48,
        background: '#080e1c',
        borderTop: '1px solid #1e2d40',
      }}
    >
      {/* Panel Header */}
      <div
        className="flex items-center justify-between px-4 py-2 shrink-0"
        style={{ borderBottom: '1px solid #1e2d40', height: 40 }}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: isRunning ? '#22c55e' : '#374151' }} />
            <span className="text-xs font-semibold text-text-secondary">Timing Diagram</span>
          </div>
          <span className="text-[10px] font-mono text-text-muted">
            {Object.keys(waveformData).length} signals
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Signal selector */}
          <div className="flex items-center gap-1 mr-2">
            {monitorableNodes.slice(0, 8).map((node, i) => (
              <button
                key={node.id}
                onClick={() => toggleNodeMonitored(node.id)}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded transition-all"
                style={{
                  background: node.data?.monitored ? COLORS[i % COLORS.length] + '22' : '#1a2235',
                  border: `1px solid ${node.data?.monitored ? COLORS[i % COLORS.length] : '#374151'}`,
                  color: node.data?.monitored ? COLORS[i % COLORS.length] : '#64748b',
                }}
                title={`Monitor ${node.data?.label || node.id}`}
              >
                {(node.data?.label || node.id).slice(0, 4)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setExpanded(e => !e)}
            className="toolbar-btn p-1"
            title={expanded ? 'Minimize' : 'Expand'}
          >
            {expanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
          <button
            onClick={toggleWaveform}
            className="toolbar-btn p-1"
            title="Close"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        id="waveform-canvas"
        className="flex-1 w-full"
        style={{ display: 'block' }}
      />
    </div>
  );
}
