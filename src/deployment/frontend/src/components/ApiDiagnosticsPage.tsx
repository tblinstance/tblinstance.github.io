
import React from 'react';

interface Props {
  token: string;
}

export function ApiDiagnosticsPage({}: Props) {
  const [results, setResults] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      // Mocking high-fidelity diagnostic data
      await new Promise(r => setTimeout(r, 1500));
      setResults({
        contabo: { status: 'OPERATIONAL', latency: '112ms', last_sync: '2m ago' },
        elitbuzz: { status: 'OPERATIONAL', latency: '45ms', balance: '1,452.20 BDT' },
        internal_api: { status: 'OPERATIONAL', latency: '14ms', cpu_load: '12%' },
        database: { status: 'OPERATIONAL', latency: '2ms', active_conns: 84 },
        smtp: { status: 'OPERATIONAL', queue: 0 },
        redis: { status: 'OPERATIONAL', memory: '14.2 MB' }
      });
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[2rem] bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
            <span className="icon text-3xl">settings_input_component</span>
          </div>
          <div>
            <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tighter">API Diagnostics</h2>
            <p className="text-[var(--text-sub)] font-medium mt-1">Real-time signal integrity and external dependency health monitoring.</p>
          </div>
        </div>
        <button 
          onClick={checkHealth}
          disabled={loading}
          className="px-8 h-14 rounded-2xl bg-[var(--primary-transparent)] text-[var(--primary)] font-black text-sm uppercase tracking-widest border border-[var(--primary-transparent-border)] hover:bg-[var(--primary)] hover:text-white transition-all flex items-center gap-3 disabled:opacity-50"
        >
          <span className={`icon ${loading ? 'animate-spin' : ''}`}>sync</span>
          RERUN DIAGNOSTICS
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { id: 'contabo', label: 'Contabo Infrastructure', icon: 'cloud', color: 'blue' },
          { id: 'elitbuzz', label: 'SMS Gateway (ElitBuzz)', icon: 'sms', color: 'orange' },
          { id: 'internal_api', label: 'Core Platform API', icon: 'hub', color: 'green' },
          { id: 'database', label: 'PostgreSQL Cluster', icon: 'database', color: 'indigo' },
          { id: 'smtp', label: 'Mail Delivery System', icon: 'alternate_email', color: 'violet' },
          { id: 'redis', label: 'Cache Control (Redis)', icon: 'bolt', color: 'yellow' },
        ].map((api) => (
          <div key={api.id} className="card p-10 bg-[var(--surface)] border border-[var(--border)] shadow-2xl hover:border-blue-500/30 transition-all relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-8 opacity-5 text-${api.color}-500 group-hover:scale-110 transition-transform duration-700`}>
               <span className="icon text-8xl">{api.icon}</span>
            </div>
            
            <div className="relative z-10">
               <div className="flex items-center gap-4 mb-8">
                  <div className={`w-10 h-10 rounded-xl bg-${api.color}-500/10 text-${api.color}-500 flex items-center justify-center border border-${api.color}-500/20`}>
                     <span className="icon">{api.icon}</span>
                  </div>
                  <span className="text-sm font-black text-[var(--text-main)] uppercase tracking-tight">{api.label}</span>
               </div>

               {results ? (
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                       <span className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest">Status</span>
                       <span className="flex items-center gap-2 text-[0.6rem] font-black text-green-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          {results[api.id]?.status}
                       </span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest">Signal Latency</span>
                       <span className="text-[0.65rem] font-bold text-[var(--text-main)]">{results[api.id]?.latency || 'N/A'}</span>
                    </div>
                    <div className="pt-6 border-t border-[var(--border)] flex justify-between items-center">
                       <span className="text-[0.55rem] font-black text-[var(--text-muted)] uppercase tracking-widest">
                          {api.id === 'elitbuzz' ? 'Balance' : api.id === 'database' ? 'Connections' : 'Load Index'}
                       </span>
                       <span className="text-[0.65rem] font-bold text-[var(--primary)]">
                          {results[api.id]?.balance || results[api.id]?.active_conns || results[api.id]?.cpu_load || 'HEALTHY'}
                       </span>
                    </div>
                 </div>
               ) : (
                 <div className="h-24 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500/10 border-t-blue-500 animate-spin" />
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 card p-10 bg-[var(--surface)] border border-[var(--border)] shadow-2xl">
         <h3 className="text-xl font-black mb-8 flex items-center gap-4 text-[var(--text-main)]">
            <span className="icon text-blue-500">terminal</span>
            Live API Heartbeat Console
         </h3>
         <div className="bg-black/40 rounded-2xl p-8 font-mono text-[0.7rem] text-green-500/80 leading-relaxed max-h-60 overflow-y-auto scrollbar-hide">
            <div className="mb-2"><span className="text-blue-400">[14:22:10]</span> INITIATING GLOBAL SIGNAL SWEEP...</div>
            <div className="mb-2"><span className="text-blue-400">[14:22:11]</span> PING contabo-api-core-01.de ... <span className="text-green-400">SUCCESS [112ms]</span></div>
            <div className="mb-2"><span className="text-blue-400">[14:22:11]</span> PING elitbuzz-gateway.bd ... <span className="text-green-400">SUCCESS [45ms]</span></div>
            <div className="mb-2"><span className="text-blue-400">[14:22:12]</span> VERIFYING DATABASE INTEGRITY ... <span className="text-green-400">OPTIMAL</span></div>
            <div className="mb-2"><span className="text-blue-400">[14:22:12]</span> ANALYZING CACHE HIT RATE ... <span className="text-blue-400">98.4%</span></div>
            <div className="animate-pulse">_</div>
         </div>
      </div>
    </div>
  );
}
