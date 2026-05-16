export function GlobalDNSPage() {

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Global DNS Protocols</h1>
          <p className="text-[var(--text-muted)] font-medium mb-1">Advanced Anycast DNS and PTR record management for global edge routing.</p>
          <p className="font-bangla text-[var(--primary)] font-bold text-sm">গ্লোবাল ডিএনএস — উচ্চ-গতির নেটওয়ার্ক রাউটিং প্রোটোকল।</p>
        </div>
      </div>

      {/* DNS Visual Overview */}
      <div className="card p-10 border border-[var(--border)] bg-[var(--surface-2)] mb-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
         <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[var(--primary-transparent)] blur-[120px] -z-10 opacity-20" />
         <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-black mb-4">Anycast Edge Network</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-8">
               Our global Anycast network ensures your domain resolves at the nearest edge node, minimizing latency and maximizing reliability. Manage your global record fabric through a unified administrative protocol.
            </p>
            <div className="space-y-4">
               {['20+ Global Edge Locations', 'DDoS Protection Included', 'Sub-10ms Global Resolution'].map(f => (
                 <div key={f} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-[var(--primary-transparent)] flex items-center justify-center">
                       <span className="icon text-[var(--primary)] text-xs">done</span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{f}</span>
                 </div>
               ))}
            </div>
         </div>
         <div className="w-full md:w-1/2 flex justify-center">
            <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
               <circle cx="120" cy="120" r="100" stroke="var(--primary)" strokeWidth="1" strokeDasharray="10 10" className="animate-[spin_40s_linear_infinite]" />
               <circle cx="120" cy="120" r="60" stroke="var(--primary)" strokeWidth="2" strokeDasharray="5 5" className="animate-[spin_20s_linear_infinite_reverse]" />
               <circle cx="120" cy="120" r="20" fill="var(--primary)" />
               {[0, 60, 120, 180, 240, 300].map(deg => (
                 <g key={deg} transform={`rotate(${deg}, 120, 120)`}>
                    <circle cx="120" cy="20" r="6" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2" />
                    <line x1="120" y1="26" x2="120" y2="100" stroke="var(--primary)" strokeWidth="1" opacity="0.3" />
                 </g>
               ))}
            </svg>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="card p-8 border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center">
                  <span className="icon text-2xl">public</span>
               </div>
               <h3 className="text-xl font-black">Anycast DNS</h3>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-8">Deploy your DNS across our global 20-region network for sub-10ms resolution worldwide.</p>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
               <span className="text-xs font-bold">Status: Active</span>
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
         </div>

         <div className="card p-8 border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center">
                  <span className="icon text-2xl">settings_ethernet</span>
               </div>
               <h3 className="text-xl font-black">PTR Management</h3>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-8">Configure Reverse DNS (PTR) records for your compute nodes to improve mail delivery and protocol trust.</p>
            <button className="btn btn-ghost border border-[var(--border)] w-full py-3">Configure PTR</button>
         </div>
      </div>
    </div>
  );
}
