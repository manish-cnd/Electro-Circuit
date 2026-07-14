import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import { LogoMark, BrandName } from './Logo';
import { Footer } from './Footer';
import {
  Plus, Clock, Trash2, FolderOpen, LogOut, Search,
  Activity, User, ChevronRight, Cpu, Info, BookOpen,
} from 'lucide-react';

/**
 * Dashboard — Project overview with sticky nav, scrollable project grid, and footer.
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const projects = useStore(s => s.projects);
  const user = useStore(s => s.user);
  const logout = useStore(s => s.logout);
  const loadProject = useStore(s => s.loadProject);
  const deleteProject = useStore(s => s.deleteProject);
  const newProject = useStore(s => s.newProject);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleNew = useCallback(() => {
    newProject();
    navigate('/workspace/new');
  }, [newProject, navigate]);

  const handleOpen = useCallback((id) => {
    loadProject(id);
    navigate(`/workspace/${id}`);
  }, [loadProject, navigate]);

  const handleDelete = useCallback((id, e) => {
    e.stopPropagation();
    if (deleteConfirm === id) {
      deleteProject(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  }, [deleteConfirm, deleteProject]);

  const filtered = projects.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const stats = [
    { label: 'Projects', value: projects.length, icon: FolderOpen, color: '#6366f1' },
    { label: 'Total Nodes', value: projects.reduce((s, p) => s + (p.nodes?.length || 0), 0), icon: Cpu, color: '#22c55e' },
    { label: 'Total Wires', value: projects.reduce((s, p) => s + (p.edges?.length || 0), 0), icon: Activity, color: '#06b6d4' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#0a0f1e', overflowY: 'auto' }}
    >
      {/* ── Sticky Top Nav ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 shrink-0"
        style={{
          background: 'rgba(10,15,30,0.95)',
          borderBottom: '1px solid #1e2d40',
          height: 56,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2">
          <LogoMark size={30} />
          <BrandName size="base" />
        </div>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-5">
          <Link
            to="/about"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-white"
            style={{ color: '#64748b' }}
          >
            <Info size={13} />About
          </Link>
          <Link
            to="/help"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-white"
            style={{ color: '#64748b' }}
          >
            <BookOpen size={13} />Docs
          </Link>
        </div>

        {/* User + logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: '#1a2235', border: '1px solid #1e2d40' }}>
            <User size={13} className="text-text-muted" />
            <span className="text-xs font-medium text-text-secondary">{user?.name || 'User'}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors hover:bg-bg-hover"
            style={{ color: '#64748b', border: '1px solid #1e2d40' }}
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </nav>

      {/* ── Main scrollable content ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        {/* Hero Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-text-muted text-sm">Build, simulate, and export digital logic circuits in your browser.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-card p-4 flex items-center gap-3 animate-fade-in">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: stat.color + '22' }}>
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Projects Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary">Your Projects</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-7 pr-3 py-2 text-xs rounded-xl outline-none"
                style={{ background: '#1a2235', border: '1px solid #1e2d40', color: '#f1f5f9', width: 180 }}
              />
            </div>
            <button
              onClick={handleNew}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-glow-purple hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: '#fff' }}
            >
              <Plus size={15} />
              New Project
            </button>
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && !search && (
          <div
            onClick={handleNew}
            className="project-card flex flex-col items-center justify-center p-16 cursor-pointer animate-fade-in"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(99,102,241,0.1)', border: '2px dashed rgba(99,102,241,0.3)' }}
            >
              <Plus size={28} style={{ color: '#6366f1' }} />
            </div>
            <h3 className="text-base font-semibold text-text-secondary mb-1">Create your first project</h3>
            <p className="text-xs text-text-muted">Click to open the circuit editor</p>
          </div>
        )}

        {/* Project Grid — scrollable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className="project-card p-5 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => handleOpen(project.id)}
            >
              {/* Circuit Preview */}
              <div
                className="rounded-xl mb-4 overflow-hidden flex items-center justify-center"
                style={{ height: 100, background: '#060d1a', border: '1px solid #1e2d40' }}
              >
                {project.nodes?.length > 0 ? (
                  <div className="flex items-center gap-1 flex-wrap p-2 justify-center">
                    {project.nodes.slice(0, 8).map((n, ni) => (
                      <div key={ni} className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                        style={{ background: '#1a2235', border: '1px solid #6366f133', color: '#6366f1' }}>
                        {n.data?.gateType || n.type}
                      </div>
                    ))}
                    {project.nodes.length > 8 && (
                      <span className="text-[9px] text-text-muted">+{project.nodes.length - 8} more</span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-text-muted">Empty circuit</span>
                )}
              </div>

              <h3 className="text-sm font-semibold text-text-primary mb-1 truncate">{project.name}</h3>
              <div className="flex items-center gap-3 text-[10px] text-text-muted mb-3">
                <span className="flex items-center gap-1"><Cpu size={10} />{project.nodes?.length || 0} nodes</span>
                <span className="flex items-center gap-1"><Activity size={10} />{project.edges?.length || 0} wires</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-text-muted">
                  <Clock size={10} />{formatDate(project.updatedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={e => handleDelete(project.id, e)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-bg-hover"
                    style={{ color: deleteConfirm === project.id ? '#ef4444' : '#64748b' }}
                    title={deleteConfirm === project.id ? 'Click again to confirm' : 'Delete project'}
                  >
                    <Trash2 size={12} />
                  </button>
                  <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg" style={{ color: '#6366f1' }}>
                    Open <ChevronRight size={10} />
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* New project card (when other projects exist) */}
          {projects.length > 0 && (
            <div className="project-card flex flex-col items-center justify-center p-8 cursor-pointer" onClick={handleNew}>
              <Plus size={24} style={{ color: '#6366f1', marginBottom: 8 }} />
              <span className="text-sm font-medium text-text-muted">New Project</span>
            </div>
          )}
        </div>

        {filtered.length === 0 && search && (
          <div className="text-center py-12">
            <p className="text-text-muted text-sm">No projects matching "{search}"</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
