import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAnalysisStore } from '@/stores';
// import { compressImage } from '@/utils/imageUtils'; // Available for future use

export default function HomeScreen() {
  const router = useRouter();
  const { analyzeImage } = useAnalysisStore();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for recent analysis
  const recentContracts = [
    {
      id: '1',
      name: 'Employment_Contract_2025.pdf',
      time: '2 hours ago',
      status: 'Analyzed',
    },
    {
      id: '2',
      name: 'Purchase_Agreement_001.png',
      time: '1 day ago',
      status: 'Analyzed',
    },
    {
      id: '3',
      name: 'Lease_Agreement.docx',
      time: '3 days ago',
      status: 'Analyzed',
    },
  ];

  const handleTakePhoto = async () => {
    try {
      // Check camera permission
      if (!cameraPermission) {
        const { status } = await requestCameraPermission();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Camera permission is required to take photos');
          return;
        }
      }

      if (!cameraPermission?.granted) {
        const { status } = await requestCameraPermission();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Camera permission is required to take photos');
          return;
        }
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1, // Reduce quality to 50% for smaller file size
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setIsLoading(true);

        // Navigate to analysis page
        router.push('/analysis');

        // Use original image without compression for best AI accuracy
        // To enable compression, uncomment the line below:
        // const compressedUri = await compressImage(imageUri, 1536, 0.8);
        // await analyzeImage(compressedUri);

        // Start analysis with original image
        await analyzeImage(imageUri);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to take photo');
    }
  };

  const handleChooseFile = async () => {
    try {
      // Request media library permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Media library permission is required');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.5, // Reduce quality to 50% for smaller file size
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setIsLoading(true);

        // Navigate to analysis page
        router.push('/analysis');

        // Use original image without compression for best AI accuracy
        // To enable compression, uncomment the line below:
        // const compressedUri = await compressImage(imageUri, 1536, 0.8);
        // await analyzeImage(compressedUri);

        // Start analysis with original image
        await analyzeImage(imageUri);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to choose image');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Upload Area */}
      <TouchableOpacity
        style={styles.uploadArea}
        activeOpacity={0.7}
        onPress={handleTakePhoto}
        disabled={isLoading}
      >
        <LinearGradient
          colors={['#667eea15', '#764ba215']}
          style={styles.uploadGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.uploadIcon}>📄</Text>
          <Text style={styles.uploadText}>
            {isLoading ? 'Processing...' : 'Tap to Upload or Take Photo'}
          </Text>
          <Text style={styles.uploadSubtext}>Supports contract photos, PDF, Word files</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.btnPrimary}
          activeOpacity={0.8}
          onPress={handleTakePhoto}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.btnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.btnIcon}>📷</Text>
            <Text style={styles.btnTextPrimary}>{isLoading ? 'Processing...' : 'Take Photo'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          activeOpacity={0.8}
          onPress={handleChooseFile}
          disabled={isLoading}
        >
          <Text style={styles.btnIcon}>📁</Text>
          <Text style={styles.btnTextSecondary}>Choose File</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Analysis Section */}
      <Text style={styles.sectionLabel}>RECENT ANALYSIS</Text>

      {/* Contract Items */}
      {recentContracts.map((contract) => (
        <TouchableOpacity key={contract.id} style={styles.contractItem} activeOpacity={0.7}>
          <View style={styles.contractIcon}>
            <Text style={styles.contractIconText}>📋</Text>
          </View>
          <View style={styles.contractInfo}>
            <Text style={styles.contractName}>{contract.name}</Text>
            <Text style={styles.contractMeta}>{contract.time}</Text>
          </View>
          <View style={styles.contractStatus}>
            <Text style={styles.contractStatusText}>{contract.status}</Text>
          </View>
        </TouchableOpacity>
      ))}
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
  },
});
