import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

/**
 * GateSVGs.jsx
 * Shared SVG schematic symbols for all logic gates.
 * Traditional IEEE/ANSI schematic shapes — not plain rectangles.
 */

const PIN_COLOR = '#64748b';
const PIN_ACTIVE = '#22c55e';
const BODY_FILL = '#ffffff';
const BODY_STROKE = '#6366f1';
const STROKE_W = 1.5;

export const AndGateSVG = ({ active = false }) => (
  <svg width="64" height="44" viewBox="0 0 64 44">
    <path
      d="M8 6 H32 Q56 6 56 22 Q56 38 32 38 H8 Z"
      fill={BODY_FILL}
      stroke={active ? '#22c55e' : BODY_STROKE}
      strokeWidth={STROKE_W}
      style={active ? { filter: 'drop-shadow(0 0 4px #22c55e)' } : {}}
    />
    <line x1="0" y1="14" x2="8" y2="14" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
    <line x1="0" y1="30" x2="8" y2="30" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
    <line x1="56" y1="22" x2="64" y2="22" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
  </svg>
);

export const OrGateSVG = ({ active = false }) => (
  <svg width="68" height="44" viewBox="0 0 68 44">
    <path
      d="M8 6 Q20 6 32 6 Q56 6 60 22 Q56 38 32 38 Q20 38 8 38 Q16 22 8 6 Z"
      fill={BODY_FILL}
      stroke={active ? '#22c55e' : '#8b5cf6'}
      strokeWidth={STROKE_W}
      style={active ? { filter: 'drop-shadow(0 0 4px #22c55e)' } : {}}
    />
    <line x1="0" y1="14" x2="12" y2="14" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
    <line x1="0" y1="30" x2="12" y2="30" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
    <line x1="60" y1="22" x2="68" y2="22" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
  </svg>
);

export const NotGateSVG = ({ active = false }) => (
  <svg width="56" height="36" viewBox="0 0 56 36">
    <path
      d="M4 4 L44 18 L4 32 Z"
      fill={BODY_FILL}
      stroke={active ? '#22c55e' : '#ec4899'}
      strokeWidth={STROKE_W}
      style={active ? { filter: 'drop-shadow(0 0 4px #22c55e)' } : {}}
    />
    <circle cx="48" cy="18" r="4" fill={BODY_FILL} stroke={active ? '#22c55e' : '#ec4899'} strokeWidth={STROKE_W} />
    <line x1="0" y1="18" x2="4" y2="18" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
    <line x1="52" y1="18" x2="56" y2="18" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
  </svg>
);

export const NandGateSVG = ({ active = false }) => (
  <svg width="72" height="44" viewBox="0 0 72 44">
    <path
      d="M8 6 H32 Q54 6 54 22 Q54 38 32 38 H8 Z"
      fill={BODY_FILL}
      stroke={active ? '#22c55e' : '#f59e0b'}
      strokeWidth={STROKE_W}
      style={active ? { filter: 'drop-shadow(0 0 4px #22c55e)' } : {}}
    />
    <circle cx="58" cy="22" r="4" fill={BODY_FILL} stroke={active ? '#22c55e' : '#f59e0b'} strokeWidth={STROKE_W} />
    <line x1="0" y1="14" x2="8" y2="14" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
    <line x1="0" y1="30" x2="8" y2="30" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
    <line x1="62" y1="22" x2="72" y2="22" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
  </svg>
);

export const NorGateSVG = ({ active = false }) => (
  <svg width="76" height="44" viewBox="0 0 76 44">
    <path
      d="M8 6 Q20 6 32 6 Q54 6 58 22 Q54 38 32 38 Q20 38 8 38 Q16 22 8 6 Z"
      fill={BODY_FILL}
      stroke={active ? '#22c55e' : '#ef4444'}
      strokeWidth={STROKE_W}
      style={active ? { filter: 'drop-shadow(0 0 4px #22c55e)' } : {}}
    />
    <circle cx="62" cy="22" r="4" fill={BODY_FILL} stroke={active ? '#22c55e' : '#ef4444'} strokeWidth={STROKE_W} />
    <line x1="0" y1="14" x2="12" y2="14" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
    <line x1="0" y1="30" x2="12" y2="30" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
    <line x1="66" y1="22" x2="76" y2="22" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
  </svg>
);

export const XorGateSVG = ({ active = false }) => (
  <svg width="76" height="44" viewBox="0 0 76 44">
    <path
      d="M12 6 Q24 6 36 6 Q58 6 62 22 Q58 38 36 38 Q24 38 12 38 Q20 22 12 6 Z"
      fill={BODY_FILL}
      stroke={active ? '#22c55e' : '#06b6d4'}
      strokeWidth={STROKE_W}
      style={active ? { filter: 'drop-shadow(0 0 4px #22c55e)' } : {}}
    />
    <path d="M6 6 Q14 22 6 38" fill="none" stroke={active ? '#22c55e' : '#06b6d4'} strokeWidth={STROKE_W} />
    <line x1="0" y1="14" x2="14" y2="14" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
    <line x1="0" y1="30" x2="14" y2="30" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
    <line x1="62" y1="22" x2="76" y2="22" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
  </svg>
);

export const XnorGateSVG = ({ active = false }) => (
  <svg width="84" height="44" viewBox="0 0 84 44">
    <path
      d="M12 6 Q24 6 36 6 Q58 6 62 22 Q58 38 36 38 Q24 38 12 38 Q20 22 12 6 Z"
      fill={BODY_FILL}
      stroke={active ? '#22c55e' : '#10b981'}
      strokeWidth={STROKE_W}
      style={active ? { filter: 'drop-shadow(0 0 4px #22c55e)' } : {}}
    />
    <path d="M6 6 Q14 22 6 38" fill="none" stroke={active ? '#22c55e' : '#10b981'} strokeWidth={STROKE_W} />
    <circle cx="66" cy="22" r="4" fill={BODY_FILL} stroke={active ? '#22c55e' : '#10b981'} strokeWidth={STROKE_W} />
    <line x1="0" y1="14" x2="14" y2="14" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
    <line x1="0" y1="30" x2="14" y2="30" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
    <line x1="70" y1="22" x2="84" y2="22" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
  </svg>
);

export const BufferGateSVG = ({ active = false }) => (
  <svg width="56" height="36" viewBox="0 0 56 36">
    <path
      d="M4 4 L48 18 L4 32 Z"
      fill={BODY_FILL}
      stroke={active ? '#22c55e' : '#64748b'}
      strokeWidth={STROKE_W}
      style={active ? { filter: 'drop-shadow(0 0 4px #22c55e)' } : {}}
    />
    <line x1="0" y1="18" x2="4" y2="18" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
    <line x1="48" y1="18" x2="56" y2="18" stroke={PIN_COLOR} strokeWidth={STROKE_W} />
  </svg>
);
