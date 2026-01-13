import { create } from 'zustand';
import {
  aiService,
  type AnalysisResult,
  type AnalysisResultDto,
  type AnalysisStatus,
  type SubmitAnalysisResponse,
} from '@/services';
import { ANALYSIS_CONFIG } from '@/constants/config';

type AnalysisMode = 'direct' | 'queue';
type ViewSource = 'new' | 'history';

interface AnalysisStore {
  // State
  currentImage: string | null;
  contractId: string | null;
  analysisLogId: string | null;
  analysisResult: AnalysisResult | null;
  queueResult: AnalysisResultDto | null;
  analysisStatus: AnalysisStatus | null;
  isLoading: boolean;
  isPolling: boolean;
  progress: number;
  error: string | null;
  mode: AnalysisMode;
  viewSource: ViewSource;

  // Actions
  setImage: (uri: string) => void;
  setContractId: (id: string) => void;

  // Direct analysis (legacy - for quick image analysis)
  analyzeImage: (uri: string, fileName?: string) => Promise<void>;

  // Queue-based analysis (new - for uploaded contracts)
  submitAnalysis: (contractId: string) => Promise<SubmitAnalysisResponse>;
  pollAnalysisStatus: (analysisLogId: string) => Promise<void>;
  stopPolling: () => void;
  fetchAnalysisResult: (contractId: string) => Promise<void>;

  // History viewing
  loadHistoryResult: (contractId: string) => Promise<void>;

  // Common actions
  clearAnalysis: () => void;
  clearError: () => void;
}

let pollingTimer: ReturnType<typeof setInterval> | null = null;

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  // Initial state
  currentImage: null,
  contractId: null,
  analysisLogId: null,
  analysisResult: null,
  queueResult: null,
  analysisStatus: null,
  isLoading: false,
  isPolling: false,
  progress: 0,
  error: null,
  mode: 'direct',
  viewSource: 'new',

  // Set current image
  setImage: (uri: string) => {
    set({ currentImage: uri, error: null });
  },

  // Set contract ID
  setContractId: (id: string) => {
    set({ contractId: id, error: null });
  },

  // Direct image analysis (legacy endpoint)
  analyzeImage: async (uri: string, fileName?: string) => {
    set({
      currentImage: uri,
      isLoading: true,
      error: null,
      analysisResult: null,
      queueResult: null,
      progress: 0,
      mode: 'direct',
      viewSource: 'new',
    });

    try {
      const result = await aiService.analyzeImage(uri, fileName);

      // Validate result structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid analysis result received');
      }

      set({
        analysisResult: result,
        isLoading: false,
        progress: 100,
      });

      // Refresh contract list to show the newly analyzed contract
      try {
        const { useContractStore } = await import('./contractStore');
        const { fetchContracts } = useContractStore.getState();
        await fetchContracts();
      } catch (refreshError) {
        console.error('Failed to refresh contract list:', refreshError);
        // Don't throw - analysis succeeded, refresh is just a nice-to-have
      }
    } catch (error) {
      console.error('analyzeImage store error:', error);

      let errorMessage: string;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'Analysis failed, please retry';
      }

      set({
        error: errorMessage,
        isLoading: false,
        analysisResult: null,
      });
    }
  },

  // Submit contract for queue-based analysis
  submitAnalysis: async (contractId: string) => {
    set({
      contractId,
      isLoading: true,
      error: null,
      analysisResult: null,
      queueResult: null,
      analysisStatus: null,
      progress: 0,
      mode: 'queue',
      viewSource: 'new',
    });

    try {
      const response = await aiService.submitAnalysis(contractId);
      set({
        analysisLogId: response.analysisLogId,
        analysisStatus: {
          id: response.analysisLogId,
          contractId,
          status: 'pending',
          progress: 0,
          startedAt: new Date().toISOString(),
        },
      });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submit analysis failed';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // Poll for analysis status
  pollAnalysisStatus: async (analysisLogId: string) => {
    const { stopPolling, fetchAnalysisResult } = get();

    // Clear any existing polling
    stopPolling();

    set({ isPolling: true, analysisLogId });

    const poll = async () => {
      try {
        const status = await aiService.getAnalysisStatus(analysisLogId);
        set({
          analysisStatus: status,
          progress: status.progress,
        });

        if (status.status === 'completed') {
          stopPolling();
          set({ isLoading: false, isPolling: false });
          // Fetch the full result
          if (status.contractId) {
            await fetchAnalysisResult(status.contractId);
          }
        } else if (status.status === 'failed') {
          stopPolling();
          set({
            isLoading: false,
            isPolling: false,
            error: status.error || 'Analysis failed',
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get status';
        set({
          error: errorMessage,
          isLoading: false,
          isPolling: false,
        });
        stopPolling();
      }
    };

    // Initial poll
    await poll();

    // Continue polling if still in progress
    const currentStatus = get().analysisStatus;
    if (currentStatus?.status === 'pending' || currentStatus?.status === 'processing') {
      pollingTimer = setInterval(poll, ANALYSIS_CONFIG.pollingInterval);
    }
  },

  // Stop polling
  stopPolling: () => {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
    set({ isPolling: false });
  },

  // Fetch analysis result
  fetchAnalysisResult: async (contractId: string) => {
    try {
      const result = await aiService.getAnalysisResult(contractId);
      if (result) {
        set({ queueResult: result });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get result';
      set({ error: errorMessage });
    }
  },

  // Load historical analysis result
  loadHistoryResult: async (contractId: string) => {
    set({
      contractId,
      isLoading: true,
      error: null,
      analysisResult: null,
      queueResult: null,
      mode: 'queue',
      viewSource: 'history',
    });

    try {
      const result = await aiService.getAnalysisResult(contractId);
      if (result) {
        set({
          queueResult: result,
          isLoading: false,
          progress: 100,
        });
      } else {
        set({
          error: 'No analysis result found for this contract',
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load history';
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  // Clear analysis data
  clearAnalysis: () => {
    const { stopPolling } = get();
    stopPolling();
    set({
      currentImage: null,
      contractId: null,
      analysisLogId: null,
      analysisResult: null,
      queueResult: null,
      analysisStatus: null,
      isLoading: false,
      isPolling: false,
      progress: 0,
      error: null,
      mode: 'direct',
      viewSource: 'new',
    });
  },

  // Clear error message
  clearError: () => {
    set({ error: null });
  },
}));
