/**
 * API Module - Core exports
 * Centralized API configuration and instances
 */

// Main instances
export {
  apiInstance,
  publicApiInstance,
  uploadApiInstance,
  getApiInstance,
  getPublicApiInstance,
  getUploadApiInstance,
  setApiBaseUrl,
  setAuthToken,
  clearAuthToken,
} from "./instance";

// Interceptors (export for testing or custom usage)
export {
  requestInterceptor,
  requestErrorInterceptor,
  cancelRequest,
} from "./interceptors.request";

export {
  responseInterceptor,
  responseErrorInterceptor,
  isNetworkError,
  isTimeoutError,
  isCancelError,
} from "./interceptors.response";

// Types
export type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Helper function for making API calls with consistent error handling
export const createApiCall = async <T>(
  call: Promise<T>,
): Promise<{ data: T | null; error: any | null }> => {
  try {
    const data = await call;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Generic API response type (adjust based on your backend)
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  success: boolean;
}

// Pagination response type
export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
