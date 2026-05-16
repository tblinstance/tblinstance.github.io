import React, { useState } from 'react';
import { useAppStore } from '../../store/AppStore';
import type { AppState } from '../../store/types';

export function LoginView() {
  const { loading, login, setIsLogin, setShowAuth, isMobile, resetPassword } = useAppStore() as AppState;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isForgotPassword) {
      await resetPassword(email);
      setIsForgotPassword(false);
      return;
    }
    const res = await login(email, password, otp);
    if (res?.two_factor_required) {
      setShowOTP(true);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg)] font-['Outfit'] animate-fade-in">
      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--primary)] mb-2 tracking-tighter">TBLINC</h1>
            <p className="text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] text-xs">Cloud Infrastructure</p>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-[var(--text-main)] mb-2 tracking-tight">
              {isForgotPassword ? 'Reset Password' : 'Welcome back'}
            </h2>
            <p className="text-[var(--text-muted)] font-medium mb-2">
              {isForgotPassword ? 'Enter your email to receive a password reset link.' : 'Please enter your details to access your dashboard.'}
            </p>
            {!isForgotPassword && <p className="font-bangla text-[var(--primary)] font-bold text-sm">আবার স্বাগতম — আপনার ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন।</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="name@company.com"
                className="input py-4 text-base" 
              />
            </div>
            {!isForgotPassword && (
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Password</label>
                  <button 
                    type="button" 
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[var(--primary)] text-xs font-bold hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
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
            )}

            {!isForgotPassword && showOTP && (
              <div className="space-y-2 animate-fade-in">
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">2FA Verification Code</label>
                <div className="relative group">
                  <span className="icon absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors">lock_open</span>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={otp} 
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} 
                    placeholder="000000" 
                    className="input pl-12 py-4 tracking-[0.4em] font-mono text-xl" 
                    required 
                  />
                </div>
                <p className="text-[var(--text-muted)] text-[0.7rem] font-bold uppercase tracking-wider px-1">Enter the 6-digit code from your app</p>
              </div>
            )}
            
            <button 
              disabled={loading} 
              type="submit" 
              className="w-full btn btn-primary py-4 text-lg shadow-xl shadow-[var(--primary-transparent)] mt-4"
            >
              {loading ? (
                <><span className="icon animate-spin">refresh</span> Processing...</>
              ) : (
                isForgotPassword ? 'Send Reset Link' : (showOTP ? 'Verify & Continue' : 'Sign In to Dashboard')
              )}
            </button>
          </form>

          <div className="text-center mt-10 space-y-6">
            <p className="text-[var(--text-muted)] font-medium">
              {isForgotPassword ? (
                <button 
                  onClick={() => setIsForgotPassword(false)} 
                  className="text-[var(--primary)] font-black hover:underline decoration-2 underline-offset-4"
                >
                  Back to Login
                </button>
              ) : (
                <>
                  Don't have an account? 
                  <button 
                    onClick={() => setIsLogin(false)} 
                    className="text-[var(--primary)] font-black ml-2 hover:underline decoration-2 underline-offset-4"
                  >
                    Create Account
                  </button>
                </>
              )}
            </p>
            
            <div className="pt-6 border-t border-[var(--border)]">
              <button 
                onClick={() => setShowAuth(false)} 
                className="btn btn-ghost text-sm py-2 px-4 group"
              >
                <span className="icon group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Back to website
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Visual */}
      {!isMobile && (
        <div className="flex-1 relative overflow-hidden bg-[var(--surface)] border-l border-[var(--border)]">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/analytics_bg.png" 
              alt="Global Network" 
              className="w-full h-full object-cover opacity-20 mix-blend-screen grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface)] via-transparent to-[var(--primary-transparent)] opacity-90" />
          </div>

          {/* Floating Accents */}
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--primary)] blur-[150px] opacity-10 rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500 blur-[150px] opacity-10 rounded-full" />
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-16 text-center">
            <div className="card p-12 max-w-lg glass shadow-2xl animate-scale-in">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary-transparent)] border border-[var(--primary-transparent-border)] flex items-center justify-center mb-8 mx-auto shadow-inner">
                <span className="icon text-3xl text-[var(--primary)]">shield_lock</span>
              </div>
              <h3 className="text-4xl font-black text-[var(--text-main)] mb-4 tracking-tight leading-tight">Secure & Reliable.</h3>
              <p className="text-[var(--text-sub)] text-lg font-medium leading-relaxed mb-10">
                Your data is protected by industry-leading security protocols. Access your infrastructure with absolute confidence.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: '2FA Ready', icon: 'verified_user' },
                  { label: 'AES-256', icon: 'lock' },
                  { label: 'Audit Logs', icon: 'list_alt' },
                  { label: 'KVM Isolation', icon: 'lan' }
                ].map(feature => (
                  <div key={feature.label} className="flex items-center gap-3 p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl group hover:border-[var(--primary-transparent-border)] transition-all">
                    <span className="icon text-[var(--success)] text-lg">{feature.icon}</span>
                    <span className="text-sm font-bold text-[var(--text-main)]">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="absolute bottom-12 flex items-center gap-8 opacity-30 grayscale hover:grayscale-0 hover:opacity-60 transition-all">
              <div className="text-xl font-black tracking-tighter italic">SABRE</div>
              <div className="text-xl font-black tracking-tighter italic">NEXUS</div>
              <div className="text-xl font-black tracking-tighter italic">VELOCITY</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
