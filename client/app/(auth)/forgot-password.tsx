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
import { showErrorToast, showSuccessToast } from '../../src/stores';

/**
 * Forgot Password Screen
 * Password reset request screen aligned with Contract Assistant UI design
 */
export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    // Validation
    if (!email) {
      showErrorToast('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      showErrorToast('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Integrate with actual API
      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setEmailSent(true);
      showSuccessToast('Password reset link sent to your email');
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : 'Failed to send reset link. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
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

            <Link href={'/(auth)/login' as Href} asChild>
              <TouchableOpacity style={styles.backButton}>
                <Text style={styles.backButtonText}>Back to Sign In</Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => {
                setEmailSent(false);
                setEmail('');
              }}
            >
              <Text style={styles.resendButtonText}>Try different email</Text>
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
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text style={styles.resetButtonText}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
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
