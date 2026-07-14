/**
 * componentLibrary.js
 * Static data describing all available components in the sidebar.
 */

export const COMPONENT_LIBRARY = [
  {
    category: 'Logic Gates',
    icon: '⊕',
    items: [
      { type: 'AND',  label: 'AND Gate',  description: 'Output HIGH only when ALL inputs are HIGH', inputs: 2 },
      { type: 'OR',   label: 'OR Gate',   description: 'Output HIGH when ANY input is HIGH', inputs: 2 },
      { type: 'NOT',  label: 'NOT Gate',  description: 'Inverts the input signal', inputs: 1 },
      { type: 'NAND', label: 'NAND Gate', description: 'NOT-AND: Output LOW only when ALL inputs HIGH', inputs: 2 },
      { type: 'NOR',  label: 'NOR Gate',  description: 'NOT-OR: Output HIGH only when ALL inputs LOW', inputs: 2 },
      { type: 'XOR',  label: 'XOR Gate',  description: 'Output HIGH when inputs DIFFER', inputs: 2 },
      { type: 'XNOR', label: 'XNOR Gate', description: 'Output HIGH when inputs are SAME', inputs: 2 },
      { type: 'BUF',  label: 'Buffer',    description: 'Passes input to output unchanged', inputs: 1 },
    ],
  },
  {
    category: 'Flip-Flops',
    icon: '⟳',
    items: [
      { type: 'D_FF',  label: 'D Flip-Flop',  description: 'Captures D on rising clock edge', inputs: 2 },
      { type: 'T_FF',  label: 'T Flip-Flop',  description: 'Toggles output when T=1 on clock edge', inputs: 2 },
      { type: 'JK_FF', label: 'JK Flip-Flop', description: 'J=Set, K=Reset, both=Toggle', inputs: 3 },
    ],
  },
  {
    category: 'Inputs',
    icon: '↗',
    items: [
      { type: 'INPUT', label: 'Switch',          description: 'Toggle between 0 and 1 manually', inputs: 0 },
      { type: 'CLOCK', label: 'Clock',            description: 'Auto-oscillating clock signal', inputs: 0 },
    ],
  },
  {
    category: 'Outputs',
    icon: '●',
    items: [
      { type: 'LED',       label: 'LED',            description: 'Lights up when input is HIGH', inputs: 1 },
      { type: 'SEVEN_SEG', label: '7-Segment',      description: 'Displays 4-bit binary as hex digit', inputs: 4 },
    ],
  },
];

/**
 * Get gate color by type (for sidebar icons and node headers).
 */
export function getGateColor(type) {
  const colors = {
    AND: '#6366f1',  OR: '#8b5cf6',  NOT: '#ec4899',
    NAND: '#f59e0b', NOR: '#ef4444', XOR: '#06b6d4',
    XNOR: '#10b981', BUF: '#64748b',
    D_FF: '#3b82f6', T_FF: '#0ea5e9', JK_FF: '#6366f1',
    INPUT: '#22c55e', CLOCK: '#eab308',
    LED: '#f97316', SEVEN_SEG: '#a855f7',
  };
  return colors[type] || '#6366f1';
}

/**
 * Get the display name for a gate type.
 */
export function getGateLabel(type) {
  const labels = {
    AND: 'AND', OR: 'OR', NOT: 'NOT', NAND: 'NAND', NOR: 'NOR',
    XOR: 'XOR', XNOR: 'XNOR', BUF: 'BUF',
    D_FF: 'D-FF', T_FF: 'T-FF', JK_FF: 'JK-FF',
    INPUT: 'SW', CLOCK: 'CLK', LED: 'LED', SEVEN_SEG: '7-Seg',
  };
  return labels[type] || type;
}
