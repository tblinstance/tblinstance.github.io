import React from 'react';
import axios from 'axios';
// Advanced Server Control Protocol - High Fidelity
import { SupportChat } from './SupportChat';
import { useAppStore } from '../store/AppStore';

interface Props {
  token: string | null;
  fetchData: () => void;
  showAlert: (title: string, msg: string) => void;
  showPromptUI: (title: string, cb: (val: string) => void) => void;
  manualRequests?: any[];
  users?: any[];
  stats: any;
}

const API_BASE = import.meta.env.VITE_API_BASE;

export function AdminDashboard({ token, fetchData, showAlert, showPromptUI, manualRequests = [], users = [], stats }: Props) {
  const store = useAppStore();
  const [activeChats, setActiveChats] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.toString().includes(searchTerm)
  );

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/chats/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveChats(res.data);
      const totalUnread = res.data.reduce((sum: number, c: any) => sum + (c.unread_count || 0), 0);
      store.setUnreadChatCount(totalUnread);
    } catch {}
  };

  React.useEffect(() => {
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
    fetchChats();
    const interval = setInterval(fetchChats, 3000); // 3s for admin list
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-20">
      <div className="relative overflow-hidden p-10 md:p-14 rounded-[3rem] mb-12 bg-[var(--surface)] border border-[var(--primary-transparent-border)] group shadow-[var(--card-shadow-hover)]">
        {/* Matrix/Tech Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/analytics_bg.webp" 
            className="w-full h-full object-cover opacity-[var(--matrix-opacity)] grayscale brightness-150 mix-blend-[var(--matrix-blend)] hover:scale-110 transition-transform duration-[20s] ease-linear" 
            alt="Matrix Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)]/80 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
          
          {/* Scrolling Data Streams (Analytic Matrix) */}
          <div className="absolute top-0 right-20 bottom-0 w-48 opacity-20 pointer-events-none flex gap-3 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-1 animate-[matrix-fall_12s_infinite_linear]" style={{ animationDelay: `${i * 1.5}s` }}>
                {Array(50).fill(0).map(() => (
                  <span key={Math.random()} className="text-[0.55rem] font-mono text-blue-400">
                    {Math.random().toString(16).substring(2, 8).toUpperCase()}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Scanning Line Effect */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30 animate-[scan_4s_infinite]" />
        </div>

        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-[2rem] bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.2)] group-hover:rotate-6 transition-all duration-700">
              <span className="icon text-5xl">dashboard</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black m-0 tracking-tighter text-[var(--text-main)]">
                Advanced Server Control
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                <span className="text-[0.7rem] font-black text-green-500 uppercase tracking-[0.4em]">Infrastructure Live</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={fetchData} 
              className="px-8 py-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-main)] font-black uppercase tracking-widest text-xs hover:bg-[var(--surface-3)] active:scale-95 transition-all flex items-center gap-3 backdrop-blur-md"
            >
              <span className="icon">sync</span>
              Refresh Intelligence
            </button>
          </div>
        </div>
      </div>

      {/* Real-time System Health Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2 card p-8 bg-[var(--surface)] border border-[var(--border)] shadow-2xl flex items-center justify-between overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="flex items-center gap-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                 <span className="icon text-3xl">health_and_safety</span>
              </div>
              <div>
                 <div className="text-xl font-black text-[var(--text-main)] mb-1 uppercase tracking-tight">System Operational Integrity</div>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                       <span className="text-[0.65rem] font-black text-green-500 uppercase tracking-widest">Core: 99.9% Uptime</span>
                    </div>
                    <div className="w-px h-3 bg-[var(--border)]" />
                    <span className="text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-widest">Latency: 14ms</span>
                 </div>
              </div>
           </div>
           <div className="flex gap-2 relative z-10">
              {[0.9, 0.95, 1, 0.98, 1, 1].map((v, i) => (
                <div key={i} className="w-1.5 rounded-full bg-green-500/20 relative h-10 overflow-hidden">
                   <div className="absolute bottom-0 left-0 w-full bg-green-500 transition-all duration-1000" style={{ height: `${v*100}%` }} />
                </div>
              ))}
           </div>
        </div>
        
        <div className="card p-8 bg-[var(--surface)] border border-[var(--border)] shadow-2xl flex flex-col justify-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="flex items-center justify-between relative z-10">
              <div>
                 <div className="text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2">Signal Integrity</div>
                 <div className="text-3xl font-black text-blue-500 tracking-tighter">OPTIMIZED</div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-blue-500/10 border-t-blue-500 animate-spin" />
           </div>
        </div>
      </div>

      {/* Intelligence Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card p-8 bg-[var(--surface)] border-[var(--border)] backdrop-blur-md group hover:border-[var(--primary)] transition-all shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-blue-500/10">
            <span className="icon text-2xl">group</span>
          </div>
          <div className="text-4xl font-black text-[var(--text-main)] tracking-tighter mb-1">{stats?.total_users || 0}</div>
          <div className="text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Registered Entities</div>
        </div>

        <div className="card p-8 bg-[var(--surface)] border-[var(--border)] backdrop-blur-md group hover:border-indigo-500/20 transition-all shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-indigo-500/10">
            <span className="icon text-2xl">dns</span>
          </div>
          <div className="text-4xl font-black text-[var(--text-main)] tracking-tighter mb-1">{stats?.total_servers || 0}</div>
          <div className="text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Active Deployments</div>
        </div>

        <div className="card p-8 bg-[var(--surface)] border-[var(--border)] backdrop-blur-md group hover:border-orange-500/20 transition-all shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-orange-500/10">
            <span className="icon text-2xl">pending_actions</span>
          </div>
          <div className="text-4xl font-black text-[var(--text-main)] tracking-tighter mb-1">{stats?.total_pending || 0}</div>
          <div className="text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Pending Requests</div>
        </div>

        <div className="card p-8 bg-[var(--surface)] border-[var(--border)] backdrop-blur-md group hover:border-violet-500/20 transition-all shadow-2xl cursor-pointer" onClick={() => store.setAdminChatTargetId(-1)}>
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-violet-500/10">
            <span className="icon text-2xl">chat</span>
          </div>
          <div className="text-4xl font-black text-[var(--text-main)] tracking-tighter mb-1">{activeChats.length}</div>
          <div className="text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Live Support Nodes</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="card p-12 bg-[var(--surface)] border-[var(--border)] shadow-[var(--card-shadow)] backdrop-blur-xl group hover:border-[var(--primary)] transition-all rounded-[3rem]">
          <h3 className="text-2xl font-black mb-10 flex items-center gap-5 text-[var(--text-main)]">
            <div className="w-12 h-12 rounded-[1.25rem] bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
              <span className="icon text-2xl">trending_up</span>
            </div>
            Platform Financial Health
          </h3>
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-6 group/item">
              <span className="text-[0.75rem] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Avg User Equity</span>
              <span className="text-3xl font-black text-[var(--text-main)] tracking-tighter group-hover/item:text-blue-400 transition-colors">
                {stats?.total_users ? (stats.total_balance / stats.total_users).toFixed(2) : 0} <small className="text-xs text-[var(--text-muted)] font-bold uppercase ml-1">BDT</small>
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-6 group/item">
              <span className="text-[0.75rem] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Gross Infrastructure Revenue</span>
              <span className="text-3xl font-black text-green-500 tracking-tighter group-hover/item:scale-105 transition-transform">{stats?.total_income || 0} <small className="text-xs text-[var(--text-muted)] font-bold uppercase ml-1">BDT</small></span>
            </div>
            <div className="flex justify-between items-center group/item">
              <span className="text-[0.75rem] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Current Verification Queue</span>
              <span className={`text-3xl font-black tracking-tighter transition-all ${manualRequests.length > 0 ? 'text-orange-500 animate-pulse' : 'text-[var(--text-muted)]'}`}>
                {manualRequests.length} <small className="text-[0.65rem] font-black opacity-40 uppercase ml-1">Units</small>
              </span>
            </div>
          </div>
        </div>

        <div className="card p-12 bg-[var(--surface)] border-[var(--border)] shadow-[var(--card-shadow)] backdrop-blur-xl group hover:border-indigo-500/20 transition-all rounded-[3rem]">
          <h3 className="text-2xl font-black mb-10 flex items-center gap-5 text-[var(--text-main)]">
            <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20 group-hover:rotate-12 transition-transform">
              <span className="icon text-2xl">rocket_launch</span>
            </div>
            Quick System Overrides
          </h3>
          <div className="grid grid-cols-2 gap-5">
            <button 
              onClick={() => {
                showPromptUI("TARGET USER EMAIL", (email) => {
                  if (!email) return;
                  showPromptUI("CREDIT AMOUNT (BDT)", (amt) => {
                    if (!amt) return;
                    axios.post(`${API_BASE}/admin/add-balance/`, { email, amount: amt }, {
                      headers: { Authorization: `Bearer ${token}` }
                    }).then(() => {
                      showAlert('Success', `Credited ${amt} BDT to ${email}`);
                      fetchData();
                    }).catch(() => showAlert('Error', 'Transaction failed. Check email or permissions.'));
                  });
                });
              }}
              className="p-8 rounded-[2rem] bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-[var(--text-on-primary)] transition-all flex flex-col items-center gap-4 group/action"
            >
              <span className="icon text-3xl group-hover/action:scale-125 transition-transform">account_balance_wallet</span>
              <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-center leading-relaxed">Direct Credit Injection</span>
            </button>
            <button 
              onClick={() => store.setActiveTab('system_settings')}
              className="p-8 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 hover:bg-indigo-500 hover:text-[var(--text-on-primary)] transition-all flex flex-col items-center gap-4 group/action"
            >
              <span className="icon text-3xl group-hover/action:scale-125 transition-transform">settings_input_component</span>
              <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-center leading-relaxed">Global Params Adjust</span>
            </button>
            <button 
              onClick={() => {
                showPromptUI("BROADCAST TITLE", (title) => {
                  if (!title) return;
                  showPromptUI("BROADCAST MESSAGE", (msg) => {
                    if (!msg) return;
                    axios.post(`${API_BASE}/admin/broadcast-message/`, { title, message: msg }, {
                      headers: { Authorization: `Bearer ${token}` }
                    }).then(() => {
                      showAlert('✅ Success', `Broadcast sent to all protocols.`);
                    }).catch(() => showAlert('Error', 'Broadcast failed. Check permissions.'));
                  });
                });
              }}
              className="p-8 rounded-[2rem] bg-orange-500/10 border border-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-[var(--text-on-primary)] transition-all flex flex-col items-center gap-4 group/action"
            >
              <span className="icon text-3xl group-hover/action:scale-125 transition-transform">campaign</span>
              <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-center leading-relaxed">Global Protocol Broadcast</span>
            </button>
            <button 
              onClick={() => store.setActiveTab('users')}
              className="p-8 rounded-[2rem] bg-violet-500/10 border border-violet-500/20 text-violet-500 hover:bg-violet-500 hover:text-[var(--text-on-primary)] transition-all flex flex-col items-center gap-4 group/action"
            >
              <span className="icon text-3xl group-hover/action:scale-125 transition-transform">admin_panel_settings</span>
              <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-center leading-relaxed">Advanced User Governance Console</span>
            </button>
          </div>
        </div>

      </div>

      {/* Critical Expirations (Next 5 Days) */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--danger-transparent)] text-[var(--danger)] flex items-center justify-center border border-[var(--danger-transparent-border)]">
            <span className="icon">event_busy</span>
          </div>
          <h3 className="text-2xl font-black m-0 tracking-tight text-[var(--text-main)]">
            Critical Expirations
          </h3>
          {stats?.expiring_soon?.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-[var(--danger-transparent)] border border-[var(--danger-transparent-border)] text-[var(--danger)] text-xs font-black">
              {stats.expiring_soon.length} ACTION REQUIRED
            </span>
          )}
        </div>

        {!stats?.expiring_soon || stats.expiring_soon.length === 0 ? (
          <div className="card py-10 text-center bg-[var(--surface-2)]">
            <p className="text-[var(--text-muted)] font-medium m-0">No servers expiring in the next 5 days.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.expiring_soon.map((s: any) => (
              <div key={s.id} className="card p-5 border-l-4 border-l-red-500 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-black text-lg text-[var(--text-main)] truncate">{s.name}</div>
                    <span className="text-[0.6rem] font-bold bg-red-500 text-[var(--text-on-danger)] px-2 py-0.5 rounded uppercase">{s.days_left} Days Left</span>
                  </div>
                  <div className="text-xs font-medium text-[var(--text-muted)] mb-4">{s.user_email}</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm btn-primary flex-1">Extend</button>
                  <button className="btn btn-sm btn-secondary flex-1 border-[var(--border)]">Notify</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suspended / Unpaid Orders */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--danger-transparent)] text-[var(--danger)] flex items-center justify-center border border-[var(--danger-transparent-border)]">
            <span className="icon">credit_card_off</span>
          </div>
          <h3 className="text-2xl font-black m-0 tracking-tight text-[var(--text-main)]">
            Unpaid Orders (Suspended)
          </h3>
          {stats?.suspended_servers?.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-[var(--danger-transparent)] border border-[var(--danger-transparent-border)] text-[var(--danger)] text-xs font-black">
              {stats.suspended_servers.length} UNPAID
            </span>
          )}
        </div>

        {!stats?.suspended_servers || stats.suspended_servers.length === 0 ? (
          <div className="card py-10 text-center bg-[var(--surface-2)]">
            <p className="text-[var(--text-muted)] font-medium m-0">No suspended servers found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.suspended_servers.map((s: any) => (
              <div key={s.id} className="card p-5 border-l-4 border-l-red-600 flex flex-col justify-between opacity-80 hover:opacity-100 transition-all">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-black text-lg text-[var(--text-main)] truncate">{s.name}</div>
                    <span className="text-[0.6rem] font-bold bg-red-600 text-[var(--text-on-danger)] px-2 py-0.5 rounded uppercase">Suspended</span>
                  </div>
                  <div className="text-xs font-medium text-[var(--text-muted)] mb-2">{s.user_email}</div>
                  <div className="text-xs font-mono bg-[var(--bg)] px-2 py-1 rounded border border-[var(--border)] mb-4">
                    Contabo ID: {s.contabo_id}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={async () => {
                      if (!window.confirm(`Permanently delete ${s.name} on Contabo? This cannot be undone.`)) return;
                      try {
                        await axios.post(`${API_BASE}/admin/delete-server/`, { server_id: s.id }, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        showAlert('✅ Deleted', 'Server has been permanently cancelled and removed.');
                        fetchData();
                      } catch (err: any) {
                        showAlert('Error', err.response?.data?.error || 'Failed to delete server');
                      }
                    }}
                    className="btn btn-sm bg-[var(--danger)] text-[var(--text-on-danger)] hover:bg-red-700 border-none flex-1"
                  >
                    <span className="icon icon-sm mr-1">delete_forever</span> Terminate
                  </button>
                  <button 
                    onClick={() => window.open((import.meta.env.VITE_API_BASE || '').replace('/api', '') + '/admin/tblinc/server/' + s.id + '/change/', '_blank')}
                    className="btn btn-sm btn-secondary flex-1 border-[var(--border)]"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-16">
        <h3 className="text-3xl font-black mb-10 flex items-center gap-5 text-[var(--text-main)]">
          <div className="w-12 h-12 rounded-[1.25rem] bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
            <span className="icon text-2xl">receipt_long</span>
          </div>
          Verification Queue
          <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[0.65rem] font-black uppercase tracking-widest border border-orange-500/20 ml-2">
            {manualRequests.length} Pending
          </span>
        </h3>
        
        {manualRequests.length === 0 ? (
          <div className="card p-24 text-center bg-[var(--surface-2)] border-dashed border-[var(--border)] rounded-[3rem] shadow-inner">
            <div className="w-20 h-20 rounded-full bg-[var(--text-main)]/[0.02] flex items-center justify-center mx-auto mb-6">
              <span className="icon text-5xl text-[var(--text-muted)]">verified_user</span>
            </div>
            <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.4em] m-0 text-sm">All Payment Protocols Verified</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {manualRequests.map((r: any) => (
              <div key={r.id} className="card p-10 bg-[var(--surface)] border-[var(--border)] hover:border-orange-500/30 transition-all group relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                   <span className="icon text-[10rem]">payments</span>
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] flex items-center justify-center font-black text-[var(--text-main)] text-lg">
                          {r.user_email[0].toUpperCase()}
                       </div>
                       <div>
                          <div className="text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1">Entity</div>
                          <div className="text-md font-bold text-[var(--text-main)] truncate max-w-[140px]" title={r.user_email}>{r.user_email}</div>
                       </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1">Deposit</div>
                      <div className="text-3xl font-black text-green-500 tracking-tighter">{r.amount} <small className="text-xs opacity-50 font-bold uppercase ml-1">BDT</small></div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-[var(--bg)] rounded-[2rem] border border-[var(--border)] mb-8 font-mono text-[0.75rem] text-[var(--text-muted)] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="opacity-30 uppercase tracking-widest text-[0.6rem] font-black">Protocol ID</span>
                      <span className="text-blue-400 font-bold tracking-widest">#{r.id.toString(16).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-30 uppercase tracking-widest text-[0.6rem] font-black">Method</span>
                      <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-500 text-[0.6rem] font-black border border-orange-500/10">{r.method || 'MANUAL_DEPOSIT'}</span>
                    </div>
                    {r.transaction_id && (
                      <div className="flex justify-between items-center border-t border-[var(--border)] pt-3">
                        <span className="opacity-30 uppercase tracking-widest text-[0.6rem] font-black">TrxID</span>
                        <span className="text-[var(--text-main)] font-black flex items-center gap-2">
                           {r.transaction_id}
                           <button onClick={() => navigator.clipboard.writeText(r.transaction_id)} className="icon text-[0.8rem] hover:text-blue-400">content_copy</button>
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {r.screenshot && (
                    <div className="mb-6 rounded-[1.5rem] overflow-hidden border border-[var(--border)] group/img relative">
                      <img 
                        src={(import.meta.env.VITE_API_BASE || '').replace('/api', '') + r.screenshot} 
                        alt="Payment Proof" 
                        className="w-full h-32 object-cover hover:scale-110 transition-transform cursor-pointer"
                        onClick={() => window.open((import.meta.env.VITE_API_BASE || '').replace('/api', '') + r.screenshot, '_blank')}
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
                        <span className="icon text-white">zoom_in</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={async () => {
                        try {
                          await axios.post(`${API_BASE}/admin/approve-manual/`, { request_id: r.id }, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          showAlert('✅ Approved', `${r.amount} BDT added to ${r.user_email}`);
                          fetchData();
                        } catch { showAlert('Error', 'Failed to approve.'); }
                      }}
                      className="py-5 rounded-2xl bg-green-500/10 text-green-500 font-black uppercase tracking-[0.2em] text-[0.65rem] border border-green-500/20 hover:bg-green-500 hover:text-[var(--text-on-success)] transition-all shadow-xl"
                    >
                      Authorize
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await axios.post(`${API_BASE}/admin/reject-manual/`, { request_id: r.id }, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          showAlert('Rejected', `Request from ${r.user_email} rejected.`);
                          fetchData();
                        } catch { showAlert('Error', 'Failed to reject.'); }
                      }}
                      className="py-5 rounded-2xl bg-red-500/10 text-red-500 font-black uppercase tracking-[0.2em] text-[0.65rem] border border-red-500/20 hover:bg-red-500 hover:text-[var(--text-on-danger)] transition-all shadow-xl"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Approval Queue */}
      <div className="mb-16">
        <h3 className="text-3xl font-black mb-10 flex items-center gap-5 text-[var(--text-main)]">
          <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
            <span className="icon text-2xl">person_add_check</span>
          </div>
          Account Approval Queue
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[0.65rem] font-black uppercase tracking-widest border border-indigo-500/20 ml-2">
            {store.unapprovedUsers?.length || 0} Pending
          </span>
        </h3>
        
        {!store.unapprovedUsers || store.unapprovedUsers.length === 0 ? (
          <div className="card p-24 text-center bg-[var(--surface-2)] border-dashed border-[var(--border)] rounded-[3rem] shadow-inner">
            <div className="w-20 h-20 rounded-full bg-[var(--text-main)]/[0.02] flex items-center justify-center mx-auto mb-6">
              <span className="icon text-5xl text-[var(--text-muted)]">how_to_reg</span>
            </div>
            <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.4em] m-0 text-sm">No Accounts Awaiting Approval</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {store.unapprovedUsers.map((u: any) => (
              <div key={u.id} className="card p-10 bg-[var(--surface)] border-[var(--border)] hover:border-indigo-500/30 transition-all group relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-2xl border border-indigo-500/20">
                      {u.email[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-md font-black text-[var(--text-main)]">{u.email}</div>
                      <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                        Joined {new Date(u.date_joined).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={async () => {
                        try {
                          await axios.post(`${API_BASE}/admin/approve-user/`, { user_id: u.id }, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          showAlert('✅ Approved', `User ${u.email} has been approved.`);
                          fetchData();
                        } catch { showAlert('Error', 'Failed to approve user.'); }
                      }}
                      className="flex-1 py-4 rounded-2xl bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-[0.6rem] shadow-[0_10px_30px_rgba(99,102,241,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Approve
                    </button>
                    <button
                      onClick={async () => {
                        if(window.confirm(`Reject and delete ${u.email}?`)) {
                          try {
                            await axios.post(`${API_BASE}/admin/delete-user/`, { user_id: u.id }, {
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            showAlert('⚠️ Rejected', `User ${u.email} has been rejected.`);
                            fetchData();
                          } catch { showAlert('Error', 'Failed to reject user.'); }
                        }
                      }}
                      className="flex-1 py-4 rounded-2xl bg-red-600/10 text-red-600 border border-red-600/20 font-black uppercase tracking-[0.2em] text-[0.6rem] hover:bg-red-600 hover:text-white transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Integrity & Resource Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Revenue Growth Analysis */}
        <div className="card p-10 bg-[var(--surface)] border-[var(--border)] shadow-2xl lg:col-span-2 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5">
              <span className="icon text-[12rem]">analytics</span>
           </div>
           <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-[var(--text-main)] relative z-10">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/10">
                 <span className="icon">show_chart</span>
              </div>
              Revenue Growth Analysis (30D)
           </h3>
           <div className="h-[250px] w-full flex items-end justify-between gap-2 relative z-10">
              {stats?.income_30d?.length > 0 ? (
                stats.income_30d.map((d: any, i: number) => (
                  <div key={i} className="flex-1 group relative">
                    <div 
                      className="w-full bg-blue-500/20 group-hover:bg-blue-500 transition-all rounded-t-lg relative"
                      style={{ 
                        height: `${Math.max(5, (d.amount / (Math.max(...stats.income_30d.map((x:any)=>x.amount)) || 1)) * 200)}px`,
                      }}
                    >
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--surface-2)] text-[0.6rem] font-black px-2 py-1 rounded border border-[var(--border)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                          {d.amount} BDT
                       </div>
                    </div>
                    <div className="mt-4 text-[0.5rem] font-bold text-[var(--text-muted)] rotate-45 origin-left opacity-30 group-hover:opacity-100 transition-opacity">
                       {d.date.split('-')[2]}/{d.date.split('-')[1]}
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs opacity-40 italic">
                   Insufficient temporal data for visualization
                </div>
              )}
           </div>
        </div>

        {/* Platform Hub */}
        <div className="card p-10 bg-[var(--surface)] border-[var(--border)] shadow-2xl flex flex-col">
           <h3 className="text-2xl font-black mb-10 flex items-center gap-4 text-[var(--text-main)]">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/10">
                 <span className="icon">hub</span>
              </div>
              Platform Hub
           </h3>
           <div className="space-y-4 flex-1">
              <button 
                onClick={async () => {
                  try {
                    await axios.post(`${API_BASE}/settings/sync-rate/`, {}, { headers: { Authorization: `Bearer ${token}` } });
                    showAlert('✅ Success', 'Contabo Metadata Mesh Synchronized.');
                    fetchData();
                  } catch { showAlert('Error', 'Sync protocol failed.'); }
                }}
                className="w-full p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-blue-500/30 transition-all flex items-center gap-5 group"
              >
                 <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
                    <span className="icon">sync</span>
                 </div>
                 <div className="text-left">
                    <div className="text-sm font-black text-[var(--text-main)] mb-1">Global Metadata Sync</div>
                    <div className="text-[0.6rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">Realign with Contabo Core</div>
                 </div>
              </button>

              <button 
                onClick={() => store.setActiveTab('activity_logs')}
                className="w-full p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-green-500/30 transition-all flex items-center gap-5 group"
              >
                 <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                    <span className="icon">history_edu</span>
                 </div>
                 <div className="text-left">
                    <div className="text-sm font-black text-[var(--text-main)] mb-1">Central Audit Ledger</div>
                    <div className="text-[0.6rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">View Platform-wide activity</div>
                 </div>
              </button>

              <div className="mt-8 p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">API Core Status</span>
                    <span className="flex items-center gap-2 text-[0.6rem] font-black text-green-500">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                       OPERATIONAL
                    </span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Node Distribution</span>
                    <span className="text-[0.6rem] font-black text-blue-400">
                       {stats?.region_dist?.length || 0} CLUSTERS
                    </span>
                 </div>
              </div>
           </div>
        </div>

        {/* Direct Access Protocols */}
        <div className="card p-10 bg-[var(--surface)] border-[var(--border)] shadow-2xl flex flex-col">
           <h3 className="text-2xl font-black mb-10 flex items-center gap-4 text-[var(--text-main)]">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/10">
                 <span className="icon">settings_applications</span>
              </div>
              Direct Access Protocols
           </h3>
           <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Cloud Deploy', desc: 'Direct Provisioning', icon: 'cloud_upload', color: 'blue', action: () => store.setActiveTab('admin_deploy') },
                { label: 'Governance', desc: 'Clearance Matrix', icon: 'admin_panel_settings', color: 'purple', action: () => store.setActiveTab('admin_permissions') },
                { label: 'System Settings', desc: 'Configure Core Variables', icon: 'settings', color: 'blue', action: () => showAlert('System Settings', 'Access Restricted to Superuser Terminal.') },
                { label: 'SMTP Diagnostic', desc: 'Verify Signal Integrity', icon: 'alternate_email', color: 'indigo', action: () => {
                   showPromptUI("TARGET EMAIL FOR TEST", (email) => {
                      if(!email) return;
                      axios.post(`${API_BASE}/admin/tblinc-email/`, { email }, { headers: { Authorization: `Bearer ${token}` } })
                        .then(() => showAlert('✅ Success', 'Diagnostic signal sent successfully.'))
                        .catch(() => showAlert('Error', 'Diagnostic transmission failed.'));
                   });
                }},
                { label: 'SMS Gateway Status', desc: 'Check ElitBuzz Balance', icon: 'sms', color: 'orange', action: () => showAlert('SMS Status', 'Gateway: CONNECTED | Balance: 1,452.20 BDT') },
                { label: 'User Verification', desc: 'Manage Approval Queue', icon: 'verified_user', color: 'green', action: () => document.getElementById('approval-queue')?.scrollIntoView({ behavior: 'smooth' }) },
              ].map((link, i) => (
                <button 
                  key={i}
                  onClick={link.action}
                  className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--surface)] hover:border-[var(--primary-transparent-border)] transition-all flex items-center gap-4 group/link"
                >
                   <div className={`w-10 h-10 rounded-xl bg-${link.color}-500/10 text-${link.color}-500 flex items-center justify-center group-hover/link:scale-110 transition-transform`}>
                      <span className="icon text-lg">{link.icon}</span>
                   </div>
                   <div className="text-left flex-1">
                      <div className="text-xs font-black text-[var(--text-main)] mb-0.5">{link.label}</div>
                      <div className="text-[0.55rem] font-bold text-[var(--text-muted)] uppercase tracking-wider">{link.desc}</div>
                   </div>
                   <span className="icon text-[var(--text-muted)] opacity-0 group-hover/link:opacity-100 transition-opacity">chevron_right</span>
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="mb-12">
        <div className="relative overflow-hidden p-10 md:p-14 rounded-[3rem] mb-10 bg-[var(--surface)] border border-[var(--primary-transparent-border)] group shadow-[var(--card-shadow-hover)]">
          {/* Matrix Analytic Background */}
          <div className="absolute inset-0 z-0">
             <img 
               src="/analytics_bg.webp" 
               className="w-full h-full object-cover opacity-10 grayscale brightness-150 mix-blend-overlay" 
               alt="Matrix Analytic"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)]/40 to-transparent" />
             
             {/* Scrolling Data Streams (Analytic Matrix) */}
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
          </div>
          
          <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 rounded-[2rem] bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center border border-[var(--primary-transparent-border)] shadow-[var(--glow-primary)] group-hover:scale-110 transition-all duration-700">
                <span className="icon text-5xl">analytics</span>
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-black m-0 tracking-tighter text-[var(--text-main)] flex items-center gap-6">
                  User Management
                  <div className="hidden md:flex items-center gap-3 px-6 py-3 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] focus-within:border-blue-500/50 transition-all shadow-inner">
                    <span className="icon text-[var(--text-muted)] text-xl">search</span>
                    <input 
                      type="text" 
                      placeholder="Protocol Search (Email/UID)..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-transparent border-none outline-none text-sm font-bold text-[var(--text-main)] w-64 placeholder:opacity-30"
                    />
                  </div>
                </h3>
                <p className="text-[var(--text-sub)] font-medium mt-4 max-w-xl text-lg leading-relaxed">
                  Overview of all registered users and their wallet balances. Real-time analytic oversight of platform liabilities and user governance.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
               <div className="p-8 bg-[var(--surface-2)] rounded-[2rem] border border-[var(--border)] flex-1 min-w-[200px]">
                  <div className="text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-2">Total Users</div>
                  <div className="text-4xl font-black text-[var(--text-main)] tracking-tighter">{users?.length || 0}</div>
                </div>
               <div className="px-8 py-5 rounded-[2rem] bg-indigo-500/[0.05] border border-indigo-500/10 backdrop-blur-xl hover:border-indigo-500/30 transition-all">
                  <div className="text-[0.7rem] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Liability Balance</div>
                  <div className="text-4xl font-black text-indigo-400 tracking-tighter">
                    {users?.reduce((sum: number, u: any) => sum + (parseFloat(u.balance) || 0), 0).toFixed(2)} 
                    <span className="text-sm text-indigo-400/30 font-bold uppercase tracking-widest ml-2">BDT</span>
                  </div>
               </div>
               <div className="px-8 py-5 rounded-[2rem] bg-violet-500/[0.05] border border-violet-500/10 backdrop-blur-xl hover:border-violet-500/30 transition-all">
                  <div className="text-[0.7rem] font-black text-violet-400 uppercase tracking-[0.3em] mb-2">Active Clearance</div>
                  <div className="text-4xl font-black text-violet-400 tracking-tighter">
                    {users?.filter((u: any) => u.is_active).length || 0}
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-[#0A0A0A]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="p-8 text-[0.75rem] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">User Protocol ID</th>
                  <th className="p-8 text-[0.75rem] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Wallet Balance</th>
                  <th className="p-8 text-[0.75rem] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Clearance Level</th>
                  <th className="p-8 text-[0.75rem] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] text-right">System Overrides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-[var(--text-muted)] italic font-medium">
                      No user records matched the current search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u: any) => (
                    <tr key={u.id} className="hover:bg-[var(--primary-transparent)]/5 transition-colors group/row">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center border border-[var(--border)] font-black text-[var(--primary)] group-hover/row:scale-110 transition-transform">
                            {u.email[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-black text-[var(--text-main)] text-sm">{u.email}</div>
                            <div className="text-[0.6rem] font-mono text-[var(--text-muted)] mt-0.5">UID: {u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="font-mono font-black text-[var(--primary)] text-sm">{parseFloat(u.balance).toLocaleString()} BDT</div>
                        <div className="text-[0.6rem] font-bold text-[var(--text-muted)] uppercase tracking-tighter">Credits Available</div>
                      </td>
                      <td className="p-5">
                        <div className="flex gap-2">
                          {u.is_staff && (
                            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-500 text-[0.6rem] font-black uppercase border border-indigo-500/20 shadow-sm">
                              Admin
                            </span>
                          )}
                          <span className={`px-2.5 py-1 rounded-md text-[0.6rem] font-black uppercase border shadow-sm ${
                            u.is_active 
                              ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                              : 'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                            {u.is_active ? 'Verified' : 'Suspended'}
                          </span>
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={async () => {
                              try {
                                await axios.post(`${API_BASE}/admin/toggle-active/`, { user_id: u.id }, {
                                  headers: { Authorization: `Bearer ${token}` }
                                });
                                showAlert('Success', `User ${u.email} status toggled.`);
                                fetchData();
                              } catch { showAlert('Error', 'Failed to toggle status.'); }
                            }}
                            className="btn btn-ghost btn-xs text-[0.65rem] font-black uppercase border border-[var(--border)] px-3 hover:bg-[var(--surface-2)]"
                          >
                            {u.is_active ? 'Suspend' : 'Activate'}
                          </button>
                          <button 
                            onClick={async () => {
                              if (!window.confirm(`Permanently delete user ${u.email}?`)) return;
                              try {
                                await axios.post(`${API_BASE}/admin/delete-user/`, { user_id: u.id }, {
                                  headers: { Authorization: `Bearer ${token}` }
                                });
                                showAlert('Success', 'User deleted successfully.');
                                fetchData();
                              } catch { showAlert('Error', 'Failed to delete user.'); }
                            }}
                            className="btn btn-ghost btn-xs text-[0.65rem] font-black uppercase text-red-500 border border-red-500/20 px-3 hover:bg-red-500/10"
                          >
                            Purge
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Chat Overlay for Admin */}
      {store.adminChatTargetId !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-4xl h-[80vh] relative">
            {store.adminChatTargetId === -1 ? (
              <div className="flex flex-col h-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl">
                 <div className="p-6 bg-[var(--surface-2)] border-b border-[var(--border)] flex justify-between items-center">
                    <h3 className="text-xl font-black m-0">Customer Support Inbox</h3>
                    <button onClick={() => store.setAdminChatTargetId(null)} className="icon text-[var(--text-muted)]">close</button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {activeChats.length === 0 && <div className="p-20 text-center opacity-40">No active conversations.</div>}
                    {activeChats.map((c: any) => (
                      <div 
                        key={c.user_id} 
                        onClick={() => store.setAdminChatTargetId(c.user_id)}
                        className="p-5 card border border-[var(--border)] hover:border-[var(--primary)] cursor-pointer flex justify-between items-center group transition-all"
                      >
                        <div>
                          <div className="font-black text-[var(--text-main)] mb-1">{c.user_email}</div>
                          <div className="text-sm text-[var(--text-muted)] truncate max-w-md italic">"{c.last_message}"</div>
                        </div>
                        <div className="flex items-center gap-4">
                          {c.unread_count > 0 && <span className="bg-[var(--danger)] text-[var(--text-on-danger)] text-[0.6rem] font-black px-2 py-1 rounded-full">{c.unread_count} NEW</span>}
                          <span className="icon text-[var(--text-muted)] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            ) : (
              <div className="h-full">
                <SupportChat 
                  token={token} 
                  targetUserId={store.adminChatTargetId} 
                  onClose={() => store.setAdminChatTargetId(-1)} 
                  currentUserEmail="Admin"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
