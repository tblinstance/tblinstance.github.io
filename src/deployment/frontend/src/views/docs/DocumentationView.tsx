import { useState } from 'react';

export function DocumentationView() {
  const [activeDoc, setActiveDoc] = useState('getting-started');

  const categories = [
    {
      title: 'Introduction',
      links: [
        { id: 'getting-started', label: 'Getting Started', icon: 'rocket_launch' },
        { id: 'architecture', label: 'Cloud Architecture', icon: 'account_tree' },
        { id: 'regions', label: 'Global Regions', icon: 'public' },
      ]
    },
    {
      title: 'Compute Protocols',
      links: [
        { id: 'vps-deployment', label: 'VPS Deployment', icon: 'dns' },
        { id: 'custom-images', label: 'Custom ISO/Images', icon: 'album' },
        { id: 'snapshot-logic', label: 'Snapshot Protocols', icon: 'camera' },
      ]
    },
    {
      title: 'API & Automation',
      links: [
        { id: 'api-auth', label: 'Authentication', icon: 'vpn_key' },
        { id: 'api-endpoints', label: 'Endpoint Matrix', icon: 'api' },
        { id: 'webhooks', label: 'Event Webhooks', icon: 'webhook' },
      ]
    }
  ];

  const content: Record<string, React.ReactNode> = {
    'getting-started': (
      <div className="space-y-8 animate-fade-in">
        <h2 className="text-4xl font-black tracking-tight">Getting Started</h2>
        <p className="text-lg text-[var(--text-muted)] leading-relaxed">
          Welcome to the TBLINC Infrastructure Protocol. This guide will help you deploy your first high-performance compute node in under 60 seconds.
        </p>
        <div className="bg-[#0f172a] rounded-2xl p-6 border border-[#1e293b] font-mono text-sm overflow-hidden relative">
          <div className="flex items-center gap-2 mb-4 border-b border-[#1e293b] pb-4 text-[#38bdf8] font-bold">
            <span className="icon text-sm">terminal</span> SSH Deployment Protocol
          </div>
          <div className="text-[#f8fafc] opacity-80 mb-2"># Step 1: Initialize connection</div>
          <div className="text-[#38bdf8]">ssh root@your-node-ip</div>
          <div className="text-[#f8fafc] opacity-80 mt-4 mb-2"># Step 2: Verify NVMe storage status</div>
          <div className="text-[#38bdf8]">lsblk --nodeps -o NAME,MODEL,SIZE,TYPE</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6 border border-[var(--border)]">
            <h3 className="text-lg font-bold mb-2">Create Account</h3>
            <p className="text-sm text-[var(--text-muted)]">Initialize your administrative ledger and generate your first protocol token.</p>
          </div>
          <div className="card p-6 border border-[var(--border)]">
            <h3 className="text-lg font-bold mb-2">Select Plan</h3>
            <p className="text-sm text-[var(--text-muted)]">Choose from our NVMe-optimized compute tiers starting at $4.99/mo.</p>
          </div>
        </div>
      </div>
    ),
    'architecture': (
      <div className="space-y-8 animate-fade-in">
        <h2 className="text-4xl font-black tracking-tight">Cloud Architecture</h2>
        <p className="text-lg text-[var(--text-muted)] leading-relaxed">
          The TBLINC network is architected on a high-velocity mesh of Tier-3 data centers, utilizing KVM virtualization and specialized NVMe storage arrays.
        </p>
        <div className="grid grid-cols-1 gap-4">
           {[
             { title: 'KVM Virtualization', desc: 'Hardware-level isolation for uncompromised performance.' },
             { title: 'Global Mesh Network', desc: 'Redundant 100Gbps fiber backbones between all regions.' },
             { title: 'NVMe Storage Fabric', desc: 'Sub-ms latency for data-intensive applications.' }
           ].map(item => (
             <div key={item.title} className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]">
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-[var(--text-muted)] m-0">{item.desc}</p>
             </div>
           ))}
        </div>
      </div>
    ),
    'regions': (
      <div className="space-y-8 animate-fade-in">
        <h2 className="text-4xl font-black tracking-tight">Global Regions</h2>
        <p className="text-lg text-[var(--text-muted)] leading-relaxed">
          Deploy your compute nodes in any of our global operational zones to minimize latency for your end users.
        </p>
        <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
          <table className="w-full text-left">
            <thead className="bg-[var(--surface-2)] border-b border-[var(--border)]">
              <tr>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Region</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Code</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { r: 'London, UK', c: 'lon-1', s: 'Operational' },
                { r: 'Frankfurt, DE', c: 'fra-1', s: 'Operational' },
                { r: 'Singapore, SG', c: 'sgp-1', s: 'Operational' },
                { r: 'New York, US', c: 'nyc-1', s: 'Operational' },
              ].map(row => (
                <tr key={row.c} className="border-b border-[var(--border)]">
                  <td className="p-4 text-sm font-bold">{row.r}</td>
                  <td className="p-4 text-sm font-mono text-[var(--primary)]">{row.c}</td>
                  <td className="p-4 text-sm text-green-500 font-bold">{row.s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
    'api-auth': (
      <div className="space-y-8 animate-fade-in">
        <h2 className="text-4xl font-black tracking-tight">API Authentication</h2>
        <p className="text-lg text-[var(--text-muted)] leading-relaxed">
          The TBLINC API utilizes JWT (JSON Web Tokens) for all administrative requests. Your protocol token must be included in the Authorization header.
        </p>
        <div className="bg-[#0f172a] rounded-2xl p-6 border border-[#1e293b] font-mono text-sm">
          <div className="text-[#38bdf8]">Authorization: Bearer {'<your_token>'}</div>
        </div>
        <div className="p-6 bg-[var(--primary-transparent)] rounded-2xl border border-[var(--primary-transparent-border)] flex gap-4">
           <span className="icon text-3xl text-[var(--primary)]">warning</span>
           <div>
             <h4 className="font-bold text-[var(--primary)] mb-1">Security Protocol</h4>
             <p className="text-sm text-[var(--text-sub)] m-0 leading-relaxed">Never share your API tokens. We recommend using Environment Variables to store sensitive credentials in your deployment scripts.</p>
           </div>
        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex font-['Outfit']">
      {/* Docs Sidebar */}
      <aside className="w-[300px] border-r border-[var(--border)] bg-[var(--surface)] hidden lg:flex flex-col sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto p-8">
        <div className="mb-6">
           <h3 className="text-xl font-black tracking-tighter">Docs</h3>
           <p className="font-bangla text-xs font-bold text-[var(--primary)] mt-1">ডকুমেন্টেশন প্রোটোকল</p>
        </div>
        <div className="relative mb-10 group">
           <span className="icon absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors">search</span>
           <input 
            type="text" 
            placeholder="Search docs..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm outline-none focus:border-[var(--primary)] transition-all"
           />
        </div>

        <nav className="space-y-10">
          {categories.map(cat => (
            <div key={cat.title}>
              <h4 className="text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-4">{cat.title}</h4>
              <div className="space-y-1">
                {cat.links.map(link => (
                  <button 
                    key={link.id} 
                    onClick={() => setActiveDoc(link.id)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeDoc === link.id ? 'bg-[var(--primary-transparent)] text-[var(--primary)] font-bold' : 'text-[var(--text-sub)] hover:bg-[var(--surface-2)] hover:text-[var(--text-main)]'}`}
                  >
                    <span className="icon text-lg">{link.icon}</span>
                    <span className="text-sm">{link.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Docs Content */}
      <main className="flex-1 min-h-[calc(100vh-80px)] p-8 md:p-16 lg:p-24 relative overflow-hidden">
        {/* Background Matrix Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--primary)] blur-[200px] opacity-[0.03] pointer-events-none rounded-full" />
        
        <div className="max-w-3xl relative z-10">
          {content[activeDoc] || (
            <div className="text-center py-20">
               <span className="icon text-6xl text-[var(--border)] mb-4">construction</span>
               <h3 className="text-2xl font-black text-[var(--text-muted)]">Protocol documentation in progress.</h3>
               <p className="text-[var(--text-muted)] mt-2">The engineering team is currently archiving this protocol module.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
