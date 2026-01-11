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
import { useAnalysisStore } from '@/stores';
import { ContractList } from '@/components';

export default function HomeScreen() {
  const router = useRouter();
  const { takePhoto, pickImage, pickDocument } = useCamera();
  const { handleImageAnalysis, isUploading } = useUpload();
  const { contracts, isLoading, refreshHistory, deleteHistoryItem } = useContractHistory();

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
   * Handle choosing a photo from gallery and starting analysis
   */
  const onChoosePhoto = useCallback(async () => {
    const uri = await pickImage();
    if (uri) {
      // Navigate to analysis page first for immediate feedback
      router.push('/analysis');
      await handleImageAnalysis(uri);
    }
  }, [pickImage, handleImageAnalysis, router]);

  /**
   * Handle choosing a document (PDF, Word, or image) and starting analysis
   */
  const onChooseDocument = useCallback(async () => {
    const uri = await pickDocument();
    if (uri) {
      // Navigate to analysis page first for immediate feedback
      router.push('/analysis');
      await handleImageAnalysis(uri);
    }
  }, [pickDocument, handleImageAnalysis, router]);

  /**
   * Navigate to contract details - loads historical analysis
   */
  const onContractPress = useCallback(
    (id: string) => {
      const { loadHistoryResult } = useAnalysisStore.getState();
      // Load historical analysis result
      loadHistoryResult(id);
      // Navigate to analysis page
      router.push('/analysis');
    },
    [router]
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshHistory} />}
    >
      {/* Primary Action Button */}
      <View style={styles.primaryButtonContainer}>
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
      </View>

      {/* Secondary Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.btnSecondary}
          activeOpacity={0.8}
          onPress={onChoosePhoto}
          disabled={isUploading}
        >
          <Text style={styles.btnIcon}>🖼️</Text>
          <Text style={styles.btnTextSecondary}>Choose Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          activeOpacity={0.8}
          onPress={onChooseDocument}
          disabled={isUploading}
        >
          <Text style={styles.btnIcon}>📁</Text>
          <Text style={styles.btnTextSecondary}>Choose Document</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Analysis Section */}
      <Text style={styles.sectionLabel}>RECENT ANALYSIS</Text>

      {/* Contract Items */}
      <ContractList
        contracts={contracts}
        onContractPress={onContractPress}
        onDeleteContract={deleteHistoryItem}
        isLoading={isLoading}
      />
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
  primaryButtonContainer: {
    marginBottom: 10,
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
});
