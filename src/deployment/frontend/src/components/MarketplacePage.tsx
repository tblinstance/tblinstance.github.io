import type { Plan } from './types';

interface MarketplaceProps {
  plans: Plan[];
  onSelect: (plan: Plan) => void;
  exchangeRate: number;
}

export function MarketplacePage({ plans, onSelect, exchangeRate }: MarketplaceProps) {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden p-10 md:p-14 rounded-[3rem] mb-12 bg-[var(--surface)] border border-[var(--primary-transparent-border)] group shadow-[var(--card-shadow-hover)]">
        {/* Matrix Analytic Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/analytics_bg.png" 
            className="w-full h-full object-cover opacity-[var(--matrix-opacity)] grayscale brightness-150 mix-blend-[var(--matrix-blend)] hover:scale-110 transition-transform duration-[20s] ease-linear" 
            alt="Matrix Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)]/80 to-transparent" />
          
          {/* Scrolling Data Streams */}
          <div className="absolute top-0 right-10 bottom-0 w-32 opacity-20 pointer-events-none flex gap-2 overflow-hidden">
             {[...Array(4)].map((_, i) => (
               <div key={i} className="flex flex-col gap-1 animate-[matrix-fall_10s_infinite_linear]" style={{ animationDelay: `${i * 2}s` }}>
                 {Array(40).fill(0).map(() => (
                   <span key={Math.random()} className="text-[0.5rem] font-mono text-[var(--primary)]">
                     {Math.random().toString(16).substring(2, 8).toUpperCase()}
                   </span>
                 ))}
               </div>
             ))}
          </div>
          
          {/* Scanning Line */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-20 animate-[scan_4s_infinite_linear]" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
          <div className="flex-1 min-w-[300px]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary-transparent)] text-[var(--primary)] text-[0.65rem] font-black mb-4 border border-[var(--primary-transparent-border)] uppercase tracking-widest">
              <span className="icon icon-sm">bolt</span> Instant Provisioning Protocol
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[var(--text-main)] m-0 mb-4 tracking-tighter">Infrastructure Marketplace</h2>
            <p className="text-lg text-[var(--text-sub)] m-0 leading-relaxed max-w-xl font-medium">Deploy high-performance NVMe cloud compute nodes globally in under 60 seconds.</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none p-6 bg-[var(--surface-2)] rounded-[2rem] border border-[var(--border)] text-center shadow-sm">
              <div className="text-4xl font-black text-[var(--primary)] mb-1 tracking-tighter">4</div>
              <div className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest">Global Zones</div>
            </div>
            <div className="flex-1 md:flex-none p-6 bg-[var(--surface-2)] rounded-[2rem] border border-[var(--border)] text-center shadow-sm">
              <div className="text-4xl font-black text-[var(--success)] mb-1 tracking-tighter">99.9%</div>
              <div className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest">SLA Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {plans.map(p => (
          <div key={p.id} className="card p-8 flex flex-col hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-[var(--text-main)] m-0">{p.name}</h3>
              <span className="badge badge-success">Available</span>
            </div>
            
            <div className="flex flex-col mb-6">
              <div className="text-4xl font-black text-[var(--text-main)]">
                {p.price_bdt}<span className="text-base font-normal text-[var(--text-muted)] ml-2">BDT/mo</span>
              </div>
              {p.base_price && p.markup && (
                <div className="flex items-center gap-2 mt-2 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  <span>{p.base_price} Base</span>
                  <span className="text-[var(--primary)]">+ {p.markup} Profit</span>
                </div>
              )}
              <div className="text-sm font-bold text-[var(--text-muted)] mt-2 opacity-70">
                ≈ ${parseFloat((p.price_bdt / exchangeRate).toFixed(2))} USD
              </div>
            </div>
            
            <hr className="border-t border-[var(--border)] my-0 mb-6" />
            
            <ul className="list-none p-0 m-0 mb-8 grid grid-cols-2 gap-4 flex-1">
              <li className="flex items-center gap-2.5 text-[var(--text-sub)]">
                <span className="icon text-[var(--primary)] shrink-0">memory</span>
                <span className="font-semibold text-xs">{p.cpu} vCPU Cores</span>
              </li>
              <li className="flex items-center gap-2.5 text-[var(--text-sub)]">
                <span className="icon text-[var(--primary)] shrink-0">speed</span>
                <span className="font-semibold text-xs">{p.ram} RAM</span>
              </li>
              <li className="flex items-center gap-2.5 text-[var(--text-sub)]">
                <span className="icon text-[var(--primary)] shrink-0">dns</span>
                <span className="font-semibold text-xs">{p.storage}</span>
              </li>
              <li className="flex items-center gap-2.5 text-[var(--text-sub)]">
                <span className="icon text-[var(--primary)] shrink-0">public</span>
                <span className="font-semibold text-xs">{p.bandwidth} Out</span>
              </li>
              {p.snapshots && (
                <li className="flex items-center gap-2.5 text-[var(--text-sub)]">
                  <span className="icon text-[var(--primary)] shrink-0">layers</span>
                  <span className="font-semibold text-xs">{p.snapshots} {p.snapshots === 1 ? 'Snapshot' : 'Snapshots'}</span>
                </li>
              )}
              {p.port_speed && (
                <li className="flex items-center gap-2.5 text-[var(--text-sub)]">
                  <span className="icon text-[var(--primary)] shrink-0">bolt</span>
                  <span className="font-semibold text-xs">{p.port_speed} Port</span>
                </li>
              )}
              {p.traffic && (
                <li className="flex items-center gap-2.5 text-[var(--text-sub)] col-span-2">
                  <span className="icon text-[var(--success)] shrink-0">all_inclusive</span>
                  <span className="font-semibold text-xs text-[var(--text-main)]">Unlimited Incoming Traffic</span>
                </li>
              )}
            </ul>
            
            <button onClick={() => onSelect(p)} className="btn btn-primary w-full py-3.5 text-base">
              <span className="icon">rocket_launch</span>
              Configure & Deploy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
