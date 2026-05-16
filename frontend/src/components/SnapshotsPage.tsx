import { useState, useEffect } from 'react';
import { useAppStore } from '../store/AppStore';

interface Snapshot {
  snapshotId: string;
  instanceId: number;
  name: string;
  description: string;
  createdDate: string;
  autoDeleteDate?: string;
  status: string;
}

export function SnapshotsPage() {
  const { token } = useAppStore();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSnapshots();
  }, []);

  const fetchSnapshots = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/infrastructure/snapshots/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSnapshots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch snapshots:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Snapshots & Backups</h1>
          <p className="text-[var(--text-muted)] font-medium mb-1">Create point-in-time recovery images for your compute nodes and managed clusters.</p>
          <p className="font-bangla text-[var(--primary)] font-bold text-sm">স্ন্যাপশট এবং ব্যাকআপ — আপনার ডেটা রিকভারি নিশ্চিত করুন।</p>
        </div>
        <button className="btn btn-primary px-6">
           <span className="icon">camera</span>
           Capture Snapshot
        </button>
      </div>

      {/* Snapshot Visual Overview */}
      <div className="card p-10 border border-[var(--border)] bg-[var(--surface-2)] mb-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,var(--primary-transparent),transparent)] opacity-30 -z-10" />
         <div className="w-full md:w-3/5">
            <h2 className="text-2xl font-black mb-4">Point-in-Time Recovery</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
               Secure your data with atomic snapshots. Our backup protocol allows you to capture the entire state of your storage volumes instantly, providing a reliable safety net for critical infrastructure upgrades and data migrations.
            </p>
            <div className="grid grid-cols-2 gap-3">
               {['Atomic Backups', 'Instant Recovery', 'Disk Consistency', 'Custom Retention'].map(i => (
                 <div key={i} className="flex items-center gap-2">
                    <span className="icon text-[var(--primary)] text-xs">history</span>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest">{i}</span>
                 </div>
               ))}
            </div>
         </div>
         <div className="w-full md:w-2/5 flex justify-center">
            <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
               <rect x="40" y="40" width="100" height="100" rx="20" stroke="var(--primary)" strokeWidth="2" fill="var(--primary-transparent)" />
               <path d="M90 60V120" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
               <path d="M60 90H120" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
               <circle cx="140" cy="140" r="30" stroke="var(--primary)" strokeWidth="2" strokeDasharray="6 6" className="animate-[spin_30s_linear_infinite]" />
               <path d="M140 120V140H160" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
         </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
           <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
           <p className="font-bold tracking-widest text-xs uppercase">Auditing Backup History...</p>
        </div>
      ) : snapshots.length === 0 ? (
        <div className="card p-20 text-center border-2 border-dashed border-[var(--border)] bg-transparent">
           <div className="w-20 h-20 rounded-[2rem] bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-8">
              <span className="icon text-4xl text-[var(--text-muted)]">history</span>
           </div>
           <h3 className="text-xl font-black mb-3">No Snapshots Found</h3>
           <p className="text-[var(--text-muted)] max-w-sm mx-auto mb-8">Protect your data by creating regular snapshots of your disk volumes and server states.</p>
           <button className="btn btn-primary">Take Snapshot Now</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {snapshots.map(s => (
            <div key={s.snapshotId} className="card p-6 border border-[var(--border)] hover:border-[var(--primary-transparent-border)] transition-all flex gap-6 items-start">
               <div className="w-12 h-12 rounded-2xl bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center shrink-0">
                  <span className="icon text-2xl">camera_enhance</span>
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                     <div>
                        <h3 className="text-lg font-black truncate">{s.name || 'Untitled Snapshot'}</h3>
                        <p className="text-xs text-[var(--text-muted)] font-mono">{s.snapshotId}</p>
                     </div>
                     <span className={`px-2 py-1 rounded-lg text-[0.6rem] font-black uppercase tracking-widest ${s.status === 'ready' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {s.status}
                     </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mb-4">{s.description || 'No description provided.'}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                     <span className="text-[0.65rem] font-bold text-[var(--text-muted)]">Instance: {s.instanceId}</span>
                     <div className="flex gap-2">
                        <button className="btn btn-ghost text-[0.65rem] py-1 text-[var(--danger)]">Rollback</button>
                        <button className="btn btn-ghost text-[0.65rem] py-1">Delete</button>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
