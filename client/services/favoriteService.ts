import { apiClient, handleApiError } from './apiV2';

/**
 * Favorite API Response Types
 */
export interface ContractSummary {
  id: string;
  fileName: string;
  fileType: string;
  fileSize?: number | null;
  status: string;
  createdAt: Date;
}

export interface FavoriteResponse {
  id: string;
  userId: string;
  contractId: string;
  createdAt: Date;
  contract?: ContractSummary;
}

export interface FavoriteCheckResponse {
  isFavorited: boolean;
  favoriteId?: string;
}

export interface ToggleFavoriteResponse {
  isFavorited: boolean;
  favorite?: FavoriteResponse;
}

/**
 * Favorite Service
 * Handles all favorite-related API calls
 */
class FavoriteService {
  private readonly endpoint = '/favorites';

  /**
   * Add a contract to favorites
   */
  async addFavorite(contractId: string): Promise<FavoriteResponse> {
    try {
      const response = await apiClient.post<FavoriteResponse>(this.endpoint, {
        contractId,
      });

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Remove a contract from favorites
   */
  async removeFavorite(contractId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.endpoint}/${contractId}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get all favorites for the current user
   */
  async getFavorites(): Promise<FavoriteResponse[]> {
    try {
      const response = await apiClient.get<FavoriteResponse[]>(this.endpoint);

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get favorites count for the current user
   */
  async getFavoritesCount(): Promise<number> {
    try {
      const response = await apiClient.get<{ count: number }>(`${this.endpoint}/count`);

      return response.data.count;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Check if a contract is favorited
   */
  async checkFavorite(contractId: string): Promise<FavoriteCheckResponse> {
    try {
      const response = await apiClient.get<FavoriteCheckResponse>(`${this.endpoint}/${contractId}`);

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Toggle favorite status for a contract
   */
  async toggleFavorite(contractId: string): Promise<ToggleFavoriteResponse> {
    try {
      const response = await apiClient.post<ToggleFavoriteResponse>(
        `${this.endpoint}/${contractId}/toggle`
      );

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// Export singleton instance
export const favoriteService = new FavoriteService();
