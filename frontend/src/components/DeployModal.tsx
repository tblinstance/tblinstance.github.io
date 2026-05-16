import type { Plan } from './types';
import { REGIONS, IMAGES } from './types';

interface Props {
  selectedPlan: Plan;
  customName: string;
  setCustomName: (v: string) => void;
  customRootPass: string;
  setCustomRootPass: (v: string) => void;
  selectedRegion: string;
  setSelectedRegion: (v: string) => void;
  selectedImage: string;
  setSelectedImage: (v: string) => void;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeployModal({
  selectedPlan, customName, setCustomName,
  customRootPass, setCustomRootPass,
  selectedRegion, setSelectedRegion,
  selectedImage, setSelectedImage,
  loading, onConfirm, onCancel
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[var(--surface)] p-8 md:p-12 rounded-[2.5rem] border border-[var(--border)] shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="mb-8">
          <h2 className="text-3xl font-black mb-2 text-[var(--primary)] tracking-tight">Configuration Overview</h2>
          <p className="text-[var(--text-muted)] font-medium m-0">Review your {selectedPlan.name} setup before deployment.</p>
        </div>

        <div className="grid gap-6 mb-8">
          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 px-1">Instance Name</label>
            <input 
              type="text" 
              value={customName} 
              onChange={e => setCustomName(e.target.value)} 
              placeholder="e.g. production-api-01" 
              className="input py-3.5" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 px-1">Root Password (Optional)</label>
            <input 
              type="password" 
              value={customRootPass} 
              onChange={e => setCustomRootPass(e.target.value)} 
              placeholder="Leave empty for auto-generate" 
              className="input py-3.5" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 px-1">Region</label>
              <select 
                value={selectedRegion} 
                onChange={e => setSelectedRegion(e.target.value)} 
                className="input py-3.5 cursor-pointer bg-[var(--bg)]"
              >
                {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 px-1">OS Image</label>
              <select 
                value={selectedImage} 
                onChange={e => setSelectedImage(e.target.value)} 
                className="input py-3.5 cursor-pointer bg-[var(--bg)]"
              >
                {IMAGES.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="p-8 bg-[var(--primary-transparent)] rounded-[2rem] border border-[var(--primary-transparent-border)] mb-10 shadow-inner group">
          <h4 className="m-0 mb-3 text-[var(--primary)] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="icon icon-sm">receipt_long</span>
            Deployment Summary
          </h4>
          <p className="m-0 text-lg font-medium leading-relaxed text-[var(--text-sub)]">
            Provisioning <strong className="text-[var(--text-main)] font-black">{selectedPlan.name}</strong> with{' '}
            <strong className="text-[var(--text-main)] font-black">{IMAGES.find(i => i.id === selectedImage)?.name}</strong> in the{' '}
            <strong className="text-[var(--text-main)] font-black">{REGIONS.find(r => r.id === selectedRegion)?.name}</strong> region for{' '}
            <span className="text-[var(--primary)] font-black text-2xl tracking-tighter mx-1">{selectedPlan.price_bdt}</span>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase">BDT</span>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onConfirm} 
            disabled={loading} 
            className="flex-1 btn btn-primary py-4 text-base shadow-xl shadow-[var(--primary-transparent)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><span className="icon animate-spin">refresh</span> Deploying...</>
            ) : (
              <><span className="icon">rocket_launch</span> Confirm & Deploy</>
            )}
          </button>
          <button 
            onClick={onCancel} 
            className="flex-1 btn btn-secondary py-4 text-base"
          >
            <span className="icon">close</span> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
