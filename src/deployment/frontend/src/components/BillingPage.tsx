import React from 'react';
import axios from 'axios';

interface Props {
  balance: number;
  balanceUsd: number;
  exchangeRate: number;
  depositAmount: string;
  setDepositAmount: (v: string) => void;
  token: string | null;
  email: string;
  profile_image: string | null;
  showAlert: (title: string, msg: string) => void;
  showConfirm: (title: string, msg: string, cb: () => void, isDanger?: boolean) => void;
  isStaff: boolean;
  onDeposit: (gateway: 'ssl' | 'paypal' | 'manual') => Promise<void>;
  onSyncRate?: () => Promise<void>;
}

const API_BASE = import.meta.env.VITE_API_BASE;

export function BillingPage({ balance, balanceUsd, exchangeRate, depositAmount, setDepositAmount, token, email, profile_image, showAlert, showConfirm, onDeposit, isStaff, onSyncRate }: Props) {
  const [txnId, setTxnId] = React.useState('');
  const [selectedMethod] = React.useState('bKash/Nagad/Rocket');
  const [screenshot, setScreenshot] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [logs, setLogs] = React.useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = React.useState(true);

  const fetchLogs = React.useCallback(async () => {
    setLoadingLogs(true);
    try {
      const endpoint = isStaff ? 'admin/all-transactions' : 'transactions';
      const res = await axios.get(`${API_BASE}/${endpoint}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch billing logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  }, [token, isStaff]);

  React.useEffect(() => {
    if (token) {
      fetchLogs();
    }
  }, [fetchLogs, token]);

  const handleManualSubmit = async () => {
    if (!depositAmount || !txnId) {
      showAlert('Error', 'Please enter both amount and Transaction ID.');
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('amount', depositAmount);
      formData.append('method', selectedMethod);
      formData.append('transaction_id', txnId);
      if (screenshot) {
        formData.append('screenshot', screenshot);
      }

      await axios.post(`${API_BASE}/manual/deposit/`, formData, { 
        headers: { 
          Authorization: `Bearer ${token}`
        } 
      });
      
      showAlert('Success', 'Manual deposit request submitted! Our team will verify and add the balance within 30 minutes.');
      setDepositAmount('');
      setTxnId('');
      setScreenshot(null);
    } catch (err: any) {
      showAlert('Error', err.response?.data?.error || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      {/* Header Banner - Theme Adaptive */}
      <div className="relative overflow-hidden p-10 md:p-14 rounded-[3rem] mb-12 bg-[var(--surface)] border border-[var(--primary-transparent-border)] group shadow-[var(--card-shadow-hover)]">
        {/* Matrix Analytic Background */}
        <div className="absolute inset-0 z-0">
           <img 
            src="/analytics_bg.webp" 
            className="w-full h-full object-cover opacity-[var(--matrix-opacity)] grayscale brightness-150 mix-blend-[var(--matrix-blend)] hover:scale-110 transition-transform duration-[20s] ease-linear" 
            alt="Matrix Background"
          />
           <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)]/80 to-transparent" />
           
           {/* Scrolling Data Streams */}
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
           
           {/* Scanning Line */}
           <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-20 animate-[scan_4s_infinite_linear]" />
           </div>
        </div>

        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden border-4 border-[var(--border)] shadow-2xl bg-[var(--surface-2)] relative group shrink-0">
              {profile_image ? (
                <img src={profile_image} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                  <span className="icon text-4xl">person</span>
                </div>
              )}
            </div>
            <div>
              <div className="text-[0.65rem] font-black text-[var(--primary)] uppercase tracking-[0.3em] mb-1">Financial Intelligence</div>
              <h2 className="text-3xl md:text-4xl font-black m-0 tracking-tighter text-[var(--text-main)]">
                {email}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`w-2 h-2 rounded-full ${token ? 'bg-[var(--success)] animate-pulse' : 'bg-[var(--danger)]'}`} />
                <span className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest">{token ? 'Verified Ledger Access' : 'Guest Session'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:items-end gap-2">
            <div className="text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Available Capital</div>
            <div className="text-6xl font-black text-[var(--text-main)] tracking-tighter flex items-baseline gap-3">
              {balance}
              <span className="text-2xl font-black text-[var(--primary)]">BDT</span>
            </div>
            <div className="text-2xl font-black text-[var(--text-muted)] tracking-tight opacity-40">
              ≈ ${balanceUsd} <small className="text-xs font-bold ml-1 uppercase">USD</small>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
               <div className="px-3 py-1.5 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] text-[0.6rem] font-black text-[var(--text-sub)] uppercase tracking-widest shadow-sm">
                 1 USD = {exchangeRate} BDT
               </div>
               {isStaff && onSyncRate && (
                 <button 
                   onClick={onSyncRate}
                   className="px-3 py-1.5 rounded-xl bg-[var(--primary-transparent)] border border-[var(--primary-transparent-border)] text-[0.6rem] font-black text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--text-on-primary)] transition-all uppercase tracking-widest cursor-pointer shadow-sm"
                 >
                   Sync Valuation
                 </button>
               )}
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="relative z-10 flex flex-wrap gap-4 mt-12 pt-8 border-t border-[var(--border)] opacity-80">
          {[
            { label: 'Wallet Balance', value: `${balance} BDT`, icon: 'account_balance_wallet', color: 'var(--primary)' },
            { label: 'Total History', value: logs.length, icon: 'analytics', color: 'var(--success)' },
            { label: 'SSL Encrypted', value: 'Secured', icon: 'verified', color: 'var(--warning)' },
          ].map((stat, i) => (
            <div key={i} className="px-6 py-4 bg-[var(--surface-2)] rounded-2xl border border-[var(--border)] flex items-center gap-4 group hover:bg-[var(--surface)] hover:border-[var(--primary-transparent-border)] transition-all cursor-default shadow-sm flex-1 min-w-[200px]">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center border transition-all" style={{ backgroundColor: `${stat.color}15`, color: stat.color, borderColor: `${stat.color}20` }}>
                <span className="icon text-2xl">{stat.icon}</span>
              </div>
              <div className="text-left">
                <div className="text-xl font-black text-[var(--text-main)] leading-none mb-1">{stat.value}</div>
                <div className="text-[0.55rem] font-black text-[var(--text-muted)] uppercase tracking-widest">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Deposit Card */}
        <div className="card p-10 flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[var(--success-transparent)] text-[var(--success)] flex items-center justify-center border border-[var(--success-transparent-border)]">
              <span className="icon text-2xl">account_balance_wallet</span>
            </div>
            <h3 className="text-2xl font-black m-0 tracking-tight">Add Funds</h3>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Amount to Deposit</label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-[var(--text-muted)] pointer-events-none group-focus-within:text-[var(--primary)] transition-colors">৳</span>
                <input 
                  type="number" 
                  value={depositAmount} 
                  onChange={e => setDepositAmount(e.target.value)} 
                  placeholder="0.00" 
                  className="input px-6 py-5 text-center text-xl font-bold tracking-tight shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => onDeposit('ssl')} className="btn btn-primary py-4 flex flex-col items-center gap-1 shadow-lg shadow-[rgba(14,165,233,0.2)]">
                <span className="text-base">SSLCommerz</span>
                <span className="text-[0.6rem] opacity-70 uppercase tracking-widest font-bold">Cards & Net Banking</span>
              </button>
              <button onClick={() => onDeposit('paypal')} className="btn btn-secondary py-4 flex flex-col items-center gap-1 border-[var(--border)] shadow-sm">
                <span className="text-base font-bold text-[#003087]">PayPal</span>
                <span className="text-[0.6rem] opacity-70 uppercase tracking-widest font-bold">International Cards</span>
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-[0.65rem] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Mobile Financial Services (MFS)</label>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => onDeposit('ssl')} className="p-3 bg-[#e2136e]/10 border border-[#e2136e]/20 rounded-xl hover:bg-[#e2136e]/20 transition-all group flex flex-col items-center gap-1">
                  <span className="text-[#e2136e] font-black text-xs">bKash</span>
                  <div className="w-1 h-1 rounded-full bg-[#e2136e] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button onClick={() => onDeposit('ssl')} className="p-3 bg-[#f7941d]/10 border border-[#f7941d]/20 rounded-xl hover:bg-[#f7941d]/20 transition-all group flex flex-col items-center gap-1">
                  <span className="text-[#f7941d] font-black text-xs">Nagad</span>
                  <div className="w-1 h-1 rounded-full bg-[#f7941d] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button onClick={() => onDeposit('ssl')} className="p-3 bg-[#8c3494]/10 border border-[#8c3494]/20 rounded-xl hover:bg-[#8c3494]/20 transition-all group flex flex-col items-center gap-1">
                  <span className="text-[#8c3494] font-black text-xs">Rocket</span>
                  <div className="w-1 h-1 rounded-full bg-[#8c3494] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>

            <div className="mt-8 p-6 bg-[var(--surface-2)] rounded-2xl border border-[var(--primary-transparent-border)]">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-black text-[var(--text-main)] uppercase tracking-widest">Manual Send Money</h4>
              </div>

              <div className="flex items-center justify-center gap-4 mb-8 bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)]">
                <span className="text-[#e2136e] font-black text-[0.6rem]">bKash</span>
                <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                <span className="text-[#f7941d] font-black text-[0.6rem]">Nagad</span>
                <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                <span className="text-[#8c3494] font-black text-[0.6rem]">Rocket</span>
              </div>

              <div className="space-y-4 mb-6 text-[0.7rem] font-medium text-[var(--text-sub)] leading-relaxed">
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-[var(--text-on-primary)] flex items-center justify-center text-[0.5rem]">1</span>
                  Send <b>{depositAmount || '0'} BDT</b> to: <span className="text-[var(--text-main)] font-black">01760042810</span> (Personal)
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-[var(--text-on-primary)] flex items-center justify-center text-[0.5rem]">2</span>
                  Use <span className="text-[var(--text-main)] font-black">"{email.split('@')[0]}"</span> as Reference.
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-[var(--text-on-primary)] flex items-center justify-center text-[0.5rem]">3</span>
                  Paste the <b>Transaction ID</b> and optionally upload a <b>Screenshot</b> below.
                </p>
              </div>

              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Enter Transaction ID (e.g. 8K2L9XM0)" 
                  value={txnId}
                  onChange={e => setTxnId(e.target.value.toUpperCase())}
                  className="input w-full text-center font-mono text-sm tracking-widest"
                />
                
                <div className="relative">
                  <input 
                    type="file" 
                    id="manual-screenshot"
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                  />
                  <label 
                    htmlFor="manual-screenshot"
                    className={`w-full py-3 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-3 cursor-pointer transition-all ${
                      screenshot ? 'bg-[var(--success-transparent)] border-[var(--success)] text-[var(--success)]' : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]'
                    }`}
                  >
                    <span className="icon">{screenshot ? 'check_circle' : 'add_photo_alternate'}</span>
                    <span className="text-xs font-black uppercase tracking-widest truncate max-w-[200px]">
                      {screenshot ? screenshot.name : 'Upload Screenshot (Optional)'}
                    </span>
                  </label>
                </div>

                <button 
                  disabled={isSubmitting}
                  onClick={handleManualSubmit}
                  className="w-full btn btn-primary py-3 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Verifying...' : 'Submit Request'}
                  <span className="icon icon-sm">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Activity Ledger */}
        <div className="card p-10 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center border border-[var(--primary-transparent-border)]">
                <span className="icon text-2xl">history_edu</span>
              </div>
              <h3 className="text-2xl font-black m-0 tracking-tight">Billing Activity</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={fetchLogs}
                disabled={loadingLogs}
                className="btn btn-ghost btn-sm px-2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                title="Refresh Logs"
              >
                <span className={`icon text-lg ${loadingLogs ? 'animate-spin' : ''}`}>refresh</span>
              </button>

              {!isStaff && logs.length > 0 && (
                <button 
                  onClick={() => showConfirm('Clear History', 'Are you sure you want to permanently clear your transaction history?', async () => {
                    try {
                      await axios.post(`${API_BASE}/transactions/clear/`, {}, { headers: { Authorization: `Bearer ${token}` } });
                      setLogs([]);
                      showAlert('Success', 'Transaction history cleared.');
                    } catch { showAlert('Error', 'Failed to clear transactions.'); }
                  })} 
                  className="btn btn-ghost btn-sm text-[var(--danger)] hover:bg-[var(--danger-transparent)] px-4"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[350px]">
            {loadingLogs ? (
              <div className="h-full flex flex-col items-center justify-center py-12 opacity-50">
                 <div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-3" />
                 <p className="font-bold tracking-widest text-[0.6rem] uppercase">Retrieving Ledger...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] gap-4 py-12">
                <span className="icon text-5xl opacity-20">receipt_long</span>
                <p className="italic font-medium">No recent billing activity found.</p>
              </div>
            ) : (
              <div className="grid gap-1.5">
                {logs.map((log: any, i: number) => {
                  const isDeduction = log.type === 'PURCHASE' || log.type === 'SPEND';
                  return (
                    <div key={i} className="flex justify-between items-center p-4 rounded-2xl hover:bg-[var(--surface-2)] transition-colors border border-transparent hover:border-[var(--border)] shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          log.type === 'DEPOSIT' ? 'bg-green-500/10 text-green-500' : 
                          isDeduction ? 'bg-blue-500/10 text-blue-500' : 
                          'bg-[var(--primary-transparent)] text-[var(--primary)]'
                        }`}>
                          <span className="icon text-sm">
                            {log.type === 'DEPOSIT' ? 'add_card' : isDeduction ? 'shopping_cart' : 'history_edu'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                            <span className="font-bold text-xs text-[var(--text-main)] uppercase tracking-wide">{log.type}</span>
                            {log.user_email && (
                              <span className="px-1.5 py-0.5 rounded bg-[var(--primary-transparent)] text-[var(--primary)] text-[0.55rem] font-bold truncate max-w-[120px]" title={log.user_email}>
                                {log.user_email}
                              </span>
                            )}
                          </div>
                          <div className="text-[0.65rem] text-[var(--text-muted)] font-medium truncate max-w-[200px]" title={log.message || `Transaction ${log.transaction_id || log.id}`}>
                            {log.message || `Transaction ${log.transaction_id || log.id}`}
                          </div>
                          <div className="text-[0.6rem] text-[var(--text-muted)] font-bold">{new Date(log.created_at || Date.now()).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className={`px-3 py-1.5 rounded-lg font-black text-sm tracking-tight ${isDeduction ? 'bg-[var(--danger-transparent)] text-[var(--danger)]' : 'bg-[var(--success-transparent)] text-[var(--success)]'}`}>
                          {isDeduction ? '-' : '+'}{log.amount} <span className="text-[0.6rem] font-bold ml-0.5">BDT</span>
                        </div>
                        <div className="text-[0.55rem] font-bold text-[var(--text-muted)] uppercase tracking-tighter px-1">
                          ≈ ${parseFloat((log.amount / exchangeRate).toFixed(2))} USD
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Currency Calculator */}
        <div className="card p-10 flex flex-col lg:col-span-2 bg-[var(--surface)] border-t-4 border-[var(--info)] items-center text-center">
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--info-transparent)] text-[var(--info)] flex items-center justify-center border border-[var(--info-transparent-border)] shadow-inner">
              <span className="icon text-3xl">calculate</span>
            </div>
            <div>
              <h3 className="text-3xl font-black m-0 tracking-tight">Live Currency Calculator</h3>
              <div className="flex items-center justify-center gap-4 mt-2">
                <p className="text-base text-[var(--text-muted)] font-medium max-w-md">Estimate your cloud costs using the current global rate.</p>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[var(--primary-transparent)] rounded-lg border border-[var(--primary-transparent-border)]">
                  <span className="icon text-[var(--primary)] text-xs">account_balance_wallet</span>
                  <span className="text-[0.65rem] font-bold text-[var(--primary)] uppercase tracking-wider">Balance: {balance} BDT</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center w-full max-w-4xl">
            <div className="space-y-4 text-left">
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Amount in BDT</label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-[var(--text-muted)] pointer-events-none group-focus-within:text-[var(--primary)] transition-colors">৳</span>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  id="calc-bdt"
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    const usdInput = document.getElementById('calc-usd') as HTMLInputElement;
                    if (usdInput) {
                      if (isNaN(val)) usdInput.value = '';
                      else usdInput.value = (val / exchangeRate).toFixed(2);
                    }
                  }}
                  className="input px-6 py-5 text-center text-xl font-bold tracking-tight shadow-sm"
                />
              </div>
            </div>

            <div className="flex justify-center md:pt-6">
              <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]">
                <span className="icon">sync_alt</span>
              </div>
            </div>

            <div className="space-y-4 text-left">
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Equivalent in USD</label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-[var(--text-muted)] pointer-events-none group-focus-within:text-[var(--info)] transition-colors">$</span>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  id="calc-usd"
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    const bdtInput = document.getElementById('calc-bdt') as HTMLInputElement;
                    if (bdtInput) {
                      if (isNaN(val)) bdtInput.value = '';
                      else bdtInput.value = (val * exchangeRate).toFixed(2);
                    }
                  }}
                  className="input px-6 py-5 text-center text-xl font-bold tracking-tight shadow-sm border-[var(--info-transparent-border)] focus:border-[var(--info)] focus:ring-[var(--info-transparent)]"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-[var(--surface-2)] rounded-2xl text-center">
            <span className="text-[0.65rem] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">
              Exchange Rate Applied: 1 USD = {exchangeRate} BDT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
