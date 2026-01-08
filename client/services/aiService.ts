import axios from 'axios';
import { API_CONFIG } from '@/constants/config';

// Type definitions matching server-side interfaces
export interface RiskItem {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface KeyTerm {
  title: string;
  content: string;
  importance: 'critical' | 'important' | 'normal';
}

export interface AnalysisResult {
  summary: string;
  riskLevel: 'high' | 'medium' | 'low';
  risks: RiskItem[];
  keyTerms: KeyTerm[];
  recommendations: string[];
  analyzedAt: string;
}

export interface AnalysisResponse {
  success: boolean;
  data: AnalysisResult | null;
  message?: string;
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
   * Analyze a contract image using Google Gemini AI
   * @param imageUri - Local image URI from camera or gallery
   * @returns Analysis result with risks, key terms, and recommendations
   */
  async analyzeImage(imageUri: string): Promise<AnalysisResult> {
    try {
      // Convert image to base64
      const base64Image = await this.convertImageToBase64(imageUri);

      console.info(`${this.baseURL}/ai-analysis/analyze`);

      // Call backend API
      const response = await axios.post<AnalysisResponse>(
        `${this.baseURL}/ai-analysis/analyze`,
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

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Analysis failed');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Analysis failed: ${message}`);
      }
      throw error;
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
      const response = await axios.post(`${this.baseURL}/ai-analysis/health`);
      return response.data.status === 'ok';
    } catch {
      return false;
    }
  }
}

export const aiService = new AiService();
