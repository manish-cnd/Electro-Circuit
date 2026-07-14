/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0f1e',
          secondary: '#0f172a',
          card: '#1a2235',
          hover: '#1e2d47',
        },
        accent: {
          purple: '#6366f1',
          'purple-light': '#818cf8',
          'purple-dark': '#4f46e5',
          green: '#22c55e',
          'green-dark': '#16a34a',
          yellow: '#eab308',
          red: '#ef4444',
          blue: '#3b82f6',
          cyan: '#06b6d4',
        },
        border: {
          DEFAULT: '#1e2d40',
          light: '#2d3f55',
          purple: '#6366f1',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          muted: '#475569',
        },
        gate: {
          bg: '#1a2235',
          border: '#6366f1',
          pin: '#94a3b8',
          'pin-active': '#22c55e',
        },
        wire: {
          high: '#22c55e',
          low: '#374151',
        },
        canvas: {
          bg: '#f0f4f8',
          dot: '#cbd5e1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 12px #22c55e, 0 0 24px rgba(34,197,94,0.4)',
        'glow-sm': '0 0 6px #22c55e, 0 0 12px rgba(34,197,94,0.3)',
        'glow-purple': '0 0 12px #6366f1, 0 0 24px rgba(99,102,241,0.4)',
        'glow-yellow': '0 0 16px #eab308, 0 0 32px rgba(234,179,8,0.5)',
        'glow-red': '0 0 12px #ef4444',
        card: '0 4px 24px rgba(0,0,0,0.4)',
        deep: '0 8px 40px rgba(0,0,0,0.6)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'flow-wire': 'flowWire 0.8s linear infinite',
        'led-on': 'ledOn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px #22c55e, 0 0 16px rgba(34,197,94,0.3)' },
          '50%': { boxShadow: '0 0 20px #22c55e, 0 0 40px rgba(34,197,94,0.6)' },
        },
        flowWire: {
          '0%': { strokeDashoffset: '20' },
          '100%': { strokeDashoffset: '0' },
        },
        ledOn: {
          '0%': { boxShadow: 'none', opacity: '0.6' },
          '100%': { boxShadow: '0 0 20px #eab308, 0 0 40px rgba(234,179,8,0.6)', opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-20px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
