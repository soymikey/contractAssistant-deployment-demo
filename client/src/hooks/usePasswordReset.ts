import { useCallback, useState } from 'react';
import { authService } from '../services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * usePasswordReset Hook
 * Handles password reset flow with email verification and error handling
 * Uses React Query for mutations and queries
 */
export function usePasswordReset() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [step, setStep] = useState<'email' | 'reset'>('email');

  /**
   * Forgot password mutation
   */
  const forgotPasswordMutation = useMutation({
    mutationFn: async (emailAddress: string) => {
      await authService.forgotPassword(emailAddress);
    },
    onSuccess: () => {
      setStep('reset');
    },
  });

  /**
   * Reset password mutation
   */
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      await authService.resetPassword(token, password);
    },
    onSuccess: async () => {
      // Clear reset state
      setEmail('');
      setResetToken('');
      setStep('email');
      // Invalidate auth-related queries
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  /**
   * Request password reset email
   */
  const handleForgotPassword = useCallback(
    async (emailAddress: string) => {
      try {
        if (!validateEmail(emailAddress)) {
          throw new Error('Invalid email format');
        }
        setEmail(emailAddress);
        await forgotPasswordMutation.mutateAsync(emailAddress);
        return { success: true };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
        return { success: false, error: errorMessage };
      }
    },
    [forgotPasswordMutation, validateEmail]
  );

  /**
   * Reset password with token
   */
  const handleResetPassword = useCallback(
    async (token: string, password: string, confirmPassword: string) => {
      try {
        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
          throw new Error(passwordValidation.message || 'Password does not meet requirements');
        }

        // Validate password confirmation
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        setResetToken(token);
        await resetPasswordMutation.mutateAsync({ token, password });
        return { success: true };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
        return { success: false, error: errorMessage };
      }
    },
    [resetPasswordMutation, validatePassword]
  );

  /**
   * Validate email format
   */
  const validateEmail = useCallback((emailAddress: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress);
  }, []);

  /**
   * Validate password strength
   */
  const validatePassword = useCallback((password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one uppercase letter',
      };
    }
    if (!/[a-z]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one lowercase letter',
      };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true };
  }, []);

  /**
   * Reset the reset flow
   */
  const resetFlow = useCallback(() => {
    setEmail('');
    setResetToken('');
    setStep('email');
    forgotPasswordMutation.reset();
    resetPasswordMutation.reset();
  }, [forgotPasswordMutation, resetPasswordMutation]);

  return {
    // State
    step,
    email,
    resetToken,
    isLoadingForgot: forgotPasswordMutation.isPending,
    isLoadingReset: resetPasswordMutation.isPending,
    errorForgot: forgotPasswordMutation.error?.message || null,
    errorReset: resetPasswordMutation.error?.message || null,

    // Actions
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    resetFlow,
    validateEmail,
    validatePassword,
  };
}
