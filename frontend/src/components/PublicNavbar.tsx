import { useState } from 'react';
import { useAppStore } from '../store/AppStore';

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const { theme, toggleTheme, language, toggleLanguage, setShowAuth, setIsLogin, setActiveTab, activeTab } = useAppStore();

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
    { title: language === 'en' ? 'Edge DNS' : 'এজ ডিএনএস', desc: language === 'en' ? 'Sub-ms global resolution.' : 'সাব-এমএস গ্লোবাল রেজোলিউশন।', icon: 'public' },
    { title: language === 'en' ? '1-Click Apps' : '১-ক্লিক অ্যাপস', desc: language === 'en' ? 'Deploy n8n, WP, etc.' : 'এন৮এন, ওয়ার্ডপ্রেস ডেপ্লয়।', icon: 'apps' },
  ];

  const solutionsItems = [
    { title: language === 'en' ? 'For Startups' : 'স্টার্টআপের জন্য', desc: language === 'en' ? 'Scale with zero friction.' : 'জিরো ফ্রিকশনে স্কেল করুন।', icon: 'rocket' },
    { title: language === 'en' ? 'For Enterprise' : 'এন্টারপ্রাইজের জন্য', desc: language === 'en' ? 'SLA-backed reliability.' : 'এসএলএ-সমর্থিত নির্ভরযোগ্যতা।', icon: 'business' },
    { title: language === 'en' ? 'For Developers' : 'ডেভেলপারদের জন্য', desc: language === 'en' ? 'API-first infrastructure.' : 'এপিআই-ফার্স্ট ইনফ্রাস্ট্রাকচার।', icon: 'code' },
    { title: language === 'en' ? 'For Finance' : 'ফাইন্যান্সের জন্য', desc: language === 'en' ? 'Compliant compute nodes.' : 'কমপ্লায়েন্ট কম্পিউট নোড।', icon: 'account_balance' },
  ];

  return (
    <nav className="px-5 md:px-12 py-4 md:py-5 flex justify-between items-center border-b border-[var(--border)] sticky top-0 z-[200] glass">
      {/* Left: Logo */}
      <div className="flex items-center gap-8">
        <button onClick={() => setActiveTab('home')} className="bg-transparent border-none p-0 cursor-pointer">
          <h1 className="text-2xl font-black text-[var(--primary)] m-0 tracking-tighter">TBLINC</h1>
        </button>
        
        {/* Main Navigation Links with Mega Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="relative group/mega">
            <button 
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-1.5 text-sm font-bold transition-colors py-2 ${activeTab === 'products' ? 'text-[var(--primary)]' : 'text-[var(--text-sub)] hover:text-[var(--primary)]'}`}
            >
              {t.products} <span className="icon text-lg">expand_more</span>
            </button>
            
            {/* Mega Menu Dropdown */}
            <div className="absolute top-full left-0 w-[800px] bg-[var(--surface)]/95 backdrop-blur-3xl border border-[var(--primary-transparent-border)] rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] p-10 opacity-0 invisible group-hover/mega:opacity-100 group-hover/mega:visible transition-all duration-300 translate-y-4 group-hover/mega:translate-y-0 z-[100] grid grid-cols-3 gap-10">
              {/* Column 1: Compute */}
              <div>
                <h4 className="text-[0.6rem] font-black text-[var(--primary)] uppercase tracking-[0.3em] mb-6">{computeProtocolsTitle}</h4>
                <div className="space-y-6">
                  {computeItems.map((item, i) => (
                    <button 
                      key={item.title} 
                      onClick={() => setActiveTab('products')}
                      className="w-full text-left flex items-start gap-4 group/item animate-[fade-in-up_0.5s_ease-out_forwards] opacity-0 translate-y-4 group-hover/mega:opacity-100 group-hover/mega:translate-y-0"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] group-hover/item:text-[var(--primary)] group-hover/item:border-[var(--primary-transparent-border)] transition-all">
                        <span className="icon">{item.icon}</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[var(--text-main)] group-hover/item:text-[var(--primary)] transition-colors">{item.title}</div>
                        <div className="text-[0.65rem] text-[var(--text-muted)] mt-1">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Column 2: Infrastructure */}
              <div>
                <h4 className="text-[0.6rem] font-black text-[var(--primary)] uppercase tracking-[0.3em] mb-6">{storageNetworkTitle}</h4>
                <div className="space-y-6">
                  {storageItems.map((item, i) => (
                    <button 
                      key={item.title} 
                      onClick={() => setActiveTab('products')}
                      className="w-full text-left flex items-start gap-4 group/item animate-[fade-in-up_0.5s_ease-out_forwards] opacity-0 translate-y-4 group-hover/mega:opacity-100 group-hover/mega:translate-y-0"
                      style={{ transitionDelay: `${(i + 4) * 50}ms` }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] group-hover/item:text-[var(--primary)] group-hover/item:border-[var(--primary-transparent-border)] transition-all">
                        <span className="icon">{item.icon}</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[var(--text-main)] group-hover/item:text-[var(--primary)] transition-colors">{item.title}</div>
                        <div className="text-[0.65rem] text-[var(--text-muted)] mt-1">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Column 3: Ecosystem */}
              <div>
                <h4 className="text-[0.6rem] font-black text-[var(--primary)] uppercase tracking-[0.3em] mb-6">{securityEdgeTitle}</h4>
                <div className="space-y-6">
                  {securityItems.map((item, i) => (
                    <button 
                      key={item.title} 
                      onClick={() => setActiveTab('products')}
                      className="w-full text-left flex items-start gap-4 group/item animate-[fade-in-up_0.5s_ease-out_forwards] opacity-0 translate-y-4 group-hover/mega:opacity-100 group-hover/mega:translate-y-0"
                      style={{ transitionDelay: `${(i + 8) * 50}ms` }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] group-hover/item:text-[var(--primary)] group-hover/item:border-[var(--primary-transparent-border)] transition-all">
                        <span className="icon">{item.icon}</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[var(--text-main)] group-hover/item:text-[var(--primary)] transition-colors">{item.title}</div>
                        <div className="text-[0.65rem] text-[var(--text-muted)] mt-1">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative group/sol">
            <button 
              onClick={() => setActiveTab('solutions')}
              className={`flex items-center gap-1.5 text-sm font-bold transition-colors py-2 ${activeTab === 'solutions' ? 'text-[var(--primary)]' : 'text-[var(--text-sub)] hover:text-[var(--primary)]'}`}
            >
              {t.solutions} <span className="icon text-lg">expand_more</span>
            </button>
            
            {/* Solutions Dropdown */}
            <div className="absolute top-full left-0 w-[300px] bg-[var(--surface)]/95 backdrop-blur-3xl border border-[var(--primary-transparent-border)] rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] p-6 opacity-0 invisible group-hover/sol:opacity-100 group-hover/sol:visible transition-all duration-300 translate-y-4 group-hover/sol:translate-y-0 z-[100] space-y-4">
              {solutionsItems.map((item, i) => (
                <button 
                  key={item.title} 
                  onClick={() => setActiveTab('solutions')}
                  className="w-full text-left flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--surface-2)] border border-transparent hover:border-[var(--border)] transition-all group/item animate-[fade-in-up_0.5s_ease-out_forwards] opacity-0 translate-y-2 group-hover/sol:opacity-100 group-hover/sol:translate-y-0"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center shrink-0">
                    <span className="icon">{item.icon}</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--text-main)]">{item.title}</div>
                    <div className="text-[0.6rem] text-[var(--text-muted)]">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('pricing')} 
            className={`text-sm font-bold transition-colors ${activeTab === 'pricing' ? 'text-[var(--primary)]' : 'text-[var(--text-sub)] hover:text-[var(--primary)]'}`}
          >
            {t.pricing}
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            className={`text-sm font-bold transition-colors ${activeTab === 'docs' ? 'text-[var(--primary)]' : 'text-[var(--text-sub)] hover:text-[var(--primary)]'}`}
          >
            {t.docs}
          </button>
          
          <div className="w-[1px] h-4 bg-[var(--border)] mx-2 hidden xl:block" />
          
          <button 
            onClick={() => setActiveTab('status')}
            className={`hidden xl:block text-sm font-bold transition-colors ${activeTab === 'status' ? 'text-[var(--primary)]' : 'text-[var(--text-sub)] hover:text-[var(--primary)]'}`}
          >
            {t.status}
          </button>
          <button 
            onClick={() => setActiveTab('community')}
            className={`hidden xl:block text-sm font-bold transition-colors ${activeTab === 'community' ? 'text-[var(--primary)]' : 'text-[var(--text-sub)] hover:text-[var(--primary)]'}`}
          >
            {t.community}
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button
          onClick={toggleTheme}
          className="hidden md:flex w-9 h-9 rounded-xl bg-[var(--primary-transparent)] border border-[var(--primary-transparent-border)] text-[var(--primary)] items-center justify-center hover:bg-[var(--primary-transparent-hover)] transition-colors"
        >
          <span className="icon text-lg">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        </button>

        <button
          onClick={toggleLanguage}
          className="hidden md:flex w-9 h-9 rounded-xl bg-[var(--primary-transparent)] border border-[var(--primary-transparent-border)] text-[var(--primary)] items-center justify-center hover:bg-[var(--primary-transparent-hover)] transition-colors text-xs font-black tracking-widest"
        >
          {language === 'en' ? 'BN' : 'EN'}
        </button>

        {/* Divider slit */}
        <div className="hidden md:block w-[1px] h-6 bg-[var(--border)] shrink-0" />

        <button onClick={() => { setIsLogin(true); setShowAuth(true); }} className="hidden sm:flex btn btn-ghost px-3 py-2 md:px-5 md:py-2.5">
          {t.login}
        </button>
        <button onClick={() => { setIsLogin(false); setShowAuth(true); }} className="btn btn-primary px-3 py-1.5 text-xs md:text-sm md:px-6 md:py-2.5 shadow-lg shadow-[var(--primary-transparent)] hover:-translate-y-[1px]">
          {t.signup}
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden w-9 h-9 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-main)] flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="icon">{mobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] md:top-[72px] bg-[var(--bg)] z-[150] overflow-y-auto p-5 animate-fade-in flex flex-col">
          <div className="flex-1 space-y-2">
            <div>
              <button 
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className={`w-full flex items-center justify-between p-4 rounded-xl font-bold ${activeTab === 'products' ? 'bg-[var(--primary-transparent)] text-[var(--primary)]' : 'bg-[var(--surface)] text-[var(--text-main)]'}`}
              >
                <span onClick={(e) => { e.stopPropagation(); setActiveTab('products'); setMobileMenuOpen(false); }}>{t.products}</span>
                <span className="icon">{mobileProductsOpen ? 'expand_less' : 'expand_more'}</span>
              </button>
              {mobileProductsOpen && (
                <div className="pl-4 pr-2 py-3 space-y-4">
                  <div className="text-xs font-bold text-[var(--primary)]">{computeProtocolsTitle}</div>
                  {computeItems.map(item => (
                    <button key={item.title} onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }} className="w-full text-left flex items-center gap-3">
                      <span className="icon text-sm text-[var(--text-muted)]">{item.icon}</span>
                      <span className="text-sm text-[var(--text-main)]">{item.title}</span>
                    </button>
                  ))}
                  <div className="text-xs font-bold text-[var(--primary)] mt-4">{storageNetworkTitle}</div>
                  {storageItems.map(item => (
                    <button key={item.title} onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }} className="w-full text-left flex items-center gap-3">
                      <span className="icon text-sm text-[var(--text-muted)]">{item.icon}</span>
                      <span className="text-sm text-[var(--text-main)]">{item.title}</span>
                    </button>
                  ))}
                  <div className="text-xs font-bold text-[var(--primary)] mt-4">{securityEdgeTitle}</div>
                  {securityItems.map(item => (
                    <button key={item.title} onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }} className="w-full text-left flex items-center gap-3">
                      <span className="icon text-sm text-[var(--text-muted)]">{item.icon}</span>
                      <span className="text-sm text-[var(--text-main)]">{item.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button 
                onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                className={`w-full flex items-center justify-between p-4 rounded-xl font-bold ${activeTab === 'solutions' ? 'bg-[var(--primary-transparent)] text-[var(--primary)]' : 'bg-[var(--surface)] text-[var(--text-main)]'}`}
              >
                <span onClick={(e) => { e.stopPropagation(); setActiveTab('solutions'); setMobileMenuOpen(false); }}>{t.solutions}</span>
                <span className="icon">{mobileSolutionsOpen ? 'expand_less' : 'expand_more'}</span>
              </button>
              {mobileSolutionsOpen && (
                <div className="pl-4 pr-2 py-3 space-y-4">
                  {solutionsItems.map(item => (
                    <button key={item.title} onClick={() => { setActiveTab('solutions'); setMobileMenuOpen(false); }} className="w-full text-left flex items-center gap-3">
                      <span className="icon text-sm text-[var(--text-muted)]">{item.icon}</span>
                      <span className="text-sm text-[var(--text-main)]">{item.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => { setActiveTab('pricing'); setMobileMenuOpen(false); }}
              className={`w-full text-left p-4 rounded-xl font-bold ${activeTab === 'pricing' ? 'bg-[var(--primary-transparent)] text-[var(--primary)]' : 'bg-[var(--surface)] text-[var(--text-main)]'}`}
            >
              {t.pricing}
            </button>
            <button 
              onClick={() => { setActiveTab('docs'); setMobileMenuOpen(false); }}
              className={`w-full text-left p-4 rounded-xl font-bold ${activeTab === 'docs' ? 'bg-[var(--primary-transparent)] text-[var(--primary)]' : 'bg-[var(--surface)] text-[var(--text-main)]'}`}
            >
              {t.docs}
            </button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[var(--border)] space-y-4">
            <div className="flex gap-4">
              <button onClick={toggleTheme} className="flex-1 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center gap-2">
                <span className="icon">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span> Theme
              </button>
              <button onClick={toggleLanguage} className="flex-1 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center gap-2 font-black">
                {language === 'en' ? 'BN' : 'EN'}
              </button>
            </div>
            <button onClick={() => { setMobileMenuOpen(false); setIsLogin(true); setShowAuth(true); }} className="w-full btn btn-ghost py-4 bg-[var(--surface)]">
              {t.login}
            </button>
            <button onClick={() => { setMobileMenuOpen(false); setIsLogin(false); setShowAuth(true); }} className="w-full btn btn-primary py-4">
              {t.signup}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
