import { create } from 'zustand';
import type { UIStore, ToastType, Toast } from '@/types/store';

let toastIdCounter = 0;

/**
 * UI Store
 * Manages global UI state including loading, errors, toasts, and connection status
 */
export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  isLoading: false,
  loadingMessage: undefined,
  error: null,
  toasts: [],
  isConnected: true,

  // Actions
  setLoading: (isLoading: boolean, message?: string) => {
    set({ isLoading, loadingMessage: message });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  showToast: (type: ToastType, message: string, duration = 3000) => {
    const id = `toast-${++toastIdCounter}`;
    const toast: Toast = {
      id,
      type,
      message,
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-hide toast after duration
    if (duration > 0) {
      setTimeout(() => {
        get().hideToast(id);
      }, duration);
    }
  },

  hideToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  setConnectionStatus: (isConnected: boolean) => {
    set({ isConnected });

    // Show toast when connection status changes (aligned with English UI)
    if (!isConnected) {
      get().showToast('warning', 'Network connection lost', 0); // 0 = no auto-hide
    } else {
      get().showToast('success', 'Network connection restored', 2000);
    }
  },
}));

/**
 * Helper functions for common toast patterns
 */
export const showSuccessToast = (message: string, duration?: number) => {
  useUIStore.getState().showToast('success', message, duration);
};

export const showErrorToast = (message: string, duration?: number) => {
  useUIStore.getState().showToast('error', message, duration);
};

export const showWarningToast = (message: string, duration?: number) => {
  useUIStore.getState().showToast('warning', message, duration);
};

export const showInfoToast = (message: string, duration?: number) => {
  useUIStore.getState().showToast('info', message, duration);
};
