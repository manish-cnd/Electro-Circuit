import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';
import { evaluateGate, evaluateFlipFlop } from '../engine/logicEvaluator';
import { topologicalSort } from '../engine/graphTraversal';

const MAX_HISTORY = 50;

const useStore = create((set, get) => ({
  // ─── Auth ─────────────────────────────────────────────────────────
  user: JSON.parse(localStorage.getItem('cf_user') || 'null'),

  login: (userData) => {
    localStorage.setItem('cf_user', JSON.stringify(userData));
    set({ user: userData });
  },

  logout: () => {
    localStorage.removeItem('cf_user');
    set({ user: null });
  },

  // ─── Project ──────────────────────────────────────────────────────
  projectId: null,
  projectName: 'Untitled Project',
  projects: JSON.parse(localStorage.getItem('cf_projects') || '[]'),

  setProjectName: (name) => set({ projectName: name }),

  saveProject: () => {
    const { nodes, edges, projectId, projectName, projects } = get();
    const id = projectId || `proj-${Date.now()}`;
    const existing = projects.findIndex(p => p.id === id);
    const project = {
      id,
      name: projectName,
      nodes,
      edges,
      updatedAt: new Date().toISOString(),
      createdAt: existing >= 0 ? projects[existing].createdAt : new Date().toISOString(),
      preview: null,
    };
    const updated = existing >= 0
      ? projects.map(p => p.id === id ? project : p)
      : [project, ...projects];
    localStorage.setItem('cf_projects', JSON.stringify(updated));
    set({ projects: updated, projectId: id });
    return id;
  },

  loadProject: (id) => {
    const { projects } = get();
    const project = projects.find(p => p.id === id);
    if (!project) return;
    set({
      nodes: project.nodes,
      edges: project.edges,
      projectId: project.id,
      projectName: project.name,
      isRunning: false,
      waveformData: {},
      history: [],
      historyIndex: -1,
    });
  },

  newProject: () => {
    set({
      nodes: [],
      edges: [],
      projectId: null,
      projectName: 'Untitled Project',
      isRunning: false,
      waveformData: {},
      history: [],
      historyIndex: -1,
    });
  },

  deleteProject: (id) => {
    const { projects } = get();
    const updated = projects.filter(p => p.id !== id);
    localStorage.setItem('cf_projects', JSON.stringify(updated));
    set({ projects: updated });
  },

  // ─── Canvas State ─────────────────────────────────────────────────
  nodes: [],
  edges: [],
  nodeIdCounter: 0,

  onNodesChange: (changes) => {
    set(state => ({ nodes: applyNodeChanges(changes, state.nodes) }));
  },

  onEdgesChange: (changes) => {
    set(state => ({ edges: applyEdgeChanges(changes, state.edges) }));
  },

  onConnect: (connection) => {
    const { pushHistory } = get();
    pushHistory();
    const newEdge = {
      ...connection,
      id: `edge-${Date.now()}`,
      type: 'glowingWire',
      data: { active: false },
    };
    set(state => ({ edges: addEdge(newEdge, state.edges) }));
  },

  addNode: (type, position, extraData = {}) => {
    const { pushHistory } = get();
    pushHistory();
    const id = `${type.toLowerCase()}-${Date.now()}`;
    const defaultData = getDefaultNodeData(type);
    const newNode = {
      id,
      type: type.toLowerCase() + 'gate',
      position,
      data: { ...defaultData, ...extraData, id },
    };
    set(state => ({
      nodes: [...state.nodes, newNode],
    }));
    return id;
  },

  updateNodeData: (id, data) => {
    set(state => ({
      nodes: state.nodes.map(n =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    }));
  },

  deleteSelected: () => {
    const { pushHistory } = get();
    pushHistory();
    set(state => ({
      nodes: state.nodes.filter(n => !n.selected),
      edges: state.edges.filter(e => !e.selected),
    }));
  },

  // ─── Simulation ───────────────────────────────────────────────────
  isRunning: false,
  clockSpeed: 200,
  simulationTick: 0,
  waveformData: {},   // { nodeId: [0, 1, 0, ...] }
  monitoredNodes: [],

  setClockSpeed: (speed) => set({ clockSpeed: speed }),

  startSimulation: () => set({ isRunning: true }),
  stopSimulation: () => {
    const { edges, nodes } = get();
    // Reset all wire glow and node signal states
    set({
      isRunning: false,
      edges: edges.map(e => ({ ...e, data: { ...e.data, active: false } })),
      nodes: nodes.map(n => {
        // Keep INPUT switch values so user doesn't lose their settings
        if (n.data?.gateType === 'INPUT') return { ...n, data: { ...n.data, output: n.data.value ?? 0 } };
        if (n.data?.gateType === 'CLOCK') return { ...n, data: { ...n.data, output: 0 } };
        // All other gates reset output to 0
        return { ...n, data: { ...n.data, output: 0, inputs: Object.fromEntries(Object.keys(n.data.inputs || {}).map(k => [k, 0])) } };
      }),
    });
  },

  toggleSimulation: () => {
    const { isRunning } = get();
    if (isRunning) get().stopSimulation();
    else get().startSimulation();
  },

  runSimulationStep: () => {
    const { nodes, edges, waveformData, simulationTick } = get();
    if (nodes.length === 0) return;

    // Step 1: Topological sort
    const sortedIds = topologicalSort(nodes, edges);

    // Step 2: Build a mutable signal map
    const signalMap = {};
    nodes.forEach(n => {
      signalMap[n.id] = { ...n.data };
    });

    // Step 3: Propagate signals in order
    sortedIds.forEach(id => {
      const node = nodes.find(n => n.id === id);
      if (!node) return;

      const nodeType = node.data.gateType || node.type.replace('Gate', '').toUpperCase();

      if (['INPUT', 'CLOCK', 'CONSTANT'].includes(nodeType)) return;

      // Collect inputs from edges
      const incomingEdges = edges.filter(e => e.target === id);
      const inputs = {};
      incomingEdges.forEach(edge => {
        const srcSignal = signalMap[edge.source];
        // If the wire is coming from the Q' (not-Q) output of a flip-flop,
        // we must use the Qn value, NOT the primary output (which is Q)
        let sourceOutput;
        if (edge.sourceHandle === 'output-qn') {
          sourceOutput = srcSignal?.Qn ?? 0;
        } else {
          sourceOutput = srcSignal?.output ?? 0;
        }
        const handle = edge.targetHandle || 'a';
        const inputKey = handle.replace('input-', '');
        inputs[inputKey] = sourceOutput;
      });

      const isFlipFlop = ['D_FF', 'T_FF', 'JK_FF'].includes(nodeType);

      if (isFlipFlop) {
        // Use evaluateFlipFlop which returns full { Q, Qn, output, prevClk }
        const ffResult = evaluateFlipFlop(nodeType, inputs, signalMap[id]);
        signalMap[id] = { ...signalMap[id], inputs, ...ffResult };
      } else {
        const output = evaluateGate(nodeType, inputs, signalMap[id]);
        signalMap[id] = { ...signalMap[id], inputs, output };
      }
    });

    // Step 4: Update edges based on signal state
    // For output-qn source handle, use Qn value instead of output (which is Q)
    const newEdges = edges.map(edge => {
      const sourceSignal = signalMap[edge.source];
      let active;
      if (edge.sourceHandle === 'output-qn') {
        active = (sourceSignal?.Qn ?? 0) === 1;
      } else {
        active = sourceSignal?.output === 1;
      }
      return { ...edge, data: { ...edge.data, active } };
    });

    // Step 5: Update nodes
    const newNodes = nodes.map(n => ({
      ...n,
      data: { ...n.data, ...signalMap[n.id] },
    }));

    // Step 6: Update waveform data for monitored nodes
    const newWaveform = { ...waveformData };
    newNodes.forEach(n => {
      if (n.data.monitored) {
        if (!newWaveform[n.id]) newWaveform[n.id] = { label: n.data.label || n.id, values: [] };
        newWaveform[n.id].values = [...(newWaveform[n.id].values || []).slice(-200), n.data.output ?? 0];
      }
    });

    set({
      nodes: newNodes,
      edges: newEdges,
      waveformData: newWaveform,
      simulationTick: simulationTick + 1,
    });
  },

  toggleNodeMonitored: (id) => {
    const { nodes, waveformData } = get();
    const node = nodes.find(n => n.id === id);
    if (!node) return;
    const monitored = !node.data.monitored;
    set(state => ({
      nodes: state.nodes.map(n => n.id === id ? { ...n, data: { ...n.data, monitored } } : n),
      waveformData: monitored ? waveformData : Object.fromEntries(
        Object.entries(waveformData).filter(([k]) => k !== id)
      ),
    }));
  },

  // ─── Undo / Redo ──────────────────────────────────────────────────
  history: [],
  historyIndex: -1,

  pushHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const snapshot = { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(snapshot);
    if (newHistory.length > MAX_HISTORY) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const snapshot = history[historyIndex - 1];
    set({ nodes: snapshot.nodes, edges: snapshot.edges, historyIndex: historyIndex - 1 });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const snapshot = history[historyIndex + 1];
    set({ nodes: snapshot.nodes, edges: snapshot.edges, historyIndex: historyIndex + 1 });
  },

  // ─── UI State ─────────────────────────────────────────────────────
  sidebarOpen: true,
  waveformPanelOpen: false,
  propertiesPanelOpen: false,
  selectedNodeId: null,
  notification: null,

  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  toggleWaveformPanel: () => set(s => ({ waveformPanelOpen: !s.waveformPanelOpen })),
  setSelectedNode: (id) => set({ selectedNodeId: id, propertiesPanelOpen: !!id }),

  showNotification: (message, type = 'info') => {
    set({ notification: { message, type } });
    setTimeout(() => set({ notification: null }), 3000);
  },

  // ─── Delete selected nodes/edges ──────────────────────────────────
  deleteSelected: () => {
    const { nodes, edges, pushHistory } = get();
    const selectedNodes = nodes.filter(n => n.selected);
    const selectedEdges = edges.filter(e => e.selected);
    if (selectedNodes.length === 0 && selectedEdges.length === 0) return;
    pushHistory();
    const selectedNodeIds = new Set(selectedNodes.map(n => n.id));
    set({
      nodes: nodes.filter(n => !n.selected),
      edges: edges.filter(e => !e.selected && !selectedNodeIds.has(e.source) && !selectedNodeIds.has(e.target)),
    });
  },
}));

// ─── Helper: default node data by type ───────────────────────────────
function getDefaultNodeData(type) {
  const base = { gateType: type, label: type, output: 0, monitored: false };
  switch (type) {
    case 'AND': case 'OR': case 'NAND': case 'NOR': case 'XOR': case 'XNOR':
      return { ...base, inputs: { a: 0, b: 0 }, inputCount: 2 };
    case 'NOT': case 'BUF':
      return { ...base, inputs: { a: 0 }, inputCount: 1 };
    case 'INPUT':
      return { ...base, gateType: 'INPUT', label: 'A', value: 0, output: 0 };
    case 'CLOCK':
      return { ...base, gateType: 'CLOCK', label: 'CLK', period: 4, tick: 0, output: 0 };
    case 'LED':
      return { ...base, gateType: 'LED', label: 'LED', inputs: { a: 0 } };
    case 'D_FF':
      return { ...base, gateType: 'D_FF', label: 'D-FF', inputs: { d: 0, clk: 0 }, Q: 0, Qn: 1, prevClk: 0 };
    case 'T_FF':
      return { ...base, gateType: 'T_FF', label: 'T-FF', inputs: { t: 0, clk: 0 }, Q: 0, Qn: 1, prevClk: 0 };
    case 'JK_FF':
      return { ...base, gateType: 'JK_FF', label: 'JK-FF', inputs: { j: 0, k: 0, clk: 0 }, Q: 0, Qn: 1, prevClk: 0 };
    case 'SEVEN_SEG':
      return { ...base, gateType: 'SEVEN_SEG', label: '7-Seg', inputs: { a: 0, b: 0, c: 0, d: 0 }, display: 0 };
    default:
      return base;
  }
}

export default useStore;
