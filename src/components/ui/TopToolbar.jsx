import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import {
  Play, Pause, Save, Download, Upload, Undo2, Redo2,
  Settings, HelpCircle, Trash2, ChevronDown,
  Activity, BarChart2, Layers, Zap,
} from 'lucide-react';

/**
 * TopToolbar — Main workspace toolbar with simulation controls.
 */
export default function TopToolbar({ onExport, onLoad }) {
  const isRunning      = useStore(s => s.isRunning);
  const toggleSim      = useStore(s => s.toggleSimulation);
  const clockSpeed     = useStore(s => s.clockSpeed);
  const setClockSpeed  = useStore(s => s.setClockSpeed);
  const undo           = useStore(s => s.undo);
  const redo           = useStore(s => s.redo);
  const saveProject    = useStore(s => s.saveProject);
  const projectName    = useStore(s => s.projectName);
  const setProjectName = useStore(s => s.setProjectName);
  const newProject     = useStore(s => s.newProject);
  const nodes          = useStore(s => s.nodes);
  const edges          = useStore(s => s.edges);
  const waveformPanelOpen  = useStore(s => s.waveformPanelOpen);
  const toggleWaveform = useStore(s => s.toggleWaveformPanel);
  const showNotification = useStore(s => s.showNotification);
  const deleteSelected = useStore(s => s.deleteSelected);

  const [editingName, setEditingName] = useState(false);
  const [speedOpen, setSpeedOpen] = useState(false);

  const handleSave = useCallback(() => {
    saveProject();
    showNotification('Project saved!', 'success');
  }, [saveProject, showNotification]);

  const handleNew = useCallback(() => {
    if (nodes.length > 0) {
      if (!window.confirm('Start a new project? Unsaved changes will be lost.')) return;
    }
    newProject();
  }, [nodes, newProject]);

  const speeds = [
    { label: 'Slow (500ms)', value: 500 },
    { label: 'Normal (200ms)', value: 200 },
    { label: 'Fast (100ms)', value: 100 },
    { label: 'Turbo (50ms)', value: 50 },
  ];

  return (
    <div
      className="flex items-center gap-2 flex-1 z-20 overflow-hidden"
    >
      {/* Project Name */}
      <div className="flex items-center gap-2 mr-2">
        <Layers size={14} className="text-accent-purple" />
        {editingName ? (
          <input
            type="text"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            onBlur={() => setEditingName(false)}
            onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
            autoFocus
            className="text-sm font-semibold outline-none bg-transparent border-b border-accent-purple"
            style={{ color: '#f1f5f9', minWidth: 120, maxWidth: 200 }}
          />
        ) : (
          <span
            className="text-sm font-semibold cursor-pointer hover:text-accent-purple-light transition-colors"
            style={{ color: '#f1f5f9', minWidth: 80 }}
            onClick={() => setEditingName(true)}
            title="Click to rename"
          >
            {projectName}
          </span>
        )}
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Undo / Redo */}
      <button onClick={undo} className="toolbar-btn p-1.5" title="Undo (Ctrl+Z)">
        <Undo2 size={15} />
      </button>
      <button onClick={redo} className="toolbar-btn p-1.5" title="Redo (Ctrl+Y)">
        <Redo2 size={15} />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Delete Selected */}
      <button onClick={deleteSelected} className="toolbar-btn p-1.5" title="Delete selected (Del)">
        <Trash2 size={15} />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* ─── SIMULATION CONTROLS (CENTER) ─── */}
      <div className="flex-1 flex items-center justify-center gap-3">
        {/* Run/Pause Toggle */}
        <button
          onClick={toggleSim}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300"
          style={{
            background: isRunning
              ? 'linear-gradient(135deg, #16a34a, #22c55e)'
              : 'linear-gradient(135deg, #4f46e5, #6366f1)',
            color: '#fff',
            boxShadow: isRunning
              ? '0 0 16px rgba(34,197,94,0.5)'
              : '0 0 12px rgba(99,102,241,0.4)',
          }}
          title="Toggle simulation (R)"
        >
          {isRunning
            ? <><Pause size={14} /> Pause</>
            : <><Play size={14} /> Run</>
          }
        </button>

        {/* Clock Speed Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors hover:bg-bg-hover"
            style={{
              background: '#1a2235',
              border: '1px solid #1e2d40',
              color: '#94a3b8',
            }}
            onClick={() => setSpeedOpen(o => !o)}
            title="Clock speed"
          >
            <Zap size={11} />
            {speeds.find(s => s.value === clockSpeed)?.label.split(' ')[0] || 'Speed'}
            <ChevronDown size={10} />
          </button>

          {speedOpen && (
            <div
              className="absolute top-full left-0 mt-1 w-36 rounded-xl overflow-hidden z-50 shadow-deep"
              style={{ background: '#1a2235', border: '1px solid #1e2d40' }}
            >
              {speeds.map(s => (
                <button
                  key={s.value}
                  className="w-full text-left px-3 py-2 text-xs font-mono transition-colors hover:bg-bg-hover"
                  style={{
                    color: clockSpeed === s.value ? '#22c55e' : '#94a3b8',
                    background: clockSpeed === s.value ? 'rgba(34,197,94,0.08)' : 'transparent',
                  }}
                  onClick={() => { setClockSpeed(s.value); setSpeedOpen(false); }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div
          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-mono"
          style={{ background: '#1a2235', border: '1px solid #1e2d40', color: '#64748b' }}
        >
          <span><span style={{ color: '#6366f1' }}>{nodes.length}</span> nodes</span>
          <span><span style={{ color: '#06b6d4' }}>{edges.length}</span> wires</span>
        </div>
      </div>

      {/* ─── RIGHT ACTIONS ─── */}
      {/* Waveform Toggle */}
      <button
        onClick={toggleWaveform}
        className={`toolbar-btn p-1.5 ${waveformPanelOpen ? 'active' : ''}`}
        title="Toggle waveform panel"
      >
        <Activity size={15} />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Save */}
      <button
        onClick={handleSave}
        className="toolbar-btn p-1.5"
        title="Save project (Ctrl+S)"
      >
        <Save size={15} />
      </button>

      {/* Export */}
      <button
        onClick={onExport}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-glow-purple"
        style={{
          background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
          color: '#fff',
        }}
        title="Export circuit"
      >
        <Download size={13} />
        Export
      </button>
    </div>
  );
}
