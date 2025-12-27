import { apiClient, handleApiError, ApiResponse } from './api';
import type { Contract, ContractAnalysis } from '../types/store';

/**
 * Contract API Request/Response Types
 */
export interface ContractListParams {
  page?: number;
  limit?: number;
  status?: Contract['status'];
  sortBy?: 'uploadedAt' | 'analyzedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface ContractListResponse {
  contracts: Contract[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface UploadContractRequest {
  name: string;
  file: string; // Base64 or file URI
  type: string;
}

export interface UploadContractResponse {
  contract: Contract;
  uploadUrl?: string;
}

export interface UpdateContractRequest {
  name?: string;
  status?: Contract['status'];
}

/**
 * Contract Service
 * Handles all contract-related API calls
 */
class ContractService {
  private readonly endpoint = '/contracts';

  /**
   * Get list of contracts with pagination and filtering
   */
  async getContracts(params?: ContractListParams): Promise<ContractListResponse> {
    try {
      const response = await apiClient.get<ApiResponse<ContractListResponse>>(this.endpoint, {
        params,
      });

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get contract by ID
   */
  async getContractById(id: string): Promise<Contract> {
    try {
      const response = await apiClient.get<ApiResponse<Contract>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Upload a new contract
   */
  async uploadContract(
    name: string,
    file: string,
    type: string,
    onProgress?: (progress: number) => void
  ): Promise<Contract> {
    try {
      const response = await apiClient.post<ApiResponse<Contract>>(
        `${this.endpoint}/upload`,
        { name, file, type } as UploadContractRequest,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(percentCompleted);
            }
          },
        }
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update contract details
   */
  async updateContract(id: string, updates: UpdateContractRequest): Promise<Contract> {
    try {
      const response = await apiClient.patch<ApiResponse<Contract>>(
        `${this.endpoint}/${id}`,
        updates
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete a contract
   */
  async deleteContract(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get contract analysis results
   */
  async getAnalysis(contractId: string): Promise<ContractAnalysis> {
    try {
      const response = await apiClient.get<ApiResponse<ContractAnalysis>>(
        `${this.endpoint}/${contractId}/analysis`
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get contract original text/content
   */
  async getContractContent(contractId: string): Promise<string> {
    try {
      const response = await apiClient.get<ApiResponse<{ content: string }>>(
        `${this.endpoint}/${contractId}/content`
      );

      return response.data.data.content;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get favorites list
   */
  async getFavorites(): Promise<Contract[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ contracts: Contract[] }>>(
        `${this.endpoint}/favorites`
      );

      return response.data.data.contracts;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Add contract to favorites
   */
  async addToFavorites(contractId: string): Promise<void> {
    try {
      await apiClient.post(`${this.endpoint}/${contractId}/favorite`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Remove contract from favorites
   */
  async removeFromFavorites(contractId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.endpoint}/${contractId}/favorite`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Export contract analysis as PDF
   */
  async exportToPdf(contractId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`${this.endpoint}/${contractId}/export/pdf`, {
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Share contract analysis link
   */
  async shareContract(contractId: string): Promise<string> {
    try {
      const response = await apiClient.post<ApiResponse<{ shareUrl: string }>>(
        `${this.endpoint}/${contractId}/share`
      );

      return response.data.data.shareUrl;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// Export singleton instance
export const contractService = new ContractService();
