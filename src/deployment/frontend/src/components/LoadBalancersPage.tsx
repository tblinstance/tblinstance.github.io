import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/AppStore';

interface VIP {
  loadBalancerId: string;
  name: string;
  status: string;
  ipAddress: string;
  region: string;
  algorithm: string;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ready:      'bg-green-500/10 text-green-400 border border-green-500/20',
    unassigned: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    pending:    'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    error:      'bg-red-500/10 text-red-400 border border-red-500/20',
  };
  const cls = map[status] ?? 'bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]';
  return (
    <span className={`px-3 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest ${cls}`}>
      {status}
    </span>
  );
}

export function LoadBalancersPage() {
  const { token } = useAppStore();
  const [vips, setVips] = useState<VIP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchVips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/infrastructure/load-balancers/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setVips(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      console.error('Failed to fetch VIPs:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchVips(); }, [fetchVips]);

  const handleCopy = (ip: string, id: string) => {
    navigator.clipboard.writeText(ip).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleDelete = (vip: VIP) => {
    if (!window.confirm(`Delete VIP "${vip.name}" (${vip.loadBalancerId})?\n\nThis action cannot be undone.`)) return;
    // TODO: call DELETE endpoint when Contabo API supports it
    alert('VIP deletion must be performed via the Contabo control panel.');
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">VIPs &amp; Load Balancers</h1>
          <p className="text-[var(--text-muted)] font-medium mb-1">
            Distribute traffic across your global compute nodes using Virtual IPs for maximum availability.
          </p>
          <p className="font-bangla text-[var(--primary)] font-bold text-sm">
            ভার্চুয়াল আইপি এবং লোড ব্যালেন্সার — আপনার ট্র্যাফিক সুষমভাবে বণ্টন করুন।
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="vip-refresh-btn"
            onClick={fetchVips}
            disabled={loading}
            className="btn btn-ghost border border-[var(--border)] px-4"
            title="Refresh VIPs"
          >
            <span className={`icon text-lg ${loading ? 'animate-spin' : ''}`}>refresh</span>
          </button>
          <button id="vip-provision-btn" className="btn btn-primary px-6">
            <span className="icon">add_circle</span>
            Provision Virtual IP
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="card p-8 border border-[var(--border)] bg-[var(--surface-2)] flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-transparent)] blur-[50px] -z-10 opacity-30" />
          <div className="w-full md:w-1/2 flex justify-center">
            <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M90 20V60" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
              <circle cx="90" cy="20" r="10" fill="var(--primary)" />
              <path d="M90 60L40 120" stroke="var(--primary)" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M90 60L90 120" stroke="var(--primary)" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M90 60L140 120" stroke="var(--primary)" strokeWidth="2" strokeDasharray="4 4" />
              <rect x="30" y="120" width="20" height="20" rx="4" fill="var(--primary-transparent)" stroke="var(--primary)" />
              <rect x="80" y="120" width="20" height="20" rx="4" fill="var(--primary-transparent)" stroke="var(--primary)" />
              <rect x="130" y="120" width="20" height="20" rx="4" fill="var(--primary-transparent)" stroke="var(--primary)" />
            </svg>
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-xl font-black mb-3">IP Failover &amp; HA</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
              Eliminate single points of failure by floating Virtual IPs across your compute nodes.
              Contabo VIPs support both additional IPs and floating/failover configurations.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-primary text-[0.6rem]">IP Failover</span>
              <span className="badge badge-primary text-[0.6rem]">Health Checks</span>
              <span className="badge badge-primary text-[0.6rem]">Zero Downtime</span>
            </div>
          </div>
        </div>

        <div className="card p-8 border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-center text-center">
          <div>
            <div className="w-16 h-16 rounded-full bg-[var(--primary-transparent)] flex items-center justify-center mx-auto mb-4">
              <span className="icon text-2xl text-[var(--primary)]">bolt</span>
            </div>
            <h4 className="font-black mb-2">Zero Latency Overhead</h4>
            <p className="text-[0.65rem] text-[var(--text-muted)] max-w-[200px]">
              Direct-server-return (DSR) and specialised network hardware for maximum performance.
            </p>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="card p-6 border border-red-500/20 bg-red-500/5 flex items-center gap-4 mb-8">
          <span className="icon text-2xl text-red-400">error</span>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm text-red-400">Failed to load VIPs</p>
            <p className="text-xs text-[var(--text-muted)] font-mono truncate">{error}</p>
          </div>
          <button onClick={fetchVips} className="btn btn-ghost border border-red-500/30 text-red-400 text-xs px-4">
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="py-20 text-center opacity-50">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-black uppercase tracking-widest">Orchestrating Traffic Fabric...</p>
        </div>

      /* Empty State */
      ) : vips.length === 0 && !error ? (
        <div className="card p-20 text-center border-2 border-dashed border-[var(--border)] bg-transparent">
          <div className="w-20 h-20 rounded-[2rem] bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-8">
            <span className="icon text-4xl text-[var(--text-muted)]">alt_route</span>
          </div>
          <h3 className="text-xl font-black mb-3">No Active VIPs</h3>
          <p className="text-[var(--text-muted)] max-w-sm mx-auto mb-8">
            Set up your first Virtual IP to distribute traffic across multiple regions and improve protocol uptime.
          </p>
          <button id="vip-create-btn" className="btn btn-primary">Create Virtual IP</button>
        </div>

      /* VIP Cards */
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vips.map(vip => (
            <div
              key={vip.loadBalancerId}
              id={`vip-card-${vip.loadBalancerId}`}
              className="card p-6 border border-[var(--border)] hover:border-[var(--primary-transparent-border)] transition-all group"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center">
                  <span className="icon text-2xl">alt_route</span>
                </div>
                <StatusBadge status={vip.status} />
              </div>

              {/* Name + ID */}
              <h3 className="text-lg font-black mb-1 truncate">{vip.name}</h3>
              <p className="text-[0.65rem] font-mono text-[var(--text-muted)] mb-5 truncate">{vip.loadBalancerId}</p>

              {/* Details */}
              <div className="space-y-3 mb-6">
                {/* IP Address — copyable */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[var(--text-muted)] font-bold">IP Address</span>
                  <button
                    className="flex items-center gap-1 font-mono hover:text-[var(--primary)] transition-colors"
                    onClick={() => handleCopy(vip.ipAddress, vip.loadBalancerId)}
                    title="Copy IP"
                  >
                    <span>{vip.ipAddress}</span>
                    <span className="icon text-sm opacity-50 group-hover:opacity-100">
                      {copied === vip.loadBalancerId ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)] font-bold">Region</span>
                  <span className="font-medium">{vip.region || '—'}</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)] font-bold">VIP Type</span>
                  <span className="px-2 py-0.5 rounded bg-[var(--surface-2)] font-mono capitalize">
                    {vip.algorithm || 'additional'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  id={`vip-rules-${vip.loadBalancerId}`}
                  className="btn btn-ghost border border-[var(--border)] text-xs py-2"
                  onClick={() => alert('Firewall rules for VIPs are managed via the Contabo control panel.')}
                >
                  Rules
                </button>
                <button
                  id={`vip-delete-${vip.loadBalancerId}`}
                  className="btn btn-ghost border border-[var(--border)] text-xs py-2 text-[var(--danger)]"
                  onClick={() => handleDelete(vip)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
