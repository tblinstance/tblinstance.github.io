import { useAppStore } from '../../store/AppStore';
import { MarketplacePage } from '../../components/MarketplacePage';
import { useState, useEffect } from 'react';

export function LandingView() {
  const { setShowAuth, setIsLogin, plans, exchangeRate } = useAppStore();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { img: '/analytics_bg.webp', title: 'Global Node Oversight', desc: 'Real-time telemetry and network monitoring.' },
    { img: '/analytics_bg.webp', title: 'Compute Core Performance', desc: 'NVMe storage and high-bandwidth processing.' },
    { img: '/analytics_bg.webp', title: 'Security Protocol Layer', desc: 'DDoS mitigation and encrypted transactions.' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(s => (s + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] font-['Outfit'] overflow-x-hidden transition-colors duration-300">

      {/* Hero Section */}
      <section id="hero" className="py-16 px-5 md:py-28 md:px-12 text-center relative overflow-hidden">
        {/* Matrix Analytic Background */}
        <div className="absolute inset-0 z-0">
           <img 
            src="/analytics_bg.webp" 
            fetchPriority="high"
            width={1024}
            height={1024}
            className="w-full h-full object-cover opacity-[0.05] dark:opacity-[0.1] grayscale brightness-150 mix-blend-overlay" 
            alt="Matrix Background"
          />
           <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
           
           {/* Scrolling Data Streams */}
           <div className="absolute top-0 left-1/4 bottom-0 w-20 opacity-[0.05] pointer-events-none flex gap-2 overflow-hidden">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex flex-col gap-1 animate-[matrix-fall_15s_infinite_linear]" style={{ animationDelay: `${i * 4}s` }}>
                  {Array(40).fill(0).map(() => (
                    <span key={Math.random()} className="text-[0.4rem] font-mono text-[var(--primary)]">
                      {Math.random().toString(16).substring(2, 8).toUpperCase()}
                    </span>
                  ))}
                </div>
              ))}
           </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-transparent)] text-[var(--primary)] text-sm font-bold mb-8 border border-[var(--primary-transparent-border)] uppercase tracking-wide">
            <span className="icon icon-sm">protocol</span> Global Node Protocol v2.0
          </div>
          <h2 className="text-4xl md:text-7xl font-black mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-[var(--text-main)] to-[var(--primary)] text-transparent bg-clip-text">
              Architecting the Global Compute Standard.
            </span>
            <span className="block text-3xl md:text-[2.8rem] font-extrabold mt-4">
              <span className="text-[var(--primary)]">TBLINC</span>
              <span className="text-[var(--text-muted)] font-medium"> — The Power of Enterprise Cloud.</span>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-muted)] mb-10 leading-relaxed max-w-2xl mx-auto">
            Engineered for high-performance scale. Deploy 2026-spec NVMe VPS nodes across 20+ global regions with sub-50ms latency.
            <br />
            <span className="font-bangla text-[var(--primary)] font-bold mt-2 block">
               TBLINC-এ স্বাগতম — আপনার এন্টারপ্রাইজ ক্লাউড অবকাঠামো।
            </span>
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-20">
            <button onClick={() => { setIsLogin(false); setShowAuth(true); }} className="btn btn-primary btn-lg">Sign Up Free</button>
            <button onClick={() => { setIsLogin(true); setShowAuth(true); }} className="btn btn-secondary btn-lg">Log In</button>
          </div>
        </div>
      </section>

      {/* Full-Width Matrix Slider Section */}
      <section className="relative w-full group overflow-hidden mb-20">
         <div className="relative h-[500px] md:h-[650px] overflow-hidden border-y border-[var(--border)] bg-[var(--surface)]">
            {slides.map((slide, i) => (
              <div 
                key={i} 
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${i === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
              >
                <img src={slide.img} alt={slide.title} className="w-full h-full object-cover grayscale brightness-150 mix-blend-overlay opacity-20" />
                
                {/* Matrix Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent">
                   <div className="text-[0.7rem] font-black text-[var(--primary)] uppercase tracking-[0.4em] mb-4 animate-pulse">{slide.title}</div>
                   <h3 className="text-3xl md:text-5xl font-black text-[var(--text-main)] mb-6 tracking-tighter max-w-2xl">{slide.desc}</h3>
                   
                   {/* Animated Data Streams for Slider */}
                   <div className="flex gap-4 opacity-30">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="flex flex-col gap-1 text-[0.5rem] font-mono text-[var(--text-muted)] h-20 overflow-hidden">
                           {Array(10).fill(0).map(() => (
                             <span key={Math.random()}>{Math.random().toString(16).substring(2, 8).toUpperCase()}</span>
                           ))}
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            ))}

            {/* Progress Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
               {slides.map((_, i) => (
                 <button 
                   key={i} 
                   onClick={() => setActiveSlide(i)}
                   className={`w-12 h-1.5 rounded-full transition-all duration-500 ${i === activeSlide ? 'bg-[var(--primary)] shadow-[0_0_15px_var(--primary)]' : 'bg-[var(--border)] hover:bg-[var(--text-muted)]'}`}
                 />
               ))}
            </div>

            {/* Glass Controls */}
            <button 
              onClick={() => setActiveSlide(s => (s - 1 + slides.length) % slides.length)}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-[var(--surface)]/50 backdrop-blur-xl border border-[var(--border)] text-[var(--text-main)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-[var(--text-on-primary)] transition-all opacity-0 group-hover:opacity-100"
            >
              <span className="icon">chevron_left</span>
            </button>
            <button 
              onClick={() => setActiveSlide(s => (s + 1) % slides.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-[var(--surface)]/50 backdrop-blur-xl border border-[var(--border)] text-[var(--text-main)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-[var(--text-on-primary)] transition-all opacity-0 group-hover:opacity-100"
            >
              <span className="icon">chevron_right</span>
            </button>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 px-5 md:py-24 md:px-12 bg-[var(--surface-2)]">
        <div className="text-center mb-16">
          <div className="badge badge-primary mb-4">Platform Features</div>
          <h2 className="text-3xl md:text-4xl font-extrabold m-0">Everything you need to scale</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { icon: 'bolt', title: 'NVMe Storage', desc: 'Enterprise-grade NVMe SSDs for lightning fast I/O performance.' },
            { icon: 'public', title: 'Global Edge', desc: 'Deploy across multiple regions with sub-50ms latency.' },
            { icon: 'security', title: 'DDoS Protection', desc: 'Advanced mitigation layers to keep your apps safe and online.' },
            { icon: 'lan', title: '10Gbps Network', desc: 'High-bandwidth throughput for data-intensive applications.' },
          ].map(f => (
            <div key={f.title} className="card p-8 group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--primary-transparent)] border border-[var(--primary-transparent-border)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="icon text-[1.8rem] text-[var(--primary)]">{f.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-[var(--text-muted)] m-0 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Infrastructure Deep Dive */}
      <section id="infrastructure" className="py-16 px-5 md:py-28 md:px-12 bg-[var(--bg)]">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="badge badge-primary mb-4">Under the Hood</div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">Deep Dive: Cloud Infrastructure</h2>
            <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">Everything you need to know about how TBLINC is architected for maximum performance.</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {[
              { num: '1', title: 'The Power of 100% NVMe Storage', p1: 'In the modern cloud era, storage bottlenecks are the number one cause of slow application performance. At TBLINC, we have eliminated this bottleneck entirely by exclusively utilizing enterprise-grade NVMe solid-state drives.', p2: 'NVMe communicates directly with the CPU via PCIe, providing up to 6x faster read/write speeds than standard SSDs.' },
              { num: '2', title: 'Global Network & 10 Gbps Uplinks', p1: 'A powerful server is useless without a network that can deliver its data to the world. Every single compute node in our infrastructure is connected to dual 10 Gbps uplinks with redundant Tier-1 transit providers.', p2: 'With data center locations strategically placed globally, you can achieve sub-20ms latency to your user base.' },
              { num: '3', title: 'Advanced DDoS Mitigation', p1: 'Security is a fundamental requirement. TBLINC includes enterprise-level, always-on DDoS mitigation with every instance.', p2: 'Our inline hardware continuously analyzes traffic patterns using ML algorithms to scrub malicious packets while passing legitimate traffic.' },
              { num: '4', title: 'KVM Virtualization', p1: 'We utilize KVM technology to provide true hardware virtualization. You get your own dedicated kernel, isolated memory space, and guaranteed CPU scheduling.', p2: 'This isolation means the "noisy neighbor" problem is a thing of the past.' },
            ].map(card => (
              <div key={card.num} className="card p-8 hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="w-10 h-10 rounded-xl bg-[var(--primary-transparent)] text-[var(--primary)] border border-[var(--primary-transparent-border)] flex items-center justify-center font-bold text-lg shrink-0">{card.num}</span>
                  <h3 className="text-lg font-bold m-0">{card.title}</h3>
                </div>
                <p className="text-[var(--text-sub)] mb-3 leading-relaxed">{card.p1}</p>
                <p className="text-[var(--text-muted)] text-sm m-0 leading-relaxed">{card.p2}</p>
              </div>
            ))}

            {/* 1-Click Apps card */}
            <div className="card p-8 md:col-span-2 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="w-10 h-10 rounded-xl bg-[var(--primary-transparent)] text-[var(--primary)] border border-[var(--primary-transparent-border)] flex items-center justify-center font-bold text-lg shrink-0">
                  <span className="icon">apps</span>
                </span>
                <h3 className="text-xl font-bold m-0">1-Click Apps: n8n, WordPress, MySQL</h3>
              </div>
              <p className="text-[var(--text-sub)] mb-6 leading-relaxed">Bypass the hassle of manual configuration. TBLINC features a powerful 1-Click App Marketplace to deploy complex software stacks instantly:</p>
              <div className="flex flex-wrap gap-3">
                {['⚡ n8n Workflow Automation', '⚡ WordPress Stack', '⚡ Production MySQL'].map(item => (
                  <div key={item} className="badge badge-primary px-4 py-2 font-semibold bg-[var(--bg)] shadow-sm">{item}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Setup Scripts */}
          <div className="card p-6 md:p-10 border-t-4 border-t-[var(--primary)]">
            <div className="flex items-center gap-4 mb-2">
              <span className="icon text-3xl text-[var(--primary)]">terminal</span>
              <h3 className="text-xl font-bold m-0">Quick Setup Scripts</h3>
            </div>
            <p className="text-[var(--text-muted)] mb-8">Jumpstart your deployments! Run these as root via SSH on your new Ubuntu instance.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { label: 'Install Nginx', code: 'apt update && \\\napt install nginx -y\n\nsystemctl enable nginx' },
                { label: 'Install MySQL', code: 'apt update && \\\napt install mysql-server -y\n\nmysql_secure_installation' },
                { label: 'Install Apache2', code: "apt update && \\\napt install apache2 -y\n\nufw allow 'Apache Full'" },
                { label: 'Deploy n8n via Docker', code: 'docker run -d --restart always \\\n  --name n8n -p 5678:5678 \\\n  -v n8n_data:/home/node/.n8n \\\n  docker.n8n.io/n8nio/n8n' },
                { label: 'Download WordPress', code: 'wget https://wordpress.org/latest.tar.gz\n\ntar -xzvf latest.tar.gz\nmv wordpress /var/www/html/' },
              ].map(script => (
                <div key={script.label} className="bg-[#0f172a] rounded-xl overflow-hidden border border-[#1e293b]">
                  <div className="px-4 py-2 border-b border-[#1e293b] text-[#38bdf8] text-xs font-bold uppercase tracking-wider">{script.label}</div>
                  <pre className="m-0 p-4 text-[#f8fafc] text-xs whitespace-pre-wrap leading-relaxed bg-transparent">{script.code}</pre>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-12 p-10 bg-[var(--primary-transparent)] rounded-3xl border border-[var(--primary-transparent-border)] text-center shadow-[var(--glow-primary)]">
            <h4 className="text-3xl font-bold text-[var(--primary)] mb-3">Start Building the Future</h4>
            <p className="text-[var(--text-sub)] text-lg m-0">Experience the speed, security, and reliability of TBLINC today. Deploy your first instance in under 60 seconds.</p>
          </div>
        </div>
      </section>



      {/* Pricing / Marketplace */}
      <section id="pricing" className="py-16 px-5 md:py-24 md:px-12 bg-[var(--surface)] relative overflow-hidden">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Transparent Pricing</h2>
          <p className="text-[var(--text-muted)] text-lg">Join the next generation of cloud computing today. No hidden fees.</p>
        </div>
        
        {/* Render the actual marketplace cards */}
        <MarketplacePage 
          plans={plans} 
          onSelect={() => { setIsLogin(false); setShowAuth(true); }} 
          exchangeRate={exchangeRate || 120}
        />
      </section>

    </div>
  );
}
