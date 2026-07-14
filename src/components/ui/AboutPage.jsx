import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.jpg';
import { LogoMark, BrandName } from './Logo';
import { Footer } from './Footer';
import useStore from '../../store/useStore';
import {
  Zap, CheckCircle2, XCircle, ArrowRight, Cpu, Activity, Eye,
  ToggleLeft, Grid3x3, Download, Undo2, BookOpen, Users,
  ChevronRight, Star, TrendingUp, Shield, Lightbulb,
} from 'lucide-react';

const problems = [
  {
    problem: 'Heavy desktop software (Quartus, Logisim, Multisim)',
    solution: 'Runs entirely in your browser. No download, no install, no licensing.',
    icon: '⚠️',
  },
  {
    problem: 'Steep learning curves and confusing interfaces',
    solution: 'Intuitive drag-and-drop canvas with labeled schematic symbols. Anyone can start in minutes.',
    icon: '⚠️',
  },
  {
    problem: 'No instant visual feedback — compile and flash to test',
    solution: 'Real-time simulation. Toggle a switch and watch signals propagate in milliseconds.',
    icon: '⚠️',
  },
  {
    problem: 'Closed formats — hard to share and collaborate',
    solution: 'Export circuits as JSON (shareable text) or PNG (presentation-ready image).',
    icon: '⚠️',
  },
];

const features = [
  { icon: Cpu, label: 'All Standard Gates', desc: 'AND, OR, NOT, NAND, NOR, XOR, XNOR, Buffer', color: '#6366f1' },
  { icon: Grid3x3, label: 'Sequential Logic', desc: 'D, T, JK Flip-Flops with rising edge detection', color: '#0ea5e9' },
  { icon: Activity, label: 'Live Waveforms', desc: 'Real-time timing diagram panel for signal analysis', color: '#22c55e' },
  { icon: ToggleLeft, label: 'Interactive Inputs', desc: 'Click switches to toggle 0↔1 during simulation', color: '#f59e0b' },
  { icon: Eye, label: 'Glowing Wires', desc: 'HIGH signals glow green — instantly see signal flow', color: '#ec4899' },
  { icon: Download, label: 'Export Anywhere', desc: 'JSON for re-importing, PNG for reports & sharing', color: '#a855f7' },
  { icon: Undo2, label: 'Undo / Redo', desc: '50-step history — experiment without fear', color: '#06b6d4' },
  { icon: Shield, label: 'Privacy First', desc: 'All data in your browser — nothing sent to servers', color: '#10b981' },
];

/**
 * AboutPage — Describes what ElectroCircuit is, why it exists, and what it solves.
 */
