import { useState, useEffect } from 'react';
import { useAppStore } from '../store/AppStore';

interface DNSZone {
  zoneId: string;
  domainName: string;
  description: string;
  createdDate: string;
}

export function DNSPage() {
  const { token } = useAppStore();
  const [zones, setZones] = useState<DNSZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/infrastructure/dns/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setZones(data);
    } catch (err) {
      console.error('Failed to fetch DNS zones:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Global DNS Zones</h1>
          <p className="text-[var(--text-muted)] font-medium mb-1">Manage your domain protocols and record fabrics across the global edge.</p>
          <p className="font-bangla text-[var(--primary)] font-bold text-sm">গ্লোবাল ডিএনএস জোন — আপনার ডোমেইন প্রোটোকল পরিচালনা করুন।</p>
        </div>
        <button className="btn btn-primary px-6">
           <span className="icon">public</span>
           Create DNS Zone
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
           <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
           <p className="font-bold tracking-widest text-xs uppercase">Resolving Edge Nodes...</p>
        </div>
      ) : zones.length === 0 ? (
        <div className="card p-20 text-center border-2 border-dashed border-[var(--border)] bg-transparent">
           <div className="w-20 h-20 rounded-[2rem] bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-8">
              <span className="icon text-4xl text-[var(--text-muted)]">language</span>
           </div>
           <h3 className="text-xl font-black mb-3">No Active Zones</h3>
           <p className="text-[var(--text-muted)] max-w-sm mx-auto mb-8">Initialize your first DNS zone to start routing traffic through the TBLINC global edge network.</p>
           <button className="btn btn-primary">Create Zone</button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
           <table className="w-full text-left">
              <thead className="bg-[var(--surface-2)] border-b border-[var(--border)]">
                 <tr>
                    <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Domain Protocol</th>
                    <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Zone ID</th>
                    <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Created</th>
                    <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)] text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                 {zones.map(z => (
                   <tr key={z.zoneId} className="hover:bg-[var(--surface-2)] transition-colors group">
                      <td className="p-6">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center">
                               <span className="icon text-sm">link</span>
                            </div>
                            <span className="font-bold text-sm">{z.domainName}</span>
                         </div>
                      </td>
                      <td className="p-6 font-mono text-xs text-[var(--text-muted)]">{z.zoneId}</td>
                      <td className="p-6 text-xs font-medium text-[var(--text-muted)]">{new Date(z.createdDate).toLocaleDateString()}</td>
                      <td className="p-6 text-right">
                         <div className="flex justify-end gap-2">
                            <button className="btn btn-ghost border border-[var(--border)] text-xs py-1.5 px-4 hover:border-[var(--primary)]">Manage Records</button>
                            <button className="btn btn-ghost border border-[var(--border)] text-xs py-1.5 px-4 hover:border-[var(--danger)] hover:text-[var(--danger)]">Delete</button>
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
