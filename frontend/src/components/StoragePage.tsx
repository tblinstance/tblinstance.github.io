import { useState, useEffect } from 'react';
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

export function StoragePage() {
  const { token } = useAppStore();
  const [storages, setStorages] = useState<ObjectStorage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStorages();
  }, []);

  const fetchStorages = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/infrastructure/storage/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStorages(data);
    } catch (err) {
      console.error('Failed to fetch object storages:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Object Storage</h1>
          <p className="text-[var(--text-muted)] font-medium mb-1">Manage your S3-compatible data fabrics and clusters.</p>
          <p className="font-bangla text-[var(--primary)] font-bold text-sm">অবজেক্ট স্টোরেজ — আপনার ডেটা এবং ক্লাস্টার পরিচালনা করুন।</p>
        </div>
        <button className="btn btn-primary px-6">
           <span className="icon">add_circle</span>
           Create Storage Cluster
        </button>
      </div>

      {/* Storage Visual Overview */}
      <div className="card p-8 border border-[var(--border)] bg-[var(--surface-2)] mb-12 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary-transparent)] blur-[100px] -z-10 opacity-30" />
         <div className="w-full md:w-3/5">
            <h2 className="text-2xl font-black mb-4">Elastic Data Fabric</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
               Our S3-compatible object storage is architected for extreme durability and horizontal scalability. Deploy clusters across global regions to enable high-velocity data access for your applications and static assets.
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
               <circle cx="100" cy="40" r="15" stroke="var(--primary)" strokeWidth="2" strokeDasharray="4 4" className="animate-spin" />
               <path d="M100 40L100 60" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" className="animate-bounce" />
            </svg>
         </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
           <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
           <p className="font-bold tracking-widest text-xs uppercase">Synchronizing Data Fabric...</p>
        </div>
      ) : storages.length === 0 ? (
        <div className="card p-20 text-center border-2 border-dashed border-[var(--border)] bg-transparent">
           <div className="w-20 h-20 rounded-[2rem] bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-8">
              <span className="icon text-4xl text-[var(--text-muted)]">cloud_off</span>
           </div>
           <h3 className="text-xl font-black mb-3">No Storage Clusters Found</h3>
           <p className="text-[var(--text-muted)] max-w-sm mx-auto mb-8">Deploy your first S3-compatible storage cluster to start architecting your data fabric.</p>
           <button className="btn btn-primary">Deploy Cluster</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storages.map(s => (
            <div key={s.storageId} className="card p-6 border border-[var(--border)] hover:border-[var(--primary-transparent-border)] transition-all group">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center">
                     <span className="icon text-2xl">database</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-widest ${s.provisioningStatus === 'ready' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                     {s.provisioningStatus}
                  </div>
               </div>
               <h3 className="text-lg font-black mb-1">{s.displayName}</h3>
               <p className="text-xs text-[var(--text-muted)] font-mono mb-4">{s.storageId}</p>
               
               <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-xs">
                     <span className="text-[var(--text-muted)]">Usage</span>
                     <span className="font-bold">{s.usedSpaceGb} / {s.totalSpaceGb} GB</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-[var(--primary)] transition-all duration-1000" 
                       style={{ width: `${(s.usedSpaceGb / s.totalSpaceGb) * 100}%` }}
                     />
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] group-hover:border-[var(--primary-transparent-border)] transition-colors">
                     <span className="icon text-sm text-[var(--text-muted)]">language</span>
                     <span className="text-[0.65rem] font-mono truncate">{s.s3Url}</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <button className="btn btn-ghost border border-[var(--border)] text-xs py-2">Manage</button>
                  <button className="btn btn-ghost border border-[var(--border)] text-xs py-2 text-[var(--danger)]">Delete</button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
