import { useCallback } from 'react';
import { useAnalysisStore } from '@/stores/analysisStore';
import { useUploadStore } from '@/stores/uploadStore';

/**
 * Hook for managing contract file/image uploads and initial analysis
 */
export const useUpload = () => {
  const {
    analyzeImage,
    clearAnalysis,
    isLoading: isAnalyzing,
    error: analysisError,
  } = useAnalysisStore();
  const { isUploading, currentUpload, clearAll: clearUploads } = useUploadStore();

  /**
   * Handle image analysis flow (direct analysis for quick feedback)
   */
  const handleImageAnalysis = useCallback(
    async (uri: string) => {
      try {
        // Clear previous states
        clearAnalysis();
        clearUploads();

        // Start direct analysis
        await analyzeImage(uri);
        return true;
      } catch (error) {
        console.error('handleImageAnalysis error:', error);
        return false;
      }
    },
    [analyzeImage, clearAnalysis, clearUploads]
  );

  return {
    handleImageAnalysis,
    isUploading: isUploading || isAnalyzing,
    currentUpload,
    error: analysisError,
  };
};
