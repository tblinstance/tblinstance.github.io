import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/AppStore';

interface ObjectStorage {
  storageId: string;
  displayName: string;
  region: string;
  provisioningStatus: string;
  s3Url: string;
  totalSpaceGb: number;
  usedSpaceGb: number;
}

function StorageBar({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const color = pct > 85 ? 'bg-red-500' : pct > 65 ? 'bg-yellow-500' : 'bg-[var(--primary)]';
  return (
    <div className="w-full h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function StoragePage() {
  const { token } = useAppStore();
  const [storages, setStorages] = useState<ObjectStorage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchStorages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/infrastructure/storage/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setStorages(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchStorages(); }, [fetchStorages]);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Object Storage</h1>
          <p className="text-[var(--text-muted)] font-medium mb-1">Manage your S3-compatible data fabrics and clusters.</p>
          <p className="font-bangla text-[var(--primary)] font-bold text-sm">
            অবজেক্ট স্টোরেজ — আপনার ডেটা এবং ক্লাস্টার পরিচালনা করুন।
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="storage-refresh-btn"
            onClick={fetchStorages}
            disabled={loading}
            className="btn btn-ghost border border-[var(--border)] px-4"
            title="Refresh storage"
          >
            <span className={`icon text-lg ${loading ? 'animate-spin' : ''}`}>refresh</span>
          </button>
          <button id="storage-create-btn" className="btn btn-primary px-6">
            <span className="icon">add_circle</span>
            Create Storage Cluster
          </button>
        </div>
      </div>

      {/* Visual Overview */}
      <div className="card p-8 border border-[var(--border)] bg-[var(--surface-2)] mb-12 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary-transparent)] blur-[100px] -z-10 opacity-30" />
        <div className="w-full md:w-3/5">
          <h2 className="text-2xl font-black mb-4">Elastic Data Fabric</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
            Our S3-compatible object storage is architected for extreme durability and horizontal scalability.
            Deploy clusters across global regions to enable high-velocity data access for your applications
            and static assets.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {['99.999% Durability', 'S3 Compatible API', 'Infinite Scaling', 'Encrypted at Rest'].map(f => (
              <div key={f} className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-wider text-[var(--text-main)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-2/5 flex justify-center">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="60" width="120" height="80" rx="12" stroke="var(--primary)" strokeWidth="2" />
            <rect x="50" y="70" width="100" height="20" rx="4" fill="var(--primary-transparent)" stroke="var(--primary)" strokeWidth="1" />
            <rect x="50" y="95" width="100" height="20" rx="4" fill="var(--primary-transparent)" stroke="var(--primary)" strokeWidth="1" />
            <path d="M100 140V170" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
            <path d="M60 170H140" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="100" cy="40" r="15" stroke="var(--primary)" strokeWidth="2" strokeDasharray="4 4" className="animate-spin" style={{ animationDuration: '6s' }} />
            <path d="M100 40L100 60" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" className="animate-bounce" />
          </svg>
        </div>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="card p-5 border border-red-500/20 bg-red-500/5 flex items-center gap-4 mb-8">
          <span className="icon text-xl text-red-400">error</span>
          <p className="text-sm text-red-400 font-bold flex-1 font-mono truncate">{error}</p>
          <button onClick={fetchStorages} className="btn btn-ghost border border-red-500/30 text-red-400 text-xs px-3">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold tracking-widest text-xs uppercase">Synchronizing Data Fabric...</p>
        </div>

      ) : storages.length === 0 && !error ? (
        <div className="card p-20 text-center border-2 border-dashed border-[var(--border)] bg-transparent">
          <div className="w-20 h-20 rounded-[2rem] bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-8">
            <span className="icon text-4xl text-[var(--text-muted)]">cloud_off</span>
          </div>
          <h3 className="text-xl font-black mb-3">No Storage Clusters Found</h3>
          <p className="text-[var(--text-muted)] max-w-sm mx-auto mb-8">
            Deploy your first S3-compatible storage cluster to start architecting your data fabric.
          </p>
          <button className="btn btn-primary">Deploy Cluster</button>
        </div>

      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storages.map(s => {
            const pct = s.totalSpaceGb > 0 ? Math.round((s.usedSpaceGb / s.totalSpaceGb) * 100) : 0;
            return (
              <div
                key={s.storageId}
                id={`storage-card-${s.storageId}`}
                className="card p-6 border border-[var(--border)] hover:border-[var(--primary-transparent-border)] transition-all group"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center">
                    <span className="icon text-2xl">database</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.6rem] font-black text-[var(--text-muted)]">{s.region}</span>
                    <div className={`px-3 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-widest ${s.provisioningStatus === 'ready' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {s.provisioningStatus}
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-black mb-1 truncate">{s.displayName}</h3>
                <p className="text-xs text-[var(--text-muted)] font-mono mb-4 truncate">{s.storageId}</p>

                <div className="space-y-4 mb-6">
                  {/* Usage bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[var(--text-muted)]">Usage</span>
                      <span className="font-bold">
                        {s.usedSpaceGb} / {s.totalSpaceGb} GB
                        <span className="text-[var(--text-muted)] ml-1">({pct}%)</span>
                      </span>
                    </div>
                    <StorageBar used={s.usedSpaceGb} total={s.totalSpaceGb} />
                    {pct > 85 && (
                      <p className="text-[0.6rem] text-red-400 font-bold mt-1">⚠ Storage nearly full</p>
                    )}
                  </div>

                  {/* S3 URL — copyable */}
                  {s.s3Url && (
                    <button
                      className="w-full flex items-center gap-2 p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] group-hover:border-[var(--primary-transparent-border)] transition-colors text-left"
                      onClick={() => handleCopyUrl(s.s3Url, s.storageId)}
                      title="Copy S3 URL"
                    >
                      <span className="icon text-sm text-[var(--text-muted)] shrink-0">language</span>
                      <span className="text-[0.65rem] font-mono truncate flex-1">{s.s3Url}</span>
                      <span className="icon text-sm text-[var(--text-muted)] shrink-0">
                        {copied === s.storageId ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    id={`storage-manage-${s.storageId}`}
                    className="btn btn-ghost border border-[var(--border)] text-xs py-2"
                    onClick={() => alert('Manage storage via the Contabo S3 panel.')}
                  >
                    Manage
                  </button>
                  <button
                    id={`storage-delete-${s.storageId}`}
                    className="btn btn-ghost border border-[var(--border)] text-xs py-2 text-[var(--danger)]"
                    onClick={() => {
                      if (window.confirm(`Delete storage cluster "${s.displayName}"?\n\nAll data will be permanently lost.`)) {
                        alert('Storage deletion via Contabo panel.');
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
