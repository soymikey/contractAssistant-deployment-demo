import { create } from 'zustand';
import { aiService, type AnalysisResult } from '@/services';

interface AnalysisStore {
  // State
  currentImage: string | null;
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setImage: (uri: string) => void;
  analyzeImage: (uri: string) => Promise<void>;
  clearAnalysis: () => void;
  clearError: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  // Initial state
  currentImage: null,
  analysisResult: null,
  isLoading: false,
  error: null,

  // Set current image
  setImage: (uri: string) => {
    set({ currentImage: uri, error: null });
  },

  // Analyze image using AI service
  analyzeImage: async (uri: string) => {
    set({
      currentImage: uri,
      isLoading: true,
      error: null,
      analysisResult: null,
    });

    try {
      const result = await aiService.analyzeImage(uri);
      set({
        analysisResult: result,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '分析失败，请重试';
      set({
        error: errorMessage,
        isLoading: false,
        analysisResult: null,
      });
    }
  },

  // Clear analysis data
  clearAnalysis: () => {
    set({
      currentImage: null,
      analysisResult: null,
      isLoading: false,
      error: null,
    });
  },

  // Clear error message
  clearError: () => {
    set({ error: null });
  },
}));
