export function StatusView() {
  const regions = [
    { name: 'London, UK (LON-1)', status: 'Operational', uptime: '99.99%', latency: '12ms' },
    { name: 'Frankfurt, DE (FRA-1)', status: 'Operational', uptime: '100%', latency: '8ms' },
    { name: 'Singapore, SG (SGP-1)', status: 'Operational', uptime: '99.98%', latency: '45ms' },
    { name: 'New York, US (NYC-1)', status: 'Operational', uptime: '99.99%', latency: '18ms' },
  ];

  const services = [
    { name: 'Compute Protocol (KVM)', status: 'Operational' },
    { name: 'Storage Fabric (NVMe)', status: 'Operational' },
    { name: 'Network Backbone (VPC)', status: 'Operational' },
    { name: 'Administrative API', status: 'Operational' },
    { name: 'Customer Dashboard', status: 'Operational' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] font-['Outfit'] overflow-x-hidden">
      {/* Matrix Header */}
      <section className="relative py-32 px-5 md:px-12 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 z-0">
           <img src="/analytics_bg.webp" className="w-full h-full object-cover opacity-[0.05] dark:opacity-[0.1] grayscale" alt="Matrix" />
           <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 font-bold text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                All Systems Operational
             </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            Platform <span className="text-[var(--primary)]">Health.</span>
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed mb-4">
            Real-time oversight of the TBLINC global compute mesh and infrastructure protocols.
          </p>
          <p className="font-bangla text-[var(--primary)] font-bold text-lg">
             প্ল্যাটফর্ম হেলথ — আমাদের সার্ভার এবং ইনফ্রাস্ট্রাকচারের বর্তমান অবস্থা।
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-5 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(svc => (
              <div key={svc.name} className="card p-6 border border-[var(--border)] flex justify-between items-center bg-[var(--surface)]">
                 <div className="font-bold text-sm tracking-tight">{svc.name}</div>
                 <div className="text-xs font-black text-green-500 uppercase tracking-widest">{svc.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Table */}
      <section className="py-24 px-5 md:px-12 bg-[var(--surface-2)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-12 tracking-tight">Regional Oversight</h2>
          <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
             <table className="w-full text-left">
                <thead className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                   <tr>
                      <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Region</th>
                      <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Status</th>
                      <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Uptime (30d)</th>
                      <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Edge Latency</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                   {regions.map(r => (
                     <tr key={r.name} className="hover:bg-[var(--surface-2)] transition-colors">
                        <td className="p-6 font-bold text-sm">{r.name}</td>
                        <td className="p-6">
                           <div className="flex items-center gap-2 text-green-500 font-bold text-xs uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              {r.status}
                           </div>
                        </td>
                        <td className="p-6 font-mono text-sm opacity-60">{r.uptime}</td>
                        <td className="p-6 font-mono text-sm text-[var(--primary)]">{r.latency}</td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      </section>

      {/* Incident Logs */}
      <section className="py-24 px-5 md:px-12">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black mb-12 tracking-tight">Protocol Incidents</h2>
            <div className="space-y-8">
               <div className="relative pl-8 border-l-2 border-[var(--border)]">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[var(--surface)] border-2 border-[var(--border)]" />
                  <div className="text-sm font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">May 12, 2026</div>
                  <div className="font-bold mb-2">Network Protocol Optimization - LON-1</div>
                  <p className="text-sm text-[var(--text-muted)] m-0">Scheduled maintenance of the primary fiber backbone in the London region. No downtime was observed.</p>
               </div>
               <div className="relative pl-8 border-l-2 border-[var(--border)]">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[var(--surface)] border-2 border-[var(--border)]" />
                  <div className="text-sm font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">May 08, 2026</div>
                  <div className="font-bold mb-2">Dashboard API Scaling</div>
                  <p className="text-sm text-[var(--text-muted)] m-0">Successfully expanded API capacity by 40% to accommodate increased deployment traffic.</p>
               </div>
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5 md:px-12 bg-[var(--surface-2)] text-center">
         <div className="max-w-2xl mx-auto card p-12 border-2 border-[var(--primary-transparent-border)]">
            <h3 className="text-2xl font-black mb-4">Want real-time alerts?</h3>
            <p className="text-[var(--text-muted)] mb-8">Subscribe to our infrastructure alerts via Discord or Email for instant protocol status changes.</p>
            <button className="btn btn-primary px-8">Subscribe to Alerts</button>
         </div>
      </section>
    </div>
  );
}
