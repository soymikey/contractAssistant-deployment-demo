import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services';

/**
 * usePasswordReset Hook
 * Handles password reset functionality including forgot password and reset password flows
 * Uses React Query for mutation management with internal state for multi-step flow
 */
export function usePasswordReset() {
  // Internal state for multi-step flow
  const [step, setStep] = useState<'forgot' | 'reset'>('forgot');
  const [email, setEmail] = useState<string>('');

  // Forgot password mutation - sends reset email
  const forgotPasswordMutation = useMutation({
    mutationFn: async (emailInput: string) => {
      await authService.forgotPassword(emailInput);
      return emailInput;
    },
    onSuccess: (emailInput: string) => {
      setEmail(emailInput);
      setStep('reset');
    },
  });

  // Reset password mutation - sets new password with token
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      await authService.resetPassword(token, password);
    },
  });

  /**
   * Validate email format
   */
  const validateEmail = useCallback((emailInput: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailInput);
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
   * Request password reset email
   */
  const forgotPassword = useCallback(
    async (emailInput: string) => {
      // Validate email
      if (!validateEmail(emailInput)) {
        return { success: false, error: 'Invalid email format' };
      }

      try {
        await forgotPasswordMutation.mutateAsync(emailInput);
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
  const resetPassword = useCallback(
    async (token: string, password: string, confirmPassword: string) => {
      // Validate password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.message || 'Password does not meet requirements' };
      }

      // Validate password confirmation
      if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      try {
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
   * Reset the flow back to forgot password step
   */
  const resetFlow = useCallback(() => {
    setStep('forgot');
    setEmail('');
    forgotPasswordMutation.reset();
    resetPasswordMutation.reset();
  }, [forgotPasswordMutation, resetPasswordMutation]);

  return {
    // State
    step,
    email,
    isLoadingForgot: forgotPasswordMutation.isPending,
    isLoadingReset: resetPasswordMutation.isPending,
    errorForgot: forgotPasswordMutation.error?.message || null,
    errorReset: resetPasswordMutation.error?.message || null,

    // Actions
    forgotPassword,
    resetPassword,
    resetFlow,
    validateEmail,
    validatePassword,
  };
}
