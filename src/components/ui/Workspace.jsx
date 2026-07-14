import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import useStore from '../../store/useStore';
import SimulatorCanvas from '../canvas/SimulatorCanvas';
import Sidebar from './Sidebar';
import TopToolbar from './TopToolbar';
import WaveformPanel from './WaveformPanel';
import ExportModal from './ExportModal';
import { useSimulation } from '../../hooks/useSimulation';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { LogoMark, BrandName } from './Logo';
import { PanelLeftClose, PanelLeftOpen, ChevronLeft } from 'lucide-react';

/**
 * Workspace — The main circuit editor page.
 */
function WorkspaceInner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loadProject = useStore(s => s.loadProject);
  const saveProject = useStore(s => s.saveProject);
  const newProject = useStore(s => s.newProject);
  const sidebarOpen = useStore(s => s.sidebarOpen);
  const toggleSidebar = useStore(s => s.toggleSidebar);
  const waveformPanelOpen = useStore(s => s.waveformPanelOpen);
  const notification = useStore(s => s.notification);

  const [exportOpen, setExportOpen] = useState(false);

  useSimulation();
  useKeyboardShortcuts();

  useEffect(() => {
    if (id && id !== 'new') loadProject(id);
    else newProject();
  }, [id]);

  useEffect(() => {
    const iv = setInterval(() => saveProject(), 30000);
    return () => clearInterval(iv);
  }, [saveProject]);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#0a0f1e' }}>

      {/* ── Single Top Bar ── */}
      <header
        className="flex items-center gap-2 px-3 shrink-0"
        style={{ height: 52, background: '#0a0f1e', borderBottom: '1px solid #1e2d40' }}
      >
        {/* Logo / back */}
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
          <LogoMark size={28} />
          <BrandName size="sm" className="hidden sm:flex" />
        </button>

        <ChevronLeft size={14} className="text-text-muted shrink-0" />

        {/* Sidebar toggle */}
        <button onClick={toggleSidebar} className="toolbar-btn p-1.5 shrink-0" title="Toggle sidebar">
          {sidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
        </button>

        <div className="w-px h-6 bg-border shrink-0" />

        {/* Full toolbar fills remaining space */}
        <TopToolbar onExport={() => setExportOpen(true)} />
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && <Sidebar />}

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 relative overflow-hidden">
            <SimulatorCanvas />
          </div>
          {waveformPanelOpen && <WaveformPanel />}
        </div>
      </div>

      {exportOpen && <ExportModal onClose={() => setExportOpen(false)} />}

      {notification && (
        <div className="toast" style={{ borderColor: notification.type === 'success' ? '#22c55e33' : '#1e2d40' }}>
          <div className="w-2 h-2 rounded-full" style={{ background: notification.type === 'success' ? '#22c55e' : '#6366f1' }} />
          <span className="text-sm">{notification.message}</span>
        </div>
      )}
    </div>
  );
}

export default function Workspace() {
  return (
    <ReactFlowProvider>
      <WorkspaceInner />
    </ReactFlowProvider>
  );
}
