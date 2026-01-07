/**
 * Authentication Hooks Usage Guide
 * 
 * This file demonstrates how to use the authentication-related hooks
 * created for the Contract Assistant application.
 * 
 * All hooks use React Query for server state management and Zustand
 * for client state management, providing a robust authentication system.
 */

// ============================================================================
// 1. useAuth Hook
// ============================================================================
/**
 * useAuth - Main authentication hook
 * 
 * Provides access to current user, authentication state, and actions
 * to manage authentication lifecycle.
 * 
 * Returns:
 * - user: Current authenticated user or null
 * - token: JWT access token or null
 * - isAuthenticated: Boolean indicating if user is authenticated
 * - isLoading: Boolean indicating if auth operations are in progress
 * - error: Error message or null
 * - logout(): Async function to logout user
 * - refreshToken(): Async function to refresh access token
 * 
 * Example Usage:
 */
import { useAuth } from '@/hooks';

export function ProfileScreen() {
  const { user, token, isLoading, error, logout, refreshToken } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!user) {
    return <Text>Not authenticated</Text>;
  }

  return (
    <View>
      <Text>Welcome, {user.name || user.email}!</Text>
      <Button title="Logout" onPress={logout} />
      <Button title="Refresh Token" onPress={refreshToken} />
    </View>
  );
}

// ============================================================================
// 2. useLogin Hook
// ============================================================================
/**
 * useLogin - Login functionality hook
 * 
 * Handles user login with error handling and state management.
 * Automatically integrates with React Query for mutation handling.
 * 
 * Returns:
 * - isLoading: Boolean indicating if login is in progress
 * - error: Error message or null
 * - login(email, password): Async function that returns {success, error}
 * - clearError(): Function to clear error message
 * 
 * Example Usage:
 */
import { useLogin } from '@/hooks';
import { useState } from 'react';

export function LoginScreen() {
  const { login, isLoading, error, clearError } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const result = await login(email, password);
    if (result) {
      // Login successful, navigation will be handled by auth guard
      console.log('Login successful');
    } else {
      // Login failed, error is available in the error state
      console.log('Login failed');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!isLoading}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />
      {error && (
        <View>
          <Text style={{ color: 'red' }}>{error}</Text>
          <Button title="Clear Error" onPress={clearError} />
        </View>
      )}
      <Button
        title={isLoading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
}

// ============================================================================
// 3. useRegister Hook
// ============================================================================
/**
 * useRegister - Registration functionality hook
 * 
 * Handles user registration with email validation, password validation,
 * and error handling.
 * 
 * Returns:
 * - isLoading: Boolean indicating if registration is in progress
 * - error: Error message or null
 * - register(email, password, confirmPassword, name?): Async function
 *   Returns {success, error}
 * - clearError(): Function to clear error message
 * - validateEmail(email): Function to validate email format
 * - validatePassword(password): Function to validate password strength
 *   Returns {valid, message?}
 * 
 * Password Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * 
 * Example Usage:
 */
import { useRegister } from '@/hooks';

export function RegisterScreen() {
  const {
    register,
    isLoading,
    error,
    clearError,
    validatePassword,
    validateEmail,
  } = useRegister();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const validation = validatePassword(value);
    setPasswordError(validation.message || null);
  };

  const handleRegister = async () => {
    const result = await register(email, password, confirmPassword, name);
    if (result.success) {
      console.log('Registration successful');
    } else {
      console.log('Registration failed:', result.error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!isLoading}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Name (optional)"
        value={name}
        onChangeText={setName}
        editable={!isLoading}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
        editable={!isLoading}
      />
      {passwordError && <Text style={{ color: 'orange' }}>{passwordError}</Text>}
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!isLoading}
      />
      {error && (
        <View>
          <Text style={{ color: 'red' }}>{error}</Text>
          <Button title="Clear Error" onPress={clearError} />
        </View>
      )}
      <Button
        title={isLoading ? 'Registering...' : 'Register'}
        onPress={handleRegister}
        disabled={isLoading || !password || !email}
      />
    </View>
  );
}

