import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Password updated successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set New Password</Text>
      {email && <Text style={styles.subtitle}>For {email}</Text>}
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        editable={!loading}
      />
      <Button
        title={loading ? 'Updating...' : 'Update Password'}
        onPress={handleUpdatePassword}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, justifyContent: 'center', flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 10, fontSize: 18 },
});
