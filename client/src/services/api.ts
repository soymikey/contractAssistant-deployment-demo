import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../constants/config';
import { useAuthStore } from '../stores/authStore';

/**
 * API Error Response Interface
 */
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: unknown;
}

/**
 * API Response Wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Create axios instance with default configuration
 */
const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add authentication token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().token;

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log request in development
      if (__DEV__) {
        console.log('[API Request]', {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
        });
      }

      return config;
    },
    (error: AxiosError) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle responses and errors
  instance.interceptors.response.use(
    (response) => {
      // Log response in development
      if (__DEV__) {
        console.log('[API Response]', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
      }

      return response;
    },
    async (error: AxiosError<ApiError>) => {
      // Log error in development
      if (__DEV__) {
        console.error('[API Response Error]', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.response?.data?.message || error.message,
        });
      }

      // Handle different error scenarios
      if (error.response) {
        const { status, data } = error.response;

        // Handle authentication errors
        if (status === 401) {
          // Try to refresh token
          const refreshToken = useAuthStore.getState().refreshToken;

          if (refreshToken && error.config) {
            try {
              // Attempt token refresh
              await useAuthStore.getState().refreshAuth();

              // Retry original request with new token
              const newToken = useAuthStore.getState().token;
              if (newToken && error.config.headers) {
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return instance.request(error.config);
              }
            } catch {
              // Refresh failed, logout user
              await useAuthStore.getState().logout();
              return Promise.reject(new Error('Session expired. Please login again.'));
            }
          } else {
            // No refresh token, logout user
            await useAuthStore.getState().logout();
            return Promise.reject(new Error('Authentication required. Please login.'));
          }
        }

        // Handle other HTTP errors
        const errorMessage = data?.message || `Request failed with status ${status}`;
        return Promise.reject(new Error(errorMessage));
      } else if (error.request) {
        // Network error - no response received
        return Promise.reject(new Error('Network error. Please check your connection.'));
      } else {
        // Other errors
        return Promise.reject(new Error(error.message || 'An unexpected error occurred'));
      }
    }
  );

  return instance;
};

/**
 * API Client Instance
 * Use this instance for all API calls
 */
export const apiClient = createApiClient();

/**
 * Helper function to handle API errors consistently
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    return axiosError.response?.data?.message || axiosError.message || 'An error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

/**
 * Type guard to check if error is an API error
 */
export const isApiError = (error: unknown): error is AxiosError<ApiError> => {
  return axios.isAxiosError(error);
};
