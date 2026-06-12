import { useState } from 'react';

interface ActivateCheckEmailViewProps {
  email: string;
  onBackToLogin: () => void;
}

export function ActivateCheckEmailView({ email, onBackToLogin }: ActivateCheckEmailViewProps) {
  const [resending, setResending] = useState(false);

  const handleResendEmail = async () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      alert('Activation email resent! Check your inbox.');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg)] font-['Outfit'] animate-fade-in">
      {/* Left Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--primary)] mb-2 tracking-tighter">TBLINC</h1>
            <p className="text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] text-xs">Cloud Infrastructure</p>
          </div>

          {/* Success Card */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-lg animate-scale-in">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center shadow-lg shadow-green-500/20">
                <span className="icon text-5xl text-green-400">mail_outline</span>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-black text-[var(--text-main)] text-center mb-3 tracking-tight">Check Your Email</h2>
            
            {/* Subheading */}
            <p className="text-center text-[var(--text-muted)] mb-2 font-medium">Account Created Successfully!</p>
            <p className="text-center text-[var(--text-muted)] text-sm mb-6">
              We've sent an activation link to <span className="font-bold text-[var(--primary)]">{email}</span>
            </p>

            {/* Instructions */}
            <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-4 mb-6 space-y-3">
              <div className="flex gap-3">
                <span className="icon text-[var(--primary)] text-xl flex-shrink-0 mt-0.5">inbox</span>
                <div>
                  <p className="font-bold text-[var(--text-main)] text-sm">Open your email</p>
                  <p className="text-xs text-[var(--text-muted)]">Look for an email from TBLINC</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="icon text-[var(--primary)] text-xl flex-shrink-0 mt-0.5">link</span>
                <div>
                  <p className="font-bold text-[var(--text-main)] text-sm">Click the activation link</p>
                  <p className="text-xs text-[var(--text-muted)]">This will verify your account</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="icon text-[var(--primary)] text-xl flex-shrink-0 mt-0.5">login</span>
                <div>
                  <p className="font-bold text-[var(--text-main)] text-sm">Sign in to your account</p>
                  <p className="text-xs text-[var(--text-muted)]">After activation, you can log in</p>
                </div>
              </div>
            </div>

            {/* Check Spam Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6 flex gap-3">
              <span className="icon text-yellow-500 text-lg flex-shrink-0">warning</span>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                If you don't see it, check your spam or promotions folder!
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleResendEmail}
                disabled={resending}
                className="w-full py-3 px-4 bg-[var(--surface)] hover:bg-[var(--bg)] border border-[var(--border)] text-[var(--text-main)] rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {resending ? (
                  <>
                    <span className="icon animate-spin">refresh</span>
                    Resending...
                  </>
                ) : (
                  <>
                    <span className="icon">mail</span>
                    Resend Activation Email
                  </>
                )}
              </button>
              
              <button
                onClick={onBackToLogin}
                className="w-full py-3 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-bold transition-all shadow-lg shadow-[var(--primary-transparent)] flex items-center justify-center gap-2"
              >
                <span className="icon">arrow_forward</span>
                Go to Sign In
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-[var(--text-muted)]">
              Already activated?
              <button
                onClick={onBackToLogin}
                className="text-[var(--primary)] font-bold ml-1 hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Visual */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-[var(--surface)] border-l border-[var(--border)] flex-col items-center justify-center p-16 text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/analytics_bg.webp"
            alt="Global Network"
            className="w-full h-full object-cover opacity-20 mix-blend-screen grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface)] via-transparent to-[var(--primary-transparent)] opacity-90" />
        </div>

        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary)] blur-[150px] opacity-10 rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500 blur-[150px] opacity-10 rounded-full" />

        <div className="relative z-10">
          <div className="card p-12 max-w-lg glass shadow-2xl animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary-transparent)] border border-[var(--primary-transparent-border)] flex items-center justify-center mb-8 mx-auto shadow-inner">
              <span className="icon text-3xl text-[var(--primary)]">verified</span>
            </div>
            <h3 className="text-4xl font-black text-[var(--text-main)] mb-4 tracking-tight leading-tight">Secure & Verified</h3>
            <p className="text-[var(--text-sub)] text-lg font-medium leading-relaxed">
              Your account is protected with email verification and enterprise-grade security protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
