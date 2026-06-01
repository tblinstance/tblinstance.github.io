import React, { useState } from 'react';
import { useAppStore } from '../../store/AppStore';
import type { AppState } from '../../store/types';

export function PasswordResetConfirmView() {
  const { loading, confirmPasswordReset, setShowAuth } = useAppStore() as AppState;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Extract uid and token from path: /password/reset/confirm/:uid/:token
  const pathParts = window.location.pathname.split('/');
  const uid = pathParts[4];
  const token = pathParts[5];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    const res = await confirmPasswordReset(uid, token, password);
    if (res?.success) {
      // Redirect to home/login
      window.history.pushState({}, '', '/');
      setShowAuth(true);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg)] font-['Outfit'] animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--primary)] mb-2 tracking-tighter">TBLINC</h1>
            <p className="text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] text-xs">Cloud Infrastructure</p>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-[var(--text-main)] mb-2 tracking-tight">Set New Password</h2>
            <p className="text-[var(--text-muted)] font-medium mb-2">Please enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">New Password</label>
              <div className="relative group">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                  className="input py-4 text-base pr-12" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                >
                  <span className="icon">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Confirm New Password</label>
              <div className="relative group">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                  className="input py-4 text-base pr-12" 
                />
              </div>
            </div>

            <button 
              disabled={loading} 
              type="submit" 
              className="w-full btn btn-primary py-4 text-lg shadow-xl shadow-[var(--primary-transparent)] mt-4"
            >
              {loading ? (
                <><span className="icon animate-spin">refresh</span> Processing...</>
              ) : (
                'Save Password'
              )}
            </button>
          </form>

          <div className="text-center mt-10 space-y-6">
            <div className="pt-6 border-t border-[var(--border)]">
              <button 
                onClick={() => window.location.href = '/'} 
                className="btn btn-ghost text-sm py-2 px-4 group"
              >
                <span className="icon group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Back to website
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
