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
  const { pickImage, pickDocument } = useCamera();
  const { handleImageAnalysis, isUploading } = useUpload();
  const { contracts, isLoading, refreshHistory, deleteHistoryItem } = useContractHistory();
  console.log('contracts: ', contracts);

  /**
   * Handle taking multiple photos and starting analysis
   */
  const onTakePhoto = useCallback(() => {
    // Navigate to custom camera page for multi-photo capture
    router.push('/camera');
  }, [router]);

  /**
   * Handle choosing a photo from gallery and starting analysis
   */
  const onChoosePhoto = useCallback(async () => {
    // Allow selecting up to 5 images
    const uris = await pickImage(5);
    if (uris.length > 0) {
      // Navigate to analysis page first for immediate feedback
      router.push('/analysis');
      await handleImageAnalysis(uris);
    }
  }, [pickImage, handleImageAnalysis, router]);

  /**
   * Handle choosing a document (PDF, Word, or image) and starting analysis
   */
  const onChooseDocument = useCallback(async () => {
    const result = await pickDocument();
    if (result) {
      // Navigate to analysis page first for immediate feedback
      router.push('/analysis');
      await handleImageAnalysis(result.uri, result.fileName);
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
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshHistory} />}
      >
        {/* Primary Action Button - Take Photo */}
        <TouchableOpacity
          style={styles.btnPrimary}
          activeOpacity={0.8}
          onPress={onTakePhoto}
          disabled={isUploading}
        >
          <LinearGradient
            colors={['#1e293b', '#334155']}
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

        {/* Secondary Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.btnSecondary}
            activeOpacity={0.8}
            onPress={onChoosePhoto}
            disabled={isUploading}
          >
            <Text style={styles.btnIcon}>🖼️</Text>
            <Text style={styles.btnTextSecondary}>Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            activeOpacity={0.8}
            onPress={onChooseDocument}
            disabled={isUploading}
          >
            <Text style={styles.btnIcon}>📁</Text>
            <Text style={styles.btnTextSecondary}>Document</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9', // Cool slate background
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  btnPrimary: {
    width: '100%',
    height: 60,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  btnSecondary: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    borderRadius: 14,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  btnIcon: {
    fontSize: 20,
  },
  btnTextPrimary: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  btnTextSecondary: {
    color: '#475569', // Slate 600
    fontSize: 13,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8', // Slate 400
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
});
