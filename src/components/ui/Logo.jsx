import React from 'react';

/**
 * LogoMark — The ElectroCircuit SVG logo icon (circuit-E with lightning bolt).
 * Used everywhere the brand mark appears.
 */
export function LogoMark({ size = 32 }) {
  return (
    <img
      src="/logo.jpg"
      alt="ElectroCircuit"
      width={size}
      height={size}
      style={{ objectFit: 'contain', borderRadius: 6 }}
    />
  );
}

/**
 * BrandName — "Electro" + "Circuit" styled text.
 */
export function BrandName({ className = '', size = 'base' }) {
  const sizes = {
    sm: { font: 13, span: 13 },
    base: { font: 16, span: 16 },
    lg: { font: 22, span: 22 },
    xl: { font: 30, span: 30 },
  };
  const s = sizes[size] || sizes.base;

  return (
    <span
      className={className}
      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, letterSpacing: '-0.02em', display: 'inline-flex', alignItems: 'center', gap: 0 }}
    >
      <span style={{ fontSize: s.font, color: '#00e5ff', textShadow: '0 0 12px rgba(0,229,255,0.4)' }}>Electro</span>
      <span style={{ fontSize: s.span, color: '#ffffff' }}>Circuit</span>
    </span>
  );
}

export default LogoMark;
