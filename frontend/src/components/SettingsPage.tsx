import { useState } from 'react';

interface Props {
  email: string;
  isStaff: boolean;
  profile_image: string | null;
  showConfirm: (title: string, msg: string, cb: () => void, isDanger?: boolean) => void;
  onImageUpload: (file: File) => void;
  two_factor_enabled: boolean;
  exchangeRate: number;
  onSyncRate?: () => Promise<void>;
  generate2FA: () => Promise<{ secret: string; qr_code: string } | null>;
  enable2FA: (otp: string) => Promise<boolean>;
  disable2FA: (otp: string) => Promise<boolean>;
}

export function SettingsPage({
  email, isStaff, profile_image, two_factor_enabled, exchangeRate, onSyncRate,
  showConfirm, onImageUpload,
  generate2FA, enable2FA, disable2FA
}: Props) {
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [setupData, setSetupData] = useState<{ secret: string; qr_code: string } | null>(null);
  const [otpValue, setOtpValue] = useState('');

  const handleStart2FA = async () => {
    const data = await generate2FA();
    if (data) {
      setSetupData(data);
      setShow2FASetup(true);
    }
  };

  const handleVerify2FA = async () => {
    const success = await enable2FA(otpValue);
    if (success) {
      setShow2FASetup(false);
      setSetupData(null);
      setOtpValue('');
    }
  };

  const handleDisable2FA = async () => {
    showConfirm('Disable 2FA', 'Are you sure you want to disable Two-Factor Authentication? Your account will be less secure.', async () => {
      // For disabling, we might want an OTP too, but here we'll just prompt for one
      const code = window.prompt("Enter your 2FA code to confirm:");
      if (code) {
        await disable2FA(code);
      }
    });
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="relative overflow-hidden p-10 md:p-14 rounded-[3rem] mb-12 bg-[var(--surface)] border border-[var(--primary-transparent-border)] group shadow-[var(--card-shadow-hover)]">
        {/* Matrix/Tech Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/analytics_bg.png" 
            className="w-full h-full object-cover opacity-[var(--matrix-opacity)] grayscale brightness-150 mix-blend-[var(--matrix-blend)] hover:scale-110 transition-transform duration-[20s] ease-linear" 
            alt="Matrix Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)]/80 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
          
          {/* Scrolling Data Streams (Analytic Matrix) */}
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
          
          {/* Scanning Line Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-20 animate-[scan_4s_infinite_linear]" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-[2rem] bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center border border-[var(--primary-transparent-border)] shadow-[var(--glow-primary)] group-hover:scale-110 transition-all duration-700">
              <span className="icon text-5xl">manage_accounts</span>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black m-0 tracking-tighter text-[var(--text-main)]">
                Account Settings
              </h2>
              <div className="flex items-center gap-3 mt-3">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <span className="text-[0.7rem] font-black text-[var(--primary)] uppercase tracking-[0.4em]">Personal Protocol Console</span>
              </div>
            </div>
          </div>
          <p className="text-[var(--text-sub)] font-medium mt-4 max-w-xl text-lg leading-relaxed md:text-right">
            Manage your digital identity, security protocols, and platform preferences from the central command console.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Profile Card */}
        <div className="card p-10 flex flex-col items-center text-center bg-[var(--surface)] border-[var(--border)] shadow-[var(--card-shadow)] hover:border-[var(--primary-transparent-border)] transition-all rounded-[3rem]">
          <div className="relative group mb-8">
            <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-4 border-[var(--border)] shadow-2xl bg-[var(--surface-2)] group-hover:border-[var(--primary)] transition-all duration-500">
              {profile_image ? (
                <img src={profile_image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] bg-gradient-to-br from-[var(--surface-2)] to-[var(--bg)]">
                  <span className="icon text-7xl">person</span>
                </div>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-14 h-14 bg-[var(--primary)] text-[var(--text-on-primary)] rounded-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[var(--glow-primary)] border-4 border-[var(--surface)]">
              <span className="icon text-2xl">photo_camera</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImageUpload(file);
                }}
              />
            </label>
          </div>
          <h3 className="text-3xl font-black mb-2 tracking-tight text-[var(--text-main)]">{email}</h3>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-transparent)] text-[var(--primary)] text-[0.65rem] font-black uppercase tracking-widest border border-[var(--primary-transparent-border)]">
             <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
             {isStaff ? 'System Administrator' : 'Authorized Personnel'}
          </div>
        </div>

        {/* Security Card */}
        <div className="card p-10 bg-[var(--surface)] border-[var(--border)] shadow-[var(--card-shadow)] hover:border-[var(--warning-transparent-border)] transition-all rounded-[3rem]">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--warning-transparent)] text-[var(--warning)] flex items-center justify-center border border-[var(--warning-transparent-border)] shadow-[var(--glow-warning)] group-hover:rotate-12 transition-transform">
              <span className="icon text-3xl">security</span>
            </div>
            <div>
              <h3 className="text-2xl font-black m-0 tracking-tighter text-[var(--text-main)]">Authentication</h3>
              <p className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1">Multi-Factor Protocol</p>
            </div>
          </div>

          <p className="text-[var(--text-sub)] mb-10 font-medium leading-relaxed">
            Harden your infrastructure access with 2FA. This mandatory protocol adds an encrypted layer of verification to your identity.
          </p>

          {!two_factor_enabled ? (
            <button onClick={handleStart2FA} className="w-full py-5 rounded-2xl bg-[var(--primary)] text-[var(--text-on-primary)] font-black uppercase tracking-[0.2em] text-sm shadow-[var(--glow-primary)] hover:scale-[1.02] active:scale-95 transition-all">
              Initialize 2FA Protocol
            </button>
          ) : (
            <div className="space-y-6">
              <div className="p-6 bg-[var(--success-transparent)] rounded-2xl border border-[var(--success-transparent-border)] flex items-center gap-4 text-[var(--success)] text-sm font-black uppercase tracking-widest">
                <div className="w-10 h-10 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
                   <span className="icon text-2xl animate-pulse">verified_user</span>
                </div>
                Active Protection Enabled
              </div>
              <button onClick={handleDisable2FA} className="w-full py-4 rounded-2xl bg-[var(--danger-transparent)] text-[var(--danger)] font-black uppercase tracking-widest text-xs border border-[var(--danger-transparent-border)] hover:bg-[var(--danger)] hover:text-[var(--text-on-danger)] transition-all">
                Terminate Security Layer
              </button>
            </div>
          )}
        </div>

        {/* 2FA Setup Modal/Overlay */}
        {show2FASetup && setupData && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="card p-10 max-w-md w-full animate-scale-in bg-[var(--surface)] border-[var(--border)] shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-[3rem]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center border border-[var(--primary-transparent-border)]">
                   <span className="icon text-2xl">qr_code_2</span>
                </div>
                <div>
                   <h3 className="text-2xl font-black m-0 text-[var(--text-main)]">Setup 2FA</h3>
                   <p className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1">Identity Synchronization</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[2.5rem] mb-8 flex justify-center shadow-inner border-8 border-[var(--surface-2)]">
                <img src={setupData.qr_code} alt="2FA QR" className="w-48 h-48 mix-blend-multiply" />
              </div>

              <div className="space-y-6">
                <div className="p-5 bg-[var(--surface-2)] rounded-2xl border border-[var(--border)] text-center">
                  <div className="text-[0.6rem] text-[var(--text-muted)] font-black uppercase tracking-widest mb-2">Protocol Secret Key</div>
                  <div className="text-md font-mono font-black text-[var(--primary)] tracking-widest uppercase">{setupData.secret}</div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="ENTER 6-DIGIT CODE"
                    value={otpValue}
                    onChange={e => setOtpValue(e.target.value)}
                    className="input py-5 text-center text-2xl tracking-[0.4em] font-black bg-[var(--surface-2)] border-2 border-[var(--border)] focus:border-[var(--primary)] rounded-2xl w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setShow2FASetup(false)} className="py-4 rounded-2xl bg-[var(--surface-2)] text-[var(--text-main)] font-black uppercase tracking-widest text-xs border border-[var(--border)] hover:bg-[var(--surface-3)] transition-all">Cancel</button>
                  <button onClick={handleVerify2FA} className="py-4 rounded-2xl bg-[var(--primary)] text-[var(--text-on-primary)] font-black uppercase tracking-widest text-xs shadow-[var(--glow-primary)] hover:scale-[1.02] transition-all">Authorize</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Conversion Settings (Staff Only) */}
        {isStaff && (
          <div className="card p-10 bg-[var(--surface)] border-[var(--border)] shadow-[var(--card-shadow)] hover:border-[var(--primary-transparent-border)] transition-all rounded-[3rem] col-span-1 md:col-span-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center border border-[var(--primary-transparent-border)] shadow-[var(--glow-primary)]">
                  <span className="icon text-3xl">currency_exchange</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black m-0 tracking-tighter text-[var(--text-main)]">Infrastructure Forex</h3>
                  <p className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1">Global Economic Override</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[var(--success-transparent)] border border-[var(--success-transparent-border)]">
                 <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                 <span className="text-[0.7rem] font-black text-[var(--success)] uppercase tracking-widest">Real-Time Sync Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="p-10 bg-[var(--surface-2)] rounded-[3rem] border border-[var(--border)] group/rate hover:border-[var(--primary-transparent-border)] transition-all shadow-inner">
                <div className="flex items-center gap-3 mb-6">
                   <div className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-[0.4em]">Baseline Valuation Ratio</div>
                   <div className="h-px flex-1 bg-[var(--border)]" />
                </div>
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-4">
                      <div className="text-xl font-black text-[var(--text-muted)] uppercase tracking-tighter w-12">USD</div>
                      <div className="text-5xl font-mono font-black text-[var(--text-main)] tracking-tighter">1.0000</div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="text-xl font-black text-[var(--primary)] uppercase tracking-tighter w-12">BDT</div>
                      <div className="text-6xl font-mono font-black text-[var(--primary)] tracking-tighter drop-shadow-[var(--glow-primary)]">
                         {exchangeRate.toFixed(4)}
                      </div>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[var(--text-sub)] font-medium leading-relaxed mb-4 italic">
                  "Adjust the global conversion protocol to reflect current market fluctuations. This override affects all future transaction valuations across the TBLINC network."
                </p>
                <button
                  onClick={onSyncRate}
                  className="w-full py-5 rounded-2xl bg-[var(--primary)] text-[var(--text-on-primary)] font-black uppercase tracking-[0.2em] text-sm shadow-[var(--glow-primary)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <span className="icon text-xl">refresh</span>
                  Synchronize Valuation Data
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
