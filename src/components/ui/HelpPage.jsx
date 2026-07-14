import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoMark, BrandName } from './Logo';
import { Footer } from './Footer';
import useStore from '../../store/useStore';
import { ChevronDown, ChevronRight, ArrowRight, Play, Cpu, ToggleLeft, Activity, Download } from 'lucide-react';

const sections = [
  {
    id: 'intro',
    title: '🚀 Getting Started',
    icon: '🚀',
    content: [
      {
        heading: 'Step 1 — Sign In',
        body: 'Open ElectroCircuit in your browser and sign in. Use the demo credentials: username "admin", password "password123". You can also click "Continue as Guest" for quick access without credentials.',
      },
      {
        heading: 'Step 2 — Create a New Project',
        body: 'On the Dashboard, click the "New Project" button (top right). This opens the circuit workspace — a blank canvas where you\'ll build your circuit.',
      },
      {
        heading: 'Step 3 — Name Your Project',
        body: 'Click on "Untitled Project" in the toolbar to rename it. Your project is auto-saved every 30 seconds, or manually with Ctrl+S.',
      },
    ],
  },
  {
    id: 'components',
    title: '🧩 Adding Components',
    content: [
      {
        heading: 'The Component Sidebar',
        body: 'On the left side you\'ll find the component library panel (labeled "COMPONENTS"). It\'s organized into four categories: Logic Gates, Flip-Flops, Inputs, and Outputs.',
      },
      {
        heading: 'Method 1: Drag and Drop',
        body: 'Click and hold any component card in the sidebar, then drag it onto the canvas. Release to place it. Components snap to a 12px grid for alignment.',
      },
      {
        heading: 'Method 2: Double-Click',
        body: 'Double-click any component card in the sidebar to instantly add it near the center of the canvas. This is the fastest way to add multiple components.',
      },
      {
        heading: 'Searching Components',
        body: 'Use the Search bar at the top of the sidebar to filter components by name (e.g., type "AND" to find the AND Gate).',
      },
    ],
  },
  {
    id: 'wiring',
    title: '🔌 Drawing Wires',
    content: [
      {
        heading: 'Understanding Handles',
        body: 'Each gate has connection points called "handles". Circular dots on the left are input handles. Circular dots on the right are output handles.',
      },
      {
        heading: 'Connecting Components',
        body: 'Click on an OUTPUT handle (right side of a gate), hold the mouse button, drag across to an INPUT handle (left side of another gate), then release. A wire is drawn automatically.',
      },
      {
        heading: 'Wire Rules',
        body: 'Each input handle can only have ONE incoming wire. Output handles can connect to multiple inputs. You cannot connect output-to-output or input-to-input.',
      },
      {
        heading: 'Deleting Wires',
        body: 'Click on a wire to select it (it highlights blue). Press the Delete or Backspace key to remove it.',
      },
    ],
  },
  {
    id: 'simulation',
    title: '▶️ Running Simulation',
    content: [
      {
        heading: 'Starting the Simulation',
        body: 'Click the "Run" button in the center of the top toolbar (or press the R key). The button turns green and shows "Pause". A "SIMULATING" badge appears on the canvas.',
      },
      {
        heading: 'What Happens During Simulation',
        body: 'The engine runs a topological sort to determine signal propagation order. Then every tick (default 200ms), it recalculates all gate outputs and updates wire states. HIGH (1) signals make wires glow green.',
      },
      {
        heading: 'Interacting While Running',
        body: 'Click on any Switch input node to toggle it between 0 and 1 while simulation is running. Watch how the signals propagate through connected gates instantly.',
      },
      {
        heading: 'Stopping the Simulation',
        body: 'Click "Pause" (or press R again). All wires return to their normal gray color and nodes reset. Your circuit layout is preserved.',
      },
      {
        heading: 'Changing Clock Speed',
        body: 'Click the clock speed dropdown (next to the Run button) to choose Slow (500ms), Normal (200ms), Fast (100ms), or Turbo (50ms).',
      },
    ],
  },
  {
    id: 'components-guide',
    title: '📖 Component Reference',
    content: [
      {
        heading: 'Logic Gates',
        body: 'AND Gate: Output is 1 only when BOTH inputs are 1.\nOR Gate: Output is 1 when ANY input is 1.\nNOT Gate: Inverts the input (0→1, 1→0).\nNAND Gate: NOT-AND — output is 0 only when all inputs are 1.\nNOR Gate: NOT-OR — output is 1 only when all inputs are 0.\nXOR Gate: Output is 1 when inputs DIFFER.\nXNOR Gate: Output is 1 when inputs are the SAME.\nBuffer: Passes input unchanged (used to drive multiple gates).',
      },
      {
        heading: 'Flip-Flops',
        body: 'D Flip-Flop: On each rising clock edge (CLK: 0→1), Q copies the value of D.\nT Flip-Flop: On each rising clock edge, if T=1 then Q toggles; if T=0, Q holds.\nJK Flip-Flop: J=1,K=0 → Set (Q=1). J=0,K=1 → Reset (Q=0). J=1,K=1 → Toggle. J=0,K=0 → Hold.\nConnect a Clock node to the CLK input to drive flip-flops automatically.',
      },
      {
        heading: 'Input Nodes',
        body: 'Switch: A manual toggle. Click the slide switch to flip between 0 (gray) and 1 (green) during simulation.\nClock: An auto-oscillating square wave generator. It automatically switches between 0 and 1 at a configurable period (measured in simulation ticks).',
      },
      {
        heading: 'Output Nodes',
        body: 'LED: Lights up bright yellow when its input signal is HIGH (1). Used to visualize boolean outputs.\n7-Segment Display: Receives 4 input bits and displays the corresponding hexadecimal digit (0-F) using a seven-segment LCD-style display.',
      },
    ],
  },
  {
    id: 'waveform',
    title: '📊 Waveform / Timing Diagram',
    content: [
      {
        heading: 'Opening the Waveform Panel',
        body: 'Click the Activity icon (📊) in the top-right toolbar to open the timing diagram panel at the bottom of the screen.',
      },
      {
        heading: 'Monitoring Signals',
        body: 'In the panel header, you\'ll see short buttons for each gate node. Click a button to toggle monitoring for that node. Monitored signals appear as square-wave traces in the diagram.',
      },
      {
        heading: 'Reading the Diagram',
        body: 'Each row shows one signal over time. HIGH (1) draws the trace at the top of its row. LOW (0) keeps it at the bottom. Transitions are shown as vertical edges.',
      },
      {
        heading: 'Expanding the Panel',
        body: 'Click the Maximize (⬜) icon in the panel header to make the waveform panel taller for more detail.',
      },
    ],
  },
  {
    id: 'canvas',
    title: '🗺️ Canvas Navigation',
    content: [
      {
        heading: 'Zoom In / Zoom Out',
        body: 'Use the + and − buttons on the left of the canvas (zoom controls). Alternatively, scroll the mouse wheel over the canvas. Use the "fit" button (⊡) to fit everything in view.',
      },
      {
        heading: 'The Mini-Map (Bottom Right)',
        body: 'The small rectangular window in the bottom-right corner of the canvas is the Mini-Map. It shows a bird\'s-eye view of your entire circuit. You can click and drag within the mini-map to pan the canvas view. Use the label "MAP" at its top. It is zoomable and pannable.',
      },
      {
        heading: 'Panning the Canvas',
        body: 'Hold the middle mouse button and drag. Or hold the Space bar and drag with the left mouse button. The canvas scrolls to reveal any part of your circuit.',
      },
      {
        heading: 'Selecting Components',
        body: 'Click a node to select it (it highlights with a glow). Hold Shift and click multiple nodes to multi-select. Click empty canvas to deselect all.',
      },
    ],
  },
  {
    id: 'shortcuts',
    title: '⌨️ Keyboard Shortcuts',
    content: [
      {
        heading: 'Editing',
        body: 'R — Toggle simulation Run / Pause\nDelete / Backspace — Delete selected nodes or wires\nCtrl + Z — Undo last action\nCtrl + Y — Redo\nCtrl + S — Save project\nCtrl + A — Select all nodes',
      },
      {
        heading: 'Navigation',
        body: 'Scroll Wheel — Zoom in/out\nMiddle Mouse Drag — Pan canvas\nSpace + Drag — Pan canvas\nCtrl + Scroll — Zoom in/out (alternative)',
      },
    ],
  },
  {
    id: 'export',
    title: '💾 Saving & Exporting',
    content: [
      {
        heading: 'Auto-Save',
        body: 'Your project is automatically saved to browser localStorage every 30 seconds. You\'ll see it appear on the Dashboard next time you visit.',
      },
      {
        heading: 'Manual Save',
        body: 'Click the Save icon in the toolbar or press Ctrl+S at any time.',
      },
      {
        heading: 'Export as JSON',
        body: 'Click "Export" (top-right toolbar) → "Download JSON". This saves the full circuit definition (nodes, wires, metadata) as a .json file you can re-import later.',
      },
      {
        heading: 'Export as PNG',
        body: 'Click "Export" → "Export PNG". This takes a screenshot of the canvas and downloads it as an image — perfect for reports, presentations, or sharing.',
      },
    ],
  },
  {
    id: 'tutorial',
    title: '🎓 Build Your First Circuit (Tutorial)',
    content: [
      {
        heading: 'Tutorial: Half Adder',
        body: 'A half adder adds two 1-bit numbers. It has two outputs: Sum (XOR) and Carry (AND).\n\n1. Double-click "Switch" twice → add inputs A and B\n2. Double-click "XOR Gate" → sum gate\n3. Double-click "AND Gate" → carry gate\n4. Double-click "LED" twice → outputs for Sum and Carry\n\nWire: A → XOR input 1, B → XOR input 2, XOR output → Sum LED\nWire: A → AND input 1, B → AND input 2, AND output → Carry LED\n\nPress Run. Toggle Switch A and Switch B and verify truth table.',
      },
      {
        heading: 'Tutorial: SR Latch (using NOR)',
        body: 'An SR latch stores one bit of state.\n\n1. Add two NOR gates\n2. Add two Switch inputs (S and R)\n3. Add two LED outputs (Q and Q̄)\n\nWire: S → NOR1 input A, NOR2 output → NOR1 input B, NOR1 output → Q LED\nWire: R → NOR2 input A, NOR1 output → NOR2 input B, NOR2 output → Q̄ LED\n\nPress Run. Toggle S (Set) → Q turns ON. Toggle R (Reset) → Q turns OFF.',
      },
    ],
  },
];

