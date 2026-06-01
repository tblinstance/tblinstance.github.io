import { useAppStore } from '../../store/AppStore';
import { MarketplacePage } from '../../components/MarketplacePage';

export function PricingView() {
  const { plans, exchangeRate, setShowAuth, setIsLogin } = useAppStore();

  const faqs = [
    { q: 'Are there any hidden setup fees?', a: 'No. TBLINC follows a strict transparent pricing protocol. What you see is what you pay, with no activation or setup charges.' },
    { q: 'Can I upgrade my plan later?', a: 'Yes. You can scale your infrastructure in real-time through the Administrative Command Center. Resources are adjusted instantly without rebooting.' },
    { q: 'How does billing work?', a: 'We utilize a credit-based ledger system. You can deposit funds via SSLCommerz, PayPal, or Manual Bank Transfer, and credits are deducted based on your active protocols.' },
    { q: 'Is there a free trial?', a: 'We offer startup credits for verified new projects. Contact our Solutions team for a protocol evaluation.' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] font-['Outfit'] overflow-x-hidden">
      {/* Matrix Header */}
      <section className="relative py-32 px-5 md:px-12 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 z-0">
           <img src="/analytics_bg.png" className="w-full h-full object-cover opacity-[0.05] dark:opacity-[0.1] grayscale" alt="Matrix" />
           <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="badge badge-primary mb-6">Financial Ledger</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            Transparent <span className="text-[var(--primary)]">Pricing.</span>
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed mb-4">
            Predictable compute costs with no hidden variables. Join the next generation of cloud infrastructure today.
          </p>
          <p className="font-bangla text-[var(--primary)] font-bold text-lg">
             স্বচ্ছ মূল্য তালিকা — কোনো লুকানো খরচ ছাড়াই আপনার ক্লাউড যাত্রা শুরু করুন।
          </p>
        </div>
      </section>

      {/* Main Pricing Section */}
      <section className="py-24 px-5 md:px-12 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto">
          <MarketplacePage 
            plans={plans} 
            onSelect={() => { setIsLogin(false); setShowAuth(true); }} 
            exchangeRate={exchangeRate || 120}
          />
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="py-24 px-5 md:px-12 border-y border-[var(--border)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">Protocol Comparison</h2>
            <p className="text-[var(--text-muted)]">A deep dive into the standard features included with every TBLINC node.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="py-6 px-4 text-sm font-black uppercase tracking-widest text-[var(--text-muted)]">Core Protocol</th>
                  <th className="py-6 px-4 text-sm font-black uppercase tracking-widest text-[var(--primary)]">Standard</th>
                  <th className="py-6 px-4 text-sm font-black uppercase tracking-widest text-[var(--primary)]">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {[
                  { feature: 'Enterprise NVMe Storage', s: 'Included', e: 'Included' },
                  { feature: '10Gbps Network Uplink', s: 'Shared', e: 'Dedicated' },
                  { feature: 'DDoS Mitigation', s: 'Standard', e: 'Advanced L7' },
                  { feature: 'KVM Virtualization', s: 'Included', e: 'Included' },
                  { feature: 'Global Edge DNS', s: 'Included', e: 'Included' },
                  { feature: 'Dedicated Support', s: 'Community', e: '24/7/365' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors">
                    <td className="py-5 px-4 text-[var(--text-main)]">{row.feature}</td>
                    <td className="py-5 px-4 text-[var(--text-muted)]">{row.s}</td>
                    <td className="py-5 px-4 text-[var(--text-muted)]">{row.e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-5 md:px-12 bg-[var(--surface-2)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16">Common Queries</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="card p-8 bg-[var(--surface)] border border-[var(--border)]">
                <h3 className="text-lg font-black mb-3 text-[var(--primary)] flex gap-3">
                  <span className="icon">help</span> {faq.q}
                </h3>
                <p className="text-[var(--text-muted)] leading-relaxed m-0">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-5 md:px-12 text-center">
         <h2 className="text-4xl font-black mb-8">Architect Your Future Today.</h2>
         <button onClick={() => { setIsLogin(false); setShowAuth(true); }} className="btn btn-primary btn-lg px-12 py-4 shadow-2xl shadow-[var(--primary-transparent)]">
           Get Started Instantly
         </button>
      </section>
    </div>
  );
}
