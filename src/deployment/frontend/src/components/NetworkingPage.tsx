import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/AppStore';

interface PrivateNetwork {
  privateNetworkId: string;
  name: string;
  region: string;
  description: string;
  createdDate: string;
  instanceIds: number[];
}

export function NetworkingPage() {
  const { token } = useAppStore();
  const [networks, setNetworks] = useState<PrivateNetwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNetworks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/infrastructure/networks/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setNetworks(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchNetworks(); }, [fetchNetworks]);

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Private Networking</h1>
          <p className="text-[var(--text-muted)] font-medium mb-1">Orchestrate isolated VPCs and cross-region network mesh.</p>
          <p className="font-bangla text-[var(--primary)] font-bold text-sm">
            প্রাইভেট নেটওয়ার্কিং — আপনার আইসোলেটেড নেটওয়ার্ক পরিচালনা করুন।
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="net-refresh-btn"
            onClick={fetchNetworks}
            disabled={loading}
            className="btn btn-ghost border border-[var(--border)] px-4"
            title="Refresh networks"
          >
            <span className={`icon text-lg ${loading ? 'animate-spin' : ''}`}>refresh</span>
          </button>
          <button id="net-create-btn" className="btn btn-primary px-6">
            <span className="icon">lan</span>
            Create Private Network
          </button>
        </div>
      </div>

      {/* VPC Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 card p-8 border border-[var(--border)] bg-[var(--surface-2)] flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-black mb-4">How it works</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
              Private Networking (VPC) allows your servers to communicate over a dedicated, isolated L2
              network. This traffic never touches the public internet, ensuring maximum security and
              sub-millisecond latency between your nodes.
            </p>
            <ul className="space-y-3">
              {['Isolated L2 Fabric', 'Unlimited Internal Traffic', 'Secure Data Sync'].map(f => (
                <li key={f} className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
                  <span className="icon text-[var(--primary)] text-sm">check_circle</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
              <rect x="20" y="20" width="200" height="200" rx="40" stroke="var(--primary)" strokeWidth="2"
                strokeDasharray="8 8" style={{ animation: 'spin 60s linear infinite' }} />
              <circle cx="120" cy="120" r="40" fill="var(--primary-transparent)" stroke="var(--primary)" strokeWidth="2" />
              <path d="M120 40V80" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
              <path d="M120 160V200" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
              <path d="M40 120H80" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
              <path d="M160 120H200" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
              <rect x="110" y="110" width="20" height="20" rx="4" fill="var(--primary)" className="animate-pulse" />
              <circle cx="120" cy="40" r="8" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2" />
              <circle cx="120" cy="200" r="8" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2" />
              <circle cx="40" cy="120" r="8" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2" />
              <circle cx="200" cy="120" r="8" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="card p-8 border border-[var(--primary-transparent-border)] bg-[var(--primary-transparent)] flex flex-col justify-center">
          <span className="icon text-4xl text-[var(--primary)] mb-6">info</span>
          <h3 className="text-xl font-black mb-2">Protocol Note</h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            All Cloud VPS and VDS instances support VPC attachment. Storage VPS products are currently
            excluded from private network mesh.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="card p-5 border border-red-500/20 bg-red-500/5 flex items-center gap-4 mb-8">
          <span className="icon text-xl text-red-400">error</span>
          <p className="text-sm text-red-400 font-bold flex-1 font-mono truncate">{error}</p>
          <button onClick={fetchNetworks} className="btn btn-ghost border border-red-500/30 text-red-400 text-xs px-3">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold tracking-widest text-xs uppercase">Mapping Network Topology...</p>
        </div>

      ) : networks.length === 0 && !error ? (
        <div className="card p-20 text-center border-2 border-dashed border-[var(--border)] bg-transparent">
          <div className="w-20 h-20 rounded-[2rem] bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-8">
            <span className="icon text-4xl text-[var(--text-muted)]">router</span>
          </div>
          <h3 className="text-xl font-black mb-3">No Networks Isolated</h3>
          <p className="text-[var(--text-muted)] max-w-sm mx-auto mb-8">
            Deploy an isolated private network to enable secure communication between your compute nodes.
          </p>
          <button className="btn btn-primary">Create Network</button>
        </div>

      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {networks.map(n => (
            <div
              key={n.privateNetworkId}
              id={`net-card-${n.privateNetworkId}`}
              className="card p-8 border border-[var(--border)] hover:border-[var(--primary-transparent-border)] transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="icon text-9xl">lan</span>
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-black mb-1">{n.name}</h3>
                    <p className="text-xs text-[var(--text-muted)] font-mono">{n.privateNetworkId}</p>
                  </div>
                  <div className="badge badge-primary px-4 py-1.5">{n.region}</div>
                </div>

                {n.description && (
                  <p className="text-xs text-[var(--text-muted)] mb-6 line-clamp-2">{n.description}</p>
                )}

                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)]">
                    <div className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Connected Nodes</div>
                    <div className="text-2xl font-black text-[var(--primary)]">{n.instanceIds?.length ?? 0}</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)]">
                    <div className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Protocol</div>
                    <div className="text-2xl font-black">L2 / VPC</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    id={`net-assign-${n.privateNetworkId}`}
                    className="btn btn-primary flex-1"
                    onClick={() => alert('Assign nodes via the Contabo control panel.')}
                  >
                    Assign Nodes
                  </button>
                  <button className="btn btn-ghost border border-[var(--border)] px-8">Config</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
