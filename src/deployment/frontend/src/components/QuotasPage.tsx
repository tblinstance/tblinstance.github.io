


export function QuotasPage() {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-16 h-16 rounded-[2rem] bg-violet-500/10 text-violet-500 flex items-center justify-center border border-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
          <span className="icon text-3xl">leaderboard</span>
        </div>
        <div>
          <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tighter">Resource Quotas</h2>
          <p className="text-[var(--text-sub)] font-medium mt-1">Manage global infrastructure limits and individual user resource allocations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {[
          { label: 'Max Servers per User', value: '10', unit: 'UNITS', icon: 'dns', color: 'blue' },
          { label: 'Daily Deployment Limit', value: '50', unit: 'UNITS', icon: 'speed', color: 'green' },
          { label: 'Max Snapshot Retention', value: '5', unit: 'DAYS', icon: 'camera', color: 'orange' },
          { label: 'API Rate Limit', value: '1,000', unit: 'REQ/HR', icon: 'bolt', color: 'indigo' },
        ].map((q) => (
          <div key={q.label} className="card p-10 bg-[var(--surface)] border border-[var(--border)] shadow-2xl hover:border-violet-500/30 transition-all group">
             <div className="flex items-center justify-between mb-8">
                <div className={`w-12 h-12 rounded-2xl bg-${q.color}-500/10 text-${q.color}-500 flex items-center justify-center border border-${q.color}-500/20 group-hover:scale-110 transition-transform`}>
                   <span className="icon text-2xl">{q.icon}</span>
                </div>
                <button className="text-[0.6rem] font-black text-blue-500 uppercase tracking-widest hover:underline">Edit Policy</button>
             </div>
             <div className="text-sm font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">{q.label}</div>
             <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[var(--text-main)] tracking-tighter">{q.value}</span>
                <span className="text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-widest">{q.unit}</span>
             </div>
          </div>
        ))}
      </div>

      <div className="card p-10 bg-black/20 border border-white/5 rounded-[3rem]">
         <div className="flex items-center gap-4 mb-8">
            <span className="icon text-violet-500">lock_open</span>
            <h3 className="text-xl font-black text-[var(--text-main)]">Quota Override Protocols</h3>
         </div>
         <p className="text-[var(--text-sub)] text-sm font-medium leading-relaxed mb-8">
            Global quotas are enforced across all non-staff accounts. To grant specific overrides, navigate to the **Users** section and modify the "Privileged Access" flag or contact the infrastructure lead for cluster-wide policy adjustments.
         </p>
         <div className="flex gap-4">
            <button className="px-8 h-14 rounded-2xl bg-violet-500 text-white font-black text-sm uppercase tracking-widest hover:bg-violet-600 transition-all shadow-lg">Modify Global Policy</button>
            <button className="px-8 h-14 rounded-2xl bg-white/5 text-[var(--text-main)] font-black text-sm uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all">Download Audit PDF</button>
         </div>
      </div>
    </div>
  );
}
