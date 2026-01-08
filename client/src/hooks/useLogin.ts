import { useCallback } from 'react';
import { useAuthStore } from '../stores';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * useLogin Hook
 * Handles login logic with error handling and state management
 * Uses React Query for mutation management and Zustand for auth state
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const login = useAuthStore((state) => state.login);
  const setError = useAuthStore((state) => state.setError);

  // Use React Query for login mutation
  const mutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      await login(email, password);
    },
    onSuccess: async () => {
      // Invalidate and refetch user-related queries
      await queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
    onError: (error: Error) => {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
    },
  });

  /**
   * Perform login
   */
  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null);
        await mutation.mutateAsync({ email, password });
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        setError(errorMessage);
        return false;
      }
    },
    [mutation, setError]
  );

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    // State
    isLoading: isLoading || mutation.isPending,
    error: error || mutation.error?.message || null,

    // Actions
    login: handleLogin,
    clearError,
  };
}
