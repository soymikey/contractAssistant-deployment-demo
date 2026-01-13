import { apiClient, handleApiError, type ApiResponse } from './api';

// Type definitions matching server-side interfaces

export interface RiskItem {
  id?: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category?: 'legal' | 'financial' | 'operational' | 'compliance' | 'other';
  suggestion?: string;
  clauseRef?: string;
}

export interface KeyTerm {
  title: string;
  content: string;
  importance: 'critical' | 'important' | 'normal';
}

export interface ContractInfo {
  type?: string;
  parties?: string[];
  effectiveDate?: string;
  expirationDate?: string;
  totalValue?: string;
}

// Direct analysis result
export interface AnalysisResult {
  summary: string;
  riskLevel: 'high' | 'medium' | 'low';
  risks: RiskItem[];
  keyTerms: KeyTerm[];
  recommendations: string[];
  contractInfo?: ContractInfo;
  analyzedAt: string;
}

// Queue-based analysis types
export interface SubmitAnalysisResponse {
  jobId: string;
  analysisLogId: string;
  status: string;
  message: string;
}

export interface AnalysisStatus {
  id: string;
  contractId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

export interface OverviewData {
  summary: string;
  riskLevel: 'high' | 'medium' | 'low';
  keyTerms: KeyTerm[];
  contractInfo?: ContractInfo;
  analyzedAt: string;
}

export interface SuggestionsData {
  recommendations: string[];
}

export interface AnalysisResultDto {
  id: string;
  contractId: string;
  type: string;
  overviewData: OverviewData;
  suggestionsData: SuggestionsData;
  createdAt: string;
  risks: RiskItem[];
}

export interface AnalysisHistoryItem {
  id: string;
  contractId: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

/**
 * AI Analysis Service
 * Handles communication with the backend AI analysis API
 */
class AiService {
  private readonly endpoint = '/analyses';

  constructor() {}

  async submitAnalysis(contractId: string): Promise<SubmitAnalysisResponse> {
    try {
      const response = await apiClient.post<ApiResponse<SubmitAnalysisResponse>>(this.endpoint, {
        contractId,
      });

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getAnalysisStatus(analysisLogId: string): Promise<AnalysisStatus> {
    try {
      const response = await apiClient.get<ApiResponse<AnalysisStatus>>(
        `${this.endpoint}/status/${analysisLogId}`
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getAnalysisResult(contractId: string): Promise<AnalysisResultDto | null> {
    try {
      const response = await apiClient.get<ApiResponse<AnalysisResultDto>>(
        `${this.endpoint}/contract/${contractId}`
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getRisks(contractId: string): Promise<RiskItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<RiskItem[]>>(
        `${this.endpoint}/contract/${contractId}/risks`
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getAnalysisHistory(contractId: string): Promise<AnalysisHistoryItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<AnalysisHistoryItem[]>>(
        `${this.endpoint}/contract/${contractId}/history`
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async analyzeImage(imageUri: string, fileName?: string): Promise<AnalysisResult> {
    try {
      // Convert image to base64
      const base64Image = await this.convertImageToBase64(imageUri);

      // Call backend API
      const response = await apiClient.post<ApiResponse<AnalysisResult>>(
        `${this.endpoint}/analyze`,
        {
          image: base64Image,
          mimeType: 'image/jpeg',
          fileName, // Include fileName if provided
        }
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Convert local image URI to base64 string
   * @param imageUri - Local image URI
   * @returns Base64 encoded image string
   */
  private async convertImageToBase64(imageUri: string): Promise<string> {
    try {
      // For React Native, we need to fetch the image and convert to base64
      const response = await fetch(imageUri);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Image conversion failed: ${message}`);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await apiClient.post<ApiResponse<{ status: string }>>(
        `${this.endpoint}/health`
      );
      return response.data.data.status === 'ok';
    } catch {
      return false;
    }
  }
}

export const aiService = new AiService();
