/**
 * graphTraversal.js
 * Topological sort (Kahn's Algorithm) for ordering signal propagation.
 * Ensures inputs are evaluated before outputs — no infinite loops.
 */

/**
 * Perform a topological sort on the circuit graph.
 * Source nodes (INPUT, CLOCK, CONSTANT) are placed first.
 * Feedback loops (from flip-flops) are broken by treating clk edges separately.
 *
 * @param {Array} nodes - React Flow nodes array
 * @param {Array} edges - React Flow edges array
 * @returns {string[]} - Ordered array of node IDs (source → sink)
 */
export function topologicalSort(nodes, edges) {
  if (!nodes.length) return [];

  // Build adjacency list and in-degree map
  const inDegree = {};
  const adjacency = {};

  nodes.forEach(n => {
    inDegree[n.id] = 0;
    adjacency[n.id] = [];
  });

  // Only use non-clock edges for topological sort (clock edges create loops)
  edges.forEach(edge => {
    const isClkEdge = edge.targetHandle?.includes('clk');
    if (!isClkEdge) {
      if (adjacency[edge.source] !== undefined) {
        adjacency[edge.source].push(edge.target);
      }
      if (inDegree[edge.target] !== undefined) {
        inDegree[edge.target]++;
      }
    }
  });

  // Source nodes go first
  const sourceTypes = ['INPUT', 'CLOCK', 'CONSTANT'];
  const queue = [];

  nodes.forEach(n => {
    const type = (n.data?.gateType || n.type || '').toUpperCase().replace('GATE', '');
    if (sourceTypes.includes(type) || inDegree[n.id] === 0) {
      queue.push(n.id);
    }
  });

  // Remove duplicates from queue
  const uniqueQueue = [...new Set(queue)];
  const sorted = [];
  const visited = new Set();

  while (uniqueQueue.length > 0) {
    const id = uniqueQueue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    sorted.push(id);

    (adjacency[id] || []).forEach(neighbor => {
      inDegree[neighbor]--;
      if (inDegree[neighbor] <= 0 && !visited.has(neighbor)) {
        uniqueQueue.push(neighbor);
      }
    });
  }

  // Add any remaining nodes (e.g., in cycles from flip-flop feedback)
  nodes.forEach(n => {
    if (!visited.has(n.id)) {
      sorted.push(n.id);
    }
  });

  return sorted;
}

/**
 * Detect if a circuit has combinational feedback loops (cycles).
 * These would cause infinite propagation without a clock.
 */
export function hasCombinationalCycle(nodes, edges) {
  const visited = new Set();
  const inStack = new Set();

  const adjacency = {};
  nodes.forEach(n => (adjacency[n.id] = []));
  edges.forEach(e => {
    if (!e.targetHandle?.includes('clk') && adjacency[e.source]) {
      adjacency[e.source].push(e.target);
    }
  });

  function dfs(id) {
    visited.add(id);
    inStack.add(id);
    for (const neighbor of adjacency[id] || []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (inStack.has(neighbor)) {
        return true;
      }
    }
    inStack.delete(id);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }
  return false;
}

/**
 * Get all nodes that are reachable from a given source node.
 */
export function getReachableNodes(sourceId, nodes, edges) {
  const visited = new Set();
  const queue = [sourceId];
  const adjacency = {};
  nodes.forEach(n => (adjacency[n.id] = []));
  edges.forEach(e => { if (adjacency[e.source]) adjacency[e.source].push(e.target); });

  while (queue.length > 0) {
    const id = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    (adjacency[id] || []).forEach(n => queue.push(n));
  }
  return [...visited];
}
