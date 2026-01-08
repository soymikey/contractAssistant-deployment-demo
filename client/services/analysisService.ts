import { apiClient, handleApiError, type ApiResponse } from './api';
import type { ContractAnalysis, Risk } from '@/types/store';

/**
 * Analysis API Request/Response Types
 */
export interface StartAnalysisRequest {
  contractId: string;
  options?: {
    deepAnalysis?: boolean;
    includeRecommendations?: boolean;
    language?: 'en' | 'zh';
  };
}

export interface StartAnalysisResponse {
  analysisId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedTime?: number; // in seconds
}

export interface AnalysisStatusResponse {
  analysisId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number; // 0-100
  message?: string;
  result?: ContractAnalysis;
}

export interface RiskDetailResponse {
  risk: Risk;
  examples?: string[];
  legalReferences?: {
    title: string;
    url: string;
    description: string;
  }[];
}

/**
 * Analysis Service
 * Handles all AI analysis-related API calls
 */
class AnalysisService {
  private readonly endpoint = '/analysis';

  /**
   * Start contract analysis
   */
  async startAnalysis(
    contractId: string,
    options?: StartAnalysisRequest['options']
  ): Promise<StartAnalysisResponse> {
    try {
      const response = await apiClient.post<ApiResponse<StartAnalysisResponse>>(
        `${this.endpoint}/start`,
        { contractId, options } as StartAnalysisRequest
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get analysis status (for polling)
   */
  async getAnalysisStatus(analysisId: string): Promise<AnalysisStatusResponse> {
    try {
      const response = await apiClient.get<ApiResponse<AnalysisStatusResponse>>(
        `${this.endpoint}/${analysisId}/status`
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get completed analysis result
   */
  async getAnalysisResult(analysisId: string): Promise<ContractAnalysis> {
    try {
      const response = await apiClient.get<ApiResponse<ContractAnalysis>>(
        `${this.endpoint}/${analysisId}`
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Cancel ongoing analysis
   */
  async cancelAnalysis(analysisId: string): Promise<void> {
    try {
      await apiClient.post(`${this.endpoint}/${analysisId}/cancel`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get detailed information about a specific risk
   */
  async getRiskDetail(riskId: string): Promise<RiskDetailResponse> {
    try {
      const response = await apiClient.get<ApiResponse<RiskDetailResponse>>(
        `${this.endpoint}/risks/${riskId}`
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Re-analyze a contract with different options
   */
  async reAnalyze(
    contractId: string,
    options?: StartAnalysisRequest['options']
  ): Promise<StartAnalysisResponse> {
    try {
      const response = await apiClient.post<ApiResponse<StartAnalysisResponse>>(
        `${this.endpoint}/re-analyze`,
        { contractId, options } as StartAnalysisRequest
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get analysis history for a contract
   */
  async getAnalysisHistory(contractId: string): Promise<ContractAnalysis[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ analyses: ContractAnalysis[] }>>(
        `${this.endpoint}/history/${contractId}`
      );

      return response.data.data.analyses;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Poll analysis status until completion
   * @param analysisId - Analysis ID to poll
   * @param onProgress - Callback for progress updates
   * @param interval - Polling interval in ms (default: 3000)
   * @param maxAttempts - Maximum polling attempts (default: 100)
   */
  async pollAnalysisStatus(
    analysisId: string,
    onProgress?: (progress: number, status: string) => void,
    interval: number = 3000,
    maxAttempts: number = 100
  ): Promise<ContractAnalysis> {
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          attempts++;

          if (attempts > maxAttempts) {
            reject(new Error('Analysis timeout - maximum attempts reached'));
            return;
          }

          const statusResponse = await this.getAnalysisStatus(analysisId);

          // Update progress callback
          if (onProgress) {
            onProgress(statusResponse.progress || 0, statusResponse.status);
          }

          if (statusResponse.status === 'completed' && statusResponse.result) {
            resolve(statusResponse.result);
          } else if (statusResponse.status === 'failed') {
            reject(new Error(statusResponse.message || 'Analysis failed'));
          } else {
            // Continue polling
            setTimeout(poll, interval);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }
}

// Export singleton instance
export const analysisService = new AnalysisService();
