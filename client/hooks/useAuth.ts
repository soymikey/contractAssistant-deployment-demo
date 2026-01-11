import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores';
import { authService } from '@/services';
import { useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * useAuth Hook
 * Provides access to authentication state and actions
 * Combines Zustand store with React Query for server state management
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get state from auth store
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  // Get actions from auth store
  const logout = useAuthStore((state) => state.logout);
  const refreshAuth = useAuthStore((state) => state.refreshAuth);
  const setError = useAuthStore((state) => state.setError);

  // Query current user profile
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      if (!token) {
        return null;
      }
      try {
        return await authService.getCurrentUser();
      } catch (err) {
        console.error('Failed to fetch current user:', err);
        return null;
      }
    },
    enabled: !!token,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      if (!isInitialized && isAuthenticated && token) {
        try {
          // Validate token by fetching current user
          await queryClient.ensureQueryData({
            queryKey: ['user', 'profile'],
            queryFn: async () => authService.getCurrentUser(),
          });
        } catch (err) {
          console.error('Auth initialization failed:', err);
          // Try to refresh token
          try {
            await refreshAuth();
          } catch {
            // No need to call logout here as refreshAuth already handles it with skipApi: true
            // but we might want to clear React Query cache
            queryClient.removeQueries({ queryKey: ['user'] });
            queryClient.removeQueries({ queryKey: ['contracts'] });
          }
        }
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [isInitialized, isAuthenticated, token, queryClient, refreshAuth, logout]);

  /**
   * Logout and clear all auth-related caches
   */
  const handleLogout = useCallback(
    async (options?: { skipApi?: boolean }) => {
      try {
        await logout(options);
        // Clear all user-related queries
        queryClient.removeQueries({ queryKey: ['user'] });
        queryClient.removeQueries({ queryKey: ['contracts'] });
        queryClient.removeQueries({ queryKey: ['favorites'] });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Logout failed';
        setError(errorMessage);
        throw err;
      }
    },
    [logout, queryClient, setError]
  );

  /**
   * Refresh authentication token
   */
  const handleRefreshToken = useCallback(async () => {
    try {
      await refreshAuth();
      // Invalidate user queries to refetch with new token
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Token refresh failed';
      setError(errorMessage);
      throw err;
    }
  }, [refreshAuth, queryClient, setError]);

  return {
    // State
    user: currentUser || user,
    token,
    isAuthenticated,
    isLoading: isLoading || isLoadingUser,
    error,

    // Actions
    logout: handleLogout,
    refreshToken: handleRefreshToken,
  };
}
