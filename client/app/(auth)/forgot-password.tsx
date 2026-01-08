import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, Href } from 'expo-router';
import { usePasswordReset } from '@/hooks';
import { showErrorToast, showSuccessToast } from '@/stores';

/**
 * Forgot Password Screen
 * Password reset request screen aligned with Contract Assistant UI design
 */
export default function ForgotPasswordScreen() {
  const [inputEmail, setInputEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

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
    validatePassword,
  } = usePasswordReset();

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value) {
      const validation = validatePassword(value);
      setPasswordError(validation.message || null);
    } else {
      setPasswordError(null);
    }
  };

  const handleForgotPassword = async () => {
    if (!inputEmail) {
      showErrorToast('Please enter your email address');
      return;
    }

    const result = await forgotPassword(inputEmail);
    if (result.success) {
      showSuccessToast('Check your email for password reset instructions');
    } else {
      showErrorToast(result.error || 'Failed to send reset email');
    }
  };

  const handleResetPassword = async () => {
    if (!token) {
      showErrorToast('Please enter the reset token');
      return;
    }

    if (!password) {
      showErrorToast('Please enter a new password');
      return;
    }

    if (password !== confirmPassword) {
      showErrorToast('Passwords do not match');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      showErrorToast(passwordValidation.message || 'Password does not meet requirements');
      return;
    }

    const result = await resetPassword(token, password, confirmPassword);
    if (result.success) {
      showSuccessToast('Password reset successfully');
      resetFlow();
    } else {
      showErrorToast(result.error || 'Failed to reset password');
    }
  };

  if (step === 'reset') {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.successIcon}>✉️</Text>
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.subtitle}>We&apos;ve sent a password reset link to {email}</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.instructions}>
              Click the link in the email to reset your password. If you don&apos;t see it, check
              your spam folder.
            </Text>

            <Text style={styles.label}>Reset Token</Text>
            <TextInput
              style={styles.input}
              placeholder="Paste the reset token from the email"
              placeholderTextColor="#999"
              value={token}
              onChangeText={setToken}
              editable={!isLoadingReset}
            />

            <Text style={[styles.label, { marginTop: 20 }]}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your new password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
              editable={!isLoadingReset}
            />
            {passwordError && <Text style={styles.passwordErrorText}>{passwordError}</Text>}

            <Text style={[styles.label, { marginTop: 20 }]}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your new password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isLoadingReset}
            />

            {errorReset && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorReset}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.resetButton, isLoadingReset && styles.resetButtonDisabled]}
              onPress={handleResetPassword}
              disabled={isLoadingReset}
            >
              <Text style={styles.resetButtonText}>
                {isLoadingReset ? 'Resetting...' : 'Reset Password'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={resetFlow}>
              <Text style={styles.backToLoginText}>Back to Request New Token</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🔑</Text>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email and we&apos;ll send you a link to reset your password
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="user@example.com"
              placeholderTextColor="#999"
              value={inputEmail}
              onChangeText={setInputEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              editable={!isLoadingForgot}
            />
          </View>

          {errorForgot && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorForgot}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.resetButton, isLoadingForgot && styles.resetButtonDisabled]}
            onPress={handleForgotPassword}
            disabled={isLoadingForgot}
          >
            <Text style={styles.resetButtonText}>
              {isLoadingForgot ? 'Sending...' : 'Send Reset Link'}
            </Text>
          </TouchableOpacity>

          <Link href={'/(auth)/login' as Href} asChild>
            <TouchableOpacity style={styles.backToLoginContainer}>
              <Text style={styles.backToLoginText}>Back to Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  passwordErrorText: {
    fontSize: 12,
    color: '#ff9800',
    marginTop: 6,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#c33',
    fontWeight: '500',
  },
  resetButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  backToLoginContainer: {
    alignItems: 'center',
    padding: 12,
  },
  backToLoginText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  resendButton: {
    alignItems: 'center',
    padding: 12,
  },
  resendButtonText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
});
