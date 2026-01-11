import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCamera, useUpload, useContractHistory } from '@/hooks';

export default function HomeScreen() {
  const router = useRouter();
  const { takePhoto, pickImage } = useCamera();
  const { handleImageAnalysis, isUploading } = useUpload();
  const { contracts, isLoading, refreshHistory } = useContractHistory();

  /**
   * Handle taking a photo and starting analysis
   */
  const onTakePhoto = useCallback(async () => {
    const uri = await takePhoto();
    if (uri) {
      // Navigate to analysis page first for immediate feedback
      router.push('/analysis');
      await handleImageAnalysis(uri);
    }
  }, [takePhoto, handleImageAnalysis, router]);

  /**
   * Handle choosing a file and starting analysis
   */
  const onChooseFile = useCallback(async () => {
    const uri = await pickImage();
    if (uri) {
      // Navigate to analysis page first for immediate feedback
      router.push('/analysis');
      await handleImageAnalysis(uri);
    }
  }, [pickImage, handleImageAnalysis, router]);

  /**
   * Navigate to contract details
   */
  const onContractPress = (id: string) => {
    // router.push(`/(details)/${id}`); // Potential link error, checking app structure
    router.push({
      pathname: '/(details)/[id]',
      params: { id },
    } as any);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshHistory} />}
    >
      {/* Upload Area */}
      <TouchableOpacity
        style={styles.uploadArea}
        activeOpacity={0.7}
        onPress={onTakePhoto}
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

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.btnPrimary}
          activeOpacity={0.8}
          onPress={onTakePhoto}
          disabled={isUploading}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.btnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.btnIcon}>📷</Text>
            <Text style={styles.btnTextPrimary}>
              {isUploading ? 'Processing...' : 'Take Photo'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          activeOpacity={0.8}
          onPress={onChooseFile}
          disabled={isUploading}
        >
          <Text style={styles.btnIcon}>📁</Text>
          <Text style={styles.btnTextSecondary}>Choose File</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Analysis Section */}
      <Text style={styles.sectionLabel}>RECENT ANALYSIS</Text>

      {/* Contract Items */}
      {contracts.length === 0 && !isLoading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No recent contracts found</Text>
        </View>
      ) : (
        contracts.map((contract) => (
          <TouchableOpacity
            key={contract.id}
            style={styles.contractItem}
            activeOpacity={0.7}
            onPress={() => onContractPress(contract.id)}
          >
            <View style={styles.contractIcon}>
              <Text style={styles.contractIconText}>📋</Text>
            </View>
            <View style={styles.contractInfo}>
              <Text style={styles.contractName} numberOfLines={1}>
                {contract.name}
              </Text>
              <Text style={styles.contractMeta}>
                {new Date(contract.uploadedAt).toLocaleDateString()}
              </Text>
            </View>
            <View
              style={[
                styles.contractStatus,
                contract.status === 'completed' && styles.statusCompleted,
                contract.status === 'failed' && styles.statusFailed,
              ]}
            >
              <Text style={styles.contractStatusText}>{contract.status}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
  },
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
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  btnPrimary: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  btnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 8,
    gap: 8,
  },
  btnIcon: {
    fontSize: 18,
  },
  btnTextPrimary: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  btnTextSecondary: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
  },
  contractItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  contractIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contractIconText: {
    fontSize: 20,
  },
  contractInfo: {
    flex: 1,
  },
  contractName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contractMeta: {
    fontSize: 11,
    color: '#999',
  },
  contractStatus: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  contractStatusText: {
    fontSize: 11,
    color: '#666',
    textTransform: 'capitalize',
  },
  statusCompleted: {
    backgroundColor: '#e6fffa',
  },
  statusFailed: {
    backgroundColor: '#fff5f5',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});
