import React, { useState, useCallback } from 'react';
import { COMPONENT_LIBRARY, getGateColor, getGateLabel } from '../../data/componentLibrary';
import { Search, ChevronDown, ChevronRight, Zap, ToggleLeft, Circle, Grid3x3 } from 'lucide-react';
import useStore from '../../store/useStore';

const categoryIcons = {
  'Logic Gates': Zap,
  'Flip-Flops': Grid3x3,
  'Inputs': ToggleLeft,
  'Outputs': Circle,
};

/**
 * MiniGateIcon — Small schematic icon for sidebar items.
 */
function MiniGateIcon({ type, color }) {
  const w = 32, h = 24;
  const stroke = color;
  const fill = '#1a2235';
  const sw = 1.2;

  const paths = {
    AND:  <><path d={`M4 3 H14 Q24 3 24 12 Q24 21 14 21 H4 Z`} fill={fill} stroke={stroke} strokeWidth={sw}/><line x1="0" y1="8" x2="4" y2="8" stroke={stroke} strokeWidth={sw}/><line x1="0" y1="16" x2="4" y2="16" stroke={stroke} strokeWidth={sw}/><line x1="24" y1="12" x2="28" y2="12" stroke={stroke} strokeWidth={sw}/></>,
    OR:   <><path d={`M4 3 Q10 3 16 3 Q26 3 28 12 Q26 21 16 21 Q10 21 4 21 Q8 12 4 3 Z`} fill={fill} stroke={stroke} strokeWidth={sw}/><line x1="0" y1="8" x2="6" y2="8" stroke={stroke} strokeWidth={sw}/><line x1="0" y1="16" x2="6" y2="16" stroke={stroke} strokeWidth={sw}/><line x1="28" y1="12" x2="32" y2="12" stroke={stroke} strokeWidth={sw}/></>,
    NOT:  <><path d={`M2 3 L22 12 L2 21 Z`} fill={fill} stroke={stroke} strokeWidth={sw}/><circle cx="25" cy="12" r="3" fill={fill} stroke={stroke} strokeWidth={sw}/><line x1="0" y1="12" x2="2" y2="12" stroke={stroke} strokeWidth={sw}/><line x1="28" y1="12" x2="32" y2="12" stroke={stroke} strokeWidth={sw}/></>,
    NAND: <><path d={`M4 3 H14 Q23 3 23 12 Q23 21 14 21 H4 Z`} fill={fill} stroke={stroke} strokeWidth={sw}/><circle cx="26" cy="12" r="3" fill={fill} stroke={stroke} strokeWidth={sw}/><line x1="0" y1="8" x2="4" y2="8" stroke={stroke} strokeWidth={sw}/><line x1="0" y1="16" x2="4" y2="16" stroke={stroke} strokeWidth={sw}/><line x1="29" y1="12" x2="32" y2="12" stroke={stroke} strokeWidth={sw}/></>,
    NOR:  <><path d={`M4 3 Q10 3 14 3 Q24 3 26 12 Q24 21 14 21 Q10 21 4 21 Q8 12 4 3 Z`} fill={fill} stroke={stroke} strokeWidth={sw}/><circle cx="29" cy="12" r="3" fill={fill} stroke={stroke} strokeWidth={sw}/><line x1="0" y1="8" x2="6" y2="8" stroke={stroke} strokeWidth={sw}/><line x1="0" y1="16" x2="6" y2="16" stroke={stroke} strokeWidth={sw}/><line x1="32" y1="12" x2="32" y2="12" stroke={stroke} strokeWidth={sw}/></>,
    XOR:  <><path d={`M6 3 Q12 3 18 3 Q28 3 30 12 Q28 21 18 21 Q12 21 6 21 Q10 12 6 3 Z`} fill={fill} stroke={stroke} strokeWidth={sw}/><path d={`M3 3 Q7 12 3 21`} fill="none" stroke={stroke} strokeWidth={sw}/><line x1="0" y1="8" x2="7" y2="8" stroke={stroke} strokeWidth={sw}/><line x1="0" y1="16" x2="7" y2="16" stroke={stroke} strokeWidth={sw}/><line x1="30" y1="12" x2="32" y2="12" stroke={stroke} strokeWidth={sw}/></>,
    XNOR: <><path d={`M6 3 Q12 3 16 3 Q26 3 28 12 Q26 21 16 21 Q12 21 6 21 Q10 12 6 3 Z`} fill={fill} stroke={stroke} strokeWidth={sw}/><path d={`M3 3 Q7 12 3 21`} fill="none" stroke={stroke} strokeWidth={sw}/><circle cx="30" cy="12" r="2" fill={fill} stroke={stroke} strokeWidth={sw}/><line x1="0" y1="8" x2="7" y2="8" stroke={stroke} strokeWidth={sw}/><line x1="0" y1="16" x2="7" y2="16" stroke={stroke} strokeWidth={sw}/><line x1="32" y1="12" x2="32" y2="12" stroke={stroke} strokeWidth={sw}/></>,
    BUF:  <><path d={`M2 3 L28 12 L2 21 Z`} fill={fill} stroke={stroke} strokeWidth={sw}/><line x1="0" y1="12" x2="2" y2="12" stroke={stroke} strokeWidth={sw}/><line x1="28" y1="12" x2="32" y2="12" stroke={stroke} strokeWidth={sw}/></>,
  };

  const genericBox = (label) => (
    <>
      <rect x="4" y="3" width="24" height="18" rx="3" fill={fill} stroke={stroke} strokeWidth={sw}/>
      <text x="16" y="15" textAnchor="middle" fontSize="7" fill={stroke} fontWeight="bold" fontFamily="monospace">{label}</text>
    </>
  );

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {paths[type] || genericBox(getGateLabel(type))}
    </svg>
  );
}

