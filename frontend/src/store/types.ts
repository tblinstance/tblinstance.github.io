import type { ModalConfig, PromptConfig, Plan } from '../components/types';
export type { ModalConfig, PromptConfig, Plan };

export interface AppState {
  // Auth
  token: string | null;
  email: string;
  isStaff: boolean;
  isSuperuser: boolean;
  profile_image: string | null;
  two_factor_enabled: boolean;
  setEmail: (v: string) => void;
  login: (email: string, password: string, otp?: string) => Promise<{ success?: boolean; two_factor_required?: boolean; error?: boolean }>;
  register: (email: string, password: string, first_name: string, last_name: string, phone_number: string, address: string, country: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  confirmPasswordReset: (uid: string, token: string, new_password: string) => Promise<{ success: boolean; message?: string }>;
  activateAccount: (uid: string, token: string) => Promise<{ success: boolean; message?: string }>;

  // UI
  theme: string;
  setTheme: (v: string) => void;
  toggleTheme: () => void;
  language: 'en' | 'bn';
  toggleLanguage: () => void;
  isMobile: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  activeTab: string;
  setActiveTab: (v: string) => void;
  loading: boolean;

  // Auth flow
  showAuth: boolean;
  setShowAuth: (v: boolean) => void;
  isLogin: boolean;
  setIsLogin: (v: boolean) => void;

  // Data
  balance: number;
  balanceUsd: number;
  exchangeRate: number;
  servers: any[];
  plans: Plan[];
  transactions: any[];
  users: any[];
  manualRequests: any[];
  notifications: any[];
  adminStats: any;
  unapprovedUsers: any[];
  status: string;
  setStatus: (v: string) => void;
  setTransactions: (v: any[]) => void;

  // Deploy
  selectedPlan: Plan | null;
  setSelectedPlan: (v: Plan | null) => void;
  selectedRegion: string;
  setSelectedRegion: (v: string) => void;
  selectedImage: string;
  setSelectedImage: (v: string) => void;
  customName: string;
  setCustomName: (v: string) => void;
  customRootPass: string;
  setCustomRootPass: (v: string) => void;

  // Deposit
  depositAmount: string;
  setDepositAmount: (v: string) => void;

  // Modals
  modalConfig: ModalConfig;
  setModalConfig: (v: ModalConfig) => void;
  promptConfig: PromptConfig | null;
  setPromptConfig: (v: PromptConfig | null) => void;
  notifyOpen: boolean;
  setNotifyOpen: (v: boolean) => void;
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  unreadChatCount: number;
  setUnreadChatCount: (v: number) => void;
  adminChatTargetId: number | null;
  setAdminChatTargetId: (v: number | null) => void;


  // Helpers
  showAlert: (title: string, msg: string) => void;
  showConfirm: (title: string, msg: string, cb: () => void, isDanger?: boolean) => void;
  showPromptUI: (title: string, cb: (val: string) => void) => void;

  // Actions
  fetchData: () => Promise<void>;
  fetchPublicPlans: () => Promise<void>;
  handleDeposit: (gateway: 'ssl' | 'paypal' | 'manual') => Promise<void>;
  handleOrder: () => Promise<void>;
  handleSyncRate: () => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string | void>;
  generate2FA: () => Promise<{ secret: string; qr_code: string } | null>;
  enable2FA: (otp: string) => Promise<boolean>;
  disable2FA: (otp: string) => Promise<boolean>;
}
