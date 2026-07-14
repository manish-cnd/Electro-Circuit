import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import useStore from '../../store/useStore';

const handleStyle = (active, color = '#22c55e') => ({
  width: 10, height: 10, borderRadius: '50%',
  background: active ? color : '#1a2235',
  border: `2px solid ${active ? color : '#6366f1'}`,
  boxShadow: active ? `0 0 6px ${color}` : 'none',
});

// ─── LED OUTPUT ───────────────────────────────────────────────────────────────
export const OutputLedNode = memo(({ id, data, selected }) => {
  const isRunning = useStore(s => s.isRunning);
  const active = isRunning && (data.inputs?.a === 1 || data.output === 1);
  const ledColor = active ? '#eab308' : '#374151';
  const glowFilter = active
    ? 'drop-shadow(0 0 6px #eab308) drop-shadow(0 0 14px rgba(234,179,8,0.5))'
    : 'none';

  return (
    <div style={{ padding: 0, background: 'transparent', border: 'none', userSelect: 'none' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative' }}>

        {/* LED bulb SVG */}
        <svg width="52" height="68" viewBox="0 0 52 68" style={{ filter: glowFilter, display: 'block' }}>
          {/* Outer glow */}
          {active && <ellipse cx="26" cy="24" rx="22" ry="22" fill="rgba(234,179,8,0.1)" />}
          {/* Glass */}
          <ellipse cx="26" cy="22" rx="15" ry="15"
            fill={active ? '#fef08a' : '#1e293b'}
            stroke={ledColor} strokeWidth="2" />
          {/* Shine */}
          {active && <ellipse cx="20" cy="15" rx="4" ry="3" fill="rgba(255,255,255,0.55)" />}
          {/* Filament */}
          <path d="M18 37 L18 41 L34 41 L34 37" fill="none" stroke={ledColor} strokeWidth="1.5" strokeLinecap="round" />
          {/* Pins */}
          <line x1="20" y1="41" x2="20" y2="50" stroke={ledColor} strokeWidth="1.5" />
          <line x1="32" y1="41" x2="32" y2="50" stroke={ledColor} strokeWidth="1.5" />
          {/* Base lines */}
          <line x1="13" y1="52" x2="39" y2="52" stroke={ledColor} strokeWidth="2" />
          <line x1="17" y1="57" x2="35" y2="57" stroke={ledColor} strokeWidth="1.5" />
          <line x1="21" y1="62" x2="31" y2="62" stroke={ledColor} strokeWidth="1" />
        </svg>

        {/* ON/OFF badge */}
        <div style={{
          fontSize: 9, fontFamily: 'monospace', fontWeight: 700,
          background: active ? '#eab308' : '#374151',
          color: active ? '#000' : '#94a3b8',
          borderRadius: 20, padding: '2px 8px',
          boxShadow: active ? '0 0 8px #eab308' : 'none',
        }}>
          {data.label || 'LED'} {active ? '●' : '○'}
        </div>
      </div>

      <Handle type="target" position={Position.Left} id="input-a"
        style={{ ...handleStyle(active, '#eab308'), position: 'absolute', top: '35%', left: -6 }} />
    </div>
  );
});
OutputLedNode.displayName = 'OutputLedNode';


// ─── 7-SEGMENT DISPLAY ────────────────────────────────────────────────────────
const SEG_MAP = {
  0:[1,1,1,1,1,1,0], 1:[0,1,1,0,0,0,0], 2:[1,1,0,1,1,0,1], 3:[1,1,1,1,0,0,1],
  4:[0,1,1,0,0,1,1], 5:[1,0,1,1,0,1,1], 6:[1,0,1,1,1,1,1], 7:[1,1,1,0,0,0,0],
  8:[1,1,1,1,1,1,1], 9:[1,1,1,1,0,1,1], 10:[1,1,1,0,1,1,1], 11:[0,0,1,1,1,1,1],
  12:[1,0,0,1,1,1,0], 13:[0,1,1,1,1,0,1], 14:[1,0,0,1,1,1,1], 15:[1,0,0,0,1,1,1],
};

export const SevenSegmentNode = memo(({ id, data, selected }) => {
  const isRunning = useStore(s => s.isRunning);
  const digit = isRunning ? (data.display ?? 0) : 8;
  const segs = SEG_MAP[digit % 16] || SEG_MAP[0];
  const [a, b, c, d, e, f, g] = segs;
  const on = '#ef4444';
  const off = '#1e293b';

  const s = (lit) => lit && isRunning ? { fill: on, filter: 'drop-shadow(0 0 3px #ef4444)' } : { fill: off };

  return (
    <div style={{ padding: 0, background: 'transparent', border: 'none', userSelect: 'none' }}>
      <div style={{
        background: '#0a0f1e',
        border: '1.5px solid #1e2d40',
        borderRadius: 8, padding: '8px 10px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        boxShadow: isRunning ? '0 0 8px rgba(239,68,68,0.2)' : 'none',
      }}>
        <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#475569', marginBottom: 2 }}>
          7-SEG
        </span>
        <svg width="42" height="62" viewBox="0 0 42 62">
          {/* a - top */}
          <rect x="6" y="2" width="30" height="5" rx="2" {...s(a)} />
          {/* b - top right */}
          <rect x="36" y="6" width="5" height="20" rx="2" {...s(b)} />
          {/* c - bottom right */}
          <rect x="36" y="36" width="5" height="20" rx="2" {...s(c)} />
          {/* d - bottom */}
          <rect x="6" y="55" width="30" height="5" rx="2" {...s(d)} />
          {/* e - bottom left */}
          <rect x="1" y="36" width="5" height="20" rx="2" {...s(e)} />
          {/* f - top left */}
          <rect x="1" y="6" width="5" height="20" rx="2" {...s(f)} />
          {/* g - middle */}
          <rect x="6" y="29" width="30" height="5" rx="2" {...s(g)} />
        </svg>
        <span style={{
          fontSize: 11, fontFamily: 'monospace', fontWeight: 700,
          color: isRunning ? on : '#374151',
        }}>
          {isRunning ? digit.toString(16).toUpperCase() : '-'}
        </span>
      </div>

      <Handle type="target" position={Position.Left} id="input-a"
        style={{ ...handleStyle(false), position: 'absolute', top: '20%', left: -6 }} />
      <Handle type="target" position={Position.Left} id="input-b"
        style={{ ...handleStyle(false), position: 'absolute', top: '40%', left: -6 }} />
      <Handle type="target" position={Position.Left} id="input-c"
        style={{ ...handleStyle(false), position: 'absolute', top: '60%', left: -6 }} />
      <Handle type="target" position={Position.Left} id="input-d"
        style={{ ...handleStyle(false), position: 'absolute', top: '80%', left: -6 }} />
    </div>
  );
});
SevenSegmentNode.displayName = 'SevenSegmentNode';
