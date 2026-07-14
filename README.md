# ElectroCircuit 🔌⚡
### Interactive Web-Based Digital Logic Simulator

> Build, wire, and simulate digital logic circuits — entirely in your browser. No installation required.

---

## 🎯 What is ElectroCircuit?

ElectroCircuit is a **fully client-side** drag-and-drop digital logic circuit simulator built with React 18, React Flow, and Zustand.

It solves the #1 pain point of traditional EDA tools:
- ❌ Heavy desktop software (Quartus, Logisim, Multisim)
- ❌ Steep learning curves and outdated UIs
- ❌ No instant visual feedback

CircuitFlow replaces all of that with:
- ✅ Browser-based, zero-install, zero-backend
- ✅ Real-time glowing wire simulation
- ✅ Drag-and-drop from component library
- ✅ Combinational AND sequential logic (flip-flops, clocks)
- ✅ Live timing diagrams / waveform panel

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ installed

### Installation

```bash
cd circuit-flow
npm install
npm run dev
```

Open: **http://localhost:5173**

### Login Credentials (Mock Auth)
| Username | Password |
|---|---|
| `admin` | `password123` |
| `demo` | `demo` |

---

## 🎮 How to Use

1. **Log in** → View/create projects on the Dashboard
2. **Drag** components from the sidebar onto the canvas
3. **Draw wires** by clicking source handles → dragging to target handles
4. **Click "Run"** to start simulation (or press `R`)
5. **Toggle switches** to flip inputs 0↔1
6. Watch **wires glow green** and **LEDs light up yellow**
7. Open the **waveform panel** for timing diagrams
8. **Save** with `Ctrl+S`, **Export** as JSON or PNG

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `R` | Toggle simulation |
| `Delete` | Delete selected |
| `Ctrl+Z` / `Ctrl+Y` | Undo / Redo |
| `Ctrl+S` | Save |

---

## 🧩 Components Available

**Gates:** AND, OR, NOT, NAND, NOR, XOR, XNOR, Buffer

**Sequential:** D Flip-Flop, T Flip-Flop, JK Flip-Flop

**Inputs:** Toggle Switch, Clock Generator

**Outputs:** LED Indicator, 7-Segment Display

---

## 🏗️ Project Structure

```
src/
├── components/canvas/     # React Flow canvas
├── components/nodes/      # Gate SVG components
├── components/edges/      # Glowing wire edge
├── components/ui/         # Pages & UI components
├── engine/                # Logic evaluator, graph traversal
├── hooks/                 # useSimulation, useKeyboardShortcuts
├── store/                 # Zustand global state
└── data/                  # Component library definitions
```

---

## ⚙️ Tech Stack

React 18 · Vite · React Flow · Zustand · Tailwind CSS · React Router v6

---

## 🔒 Notes

- No backend — all data in browser localStorage
- Export JSON to back up your work
- Best performance with circuits under 100 nodes

---

!! Good Luck  💖 😊 💖 !!
