import React, { useState, useCallback } from 'react';
import { X, Download, Copy, FileJson, Image } from 'lucide-react';
import useStore from '../../store/useStore';

/**
 * ExportModal — JSON and PNG export dialog.
 */
export default function ExportModal({ onClose }) {
  const nodes = useStore(s => s.nodes);
  const edges = useStore(s => s.edges);
  const projectName = useStore(s => s.projectName);
  const [copied, setCopied] = useState(false);

  const circuitJSON = JSON.stringify({ projectName, nodes, edges, exportedAt: new Date().toISOString() }, null, 2);

  const handleDownloadJSON = useCallback(() => {
    const blob = new Blob([circuitJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [circuitJSON, projectName]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(circuitJSON).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [circuitJSON]);

  const handleDownloadPNG = useCallback(async () => {
    try {
      const { toPng } = await import('html-to-image');
      const canvas = document.querySelector('.react-flow__renderer');
      if (!canvas) return;
      const dataUrl = await toPng(canvas, { backgroundColor: '#f0f4f8' });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${projectName.replace(/\s+/g, '_')}.png`;
      a.click();
    } catch (err) {
      console.error('PNG export failed:', err);
    }
  }, [projectName]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-deep animate-scale-in"
        style={{ background: '#0f172a', border: '1px solid #1e2d40' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #1e2d40' }}>
          <div>
            <h2 className="text-base font-bold text-text-primary">Export Circuit</h2>
            <p className="text-xs text-text-muted mt-0.5">{nodes.length} nodes · {edges.length} wires</p>
          </div>
          <button onClick={onClose} className="toolbar-btn p-1.5">
            <X size={16} />
          </button>
        </div>

        {/* Export Options */}
        <div className="p-6 space-y-3">
          <button
            onClick={handleDownloadJSON}
            className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all hover:-translate-y-0.5"
            style={{
              background: '#1a2235',
              border: '1px solid #6366f144',
              boxShadow: '0 0 0 0 transparent',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 12px rgba(99,102,241,0.2)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#6366f122' }}>
              <FileJson size={20} style={{ color: '#6366f1' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">Download JSON</p>
              <p className="text-xs text-text-muted">Full circuit state — nodes, edges, metadata</p>
            </div>
            <Download size={14} className="text-text-muted" />
          </button>

          <button
            onClick={handleDownloadPNG}
            className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all hover:-translate-y-0.5"
            style={{ background: '#1a2235', border: '1px solid #06b6d444' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 12px rgba(6,182,212,0.2)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#06b6d422' }}>
              <Image size={20} style={{ color: '#06b6d4' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">Export PNG</p>
              <p className="text-xs text-text-muted">Screenshot of the canvas as an image</p>
            </div>
            <Download size={14} className="text-text-muted" />
          </button>
        </div>

        {/* JSON Preview */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-text-muted uppercase tracking-wider">JSON Preview</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-lg transition-colors hover:bg-bg-hover"
              style={{ color: copied ? '#22c55e' : '#64748b' }}
            >
              <Copy size={11} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre
            className="text-[10px] font-mono rounded-xl p-3 overflow-auto max-h-40"
            style={{
              background: '#060d1a',
              border: '1px solid #1e2d40',
              color: '#06b6d4',
              lineHeight: 1.6,
            }}
          >
            {circuitJSON.slice(0, 800)}{circuitJSON.length > 800 ? '\n...' : ''}
          </pre>
        </div>
      </div>
    </div>
  );
}
