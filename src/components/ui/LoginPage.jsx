import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { LogoMark, BrandName } from './Logo';

const MOCK_USERS = [
  { username: 'admin', password: 'password123', name: 'Admin User', email: 'admin@electrocircuit.dev' },
  { username: 'demo', password: 'demo', name: 'Demo User', email: 'demo@electrocircuit.dev' },
];

/**
 * LoginPage — Authentication screen with animated background.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const login = useStore(s => s.login);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    if (user) {
      login({ username: user.username, name: user.name, email: user.email });
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Try: admin / password123');
    }
    setLoading(false);
  };

  const handleGuestLogin = () => {
    login({ username: 'guest', name: 'Guest User', email: '' });
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#0a0f1e' }}
    >
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
      />

      {/* Login Card */}
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-deep animate-scale-in"
        style={{
          background: 'rgba(15,23,42,0.9)',
          border: '1px solid rgba(99,102,241,0.3)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Top gradient bar */}
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4, #22c55e)' }} />

        <div className="p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <LogoMark size={44} />
            <div>
              <BrandName size="lg" />
            </div>
          </div>

          <h2 className="text-lg font-bold text-text-primary mb-1">Welcome back</h2>
          <p className="text-xs text-text-muted mb-6">Sign in to access your circuit projects</p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: '#1a2235',
                  border: '1px solid #1e2d40',
                  color: '#f1f5f9',
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#1e2d40'}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="password123"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: '#1a2235',
                    border: '1px solid #1e2d40',
                    color: '#f1f5f9',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#1e2d40'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
              >
                <AlertCircle size={13} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                color: '#fff',
                boxShadow: '0 0 20px rgba(99,102,241,0.4)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: '#1e2d40' }} />
            <span className="text-[10px] text-text-muted">OR</span>
            <div className="flex-1 h-px" style={{ background: '#1e2d40' }} />
          </div>

          {/* Guest */}
          <button
            onClick={handleGuestLogin}
            className="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-bg-hover"
            style={{ border: '1px solid #1e2d40', color: '#94a3b8' }}
          >
            Continue as Guest
          </button>

          {/* Hint */}
          <p className="text-center text-[10px] text-text-muted mt-4 font-mono">
            Demo: <span className="text-accent-purple">admin</span> / <span className="text-accent-purple">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
