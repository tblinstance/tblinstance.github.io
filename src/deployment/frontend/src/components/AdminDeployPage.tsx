
import React from 'react';
import axios from 'axios';

interface Props {
  token: string;
  users: any[];
  plans: any[];
  showAlert: (title: string, message: string) => void;
  fetchData: () => void;
}

export function AdminDeployPage({ token, users, plans, showAlert, fetchData }: Props) {
  const [selectedUser, setSelectedUser] = React.useState<string>('');
  const [selectedPlan, setSelectedPlan] = React.useState<any>(null);
  const [selectedRegion, setSelectedRegion] = React.useState('fra1');
  const [selectedImage, setSelectedImage] = React.useState('ubuntu-22.04');
  const [serverName, setServerName] = React.useState('');
  const [authProtocol, setAuthProtocol] = React.useState<'password' | 'ssh'>('password');
  const [rootPass, setRootPass] = React.useState('');
  const [selectedSSHKey, setSelectedSSHKey] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const REGION_MAP: Record<string, string> = {
    fra1: 'EU',
    lon1: 'EU',
    nyc1: 'US',
    sin1: 'AS',
  };

  const IMAGE_MAP: Record<string, string> = {
    'ubuntu-22.04': 'afecbb85-e2fc-46f0-9684-b46b1faf00bb',
    'ubuntu-20.04': 'afecbb85-e2fc-46f0-9684-b46b1faf00bb',
    'debian-11': 'afecbb85-e2fc-46f0-9684-b46b1faf00bb',
    'centos-7': 'afecbb85-e2fc-46f0-9684-b46b1faf00bb',
  };

  const handleDeploy = async () => {
    if (!selectedUser || !selectedPlan || !serverName) {
      return showAlert('Error', 'Missing critical deployment parameters.');
    }
    if (authProtocol === 'password' && !rootPass) {
      return showAlert('Error', 'Root password is required for password-based deployment.');
    }
    if (authProtocol === 'ssh' && !selectedSSHKey) {
      return showAlert('Error', 'Please select an SSH key for SSH-based deployment.');
    }

    const requestBody = {
      user_id: selectedUser,
      plan_id: selectedPlan.id,
      region: REGION_MAP[selectedRegion] || selectedRegion,
      image: IMAGE_MAP[selectedImage] || selectedImage,
      name: serverName,
      auth_protocol: authProtocol,
      root_pass: rootPass || undefined,
      ssh_key_id: selectedSSHKey || undefined,
    };

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/admin/deploy-for-user/`, requestBody, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showAlert('✅ Success', 'Direct Cloud Deployment initiated successfully.');
      fetchData();
    } catch (err: any) {
      showAlert('Error', err.response?.data?.error || 'Deployment protocol failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-32">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-16 h-16 rounded-[2rem] bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
          <span className="icon text-3xl">cloud_upload</span>
        </div>
        <div>
          <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tighter">Direct Cloud Deploy</h2>
          <p className="text-[var(--text-sub)] font-medium mt-1">Manually provision infrastructure for specific platform entities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           {/* Step 1: User Selection */}
           <div className="card p-10 bg-[var(--surface)] border border-[var(--border)] shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-black border border-blue-500/20">01</div>
                 <h3 className="text-xl font-black text-[var(--text-main)] uppercase tracking-tight">Select Target Entity</h3>
              </div>
              <div className="space-y-6">
                 <div className="relative">
                    <label className="block text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Target Platform Account</label>
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
              </div>
           </div>

           {/* Step 2: Resource Configuration */}
           <div className="card p-10 bg-[var(--surface)] border border-[var(--border)] shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-black border border-blue-500/20">02</div>
                 <h3 className="text-xl font-black text-[var(--text-main)] uppercase tracking-tight">Resource Configuration</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <label className="block text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Deployment Plan</label>
                    <select 
                      value={selectedPlan?.id || ''}
                      onChange={(e) => setSelectedPlan(plans.find(p => p.id === e.target.value))}
                      className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] font-bold outline-none focus:border-blue-500/50"
                    >
                       <option value="">Select a Plan</option>
                       {plans.map(p => <option key={p.id} value={p.id}>{p.name} ({p.vcpus} vCPU / {p.ram}GB RAM)</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Target Region</label>
                    <select 
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] font-bold outline-none focus:border-blue-500/50"
                    >
                       <option value="fra1">Frankfurt (DE)</option>
                       <option value="sin1">Singapore (SG)</option>
                       <option value="nyc1">New York (US)</option>
                       <option value="lon1">London (UK)</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">System Image</label>
                    <select 
                      value={selectedImage}
                      onChange={(e) => setSelectedImage(e.target.value)}
                      className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] font-bold outline-none focus:border-blue-500/50"
                    >
                       <option value="ubuntu-22.04">Ubuntu 22.04 LTS</option>
                       <option value="ubuntu-20.04">Ubuntu 20.04 LTS</option>
                       <option value="debian-11">Debian 11</option>
                       <option value="centos-7">CentOS 7</option>
                    </select>
                 </div>
              </div>
           </div>

           {/* Step 3: Identity & Access */}
           <div className="card p-10 bg-[var(--surface)] border border-[var(--border)] shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-black border border-blue-500/20">03</div>
                 <h3 className="text-xl font-black text-[var(--text-main)] uppercase tracking-tight">Identity & Access</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <label className="block text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Server Hostname</label>
                    <input 
                      type="text"
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                      placeholder="e.g. cloud-node-01"
                      className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] font-bold outline-none focus:border-blue-500/50"
                    />
                 </div>
                 <div>
                    <label className="block text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Authentication Protocol</label>
                    <select 
                      value={authProtocol}
                      onChange={(e) => setAuthProtocol(e.target.value as any)}
                      className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] font-bold outline-none focus:border-blue-500/50"
                    >
                       <option value="password">Root Password (Standard)</option>
                       <option value="ssh">SSH Key (Authorized Access)</option>
                    </select>
                 </div>
                 {authProtocol === 'password' ? (
                   <div>
                      <label className="block text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Root Access Key (Password)</label>
                      <input 
                        type="password"
                        value={rootPass}
                        onChange={(e) => setRootPass(e.target.value)}
                        placeholder="Secure Root Password"
                        className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] font-bold outline-none focus:border-blue-500/50"
                      />
                   </div>
                 ) : (
                   <div>
                      <label className="block text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Select Authorized SSH Key</label>
                      <select 
                        value={selectedSSHKey}
                        onChange={(e) => setSelectedSSHKey(e.target.value)}
                        className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] font-bold outline-none focus:border-blue-500/50"
                      >
                         <option value="">Select SSH Key...</option>
                         <option value="default">User Default Key</option>
                         <option value="admin">Global Admin Key</option>
                      </select>
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="card p-10 bg-[var(--surface)] border border-[var(--border)] shadow-2xl sticky top-8">
              <h3 className="text-xl font-black mb-8 text-[var(--text-main)] flex items-center gap-3">
                 <span className="icon text-blue-500">receipt_long</span>
                 Deploy Summary
              </h3>
              
              <div className="space-y-6 mb-10">
                 <div className="flex justify-between items-center">
                    <span className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest">Target User</span>
                    <span className="text-xs font-bold text-[var(--text-main)] truncate max-w-[150px]">
                       {users.find(u => String(u.id) === selectedUser)?.email || 'NOT SELECTED'}
                    </span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest">Selected Plan</span>
                    <span className="text-xs font-bold text-[var(--text-main)]">{selectedPlan?.name || 'N/A'}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest">Node Region</span>
                    <span className="text-xs font-bold text-[var(--text-main)] uppercase">{selectedRegion}</span>
                 </div>
                 <div className="pt-6 border-t border-[var(--border)] flex justify-between items-center">
                    <span className="text-sm font-black text-[var(--text-main)]">Operational Cost</span>
                    <span className="text-xl font-black text-blue-500">{selectedPlan?.price_bdt || 0} BDT</span>
                 </div>
              </div>

              <button 
                onClick={handleDeploy}
                disabled={loading || !selectedUser || !selectedPlan}
                className="w-full h-16 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] disabled:opacity-50 flex items-center justify-center gap-4"
              >
                 {loading ? <span className="icon animate-spin">sync</span> : (
                   <>
                      <span className="icon">bolt</span>
                      CONFIRM DEPLOY
                   </>
                 )}
              </button>
              
              <p className="mt-6 text-[0.6rem] font-medium text-[var(--text-sub)] text-center italic">
                 Deployment will bypass user balance checks and apply directly to the infrastructure mesh.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
