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
      const result = await requestCameraPermission();
      if (!result.granted) {
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

  /**
   * Take a single photo with camera
   * @returns Array containing the photo URI (for consistency with pickImage)
   */
  const takePhoto = useCallback(async () => {
    const hasPermission = await checkCameraPermission();
    if (!hasPermission) return [];

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        return [result.assets[0].uri];
      }
    } catch (error) {
      console.error('takePhoto error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
    return [];
  }, [checkCameraPermission]);

  /**
   * Pick images from gallery
   * @param selectionLimit - Maximum number of images to select (0 = unlimited, default = 1)
   * @returns Array of image URIs
   */
  const pickImage = useCallback(
    async (selectionLimit: number = 1) => {
      const hasPermission = await checkGalleryPermission();
      if (!hasPermission) return [];

      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          allowsMultipleSelection: selectionLimit !== 1,
          selectionLimit: selectionLimit,
          quality: 0.8,
          base64: false,
        });

        if (!result.canceled && result.assets.length > 0) {
          return result.assets.map((asset) => asset.uri);
        }
      } catch (error) {
        console.error('pickImage error:', error);
        Alert.alert('Error', 'Failed to select image');
      }
      return [];
    },
    [checkGalleryPermission]
  );

  /**
   * Take multiple photos continuously
   * User can take photos one by one until they cancel
   * @returns Array of photo URIs
   */
  const takePhotos = useCallback(async () => {
    const hasPermission = await checkCameraPermission();
    if (!hasPermission) return [];

    const uris: string[] = [];
    let shouldContinue = true;

    while (shouldContinue) {
      try {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 1,
          base64: false,
        });

        if (!result.canceled && result.assets[0]) {
          uris.push(result.assets[0].uri);

          // Ask if user wants to take another photo
          await new Promise<void>((resolve) => {
            Alert.alert('Photo Captured', `${uris.length} photo(s) captured. Take another?`, [
              {
                text: 'Done',
                onPress: () => {
                  shouldContinue = false;
                  resolve();
                },
              },
              {
                text: 'Take Another',
                onPress: () => resolve(),
              },
            ]);
          });
        } else {
          // User canceled camera
          shouldContinue = false;
        }
      } catch (error) {
        console.error('takePhotos error:', error);
        Alert.alert('Error', 'Failed to take photo');
        shouldContinue = false;
      }
    }

    return uris;
  }, [checkCameraPermission]);

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
    takePhotos,
    pickImage,
    pickDocument,
    cameraPermission,
    requestCameraPermission,
  };
};
