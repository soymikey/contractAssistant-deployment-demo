import { supabase } from '@/lib/supabase';
import { validateEmail } from '@/utils';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function AuthOTPScreen() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isSent, setIsSent] = useState(false); // 是否已发送验证码
  const [loading, setLoading] = useState(false);

  // 第一步：发送验证码 (Login or Signup)
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
    } else {
      setIsSent(true);
    }
    setLoading(false);
  };

  // 第二步：验证验证码
  const handleVerifyOTP = async () => {
    if (otp.length !== 8) {
      Alert.alert('Invalid Code', 'Please enter the 8-digit code.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp,
      type: 'email', // 注意：无密码登录模式这里必须用 'email'
    });

    if (error) {
      Alert.alert('Verification Failed', error.message);
    } else {
      // 成功！Supabase 会自动处理 Session
      // 这里可以跳转到你的主页
      console.log('Logged in session:', data.session);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{isSent ? 'Verify Email' : 'Welcome'}</Text>
        <Text style={styles.subtitle}>
          {isSent
            ? `Enter the code sent to ${email}`
            : 'Enter your email to sign in or create an account'}
        </Text>

        {!isSent ? (
          // 邮箱输入阶段
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
            <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send Code</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          // 验证码输入阶段
          <View>
            <TextInput
              style={[styles.input, styles.otpInput]}
              placeholder="000000"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={8}
              autoFocus={true}
              editable={!loading}
            />
            <TouchableOpacity style={styles.button} onPress={handleVerifyOTP} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify & Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsSent(false)} style={styles.linkButton}>
              <Text style={styles.linkText}>Back to edit email</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 30, textAlign: 'center', lineHeight: 20 },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  otpInput: { fontSize: 24, textAlign: 'center', letterSpacing: 8, fontWeight: 'bold' },
  button: { backgroundColor: '#3ecf8e', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkButton: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#3ecf8e', fontSize: 14 },
});
