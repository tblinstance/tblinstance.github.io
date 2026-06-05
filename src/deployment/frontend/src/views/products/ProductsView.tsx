import { useAppStore } from '../../store/AppStore';

export function ProductsView() {
  const { setShowAuth, setIsLogin } = useAppStore();

  const categories = [
    {
      title: 'Compute Protocols',
      items: [
        { name: 'Standard VPS', desc: 'Enterprise NVMe instances for general workloads.', icon: 'dns', price: 'From $4.99/mo' },
        { name: 'Dedicated CPU', desc: 'Guaranteed resources with no noisy neighbors.', icon: 'bolt', price: 'From $19.99/mo' },
        { name: 'High RAM Nodes', desc: 'Optimized for memory-intensive databases.', icon: 'memory', price: 'From $24.99/mo' },
        { name: 'GPU Instances', desc: 'High-performance AI & ML infrastructure.', icon: 'developer_board', price: 'From $99.99/mo' },
      ]
    },
    {
      title: 'Bare Metal & Clusters',
      items: [
        { name: 'Bare Metal Solo', desc: 'Single-tenant physical servers with zero virtualization overhead.', icon: 'router', price: 'From $149/mo' },
        { name: 'Managed Kubernetes', desc: 'Automated orchestration for containerized microservices.', icon: 'hub', price: 'From $49/mo' },
        { name: 'Enterprise Cluster', desc: 'Custom-built private cloud environments.', icon: 'grid_view', price: 'Custom Quote' },
        { name: 'DevOps Nodes', desc: 'Pre-configured environments for CI/CD pipelines.', icon: 'terminal', price: 'From $12.99/mo' },
      ]
    },
    {
      title: 'Storage & Data Fabric',
      items: [
        { name: 'Block Storage', desc: 'Scalable NVMe volumes for compute nodes.', icon: 'storage', price: '$0.10/GB' },
        { name: 'Object Storage', desc: 'S3-compatible storage for static assets.', icon: 'cloud_upload', price: '$0.02/GB' },
        { name: 'Managed MySQL', desc: 'Fully managed relational databases.', icon: 'database', price: 'From $15.00/mo' },
        { name: 'Managed Redis', desc: 'High-speed in-memory data store.', icon: 'speed', price: 'From $10.00/mo' },
      ]
    },
    {
      title: 'Global Connectivity',
      items: [
        { name: 'Private Network', desc: 'Isolated VPC for secure internal traffic.', icon: 'lan', price: 'Included' },
        { name: 'Global Content Delivery', desc: 'Edge caching for ultra-low latency assets.', icon: 'public', price: 'Pay-as-you-go' },
        { name: 'Direct Connect', desc: 'Dedicated fiber link to your local data center.', icon: 'settings_ethernet', price: 'Custom Quote' },
        { name: 'Anycast DNS', desc: 'Sub-ms resolution at the edge.', icon: 'language', price: 'Free' },
      ]
    },
    {
      title: 'Shielded Security',
      items: [
        { name: 'DDoS Mitigation', desc: 'Advanced L7 mitigation and scrubbing.', icon: 'security', price: 'Included' },
        { name: 'Cloud Firewall', desc: 'Real-time traffic filtering and protocol isolation.', icon: 'wall', price: 'Free' },
        { name: 'SSL Protocol', desc: 'Automated certificate management and rotation.', icon: 'verified_user', price: 'Free' },
        { name: 'Audit Logging', desc: 'Comprehensive transaction and access logs.', icon: 'history_edu', price: 'Included' },
      ]
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
          <div className="badge badge-primary mb-6">Product Catalog</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            Infrastructure <span className="text-[var(--primary)]">Inventory.</span>
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl leading-relaxed mb-4">
            The complete suite of TBLINC compute, storage, and networking protocols engineered for 2026-spec performance.
          </p>
          <p className="font-bangla text-[var(--primary)] font-bold text-lg">
             ইনফ্রাস্ট্রাকচার ইনভেন্টরি — আপনার ব্যবসার জন্য সঠিক ক্লাউড সমাধান।
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 px-5 md:px-12">
        <div className="max-w-7xl mx-auto space-y-24">
          {categories.map((cat, i) => (
            <div key={cat.title} className="animate-fade-in" style={{ animationDelay: `${i * 200}ms` }}>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-1.5 bg-[var(--primary)] rounded-full" />
                <h2 className="text-3xl font-black tracking-tight">{cat.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {cat.items.map((item) => (
                  <div key={item.name} className="card p-8 group hover:-translate-y-2 transition-all duration-500 border border-[var(--border)] hover:border-[var(--primary-transparent-border)] shadow-sm hover:shadow-[var(--card-shadow-hover)]">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:bg-[var(--primary-transparent)] transition-all mb-6">
                      <span className="icon text-2xl">{item.icon}</span>
                    </div>
                    <h3 className="text-xl font-black mb-3 group-hover:text-[var(--primary)] transition-colors">{item.name}</h3>
                    <p className="text-sm text-[var(--text-muted)] mb-6 leading-relaxed flex-1">
                      {item.desc}
                    </p>
                    <div className="pt-6 border-t border-[var(--border)] flex justify-between items-center">
                      <span className="text-xs font-black text-[var(--primary)] uppercase tracking-widest">{item.price}</span>
                      <button onClick={() => setShowAuth(true)} className="icon text-lg text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">arrow_forward</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5 md:px-12 bg-[var(--surface-2)]">
        <div className="max-w-4xl mx-auto text-center card p-16 border-2 border-[var(--primary-transparent-border)]">
          <h2 className="text-4xl font-black mb-6">Ready to Deploy?</h2>
          <p className="text-lg text-[var(--text-muted)] mb-10">Start with a single node or architect a global cluster. Our protocols scale with you.</p>
          <button onClick={() => { setIsLogin(false); setShowAuth(true); }} className="btn btn-primary btn-lg">Create Protocol Account</button>
        </div>
      </section>
    </div>
  );
}
