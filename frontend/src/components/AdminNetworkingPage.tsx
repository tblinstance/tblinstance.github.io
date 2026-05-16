
import React from 'react';
import axios from 'axios';

interface Props {
  token: string;
  users: any[];
  showAlert: (title: string, message: string) => void;
}

export function AdminNetworkingPage({ token, users, showAlert }: Props) {
  const [selectedUser, setSelectedUser] = React.useState<string>('');
  const [region, setRegion] = React.useState('fra1');
  const [ipCount, setIpCount] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const handleCreate = async () => {
    if (!selectedUser) return showAlert('Error', 'Please select a target user.');
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/admin/provision-network/`, {
        user_id: selectedUser,
        region,
        count: ipCount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showAlert('✅ Success', 'Private Network Resources provisioned successfully.');
    } catch (err: any) {
      showAlert('Error', err.response?.data?.error || 'Network provisioning failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-16 h-16 rounded-[2rem] bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
          <span className="icon text-3xl">lan</span>
        </div>
        <div>
          <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tighter">Network Provisioning</h2>
          <p className="text-[var(--text-sub)] font-medium mt-1">Manual allocation of Private IPs and VPC clusters for platform users.</p>
        </div>
      </div>

      <div className="card p-10 bg-[var(--surface)] border border-[var(--border)] shadow-2xl space-y-8">
        <div className="relative">
          <label className="block text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Target Platform Account</label>
          <select 
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-5 text-[var(--text-main)] font-bold outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
          >
             <option value="">Select a User Account...</option>
             {users.map(u => (
               <option key={u.id} value={u.id}>{u.email} (UID: {u.id})</option>
             ))}
          </select>
          <div className="absolute right-5 bottom-5 pointer-events-none text-[var(--text-muted)]">
             <span className="icon">expand_more</span>
          </div>
        </div>

        {selectedUser && (
           <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <span className="icon">person</span>
                 </div>
                 <div>
                    <div className="text-xs font-black text-[var(--text-main)]">{users.find(u => String(u.id) === selectedUser)?.email}</div>
                    <div className="text-[0.6rem] font-bold text-[var(--text-muted)] uppercase">Validated Account Entity</div>
                 </div>
              </div>
              <span className="text-[0.6rem] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full">Active</span>
           </div>
        )}

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Region</label>
            <select 
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] font-bold outline-none"
            >
              <option value="fra1">Frankfurt (DE)</option>
              <option value="sin1">Singapore (SG)</option>
              <option value="nyc1">New York (US)</option>
            </select>
          </div>
          <div>
            <label className="block text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">IP Address Quota</label>
            <input 
              type="number"
              value={ipCount}
              onChange={(e) => setIpCount(parseInt(e.target.value))}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] font-bold outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={loading || !selectedUser}
          className="w-full h-16 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? <span className="icon animate-spin">sync</span> : 'PROVISION NETWORK RESOURCES'}
        </button>
      </div>
    </div>
  );
}
