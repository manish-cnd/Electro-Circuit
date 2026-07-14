import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoMark, BrandName } from './Logo';
import { BookOpen, Info, ArrowRight, X } from 'lucide-react';

/**
 * Footer — Shared footer component for all pages.
 */
export function Footer() {
  return (
    <footer
      className="w-full shrink-0"
      style={{
        background: '#060d1a',
        borderTop: '1px solid #1e2d40',
        padding: '16px 32px',
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <LogoMark size={22} />
          <BrandName size="sm" />
        </div>

        {/* Links */}
        <div className="flex items-center gap-5 text-xs" style={{ color: '#475569' }}>
          <Link to="/about" className="hover:text-cyan-400 transition-colors">About</Link>
          <Link to="/help" className="hover:text-cyan-400 transition-colors">Documentation</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">GitHub</a>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: 11, color: '#374151', fontFamily: 'monospace' }}>
          © 2026 ElectroCircuit. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
