import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/AppStore';

interface DNSZone {
  zoneId: string;
  domainName: string;
  description: string;
  createdDate: string;
}

interface DNSRecord {
  id: string;
  name: string;
  type: string;
  data: string;
  ttl: number;
}

const RECORD_TYPE_COLORS: Record<string, string> = {
  A:     'bg-blue-500/10 text-blue-400',
  AAAA:  'bg-purple-500/10 text-purple-400',
  CNAME: 'bg-green-500/10 text-green-400',
  MX:    'bg-orange-500/10 text-orange-400',
  TXT:   'bg-yellow-500/10 text-yellow-400',
  NS:    'bg-pink-500/10 text-pink-400',
  SOA:   'bg-red-500/10 text-red-400',
};

export function DNSZonesPage() {
  const { token } = useAppStore();
  const [zones, setZones] = useState<DNSZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<DNSZone | null>(null);
  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState<string | null>(null);

  const fetchZones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/infrastructure/dns/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setZones(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchRecords = useCallback(async (zone: DNSZone) => {
    setSelectedZone(zone);
    setRecords([]);
    setRecordsError(null);
    setRecordsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/infrastructure/dns/${zone.zoneId}/records/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setRecordsError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setRecordsLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchZones(); }, [fetchZones]);

  /* ── Records View ──────────────────────────────────────── */
  if (selectedZone) {
    return (
      <div className="p-8 animate-fade-in">
        {/* Back Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            id="dns-back-btn"
            onClick={() => setSelectedZone(null)}
            className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--primary-transparent)] hover:text-[var(--primary)] transition-all"
          >
            <span className="icon">arrow_back</span>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-black tracking-tight mb-1 truncate">{selectedZone.domainName}</h1>
            <p className="text-xs font-mono text-[var(--text-muted)]">Zone: {selectedZone.zoneId}</p>
          </div>
          <button
            id="dns-records-refresh-btn"
            onClick={() => fetchRecords(selectedZone)}
            disabled={recordsLoading}
            className="btn btn-ghost border border-[var(--border)] px-4"
          >
            <span className={`icon text-lg ${recordsLoading ? 'animate-spin' : ''}`}>refresh</span>
          </button>
          <button id="dns-add-record-btn" className="btn btn-primary px-4 py-2 text-xs">
            <span className="icon text-sm">add</span> Add Record
          </button>
        </div>

        {/* Records Error */}
        {recordsError && (
          <div className="card p-5 border border-red-500/20 bg-red-500/5 flex items-center gap-4 mb-6">
            <span className="icon text-xl text-red-400">error</span>
            <p className="text-sm text-red-400 font-bold flex-1">{recordsError}</p>
            <button onClick={() => fetchRecords(selectedZone)} className="btn btn-ghost border border-red-500/30 text-red-400 text-xs px-3">Retry</button>
          </div>
        )}

        {recordsLoading ? (
          <div className="py-20 text-center opacity-50">
            <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest">Fetching Record Fabric...</p>
          </div>
        ) : records.length === 0 && !recordsError ? (
          <div className="card p-16 text-center border-2 border-dashed border-[var(--border)] bg-transparent">
            <span className="icon text-4xl text-[var(--text-muted)] mb-4 block">dns</span>
            <h3 className="text-lg font-black mb-2">No Records Found</h3>
            <p className="text-[var(--text-muted)] text-sm mb-6">This zone has no DNS records yet.</p>
            <button className="btn btn-primary">Add First Record</button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <table className="w-full text-left">
              <thead className="bg-[var(--surface-2)] border-b border-[var(--border)]">
                <tr>
                  <th className="p-5 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Name</th>
                  <th className="p-5 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Type</th>
                  <th className="p-5 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Value</th>
                  <th className="p-5 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">TTL</th>
                  <th className="p-5 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-[var(--surface-2)] transition-colors group">
                    <td className="p-5 font-bold text-sm">{r.name || '@'}</td>
                    <td className="p-5">
                      <span className={`px-2 py-1 rounded text-[0.6rem] font-black ${RECORD_TYPE_COLORS[r.type] ?? 'bg-[var(--surface-2)] text-[var(--text-muted)]'}`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="p-5 font-mono text-xs text-[var(--text-muted)] max-w-[240px] truncate" title={r.data}>{r.data}</td>
                    <td className="p-5 text-xs text-[var(--text-muted)]">{r.ttl}s</td>
                    <td className="p-5 text-right">
                      <button
                        className="icon text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
                        title="Delete record"
                        onClick={() => {
                          if (window.confirm(`Delete ${r.type} record "${r.name}"?`)) {
                            alert('Record deletion via Contabo panel.');
                          }
                        }}
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  /* ── Zones List View ───────────────────────────────────── */
  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">DNS Zones</h1>
          <p className="text-[var(--text-muted)] font-medium mb-1">Manage your domain zones and individual record protocols.</p>
          <p className="font-bangla text-[var(--primary)] font-bold text-sm">ডিএনএস জোন — আপনার ডোমেইন জোন পরিচালনা করুন।</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="dns-refresh-btn"
            onClick={fetchZones}
            disabled={loading}
            className="btn btn-ghost border border-[var(--border)] px-4"
            title="Refresh zones"
          >
            <span className={`icon text-lg ${loading ? 'animate-spin' : ''}`}>refresh</span>
          </button>
          <button id="dns-create-zone-btn" className="btn btn-primary px-6">
            <span className="icon">add_circle</span>
            Create Zone
          </button>
        </div>
      </div>

      {/* Visual Overview */}
      <div className="card p-8 border border-[var(--border)] bg-[var(--surface-2)] mb-12 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary-transparent)] blur-[100px] -z-10 opacity-30" />
        <div className="w-full md:w-3/5">
          <h2 className="text-2xl font-black mb-4">Zone Management Protocol</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
            Initialize domain zones and orchestrate individual record fabrics. Our DNS management suite provides a high-velocity interface for mapping your domain protocols to the TBLINC global edge network.
          </p>
          <div className="flex gap-4">
            {['Unlimited Records', 'Atomic Updates', 'Global Sync'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                <span className="text-[0.6rem] font-black uppercase tracking-widest">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-2/5 flex justify-center">
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="90" cy="90" r="70" stroke="var(--primary)" strokeWidth="1" strokeDasharray="5 5" className="animate-spin" style={{ animationDuration: '40s' }} />
            <rect x="70" y="70" width="40" height="40" rx="8" fill="var(--primary-transparent)" stroke="var(--primary)" strokeWidth="2" />
            <path d="M90 40V70" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
            <path d="M90 110V140" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
            <path d="M40 90H70" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
            <path d="M110 90H140" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="card p-5 border border-red-500/20 bg-red-500/5 flex items-center gap-4 mb-8">
          <span className="icon text-xl text-red-400">error</span>
          <p className="text-sm text-red-400 font-bold flex-1 font-mono">{error}</p>
          <button onClick={fetchZones} className="btn btn-ghost border border-red-500/30 text-red-400 text-xs px-3">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold tracking-widest text-xs uppercase">Retrieving Zones...</p>
        </div>
      ) : zones.length === 0 && !error ? (
        <div className="card p-20 text-center border-2 border-dashed border-[var(--border)] bg-transparent">
          <div className="w-20 h-20 rounded-[2rem] bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-8">
            <span className="icon text-4xl text-[var(--text-muted)]">language</span>
          </div>
          <h3 className="text-xl font-black mb-3">No Zones Configured</h3>
          <p className="text-[var(--text-muted)] max-w-sm mx-auto mb-8">Add your first domain zone to start managing records on our global network.</p>
          <button className="btn btn-primary">Add Zone</button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-[var(--surface-2)] border-b border-[var(--border)]">
              <tr>
                <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Domain</th>
                <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Zone ID</th>
                <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Created</th>
                <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {zones.map(z => (
                <tr key={z.zoneId} id={`dns-zone-${z.zoneId}`} className="hover:bg-[var(--surface-2)] transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center">
                        <span className="icon text-sm">link</span>
                      </div>
                      <span className="font-bold text-sm">{z.domainName}</span>
                    </div>
                  </td>
                  <td className="p-6 font-mono text-xs text-[var(--text-muted)]">{z.zoneId}</td>
                  <td className="p-6 text-xs font-medium text-[var(--text-muted)]">
                    {z.createdDate ? new Date(z.createdDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        id={`dns-records-btn-${z.zoneId}`}
                        onClick={() => fetchRecords(z)}
                        className="btn btn-ghost border border-[var(--border)] text-xs py-1.5 px-4 hover:border-[var(--primary)]"
                      >
                        Records
                      </button>
                      <button
                        className="btn btn-ghost border border-[var(--border)] text-xs py-1.5 px-4 text-[var(--danger)]"
                        onClick={() => {
                          if (window.confirm(`Delete zone "${z.domainName}"? This will remove all records.`)) {
                            alert('Zone deletion via Contabo panel.');
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
