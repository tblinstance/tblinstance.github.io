import { useState, useEffect } from 'react';
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

export function DNSZonesPage() {
  const { token } = useAppStore();
  const [zones, setZones] = useState<DNSZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<DNSZone | null>(null);
  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/infrastructure/dns/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setZones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch DNS zones:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async (zone: DNSZone) => {
    setSelectedZone(zone);
    setRecordsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/infrastructure/dns/${zone.zoneId}/records/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch DNS records:', err);
    } finally {
      setRecordsLoading(false);
    }
  };

  if (selectedZone) {
    return (
      <div className="p-8 animate-fade-in">
         <div className="flex items-center gap-4 mb-10">
            <button onClick={() => setSelectedZone(null)} className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--primary-transparent)] hover:text-[var(--primary)] transition-all">
               <span className="icon">arrow_back</span>
            </button>
            <div>
               <h1 className="text-3xl font-black tracking-tight mb-1">{selectedZone.domainName}</h1>
               <p className="text-xs font-mono text-[var(--text-muted)]">Zone: {selectedZone.zoneId}</p>
            </div>
         </div>

         <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black">DNS Records</h2>
            <button className="btn btn-primary px-4 py-2 text-xs">Add Record</button>
         </div>

         {recordsLoading ? (
            <div className="py-20 text-center opacity-50">
               <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
               <p className="text-xs font-bold uppercase tracking-widest">Fetching Record Fabric...</p>
            </div>
         ) : (
            <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
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
                       <tr key={r.id} className="hover:bg-[var(--surface-2)] transition-colors">
                          <td className="p-5 font-bold text-sm">{r.name}</td>
                          <td className="p-5">
                             <span className="px-2 py-1 rounded bg-[var(--primary-transparent)] text-[var(--primary)] text-[0.6rem] font-black">{r.type}</span>
                          </td>
                          <td className="p-5 font-mono text-xs text-[var(--text-muted)] truncate max-w-[200px]">{r.data}</td>
                          <td className="p-5 text-xs text-[var(--text-muted)]">{r.ttl}</td>
                          <td className="p-5 text-right">
                             <button className="icon text-[var(--text-muted)] hover:text-[var(--danger)]">delete</button>
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

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">DNS Zones</h1>
          <p className="text-[var(--text-muted)] font-medium mb-1">Manage your domain zones and individual record protocols.</p>
          <p className="font-bangla text-[var(--primary)] font-bold text-sm">ডিএনএস জোন — আপনার ডোমেইন জোন পরিচালনা করুন।</p>
        </div>
        <button className="btn btn-primary px-6">
           <span className="icon">add_circle</span>
           Create Zone
        </button>
      </div>

      {/* DNS Zone Visual Overview */}
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
               <circle cx="90" cy="90" r="70" stroke="var(--primary)" strokeWidth="1" strokeDasharray="5 5" className="animate-spin" />
               <rect x="70" y="70" width="40" height="40" rx="8" fill="var(--primary-transparent)" stroke="var(--primary)" strokeWidth="2" />
               <path d="M90 40V70" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
               <path d="M90 110V140" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
               <path d="M40 90H70" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
               <path d="M110 90H140" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
            </svg>
         </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
           <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
           <p className="font-bold tracking-widest text-xs uppercase">Retrieving Zones...</p>
        </div>
      ) : zones.length === 0 ? (
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
                            <button 
                              onClick={() => fetchRecords(z)}
                              className="btn btn-ghost border border-[var(--border)] text-xs py-1.5 px-4 hover:border-[var(--primary)]"
                            >
                              Records
                            </button>
                            <button className="btn btn-ghost border border-[var(--border)] text-xs py-1.5 px-4 text-[var(--danger)]">Delete</button>
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