export default function AboutPage() {
  const user = useStore(s => s.user);
  const navigate = useNavigate();

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
          <Link to="/about" style={{ fontSize: 13, color: '#00e5ff', fontWeight: 600 }}>About</Link>
          <Link to="/help" style={{ fontSize: 13, color: '#94a3b8' }} className="hover:text-white transition-colors">Docs</Link>
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

      <main className="flex-1">

        {/* ── Hero ── */}
        <section
          className="relative flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden"
          style={{ borderBottom: '1px solid #1e2d40' }}
        >
          {/* Background grid */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(0,229,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.3) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />
          {/* Glow orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #00e5ff, transparent)' }} />

          <div className="relative z-10">
            <img src={logoImg} alt="ElectroCircuit" className="w-28 h-28 mx-auto mb-4 object-contain" style={{ borderRadius: '12px' }} />
            <h1 className="text-4xl font-bold mb-4 text-white">
              About <span style={{ color: '#00e5ff' }}>ElectroCircuit</span>
            </h1>
            <p
              className="text-base mb-2 font-semibold uppercase tracking-widest"
              style={{ color: '#00e5ff', letterSpacing: '0.15em' }}
            >
              Digital Logic Circuit Simulator
            </p>
            <p className="text-text-muted max-w-xl mx-auto text-sm leading-relaxed">
              An interactive, browser-based drag-and-drop workspace for building, wiring, and running
              live digital logic circuit simulations — with zero installation required.
            </p>
          </div>
        </section>

        {/* ── What & Why ── */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={18} style={{ color: '#00e5ff' }} />
                <h2 className="text-lg font-bold text-white">What is ElectroCircuit?</h2>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                ElectroCircuit is a fully client-side, <strong style={{ color: '#e2e8f0' }}>browser-based digital logic simulator</strong>.
                It allows students, engineers, educators, and hobbyists to visually construct digital circuits using
                standard schematic gate symbols — dragging them onto a canvas, connecting them with wires, and
                watching signals propagate in <strong style={{ color: '#22c55e' }}>real-time with glowing green animations</strong>.
              </p>
              <p className="text-sm leading-relaxed mt-4" style={{ color: '#94a3b8' }}>
                It supports both <strong style={{ color: '#e2e8f0' }}>combinational</strong> circuits (AND, OR, NOT, XOR…) and
                <strong style={{ color: '#e2e8f0' }}> sequential</strong> circuits (D, T, and JK flip-flops with clock signals),
                plus a live <strong style={{ color: '#e2e8f0' }}>timing diagram / waveform panel</strong> for signal analysis.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} style={{ color: '#00e5ff' }} />
                <h2 className="text-lg font-bold text-white">Why was it built?</h2>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                Traditional EDA (Electronic Design Automation) tools like Quartus, Logisim, and Multisim are
                <strong style={{ color: '#ef4444' }}> heavyweight, platform-locked, and intimidating</strong> for beginners.
                They require installation, licensing, and significant setup just to test a simple NAND gate.
              </p>
              <p className="text-sm leading-relaxed mt-4" style={{ color: '#94a3b8' }}>
                ElectroCircuit was built to <strong style={{ color: '#e2e8f0' }}>democratize digital logic education</strong> —
                making circuit simulation as easy as opening a browser tab, with an interface that is
                <strong style={{ color: '#22c55e' }}> modern, intuitive, and visually rewarding</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* ── Problem → Solution ── */}
        <section style={{ background: '#080e1c', borderTop: '1px solid #1e2d40', borderBottom: '1px solid #1e2d40' }}>
          <div className="max-w-4xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-bold text-center text-white mb-2">Problems We Solve</h2>
            <p className="text-center text-sm mb-10" style={{ color: '#64748b' }}>
              Every problem with traditional EDA tools — answered.
            </p>

            <div className="space-y-4">
              {problems.map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: '1px solid #1e2d40' }}
                >
                  <div
                    className="flex items-start gap-3 px-5 py-4"
                    style={{ background: 'rgba(239,68,68,0.06)' }}
                  >
                    <XCircle size={16} style={{ color: '#ef4444', marginTop: 2, flexShrink: 0 }} />
                    <p className="text-sm font-medium" style={{ color: '#fca5a5' }}>{item.problem}</p>
                  </div>
                  <div
                    className="flex items-start gap-3 px-5 py-4"
                    style={{ background: 'rgba(34,197,94,0.06)' }}
                  >
                    <CheckCircle2 size={16} style={{ color: '#22c55e', marginTop: 2, flexShrink: 0 }} />
                    <p className="text-sm" style={{ color: '#86efac' }}>{item.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Grid ── */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center text-white mb-2">Key Features</h2>
          <p className="text-center text-sm mb-10" style={{ color: '#64748b' }}>
            Everything you need to build and verify digital logic in one place.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl p-4 flex flex-col gap-2 transition-all hover:-translate-y-0.5"
                  style={{
                    background: '#1a2235',
                    border: `1px solid ${f.color}22`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = f.color + '55'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = f.color + '22'}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: f.color + '15' }}
                  >
                    <Icon size={16} style={{ color: f.color }} />
                  </div>
                  <p className="text-xs font-bold" style={{ color: f.color }}>{f.label}</p>
                  <p className="text-[11px] leading-relaxed" style={{ color: '#64748b' }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="text-center px-6 py-12" style={{ borderTop: '1px solid #1e2d40' }}>
          <h2 className="text-xl font-bold text-white mb-4">Ready to build your first circuit?</h2>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate(user ? '/workspace/new' : '/login')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', color: '#fff', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}
            >
              Open Simulator <ArrowRight size={15} />
            </button>
            <Link
              to="/help"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ border: '1px solid #1e2d40', color: '#94a3b8' }}
            >
              <BookOpen size={15} /> Read Documentation
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
