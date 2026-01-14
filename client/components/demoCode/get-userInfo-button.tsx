import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import type { User } from '@/types/store';
import { apiClient } from '@/services/apiV2';

export type GetUserInfoButtonProps = {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
};

export function GetUserInfoButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetUserInfo = async () => {
    setIsLoading(true);
    try {
      const userInfo = await apiClient.post(`users/me`, {});
      console.log('userInfo', userInfo);
      Alert.alert('userInfo', JSON.stringify(userInfo));

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, isLoading && styles.buttonDisabled]}
      onPress={handleGetUserInfo}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.buttonText}>Loading...</Text>
        </View>
      ) : (
        <Text style={styles.buttonText}>Get User Info</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
