import { useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCameraPermissions } from 'expo-camera';

/**
 * Hook for handling camera and gallery interactions
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

  return {
    takePhoto,
    pickImage,
    cameraPermission,
    requestCameraPermission,
  };
};
