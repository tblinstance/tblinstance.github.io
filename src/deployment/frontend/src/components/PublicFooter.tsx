import { useAppStore } from '../store/AppStore';

export function PublicFooter() {
  const { setActiveTab } = useAppStore();

  const sections = [
    {
      title: 'Infrastructure',
      links: [
        { label: 'Compute Nodes', tab: 'products' },
        { label: 'Storage Fabric', tab: 'products' },
        { label: 'Secure Network', tab: 'products' },
        { label: 'GPU Instances', tab: 'products' },
      ]
    },
    {
      title: 'Solutions',
      links: [
        { label: 'For Startups', tab: 'solutions' },
        { label: 'For Enterprise', tab: 'solutions' },
        { label: 'For Developers', tab: 'solutions' },
        { label: 'For Finance', tab: 'solutions' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', tab: 'docs' },
        { label: 'Pricing Matrix', tab: 'pricing' },
        { label: 'System Status', tab: 'status' },
        { label: 'Community Mesh', tab: 'community' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About TBLINC', tab: 'home' },
        { label: 'Legal Protocols', tab: 'home' },
        { label: 'Privacy Policy', tab: 'home' },
        { label: 'Contact Team', tab: 'home' },
      ]
    }
  ];

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] pt-24 pb-12 px-5 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-24">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
             <h1 className="text-2xl font-black text-[var(--primary)] mb-6 tracking-tighter">TBLINC</h1>
             <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-8 max-w-xs">
                Architecting the global compute standard. Deploy 2026-spec NVMe infrastructure in seconds.
             </p>
             <div className="flex gap-4">
                {['facebook', 'twitter', 'github', 'discord'].map(social => (
                  <button key={social} className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary-transparent-border)] transition-all">
                    <span className="icon text-lg">{social === 'facebook' ? 'public' : social === 'twitter' ? 'terminal' : social === 'github' ? 'code' : 'forum'}</span>
                  </button>
                ))}
             </div>
          </div>

          {sections.map(section => (
            <div key={section.title}>
               <h4 className="text-[0.65rem] font-black text-[var(--text-main)] uppercase tracking-[0.3em] mb-8">{section.title}</h4>
               <ul className="space-y-4 p-0 list-none m-0">
                  {section.links.map(link => (
                    <li key={link.label}>
                       <button 
                        onClick={() => { setActiveTab(link.tab); window.scrollTo(0, 0); }}
                        className="bg-transparent border-none p-0 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors cursor-pointer"
                       >
                          {link.label}
                       </button>
                    </li>
                  ))}
               </ul>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="text-[0.65rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">
              © 2026 TBLINC INFRASTRUCTURE PROTOCOL. ALL RIGHTS RESERVED.
           </div>
           <div className="flex items-center gap-8 text-[0.65rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">
              <span className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 All Systems Operational
              </span>
              <button onClick={() => window.scrollTo(0, 0)} className="bg-transparent border-none p-0 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer">Back to Top</button>
           </div>
        </div>
      </div>
    </footer>
  );
}
