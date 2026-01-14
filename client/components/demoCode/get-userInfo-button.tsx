import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { apiClient } from '@/services';
import type { User } from '@/types/store';

export type GetUserInfoButtonProps = {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
};

export function GetUserInfoButton({ onSuccess, onError }: GetUserInfoButtonProps = {}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetUserInfo = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<{ success: boolean; data: User }>(`users/me`, {});
      const userData = response.data.data;
      console.log('response.data.data', userData);

      if (onSuccess) {
        onSuccess(userData);
      } else {
        Alert.alert('User Info', JSON.stringify(userData, null, 2));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get user info';
      console.error('Get user info error:', errorMessage);

      if (onError) {
        onError(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
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
