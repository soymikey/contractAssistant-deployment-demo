/**
 * Axios wrapper
 * Request/response interceptors and unified error handling
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { supabase } from '@/lib/supabase';
import { API_CONFIG } from '@/constants/config';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

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

axios.defaults.baseURL = API_CONFIG.baseURL;
axios.defaults.timeout = API_CONFIG.timeout;

// Request interceptor
axios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  (response) => {
    // Accept successful status codes including 204 No Content
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // Handle non-200 status codes
  (error: AxiosError) => {
    if (error.response?.status) {
      console.log('error.response.status', error.response.status);

      switch (error.response.status) {
        // 401: Unauthorized
        case 401:
          Toast.show({
            type: 'error',
            text1: 'Request Failed',
            text2: 'Token expired',
            position: 'top',
          });
          // router.replace('/login');
          break;
        // 403: Token expired
        case 403:
          Toast.show({
            type: 'error',
            text1: 'Request Failed',
            text2: 'Token expired',
            position: 'top',
          });
          router.replace('/login');
          break;
        // 404: Not found
        case 404:
          Toast.show({
            type: 'error',
            text1: 'Request Failed',
            text2: 'Not found',
            position: 'top',
          });
          break;
        // Other errors
        default:
          const message =
            (error.response.data as { message?: string })?.message || 'An error occurred';
          Toast.show({
            type: 'error',
            text1: 'Request Failed',
            text2: message,
            position: 'top',
          });
      }
      return Promise.reject(error.response);
    }
    // Network error or no response
    return Promise.reject(error);
  }
);

/**
 * GET request
 * @param url Request URL
 * @param params Request parameters
 */
function get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
  console.log('url: ', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
      })
      .then((res) => {
        console.log('res: ', res.data);
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.response?.data || err);
      });
  });
}

/**
 * POST request
 * @param url Request URL
 * @param params Request body
 * @param config Optional axios config (for upload progress, etc.)
 */
function post<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: any
): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...config,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.response?.data || err);
      });
  });
}

/**
 * PATCH request
 * @param url Request URL
 * @param params Request body
 */
function patch<T = unknown>(
  url: string,
  params?: Record<string, unknown>
): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    axios
      .patch(url, params, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.response?.data || err);
      });
  });
}

/**
 * PUT request
 * @param url Request URL
 * @param params Request body
 */
function put<T = unknown>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    axios
      .put(url, params, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.response?.data || err);
      });
  });
}

/**
 * DELETE request
 * @param url Request URL
 */
function del<T = unknown>(url: string): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    axios
      .delete(url)
      .then((res) => {
        // Handle 204 No Content responses (no response body)
        if (res.status === 204 || !res.data) {
          resolve({
            success: true,
            data: null as any,
            message: 'Success',
          });
        } else {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err.response?.data || err);
      });
  });
}

export const apiClient = {
  get,
  post,
  patch,
  put,
  delete: del,
};
/**
 * Type guard to check if error is an API error
 */
export const isApiError = (error: unknown): error is AxiosError<ApiError> => {
  return axios.isAxiosError(error);
};
