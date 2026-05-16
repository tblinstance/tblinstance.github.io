import axios from 'axios';

interface Props {
  servers: any[];
  token: string | null;
  fetchData: () => void;
  showAlert: (title: string, msg: string) => void;
  showConfirm: (title: string, msg: string, cb: () => void, isDanger?: boolean) => void;
  onNewServer: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE;

export function ServersPage({ servers, token, fetchData, showAlert, showConfirm, onNewServer }: Props) {
  const control = async (id: number, action: string, extra?: object) => {
    try {
      await axios.post(`${API_BASE}/control/${id}/`, { action, ...extra }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch { showAlert('Error', 'Action failed'); }
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-20">
      {/* Premium Analytic Header */}
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
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-[2rem] bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-all duration-700">
              <span className="icon text-5xl">dns</span>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black m-0 tracking-tighter text-[var(--text-main)]">
                Compute Overview
              </h2>
              <p className="text-[var(--text-sub)] font-medium mt-3 max-w-xl text-lg leading-relaxed">
                Management of your active cloud compute fleet. Monitor performance, allocate resources, and maintain infrastructure integrity.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onNewServer} 
              className="px-10 py-5 rounded-[2rem] bg-[var(--primary)] text-[var(--text-on-primary)] font-black uppercase tracking-widest text-sm shadow-[var(--glow-primary)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-none cursor-pointer"
            >
              <span className="icon">add</span>
              Deploy Node
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: 'bolt', label: 'Active Fleet', value: servers.filter((s: any) => s.status === 'RUNNING').length, color: 'text-green-500', bg: 'bg-green-500/5' },
          { icon: 'memory', label: 'Total vCPUs', value: servers.reduce((sum: number, s: any) => sum + (s.cpu || 0), 0), color: 'text-blue-500', bg: 'bg-blue-500/5' },
          { icon: 'speed', label: 'RAM Load', value: `${servers.reduce((sum: number, s: any) => sum + (s.ram_gb || 0), 0)} GB`, color: 'text-indigo-500', bg: 'bg-indigo-500/5' },
          { icon: 'dns', label: 'NVMe Space', value: `${servers.reduce((sum: number, s: any) => sum + (s.disk_gb || 0), 0)} GB`, color: 'text-violet-500', bg: 'bg-violet-500/5' },
        ].map(m => (
          <div key={m.label} className={`card p-8 border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)] group hover:border-[var(--primary-transparent-border)] transition-all rounded-[2rem]`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${m.bg} ${m.color} flex items-center justify-center border border-[var(--border)]`}>
                <span className="icon">{m.icon}</span>
              </div>
              <span className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{m.label}</span>
            </div>
            <div className="text-4xl font-black text-[var(--text-main)] tracking-tighter">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Analytics Banner */}
      <div className="relative w-full h-80 rounded-[3rem] overflow-hidden mb-12 bg-[var(--surface)] border border-[var(--border)] shadow-[var(--card-shadow)] group">
        <img 
          src="/analytics_bg.png" 
          alt="Network Analytics" 
          className="w-full h-full object-cover opacity-[var(--matrix-opacity)] grayscale brightness-150 mix-blend-[var(--matrix-blend)] transition-transform duration-[30s] group-hover:scale-125" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/60 to-transparent"></div>
        <div className="absolute bottom-12 left-12 z-10">
          <div className="flex items-center gap-3 mb-3">
             <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-ping" />
             <span className="text-[0.7rem] font-black text-[var(--primary)] uppercase tracking-[0.4em]">Real-Time Telemetry Protocol</span>
          </div>
          <h3 className="m-0 text-3xl md:text-4xl font-black text-[var(--text-main)] tracking-tighter">Global Network Analytics</h3>
          <p className="m-0 mt-3 text-[var(--text-sub)] font-medium max-w-xl text-lg leading-relaxed">Bandwidth utilization and edge traffic routing across your active compute nodes.</p>
        </div>
      </div>

      {/* Server Cards */}
      {servers.length === 0 ? (
        <div className="py-24 text-center card bg-[var(--surface-2)]">
          <div className="w-20 h-20 rounded-full bg-[var(--primary-transparent)] flex items-center justify-center mx-auto mb-6">
            <span className="icon text-4xl text-[var(--primary)]">dns</span>
          </div>
          <h3 className="text-xl font-bold mb-2">No servers found</h3>
          <p className="text-[var(--text-muted)] m-0">You haven't deployed any servers yet. Head to the Marketplace to get started.</p>
          <button onClick={onNewServer} className="btn btn-secondary mt-6">Go to Marketplace</button>
        </div>
      ) : (
        <div className="grid gap-8">
          {servers.map((s: any) => {
            const isRunning = s.status === 'RUNNING' || s.status === 'active';
            const isPending = s.status.includes('PENDING') || s.status.includes('PROVISIONING') || s.status.includes('PAYMENT');
            
            return (
              <div key={s.id} className="card p-10 bg-[var(--surface)] border-[var(--border)] group hover:border-[var(--primary-transparent-border)] transition-all shadow-[var(--card-shadow)] rounded-[3rem]">
                <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-10 mb-10">
                  <div className="flex items-start gap-8">
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 border transition-all duration-500 ${isRunning ? 'bg-green-500/10 border-green-500/20 text-green-500 shadow-[0_0_40px_rgba(34,197,94,0.1)]' : 'bg-white/5 border-white/5 text-white/20'}`}>
                      <span className="icon text-4xl">dns</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-3xl font-black m-0 tracking-tighter text-[var(--text-main)]">{s.name}</h3>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-widest border ${isRunning ? 'bg-green-500/10 text-green-500 border-green-500/20' : isPending ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                           <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : isPending ? 'bg-orange-500 animate-bounce' : 'bg-red-500'}`} />
                           {s.status}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-3 text-blue-400 font-mono text-[0.8rem] font-bold bg-blue-500/5 px-4 py-2 rounded-2xl border border-blue-500/10">
                          <span className="icon text-sm">public</span>
                          <span className="text-white/20 text-[0.6rem] font-black uppercase tracking-[0.2em]">IPv4</span>
                          {s.ipv4}
                        </div>
                        {s.ipv6 && s.ipv6 !== 'None' && (
                          <div className="flex items-center gap-3 text-indigo-400 font-mono text-[0.8rem] font-bold bg-indigo-500/5 px-4 py-2 rounded-2xl border border-indigo-500/10">
                            <span className="icon text-sm">language</span>
                            <span className="text-white/20 text-[0.6rem] font-black uppercase tracking-[0.2em]">IPv6</span>
                            <span className="truncate max-w-[200px]" title={s.ipv6}>{s.ipv6}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 xl:justify-end">
                    <button onClick={() => control(s.id, 'start')} className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-[var(--text-on-success)] transition-all flex items-center justify-center border border-green-500/20 shadow-lg" title="Power On">
                      <span className="icon">play_arrow</span>
                    </button>
                    <button onClick={() => control(s.id, 'stop')} className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-[var(--text-on-primary)] transition-all flex items-center justify-center border border-orange-500/20 shadow-lg" title="Power Off">
                      <span className="icon">stop</span>
                    </button>
                    <button onClick={() => control(s.id, 'restart')} className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-[var(--text-on-primary)] transition-all flex items-center justify-center border border-blue-500/20 shadow-lg" title="Reboot">
                      <span className="icon">restart_alt</span>
                    </button>
                    <button 
                      onClick={() => showConfirm('REBUILD SYSTEM?', 'This will erase all data and reinstall the OS. Proceed?', async () => {
                        await control(s.id, 'reinstallOs', { imageId: s.image_id });
                        showAlert('Success', 'Node rebuild initiated.');
                      }, true)} 
                      className="w-12 h-12 rounded-2xl bg-white/5 text-white/40 hover:bg-white hover:text-black transition-all flex items-center justify-center border border-white/10 shadow-lg"
                      title="Rebuild Node"
                    >
                      <span className="icon text-xl">settings_backup_restore</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
                  {[
                    { label: 'Compute', val: `${s.cpu} vCore`, icon: 'memory', color: 'text-blue-500' },
                    { label: 'Memory', val: `${s.ram_gb} GB`, icon: 'speed', color: 'text-indigo-500' },
                    { label: 'NVMe', val: `${s.disk_gb} GB`, icon: 'dns', color: 'text-violet-500' },
                    { label: 'Zone', val: s.region, icon: 'public', color: 'text-[var(--text-muted)]' },
                    { label: 'Protocol', val: s.os_type, icon: 'terminal', color: 'text-[var(--text-muted)]' },
                    { label: 'Tier', val: s.product, icon: 'inventory_2', color: 'text-[var(--text-muted)]' },
                    { label: 'Renewal', val: `${s.plan_price || 0} BDT`, icon: 'payments', color: 'text-green-500' }
                  ].map(item => (
                    <div key={item.label} className="p-5 bg-[var(--surface-2)] rounded-3xl border border-[var(--border)] group-hover:border-[var(--primary-transparent-border)] transition-colors">
                      <div className="flex items-center gap-2 text-[0.65rem] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] mb-2">
                        <span className={`icon text-sm ${item.color}`}>{item.icon}</span>
                        {item.label}
                      </div>
                      <div className="text-[0.95rem] font-bold text-[var(--text-main)] truncate">{item.val}</div>
                    </div>
                  ))}
                </div>
                
                {s.expires_at && (
                  <div className={`mt-8 p-6 rounded-[2rem] border flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
                    (s.expires_at ? Math.ceil((new Date(s.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 30) <= 5 
                    ? 'bg-red-500/5 border-red-500/20 text-red-500 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.1)]' 
                    : 'bg-white/[0.02] border-white/5 text-white/60'
                  }`}>
                    <div className="flex items-center gap-4">
                      <span className="icon text-2xl">event</span>
                      <div className="text-sm font-black uppercase tracking-[0.2em]">
                        Service Expiry: <span className="text-white ml-2">{new Date(s.expires_at).toLocaleDateString()}</span>
                        <span className="ml-4 opacity-50 font-medium">
                          [{Math.ceil((new Date(s.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Days Remaining]
                        </span>
                      </div>
                    </div>
                    <button className="px-8 py-3 rounded-2xl bg-blue-500 text-white font-black uppercase tracking-widest text-[0.65rem] shadow-xl hover:scale-105 active:scale-95 transition-all border-none">
                      <span className="icon text-sm mr-2">payments</span>
                      Settle Renewal
                    </button>
                  </div>
                )}

                {s.error && (
                  <div className="mt-8 flex items-center gap-4 p-6 bg-red-500/10 rounded-[2rem] border border-red-500/20 text-red-500 text-sm font-black uppercase tracking-widest animate-pulse">
                    <span className="icon text-2xl">warning</span>
                    System Alert: {s.error}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
