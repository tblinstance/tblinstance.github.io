import { useEffect } from 'react';
import { useAppStore } from './store/AppStore';

// Components
import { GlobalModals } from './components/GlobalModals';
import { DeployModal } from './components/DeployModal';
import { MarketplacePage } from './components/MarketplacePage';
import { ServersPage } from './components/ServersPage';
import { BillingPage } from './components/BillingPage';
import { UsersPage } from './components/UsersPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminDeployPage } from './components/AdminDeployPage';
import { AdminPermissionsPage } from './components/AdminPermissionsPage';
import { AdminNetworkingPage } from './components/AdminNetworkingPage';
import { AdminStoragePage } from './components/AdminStoragePage';
import { SettingsPage } from './components/SettingsPage';
import { SystemSettingsPage } from './components/SystemSettingsPage';
import { AdminServersPage } from './components/AdminServersPage';
import { SupportChat } from './components/SupportChat';
import { StoragePage } from './components/StoragePage';
import { NetworkingPage } from './components/NetworkingPage';
import { GlobalDNSPage } from './components/GlobalDNSPage';
import { DNSZonesPage } from './components/DNSZonesPage';
import { LoadBalancersPage } from './components/LoadBalancersPage';
import { FirewallsPage } from './components/FirewallsPage';
import { SnapshotsPage } from './components/SnapshotsPage';
import { ActivityLogsPage } from './components/ActivityLogsPage';
import { BroadcastPage } from './components/BroadcastPage';
import { ApiDiagnosticsPage } from './components/ApiDiagnosticsPage';
import { InfraMapPage } from './components/InfraMapPage';
import { QuotasPage } from './components/QuotasPage';

// Views
import { LandingView } from './views/landing/LandingView';
import { ProductsView } from './views/products/ProductsView';
import { SolutionsView } from './views/solutions/SolutionsView';
import { PricingView } from './views/pricing/PricingView';
import { DocumentationView } from './views/docs/DocumentationView';
import { CommunityView } from './views/community/CommunityView';
import { StatusView } from './views/status/StatusView';
import { LoginView } from './views/login/LoginView';
import { SignupView } from './views/signup/SignupView';
import { PublicNavbar } from './components/PublicNavbar';
import { PublicFooter } from './components/PublicFooter';
import { PasswordResetConfirmView } from './views/login/PasswordResetConfirmView';

