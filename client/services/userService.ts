import { apiClient, handleApiError, type ApiResponse } from './apiV2';
import type { User } from '@/types/store';

/**
 * User API Request/Response Types
 */
export interface UpdateUserRequest {
  name?: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language?: 'en' | 'zh';
  notifications?: {
    email?: boolean;
    push?: boolean;
  };
  theme?: 'light' | 'dark' | 'auto';
}

export interface UserStatsResponse {
  totalContracts: number;
  totalAnalyses: number;
  totalFavorites: number;
  lastActivity: string;
  joinedAt: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}

export interface DeleteAccountRequest {
  password: string;
  confirmation: string;
}

/**
 * User Service
 * Handles all user profile and settings-related API calls
 */
class UserService {
  private readonly endpoint = '/users';

  /**
   * Get current user profile
   */
  async getUserProfile(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(`${this.endpoint}/me`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: UpdateUserRequest): Promise<User> {
    try {
      const response = await apiClient.patch<ApiResponse<User>>(`${this.endpoint}/me`, updates);

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(avatarFile: string, onProgress?: (progress: number) => void): Promise<string> {
    try {
      const response = await apiClient.post<ApiResponse<UploadAvatarResponse>>(
        `${this.endpoint}/me/avatar`,
        { avatar: avatarFile },
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

      return response.data.data.avatarUrl;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<UserStatsResponse> {
    try {
      const response = await apiClient.get<ApiResponse<UserStatsResponse>>(
        `${this.endpoint}/me/stats`
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<UserPreferences> {
    try {
      const response = await apiClient.get<ApiResponse<UserPreferences>>(
        `${this.endpoint}/me/preferences`
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const response = await apiClient.patch<ApiResponse<UserPreferences>>(
        `${this.endpoint}/me/preferences`,
        preferences
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Export user data
   */
  async exportUserData(): Promise<Blob> {
    try {
      const response = await apiClient.get(`${this.endpoint}/me/export`, {
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(password: string, confirmation: string): Promise<void> {
    try {
      await apiClient.post(`${this.endpoint}/me/delete`, {
        password,
        confirmation,
      } as DeleteAccountRequest);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user activity log
   */
  async getActivityLog(limit: number = 20): Promise<
    {
      id: string;
      type: string;
      description: string;
      timestamp: string;
    }[]
  > {
    try {
      const response = await apiClient.get<
        ApiResponse<{
          activities: {
            id: string;
            type: string;
            description: string;
            timestamp: string;
          }[];
        }>
      >(`${this.endpoint}/me/activity`, { params: { limit } });

      return response.data.data.activities;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(settings: UserPreferences['notifications']): Promise<void> {
    try {
      await apiClient.patch(`${this.endpoint}/me/notifications`, settings);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// Export singleton instance
export const userService = new UserService();
