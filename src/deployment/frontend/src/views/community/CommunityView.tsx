export function CommunityView() {
  const socialChannels = [
    { name: 'Discord Command', desc: 'Join 5,000+ developers for real-time protocol support.', icon: 'forum', color: '#5865F2' },
    { name: 'X / Twitter', desc: 'Stay updated on the latest infrastructure patches and node expansions.', icon: 'terminal', color: '#1DA1F2' },
    { name: 'Github Archive', desc: 'Contribute to our open-source SDKs and infrastructure scripts.', icon: 'code', color: '#333' },
    { name: 'Telegram Bridge', desc: 'Secure community channel for rapid node status alerts.', icon: 'send', color: '#0088cc' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] font-['Outfit'] overflow-x-hidden">
      {/* Matrix Header */}
      <section className="relative py-32 px-5 md:px-12 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 z-0">
           <img src="/analytics_bg.webp" className="w-full h-full object-cover opacity-[0.05] dark:opacity-[0.1] grayscale" alt="Matrix" />
           <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="badge badge-primary mb-6">Global Mesh</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            Developer <span className="text-[var(--primary)]">Ecosystem.</span>
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed mb-4">
            Join the TBLINC community. Collaborate on the global compute standard and architect the future of decentralized infrastructure.
          </p>
          <p className="font-bangla text-[var(--primary)] font-bold text-lg">
             কমিউনিটি ইকোসিস্টেম — ডেভেলপারদের সাথে যুক্ত হোন এবং ক্লাউড ভবিষ্যৎ গড়ুন।
          </p>
        </div>
      </section>

      {/* Social Grid */}
      <section className="py-24 px-5 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {socialChannels.map((ch, i) => (
            <div key={ch.name} className="card p-8 group hover:-translate-y-2 transition-all duration-500 border border-[var(--border)] hover:border-[var(--primary-transparent-border)] bg-[var(--surface)] animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 shadow-lg" style={{ backgroundColor: `${ch.color}22`, color: ch.color }}>
                <span className="icon text-2xl">{ch.icon}</span>
              </div>
              <h3 className="text-xl font-black mb-3">{ch.name}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-8 flex-1">{ch.desc}</p>
              <button className="btn btn-ghost w-full border border-[var(--border)] group-hover:border-[var(--primary-transparent-border)] group-hover:text-[var(--primary)]">Join Protocol</button>
            </div>
          ))}
        </div>
      </section>

      {/* Community Spotlight */}
      <section className="py-24 px-5 md:px-12 bg-[var(--surface-2)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
             <div className="flex-1 space-y-8">
                <h2 className="text-4xl font-black tracking-tight">Ecosystem Spotlight.</h2>
                <p className="text-lg text-[var(--text-muted)] leading-relaxed">Every month we highlight top contributors who are building mission-critical tools on top of the TBLINC protocol.</p>
                <div className="space-y-4">
                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                      <div className="w-12 h-12 rounded-full bg-[var(--primary-transparent)]" />
                      <div>
                         <div className="font-bold text-sm">Nexus-CLI Toolchain</div>
                         <div className="text-xs text-[var(--text-muted)]">Built by @infra_ninja</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                      <div className="w-12 h-12 rounded-full bg-[var(--primary-transparent)]" />
                      <div>
                         <div className="font-bold text-sm">Terraform TBLINC Provider</div>
                         <div className="text-xs text-[var(--text-muted)]">Built by @cloud_architect</div>
                      </div>
                   </div>
                </div>
             </div>
             <div className="flex-1 w-full lg:w-auto aspect-square rounded-[3rem] overflow-hidden relative">
                <img src="/analytics_bg.webp" className="w-full h-full object-cover grayscale opacity-20" alt="Community" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-8xl font-black text-[var(--primary)] opacity-10 select-none">MESH</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-5 md:px-12 text-center border-t border-[var(--border)]">
         <h2 className="text-5xl font-black mb-8 tracking-tighter">Become a Part of the <span className="text-[var(--primary)]">Mesh.</span></h2>
         <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-12">Whether you are an infrastructure architect or a hobbyist developer, there is a place for you in the TBLINC ecosystem.</p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary px-10">Join Discord Command</button>
            <button className="btn btn-ghost border border-[var(--border)] px-10">View Github Repo</button>
         </div>
      </section>
    </div>
  );
}