// ============================================================================
// 4. usePasswordReset Hook
// ============================================================================
/**
 * usePasswordReset - Password reset functionality hook
 * 
 * Handles the two-step password reset process:
 * Step 1: Request password reset (forgot password)
 * Step 2: Reset password with token
 * 
 * Returns:
 * - step: Current step ('email' or 'reset')
 * - email: Email address for password reset
 * - resetToken: Token received for password reset
 * - isLoadingForgot: Boolean for forgot password request state
 * - isLoadingReset: Boolean for reset password request state
 * - errorForgot: Error message from forgot password request
 * - errorReset: Error message from reset password request
 * - forgotPassword(email): Async function to request password reset
 *   Returns {success, error}
 * - resetPassword(token, password, confirmPassword): Async function
 *   to reset password. Returns {success, error}
 * - resetFlow(): Function to reset the entire flow
 * - validateEmail(email): Function to validate email format
 * - validatePassword(password): Function to validate password strength
 * 
 * Example Usage:
 */
import { usePasswordReset } from '@/hooks';

export function PasswordResetScreen() {
  const {
    step,
    email,
    isLoadingForgot,
    isLoadingReset,
    errorForgot,
    errorReset,
    forgotPassword,
    resetPassword,
    resetFlow,
  } = usePasswordReset();

  const [inputEmail, setInputEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (step === 'email') {
    const handleForgotPassword = async () => {
      const result = await forgotPassword(inputEmail);
      if (result.success) {
        // User will be prompted to enter reset token
        console.log('Check your email for password reset instructions');
      }
    };

    return (
      <View>
        <Text>Enter your email to reset password</Text>
        <TextInput
          placeholder="Email"
          value={inputEmail}
          onChangeText={setInputEmail}
          editable={!isLoadingForgot}
          keyboardType="email-address"
        />
        {errorForgot && <Text style={{ color: 'red' }}>{errorForgot}</Text>}
        <Button
          title={isLoadingForgot ? 'Sending...' : 'Send Reset Email'}
          onPress={handleForgotPassword}
          disabled={isLoadingForgot}
        />
      </View>
    );
  }

  if (step === 'reset') {
    const handleResetPassword = async () => {
      const result = await resetPassword(token, password, confirmPassword);
      if (result.success) {
        console.log('Password reset successful');
        resetFlow(); // Reset the flow for next use
      }
    };

    return (
      <View>
        <Text>Enter the token and new password</Text>
        <TextInput
          placeholder="Reset Token"
          value={token}
          onChangeText={setToken}
          editable={!isLoadingReset}
        />
        <TextInput
          placeholder="New Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoadingReset}
        />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!isLoadingReset}
        />
        {errorReset && <Text style={{ color: 'red' }}>{errorReset}</Text>}
        <Button
          title={isLoadingReset ? 'Resetting...' : 'Reset Password'}
          onPress={handleResetPassword}
          disabled={isLoadingReset}
        />
        <Button title="Back" onPress={resetFlow} />
      </View>
    );
  }

  return <Text>Invalid state</Text>;
}

// ============================================================================
// Integration with React Query
// ============================================================================
/**
 * The hooks integrate with React Query for optimal server state management:
 * 
 * Benefits:
 * 1. Automatic caching of user queries
 * 2. Automatic retry on failure
 * 3. Stale time management (5 minutes by default)
 * 4. Mutation state tracking
 * 5. Easy cache invalidation and refetching
 * 
 * QueryClient Configuration (in QueryClientWrapper):
 * - Default retry: 1
 * - Default staleTime: 5 minutes for queries
 * - Automatic retry for mutations
 * 
 * This ensures a smooth user experience with proper error handling
 * and automatic recovery from transient failures.
 */
