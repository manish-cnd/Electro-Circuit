/**
 * logicEvaluator.js
 * Pure JavaScript functions for evaluating digital logic gate outputs.
 * No React dependencies — fully testable in isolation.
 */

/**
 * Evaluate a gate given its type and current input signals.
 * @param {string} type - Gate type (AND, OR, NOT, etc.)
 * @param {Object} inputs - Map of input signal values { a: 0|1, b: 0|1, ... }
 * @param {Object} nodeData - Full node data (needed for stateful elements like flip-flops)
 * @returns {number} 0 or 1
 */
export function evaluateGate(type, inputs = {}, nodeData = {}) {
  const vals = Object.values(inputs);
  const a = inputs.a ?? inputs.d ?? inputs.in ?? 0;
  const b = inputs.b ?? 0;

  switch (type.toUpperCase()) {
    // ─── Combinational Gates ───────────────────────────────────────

     // AND Gate: Outputs 1 ONLY if every single input is currently 1.
    case 'AND':
      return vals.length > 0 && vals.every(v => v === 1) ? 1 : 0;

    // OR Gate: Outputs 1 if at least one input is currently 1.
    case 'OR':
      return vals.some(v => v === 1) ? 1 : 0;

     // NOT Gate: Inverts the incoming signal directly.
    case 'NOT':
      return a === 1 ? 0 : 1;

     // NAND Gate: The inverse of AND. Highly optimized evaluation.
    case 'NAND':
      return vals.length > 0 && vals.every(v => v === 1) ? 0 : 1;

    
    case 'NOR':
      return vals.some(v => v === 1) ? 0 : 1;

    case 'XOR':
      return vals.reduce((acc, v) => acc ^ v, 0) ? 1 : 0;

    case 'XNOR':
      return vals.reduce((acc, v) => acc ^ v, 0) ? 0 : 1;

    case 'BUF':
    case 'BUFFER':
      return a;

    // ─── Pass-through / Source nodes ──────────────────────────────
    case 'INPUT':
      return nodeData.value ?? nodeData.output ?? 0;

    case 'CONSTANT':
      return nodeData.value ?? 0;

    case 'CLOCK':
      return nodeData.output ?? 0;

    // ─── Sequential Elements ──────────────────────────────────────
    case 'D_FF': {
      const clk = inputs.clk ?? 0;
      const d = inputs.d ?? 0;
      const prevClk = nodeData.prevClk ?? 0;
      // Rising edge detection
      if (prevClk === 0 && clk === 1) {
        return d; // Q captures D
      }
      return nodeData.Q ?? 0;
    }

    case 'T_FF': {
      const clk = inputs.clk ?? 0;
      const t = inputs.t ?? 0;
      const prevClk = nodeData.prevClk ?? 0;
      const Q = nodeData.Q ?? 0;
      if (prevClk === 0 && clk === 1 && t === 1) {
        return Q === 1 ? 0 : 1; // Toggle
      }
      return Q;
    }

    case 'JK_FF': {
      const clk = inputs.clk ?? 0;
      const j = inputs.j ?? 0;
      const k = inputs.k ?? 0;
      const prevClk = nodeData.prevClk ?? 0;
      const Q = nodeData.Q ?? 0;
      if (prevClk === 0 && clk === 1) {
        if (j === 0 && k === 0) return Q;         // Hold
        if (j === 0 && k === 1) return 0;         // Reset
        if (j === 1 && k === 0) return 1;         // Set
        if (j === 1 && k === 1) return Q ? 0 : 1; // Toggle
      }
      return Q;
    }

    case 'SR_LATCH': {
      const s = inputs.s ?? 0;
      const r = inputs.r ?? 0;
      const Q = nodeData.Q ?? 0;
      if (s === 1 && r === 0) return 1; // Set
      if (s === 0 && r === 1) return 0; // Reset
      if (s === 0 && r === 0) return Q; // Hold
      return Q; // Forbidden state — hold (or could be X)
    }

    // ─── Output Elements ──────────────────────────────────────────
    case 'LED':
      return a;

    case 'SEVEN_SEG': {
      const val = (inputs.d ?? 0) * 8 + (inputs.c ?? 0) * 4 + (inputs.b ?? 0) * 2 + (inputs.a ?? 0);
      return val % 16;
    }

    default:
      console.warn(`Unknown gate type: ${type}`);
      return 0;
  }
}

/**
 * Evaluate flip-flop with state update (returns full updated data).
 * Used separately from evaluateGate to handle state transitions.
 */
export function evaluateFlipFlop(type, inputs, nodeData) {
  const clk = inputs.clk ?? 0;
  const prevClk = nodeData.prevClk ?? 0;
  let Q = nodeData.Q ?? 0;
  let Qn = nodeData.Qn ?? 1;

  switch (type.toUpperCase()) {
    case 'D_FF': {
      const d = inputs.d ?? 0;
      if (prevClk === 0 && clk === 1) { Q = d; Qn = d ? 0 : 1; }
      break;
    }
    case 'T_FF': {
      const t = inputs.t ?? 0;
      if (prevClk === 0 && clk === 1 && t === 1) { Q = Q ? 0 : 1; Qn = Q ? 0 : 1; }
      break;
    }
    case 'JK_FF': {
      const j = inputs.j ?? 0;
      const k = inputs.k ?? 0;
      if (prevClk === 0 && clk === 1) {
        if (j === 0 && k === 0) break;
        if (j === 0 && k === 1) { Q = 0; Qn = 1; break; }
        if (j === 1 && k === 0) { Q = 1; Qn = 0; break; }
        if (j === 1 && k === 1) { Q = Q ? 0 : 1; Qn = Q ? 1 : 0; break; }
      }
      break;
    }
    default: break;
  }

  return { Q, Qn, output: Q, prevClk: clk };
}

/**
 * Get the truth table for a gate type (for display purposes).
 */
export function getTruthTable(type) {
  const tables = {
    AND:  [{ a:0,b:0,out:0 },{ a:0,b:1,out:0 },{ a:1,b:0,out:0 },{ a:1,b:1,out:1 }],
    OR:   [{ a:0,b:0,out:0 },{ a:0,b:1,out:1 },{ a:1,b:0,out:1 },{ a:1,b:1,out:1 }],
    NOT:  [{ a:0,out:1 },{ a:1,out:0 }],
    NAND: [{ a:0,b:0,out:1 },{ a:0,b:1,out:1 },{ a:1,b:0,out:1 },{ a:1,b:1,out:0 }],
    NOR:  [{ a:0,b:0,out:1 },{ a:0,b:1,out:0 },{ a:1,b:0,out:0 },{ a:1,b:1,out:0 }],
    XOR:  [{ a:0,b:0,out:0 },{ a:0,b:1,out:1 },{ a:1,b:0,out:1 },{ a:1,b:1,out:0 }],
    XNOR: [{ a:0,b:0,out:1 },{ a:0,b:1,out:0 },{ a:1,b:0,out:0 },{ a:1,b:1,out:1 }],
  };
  return tables[type.toUpperCase()] || [];
}
