import { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  token: string | null;
  showAlert: (title: string, msg: string) => void;
  showConfirm: (title: string, msg: string, cb: () => void, isDanger?: boolean) => void;
  showPromptUI: (title: string, cb: (val: string) => void) => void;
}

const API_BASE = import.meta.env.VITE_API_BASE;

export function AdminServersPage({ token, showAlert, showConfirm, showPromptUI }: Props) {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllServers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/all-servers/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServers(res.data);
    } catch {
      showAlert('Error', 'Failed to fetch all servers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllServers();
  }, [token]);

  const filteredServers = servers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.ip_address?.includes(searchTerm) ||
    s.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="py-20 text-center">
      <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
      <div className="text-blue-500/50 font-black uppercase tracking-[0.3em] text-xs">Decrypting Fleet Data...</div>
    </div>
  );

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
            <div className="w-20 h-20 rounded-[2rem] bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center border border-[var(--primary-transparent-border)] shadow-[var(--glow-primary)] group-hover:scale-110 transition-all duration-700">
              <span className="icon text-5xl">dns</span>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black m-0 tracking-tighter text-[var(--text-main)]">
                Global Server Fleet
              </h2>
              <p className="text-[var(--text-sub)] font-medium mt-3 max-w-xl text-lg leading-relaxed">
                Centralized monitoring and management of all compute instances. Full authority over lifecycle, status, and network allocation.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="p-8 bg-[var(--surface-2)] rounded-[2rem] border border-[var(--border)] flex-1 min-w-[200px]">
              <div className="text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-2">Total Deployments</div>
              <div className="text-4xl font-black text-[var(--text-main)] tracking-tighter">{servers.length}</div>
            </div>
            <div className="p-8 bg-[var(--primary-transparent)] rounded-[2rem] border border-[var(--primary-transparent-border)] flex-1 min-w-[200px]">
              <div className="text-[0.7rem] font-black text-[var(--primary)] uppercase tracking-[0.3em] mb-2">Active Uptime</div>
              <div className="text-4xl font-black text-[var(--primary)] tracking-tighter">
                {servers.filter(s => s.status === 'RUNNING' || s.status === 'active').length}
                <span className="text-sm opacity-30 font-bold uppercase tracking-widest ml-2">Nodes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10 relative group">
        <span className="icon absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors text-2xl">search</span>
        <input 
          type="text" 
          placeholder="Filter fleet by ID, IP, or Owner..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-16 pr-6 py-6 bg-[var(--surface)] border border-[var(--border)] rounded-3xl text-[var(--text-main)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-transparent)] transition-all font-medium text-lg placeholder:text-[var(--text-muted)] shadow-sm"
        />
      </div>

      <div className="card overflow-hidden shadow-[var(--card-shadow)] border-[var(--border)] bg-[var(--surface)] rounded-[3rem]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--surface-2)] border-b border-[var(--border)]">
                {['Instance Details', 'Owner Entity', 'Network IP', 'Provider ID', 'Operational Status', 'Uptime Date', 'Overrides'].map(h => (
                  <th key={h} className="px-8 py-6 text-left text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredServers.map((s: any) => (
                <tr key={s.id} className="hover:bg-[var(--primary-transparent)] transition-colors group">
                  <td className="px-8 py-7">
                    <div className="font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">{s.name}</div>
                    <div className="text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1">UUID: {s.id}</div>
                  </td>
                  <td className="px-8 py-7 text-sm font-medium text-[var(--text-sub)]">{s.user_email}</td>
                  <td className="px-8 py-7 font-mono text-sm text-[var(--primary)] font-bold">{s.ip_address || 'ALLOCATING'}</td>
                  <td className="px-8 py-7 font-mono text-xs text-[var(--text-muted)]">{s.contabo_id}</td>
                  <td className="px-8 py-7">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest border ${s.status === 'RUNNING' || s.status === 'active' ? 'bg-[var(--success-transparent)] text-[var(--success)] border-[var(--success-transparent-border)]' : 'bg-[var(--warning-transparent)] text-[var(--warning)] border-[var(--warning-transparent-border)]'}`}>
                      <span className={`w-1 h-1 rounded-full ${s.status === 'RUNNING' || s.status === 'active' ? 'bg-[var(--success)] animate-pulse' : 'bg-[var(--warning)]'}`} />
                      {s.status}
                    </div>
                  </td>
                  <td className="px-8 py-7 text-sm text-[var(--text-muted)]">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex gap-2">
                      <button 
                        onClick={async () => {
                          try {
                            await axios.post(`${API_BASE}/servers/${s.id}/control/`, { action: 'start' }, { headers: { Authorization: `Bearer ${token}` }});
                            showAlert('Success', 'Start command sent.');
                            fetchAllServers();
                          } catch { showAlert('Error', 'Action failed.'); }
                        }}
                        className="w-10 h-10 rounded-xl bg-[var(--success-transparent)] text-[var(--success)] hover:bg-[var(--success)] hover:text-[var(--text-on-success)] transition-all flex items-center justify-center border border-[var(--success-transparent-border)]"
                        title="Power On"
                      >
                        <span className="icon text-lg">play_arrow</span>
                      </button>
                      <button 
                        onClick={async () => {
                          try {
                            await axios.post(`${API_BASE}/servers/${s.id}/control/`, { action: 'stop' }, { headers: { Authorization: `Bearer ${token}` }});
                            showAlert('Success', 'Stop command sent.');
                            fetchAllServers();
                          } catch { showAlert('Error', 'Action failed.'); }
                        }}
                        className="w-10 h-10 rounded-xl bg-[var(--warning-transparent)] text-[var(--warning)] hover:bg-[var(--warning)] hover:text-[var(--text-on-primary)] transition-all flex items-center justify-center border border-[var(--warning-transparent-border)]"
                        title="Power Off"
                      >
                        <span className="icon text-lg">stop</span>
                      </button>
                      <button 
                        onClick={async () => {
                          try {
                            await axios.post(`${API_BASE}/servers/${s.id}/control/`, { action: 'restart' }, { headers: { Authorization: `Bearer ${token}` }});
                            showAlert('Success', 'Reboot command sent.');
                            fetchAllServers();
                          } catch { showAlert('Error', 'Action failed.'); }
                        }}
                        className="w-10 h-10 rounded-xl bg-[var(--primary-transparent)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--text-on-primary)] transition-all flex items-center justify-center border border-[var(--primary-transparent-border)]"
                        title="Reboot"
                      >
                        <span className="icon text-lg">refresh</span>
                      </button>
                      <button 
                        onClick={() => {
                          showPromptUI("Enter NEW root password for rebuild", (pass) => {
                            if (!pass) return;
                            showConfirm(
                              "ERASE AND REBUILD?", 
                              "This will destroy all data on the instance and reinstall the OS. Proceed?",
                              async () => {
                                try {
                                  await axios.post(`${API_BASE}/servers/${s.id}/control/`, { action: 'rebuild', password: pass }, { headers: { Authorization: `Bearer ${token}` }});
                                  showAlert('Success', 'Rebuild initiated.');
                                  fetchAllServers();
                                } catch { showAlert('Error', 'Rebuild failed.'); }
                              },
                              true
                            );
                          });
                        }}
                        className="w-10 h-10 rounded-xl bg-[var(--surface-2)] text-[var(--text-muted)] hover:bg-[var(--text-main)] hover:text-[var(--surface)] transition-all flex items-center justify-center border border-[var(--border)]"
                        title="Rebuild OS"
                      >
                        <span className="icon text-lg">build</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredServers.length === 0 && (
        <div className="card py-20 text-center bg-[var(--surface-2)] mt-6">
          <span className="icon text-5xl text-[var(--text-muted)] opacity-20 mb-4">dns</span>
          <p className="text-[var(--text-muted)] font-medium m-0">No servers found matching your search.</p>
        </div>
      )}
    </div>
  );
}
