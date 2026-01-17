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
   * Supports both single and multiple images
   */
  const handleImageAnalysis = useCallback(
    async (uriOrUris: string | string[], fileName?: string) => {
      try {
        // Clear previous states
        clearAnalysis();
        clearUploads();

        // Normalize to array
        const uris = Array.isArray(uriOrUris) ? uriOrUris : [uriOrUris];

        if (uris.length === 0) {
          return false;
        }

        // For now, analyze the first image
        // TODO: Support batch analysis or multi-page contract analysis
        await analyzeImage(uris[0], fileName);
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
