import React, { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import useStore from '../../store/useStore';

/**
 * All standard logic gate nodes — fully self-contained, no wrapper abstraction.
 * Each gate uses inline SVG schematic symbols directly inside the React Flow node.
 */

// Shared styling
const nodeStyle = (active, color = '#6366f1') => ({
  background: 'transparent',
  padding: 0,
  border: 'none',
  cursor: 'grab',
});

const handleStyle = (active) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  background: active ? '#22c55e' : '#1a2235',
  border: `2px solid ${active ? '#22c55e' : '#6366f1'}`,
  boxShadow: active ? '0 0 6px #22c55e' : 'none',
});

// ─── AND GATE ────────────────────────────────────────────────────────────────
export const AndGateNode = memo(({ id, data, selected }) => {
  const isRunning = useStore(s => s.isRunning);
  const active = isRunning && data.output === 1;
  const color = active ? '#22c55e' : '#6366f1';
  const glow = active ? 'drop-shadow(0 0 4px #22c55e)' : (selected ? 'drop-shadow(0 0 6px #6366f1)' : 'none');

  return (
    <div style={nodeStyle(active)}>
      <Handle type="target" position={Position.Left} id="input-a"
        style={{ ...handleStyle(active), top: 16, left: -6, position: 'absolute' }} />
      <Handle type="target" position={Position.Left} id="input-b"
        style={{ ...handleStyle(active), top: 36, left: -6, position: 'absolute' }} />

      <svg width="72" height="52" viewBox="0 0 72 52" style={{ display: 'block', filter: glow }}>
        {/* Gate body */}
        <path d="M8 6 H34 Q62 6 62 26 Q62 46 34 46 H8 Z"
          fill="#1e293b" stroke={color} strokeWidth="1.8" />
        {/* Input wires */}
        <line x1="0" y1="16" x2="8" y2="16" stroke={color} strokeWidth="1.5" />
        <line x1="0" y1="36" x2="8" y2="36" stroke={color} strokeWidth="1.5" />
        {/* Output wire */}
        <line x1="62" y1="26" x2="72" y2="26" stroke={color} strokeWidth="1.5" />
        {/* Label */}
        <text x="28" y="30" textAnchor="middle" fontSize="9" fill={color}
          fontWeight="bold" fontFamily="JetBrains Mono, monospace">AND</text>
      </svg>

      <Handle type="source" position={Position.Right} id="output"
        style={{ ...handleStyle(active), top: 26, right: -6, position: 'absolute' }} />

      {/* Gate name tag */}
      <div style={{ position: 'absolute', top: -16, left: 0, right: 0, textAlign: 'center',
        fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold',
        color: active ? '#22c55e' : '#64748b' }}>
        {data.label || 'AND'}
      </div>
    </div>
  );
});
AndGateNode.displayName = 'AndGateNode';

