import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Compress and resize image for AI analysis
 * Optimized for text recognition in contracts
 *
 * @param uri - Image URI
 * @param maxWidth - Maximum width (default 1536 for better OCR)
 * @param quality - Compression quality 0-1 (default 0.8 for clear text)
 * @returns Compressed image URI
 */
export async function compressImage(
  uri: string,
  maxWidth: number = 1536,
  quality: number = 0.8
): Promise<string> {
  try {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth } }], // Resize to max width, height auto
      {
        compress: quality,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return manipulatedImage.uri;
  } catch (error) {
    console.error('Image compression failed:', error);
    // If compression fails, return original URI
    return uri;
  }
}

/**
 * Get file size estimation in KB
 * @param uri - Image URI
 * @returns Estimated file size in KB
 */
export function estimateBase64Size(width: number, height: number, quality: number): number {
  // Rough estimation: (width * height * 3 * quality * 1.33) / 1024
  // 3 = RGB channels, 1.33 = base64 overhead
  return Math.round((width * height * 3 * quality * 1.33) / 1024);
}

/**
 * Compress with smart quality adjustment
 * Automatically reduces quality if file is too large
 *
 * @param uri - Image URI
 * @param targetSizeKB - Target file size in KB (default 800KB)
 * @returns Compressed image URI
 */
export async function compressImageSmart(uri: string, targetSizeKB: number = 800): Promise<string> {
  try {
    // Try with high quality first (good for OCR)
    let result = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 1536 } }], {
      compress: 0.8,
      format: ImageManipulator.SaveFormat.JPEG,
    });

    // If still too large, try medium quality
    const estimatedSize = estimateBase64Size(1536, 1536, 0.8);
    if (estimatedSize > targetSizeKB) {
      result = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 1280 } }], {
        compress: 0.7,
        format: ImageManipulator.SaveFormat.JPEG,
      });
    }

    return result.uri;
  } catch (error) {
    console.error('Smart compression failed:', error);
    return uri;
  }
}