/**
 * Sidebar — Draggable component library panel.
 */
export default function Sidebar() {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState({});
  const addNode = useStore(s => s.addNode);

  // Double-click adds component to canvas center as a quick alternative to drag
  const handleDoubleClick = useCallback((type) => {
    addNode(type, { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 });
  }, [addNode]);

  const toggleCategory = useCallback((cat) => {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }));
  }, []);

  const onDragStart = useCallback((event, type) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const filtered = COMPONENT_LIBRARY.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      !search ||
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <aside
      className="flex flex-col h-full overflow-hidden"
      style={{
        width: 220,
        background: '#0f172a',
        borderRight: '1px solid #1e2d40',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div className="px-3 pt-4 pb-3" style={{ borderBottom: '1px solid #1e2d40' }}>
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">
          Components
        </h3>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg outline-none"
            style={{
              background: '#1a2235',
              border: '1px solid #1e2d40',
              color: '#f1f5f9',
              fontFamily: 'Inter, sans-serif',
            }}
          />
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {filtered.map(category => {
          const isCollapsed = collapsed[category.category];
          const Icon = categoryIcons[category.category] || Zap;

          return (
            <div key={category.category}>
              {/* Category Header */}
              <button
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:bg-bg-hover mb-1"
                style={{ color: '#94a3b8' }}
                onClick={() => toggleCategory(category.category)}
              >
                <Icon size={12} />
                <span className="flex-1 text-left uppercase tracking-wider text-[10px]">
                  {category.category}
                </span>
                {isCollapsed
                  ? <ChevronRight size={10} />
                  : <ChevronDown size={10} />
                }
              </button>

              {/* Gate Items */}
              {!isCollapsed && (
                <div className="grid grid-cols-2 gap-1 mb-2">
                  {category.items.map(item => {
                    const color = getGateColor(item.type);
                    return (
                      <div
                        key={item.type}
                        draggable
                        onDragStart={(e) => onDragStart(e, item.type)}
                        onDoubleClick={() => handleDoubleClick(item.type)}
                        title={`${item.description} — Double-click to add`}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 hover:-translate-y-0.5 select-none"
                        style={{
                          background: '#1a2235',
                          border: `1px solid ${color}33`,
                          minHeight: 64,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = color + '88';
                          e.currentTarget.style.boxShadow = `0 0 8px ${color}33`;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = color + '33';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <MiniGateIcon type={item.type} color={color} />
                        <span
                          className="text-[10px] font-mono font-bold text-center leading-tight"
                          style={{ color }}
                        >
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-muted text-xs">No components found</p>
          </div>
        )}
      </div>

      {/* Hint */}
      <div
        className="px-3 py-2 text-[10px] text-text-muted text-center"
        style={{ borderTop: '1px solid #1e2d40' }}
      >
        Drag or double-click to add to canvas
      </div>
    </aside>
  );
}
