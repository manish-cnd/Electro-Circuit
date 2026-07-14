import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import useStore from '../../store/useStore';

const handleStyle = (active, color = '#22c55e') => ({
  width: 10, height: 10, borderRadius: '50%',
  background: active ? color : '#1a2235',
  border: `2px solid ${active ? color : '#6366f1'}`,
  boxShadow: active ? `0 0 5px ${color}` : 'none',
});

// ─── Shared FF body ───────────────────────────────────────────────────────────
function FFBox({ label, color, active, children }) {
  return (
    <div style={{
      background: '#1a2235',
      border: `1.5px solid ${active ? '#22c55e' : color}`,
      borderRadius: 8,
      minWidth: 76,
      padding: '6px 10px',
      display: 'flex', flexDirection: 'column', gap: 3,
      boxShadow: active ? '0 0 12px rgba(34,197,94,0.25)' : '0 2px 8px rgba(0,0,0,0.4)',
      transition: 'all 0.2s ease',
      userSelect: 'none',
    }}>
      {/* Title bar */}
      <div style={{
        textAlign: 'center', fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
        background: color + '20', color,
        borderRadius: 4, padding: '2px 6px',
        marginBottom: 2,
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function FFRow({ pin, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#94a3b8' }}>{pin}</span>
      <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

// ─── D FLIP-FLOP ─────────────────────────────────────────────────────────────
export const DFlipFlopNode = memo(({ id, data, selected }) => {
  const isRunning = useStore(s => s.isRunning);
  const active = isRunning && (data.Q ?? 0) === 1;
  const Q = data.Q ?? 0;
  const Qn = data.Qn ?? 1;

  return (
    <div style={{ padding: 0, background: 'transparent', border: 'none', position: 'relative' }}>
      <div style={{ position: 'absolute', top: -16, left: 0, right: 0, textAlign: 'center',
        fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: active ? '#22c55e' : '#64748b' }}>
        D-FF
      </div>
      <FFBox label="D" color="#3b82f6" active={active}>
        <FFRow pin="D"   value={data.inputs?.d ?? 0}   color={active ? '#22c55e' : '#94a3b8'} />
        <FFRow pin="CLK" value={data.inputs?.clk ?? 0} color="#eab308" />
        <div style={{ height: 1, background: '#1e2d40', margin: '2px 0' }} />
        <FFRow pin="Q"   value={Q}  color={active ? '#22c55e' : '#94a3b8'} />
        <FFRow pin="Q̄"   value={Qn} color={active ? '#ef4444' : '#64748b'} />
      </FFBox>

      <Handle type="target" position={Position.Left} id="input-d"
        style={{ ...handleStyle(active), position: 'absolute', top: '28%', left: -6 }} />
      <Handle type="target" position={Position.Left} id="input-clk"
        style={{ ...handleStyle(active, '#eab308'), position: 'absolute', top: '50%', left: -6 }} />
      <Handle type="source" position={Position.Right} id="output-q"
        style={{ ...handleStyle(active), position: 'absolute', top: '68%', right: -6 }} />
      <Handle type="source" position={Position.Right} id="output-qn"
        style={{ ...handleStyle(false, '#ef4444'), position: 'absolute', top: '84%', right: -6 }} />
    </div>
  );
});
DFlipFlopNode.displayName = 'DFlipFlopNode';

// ─── T FLIP-FLOP ─────────────────────────────────────────────────────────────
export const TFlipFlopNode = memo(({ id, data, selected }) => {
  const isRunning = useStore(s => s.isRunning);
  const active = isRunning && (data.Q ?? 0) === 1;
  const Q = data.Q ?? 0;
  const Qn = data.Qn ?? 1;

  return (
    <div style={{ padding: 0, background: 'transparent', border: 'none', position: 'relative' }}>
      <div style={{ position: 'absolute', top: -16, left: 0, right: 0, textAlign: 'center',
        fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: active ? '#22c55e' : '#64748b' }}>
        T-FF
      </div>
      <FFBox label="T" color="#0ea5e9" active={active}>
        <FFRow pin="T"   value={data.inputs?.t ?? 0}   color={active ? '#22c55e' : '#94a3b8'} />
        <FFRow pin="CLK" value={data.inputs?.clk ?? 0} color="#eab308" />
        <div style={{ height: 1, background: '#1e2d40', margin: '2px 0' }} />
        <FFRow pin="Q"   value={Q}  color={active ? '#22c55e' : '#94a3b8'} />
        <FFRow pin="Q̄"   value={Qn} color={active ? '#ef4444' : '#64748b'} />
      </FFBox>

      <Handle type="target" position={Position.Left} id="input-t"
        style={{ ...handleStyle(active), position: 'absolute', top: '28%', left: -6 }} />
      <Handle type="target" position={Position.Left} id="input-clk"
        style={{ ...handleStyle(active, '#eab308'), position: 'absolute', top: '50%', left: -6 }} />
      <Handle type="source" position={Position.Right} id="output-q"
        style={{ ...handleStyle(active), position: 'absolute', top: '68%', right: -6 }} />
      <Handle type="source" position={Position.Right} id="output-qn"
        style={{ ...handleStyle(false, '#ef4444'), position: 'absolute', top: '84%', right: -6 }} />
    </div>
  );
});
TFlipFlopNode.displayName = 'TFlipFlopNode';

// ─── JK FLIP-FLOP ────────────────────────────────────────────────────────────
export const JKFlipFlopNode = memo(({ id, data, selected }) => {
  const isRunning = useStore(s => s.isRunning);
  const active = isRunning && (data.Q ?? 0) === 1;
  const Q = data.Q ?? 0;
  const Qn = data.Qn ?? 1;

  return (
    <div style={{ padding: 0, background: 'transparent', border: 'none', position: 'relative' }}>
      <div style={{ position: 'absolute', top: -16, left: 0, right: 0, textAlign: 'center',
        fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: active ? '#22c55e' : '#64748b' }}>
        JK-FF
      </div>
      <FFBox label="JK" color="#6366f1" active={active}>
        <FFRow pin="J"   value={data.inputs?.j ?? 0}   color={active ? '#22c55e' : '#94a3b8'} />
        <FFRow pin="K"   value={data.inputs?.k ?? 0}   color={active ? '#ef4444' : '#94a3b8'} />
        <FFRow pin="CLK" value={data.inputs?.clk ?? 0} color="#eab308" />
        <div style={{ height: 1, background: '#1e2d40', margin: '2px 0' }} />
        <FFRow pin="Q"   value={Q}  color={active ? '#22c55e' : '#94a3b8'} />
        <FFRow pin="Q̄"   value={Qn} color={active ? '#ef4444' : '#64748b'} />
      </FFBox>

      <Handle type="target" position={Position.Left} id="input-j"
        style={{ ...handleStyle(active), position: 'absolute', top: '18%', left: -6 }} />
      <Handle type="target" position={Position.Left} id="input-k"
        style={{ ...handleStyle(false, '#ef4444'), position: 'absolute', top: '38%', left: -6 }} />
      <Handle type="target" position={Position.Left} id="input-clk"
        style={{ ...handleStyle(active, '#eab308'), position: 'absolute', top: '56%', left: -6 }} />
      <Handle type="source" position={Position.Right} id="output-q"
        style={{ ...handleStyle(active), position: 'absolute', top: '72%', right: -6 }} />
      <Handle type="source" position={Position.Right} id="output-qn"
        style={{ ...handleStyle(false, '#ef4444'), position: 'absolute', top: '86%', right: -6 }} />
    </div>
  );
});
JKFlipFlopNode.displayName = 'JKFlipFlopNode';
