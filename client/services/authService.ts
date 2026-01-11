import { apiClient, handleApiError, isApiError, type ApiResponse } from './api';
import type { User } from '@/types/store';

/**
 * Authentication API Request/Response Types
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface RegisterResponse {
  user: User;
  access_token: string;
  refresh_token?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  private readonly endpoint = '/auth';

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(`${this.endpoint}/login`, {
        email,
        password,
      } as LoginRequest);

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Register a new user
   */
  async register(email: string, password: string, name?: string): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<ApiResponse<RegisterResponse>>(
        `${this.endpoint}/register`,
        { email, password, name } as RegisterRequest
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(`${this.endpoint}/logout`);
    } catch (error) {
      // Log error but don't throw - logout should always succeed locally
      // If it's a 401, it means the session was already invalid, which is fine
      if (isApiError(error) && error.response?.status === 401) {
        console.log('Logout API: Session already invalid (401)');
      } else {
        console.error('Logout API error:', handleApiError(error));
      }
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
        `${this.endpoint}/refresh`,
        { refreshToken } as RefreshTokenRequest
      );

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      await apiClient.post(`${this.endpoint}/forgot-password`, { email } as ForgotPasswordRequest);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await apiClient.post(`${this.endpoint}/reset-password`, {
        token,
        password,
      } as ResetPasswordRequest);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post(`${this.endpoint}/change-password`, {
        currentPassword,
        newPassword,
      } as ChangePasswordRequest);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      await apiClient.post(`${this.endpoint}/verify-email`, { token });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<void> {
    try {
      await apiClient.post(`${this.endpoint}/resend-verification`, { email });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(`${this.endpoint}/me`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
