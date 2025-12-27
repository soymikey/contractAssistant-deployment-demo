import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthStore, User } from '../types/store';
import { authService } from '../services';

const STORAGE_KEYS = {
  USER: '@contractAssistant:user',
  TOKEN: '@contractAssistant:token',
  REFRESH_TOKEN: '@contractAssistant:refreshToken',
};

/**
 * Authentication Store
 * Manages user authentication state, login/logout, and token management
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      // Call auth service API
      const response = await authService.login(email, password);

      // Save to state
      set({
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Persist to AsyncStorage
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER, JSON.stringify(response.user)],
        [STORAGE_KEYS.TOKEN, response.token],
        [STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken],
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  register: async (email: string, password: string, name?: string) => {
    set({ isLoading: true, error: null });

    try {
      // Call auth service API
      const response = await authService.register(email, password, name);

      // Save to state
      set({
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Persist to AsyncStorage
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER, JSON.stringify(response.user)],
        [STORAGE_KEYS.TOKEN, response.token],
        [STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken],
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  logout: async () => {
    try {
      // Call logout API
      await authService.logout();

      // Clear state
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
      });

      // Clear AsyncStorage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
      ]);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  refreshAuth: async () => {
    const { refreshToken } = get();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    set({ isLoading: true, error: null });

    try {
      // Call auth service API to refresh token
      const response = await authService.refreshToken(refreshToken);

      // Update tokens in state
      set({
        token: response.token,
        refreshToken: response.refreshToken,
        isLoading: false,
      });

      // Persist to AsyncStorage
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, response.token],
        [STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken],
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
      set({ isLoading: false, error: errorMessage });

      // If refresh fails, logout user
      await get().logout();
      throw error;
    }
  },

  setUser: (user: User) => {
    set({ user });
    AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  setToken: (token: string, refreshToken?: string) => {
    set({ token, refreshToken, isAuthenticated: true });
    AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    if (refreshToken) {
      AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  },

  clearAuth: () => {
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));

/**
 * Restore auth state from AsyncStorage on app startup
 */
export const restoreAuthState = async () => {
  try {
    const [[, userJson], [, token], [, refreshToken]] = await AsyncStorage.multiGet([
      STORAGE_KEYS.USER,
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
    ]);

    if (userJson && token) {
      const user: User = JSON.parse(userJson);
      useAuthStore.setState({
        user,
        token,
        refreshToken: refreshToken || null,
        isAuthenticated: true,
      });
    }
  } catch (error) {
    console.error('Failed to restore auth state:', error);
  }
};
