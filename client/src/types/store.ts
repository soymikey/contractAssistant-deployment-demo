/**
 * Store Type Definitions
 * Defines TypeScript types for all Zustand stores
 */

// ==================== Auth Types ====================
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string, refreshToken?: string) => void;
  clearAuth: () => void;
  setError: (error: string | null) => void;
}

export type AuthStore = AuthState & AuthActions;

// ==================== Contract Types ====================
export interface Contract {
  id: string;
  name: string;
  type?: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  uploadedAt: string;
  analyzedAt?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  riskLevel?: 'high' | 'medium' | 'low';
  riskCount?: number;
}

export interface ContractAnalysis {
  id: string;
  contractId: string;
  overview: {
    type: string;
    parties: string[];
    startDate?: string;
    endDate?: string;
    duration?: string;
    pages?: number;
  };
  risks: Risk[];
  suggestions: Suggestion[];
  keyTerms: KeyTerm[];
  summary: string;
}

export interface Risk {
  id: string;
  level: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation?: string;
  legalReference?: string;
}

export interface Suggestion {
  id: string;
  type: 'add' | 'modify' | 'remove';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface KeyTerm {
  id: string;
  category: string;
  label: string;
  value: string;
}

export interface ContractState {
  contracts: Contract[];
  currentContract: Contract | null;
  currentAnalysis: ContractAnalysis | null;
  favorites: string[];
  isLoading: boolean;
  error: string | null;
}

export interface ContractActions {
  fetchContracts: () => Promise<void>;
  fetchContractById: (id: string) => Promise<void>;
  fetchAnalysis: (contractId: string) => Promise<void>;
  addContract: (contract: Contract) => void;
  updateContract: (id: string, updates: Partial<Contract>) => void;
  deleteContract: (id: string) => Promise<void>;
  toggleFavorite: (contractId: string) => void;
  setCurrentContract: (contract: Contract | null) => void;
  setError: (error: string | null) => void;
  clearContracts: () => void;
}

export type ContractStore = ContractState & ContractActions;

// ==================== Upload Types ====================
export interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uri: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  progress: number;
  error?: string;
}

export interface UploadState {
  files: UploadFile[];
  currentUpload: UploadFile | null;
  isUploading: boolean;
}

export interface UploadActions {
  addFile: (file: Omit<UploadFile, 'id' | 'status' | 'progress'>) => string;
  removeFile: (id: string) => void;
  updateFileProgress: (id: string, progress: number) => void;
  updateFileStatus: (id: string, status: UploadFile['status'], error?: string) => void;
  setCurrentUpload: (file: UploadFile | null) => void;
  clearCompleted: () => void;
  clearAll: () => void;
}

export type UploadStore = UploadState & UploadActions;

// ==================== UI Types ====================
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface UIState {
  isLoading: boolean;
  loadingMessage?: string;
  error: string | null;
  toasts: Toast[];
  isConnected: boolean;
}

export interface UIActions {
  setLoading: (isLoading: boolean, message?: string) => void;
  setError: (error: string | null) => void;
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
  setConnectionStatus: (isConnected: boolean) => void;
}

export type UIStore = UIState & UIActions;
