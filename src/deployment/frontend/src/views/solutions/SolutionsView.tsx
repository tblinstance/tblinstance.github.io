import { useAppStore } from '../../store/AppStore';

export function SolutionsView() {
  const { setShowAuth } = useAppStore();

  const solutions = [
    {
      id: 'startups',
      title: 'For Startups',
      subtitle: 'Scale from MVP to Unicorn with zero friction.',
      desc: 'Infrastructure that grows as fast as your user base. Optimized for speed, developer experience, and cost-efficiency.',
      features: ['Automated Node Scaling', 'Free Staging Environments', 'Startup Credits Program', 'Priority API Access'],
      icon: 'rocket'
    },
    {
      id: 'enterprise',
      title: 'For Enterprise',
      subtitle: 'Mission-critical reliability and dedicated oversight.',
      desc: 'Robust compute protocols backed by 99.99% SLAs, dedicated support, and custom infrastructure planning.',
      features: ['Dedicated Compute Nodes', '24/7/365 Elite Support', 'Custom Compliance Logs', 'Private Global Network'],
      icon: 'business'
    },
    {
      id: 'developers',
      title: 'For Developers',
      subtitle: 'The API-first infrastructure protocol.',
      desc: 'Built by engineers for engineers. Full CLI control, robust SDKs, and deep-dive telemetry with no abstraction lag.',
      features: ['Infrastructure as Code', 'Instant SDK Integration', 'Real-time Telemetry API', 'Open-Source Ecosystem'],
      icon: 'code'
    },
    {
      id: 'finance',
      title: 'For Financial Inst.',
      subtitle: 'Compliant compute nodes for secure transactions.',
      desc: 'Engineered for strict security protocols. Encrypted storage, isolated memory, and verified audit trails.',
      features: ['Hardware-level Isolation', 'PCI-DSS Compliance Layer', 'Encrypted Data Volumes', 'Verified Audit Protocols'],
      icon: 'account_balance'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] font-['Outfit'] overflow-x-hidden">
      {/* Matrix Header */}
      <section className="relative py-32 px-5 md:px-12 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 z-0">
           <img src="/analytics_bg.webp" className="w-full h-full object-cover opacity-[0.05] dark:opacity-[0.1] grayscale" alt="Matrix" />
           <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="badge badge-primary mb-6">Strategic Solutions</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            Targeted <span className="text-[var(--primary)]">Protocols.</span>
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl leading-relaxed mb-4">
            Tailored infrastructure solutions designed to meet the specific requirements of your industry and growth stage.
          </p>
          <p className="font-bangla text-[var(--primary)] font-bold text-lg">
             কৌশলগত সমাধান — আপনার ব্যবসার প্রতিটি পর্যায়ের জন্য উপযুক্ত ইনফ্রাস্ট্রাকচার।
          </p>
        </div>
      </section>

      {/* Solutions Detailed Grid */}
      <section className="py-24 px-5 md:px-12">
        <div className="max-w-7xl mx-auto space-y-32">
          {solutions.map((sol, i) => (
            <div key={sol.id} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center animate-fade-in`} style={{ animationDelay: `${i * 200}ms` }}>
              <div className="flex-1 space-y-8">
                <div className="w-16 h-16 rounded-3xl bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center border border-[var(--primary-transparent-border)]">
                  <span className="icon text-[2.5rem]">{sol.icon}</span>
                </div>
                <div>
                  <h2 className="text-4xl font-black mb-4 tracking-tight">{sol.title}</h2>
                  <p className="text-xl font-bold text-[var(--primary)] mb-6">{sol.subtitle}</p>
                  <p className="text-lg text-[var(--text-muted)] leading-relaxed">{sol.desc}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sol.features.map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm font-bold text-[var(--text-main)]">
                      <span className="icon text-[var(--primary)]">check_circle</span>
                      {f}
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowAuth(true)} className="btn btn-primary px-8">Inquire Protocol</button>
              </div>
              
              <div className="flex-1 w-full lg:w-auto h-[400px] rounded-[3rem] overflow-hidden border border-[var(--border)] shadow-2xl relative group">
                 <img src="/analytics_bg.webp" className="w-full h-full object-cover grayscale brightness-125 opacity-30 group-hover:scale-110 transition-transform duration-1000" alt={sol.title} />
                 <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary-transparent)] via-transparent to-transparent opacity-50" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                    <div className="text-[0.7rem] font-black text-[var(--primary)] uppercase tracking-[0.4em] mb-4 opacity-50">Operational Environment</div>
                    <h3 className="text-2xl font-black tracking-tight">{sol.title} Core</h3>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-24 px-5 md:px-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 opacity-50">
           <div className="text-sm font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Verified Industry Standards</div>
           <div className="flex gap-12 flex-wrap justify-center font-mono text-xl font-black">
              <span>ISO 27001</span>
              <span>SOC2 TYPE II</span>
              <span>PCI-DSS</span>
              <span>GDPR READY</span>
           </div>
        </div>
      </section>
    </div>
  );
}
