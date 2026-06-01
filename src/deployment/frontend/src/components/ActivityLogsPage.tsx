import { useState, useEffect } from 'react';
import { useAppStore } from '../store/AppStore';

interface LogEntry {
  id: string;
  type: string;
  message: string;
  status: string;
  created_at: string;
  amount: number;
  transaction_id?: string;
}

export function ActivityLogsPage() {
  const { token, isStaff } = useAppStore();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const endpoint = isStaff ? 'admin/all-transactions' : 'transactions';
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/${endpoint}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Platform Activity</h1>
          <p className="text-[var(--text-muted)] font-medium mb-1">Full audit trail of your infrastructure deployments and financial transactions.</p>
          <p className="font-bangla text-[var(--primary)] font-bold text-sm">প্ল্যাটফর্ম অ্যাক্টিভিটি — আপনার ইনফ্রাস্ট্রাকচার এবং লেনদেনের পূর্ণ লগ।</p>
        </div>
        <button onClick={fetchLogs} className="btn btn-ghost border border-[var(--border)] px-6">
           <span className="icon">refresh</span>
           Refresh Logs
        </button>
      </div>

      {/* Activity Visual Overview */}
      <div className="card p-10 border border-[var(--border)] bg-[var(--surface-2)] mb-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top,var(--primary-transparent),transparent)] opacity-20 -z-10" />
         <div className="w-full md:w-3/5">
            <h2 className="text-2xl font-black mb-4">Platform Audit Trail</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
               Monitor every action and financial event across your infrastructure. Our high-fidelity ledger provides a permanent, searchable record of deployment protocols, billing events, and user-initiated changes.
            </p>
            <div className="flex gap-4">
               {['Immutable Logs', 'Searchable History', 'Export Ready'].map(l => (
                 <div key={l} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                    <span className="text-[0.65rem] font-black uppercase tracking-widest">{l}</span>
                 </div>
               ))}
            </div>
         </div>
         <div className="w-full md:w-2/5 flex justify-center">
            <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
               <rect x="30" y="30" width="100" height="100" rx="12" stroke="var(--primary)" strokeWidth="2" />
               <line x1="50" y1="60" x2="110" y2="60" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
               <line x1="50" y1="80" x2="110" y2="80" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
               <line x1="50" y1="100" x2="110" y2="100" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
               <circle cx="130" cy="50" r="15" fill="var(--primary-transparent)" stroke="var(--primary)" strokeWidth="1" className="animate-pulse" />
               <path d="M130 45V55M125 50H135" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
            </svg>
         </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
           <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
           <p className="font-bold tracking-widest text-xs uppercase">Retrieving Audit Trail...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="card p-20 text-center border-2 border-dashed border-[var(--border)] bg-transparent">
           <div className="w-20 h-20 rounded-[2rem] bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-8">
              <span className="icon text-4xl text-[var(--text-muted)]">history_edu</span>
           </div>
           <h3 className="text-xl font-black mb-3">No Activity Recorded</h3>
           <p className="text-[var(--text-muted)] max-w-sm mx-auto mb-8">All your future infrastructure actions and financial events will be recorded here for audit purposes.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
           <div className="divide-y divide-[var(--border)]">
              {logs.map(log => (
                <div key={log.id} className="p-6 hover:bg-[var(--surface-2)] transition-colors flex items-center gap-6">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                     log.type === 'DEPOSIT' ? 'bg-green-500/10 text-green-500' : 
                     log.type === 'SPEND' ? 'bg-blue-500/10 text-blue-500' : 
                     'bg-[var(--primary-transparent)] text-[var(--primary)]'
                   }`}>
                      <span className="icon text-lg">
                        {log.type === 'DEPOSIT' ? 'add_card' : log.type === 'SPEND' ? 'shopping_cart' : 'history_edu'}
                      </span>
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                         <span className="font-black text-sm uppercase tracking-wider">{log.type}</span>
                         {(log as any).user_email && (
                            <span className="px-2 py-0.5 rounded bg-[var(--primary-transparent)] text-[var(--primary)] text-[0.6rem] font-bold">
                              {(log as any).user_email}
                            </span>
                         )}
                         <span className="text-[0.65rem] font-bold text-[var(--text-muted)]">{new Date(log.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-[var(--text-muted)] truncate m-0">{log.message || `Transaction ${log.transaction_id || log.id}`}</p>
                   </div>
                   <div className="text-right">
                      <div className="font-mono text-sm font-black mb-1">
                         {log.type === 'DEPOSIT' ? '+' : '-'}{log.amount} BDT
                      </div>
                      <div className="text-[0.6rem] font-black text-green-500 uppercase tracking-widest">{log.status}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
