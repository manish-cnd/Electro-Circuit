# ElectroCircuit 🔌⚡
### Interactive Web-Based Digital Logic Simulator

> Build, wire, and simulate digital logic circuits — entirely in your browser. No installs required.

---

## 🎯 What is ElectroCircuit?

ElectroCircuit is a **fully client-side** drag-and-drop digital logic circuit simulator built with React 18, React Flow, and Zustand.

It solves the #1 pain point of traditional EDA tools:
- ❌ Heavy desktop software (Quartus, Logisim, Multisim)
- ❌ Steep learning curves and outdated UIs
- ❌ No instant visual feedback

ElectroCircuit replaces all of that with:
- ✅ Browser-based, zero-install, zero-backend
- ✅ Real-time glowing wire simulation
- ✅ Drag-and-drop from component library
- ✅ Combinational AND sequential logic (flip-flops, clocks)
- ✅ Live timing diagrams / waveform panel

---

## 🚀 How to Run the Project Locally (Localhost Server)

To view the project and try a demo on your own machine, you need to start the local development server. Follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher) installed on your system.

### 1. Download and Open the Project
Extract the project folder and open your terminal/command prompt inside the project directory:
```bash
# If the folder is named circuit-flow, navigate into it:
cd circuit-flow
```

### 2. Install Dependencies
Run the following command to download all required packages:
```bash
npm install
```

### 3. Start the Local Server
Once installation is complete, start the Vite development server by running:
```bash
npm run dev
```

### 4. Open the App in Your Browser
The terminal will provide a localhost link. Open your browser and navigate to:
**👉 http://localhost:5173**

---

### 🔑 Demo Login Credentials
When you reach the login screen, you can use the following mock credentials to enter the app:
| Username | Password |
|---|---|
| `admin` | `password123` |
| `demo` | `demo` |

---

## 🎮 How to Use the Simulator

1. **Log in** → View/create projects on the Dashboard.
2. **Drag** components from the left sidebar onto the canvas.
3. **Draw wires** by clicking source handles and dragging them to target handles.
4. **Click "Run"** to start the simulation (or press `R`).
5. **Toggle switches** to flip inputs between `0` and `1`.
6. Watch **wires glow green** and **LEDs light up yellow** as logic propagates.
7. Open the **waveform panel** for timing diagrams.
8. **Save** with `Ctrl+S`, and **Export** as JSON or PNG when finished.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `R` | Toggle simulation play/pause |
| `Delete` / `Backspace` | Delete selected nodes or wires |
| `Ctrl+Z` / `Ctrl+Y` | Undo / Redo changes |
| `Ctrl+S` | Save project |
| `Shift + Drag` | Multi-select nodes on canvas |

---

## 🧩 Components Available

- **Gates:** AND, OR, NOT, NAND, NOR, XOR, XNOR, Buffer
- **Sequential:** D Flip-Flop, T Flip-Flop, JK Flip-Flop
- **Inputs:** Toggle Switch, Clock Generator
- **Outputs:** LED Indicator, 7-Segment Display

---

## ⚙️ Tech Stack

React 18 · Vite · React Flow · Zustand · Tailwind CSS · React Router v7

---

## 🔒 Notes

- There is no external backend database — all save data is stored securely in your browser's local storage.
- You can export your circuits as JSON files to back them up or share them with others.
- Optimized for performance with circuits under ~100 nodes.

---
*© 2026 ElectroCircuit. All rights reserved.*
