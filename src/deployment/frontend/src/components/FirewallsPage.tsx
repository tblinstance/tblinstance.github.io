import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/AppStore';

interface Firewall {
  firewallId: string;
  name: string;
  description: string;
  isDefault: boolean;
  createdDate: string;
}

export function FirewallsPage() {
  const { token } = useAppStore();
  const [firewalls, setFirewalls] = useState<Firewall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFirewalls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/infrastructure/firewalls/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setFirewalls(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchFirewalls(); }, [fetchFirewalls]);

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Cloud Firewalls</h1>
          <p className="text-[var(--text-muted)] font-medium mb-1">
            Define protocol-level security rules and shield your infrastructure from malicious traffic.
          </p>
          <p className="font-bangla text-[var(--primary)] font-bold text-sm">
            ক্লাউড ফায়ারওয়াল — আপনার ইনফ্রাস্ট্রাকচার সুরক্ষিত রাখুন।
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="fw-refresh-btn"
            onClick={fetchFirewalls}
            disabled={loading}
            className="btn btn-ghost border border-[var(--border)] px-4"
            title="Refresh firewalls"
          >
            <span className={`icon text-lg ${loading ? 'animate-spin' : ''}`}>refresh</span>
          </button>
          <button id="fw-create-btn" className="btn btn-primary px-6">
            <span className="icon">shield</span>
            Create Firewall
          </button>
        </div>
      </div>

      {/* Visual Overview */}
      <div className="card p-10 border border-[var(--border)] bg-[var(--surface-2)] mb-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--primary-transparent),transparent)] opacity-40 -z-10" />
        <div className="w-full md:w-3/5">
          <h2 className="text-2xl font-black mb-4">Security Perimeter</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
            Configure granular inbound and outbound traffic rules to protect your instances.
            Our stateless firewall fabric operates at the network edge, ensuring malicious packets
            are dropped before they reach your compute nodes.
          </p>
          <div className="flex flex-wrap gap-4">
            {['IP Filtering', 'Port Management', 'Stateless Architecture'].map(t => (
              <div key={t} className="px-4 py-2 rounded-2xl bg-[var(--bg)] border border-[var(--border)] text-[0.65rem] font-black uppercase tracking-widest text-[var(--primary)]">
                {t}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-2/5 flex justify-center">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 30L160 50V100C160 140 135 175 100 185C65 175 40 140 40 100V50L100 30Z"
              stroke="var(--primary)" strokeWidth="3" fill="var(--primary-transparent)" />
            <circle cx="100" cy="100" r="30" stroke="var(--primary)" strokeWidth="1"
              strokeDasharray="4 4" className="animate-spin" style={{ animationDuration: '8s' }} />
            <path d="M80 100L95 115L125 85" stroke="var(--primary)" strokeWidth="4"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="card p-5 border border-red-500/20 bg-red-500/5 flex items-center gap-4 mb-8">
          <span className="icon text-xl text-red-400">error</span>
          <p className="text-sm text-red-400 font-bold flex-1 font-mono truncate">{error}</p>
          <button onClick={fetchFirewalls} className="btn btn-ghost border border-red-500/30 text-red-400 text-xs px-3">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold tracking-widest text-xs uppercase">Resolving Security Layers...</p>
        </div>

      ) : firewalls.length === 0 && !error ? (
        <div className="card p-20 text-center border-2 border-dashed border-[var(--border)] bg-transparent">
          <div className="w-20 h-20 rounded-[2rem] bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-8">
            <span className="icon text-4xl text-[var(--text-muted)]">wall</span>
          </div>
          <h3 className="text-xl font-black mb-3">No Firewalls Defined</h3>
          <p className="text-[var(--text-muted)] max-w-sm mx-auto mb-8">
            Secure your compute nodes by creating a firewall policy with custom inbound and outbound rules.
          </p>
          <button className="btn btn-primary">Create Policy</button>
        </div>

      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {firewalls.map(fw => (
            <div
              key={fw.firewallId}
              id={`fw-card-${fw.firewallId}`}
              className="card p-6 border border-[var(--border)] hover:border-[var(--primary-transparent-border)] transition-all group"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center">
                  <span className="icon text-xl">shield</span>
                </div>
                <div className="flex items-center gap-2">
                  {fw.isDefault && (
                    <span className="px-2 py-1 rounded-lg bg-[var(--primary-transparent)] text-[var(--primary)] text-[0.6rem] font-black uppercase tracking-widest border border-[var(--primary-transparent-border)]">
                      Default
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-black mb-1 truncate">{fw.name}</h3>
              <p className="text-xs text-[var(--text-muted)] mb-1 line-clamp-2">
                {fw.description || 'No description provided.'}
              </p>
              {fw.createdDate && (
                <p className="text-[0.6rem] text-[var(--text-muted)] mb-4">
                  Created: {new Date(fw.createdDate).toLocaleDateString()}
                </p>
              )}

              <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
                <span className="text-[0.65rem] font-mono text-[var(--text-muted)] truncate max-w-[120px]">
                  {fw.firewallId}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    id={`fw-rules-${fw.firewallId}`}
                    className="btn btn-ghost text-xs py-1.5 px-3 hover:text-[var(--primary)] transition-colors border border-[var(--border)]"
                    onClick={() => alert('Manage firewall rules via the Contabo control panel.')}
                  >
                    Edit Rules
                  </button>
                  {!fw.isDefault && (
                    <button
                      id={`fw-delete-${fw.firewallId}`}
                      className="icon text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
                      title="Delete firewall"
                      onClick={() => {
                        if (window.confirm(`Delete firewall "${fw.name}"?`)) {
                          alert('Firewall deletion via Contabo panel.');
                        }
                      }}
                    >
                      delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
