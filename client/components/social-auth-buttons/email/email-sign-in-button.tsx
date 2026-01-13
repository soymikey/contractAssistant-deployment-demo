import React, { useState } from 'react';
import { Alert, StyleSheet, View, Button, TextInput } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { validateEmail, validatePassword } from '@/utils';

export type EmailSignInProps = {
  isSign?: boolean;
};

export default function EmailSignIn({ isSign = true }: EmailSignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function validateCredentials(
    email: string,
    password: string
  ): { valid: boolean; message?: string } {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return { valid: false, message: emailValidation.message || 'Invalid email address' };
    }
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { valid: false, message: passwordValidation.message || 'Invalid password' };
    }
    return { valid: true };
  }

  async function signInWithEmail() {
    const validation = validateCredentials(email, password);
    if (!validation.valid) {
      Alert.alert(validation.message || 'Invalid credentials');
      return;
    }

    setLoading(true);
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    const { error } = result;
    console.log('error', error);
    if (error) {
      Alert.alert(error.message || 'Email or password authentication failed');
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    const validation = validateCredentials(email, password);
    if (!validation.valid) {
      Alert.alert(validation.message || 'Invalid credentials');
      return;
    }

    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }
    if (!session) {
      Alert.alert('Please check your inbox for email verification!');
      setLoading(false);
      router.back();
      return;
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      {isSign ? (
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
        </View>
      ) : (
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});
