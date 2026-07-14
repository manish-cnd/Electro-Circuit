import React, { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import useStore from '../../store/useStore';

const handleStyle = (active, color = '#22c55e') => ({
  width: 10, height: 10, borderRadius: '50%',
  background: active ? color : '#1a2235',
  border: `2px solid ${active ? color : '#6366f1'}`,
  boxShadow: active ? `0 0 6px ${color}` : 'none',
});

// ─── INPUT SWITCH ─────────────────────────────────────────────────────────────
export const InputSwitchNode = memo(({ id, data, selected }) => {
  const updateNodeData = useStore(s => s.updateNodeData);
  const isRunning = useStore(s => s.isRunning);
  const value = data.value ?? 0;
  const active = value === 1;

  const toggle = useCallback((e) => {
    e.stopPropagation();
    const nv = value === 1 ? 0 : 1;
    updateNodeData(id, { value: nv, output: nv });
  }, [id, value, updateNodeData]);

  return (
    <div style={{ padding: 0, background: 'transparent', border: 'none' }}>
      {/* Label pill */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        userSelect: 'none',
      }}>
        <div style={{
          fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          color: active ? '#22c55e' : '#94a3b8',
          background: active ? 'rgba(34,197,94,0.12)' : 'rgba(30,45,64,0.8)',
          border: `1px solid ${active ? '#22c55e' : '#374151'}`,
          borderRadius: 20, padding: '2px 10px',
          boxShadow: active ? '0 0 8px rgba(34,197,94,0.3)' : 'none',
        }}>
          {data.label || 'SW'}
        </div>

        {/* Toggle pill */}
        <div
          onClick={toggle}
          style={{
            position: 'relative', width: 56, height: 26, borderRadius: 13,
            background: active
              ? 'linear-gradient(135deg, #16a34a, #22c55e)'
              : '#1e2d40',
            border: `1.5px solid ${active ? '#22c55e' : '#374151'}`,
            cursor: 'pointer',
            boxShadow: active ? '0 0 12px rgba(34,197,94,0.5)' : 'none',
            transition: 'all 0.25s ease',
          }}
        >
          {/* Thumb */}
          <div style={{
            position: 'absolute', width: 18, height: 18, borderRadius: '50%',
            background: '#ffffff', top: 3,
            left: active ? 34 : 4,
            transition: 'left 0.25s ease',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }} />
          {/* Value text */}
          <span style={{
            position: 'absolute', fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
            top: '50%', transform: 'translateY(-50%)',
            right: active ? 'auto' : 8, left: active ? 8 : 'auto',
            color: active ? 'rgba(255,255,255,0.9)' : '#374151',
          }}>
            {value}
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="output"
        style={{ ...handleStyle(active), position: 'absolute', top: '60%', right: -6 }} />
    </div>
  );
});
InputSwitchNode.displayName = 'InputSwitchNode';


// ─── CLOCK NODE ───────────────────────────────────────────────────────────────
export const ClockNode = memo(({ id, data, selected }) => {
  const isRunning = useStore(s => s.isRunning);
  const active = isRunning && (data.output ?? 0) === 1;
  const color = active ? '#eab308' : '#64748b';

  return (
    <div style={{ padding: 0, background: 'transparent', border: 'none' }}>
      <div style={{
        background: '#1a2235',
        border: `1.5px solid ${active ? '#eab308' : '#374151'}`,
        borderRadius: 10,
        padding: '8px 12px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        boxShadow: active ? '0 0 12px rgba(234,179,8,0.4)' : '0 2px 8px rgba(0,0,0,0.4)',
        transition: 'all 0.2s ease',
        minWidth: 72,
      }}>
        {/* Square-wave icon */}
        <svg width="36" height="16" viewBox="0 0 36 16">
          <polyline
            points="0,12 6,12 6,4 12,4 12,12 18,12 18,4 24,4 24,12 30,12 30,4 36,4"
            fill="none" stroke={color} strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
        <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color }}>
          CLK
        </span>
        <span style={{ fontSize: 8, fontFamily: 'monospace', color: '#475569' }}>
          {data.period ?? 4} ticks
        </span>
        <div style={{
          fontSize: 8, fontFamily: 'monospace', fontWeight: 700,
          background: active ? 'rgba(234,179,8,0.15)' : 'rgba(55,65,81,0.3)',
          color: active ? '#eab308' : '#475569',
          borderRadius: 4, padding: '1px 6px',
        }}>
          {isRunning ? (active ? '▲ HI' : '▼ LO') : 'OFF'}
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="output"
        style={{
          ...handleStyle(active, '#eab308'),
          position: 'absolute', top: '40%', right: -6,
        }} />
    </div>
  );
});
ClockNode.displayName = 'ClockNode';
