import { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchFirewalls();
  }, []);

  const fetchFirewalls = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/infrastructure/firewalls/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setFirewalls(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch firewalls:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Cloud Firewalls</h1>
          <p className="text-[var(--text-muted)] font-medium mb-1">Define protocol-level security rules and shield your infrastructure from malicious traffic.</p>
          <p className="font-bangla text-[var(--primary)] font-bold text-sm">ক্লাউড ফায়ারওয়াল — আপনার ইনফ্রাস্ট্রাকচার সুরক্ষিত রাখুন।</p>
        </div>
        <button className="btn btn-primary px-6">
           <span className="icon">shield</span>
           Create Firewall
        </button>
      </div>

      {/* Firewall Visual Overview */}
      <div className="card p-10 border border-[var(--border)] bg-[var(--surface-2)] mb-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--primary-transparent),transparent)] opacity-40 -z-10" />
         <div className="w-full md:w-3/5">
            <h2 className="text-2xl font-black mb-4">Security Perimeter</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
               Configure granular inbound and outbound traffic rules to protect your instances. Our stateless firewall fabric operates at the network edge, ensuring malicious packets are dropped before they reach your compute nodes.
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
               <path d="M100 30L160 50V100C160 140 135 175 100 185C65 175 40 140 40 100V50L100 30Z" stroke="var(--primary)" strokeWidth="3" fill="var(--primary-transparent)" />
               <circle cx="100" cy="100" r="30" stroke="var(--primary)" strokeWidth="1" strokeDasharray="4 4" className="animate-spin" />
               <path d="M80 100L95 115L125 85" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
         </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
           <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
           <p className="font-bold tracking-widest text-xs uppercase">Resolving Security Layers...</p>
        </div>
      ) : firewalls.length === 0 ? (
        <div className="card p-20 text-center border-2 border-dashed border-[var(--border)] bg-transparent">
           <div className="w-20 h-20 rounded-[2rem] bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-8">
              <span className="icon text-4xl text-[var(--text-muted)]">wall</span>
           </div>
           <h3 className="text-xl font-black mb-3">No Firewalls Defined</h3>
           <p className="text-[var(--text-muted)] max-w-sm mx-auto mb-8">Secure your compute nodes by creating a firewall policy with custom inbound and outbound rules.</p>
           <button className="btn btn-primary">Create Policy</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {firewalls.map(f => (
            <div key={f.firewallId} className="card p-6 border border-[var(--border)] hover:border-[var(--primary-transparent-border)] transition-all">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center">
                     <span className="icon text-xl">shield</span>
                  </div>
                  {f.isDefault && (
                    <span className="px-2 py-1 rounded-lg bg-[var(--surface-2)] text-[0.6rem] font-black uppercase tracking-widest text-[var(--text-muted)]">Default</span>
                  )}
               </div>
               <h3 className="text-lg font-black mb-1">{f.name}</h3>
               <p className="text-xs text-[var(--text-muted)] mb-4">{f.description}</p>
               <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
                  <span className="text-[0.65rem] font-mono text-[var(--text-muted)]">{f.firewallId}</span>
                  <button className="btn btn-ghost text-xs py-1.5 hover:text-[var(--primary)] transition-colors">Edit Rules</button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
