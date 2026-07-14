import React, { useCallback, useRef, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import useStore from '../../store/useStore';
import GlowingWireEdge from '../edges/GlowingWireEdge';
import {
  AndGateNode, OrGateNode, NotGateNode, NandGateNode,
  NorGateNode, XorGateNode, XnorGateNode, BufGateNode,
} from '../nodes/LogicGateNodes';
import { InputSwitchNode, ClockNode } from '../nodes/InputNodes';
import { OutputLedNode, SevenSegmentNode } from '../nodes/OutputNodes';
import { DFlipFlopNode, TFlipFlopNode, JKFlipFlopNode } from '../nodes/FlipFlopNodes';

/* ─── Register all custom node types ─── */
const nodeTypes = {
  andgate:     AndGateNode,
  orgate:      OrGateNode,
  notgate:     NotGateNode,
  nandgate:    NandGateNode,
  norgate:     NorGateNode,
  xorgate:     XorGateNode,
  xnorgate:    XnorGateNode,
  bufgate:     BufGateNode,
  inputgate:   InputSwitchNode,
  clockgate:   ClockNode,
  ledgate:     OutputLedNode,
  seven_seggate: SevenSegmentNode,
  d_ffgate:    DFlipFlopNode,
  t_ffgate:    TFlipFlopNode,
  jk_ffgate:   JKFlipFlopNode,
};

/* ─── Register all custom edge types ─── */
const edgeTypes = {
  glowingWire: GlowingWireEdge,
};

/* ─── Default edge options ─── */
const defaultEdgeOptions = {
  type: 'glowingWire',
  data: { active: false },
};

export default function SimulatorCanvas() {
  const nodes        = useStore(s => s.nodes);
  const edges        = useStore(s => s.edges);
  const onNodesChange = useStore(s => s.onNodesChange);
  const onEdgesChange = useStore(s => s.onEdgesChange);
  const onConnect    = useStore(s => s.onConnect);
  const addNode      = useStore(s => s.addNode);
  const setSelectedNode = useStore(s => s.setSelectedNode);
  const isRunning    = useStore(s => s.isRunning);

  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  /* ─── Handle drop from sidebar ─── */
  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    addNode(type, position);
  }, [screenToFlowPosition, addNode]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /* ─── Node selection ─── */
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node.id);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const [minimapExpanded, setMinimapExpanded] = React.useState(false);

  return (
    <div
      ref={reactFlowWrapper}
      className="w-full h-full"
      style={{ position: 'relative' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        snapToGrid={true}
        snapGrid={[12, 12]}
        connectionLineStyle={{
          stroke: '#6366f1',
          strokeWidth: 2,
          strokeDasharray: '6 3',
        }}
        connectionLineType="bezier"
        deleteKeyCode={['Delete', 'Backspace']}
        multiSelectionKeyCode="Shift"
        selectNodesOnDrag={false}
        elevateEdgesOnSelect={true}
        minZoom={0.1}
        maxZoom={4}
        style={{ background: '#f0f4f8' }}
        proOptions={{ hideAttribution: true }}
      >
        {/* Dot grid background */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#cbd5e1"
          style={{ background: '#f0f4f8' }}
        />

        {/* Zoom controls — styled for visibility on light canvas */}
        <Controls
          showInteractive={false}
          style={{
            bottom: 100,
            left: 16,
            background: '#1a2235',
            border: '1px solid #374151',
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          }}
        />

        {/* Mini-map with label and expand toggle */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          {/* Map label bar */}
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#1a2235', borderRadius: '8px 8px 0 0',
              borderTop: '1px solid #374151', borderLeft: '1px solid #374151', borderRight: '1px solid #374151',
              padding: '3px 8px',
            }}
          >
            <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>
              🗺 CIRCUIT MAP
            </span>
            <button
              onClick={() => setMinimapExpanded(v => !v)}
              title={minimapExpanded ? 'Shrink map' : 'Expand map'}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#64748b', fontSize: 10, padding: '0 2px',
                display: 'flex', alignItems: 'center',
              }}
            >
              {minimapExpanded ? '⊡' : '⊞'}
            </button>
          </div>

          <MiniMap
            nodeColor={(n) => {
              const type = n.data?.gateType || '';
              if (type === 'INPUT') return '#22c55e';
              if (type === 'CLOCK') return '#eab308';
              if (type === 'LED') return '#f97316';
              return '#6366f1';
            }}
            maskColor="rgba(10, 15, 30, 0.75)"
            style={{
              margin: 0,
              position: 'static',
              bottom: 'auto',
              right: 'auto',
              width: minimapExpanded ? 240 : 160,
              height: minimapExpanded ? 180 : 120,
              borderRadius: '0 0 8px 8px',
              border: '1px solid #374151',
              borderTop: 'none',
              background: '#0f172a',
              transition: 'width 0.2s ease, height 0.2s ease',
            }}
            pannable
            zoomable
          />
        </div>

        {/* Simulation running indicator */}
        {isRunning && (
          <div
            style={{
              position: 'absolute', top: 12, right: 12,
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 20,
              fontSize: 11, fontFamily: 'monospace', fontWeight: 700,
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.4)',
              color: '#22c55e',
              backdropFilter: 'blur(8px)',
              zIndex: 10,
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 0 0 rgba(34,197,94,0.6)',
              animation: 'simPulse 1s infinite',
              display: 'inline-block',
            }} />
            ● SIMULATING
          </div>
        )}
      </ReactFlow>
    </div>
  );
}
