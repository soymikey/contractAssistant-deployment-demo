import axios from 'axios';
import { API_CONFIG } from '@/constants/config';

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

// Response wrapper from server's global interceptor
interface ApiResponseWrapper<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp?: string;
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
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
  }

  /**
   * Unwrap the server's standard API response format
   * Server wraps all responses in: { statusCode, message, data, timestamp }
   * @param response - The axios response data
   * @returns The unwrapped data of type T
   */
  private unwrapResponse<T>(response: unknown): T {
    // Check if response is wrapped format
    if (
      response &&
      typeof response === 'object' &&
      'statusCode' in response &&
      'data' in response
    ) {
      const wrapped = response as ApiResponseWrapper<T>;
      if (wrapped.statusCode >= 200 && wrapped.statusCode < 300) {
        return wrapped.data;
      }
      throw new Error(wrapped.message || 'Request failed');
    }

    // If not wrapped, return as-is (fallback for edge cases)
    return response as T;
  }

  /**
   * Submit a contract for queue-based analysis
   * @param contractId - Contract ID to analyze
   * @returns Submit response with job ID and analysis log ID
   */
  async submitAnalysis(contractId: string): Promise<SubmitAnalysisResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/analyses`,
        { contractId },
        {
          timeout: API_CONFIG.timeout,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return this.unwrapResponse<SubmitAnalysisResponse>(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Submit analysis failed: ${message}`);
      }
      throw error;
    }
  }

  /**
   * Get analysis status by analysis log ID
   * @param analysisLogId - Analysis log ID
   * @returns Analysis status with progress
   */
  async getAnalysisStatus(analysisLogId: string): Promise<AnalysisStatus> {
    try {
      const response = await axios.get(
        `${this.baseURL}/analyses/status/${analysisLogId}`,
        {
          timeout: API_CONFIG.timeout,
        }
      );

      return this.unwrapResponse<AnalysisStatus>(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Get analysis status failed: ${message}`);
      }
      throw error;
    }
  }

  /**
   * Get analysis result by contract ID
   * @param contractId - Contract ID
   * @returns Analysis result with risks, key terms, and recommendations
   */
  async getAnalysisResult(contractId: string): Promise<AnalysisResultDto | null> {
    try {
      const response = await axios.get(
        `${this.baseURL}/analyses/contract/${contractId}`,
        {
          timeout: API_CONFIG.timeout,
        }
      );

      return this.unwrapResponse<AnalysisResultDto>(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return null;
        }
        const message = error.response?.data?.message || error.message;
        throw new Error(`Get analysis result failed: ${message}`);
      }
      throw error;
    }
  }

  /**
   * Get risks for a contract
   * @param contractId - Contract ID
   * @returns List of risk items
   */
  async getRisks(contractId: string): Promise<RiskItem[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/analyses/contract/${contractId}/risks`,
        {
          timeout: API_CONFIG.timeout,
        }
      );

      return this.unwrapResponse<RiskItem[]>(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Get risks failed: ${message}`);
      }
      throw error;
    }
  }

  /**
   * Get analysis history for a contract
   * @param contractId - Contract ID
   * @returns List of analysis history items
   */
  async getAnalysisHistory(contractId: string): Promise<AnalysisHistoryItem[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/analyses/contract/${contractId}/history`,
        {
          timeout: API_CONFIG.timeout,
        }
      );

      return this.unwrapResponse<AnalysisHistoryItem[]>(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Get analysis history failed: ${message}`);
      }
      throw error;
    }
  }

  /**
   * Direct image analysis (legacy endpoint for quick analysis)
   * @param imageUri - Local image URI from camera or gallery
   * @returns Analysis result with risks, key terms, and recommendations
   */
  async analyzeImage(imageUri: string): Promise<AnalysisResult> {
    try {
      // Convert image to base64
      const base64Image = await this.convertImageToBase64(imageUri);

      console.info(`Calling: ${this.baseURL}/analyses/analyze`);

      // Call backend API
      // Server returns: { statusCode, message, data: AnalysisResult } via global interceptor
      const response = await axios.post(
        `${this.baseURL}/analyses/analyze`,
        {
          image: base64Image,
          mimeType: 'image/jpeg',
        },
        {
          timeout: API_CONFIG.timeout,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.info(
        'Response received:',
        JSON.stringify(response.data, null, 2).slice(0, 500)
      );

      return this.unwrapResponse<AnalysisResult>(response.data);
    } catch (error) {
      console.error('analyzeImage error:', error);

      if (axios.isAxiosError(error)) {
        // Network or HTTP error
        const serverMessage = error.response?.data?.message;
        const errorMessage =
          typeof serverMessage === 'string' ? serverMessage : error.message;
        throw new Error(`Analysis failed: ${errorMessage}`);
      }

      // Re-throw if it's already a proper Error
      if (error instanceof Error) {
        throw error;
      }

      // Unknown error type
      throw new Error('Analysis failed: Unknown error occurred');
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

  /**
   * Health check for AI analysis service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseURL}/analyses/health`);
      const data = this.unwrapResponse<{ status: string }>(response.data);
      return data.status === 'ok';
    } catch {
      return false;
    }
  }
}

export const aiService = new AiService();
