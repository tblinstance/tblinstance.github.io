import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppStore } from '../store/AppStore';
import { SupportChat } from './SupportChat';

const API_BASE = import.meta.env.VITE_API_BASE;

export function SupportDeskPage() {
  const store = useAppStore();
  const { token, isMobile, adminChatTargetId, setAdminChatTargetId } = store;
  const [activeChats, setActiveChats] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchChats = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/admin/chats/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveChats(res.data);
      const totalUnread = res.data.reduce((sum: number, c: any) => sum + (c.unread_count || 0), 0);
      store.setUnreadChatCount(totalUnread);
    } catch {}
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 3000);
    return () => clearInterval(interval);
  }, [token]);

  const filteredChats = activeChats.filter(c => 
    c.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showList = !isMobile || adminChatTargetId === null || adminChatTargetId === -1;
  const showChat = adminChatTargetId !== null && adminChatTargetId > 0;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-20">
      {/* Header / Intro */}
      <div className="relative overflow-hidden p-10 md:p-14 rounded-[3rem] mb-8 bg-[var(--surface)] border border-[var(--primary-transparent-border)] group shadow-[var(--card-shadow-hover)]">
        {/* Subtle Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)]/80 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center border border-[var(--primary-transparent-border)] shadow-[var(--glow-primary)]">
              <span className="icon text-3xl">support_agent</span>
            </div>
            <div>
              <h2 className="text-3xl font-black m-0 tracking-tight text-[var(--text-main)]">
                Enterprise Support Desk
              </h2>
              <p className="text-[var(--text-sub)] font-medium mt-2 max-w-xl">
                Real-time user communication channel. Intercept and resolve customer issues via secure nodes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="card bg-[var(--surface)] border border-[var(--border)] shadow-2xl flex overflow-hidden h-[600px] lg:h-[700px] rounded-[2rem] p-2">
        {/* Left Pane: Chat List */}
        {showList && (
          <div className={`flex flex-col h-full border-r border-[var(--border)] p-4 ${isMobile ? 'w-full' : 'w-[380px] shrink-0'}`}>
            <div className="relative mb-4">
              <span className="icon absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm pointer-events-none">search</span>
              <input 
                type="text" 
                placeholder="Search active chats..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 py-2.5 text-xs bg-[var(--bg)] border-[var(--border)]"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredChats.length === 0 ? (
                <div className="p-12 text-center text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest opacity-50 italic">
                  No active channels found.
                </div>
              ) : (
                filteredChats.map((c) => {
                  const isSelected = c.user_id === adminChatTargetId;
                  return (
                    <button
                      key={c.user_id}
                      onClick={() => setAdminChatTargetId(c.user_id)}
                      className={`w-full p-4 rounded-2xl transition-all flex items-center gap-4 border text-left cursor-pointer group ${
                        isSelected 
                          ? 'bg-[var(--primary-transparent)] border-[var(--primary-transparent-border)] shadow-sm'
                          : 'bg-[var(--surface)] border-transparent hover:bg-[var(--surface-2)]/50 hover:border-[var(--border)]'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        isSelected ? 'bg-[var(--primary)] text-[var(--text-on-primary)]' : 'bg-[var(--primary-transparent)] text-[var(--primary)]'
                      }`}>
                        {c.user_email[0].toUpperCase()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className="font-bold text-sm text-[var(--text-main)] truncate block pr-2">{c.user_email}</span>
                          {c.unread_count > 0 && (
                            <span className="bg-[var(--danger)] text-[var(--text-on-danger)] text-[0.6rem] font-black px-2 py-0.5 rounded-full shrink-0">
                              {c.unread_count} NEW
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[var(--text-muted)] truncate block opacity-85">
                          {c.last_message || 'No messages yet'}
                        </span>
                      </div>
                      <span className="icon text-[var(--text-muted)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-xs">chevron_right</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Right Pane: Chat Window / Empty State */}
        {(!isMobile || showChat) && (
          <div className="flex-1 flex flex-col h-full bg-[var(--surface-2)]/10">
            {showChat ? (
              <div className="h-full w-full p-4">
                <SupportChat 
                  token={token} 
                  targetUserId={adminChatTargetId} 
                  onClose={() => setAdminChatTargetId(null)} 
                  currentUserEmail="Admin"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-3xl bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center mb-6 animate-pulse border border-[var(--primary-transparent-border)]">
                  <span className="icon text-4xl">support_agent</span>
                </div>
                <h3 className="text-xl font-black text-[var(--text-main)] mb-2">Live Support Node Console</h3>
                <p className="text-[var(--text-muted)] text-sm font-medium max-w-sm">
                  Select an active communication node from the directory list to intercept message packets and begin customer assistance.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
