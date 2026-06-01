import type { FC } from 'react';

export const LandingSEO: FC = () => {
  return (
    <section className="bg-[var(--surface)] border-b border-[var(--border)] relative overflow-hidden py-24 md:py-32">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-[var(--text-main)] mb-6 tracking-tight leading-tight">
            Deep Dive: <span className="text-[var(--primary)]">Ultimate Cloud Infrastructure</span>
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-muted)] font-medium max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about how TBLINC is architected for maximum performance and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="card group p-10 hover:border-[var(--primary-transparent-border)] transition-all duration-500">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary-transparent)] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="icon text-[var(--primary)] text-2xl">storage</span>
            </div>
            <h3 className="text-2xl font-black text-[var(--text-main)] mb-4 tracking-tight">1. 100% NVMe Storage</h3>
            <p className="text-[var(--text-sub)] font-medium leading-relaxed mb-4">
              In the modern cloud era, storage bottlenecks are the number one cause of slow performance. We use enterprise-grade NVMe drives exclusively.
            </p>
            <p className="text-[var(--text-sub)] font-medium leading-relaxed">
              NVMe provides up to 6x faster speeds than standard SSDs, ensuring your databases run blazingly fast.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card group p-10 hover:border-[var(--primary-transparent-border)] transition-all duration-500">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="icon text-blue-500 text-2xl">language</span>
            </div>
            <h3 className="text-2xl font-black text-[var(--text-main)] mb-4 tracking-tight">2. 10 Gbps Global Network</h3>
            <p className="text-[var(--text-sub)] font-medium leading-relaxed mb-4">
              Every compute node is connected to dual 10 Gbps uplinks with redundant Tier-1 transit providers for absolute reliability.
            </p>
            <p className="text-[var(--text-sub)] font-medium leading-relaxed">
              Achieve sub-20ms latency globally with our strategically placed data centers across North America, Europe, and Asia.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card group p-10 hover:border-[var(--primary-transparent-border)] transition-all duration-500">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="icon text-orange-500 text-2xl">security</span>
            </div>
            <h3 className="text-2xl font-black text-[var(--text-main)] mb-4 tracking-tight">3. Advanced Mitigation</h3>
            <p className="text-[var(--text-sub)] font-medium leading-relaxed mb-4">
              DDoS attacks are evolving. TBLINC includes enterprise-level, always-on DDoS mitigation with every single instance.
            </p>
            <p className="text-[var(--text-sub)] font-medium leading-relaxed">
              Our inline mitigation hardware scrubs malicious packets while allowing legitimate traffic to pass through seamlessly.
            </p>
          </div>

          {/* Card 4 */}
          <div className="card group p-10 hover:border-[var(--primary-transparent-border)] transition-all duration-500">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="icon text-emerald-500 text-2xl">shield</span>
            </div>
            <h3 className="text-2xl font-black text-[var(--text-main)] mb-4 tracking-tight">4. KVM True Isolation</h3>
            <p className="text-[var(--text-sub)] font-medium leading-relaxed mb-4">
              We utilize KVM technology to provide true hardware virtualization. You get your own dedicated kernel and isolated memory space.
            </p>
            <p className="text-[var(--text-sub)] font-medium leading-relaxed">
              Experience consistent performance without the "noisy neighbor" problem found in legacy shared hosting environments.
            </p>
          </div>

          {/* Card 5 */}
          <div className="card group p-10 hover:border-[var(--primary-transparent-border)] transition-all duration-500">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="icon text-indigo-500 text-2xl">api</span>
            </div>
            <h3 className="text-2xl font-black text-[var(--text-main)] mb-4 tracking-tight">5. Developer-First API</h3>
            <p className="text-[var(--text-sub)] font-medium leading-relaxed mb-4">
              Our platform was built API-first. Anything you can do in the dashboard, you can do via our RESTful API.
            </p>
            <p className="text-[var(--text-sub)] font-medium leading-relaxed">
              Programmatically manage DNS, rebuild systems, and monitor metrics with absolute control and ease.
            </p>
          </div>

          {/* Card 6 */}
          <div className="card group p-10 hover:border-[var(--primary-transparent-border)] transition-all duration-500">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="icon text-rose-500 text-2xl">rocket</span>
            </div>
            <h3 className="text-2xl font-black text-[var(--text-main)] mb-4 tracking-tight">6. 1-Click App Marketplace</h3>
            <p className="text-[var(--text-sub)] font-medium leading-relaxed mb-6">
              Bypass complex configurations. Deploy pre-configured software stacks instantly:
            </p>
            <ul className="space-y-3 m-0 p-0 list-none">
              <li className="flex items-center gap-3 text-sm font-bold text-[var(--text-main)]">
                <span className="icon text-[var(--primary)] text-base">bolt</span> n8n Automation
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-[var(--text-main)]">
                <span className="icon text-[var(--primary)] text-base">bolt</span> WordPress CMS
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-[var(--text-main)]">
                <span className="icon text-[var(--primary)] text-base">bolt</span> MySQL Database
              </li>
            </ul>
          </div>

          {/* Scripts Section */}
          <div className="lg:col-span-3 card p-10 md:p-12 mt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h3 className="text-3xl font-black text-[var(--text-main)] mb-2 tracking-tight">Quick Setup Scripts</h3>
                <p className="text-[var(--text-sub)] font-medium">Jumpstart your deployments with these optimized shell commands.</p>
              </div>
              <div className="px-4 py-2 bg-[var(--primary-transparent)] rounded-xl border border-[var(--primary-transparent-border)] text-[var(--primary)] font-bold text-sm">
                Run as root via SSH
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[
                { 
                  title: 'Install Nginx', 
                  code: 'apt update && \\\napt install nginx -y\n\nsystemctl enable nginx\nsystemctl start nginx' 
                },
                { 
                  title: 'Install MySQL', 
                  code: 'apt update && \\\napt install mysql-server -y\n\nmysql_secure_installation' 
                },
                { 
                  title: 'Install Apache2', 
                  code: 'apt update && \\\napt install apache2 -y\n\nufw allow \'Apache Full\'' 
                },
                { 
                  title: 'n8n (Docker)', 
                  code: 'docker volume create n8n_data\n\ndocker run -d --restart always \\\n  --name n8n -p 5678:5678 \\\n  -v n8n_data:/home/node/.n8n \\\n  docker.n8n.io/n8nio/n8n' 
                },
                { 
                  title: 'WordPress', 
                  code: 'wget https://wordpress.org/latest.tar.gz\n\ntar -xzvf latest.tar.gz\nmv wordpress /var/www/html/\nchown -R www-data:www-data /var/www/html/' 
                }
              ].map(script => (
                <div key={script.title} className="bg-[#0f172a] rounded-2xl border border-white/5 overflow-hidden group">
                  <div className="px-5 py-3 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <span className="text-xs font-black text-[#38bdf8] uppercase tracking-widest">{script.title}</span>
                    <button className="text-white/30 hover:text-white transition-colors">
                      <span className="icon text-sm">content_copy</span>
                    </button>
                  </div>
                  <div className="p-5 overflow-x-auto custom-scrollbar">
                    <pre className="text-xs md:text-[0.75rem] font-mono text-slate-300 leading-relaxed whitespace-pre">
                      <code>{script.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 p-10 md:p-16 bg-gradient-to-br from-[var(--primary)] to-blue-700 rounded-[2.5rem] text-center shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10">
            <h4 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Start Building the Future</h4>
            <p className="text-lg md:text-xl text-blue-100 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
              Experience the speed, security, and reliability of TBLINC today. Deploy your first instance in under 60 seconds.
            </p>
            <button className="btn bg-white text-[var(--primary)] hover:bg-blue-50 px-12 py-5 rounded-2xl font-black text-lg shadow-xl transition-all hover:scale-105 active:scale-95">
              Launch Dashboard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
