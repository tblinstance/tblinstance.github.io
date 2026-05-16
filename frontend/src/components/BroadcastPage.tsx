
import React from 'react';
import axios from 'axios';

interface Props {
  token: string;
  showAlert: (title: string, message: string) => void;
}

export function BroadcastPage({ token, showAlert }: Props) {
  const [message, setMessage] = React.useState('');
  const [subject, setSubject] = React.useState('System Announcement');
  const [type, setType] = React.useState<'both' | 'email' | 'push'>('both');
  const [loading, setLoading] = React.useState(false);

  const handleBroadcast = async () => {
    if (!message) return showAlert('Error', 'Message content is required.');
    
    if (!window.confirm('Are you sure you want to broadcast this message to ALL registered users? This action cannot be undone.')) return;

    setLoading(true);
    try {
      // Assuming backend has an endpoint for global broadcast
      // If not, we'll implement it or use a placeholder
      await axios.post(`${import.meta.env.VITE_API_BASE}/admin/broadcast/`, {
        subject,
        message,
        type
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showAlert('✅ Success', 'Global broadcast transmission initiated successfully.');
      setMessage('');
    } catch (err: any) {
      showAlert('Error', err.response?.data?.error || 'Broadcast transmission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-16 h-16 rounded-[2rem] bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/10 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
          <span className="icon text-3xl">campaign</span>
        </div>
        <div>
          <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tighter">Global Broadcast</h2>
          <p className="text-[var(--text-sub)] font-medium mt-1">Deploy platform-wide notifications and urgent announcements.</p>
        </div>
      </div>

      <div className="card p-10 bg-[var(--surface)] border border-[var(--border)] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
           <span className="icon text-[10rem]">send</span>
        </div>
        
        <div className="space-y-8 relative z-10">
          <div>
            <label className="block text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Transmission Channel</label>
            <div className="grid grid-cols-3 gap-4">
              {(['both', 'email', 'push'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-4 rounded-2xl border transition-all font-bold text-sm uppercase tracking-widest ${
                    type === t 
                      ? 'bg-[var(--primary-transparent)] border-[var(--primary)] text-[var(--primary)] shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]' 
                      : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-muted)] hover:border-blue-500/30'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Announcement Subject</label>
            <input 
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-5 text-[var(--text-main)] font-bold focus:border-blue-500/50 outline-none transition-all"
              placeholder="e.g. Scheduled Maintenance Notice"
            />
          </div>

          <div>
            <label className="block text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Message Content (MD/HTML Supported)</label>
            <textarea 
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-5 text-[var(--text-main)] font-medium focus:border-blue-500/50 outline-none transition-all resize-none"
              placeholder="Write your global announcement here..."
            />
          </div>

          <button
            onClick={handleBroadcast}
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-orange-500 text-white font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-[0_10px_30px_rgba(249,115,22,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
          >
            {loading ? (
              <span className="icon animate-spin">sync</span>
            ) : (
              <>
                <span className="icon">rocket_launch</span>
                INITIATE BROADCAST
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-12 p-8 rounded-[2rem] bg-orange-500/5 border border-orange-500/10 flex items-start gap-6">
        <span className="icon text-orange-500 mt-1">info</span>
        <div className="text-sm font-medium text-[var(--text-sub)] leading-relaxed">
          <strong className="text-orange-500">Operational Warning:</strong> Broadcasting a message triggers massive delivery pipelines. Ensure the content is accurate and sanctioned. Emails will be dispatched using the configured SMTP gateway, and push notifications will hit all active sessions.
        </div>
      </div>
    </div>
  );
}
