import { useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useCameraPermissions } from 'expo-camera';

/**
 * Hook for handling camera, gallery, and document picker interactions
 */
export const useCamera = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const checkCameraPermission = useCallback(async () => {
    if (!cameraPermission?.granted) {
      const { status } = await requestCameraPermission();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos');
        return false;
      }
    }
    return true;
  }, [cameraPermission, requestCameraPermission]);

  const checkGalleryPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Media library permission is required');
      return false;
    }
    return true;
  }, []);

  const takePhoto = useCallback(async () => {
    const hasPermission = await checkCameraPermission();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
    } catch (error) {
      console.error('takePhoto error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
    return null;
  }, [checkCameraPermission]);

  const pickImage = useCallback(async () => {
    const hasPermission = await checkGalleryPermission();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
    } catch (error) {
      console.error('pickImage error:', error);
      Alert.alert('Error', 'Failed to select image');
    }
    return null;
  }, [checkGalleryPermission]);

  /**
   * Pick a document (PDF, Word, or image) from the file system
   * Returns an object with uri and fileName
   */
  const pickDocument = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'image/*', // All image types
          'application/pdf', // PDF files
          'application/msword', // Word .doc files
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word .docx files
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets[0]) {
        return {
          uri: result.assets[0].uri,
          fileName: result.assets[0].name,
        };
      }
    } catch (error) {
      console.error('pickDocument error:', error);
      Alert.alert('Error', 'Failed to select document');
    }
    return null;
  }, []);

  return {
    takePhoto,
    pickImage,
    pickDocument,
    cameraPermission,
    requestCameraPermission,
  };
};