/**
 * HelpPage — Full documentation and user guide for ElectroCircuit.
 */
export default function HelpPage() {
  const user = useStore(s => s.user);
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState('intro');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0f1e' }}>

      {/* ── Sticky Navbar ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
        style={{ background: 'rgba(10,15,30,0.95)', borderBottom: '1px solid #1e2d40', backdropFilter: 'blur(12px)', height: 56 }}
      >
        <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <LogoMark size={30} />
          <BrandName size="base" />
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/about" style={{ fontSize: 13, color: '#94a3b8' }} className="hover:text-white transition-colors">About</Link>
          <Link to="/help" style={{ fontSize: 13, color: '#00e5ff', fontWeight: 600 }}>Docs</Link>
          <Link to="/dashboard" style={{ fontSize: 13, color: '#94a3b8' }} className="hover:text-white transition-colors">
            {user ? 'Dashboard' : 'Login'}
          </Link>
          {user && (
            <button
              onClick={() => navigate('/workspace/new')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', color: '#fff' }}
            >
              Open Simulator <ArrowRight size={12} />
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">📖 User Guide & Documentation</h1>
          <p className="text-sm" style={{ color: '#64748b' }}>
            Everything you need to know to build circuits and run simulations in ElectroCircuit.
          </p>
        </div>

        <div className="flex gap-8">
          {/* ── Sidebar TOC ── */}
          <aside className="hidden lg:block shrink-0" style={{ width: 200 }}>
            <div className="sticky top-20">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Contents</p>
              <nav className="space-y-1">
                {sections.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setOpenSection(s.id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all"
                    style={{
                      background: openSection === s.id ? 'rgba(0,229,255,0.1)' : 'transparent',
                      color: openSection === s.id ? '#00e5ff' : '#64748b',
                      border: openSection === s.id ? '1px solid rgba(0,229,255,0.2)' : '1px solid transparent',
                    }}
                  >
                    {s.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── Content ── */}
          <div className="flex-1 space-y-3">
            {sections.map(section => (
              <div
                key={section.id}
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid #1e2d40', background: '#0f172a' }}
              >
                {/* Section header */}
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-bg-hover"
                  onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                >
                  <span className="text-sm font-bold text-white">{section.title}</span>
                  {openSection === section.id
                    ? <ChevronDown size={16} style={{ color: '#00e5ff' }} />
                    : <ChevronRight size={16} style={{ color: '#64748b' }} />}
                </button>

                {/* Section body */}
                {openSection === section.id && (
                  <div className="px-6 pb-6 space-y-6" style={{ borderTop: '1px solid #1e2d40' }}>
                    {section.content.map((item, i) => (
                      <div key={i} className="pt-4">
                        <h3 className="text-xs font-bold mb-2" style={{ color: '#00e5ff' }}>{item.heading}</h3>
                        <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#94a3b8' }}>
                          {item.body}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start Banner */}
        <div
          className="mt-10 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4"
          style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(6,182,212,0.15))', border: '1px solid rgba(6,182,212,0.2)' }}
        >
          <div>
            <h3 className="text-base font-bold text-white mb-1">Ready to start building?</h3>
            <p className="text-xs" style={{ color: '#94a3b8' }}>Open the simulator and try the Half Adder tutorial above.</p>
          </div>
          <button
            onClick={() => navigate(user ? '/workspace/new' : '/login')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', color: '#fff', boxShadow: '0 0 16px rgba(6,182,212,0.3)' }}
          >
            <Play size={14} /> Open Simulator
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
