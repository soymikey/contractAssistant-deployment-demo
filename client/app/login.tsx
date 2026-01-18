import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { validateEmail } from '@/utils';
import GoogleSignInButton from '@/components/social-auth-buttons/google/google-sign-in-button';
import ExpoAppleSignInButton from '@/components/social-auth-buttons/apple/expo-apple-sign-in-button';

/**
 * Login Screen - Cool Slate Design
 * Two-step passwordless authentication (email + verification code)
 * Aligned with Contract Assistant UI design system
 */
export default function LoginScreen() {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP via email
  const handleSendOTP = async () => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      Alert.alert('Error', emailValidation.message || 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
    });

    if (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
      return;
    }

    setStep('code');
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (code.length !== 8) {
      Alert.alert('Invalid Code', 'Please enter the 8-digit code.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code,
      type: 'email',
    });

    if (error) {
      Alert.alert('Verification Failed', error.message);
      setLoading(false);
      return;
    }

    // Login successful
    console.log('Logged in session:', data.session);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header - Logo and Title */}
        <View style={styles.headerContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logo}>📄</Text>
          </View>
          <Text style={styles.title}>{step === 'email' ? 'Welcome Back' : 'Verify Email'}</Text>
          <Text style={styles.subtitle}>
            {step === 'email' ? 'Enter your email to sign in' : `Enter the code sent to\n${email}`}
          </Text>
        </View>

        {/* Form - Step 1: Email Input */}
        {step === 'email' && (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="user@example.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Send Code Button */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
              onPress={handleSendOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Send Code</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Auth Buttons */}
            <View style={styles.socialButtonsContainer}>
              <GoogleSignInButton />
              {Platform.OS === 'ios' && <ExpoAppleSignInButton />}
            </View>
          </View>
        )}

        {/* Form - Step 2: Verification Code */}
        {step === 'code' && (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                style={[styles.input, styles.codeInput]}
                placeholder="Enter 8-digit code"
                placeholderTextColor="#94a3b8"
                keyboardType="number-pad"
                maxLength={8}
                value={code}
                onChangeText={setCode}
              />
            </View>

            {/* Verify & Login Button */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
              onPress={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify & Login</Text>
              )}
            </TouchableOpacity>

            {/* Back to Edit Email */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setStep('email');
                setCode('');
              }}
            >
              <Text style={styles.backButtonText}>← Back to edit email</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Auth Buttons */}
            <View style={styles.socialButtonsContainer}>
              <GoogleSignInButton />
              {Platform.OS !== 'ios' && <ExpoAppleSignInButton />}
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  /* Container & Layout */
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // Cool Slate 50
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  /* Header Section */
  headerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#1e293b', // Cool Slate 800
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b', // Cool Slate 500
    textAlign: 'center',
    lineHeight: 24,
  },

  /* Form Container */
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },

  /* Input Group */
  inputGroup: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569', // Cool Slate 600
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0', // Cool Slate 200
    borderRadius: 14,
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  codeInput: {
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 2,
  },

  /* Buttons */
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: '#1e293b', // Cool Slate 800
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  backButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 13,
    color: '#475569', // Cool Slate 600
    fontWeight: '500',
  },

  /* Divider */
  dividerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0', // Cool Slate 200
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    color: '#94a3b8', // Cool Slate 400
    fontWeight: '500',
  },

  /* Social Buttons */
  socialButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
});
