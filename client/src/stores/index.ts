/**
 * Store Index
 * Central export point for all Zustand stores
 */

// Store exports
export { useAuthStore, restoreAuthState } from './authStore';
export { useContractStore, restoreFavorites } from './contractStore';
export { useUploadStore } from './uploadStore';
export {
  useUIStore,
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
} from './uiStore';

// Type exports
export type {
  AuthStore,
  ContractStore,
  UploadStore,
  UIStore,
  User,
  Contract,
  ContractAnalysis,
  Risk,
  Suggestion,
  KeyTerm,
  UploadFile,
  Toast,
  ToastType,
} from '@/types/store';

/**
 * Initialize all stores
 * Call this function on app startup to restore persisted state
 */
export const initializeStores = async () => {
  const { restoreAuthState } = await import('./authStore');
  const { restoreFavorites } = await import('./contractStore');

  try {
    await Promise.all([restoreAuthState(), restoreFavorites()]);
  } catch (error) {
    console.error('Failed to initialize stores:', error);
  }
};
