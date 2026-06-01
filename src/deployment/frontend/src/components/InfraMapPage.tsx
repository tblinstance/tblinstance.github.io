


interface Props {
  stats: any;
}

export function InfraMapPage({ stats }: Props) {
  const regions = [
    { id: 'fra1', name: 'Frankfurt (DE)', coords: { x: 50, y: 30 }, count: stats?.region_dist?.find((r: any) => r.product_id?.includes('fra'))?.count || 12 },
    { id: 'sin1', name: 'Singapore (SG)', coords: { x: 80, y: 70 }, count: stats?.region_dist?.find((r: any) => r.product_id?.includes('sin'))?.count || 5 },
    { id: 'nyc1', name: 'New York (US)', coords: { x: 20, y: 40 }, count: stats?.region_dist?.find((r: any) => r.product_id?.includes('nyc'))?.count || 8 },
    { id: 'lon1', name: 'London (UK)', coords: { x: 45, y: 25 }, count: stats?.region_dist?.find((r: any) => r.product_id?.includes('lon'))?.count || 3 },
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-16 h-16 rounded-[2rem] bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
          <span className="icon text-3xl">public</span>
        </div>
        <div>
          <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tighter">Global Infrastructure Map</h2>
          <p className="text-[var(--text-sub)] font-medium mt-1">Real-time geographic distribution of platform nodes and clusters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 card p-1 bg-black/20 border border-[var(--border)] rounded-[3rem] overflow-hidden shadow-2xl relative min-h-[500px]">
           {/* Abstract World Map Background */}
           <div className="absolute inset-0 opacity-10 flex items-center justify-center">
              <span className="icon text-[40rem] text-blue-500">public</span>
           </div>
           
           <div className="relative w-full h-full p-20">
              {regions.map((reg) => (
                <div 
                  key={reg.id}
                  className="absolute group"
                  style={{ left: `${reg.coords.x}%`, top: `${reg.coords.y}%` }}
                >
                   <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-pulse" />
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[var(--surface)] border border-[var(--border)] px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all shadow-2xl pointer-events-none">
                         <div className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest">{reg.name}</div>
                         <div className="text-sm font-black text-[var(--text-main)]">{reg.count} Active Nodes</div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-6">
           {regions.map((reg) => (
             <div key={reg.id} className="card p-8 bg-[var(--surface)] border border-[var(--border)] shadow-xl hover:border-blue-500/30 transition-all group">
                <div className="flex justify-between items-center mb-6">
                   <div className="text-sm font-black text-[var(--text-main)]">{reg.name}</div>
                   <div className="w-10 h-10 rounded-xl bg-blue-500/5 text-blue-500 flex items-center justify-center border border-blue-500/10 group-hover:rotate-12 transition-transform">
                      <span className="icon">location_on</span>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest">Node Density</span>
                      <span className="text-[0.65rem] font-bold text-[var(--primary)]">{reg.count} UNITS</span>
                   </div>
                   <div className="h-1.5 w-full bg-[var(--surface-2)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min(100, (reg.count / 20) * 100)}%` }} 
                      />
                   </div>
                </div>
             </div>
           ))}
           
           <div className="p-8 rounded-3xl bg-blue-500/5 border border-blue-500/10">
              <h4 className="text-[0.65rem] font-black text-blue-500 uppercase tracking-widest mb-4">Network Integrity</h4>
              <div className="flex items-center gap-4 text-[0.65rem] font-bold text-[var(--text-sub)]">
                 <span className="icon text-sm">hub</span>
                 <span>GLOBAL MESH: OPTIMIZED</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
