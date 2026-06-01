import { useState } from 'react';
import { useAppStore } from '../store/AppStore';

export function PublicSidebar() {
  const { publicSidebarOpen, setPublicSidebarOpen, activeTab, setActiveTab, language, toggleLanguage, theme, toggleTheme, setIsLogin, setShowAuth } = useAppStore();
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);

  const t = {
    products: language === 'en' ? 'Products' : 'প্রোডাক্টস',
    solutions: language === 'en' ? 'Solutions' : 'সলিউশনস',
    pricing: language === 'en' ? 'Pricing' : 'প্রাইসিং',
    docs: language === 'en' ? 'Documentation' : 'ডকুমেন্টেশন',
    status: language === 'en' ? 'Status' : 'স্ট্যাটাস',
    community: language === 'en' ? 'Community' : 'কমিউনিটি',
    login: language === 'en' ? 'Login' : 'লগইন',
    signup: language === 'en' ? 'Sign Up' : 'সাইন আপ',
  };

  const computeProtocolsTitle = language === 'en' ? 'Compute Protocols' : 'কম্পিউট প্রোটোকল';
  const computeItems = [
    { title: language === 'en' ? 'Standard VPS' : 'স্ট্যান্ডার্ড ভিপিএস', desc: language === 'en' ? 'Enterprise NVMe instances.' : 'এন্টারপ্রাইজ এনভিএমই ইনস্ট্যান্স।', icon: 'dns' },
    { title: language === 'en' ? 'Dedicated CPU' : 'ডেডিকেটেড সিপিইউ', desc: language === 'en' ? 'No noisy neighbors.' : 'নয়েজ-ফ্রি, সম্পূর্ণ নিজস্ব।', icon: 'bolt' },
    { title: language === 'en' ? 'High RAM Nodes' : 'হাই র‍্যাম নোড', desc: language === 'en' ? 'For heavy databases.' : 'ভারী ডাটাবেসের জন্য।', icon: 'memory' },
    { title: language === 'en' ? 'GPU Instances' : 'জিপিইউ ইনস্ট্যান্স', desc: language === 'en' ? 'AI & ML workloads.' : 'এআই এবং এমএল কাজের জন্য।', icon: 'developer_board' },
  ];

  const storageNetworkTitle = language === 'en' ? 'Storage & Network' : 'স্টোরেজ ও নেটওয়ার্ক';
  const storageItems = [
    { title: language === 'en' ? 'Block Storage' : 'ব্লক স্টোরেজ', desc: language === 'en' ? 'Scalable NVMe volumes.' : 'স্কেলেবল এনভিএমই ভলিউম।', icon: 'storage' },
    { title: language === 'en' ? 'Object Storage' : 'অবজেক্ট স্টোরেজ', desc: language === 'en' ? 'S3-compatible storage.' : 'এসথ্রি-সামঞ্জস্যপূর্ণ স্টোরেজ।', icon: 'cloud_upload' },
    { title: language === 'en' ? 'Private Network' : 'প্রাইভেট নেটওয়ার্ক', desc: language === 'en' ? 'Secure VPC isolation.' : 'নিরাপদ ভিপিসি আইসোলেশন।', icon: 'lan' },
    { title: language === 'en' ? 'Load Balancers' : 'লোড ব্যালেন্সার', desc: language === 'en' ? 'High availability entry.' : 'উচ্চ প্রাপ্যতার এন্ট্রি।', icon: 'alt_route' },
  ];

  const securityEdgeTitle = language === 'en' ? 'Security & Edge' : 'নিরাপত্তা ও এজ';
  const securityItems = [
    { title: language === 'en' ? 'Managed DB' : 'ম্যানেজড ডিবি', desc: language === 'en' ? 'MySQL, Redis & more.' : 'মাইএসকিউএল, রেডিস এবং আরও।', icon: 'database' },
    { title: language === 'en' ? 'DDoS Shield' : 'ডিডস শিল্ড', desc: language === 'en' ? 'Elite L7 protection.' : 'এলিট এল৭ প্রটেকশন।', icon: 'security' },
    { title: language === 'en' ? 'Edge DNS' : 'এজ ডিএনএস', desc: language === 'en' ? 'Sub-ms global resolution.' : 'সাব-এমএস global রেজোলিউশন।', icon: 'public' },
    { title: language === 'en' ? '1-Click Apps' : '১-ক্লিক অ্যাপস', desc: language === 'en' ? 'Deploy n8n, WP, etc.' : 'এন৮এন, ওয়ার্ডপ্রেস ডেপ্লয়।', icon: 'apps' },
  ];

  const solutionsItems = [
    { title: language === 'en' ? 'For Startups' : 'স্টার্টআপের জন্য', desc: language === 'en' ? 'Scale with zero friction.' : 'জিরো ফ্রিকশনে স্কেল করুন।', icon: 'rocket' },
    { title: language === 'en' ? 'For Enterprise' : 'এন্টারপ্রাইজের জন্য', desc: language === 'en' ? 'SLA-backed reliability.' : 'এসএলএ-সমর্থিত নির্ভরযোগ্যতা।', icon: 'business' },
    { title: language === 'en' ? 'For Developers' : 'ডেভেলপারদের জন্য', desc: language === 'en' ? 'API-first infrastructure.' : 'এপিআই-ফার্স্ট ইনফ্রাস্ট্রাকচার।', icon: 'code' },
    { title: language === 'en' ? 'For Finance' : 'ফাইন্যান্সের জন্য', desc: language === 'en' ? 'Compliant compute nodes.' : 'কমপ্লায়েন্ট কম্পিউট নোড।', icon: 'account_balance' },
  ];

  return (
    <>
      {/* Backdrop */}
      {publicSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[250] lg:hidden"
          onClick={() => setPublicSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 w-[300px] max-w-[85vw] bg-[var(--surface)] border-r border-[var(--border)]
        z-[300] transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col
        ${publicSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="h-[72px] px-5 flex items-center justify-between border-b border-[var(--border)] shrink-0">
          <h1 className="text-xl font-black text-[var(--primary)] m-0 tracking-tighter">TBLINC</h1>
          <button 
            onClick={() => setPublicSidebarOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <span className="icon">close</span>
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-5 pb-32">
          <div className="space-y-2">
            <div>
              <button 
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className={`w-full flex items-center justify-between p-4 rounded-xl font-bold ${activeTab === 'products' ? 'bg-[var(--primary-transparent)] text-[var(--primary)]' : 'bg-[var(--surface-2)] text-[var(--text-main)] hover:bg-[var(--bg)]'}`}
              >
                <span onClick={(e) => { e.stopPropagation(); setActiveTab('products'); setPublicSidebarOpen(false); }}>{t.products}</span>
                <span className="icon">{mobileProductsOpen ? 'expand_less' : 'expand_more'}</span>
              </button>
              {mobileProductsOpen && (
                <div className="pl-4 pr-2 py-3 space-y-4">
                  <div className="text-[0.65rem] font-bold text-[var(--primary)] uppercase tracking-wider">{computeProtocolsTitle}</div>
                  {computeItems.map(item => (
                    <button key={item.title} onClick={() => { setActiveTab('products'); setPublicSidebarOpen(false); }} className="w-full text-left flex items-center gap-3 group">
                      <span className="icon text-sm text-[var(--text-muted)] group-hover:text-[var(--primary)]">{item.icon}</span>
                      <span className="text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--primary)]">{item.title}</span>
                    </button>
                  ))}
                  <div className="text-[0.65rem] font-bold text-[var(--primary)] uppercase tracking-wider mt-5">{storageNetworkTitle}</div>
                  {storageItems.map(item => (
                    <button key={item.title} onClick={() => { setActiveTab('products'); setPublicSidebarOpen(false); }} className="w-full text-left flex items-center gap-3 group">
                      <span className="icon text-sm text-[var(--text-muted)] group-hover:text-[var(--primary)]">{item.icon}</span>
                      <span className="text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--primary)]">{item.title}</span>
                    </button>
                  ))}
                  <div className="text-[0.65rem] font-bold text-[var(--primary)] uppercase tracking-wider mt-5">{securityEdgeTitle}</div>
                  {securityItems.map(item => (
                    <button key={item.title} onClick={() => { setActiveTab('products'); setPublicSidebarOpen(false); }} className="w-full text-left flex items-center gap-3 group">
                      <span className="icon text-sm text-[var(--text-muted)] group-hover:text-[var(--primary)]">{item.icon}</span>
                      <span className="text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--primary)]">{item.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button 
                onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                className={`w-full flex items-center justify-between p-4 rounded-xl font-bold ${activeTab === 'solutions' ? 'bg-[var(--primary-transparent)] text-[var(--primary)]' : 'bg-[var(--surface-2)] text-[var(--text-main)] hover:bg-[var(--bg)]'}`}
              >
                <span onClick={(e) => { e.stopPropagation(); setActiveTab('solutions'); setPublicSidebarOpen(false); }}>{t.solutions}</span>
                <span className="icon">{mobileSolutionsOpen ? 'expand_less' : 'expand_more'}</span>
              </button>
              {mobileSolutionsOpen && (
                <div className="pl-4 pr-2 py-3 space-y-4">
                  {solutionsItems.map(item => (
                    <button key={item.title} onClick={() => { setActiveTab('solutions'); setPublicSidebarOpen(false); }} className="w-full text-left flex items-center gap-3 group">
                      <span className="icon text-sm text-[var(--text-muted)] group-hover:text-[var(--primary)]">{item.icon}</span>
                      <span className="text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--primary)]">{item.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => { setActiveTab('pricing'); setPublicSidebarOpen(false); }}
              className={`w-full text-left p-4 rounded-xl font-bold ${activeTab === 'pricing' ? 'bg-[var(--primary-transparent)] text-[var(--primary)]' : 'bg-[var(--surface-2)] text-[var(--text-main)] hover:bg-[var(--bg)]'}`}
            >
              {t.pricing}
            </button>
            <button 
              onClick={() => { setActiveTab('docs'); setPublicSidebarOpen(false); }}
              className={`w-full text-left p-4 rounded-xl font-bold ${activeTab === 'docs' ? 'bg-[var(--primary-transparent)] text-[var(--primary)]' : 'bg-[var(--surface-2)] text-[var(--text-main)] hover:bg-[var(--bg)]'}`}
            >
              {t.docs}
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-[var(--border)] space-y-4">
            <div className="flex gap-4">
              <button onClick={toggleTheme} className="flex-1 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center gap-2 hover:border-[var(--primary)] transition-colors">
                <span className="icon">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span> Theme
              </button>
              <button onClick={toggleLanguage} className="flex-1 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center gap-2 font-black tracking-widest hover:border-[var(--primary)] transition-colors">
                {language === 'en' ? 'BN' : 'EN'}
              </button>
            </div>
            <button onClick={() => { setPublicSidebarOpen(false); setIsLogin(true); setShowAuth(true); }} className="w-full btn btn-ghost py-4 bg-[var(--surface-2)] border border-[var(--border)]">
              {t.login}
            </button>
            <button onClick={() => { setPublicSidebarOpen(false); setIsLogin(false); setShowAuth(true); }} className="w-full btn btn-primary py-4">
              {t.signup}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
