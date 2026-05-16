import React from 'react';
import axios from 'axios';

interface Props {
  users: any[];
  manualRequests: any[];
  token: string | null;
  fetchData: () => void;
  showAlert: (title: string, msg: string) => void;
  showConfirm: (title: string, msg: string, cb: () => void, isDanger?: boolean) => void;
  showPromptUI: (title: string, cb: (val: string) => void) => void;
}

const API_BASE = import.meta.env.VITE_API_BASE;

export function UsersPage({ users, manualRequests, token, fetchData, showAlert, showConfirm, showPromptUI }: Props) {
  const headers = { Authorization: `Bearer ${token}` };
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState('email');
  const [selectedUsers, setSelectedUsers] = React.useState<number[]>([]);

  const updateMarkup = async (userId: number, markup: string) => {
    try {
      await axios.post(`${API_BASE}/admin/update-markup/`, { user_id: userId, markup }, { headers });
      fetchData();
    } catch { showAlert('Error', 'Failed to update markup.'); }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.phone_number && u.phone_number.includes(searchTerm))
  ).sort((a, b) => {
    if (sortBy === 'balance') return b.balance - a.balance;
    if (sortBy === 'date') return new Date(b.date_joined).getTime() - new Date(a.date_joined).getTime();
    return a.email.localeCompare(b.email);
  });

  const totalBalance = users.reduce((acc, u) => acc + parseFloat(u.balance), 0);

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) setSelectedUsers([]);
    else setSelectedUsers(filteredUsers.map(u => u.id));
  };

  const toggleSelectOne = (id: number) => {
    if (selectedUsers.includes(id)) setSelectedUsers(selectedUsers.filter(sid => sid !== id));
    else setSelectedUsers([...selectedUsers, id]);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;
    
    if (action === 'credit') {
      showPromptUI(`Add balance to ${selectedUsers.length} users (BDT)`, async (amt) => {
        if (!amt || isNaN(parseFloat(amt))) return showAlert('Error', 'Invalid amount');
        try {
          await Promise.all(selectedUsers.map(id => 
            axios.post(`${API_BASE}/admin/add-balance/`, { user_id: id, amount: parseFloat(amt) }, { headers })
          ));
          showAlert('Success', `Credits added to ${selectedUsers.length} users.`);
          fetchData();
        } catch { showAlert('Error', 'Bulk credit failed.'); }
      });
    } else if (action === 'ban' || action === 'unban') {
      showConfirm(
        `${action.toUpperCase()} ${selectedUsers.length} users?`, 
        `This will ${action} access for all selected accounts immediately.`,
        async () => {
          try {
            await Promise.all(selectedUsers.map(id => 
              axios.post(`${API_BASE}/admin/toggle-active/`, { user_id: id, action }, { headers })
            ));
            showAlert('Success', `Status updated for ${selectedUsers.length} users.`);
            fetchData();
          } catch { showAlert('Error', 'Bulk status update failed.'); }
        },
        action === 'ban'
      );
    } else if (action === 'sms') {
      showPromptUI(`Send SMS to ${selectedUsers.length} users`, async (msg) => {
        if (!msg) return;
        try {
          await Promise.all(selectedUsers.map(id => {
            const u = users.find(user => user.id === id);
            return axios.post(`${API_BASE}/admin/send-sms/`, { user_id: id, phone: u?.phone_number, message: msg }, { headers });
          }));
          showAlert('Success', `SMS sent to ${selectedUsers.length} users.`);
        } catch { showAlert('Error', 'Bulk SMS failed.'); }
      });
    }
    setSelectedUsers([]);
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-20">
      {/* Premium Analytic Header */}
      <div className="relative overflow-hidden p-10 md:p-14 rounded-[3rem] mb-12 bg-[#0b1121] border border-blue-500/20 group shadow-[0_0_50px_rgba(59,130,246,0.15)]">
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
                    <span key={Math.random()} className="text-[0.5rem] font-mono text-blue-400">
                      {Math.random().toString(16).substring(2, 8).toUpperCase()}
                    </span>
                  ))}
                </div>
              ))}
           </div>
        </div>

        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-[2rem] bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-all duration-700">
              <span className="icon text-5xl">manage_accounts</span>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black m-0 tracking-tighter text-[var(--text-main)]">
                User Directory
              </h2>
              <p className="text-[var(--text-sub)] font-medium mt-3 max-w-xl text-lg leading-relaxed">
                Platform-wide entity oversight and governance. Manage access protocols and verify clearance levels for all registered users.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="p-8 bg-[var(--surface-2)] rounded-[2rem] border border-[var(--border)] flex-1 min-w-[200px]">
              <div className="text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-2">Total Directory</div>
              <div className="text-4xl font-black text-[var(--text-main)] tracking-tighter">{users.length}</div>
            </div>
            <div className="px-8 py-5 rounded-[2rem] bg-indigo-500/[0.05] border border-indigo-500/10 backdrop-blur-xl hover:border-indigo-500/30 transition-all">
              <div className="text-[0.7rem] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Liability Balance</div>
              <div className="text-4xl font-black text-indigo-400 tracking-tighter">
                {totalBalance.toFixed(2)} <span className="text-sm text-indigo-400/30 font-bold uppercase tracking-widest ml-1">BDT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative group">
          <span className="icon absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors">search</span>
          <input 
            type="text" 
            placeholder="Search by email or phone..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input pl-12 py-4 bg-[var(--surface)] border-[var(--border)] focus:border-[var(--primary)] w-full font-medium"
          />
        </div>
        <div className="flex gap-2 bg-[var(--surface-2)] p-1.5 rounded-2xl border border-[var(--border)]">
          {[
            { id: 'email', label: 'A-Z', icon: 'sort_by_alpha' },
            { id: 'balance', label: 'Rich', icon: 'payments' },
            { id: 'date', label: 'Newest', icon: 'calendar_today' },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${sortBy === s.id ? 'bg-[var(--primary)] text-[var(--text-on-primary)] shadow-lg' : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)]'}`}
            >
              <span className="icon text-sm">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <div className="sticky top-20 z-50 mb-6 bg-[var(--primary)] text-[var(--text-on-primary)] p-4 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-4 animate-scale-in">
          <div className="flex items-center gap-4">
            <span className="font-black text-sm uppercase tracking-widest">{selectedUsers.length} Users Selected</span>
            <button onClick={() => setSelectedUsers([])} className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg">Clear</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleBulkAction('credit')} className="btn btn-sm bg-white text-[var(--primary)] border-none font-black flex items-center gap-2">
              <span className="icon text-sm">add_circle</span> Add Credit
            </button>
            <button onClick={() => handleBulkAction('sms')} className="btn btn-sm bg-white/20 text-[var(--text-on-primary)] border-none font-bold flex items-center gap-2">
              <span className="icon">sms</span> SMS Notification
            </button>
            <button onClick={() => handleBulkAction('ban')} className="btn btn-sm bg-red-600 text-white border-none font-bold flex items-center gap-2">
              <span className="icon">block</span> Restrict Access
            </button>
            <button onClick={() => handleBulkAction('unban')} className="btn btn-sm bg-green-600 text-white border-none font-bold flex items-center gap-2">
              <span className="icon">check_circle</span> Restore Access
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="card overflow-hidden mb-12 shadow-xl border border-[var(--border)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--surface-2)] border-b border-[var(--border)]">
                <th className="px-8 py-5 text-left">
                  <input 
                    type="checkbox" 
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} 
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                </th>
                {['User Details', 'Contact', 'Wallet Balance', 'Profit Markup', 'Joined', 'Role', 'Admin Actions'].map(h => (
                  <th key={h} className="px-8 py-5 text-left text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredUsers.map((u: any) => (
                <tr key={u.id} className={`hover:bg-[var(--primary-transparent)]/30 transition-colors group ${selectedUsers.includes(u.id) ? 'bg-[var(--primary-transparent)]/20' : ''}`}>
                  <td className="px-8 py-6">
                    <input 
                      type="checkbox" 
                      checked={selectedUsers.includes(u.id)} 
                      onChange={() => toggleSelectOne(u.id)}
                      className="w-5 h-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-[var(--text-main)] mb-0.5">{u.email}</div>
                    <div className="text-[0.65rem] font-mono text-[var(--text-muted)] opacity-50 uppercase tracking-tighter">ID: {u.id}</div>
                  </td>
                  <td className="px-8 py-6 font-mono text-sm text-[var(--text-sub)]">
                    {u.phone_number || <span className="opacity-30 italic">Not set</span>}
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-black text-[var(--primary)] text-xl tracking-tight leading-none mb-1">{u.balance}</div>
                    <div className="text-[0.6rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">BDT Credits</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-2 rounded-xl font-black border ${u.markup_amount > 0 ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-muted)]'}`}>
                        ${u.markup_amount}
                      </div>
                      <button 
                        onClick={() => {
                          const val = prompt('Set USD markup for this customer (e.g. 0 for free, 2.0 for standard):', u.markup_amount);
                          if (val !== null) updateMarkup(u.id, val);
                        }}
                        className="w-8 h-8 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-[var(--text-on-primary)] transition-all"
                      >
                        <span className="icon text-sm">edit</span>
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-[var(--text-muted)]">
                    {new Date(u.date_joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`badge ${u.is_staff ? 'badge-primary' : 'badge-muted'} font-bold`}>
                      {u.is_staff ? 'Staff' : 'User'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => showPromptUI(`Add credits to ${u.email} (BDT):`, async (amt) => {
                          if (!amt || isNaN(parseFloat(amt))) return;
                          try {
                            await axios.post(`${API_BASE}/admin/add-balance/`, { user_id: u.id, amount: parseFloat(amt) }, { headers });
                            showAlert('Success', 'Credits added successfully.');
                            fetchData();
                          } catch { showAlert('Error', 'Failed to add credits.'); }
                        })} 
                        className="btn btn-primary btn-sm px-3"
                        title="Add Credit"
                      >
                        <span className="icon">add</span>
                      </button>

                      <button 
                        onClick={() => showPromptUI(`Deduct balance from ${u.email} (BDT):`, async (amt) => {
                          if (!amt || isNaN(parseFloat(amt))) return;
                          try {
                            await axios.post(`${API_BASE}/admin/adjust-billing/`, { user_id: u.id, amount: -parseFloat(amt), reason: 'Manual deduction' }, { headers });
                            showAlert('Success', 'Balance deducted successfully.');
                            fetchData();
                          } catch { showAlert('Error', 'Failed to deduct balance.'); }
                        })} 
                        className="btn btn-danger btn-sm px-3"
                        title="Deduct Credit"
                      >
                        <span className="icon">remove</span>
                      </button>

                      <button 
                        onClick={() => showPromptUI(`Send SMS to ${u.phone_number || u.email}:`, async (msg) => {
                          if (!msg) return;
                          try {
                            await axios.post(`${API_BASE}/admin/send-sms/`, { user_id: u.id, phone: u.phone_number, message: msg }, { headers });
                            showAlert('✅ SMS Sent', `Message sent to ${u.phone_number || 'user'}.`);
                          } catch { showAlert('Error', 'Failed to send SMS.'); }
                        })} 
                        className="btn btn-secondary btn-sm px-3 border-[var(--border)]"
                        title="Send SMS Notify"
                      >
                        <span className="icon">sms</span>
                      </button>
                      <button 
                        onClick={async () => {
                          try {
                            const res = await axios.get(`${API_BASE}/admin/users/${u.id}/servers/`, { headers });
                            const serverList = res.data.map((s: any) => `• ${s.name} (${s.ip_address || 'No IP'})`).join('\n');
                            showAlert(`Servers for ${u.email}`, serverList || 'User has no active servers.');
                          } catch { showAlert('Error', 'Failed to fetch servers.'); }
                        }} 
                        className="btn btn-secondary btn-sm px-3 border-[var(--border)]"
                        title="View Servers"
                      >
                        <span className="icon">dns</span>
                      </button>

                      <button 
                        onClick={async () => {
                          const action = u.is_staff ? 'remove-admin' : 'make-admin';
                          const confirmMsg = u.is_staff ? `Are you sure you want to remove admin privileges from ${u.email}?` : `Are you sure you want to make ${u.email} an administrator?`;
                          if (window.confirm(confirmMsg)) {
                            try {
                              await axios.post(`${API_BASE}/admin/toggle-staff/`, { user_id: u.id, action }, { headers });
                              showAlert('Success', `User role updated successfully.`);
                              fetchData();
                            } catch { showAlert('Error', 'Failed to update user role.'); }
                          }
                        }} 
                        className={`btn btn-sm px-3 ${u.is_staff ? 'bg-orange-500 hover:bg-orange-600' : 'bg-purple-500 hover:bg-purple-600'} text-white border-none`}
                        title={u.is_staff ? "Remove Admin Role" : "Make Administrator"}
                      >
                        <span className="icon">{u.is_staff ? 'person_off' : 'admin_panel_settings'}</span>
                      </button>
                      <button 
                        onClick={async () => {
                          const action = u.is_active ? 'ban' : 'unban';
                          const confirmMsg = u.is_active ? `Are you sure you want to BAN ${u.email}? This will prevent them from logging in.` : `Are you sure you want to UNBAN ${u.email}?`;
                          if (window.confirm(confirmMsg)) {
                            try {
                              await axios.post(`${API_BASE}/admin/toggle-active/`, { user_id: u.id, action }, { headers });
                              showAlert('Success', `User status updated.`);
                              fetchData();
                            } catch { showAlert('Error', 'Failed to update user status.'); }
                          }
                        }} 
                        className={`btn btn-sm px-3 ${u.is_active ? 'bg-zinc-800 hover:bg-black' : 'bg-green-600 hover:bg-green-700'} text-white border-none`}
                        title={u.is_active ? "Ban User" : "Unban User"}
                      >
                        <span className="icon">{u.is_active ? 'block' : 'check_circle'}</span>
                      </button>
                      <button 
                        onClick={() => {
                          showConfirm(
                            '⚠️ Permanent Deletion',
                            `Are you absolutely sure you want to PERMANENTLY DELETE ${u.email}? This will cancel all their Contabo servers and erase all their data. THIS IS IRREVERSIBLE.`,
                            async () => {
                              try {
                                await axios.post(`${API_BASE}/admin/delete-user/`, { user_id: u.id }, { headers });
                                showAlert('Deleted', 'User has been permanently removed.');
                                fetchData();
                              } catch { showAlert('Error', 'Failed to delete user.'); }
                            },
                            true
                          );
                        }} 
                        className="btn btn-danger btn-sm px-3 shadow-lg shadow-red-500/10"
                        title="Permanently Delete User"
                      >
                        <span className="icon text-sm">delete_forever</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Payments */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[var(--warning-transparent)] text-[var(--warning)] flex items-center justify-center border border-[var(--warning-transparent-border)]">
          <span className="icon">pending_actions</span>
        </div>
        <h3 className="text-2xl font-black m-0 tracking-tight text-[var(--text-main)]">Pending Manual Payments</h3>
      </div>

      {manualRequests.filter((r: any) => r.status === 'PENDING').length === 0 ? (
        <div className="card py-16 text-center bg-[var(--surface-2)]">
          <span className="icon text-5xl text-[var(--text-muted)] opacity-20 mb-4">check_circle</span>
          <p className="text-[var(--text-muted)] font-medium m-0">No pending payment requests at this time.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {manualRequests.filter((r: any) => r.status === 'PENDING').map((r: any) => (
            <div key={r.id} className="card p-6 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-[var(--primary-transparent-border)] transition-all">
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="w-14 h-14 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  👤
                </div>
                <div>
                  <div className="font-black text-xl text-[var(--text-main)] tracking-tight mb-1">{r.user_email || r.user}</div>
                  <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">Requested <b className="text-[var(--primary)] font-black">{r.amount} BDT</b> via <span className="bg-[var(--border)] px-2 py-0.5 rounded text-[var(--text-main)] text-xs font-bold">{r.method}</span></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                    <span className="flex items-center gap-1 font-mono text-[var(--text-main)] font-black">TrxID: {r.transaction_id || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={async () => {
                    try {
                      await axios.post(`${API_BASE}/admin/approve-manual/`, { request_id: r.id }, { headers });
                      showAlert('Success', 'Payment approved successfully.');
                      fetchData();
                    } catch { showAlert('Error', 'Failed to approve payment.'); }
                  }} 
                  className="flex-1 md:flex-none btn bg-[var(--success)] hover:bg-[#15803d] text-[var(--text-on-success)] border-none shadow-lg shadow-[rgba(22,163,74,0.2)]"
                >
                  <span className="icon">check</span> Approve
                </button>
                <button 
                  onClick={async () => {
                    try {
                      await axios.post(`${API_BASE}/admin/reject-manual/`, { request_id: r.id }, { headers });
                      showAlert('Success', 'Payment rejected.');
                      fetchData();
                    } catch { showAlert('Error', 'Failed to reject payment.'); }
                  }} 
                  className="flex-1 md:flex-none btn bg-[var(--danger)] hover:bg-[#be123c] text-[var(--text-on-danger)] border-none shadow-lg shadow-[rgba(225,29,72,0.2)]"
                >
                  <span className="icon">close</span> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
