import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Message {
  id: number;
  sender_email: string;
  sender_id: number;
  message: string;
  created_at: string;
}

interface Props {
  token: string | null;
  targetUserId?: number; // Only for admin
  onClose?: () => void;
  currentUserEmail?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE;

export function SupportChat({ token, targetUserId, onClose, currentUserEmail }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const url = targetUserId 
        ? `${API_BASE}/chat/list/?user_id=${targetUserId}`
        : `${API_BASE}/chat/list/`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
      // Mark as read
      try {
        await axios.post(`${API_BASE}/chat/read/`, { user_id: targetUserId }, { headers: { Authorization: `Bearer ${token}` } });
      } catch {}
    } catch (e) {
      console.error("Chat fetch failed", e);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // 2s for "critical live" feel
    return () => clearInterval(interval);
  }, [targetUserId, token]);

  useEffect(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      const isOthers = last.sender_email !== currentUserEmail;
      if (isOthers) {
        // Play subtle notification sound
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
          audio.volume = 0.4;
          audio.play().catch(() => {}); // Browser might block auto-play
        } catch {}
        
        // Browser notification if possible
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("New Support Message", { body: last.message });
        }
      }
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/chat/send/`, 
        { user_id: targetUserId, message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInput('');
      fetchMessages();
    } catch (e) {
      console.error("Send failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-[var(--surface-2)] border-b border-[var(--border)] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center">
            <span className="icon">support_agent</span>
          </div>
          <div>
            <div className="text-sm font-black text-[var(--text-main)]">Support Chat</div>
            <div className="text-[0.6rem] font-bold text-[var(--success)] uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[var(--success)] rounded-full animate-pulse" />
              Live Now
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="icon text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors">close</button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <span className="icon text-5xl mb-2">forum</span>
            <p className="text-sm font-medium">Start a conversation with our support team.</p>
          </div>
        )}
        {messages.map((m) => {
          const isMe = m.sender_email === currentUserEmail;
          return (
            <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${
                isMe 
                  ? 'bg-[var(--primary)] text-[var(--text-on-primary)] rounded-tr-none' 
                  : 'bg-[var(--surface-2)] text-[var(--text-main)] rounded-tl-none border border-[var(--border)]'
              }`}>
                <div className="mb-1 text-[0.6rem] font-black opacity-50 uppercase tracking-tighter">
                  {isMe ? 'You' : m.sender_email.split('@')[0]}
                </div>
                <div className="leading-relaxed font-medium">{m.message}</div>
                <div className="mt-2 text-[0.6rem] opacity-40 text-right">
                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-[var(--surface-2)] border-t border-[var(--border)] flex gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="input flex-1 bg-[var(--surface)]"
        />
        <button 
          disabled={!input.trim() || loading}
          className="btn btn-primary w-12 h-12 p-0 flex items-center justify-center rounded-xl shadow-lg shadow-[var(--primary-transparent)] disabled:opacity-50"
        >
          <span className="icon">send</span>
        </button>
      </form>
    </div>
  );
}
