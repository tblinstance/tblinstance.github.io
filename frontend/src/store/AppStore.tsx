import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import type { AppState, ModalConfig, PromptConfig, Plan } from './types';

const API_BASE = import.meta.env.VITE_API_BASE;
const AUTH_BASE = import.meta.env.VITE_AUTH_BASE;


// ─── Context ─────────────────────────────────────────────────────────────────
const AppContext = createContext<AppState | null>(null);

export const useAppStore = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [email, setEmail] = useState('');
  const [isStaff, setIsStaff] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [profile_image, setProfileImage] = useState<string | null>(null);
  const [two_factor_enabled, setTwoFactorEnabled] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(120);

  // UI
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);

  // Auth flow
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Data
  const [balance, setBalance] = useState(0);
  const [servers, setServers] = useState<any[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [manualRequests, setManualRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [unapprovedUsers, setUnapprovedUsers] = useState<any[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [adminChatTargetId, setAdminChatTargetId] = useState<number | null>(null);
  const [status, setStatus] = useState('idle');

  // Deploy Form
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('eu-central-1');
  const [selectedImage, setSelectedImage] = useState('ubuntu-22.04');
  const [customName, setCustomName] = useState('');
  const [customRootPass, setCustomRootPass] = useState('');

  // Deposit Form
  const [depositAmount, setDepositAmount] = useState('');

  // Modals
  const [modalConfig, setModalConfig] = useState<ModalConfig>({ isOpen: false, type: 'alert', isDanger: false, title: '', message: '' });
  const [promptConfig, setPromptConfig] = useState<PromptConfig | null>(null);
  const [notifyOpen, setNotifyOpen] = useState(false);

  // Listen for resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const showAlert = useCallback((title: string, message: string) => {
    setModalConfig({ isOpen: true, type: 'alert', title, message });
  }, []);

  const showConfirm = useCallback((title: string, message: string, onConfirm: () => void, isDanger: boolean = false) => {
    setModalConfig({ isOpen: true, type: 'confirm', isDanger, title, message, onConfirm });
  }, []);

  const showPromptUI = useCallback((title: string, onPrompt: (val: string) => void) => {
    setPromptConfig({ isOpen: true, title, onConfirm: onPrompt });
  }, []);

  // ── Core Fetch ────────────────────────────────────────────────────────────
  const fetchPublicPlans = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/plans/`);
      setPlans(res.data);
    } catch (e) { console.error('Failed to fetch public plans', e); }
  }, []);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [userInfoRes, serversRes, txsRes, notifsRes, chatsRes] = await Promise.all([
        axios.get(`${API_BASE}/user-info/`, config),
        axios.get(`${API_BASE}/servers/`, config),
        axios.get(`${API_BASE}/transactions/`, config),
        axios.get(`${API_BASE}/notifications/`, config),
        axios.get(`${API_BASE}/chat/list/`, config),
      ]);

      setBalance(parseFloat(userInfoRes.data.balance));
      setServers(serversRes.data);
      setTransactions(txsRes.data);
      setNotifications(notifsRes.data);

      setEmail(userInfoRes.data.email);
      let pImg = userInfoRes.data.profile_image;
      if (pImg && pImg.startsWith('/')) {
        const base = (import.meta.env.VITE_API_BASE || '').replace('/api', '');
        pImg = `${base}${pImg}`;
      }
      setProfileImage(pImg);
      setTwoFactorEnabled(userInfoRes.data.two_factor_enabled);
      setIsStaff(userInfoRes.data.is_staff);
      setIsSuperuser(userInfoRes.data.is_superuser);

      // Chat unread count
      if (userInfoRes.data.is_staff) {
        try {
          const adminChatsRes = await axios.get(`${API_BASE}/admin/chats/`, config);
          const adminUnread = adminChatsRes.data.reduce((sum: number, c: any) => sum + (c.unread_count || 0), 0);
          setUnreadChatCount(adminUnread);
        } catch (e) {}
      } else {
        const unreadCount = chatsRes.data.filter((m: any) => !m.is_read && m.sender_id !== userInfoRes.data.id).length;
        setUnreadChatCount(unreadCount);
      }


      try {
        const settingsRes = await axios.get(`${API_BASE}/settings/`);
        if (settingsRes.data.bdt_usd_rate) {
          setExchangeRate(parseFloat(settingsRes.data.bdt_usd_rate));
        }
      } catch (e) { console.error("Failed to fetch settings", e); }

if (userInfoRes.data.is_staff && (activeTab === 'users' || activeTab === 'admin_dashboard' || activeTab === 'admin_servers')) {
        const [uRes, mRes, sRes, statsRes] = await Promise.all([
          axios.get(`${API_BASE}/admin/users/`, config),
          axios.get(`${API_BASE}/admin/manual-requests/`, config),
          axios.get(`${API_BASE}/admin/all-servers/`, config),
          axios.get(`${API_BASE}/admin/stats/`, config),
        ]);
        setUsers(uRes.data);
        setAdminStats(statsRes.data);
        try {
          const unRes = await axios.get(`${API_BASE}/admin/unapproved-users/`, config);
          setUnapprovedUsers(unRes.data);
        } catch {}
        setServers(sRes.data); // Admins see all servers
        // Normalize Django's user__email double-underscore to user_email
        setManualRequests(mRes.data.map((r: any) => ({
          ...r,
          user_email: r.user__email || r.user_email || r.user
        })));
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) logout();
    } finally { setLoading(false); }
  }, [token, activeTab]);

  // ── Auth & Profile ────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setToken(null);
    setBalance(0);
    setServers([]);
    setTransactions([]);
    setUsers([]);
    setManualRequests([]);
    setUnapprovedUsers([]);
    setActiveTab('home');
    setShowAuth(false);
  }, []);

  const login = useCallback(async (em: string, pw: string, otp?: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${AUTH_BASE}/jwt/create/`, { email: em, username: em, password: pw, otp_code: otp });
      if (res.data.two_factor_required) {
        return { two_factor_required: true };
      }
      localStorage.setItem('access_token', res.data.access);
      setToken(res.data.access);
      setShowAuth(false);
      return { success: true };
    } catch (err: any) {
      if (err.response?.status === 403) {
        showAlert('Account Pending Approval', err.response?.data?.detail || 'Your account is verified but awaiting administrative approval.');
      } else {
        showAlert('Error', err.response?.data?.error || 'Invalid credentials');
      }
      return { error: true };
    } finally { setLoading(false); }
  }, [showAlert]);

  const register = useCallback(async (em: string, pw: string, first_name: string, last_name: string, phone_number: string, address: string, country: string) => {
    setLoading(true);
    try {
      console.log("Registering user:", { email: em });
      const res = await axios.post(`${AUTH_BASE}/users/`, { 
        email: em, 
        username: em, 
        password: pw, 
        re_password: pw,
        first_name,
        last_name,
        phone_number,
        address,
        country
      });
      console.log("Registration success:", res.data);
      showAlert('Success', 'Account created successfully! Please sign in.');
      setIsLogin(true);
    } catch (err: any) {
      console.error("Registration error details:", err.response?.data);
      const msg = err.response?.data ? Object.values(err.response.data).flat().join(' ') : 'Registration failed';
      showAlert('Error', msg);
    } finally { setLoading(false); }
  }, [showAlert, setIsLogin]);

  const uploadImage = useCallback(async (file: File) => {
    if (!token) return;
    const formData = new FormData();
    formData.append('image', file);
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/profile/upload-image/`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      showAlert('Success', 'Profile image updated successfully!');
      fetchData();
      return res.data.profile_image;
    } catch {
      showAlert('Error', 'Failed to upload image.');
    } finally {
      setLoading(false);
    }
  }, [token, showAlert, fetchData]);

  const deleteAccount = useCallback(async (password: string) => {
    if (!token) return;
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/account/delete/`, { password }, { headers: { Authorization: `Bearer ${token}` } });
      showAlert('Account Deleted', 'Your account and all data has been permanently deleted.');
      logout();
    } catch (err: any) {
      showAlert('Error', err.response?.data?.error || 'Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token, showAlert, logout]);

  const generate2FA = useCallback(async () => {
    if (!token) return null;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/2fa/generate/`, {}, { headers: { Authorization: `Bearer ${token}` } });
      return res.data;
    } catch {
      showAlert('Error', 'Failed to generate 2FA secret.');
      return null;
    } finally { setLoading(false); }
  }, [token, showAlert]);

  const enable2FA = useCallback(async (otp: string) => {
    if (!token) return false;
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/2fa/enable/`, { otp_code: otp }, { headers: { Authorization: `Bearer ${token}` } });
      showAlert('Success', 'Two-Factor Authentication enabled!');
      fetchData();
      return true;
    } catch (err: any) {
      showAlert('Error', err.response?.data?.error || 'Failed to enable 2FA');
      return false;
    } finally { setLoading(false); }
  }, [token, showAlert, fetchData]);

  const disable2FA = useCallback(async (otp: string) => {
    if (!token) return false;
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/2fa/disable/`, { otp_code: otp }, { headers: { Authorization: `Bearer ${token}` } });
      showAlert('Success', 'Two-Factor Authentication disabled.');
      fetchData();
      return true;
    } catch (err: any) {
      showAlert('Error', err.response?.data?.error || 'Failed to disable 2FA');
      return false;
    } finally { setLoading(false); }
  }, [token, showAlert, fetchData]);

  const resetPassword = useCallback(async (email: string) => {
    setLoading(true);
    try {
      await axios.post(`${AUTH_BASE}/users/reset_password/`, { email });
      showAlert('Success', 'Password reset email sent. Please check your inbox.');
      return { success: true };
    } catch (err: any) {
      showAlert('Error', err.response?.data?.email?.[0] || 'Failed to send reset email.');
      return { success: false };
    } finally { setLoading(false); }
  }, [showAlert]);

  const confirmPasswordReset = useCallback(async (uid: string, token: string, new_password: string) => {
    setLoading(true);
    try {
      await axios.post(`${AUTH_BASE}/users/reset_password_confirm/`, { uid, token, new_password });
      showAlert('Success', 'Password successfully reset. You can now login.');
      return { success: true };
    } catch (err: any) {
      showAlert('Error', 'Failed to reset password. The link might be expired or invalid.');
      return { success: false };
    } finally { setLoading(false); }
  }, [showAlert]);

  const activateAccount = useCallback(async (uid: string, token: string) => {
    setLoading(true);
    try {
      await axios.post(`${AUTH_BASE}/users/activation/`, { uid, token });
      showAlert('Success', 'Your account has been successfully verified! You can now log in.');
      return { success: true };
    } catch (err: any) {
      showAlert('Error', 'Failed to activate account. The link might be expired or invalid.');
      return { success: false };
    } finally { setLoading(false); }
  }, [showAlert]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleDeposit = useCallback(async (gateway: 'ssl' | 'paypal' | 'manual') => {
    if (!depositAmount) return;
    setLoading(true);
    try {
      if (gateway === 'manual') {
        await axios.post(`${API_BASE}/manual/deposit/`, { amount: parseFloat(depositAmount), method: 'CASH/MANUAL' }, { headers: { Authorization: `Bearer ${token}` } });
        showAlert('Success', 'Deposit request submitted! Awaiting admin approval.');
        setDepositAmount('');
      } else {
        const endpoint = gateway === 'ssl' ? 'deposit/' : 'paypal/deposit/';
        const res = await axios.post(`${API_BASE}/${endpoint}`, { amount: parseFloat(depositAmount) }, { headers: { Authorization: `Bearer ${token}` } });
        window.location.href = res.data.payment_url;
      }
    } catch { showAlert('Error', 'Payment initialization failed. Please try again.'); }
    finally { setLoading(false); }
  }, [depositAmount, token, showAlert]);

  const handleOrder = useCallback(async () => {
    if (!token) { setIsLogin(false); setShowAuth(true); return; }
    if (!selectedPlan) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/order/`, {
        plan_id: selectedPlan.id, price_bdt: selectedPlan.price_bdt,
        region: selectedRegion, image_id: selectedImage,
        custom_name: customName, custom_password: customRootPass,
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        showAlert('Success', 'Deployment successful! Credentials have been emailed to you.');
        setSelectedPlan(null);
        fetchData();
      }
    } catch (err: any) {
      showAlert('Error', err.response?.data?.error || 'Deployment failed');
    } finally { setLoading(false); }
  }, [token, selectedPlan, selectedRegion, selectedImage, customName, customRootPass, showAlert, fetchData]);

  const handleSyncRate = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/settings/sync-rate/`, {}, { headers: { Authorization: `Bearer ${token}` } });
      showAlert('Success', res.data.message || 'Rate synced successfully!');
      fetchData();
    } catch (err: any) {
      showAlert('Error', err.response?.data?.error || 'Sync failed');
    } finally { setLoading(false); }
  }, [token, showAlert, fetchData]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'en' ? 'bn' : 'en'));
  }, []);

  // ── Context Value ──────────────────────────────────────────────────────────
  const value: AppState = {
    token, email, isStaff, isSuperuser, profile_image, two_factor_enabled, setEmail, login, register, logout,
    theme, setTheme, toggleTheme, language, toggleLanguage, isMobile, sidebarOpen, setSidebarOpen, activeTab, setActiveTab, loading,
    showAuth, setShowAuth, isLogin, setIsLogin, resetPassword, confirmPasswordReset, activateAccount,
    balance, servers, plans, transactions, users, manualRequests, unapprovedUsers, notifications, adminStats, status, setStatus, setTransactions,
    selectedPlan, setSelectedPlan, selectedRegion, setSelectedRegion, selectedImage, setSelectedImage, customName, setCustomName, customRootPass, setCustomRootPass,
    depositAmount, setDepositAmount,
    modalConfig, setModalConfig, promptConfig, setPromptConfig,
    notifyOpen, setNotifyOpen,
    chatOpen, setChatOpen, unreadChatCount, setUnreadChatCount,
    adminChatTargetId, setAdminChatTargetId,
    showAlert, showConfirm, showPromptUI,
    fetchData, fetchPublicPlans, handleDeposit, handleOrder, handleSyncRate, deleteAccount, uploadImage,
    generate2FA, enable2FA, disable2FA,
    balanceUsd: exchangeRate > 0 ? parseFloat((balance / exchangeRate).toFixed(2)) : 0,
    exchangeRate,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
