import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface UploadAreaProps {
  onPress: () => void;
  isUploading: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onPress, isUploading }) => {
  return (
    <TouchableOpacity
      style={styles.uploadArea}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={isUploading}
    >
      <LinearGradient
        colors={['#667eea15', '#764ba215']}
        style={styles.uploadGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.uploadIcon}>📄</Text>
        <Text style={styles.uploadText}>
          {isUploading ? 'Processing...' : 'Tap to Upload or Take Photo'}
        </Text>
        <Text style={styles.uploadSubtext}>Supports contract photos, PDF, Word files</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  uploadArea: {
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  uploadGradient: {
    borderWidth: 2,
    borderColor: '#667eea',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  uploadSubtext: {
    color: '#999',
    fontSize: 12,
  },
});
