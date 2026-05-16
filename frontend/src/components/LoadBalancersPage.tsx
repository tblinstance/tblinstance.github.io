import { useState, useEffect } from 'react';
import { useAppStore } from '../store/AppStore';

interface LoadBalancer {
  loadBalancerId: string;
  name: string;
  status: string;
  ipAddress: string;
  region: string;
  algorithm: string;
}

export function LoadBalancersPage() {
  const { token } = useAppStore();
  const [balancers, setBalancers] = useState<LoadBalancer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalancers();
  }, []);

  const fetchBalancers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/infrastructure/load-balancers/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setBalancers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch load balancers:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Load Balancers</h1>
          <p className="text-[var(--text-muted)] font-medium mb-1">Distribute traffic across your global compute nodes for maximum availability.</p>
          <p className="font-bangla text-[var(--primary)] font-bold text-sm">লোড ব্যালেন্সার — আপনার ট্র্যাফিক সুষমভাবে বণ্টন করুন।</p>
        </div>
        <button className="btn btn-primary px-6">
           <span className="icon">add_circle</span>
           Deploy Load Balancer
        </button>
      </div>

      {/* Load Balancer Visual Overview */}
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
               <h3 className="text-xl font-black mb-3">High Availability</h3>
               <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                  Eliminate single points of failure by distributing incoming traffic across multiple instances using our intelligent L4/L7 load balancing fabric.
               </p>
               <div className="flex gap-2">
                  <span className="badge badge-primary text-[0.6rem]">Auto-Scaling</span>
                  <span className="badge badge-primary text-[0.6rem]">Health Checks</span>
               </div>
            </div>
         </div>
         <div className="card p-8 border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-center text-center">
            <div>
               <div className="w-16 h-16 rounded-full bg-[var(--primary-transparent)] flex items-center justify-center mx-auto mb-4">
                  <span className="icon text-2xl text-[var(--primary)]">bolt</span>
               </div>
               <h4 className="font-black mb-2">Zero Latency Overhead</h4>
               <p className="text-[0.65rem] text-[var(--text-muted)] max-w-[200px]">Direct-server-return (DSR) and specialized network hardware for maximum performance.</p>
            </div>
         </div>
      </div>

      {loading ? (
        <div className="py-20 text-center opacity-50">
           <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
           <p className="text-xs font-black uppercase tracking-widest">Orchestrating Traffic Fabric...</p>
        </div>
      ) : balancers.length === 0 ? (
        <div className="card p-20 text-center border-2 border-dashed border-[var(--border)] bg-transparent">
           <div className="w-20 h-20 rounded-[2rem] bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-8">
              <span className="icon text-4xl text-[var(--text-muted)]">alt_route</span>
           </div>
           <h3 className="text-xl font-black mb-3">No Active Balancers</h3>
           <p className="text-[var(--text-muted)] max-w-sm mx-auto mb-8">Set up your first load balancer to distribute traffic across multiple regions and improve protocol uptime.</p>
           <button className="btn btn-primary">Create Balancer</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {balancers.map(lb => (
            <div key={lb.loadBalancerId} className="card p-6 border border-[var(--border)] hover:border-[var(--primary-transparent-border)] transition-all">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center">
                     <span className="icon text-2xl">alt_route</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest ${lb.status === 'ready' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                     {lb.status}
                  </div>
               </div>
               <h3 className="text-lg font-black mb-1">{lb.name}</h3>
               <p className="text-[0.65rem] font-mono text-[var(--text-muted)] mb-4">{lb.loadBalancerId}</p>
               <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs">
                     <span className="text-[var(--text-muted)] font-bold">IP Address</span>
                     <span className="font-mono">{lb.ipAddress}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="text-[var(--text-muted)] font-bold">Region</span>
                     <span>{lb.region}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="text-[var(--text-muted)] font-bold">Algorithm</span>
                     <span className="px-2 py-0.5 rounded bg-[var(--surface-2)]">{lb.algorithm}</span>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--border)]">
                  <button className="btn btn-ghost border border-[var(--border)] text-xs py-2">Rules</button>
                  <button className="btn btn-ghost border border-[var(--border)] text-xs py-2 text-[var(--danger)]">Delete</button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
