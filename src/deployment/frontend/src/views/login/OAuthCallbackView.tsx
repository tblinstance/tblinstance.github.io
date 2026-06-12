import { useEffect, useState } from 'react';

export function OAuthCallbackView() {
  const [message, setMessage] = useState('Completing login...');

  useEffect(() => {
    const raw = window.location.hash.slice(1) || window.location.search.slice(1);
    const params = new URLSearchParams(raw);
    const access = params.get('access');
    const refresh = params.get('refresh');
    const error = params.get('error');

    if (error) {
      setMessage(`Authentication failed: ${decodeURIComponent(error)}`);
      return;
    }

    if (!access || !refresh) {
      setMessage('OAuth response did not include authentication tokens.');
      return;
    }

    localStorage.setItem('access_token', access);
    setMessage('Login successful. Redirecting to your dashboard...');
    window.location.replace('/');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text-main)] px-4">
      <div className="max-w-xl w-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 shadow-2xl shadow-[rgba(0,0,0,0.12)] text-center">
        <div className="mb-6 text-[var(--primary)] text-5xl">✨</div>
        <h1 className="text-3xl font-black mb-4">OAuth Login</h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
