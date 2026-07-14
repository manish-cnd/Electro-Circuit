import React, { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getStraightPath, getBezierPath } from 'reactflow';

/**
 * GlowingWireEdge — Custom React Flow edge that glows green when carrying a HIGH signal.
 */
const GlowingWireEdge = memo(({
  id,
  sourceX, sourceY,
  targetX, targetY,
  sourcePosition,
  targetPosition,
  data = {},
  selected,
  markerEnd,
}) => {
  const active = data?.active === true;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY,
    sourcePosition,
    targetX, targetY,
    targetPosition,
  });

  const wireColor = active ? '#22c55e' : '#374151';
  const glowFilter = active
    ? 'drop-shadow(0 0 3px #22c55e) drop-shadow(0 0 6px rgba(34,197,94,0.4))'
    : 'none';

  return (
    <>
      {/* Shadow/glow layer for active wires */}
      {active && (
        <path
          d={edgePath}
          stroke="#22c55e"
          strokeWidth={6}
          fill="none"
          opacity={0.2}
          style={{ pointerEvents: 'none' }}
        />
      )}

      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: wireColor,
          strokeWidth: active ? 2.5 : 2,
          filter: glowFilter,
          transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
          strokeDasharray: active ? '8 3' : 'none',
          animation: active ? 'wireFlow 0.5s linear infinite' : 'none',
        }}
        markerEnd={markerEnd}
      />

      {/* Signal dot indicator on selected wires */}
      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div
              className="flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-mono font-bold shadow-lg"
              style={{
                background: active ? '#22c55e' : '#374151',
                color: active ? '#000' : '#94a3b8',
                border: '2px solid rgba(255,255,255,0.1)',
                boxShadow: active ? '0 0 8px #22c55e' : 'none',
              }}
            >
              {active ? '1' : '0'}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

GlowingWireEdge.displayName = 'GlowingWireEdge';
export default GlowingWireEdge;