function App() {
  const store = useAppStore();
  const {
    token, showAuth, isLogin, activeTab, isStaff, selectedPlan,
    sidebarOpen, setSidebarOpen, isMobile, theme, toggleTheme,
    fetchData, fetchPublicPlans, balance, notifications,
    setNotifyOpen, setSelectedPlan, setActiveTab, handleOrder,
    depositAmount, setDepositAmount, setTransactions, handleDeposit,
    showAlert, showConfirm, showPromptUI, email, users, manualRequests,
    servers, plans, transactions, handleSyncRate
  } = store;

  useEffect(() => {
    fetchPublicPlans();
    if (token) fetchData();
  }, [token, activeTab, fetchData, fetchPublicPlans]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Auth routing
  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'TBLINC — Global Cloud | এন্টারপ্রাইজ ক্লাউড',
      products: 'Products — Compute Nodes | ইনফ্রাস্ট্রাকচার',
      solutions: 'Solutions — Enterprise | কৌশলগত সমাধান',
      pricing: 'Pricing — Financial Ledger | স্বচ্ছ মূল্য',
      docs: 'Documentation Portal | ডকুমেন্টেশন',
      community: 'Community Mesh | ডেভেলপার ইকোসিস্টেম',
      status: 'Platform Health | সিস্টেম স্ট্যাটাস',
    };
    document.title = titles[activeTab] || 'TBLINC — Cloud';
  }, [activeTab]);

  if (window.location.pathname.startsWith('/password/reset/confirm/')) {
    return (
      <>
        <GlobalModals />
        <PasswordResetConfirmView />
      </>
    );
  }

  if (!token && showAuth) {
    return (
      <>
        <GlobalModals />
        {isLogin ? <LoginView /> : <SignupView />}
      </>
    );
  }

  // Public Landing routing
  if (!token) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col">
        <GlobalModals />
        <PublicNavbar />
        <main className="flex-1">
          {activeTab === 'home' && <LandingView />}
          {activeTab === 'products' && <ProductsView />}
          {activeTab === 'solutions' && <SolutionsView />}
          {activeTab === 'pricing' && <PricingView />}
          {activeTab === 'docs' && <DocumentationView />}
          {activeTab === 'community' && <CommunityView />}
          {activeTab === 'status' && <StatusView />}
        </main>
        <PublicFooter />
      </div>
    );
  }

  // Dashboard routing
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] flex font-['Outfit']">
      <GlobalModals />

      {/* Sidebar */}
      {/* Mobile overlay backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-[2px]"
        />
      )}
      <aside className={`
        ${isMobile ? 'fixed' : 'sticky top-0'} 
        ${sidebarOpen ? 'w-[280px]' : (isMobile ? 'w-0' : 'w-[80px]')}
        h-screen z-[1000] flex flex-col bg-[var(--surface)] border-r border-[var(--border)]
        transition-[width,min-width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden shrink-0
        ${isMobile && sidebarOpen ? 'shadow-[20px_0_50px_rgba(0,0,0,0.5)]' : ''}
      `}>
        {/* Logo / close header */}
        <div className={`h-[80px] border-b border-[var(--border)] flex items-center shrink-0 overflow-hidden ${sidebarOpen ? 'justify-between px-6' : 'justify-center px-0'}`}>
          {sidebarOpen && (
            <h1 className="text-2xl font-black text-[var(--text-main)] m-0 tracking-tighter flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]">
                <span className="icon text-[var(--text-on-primary)] text-xl">shield</span>
              </div>
              TBLINC
            </h1>
          )}
          {isMobile && sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer flex items-center justify-center hover:text-[var(--text-main)] transition-colors"
            >
              <span className="icon">close</span>
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav className={`flex-1 overflow-y-auto ${sidebarOpen ? 'p-4' : 'px-2 py-4'}`}>
          <div className="space-y-1.5 mt-2">
            {sidebarOpen && isStaff && (
              <div className="px-4 mb-8">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="icon text-[var(--text-muted)] text-sm group-focus-within:text-[var(--primary)] transition-colors">search</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Global Search..."
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-[var(--text-main)] outline-none focus:border-[var(--primary-transparent-border)] focus:shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)] transition-all placeholder:opacity-30"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const query = (e.target as HTMLInputElement).value;
                        if(query) showAlert('Global Search', `Searching cross-platform entities for "${query}"...`);
                      }
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-[0.55rem] font-black text-[var(--text-muted)] opacity-30 tracking-widest border border-[var(--border)] px-1 rounded">CMD+K</span>
                  </div>
                </div>
              </div>
            )}

            <div className={`mb-2 ${sidebarOpen ? 'px-4' : 'px-0 text-center'}`}>
              {sidebarOpen && <div className="text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] mb-4">Infrastructure</div>}
              {[
                { id: 'home', icon: 'storefront', label: 'Marketplace' },
                { id: 'servers', icon: 'dns', label: 'Cloud Servers' },
                { id: 'storage', icon: 'storage', label: 'Block Storage' },
                { id: 'object_storage', icon: 'cloud_circle', label: 'Object Storage (S3)' },
                { id: 'networking', icon: 'lan', label: 'Private Network' },
                { id: 'vpc_network', icon: 'hub', label: 'VPC Network' },
                { id: 'load_balancers', icon: 'alt_route', label: 'Load Balancers' },
                { id: 'firewalls', icon: 'shield', label: 'Firewalls' },
                { id: 'dns_management', icon: 'public', label: 'Global DNS' },
                { id: 'dns_zones', icon: 'language', label: 'DNS Zones' },
                { id: 'snapshots', icon: 'camera', label: 'Snapshots' },
                { id: 'activity_logs', icon: 'history_edu', label: 'Activity Logs' },
                { id: 'billing', icon: 'account_balance_wallet', label: 'Financial Billing' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); if (isMobile) setSidebarOpen(false); }}
                  className={`
                    w-full flex items-center gap-4 py-4 rounded-2xl transition-all relative group/nav mb-1
                    ${activeTab === item.id
                      ? 'bg-[var(--primary-transparent)] text-[var(--primary)] border border-[var(--primary-transparent-border)] shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]'
                      : 'text-[var(--text-sub)] hover:bg-[var(--primary-transparent)] hover:text-[var(--primary)] border border-transparent'}
                    ${sidebarOpen ? 'px-4' : 'justify-center px-0'}
                  `}
                >
                  <span className={`icon text-2xl transition-transform group-hover/nav:scale-110 ${activeTab === item.id ? 'text-[var(--primary)]' : ''}`}>
                    {item.icon}
                  </span>
                  {sidebarOpen && (
                    <span className="text-[0.85rem] font-semibold tracking-tight whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {isStaff && (
              <div className={`mt-8 ${sidebarOpen ? 'px-4' : 'px-0 text-center'}`}>
                {sidebarOpen && <div className="text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] mb-4">Advanced Server Control</div>}
                {[
                  { id: 'admin_dashboard', icon: 'monitoring', label: 'Dashboard' },
                  { id: 'admin_permissions', icon: 'admin_panel_settings', label: 'Governance' },
                  { id: 'admin_deploy', icon: 'cloud_upload', label: 'Direct Deploy' },
                  { id: 'admin_networking', icon: 'lan', label: 'Net Provisioning' },
                  { id: 'admin_storage', icon: 'storage', label: 'Disk Provisioning' },
                  { id: 'admin_servers', icon: 'lan', label: 'All Servers' },
                  { id: 'users', icon: 'manage_accounts', label: 'Users' },
                  { id: 'support_center', icon: 'support_agent', label: 'Support Center' },
                  { id: 'broadcast', icon: 'campaign', label: 'Global Broadcast' },
                  { id: 'infra_map', icon: 'public', label: 'Infrastructure Map' },
                  { id: 'quotas', icon: 'leaderboard', label: 'Resource Quotas' },
                  { id: 'api_diagnostics', icon: 'settings_input_component', label: 'API Diagnostics' },
                  { id: 'system_settings', icon: 'settings_applications', label: 'Direct Access' },
                  { id: 'activity_logs', icon: 'history_edu', label: 'Audit Ledger' },
                  { id: 'django_admin', icon: 'admin_panel_settings', label: 'Django Core' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { 
                      if(item.id === 'django_admin') {
                        window.open((import.meta.env.VITE_API_BASE || '').replace('/api', '') + '/admin/', '_blank');
                        return;
                      }
                      if(item.id === 'support_center') {
                        store.setAdminChatTargetId(-1);
                        return;
                      }
                      setActiveTab(item.id); 
                      if (isMobile) setSidebarOpen(false); 
                    }}
                    className={`
                      w-full flex items-center gap-4 py-4 rounded-2xl transition-all relative group/nav mb-1
                      ${activeTab === item.id
                        ? 'bg-[var(--primary-transparent)] text-[var(--primary)] border border-[var(--primary-transparent-border)] shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]'
                        : 'text-[var(--text-sub)] hover:bg-[var(--primary-transparent)] hover:text-[var(--primary)] border border-transparent'}
                      ${sidebarOpen ? 'px-4' : 'justify-center px-0'}
                    `}
                  >
                    <span className={`icon text-2xl transition-transform group-hover/nav:scale-110 ${activeTab === item.id ? 'text-[var(--primary)]' : ''}`}>
                      {item.icon}
                    </span>
                    {sidebarOpen && (
                      <span className="text-[0.85rem] font-semibold tracking-tight whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {sidebarOpen && <div className="px-4 mt-6 mb-2 text-[0.6rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-50">Personal</div>}
          {[
            { id: 'settings', icon: 'settings', label: 'Settings' },
          ].map(item => (
            <button
              key={item.id}
              title={!sidebarOpen ? item.label : undefined}
              onClick={() => { setActiveTab(item.id); if (isMobile) setSidebarOpen(false); }}
              className={`
                w-full flex items-center gap-4 py-4 rounded-2xl transition-all relative group/nav mb-1
                ${activeTab === item.id
                  ? 'bg-[var(--primary-transparent)] text-[var(--primary)] border border-[var(--primary-transparent-border)] shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]'
                  : 'text-[var(--text-sub)] hover:bg-[var(--primary-transparent)] hover:text-[var(--primary)] border border-transparent'}
                ${sidebarOpen ? 'px-4' : 'justify-center px-0'}
              `}
            >
              <span className={`icon text-2xl transition-transform group-hover/nav:scale-110 ${activeTab === item.id ? 'text-[var(--primary)]' : ''}`}>{item.icon}</span>
              {sidebarOpen && <span className="text-[0.85rem] font-semibold tracking-tight whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer: Profile + Logout */}
        <div className={`border-t border-[var(--border)] shrink-0 ${sidebarOpen ? 'p-4' : 'px-2 py-4'}`}>
          {sidebarOpen ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 mb-8">
                {store.profile_image ? (
                  <img src={store.profile_image} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-[var(--border)]" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center font-bold text-sm border border-[var(--primary-transparent)]">
                    {email.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[0.6rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">Logged in as</span>
                  <span className="text-sm font-black text-[var(--text-main)] truncate" title={email}>{email}</span>
                </div>
              </div>
              <button
                onClick={store.logout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--danger-transparent-border)] bg-[var(--danger-transparent)] text-[var(--danger)] font-bold cursor-pointer hover:bg-[var(--danger)] hover:text-[var(--text-on-danger)] transition-all"
              >
                <span className="icon text-[1.1rem]">logout</span>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex justify-center" title={email}>
                {store.profile_image ? (
                  <img src={store.profile_image} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-[var(--border)]" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[var(--primary-transparent)] text-[var(--primary)] flex items-center justify-center font-bold text-sm border border-[var(--primary-transparent)]">
                    {email.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button
                onClick={store.logout}
                title="Logout"
                className="w-full flex items-center justify-center py-3 rounded-xl border border-[var(--danger-transparent-border)] bg-[var(--danger-transparent)] text-[var(--danger)] cursor-pointer hover:bg-[var(--danger)] hover:text-[var(--text-on-danger)] transition-all"
              >
                <span className="icon text-[1.2rem]">logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-x-hidden">
        <header className="h-[72px] px-5 md:px-8 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface)] sticky top-0 z-[100] gap-4 transition-colors duration-300">
          {/* Left: Sidebar toggle + status */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-10 h-10 bg-[var(--bg)] border border-[var(--border)] rounded-xl cursor-pointer text-[var(--text-main)] flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
            >
              <span className="icon">{sidebarOpen ? 'menu_open' : 'menu'}</span>
            </button>
          </div>

          {/* Center: Search bar */}
          {!isMobile && (
            <div className="flex-1 max-w-md relative group">
              <span className="icon absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-[1.1rem] pointer-events-none group-focus-within:text-[var(--primary)] transition-colors">search</span>
              <input
                type="text"
                placeholder="Search servers, plans, users..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text-main)] text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-transparent)] font-['Outfit']"
              />
            </div>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 lg:gap-4 shrink-0">
            {/* Navbar Credits Widget */}
            <button
              onClick={() => setActiveTab('billing')}
              className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors group cursor-pointer"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary-transparent)] text-[var(--primary)] group-hover:scale-110 transition-transform">
                <span className="icon text-sm">account_balance_wallet</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[0.55rem] font-black text-[var(--text-muted)] uppercase tracking-widest leading-none mb-1">Credits</span>
                <div className="flex items-end gap-2 leading-none">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-sm font-black text-[var(--text-main)] tracking-tight leading-none">{balance}</span>
                    <span className="text-[0.6rem] font-bold text-[var(--primary)] leading-none">BDT</span>
                  </div>
                  <div className="flex items-baseline gap-0.5 opacity-60">
                    <span className="text-xs font-bold text-[var(--text-main)] leading-none">${store.balanceUsd}</span>
                    <span className="text-[0.55rem] font-bold text-[var(--text-muted)] leading-none">USD</span>
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setNotifyOpen(true)}
              className="relative w-10 h-10 bg-[var(--surface)] border border-[var(--border)] rounded-xl cursor-pointer text-[var(--text-main)] flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
            >
              <span className="icon text-[1.3rem]">notifications</span>
              {(() => {
                const unreadNotifs = notifications.filter((n: any) => !n.is_read).length;
                const total = unreadNotifs + store.unreadChatCount;
                if (total === 0) return null;
                return (
                  <span className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-[var(--danger)] text-[var(--text-on-danger)] text-[0.6rem] font-black rounded-full border-2 border-[var(--surface)] flex items-center justify-center px-1 animate-bounce shadow-lg">
                    {total > 99 ? '99+' : total}
                  </span>
                );
              })()}
            </button>
            <button
              onClick={toggleTheme}
              className="w-10 h-10 bg-[var(--surface)] border border-[var(--border)] rounded-xl cursor-pointer text-[var(--primary)] flex items-center justify-center hover:bg-[var(--primary-transparent)] transition-all"
            >
              <span className="icon">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            </button>
          </div>
        </header>

        <main className={`flex-1 ${isMobile ? 'p-5 pb-32' : 'p-8 lg:p-12 pb-32'} animate-fade-in relative`}>
          {/* Floating Chat Button for Customers */}
          {!isStaff && token && (
            <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
              {store.chatOpen && (
                <div className="w-[350px] h-[500px] mb-2 animate-slide-up">
                  <SupportChat
                    token={token}
                    currentUserEmail={email}
                    onClose={() => store.setChatOpen(false)}
                  />
                </div>
              )}
              <button
                onClick={() => {
                  const opening = !store.chatOpen;
                  store.setChatOpen(opening);
                  if (opening) store.setUnreadChatCount(0); // clear badge instantly
                }}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 ${store.chatOpen ? 'bg-[var(--danger)] rotate-90' : 'bg-[var(--primary)]'}`}
              >
                <span className="icon text-[var(--text-on-primary)] text-3xl">{store.chatOpen ? 'close' : 'chat'}</span>
                {!store.chatOpen && store.unreadChatCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--danger)] text-[var(--text-on-danger)] text-[0.65rem] font-black w-6 h-6 rounded-full border-2 border-[var(--surface)] flex items-center justify-center animate-bounce shadow-lg">
                    {store.unreadChatCount}
                  </span>
                )}
              </button>
            </div>
          )}
          {selectedPlan && (
            <DeployModal
              selectedPlan={selectedPlan}
              customName={store.customName} setCustomName={store.setCustomName}
              customRootPass={store.customRootPass} setCustomRootPass={store.setCustomRootPass}
              selectedRegion={store.selectedRegion} setSelectedRegion={store.setSelectedRegion}
              selectedImage={store.selectedImage} setSelectedImage={store.setSelectedImage}
              loading={store.loading}
              onConfirm={handleOrder}
              onCancel={() => setSelectedPlan(null)}
            />
          )}

          {activeTab === 'home' && <MarketplacePage plans={plans} onSelect={setSelectedPlan} exchangeRate={store.exchangeRate} />}
          {activeTab === 'servers' && <ServersPage servers={servers} token={token} fetchData={fetchData} showAlert={showAlert} showConfirm={showConfirm} onNewServer={() => setActiveTab('home')} />}
          {activeTab === 'storage' && <StoragePage />}
          {activeTab === 'object_storage' && <StoragePage />}
          {activeTab === 'networking' && <NetworkingPage />}
          {activeTab === 'vpc_network' && <NetworkingPage />}
          {activeTab === 'dns_management' && <GlobalDNSPage />}
          {activeTab === 'dns_zones' && <DNSZonesPage />}
          {activeTab === 'load_balancers' && <LoadBalancersPage />}
          {activeTab === 'firewalls' && <FirewallsPage />}
          {activeTab === 'snapshots' && <SnapshotsPage />}
          {activeTab === 'activity_logs' && <ActivityLogsPage />}
          {activeTab === 'billing' && <BillingPage balance={balance} balanceUsd={store.balanceUsd} exchangeRate={store.exchangeRate} transactions={transactions} depositAmount={depositAmount} setDepositAmount={setDepositAmount} setTransactions={setTransactions} token={token} email={email} profile_image={store.profile_image} showAlert={showAlert} showConfirm={showConfirm} onDeposit={handleDeposit} isStaff={isStaff} onSyncRate={handleSyncRate} />}
          {activeTab === 'admin_dashboard' && isStaff && (
            <AdminDashboard
              token={token}
              fetchData={fetchData}
              showAlert={showAlert}
              manualRequests={manualRequests}
              users={users}
              stats={store.adminStats}
              showPromptUI={showPromptUI}
            />
          )}
          {activeTab === 'admin_permissions' && isStaff && (
            <AdminPermissionsPage 
              token={token} 
              users={users} 
              fetchData={fetchData} 
              showAlert={showAlert} 
            />
          )}
          {activeTab === 'admin_deploy' && isStaff && (
            <AdminDeployPage 
              token={token} 
              users={users} 
              plans={plans} 
              showAlert={showAlert} 
              fetchData={fetchData} 
            />
          )}
          {activeTab === 'admin_networking' && isStaff && (
            <AdminNetworkingPage 
              token={token} 
              users={users} 
              showAlert={showAlert} 
            />
          )}
          {activeTab === 'admin_storage' && isStaff && (
            <AdminStoragePage 
              token={token} 
              users={users} 
              showAlert={showAlert} 
            />
          )}
          {activeTab === 'users' && isStaff && <UsersPage users={users} manualRequests={manualRequests} token={token} fetchData={fetchData} showAlert={showAlert} showConfirm={showConfirm} showPromptUI={showPromptUI} />}
          {activeTab === 'admin_servers' && isStaff && <AdminServersPage token={token} showAlert={showAlert} showConfirm={showConfirm} showPromptUI={showPromptUI} />}
          {activeTab === 'broadcast' && isStaff && <BroadcastPage token={token} showAlert={showAlert} />}
          {activeTab === 'api_diagnostics' && isStaff && <ApiDiagnosticsPage token={token} />}
          {activeTab === 'infra_map' && isStaff && <InfraMapPage stats={store.adminStats} />}
          {activeTab === 'quotas' && isStaff && <QuotasPage />}
          {activeTab === 'system_settings' && isStaff && <SystemSettingsPage token={token} showAlert={showAlert} />}
          {activeTab === 'settings' && <SettingsPage email={email} isStaff={isStaff} profile_image={store.profile_image} two_factor_enabled={store.two_factor_enabled} exchangeRate={store.exchangeRate} onSyncRate={handleSyncRate} showConfirm={showConfirm} onImageUpload={store.uploadImage} generate2FA={store.generate2FA} enable2FA={store.enable2FA} disable2FA={store.disable2FA} />}
        </main>

        {/* Mobile Bottom Tab Bar */}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[500px] h-20 bg-[var(--surface)]/80 backdrop-blur-2xl border border-[var(--primary-transparent-border)] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[100] flex items-center justify-around px-6 md:h-22">
          {[
            { id: 'home', icon: 'storefront', label: 'Market' },
            { id: 'servers', icon: 'dns', label: 'Servers' },
            { id: 'billing', icon: 'account_balance_wallet', label: 'Billing' },
            { id: 'settings', icon: 'settings', label: 'Profile' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative group ${activeTab === item.id ? 'text-[var(--primary)] scale-110' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${activeTab === item.id ? 'bg-[var(--primary-transparent)] shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]' : 'bg-transparent'
                }`}>
                <span className="icon text-2xl">{item.icon}</span>
              </div>
              <span className={`text-[0.6rem] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === item.id ? 'opacity-100' : 'opacity-0'
                }`}>
                {item.label}
              </span>
              {activeTab === item.id && (
                <div className="absolute -bottom-2 w-1.5 h-1.5 bg-[var(--primary)] rounded-full shadow-[0_0_10px_var(--primary)] animate-pulse" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default App;
