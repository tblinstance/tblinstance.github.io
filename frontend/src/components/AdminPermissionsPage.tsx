
import React from 'react';
import axios from 'axios';

interface Props {
  token: string;
  users: any[];
  fetchData: () => void;
  showAlert: (title: string, msg: string) => void;
}

export function AdminPermissionsPage({ token, users, fetchData, showAlert }: Props) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const headers = { Authorization: `Bearer ${token}` };

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleStaff = async (userId: number, current: boolean) => {
    const action = current ? 'remove-admin' : 'make-admin';
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/admin/toggle-staff/`, { user_id: userId, action }, { headers });
      showAlert('✅ Role Updated', 'Administrative privileges successfully modified.');
      fetchData();
    } catch { showAlert('Error', 'Failed to update administrative role.'); }
  };

  const toggleActive = async (userId: number, current: boolean) => {
    const action = current ? 'ban' : 'unban';
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/admin/toggle-active/`, { user_id: userId, action }, { headers });
      showAlert('✅ Status Updated', 'Entity access status successfully modified.');
      fetchData();
    } catch { showAlert('Error', 'Failed to update access status.'); }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-32">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-16 h-16 rounded-[2rem] bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
          <span className="icon text-3xl">admin_panel_settings</span>
        </div>
        <div>
          <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tighter">Governance & Clearance</h2>
          <p className="text-[var(--text-sub)] font-medium mt-1">Manage administrative privileges and platform-wide security protocols.</p>
        </div>
      </div>

      <div className="mb-10 relative">
        <span className="icon absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xl">search</span>
        <input 
          type="text"
          placeholder="Search Entity for Clearance Management..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[2rem] p-6 pl-16 text-[var(--text-main)] font-bold outline-none focus:border-purple-500/50 shadow-2xl transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredUsers.map((u) => (
          <div key={u.id} className="card p-8 bg-[var(--surface)] border border-[var(--border)] shadow-xl hover:border-purple-500/30 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-purple-500 group-hover:scale-110 transition-transform">
               <span className="icon text-[8rem]">security</span>
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--surface-2)] flex items-center justify-center text-2xl border border-[var(--border)]">
                     {u.is_staff ? '🛡️' : '👤'}
                  </div>
                  <div>
                     <div className="text-lg font-black text-[var(--text-main)] mb-1">{u.email}</div>
                     <div className="flex items-center gap-4 text-[0.6rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                        <span>UID: {u.id}</span>
                        <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                        <span>Joined: {new Date(u.date_joined).toLocaleDateString()}</span>
                     </div>
                  </div>
               </div>

               <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                  <div className="flex-1 lg:flex-none p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between gap-6">
                     <div>
                        <div className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Platform Admin</div>
                        <div className={`text-xs font-black ${u.is_staff ? 'text-purple-500' : 'text-[var(--text-muted)]'}`}>
                           {u.is_staff ? 'AUTHORIZED' : 'RESTRICTED'}
                        </div>
                     </div>
                     <button 
                        onClick={() => toggleStaff(u.id, u.is_staff)}
                        className={`w-12 h-6 rounded-full relative transition-all ${u.is_staff ? 'bg-purple-500' : 'bg-gray-600'}`}
                     >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${u.is_staff ? 'right-1' : 'left-1'}`} />
                     </button>
                  </div>

                  <div className="flex-1 lg:flex-none p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between gap-6">
                     <div>
                        <div className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Account Access</div>
                        <div className={`text-xs font-black ${u.is_active ? 'text-green-500' : 'text-red-500'}`}>
                           {u.is_active ? 'ACTIVE' : 'SUSPENDED'}
                        </div>
                     </div>
                     <button 
                        onClick={() => toggleActive(u.id, u.is_active)}
                        className={`w-12 h-6 rounded-full relative transition-all ${u.is_active ? 'bg-green-500' : 'bg-red-500'}`}
                     >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${u.is_active ? 'right-1' : 'left-1'}`} />
                     </button>
                  </div>

                  <div className="flex-1 lg:flex-none p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between gap-6 min-w-[150px]">
                     <div>
                        <div className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">2FA Status</div>
                        <div className={`text-xs font-black ${u.two_factor_enabled ? 'text-blue-500' : 'text-orange-500'}`}>
                           {u.two_factor_enabled ? 'VERIFIED' : 'UNSECURED'}
                        </div>
                     </div>
                     <span className={`icon text-sm ${u.two_factor_enabled ? 'text-blue-500' : 'text-orange-500'}`}>
                        {u.two_factor_enabled ? 'verified_user' : 'warning'}
                     </span>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