// ─── OR GATE ─────────────────────────────────────────────────────────────────
export const OrGateNode = memo(({ id, data, selected }) => {
  const isRunning = useStore(s => s.isRunning);
  const active = isRunning && data.output === 1;
  const color = active ? '#22c55e' : '#8b5cf6';
  const glow = active ? 'drop-shadow(0 0 4px #22c55e)' : (selected ? 'drop-shadow(0 0 6px #8b5cf6)' : 'none');

  return (
    <div style={nodeStyle(active)}>
      <Handle type="target" position={Position.Left} id="input-a"
        style={{ ...handleStyle(active), top: 14, left: -6, position: 'absolute' }} />
      <Handle type="target" position={Position.Left} id="input-b"
        style={{ ...handleStyle(active), top: 36, left: -6, position: 'absolute' }} />

      <svg width="76" height="52" viewBox="0 0 76 52" style={{ display: 'block', filter: glow }}>
        <path d="M8 6 Q22 6 36 6 Q64 6 68 26 Q64 46 36 46 Q22 46 8 46 Q18 26 8 6 Z"
          fill="#1e293b" stroke={color} strokeWidth="1.8" />
        <line x1="0" y1="16" x2="14" y2="16" stroke={color} strokeWidth="1.5" />
        <line x1="0" y1="36" x2="14" y2="36" stroke={color} strokeWidth="1.5" />
        <line x1="68" y1="26" x2="76" y2="26" stroke={color} strokeWidth="1.5" />
        <text x="36" y="30" textAnchor="middle" fontSize="9" fill={color}
          fontWeight="bold" fontFamily="JetBrains Mono, monospace">OR</text>
      </svg>

      <Handle type="source" position={Position.Right} id="output"
        style={{ ...handleStyle(active), top: 26, right: -6, position: 'absolute' }} />
      <div style={{ position: 'absolute', top: -16, left: 0, right: 0, textAlign: 'center',
        fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold', color: active ? '#22c55e' : '#64748b' }}>
        {data.label || 'OR'}
      </div>
    </div>
  );
});
OrGateNode.displayName = 'OrGateNode';

// ─── NOT GATE ────────────────────────────────────────────────────────────────
export const NotGateNode = memo(({ id, data, selected }) => {
  const isRunning = useStore(s => s.isRunning);
  const active = isRunning && data.output === 1;
  const color = active ? '#22c55e' : '#ec4899';
  const glow = active ? 'drop-shadow(0 0 4px #22c55e)' : (selected ? 'drop-shadow(0 0 6px #ec4899)' : 'none');

  return (
    <div style={nodeStyle(active)}>
      <Handle type="target" position={Position.Left} id="input-a"
        style={{ ...handleStyle(active), top: 22, left: -6, position: 'absolute' }} />

      <svg width="60" height="44" viewBox="0 0 60 44" style={{ display: 'block', filter: glow }}>
        {/* Triangle body */}
        <path d="M4 4 L48 22 L4 40 Z"
          fill="#1e293b" stroke={color} strokeWidth="1.8" />
        {/* Bubble (NOT circle) */}
        <circle cx="53" cy="22" r="5"
          fill="#1e293b" stroke={color} strokeWidth="1.8" />
        {/* Wires */}
        <line x1="0" y1="22" x2="4" y2="22" stroke={color} strokeWidth="1.5" />
        <line x1="58" y1="22" x2="60" y2="22" stroke={color} strokeWidth="1.5" />
        <text x="20" y="26" textAnchor="middle" fontSize="8" fill={color}
          fontWeight="bold" fontFamily="monospace">1</text>
      </svg>

      <Handle type="source" position={Position.Right} id="output"
        style={{ ...handleStyle(active), top: 22, right: -6, position: 'absolute' }} />
      <div style={{ position: 'absolute', top: -16, left: 0, right: 0, textAlign: 'center',
        fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold', color: active ? '#22c55e' : '#64748b' }}>
        {data.label || 'NOT'}
      </div>
    </div>
  );
});
NotGateNode.displayName = 'NotGateNode';

// ─── NAND GATE ───────────────────────────────────────────────────────────────
export const NandGateNode = memo(({ id, data, selected }) => {
  const isRunning = useStore(s => s.isRunning);
  const active = isRunning && data.output === 1;
  const color = active ? '#22c55e' : '#f59e0b';
  const glow = active ? 'drop-shadow(0 0 4px #22c55e)' : (selected ? 'drop-shadow(0 0 6px #f59e0b)' : 'none');

  return (
    <div style={nodeStyle(active)}>
      <Handle type="target" position={Position.Left} id="input-a"
        style={{ ...handleStyle(active), top: 16, left: -6, position: 'absolute' }} />
      <Handle type="target" position={Position.Left} id="input-b"
        style={{ ...handleStyle(active), top: 36, left: -6, position: 'absolute' }} />

      <svg width="80" height="52" viewBox="0 0 80 52" style={{ display: 'block', filter: glow }}>
        <path d="M8 6 H32 Q58 6 58 26 Q58 46 32 46 H8 Z"
          fill="#1e293b" stroke={color} strokeWidth="1.8" />
        <circle cx="63" cy="26" r="5"
          fill="#1e293b" stroke={color} strokeWidth="1.8" />
        <line x1="0" y1="16" x2="8" y2="16" stroke={color} strokeWidth="1.5" />
        <line x1="0" y1="36" x2="8" y2="36" stroke={color} strokeWidth="1.5" />
        <line x1="68" y1="26" x2="80" y2="26" stroke={color} strokeWidth="1.5" />
        <text x="28" y="30" textAnchor="middle" fontSize="8" fill={color}
          fontWeight="bold" fontFamily="monospace">NAND</text>
      </svg>

      <Handle type="source" position={Position.Right} id="output"
        style={{ ...handleStyle(active), top: 26, right: -6, position: 'absolute' }} />
      <div style={{ position: 'absolute', top: -16, left: 0, right: 0, textAlign: 'center',
        fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold', color: active ? '#22c55e' : '#64748b' }}>
        {data.label || 'NAND'}
      </div>
    </div>
  );
});
NandGateNode.displayName = 'NandGateNode';

// ─── NOR GATE ────────────────────────────────────────────────────────────────
export const NorGateNode = memo(({ id, data, selected }) => {
  const isRunning = useStore(s => s.isRunning);
  const active = isRunning && data.output === 1;
  const color = active ? '#22c55e' : '#ef4444';
  const glow = active ? 'drop-shadow(0 0 4px #22c55e)' : (selected ? 'drop-shadow(0 0 6px #ef4444)' : 'none');

  return (
    <div style={nodeStyle(active)}>
      <Handle type="target" position={Position.Left} id="input-a"
        style={{ ...handleStyle(active), top: 14, left: -6, position: 'absolute' }} />
      <Handle type="target" position={Position.Left} id="input-b"
        style={{ ...handleStyle(active), top: 36, left: -6, position: 'absolute' }} />

      <svg width="84" height="52" viewBox="0 0 84 52" style={{ display: 'block', filter: glow }}>
        <path d="M8 6 Q22 6 34 6 Q60 6 64 26 Q60 46 34 46 Q22 46 8 46 Q18 26 8 6 Z"
          fill="#1e293b" stroke={color} strokeWidth="1.8" />
        <circle cx="69" cy="26" r="5"
          fill="#1e293b" stroke={color} strokeWidth="1.8" />
        <line x1="0" y1="16" x2="14" y2="16" stroke={color} strokeWidth="1.5" />
        <line x1="0" y1="36" x2="14" y2="36" stroke={color} strokeWidth="1.5" />
        <line x1="74" y1="26" x2="84" y2="26" stroke={color} strokeWidth="1.5" />
        <text x="34" y="30" textAnchor="middle" fontSize="8" fill={color}
          fontWeight="bold" fontFamily="monospace">NOR</text>
      </svg>

      <Handle type="source" position={Position.Right} id="output"
        style={{ ...handleStyle(active), top: 26, right: -6, position: 'absolute' }} />
      <div style={{ position: 'absolute', top: -16, left: 0, right: 0, textAlign: 'center',
        fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold', color: active ? '#22c55e' : '#64748b' }}>
        {data.label || 'NOR'}
      </div>
    </div>
  );
});
NorGateNode.displayName = 'NorGateNode';

// ─── XOR GATE ────────────────────────────────────────────────────────────────
export const XorGateNode = memo(({ id, data, selected }) => {
  const isRunning = useStore(s => s.isRunning);
  const active = isRunning && data.output === 1;
  const color = active ? '#22c55e' : '#06b6d4';
  const glow = active ? 'drop-shadow(0 0 4px #22c55e)' : (selected ? 'drop-shadow(0 0 6px #06b6d4)' : 'none');

  return (
    <div style={nodeStyle(active)}>
      <Handle type="target" position={Position.Left} id="input-a"
        style={{ ...handleStyle(active), top: 14, left: -6, position: 'absolute' }} />
      <Handle type="target" position={Position.Left} id="input-b"
        style={{ ...handleStyle(active), top: 36, left: -6, position: 'absolute' }} />

      <svg width="80" height="52" viewBox="0 0 80 52" style={{ display: 'block', filter: glow }}>
        {/* XOR body */}
        <path d="M14 6 Q28 6 40 6 Q66 6 70 26 Q66 46 40 46 Q28 46 14 46 Q24 26 14 6 Z"
          fill="#1e293b" stroke={color} strokeWidth="1.8" />
        {/* Extra curved line for XOR */}
        <path d="M8 6 Q18 26 8 46" fill="none" stroke={color} strokeWidth="1.8" />
        <line x1="0" y1="16" x2="16" y2="16" stroke={color} strokeWidth="1.5" />
        <line x1="0" y1="36" x2="16" y2="36" stroke={color} strokeWidth="1.5" />
        <line x1="70" y1="26" x2="80" y2="26" stroke={color} strokeWidth="1.5" />
        <text x="40" y="30" textAnchor="middle" fontSize="8" fill={color}
          fontWeight="bold" fontFamily="monospace">XOR</text>
      </svg>

      <Handle type="source" position={Position.Right} id="output"
        style={{ ...handleStyle(active), top: 26, right: -6, position: 'absolute' }} />
      <div style={{ position: 'absolute', top: -16, left: 0, right: 0, textAlign: 'center',
        fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold', color: active ? '#22c55e' : '#64748b' }}>
        {data.label || 'XOR'}
      </div>
    </div>
  );
});
XorGateNode.displayName = 'XorGateNode';

// ─── XNOR GATE ───────────────────────────────────────────────────────────────
export const XnorGateNode = memo(({ id, data, selected }) => {
  const isRunning = useStore(s => s.isRunning);
  const active = isRunning && data.output === 1;
  const color = active ? '#22c55e' : '#10b981';
  const glow = active ? 'drop-shadow(0 0 4px #22c55e)' : (selected ? 'drop-shadow(0 0 6px #10b981)' : 'none');

  return (
    <div style={nodeStyle(active)}>
      <Handle type="target" position={Position.Left} id="input-a"
        style={{ ...handleStyle(active), top: 14, left: -6, position: 'absolute' }} />
      <Handle type="target" position={Position.Left} id="input-b"
        style={{ ...handleStyle(active), top: 36, left: -6, position: 'absolute' }} />

      <svg width="88" height="52" viewBox="0 0 88 52" style={{ display: 'block', filter: glow }}>
        <path d="M14 6 Q28 6 38 6 Q64 6 68 26 Q64 46 38 46 Q28 46 14 46 Q24 26 14 6 Z"
          fill="#1e293b" stroke={color} strokeWidth="1.8" />
        <path d="M8 6 Q18 26 8 46" fill="none" stroke={color} strokeWidth="1.8" />
        <circle cx="73" cy="26" r="5"
          fill="#1e293b" stroke={color} strokeWidth="1.8" />
        <line x1="0" y1="16" x2="16" y2="16" stroke={color} strokeWidth="1.5" />
        <line x1="0" y1="36" x2="16" y2="36" stroke={color} strokeWidth="1.5" />
        <line x1="78" y1="26" x2="88" y2="26" stroke={color} strokeWidth="1.5" />
        <text x="38" y="30" textAnchor="middle" fontSize="8" fill={color}
          fontWeight="bold" fontFamily="monospace">XNOR</text>
      </svg>

      <Handle type="source" position={Position.Right} id="output"
        style={{ ...handleStyle(active), top: 26, right: -6, position: 'absolute' }} />
      <div style={{ position: 'absolute', top: -16, left: 0, right: 0, textAlign: 'center',
        fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold', color: active ? '#22c55e' : '#64748b' }}>
        {data.label || 'XNOR'}
      </div>
    </div>
  );
});
XnorGateNode.displayName = 'XnorGateNode';

// ─── BUFFER GATE ─────────────────────────────────────────────────────────────
export const BufGateNode = memo(({ id, data, selected }) => {
  const isRunning = useStore(s => s.isRunning);
  const active = isRunning && data.output === 1;
  const color = active ? '#22c55e' : '#64748b';
  const glow = active ? 'drop-shadow(0 0 4px #22c55e)' : (selected ? 'drop-shadow(0 0 6px #64748b)' : 'none');

  return (
    <div style={nodeStyle(active)}>
      <Handle type="target" position={Position.Left} id="input-a"
        style={{ ...handleStyle(active), top: 22, left: -6, position: 'absolute' }} />

      <svg width="56" height="44" viewBox="0 0 56 44" style={{ display: 'block', filter: glow }}>
        <path d="M4 4 L48 22 L4 40 Z"
          fill="#1e293b" stroke={color} strokeWidth="1.8" />
        <line x1="0" y1="22" x2="4" y2="22" stroke={color} strokeWidth="1.5" />
        <line x1="48" y1="22" x2="56" y2="22" stroke={color} strokeWidth="1.5" />
      </svg>

      <Handle type="source" position={Position.Right} id="output"
        style={{ ...handleStyle(active), top: 22, right: -6, position: 'absolute' }} />
      <div style={{ position: 'absolute', top: -16, left: 0, right: 0, textAlign: 'center',
        fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold', color: active ? '#22c55e' : '#64748b' }}>
        {data.label || 'BUF'}
      </div>
    </div>
  );
});
BufGateNode.displayName = 'BufGateNode';
