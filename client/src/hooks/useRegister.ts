import { useCallback } from 'react';
import { useAuthStore } from '../stores';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * useRegister Hook
 * Handles user registration with email validation and error handling
 * Uses React Query for mutation management and Zustand for auth state
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const register = useAuthStore((state) => state.register);
  const setError = useAuthStore((state) => state.setError);

  // Use React Query for register mutation
  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name?: string;
    }) => {
      await register(email, password, name);
    },
    onSuccess: async () => {
      // Invalidate and refetch user-related queries
      await queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
    onError: (error: Error) => {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
    },
  });

  /**
   * Validate email format
   */
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  /**
   * Validate password strength
   */
  const validatePassword = useCallback((password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true };
  }, []);

  /**
   * Perform registration
   */
  const handleRegister = useCallback(
    async (email: string, password: string, confirmPassword: string, name?: string) => {
      try {
        setError(null);

        // Validate email
        if (!validateEmail(email)) {
          const errorMsg = 'Invalid email format';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
          const errorMsg = passwordValidation.message || 'Password does not meet requirements';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }

        // Validate password confirmation
        if (password !== confirmPassword) {
          const errorMsg = 'Passwords do not match';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }

        // Perform registration
        await mutation.mutateAsync({ email, password, name });
        return { success: true };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Registration failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [mutation, setError, validateEmail, validatePassword]
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
    register: handleRegister,
    clearError,
    validateEmail,
    validatePassword,
  };
}
