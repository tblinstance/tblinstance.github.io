import axios from 'axios';
import { useAppStore } from '../store/AppStore';
import type { AppState } from '../store/types';

const API_BASE = import.meta.env.VITE_API_BASE;

export function GlobalModals() {
  const { 
    modalConfig, setModalConfig, 
    promptConfig, setPromptConfig, 
    notifyOpen, setNotifyOpen,
    notifications, token, fetchData,
    isStaff, setActiveTab, setChatOpen, setUnreadChatCount,
    users, setAdminChatTargetId
  } = useAppStore() as AppState;

  return (
    <>
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-5 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="card w-full max-w-md p-8 shadow-2xl animate-scale-in">
            <h3 className={`text-2xl font-black m-0 mb-4 flex items-center gap-3 tracking-tight ${modalConfig.isDanger ? 'text-[var(--danger)]' : (modalConfig.type === 'alert' ? 'text-[var(--danger)]' : 'text-[var(--warning)]')}`}>
              <span className="icon text-3xl">{modalConfig.type === 'alert' ? 'error' : 'warning'}</span>
              {modalConfig.title}
            </h3>
            <div className="text-[var(--text-sub)] font-medium leading-relaxed mb-8">{modalConfig.message}</div>
            <div className="flex gap-3 justify-end">
              {modalConfig.type === 'confirm' && (
                <button 
                  onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} 
                  className="btn btn-secondary border border-[var(--border)]"
                >
                  Cancel
                </button>
              )}
              <button 
                onClick={() => {
                  modalConfig.onConfirm?.();
                  setModalConfig({ ...modalConfig, isOpen: false });
                }} 
                className={`btn ${modalConfig.isDanger ? 'bg-[var(--danger)] text-[var(--text-on-danger)] border-none hover:bg-red-700' : 'btn-primary'}`}
              >
                {modalConfig.type === 'alert' ? 'OK' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {promptConfig?.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-5 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="card w-full max-w-md p-8 shadow-2xl animate-scale-in">
            <h3 className="text-2xl font-black m-0 mb-4 tracking-tight flex items-center gap-3 text-[var(--text-main)]">
              <span className="icon text-[var(--primary)] text-3xl">edit_note</span>
              {promptConfig.title}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const val = (e.target as any).promptval.value;
              if (promptConfig.onConfirm) promptConfig.onConfirm(val);
              setPromptConfig({ ...promptConfig, isOpen: false });
            }}>
              <input 
                name="promptval" 
                autoFocus 
                required 
                placeholder="Enter value..."
                className="input py-4 text-lg w-full mb-8" 
              />
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setPromptConfig({ ...promptConfig, isOpen: false })} 
                  className="btn btn-secondary border border-[var(--border)]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary shadow-lg shadow-[var(--primary-transparent)]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {notifyOpen && (
        <div className="fixed inset-0 z-[9998] flex justify-end">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300" 
            onClick={() => setNotifyOpen(false)} 
          />
          <div className="relative w-full max-w-md bg-[var(--surface)] shadow-[-10px_0_40px_rgba(0,0,0,0.2)] h-full flex flex-col border-l border-[var(--border)] animate-slide-left">
            <div className="p-8 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface-2)]">
              <h2 className="text-2xl font-black m-0 flex items-center gap-3 tracking-tight text-[var(--text-main)]">
                <span className="icon text-[var(--primary)] text-3xl">notifications_active</span>
                Notifications
              </h2>
              <button onClick={() => setNotifyOpen(false)} className="icon text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors text-2xl">close</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] opacity-50 space-y-4">
                  <span className="icon text-6xl">notifications_off</span>
                  <p className="font-bold italic">All quiet here.</p>
                </div>
              ) : notifications.map((n: any) => (
                <div 
                  key={n.id} 
                  onClick={() => {
                    if (n.type === 'chat') {
                      setNotifyOpen(false);
                      if (isStaff) {
                        setActiveTab('support_center');
                        // Parse email from message "email: msg..."
                        const match = n.message.match(/^([^:]+):/);
                        if (match) {
                          const userEmail = match[1];
                          const user = users.find((u: any) => u.email === userEmail);
                          if (user) {
                            setAdminChatTargetId(user.id);
                          } else {
                            setAdminChatTargetId(-1);
                          }
                        } else {
                          setAdminChatTargetId(-1);
                        }
                      } else {
                        setChatOpen(true);
                        setUnreadChatCount(0);
                      }
                    }
                  }}
                  className={`p-6 rounded-[1.5rem] border transition-all duration-300 relative group overflow-hidden ${n.type === 'chat' ? 'cursor-pointer hover:scale-[1.02]' : ''} ${n.is_read ? 'bg-[var(--surface)] border-[var(--border)] opacity-80' : n.type === 'chat' ? 'bg-[var(--primary-transparent)] border-[var(--primary-transparent-border)] shadow-lg shadow-[var(--primary-transparent)]' : 'bg-[var(--primary-transparent)] border-[var(--primary-transparent-border)] shadow-sm'}`}
                >
                  {!n.is_read && (
                    <div className={`absolute top-0 right-0 w-1.5 h-full ${n.type === 'chat' ? 'bg-[var(--success)] animate-bounce' : 'bg-[var(--primary)] animate-pulse'}`} />
                  )}
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      n.type === 'chat' ? 'bg-[var(--success)]/20 text-[var(--success)]' :
                      n.type === 'success' ? 'bg-[var(--success)]/20 text-[var(--success)]' :
                      n.type === 'error' ? 'bg-[var(--danger)]/20 text-[var(--danger)]' :
                      n.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-[var(--primary-transparent)] text-[var(--primary)]'
                    }`}>
                      <span className="icon text-xl">
                        {n.type === 'chat' ? 'chat_bubble' :
                         n.type === 'success' ? 'check_circle' :
                         n.type === 'error' ? 'error' :
                         n.type === 'warning' ? 'warning' : 'info'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className={`font-black tracking-tight text-sm ${
                          n.type === 'chat' ? 'text-[var(--success)]' :
                          n.type === 'success' ? 'text-[var(--success)]' :
                          n.type === 'error' ? 'text-[var(--danger)]' :
                          n.type === 'warning' ? 'text-yellow-400' : 'text-[var(--primary)]'
                        }`}>{n.title}</div>
                        <div className="text-[0.6rem] font-bold text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg)] px-2 py-0.5 rounded border border-[var(--border)] shrink-0">
                          {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="text-[var(--text-sub)] text-sm font-medium leading-relaxed mt-1">{n.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 border-t border-[var(--border)] bg-[var(--surface-2)]">
              <button 
                onClick={async () => {
                  if (!token) return;
                  try {
                    await axios.post(`${API_BASE}/notifications/mark-read/`, {}, { headers: { Authorization: `Bearer ${token}` } });
                    fetchData();
                  } catch (err) { console.error('Failed to mark as read'); }
                }} 
                className="btn btn-secondary w-full py-4 font-black tracking-wider text-xs uppercase hover:bg-[var(--primary-transparent)] hover:text-[var(--primary)] hover:border-[var(--primary-transparent-border)]"
              >
                <span className="icon text-sm">done_all</span>
                Mark all as read
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
