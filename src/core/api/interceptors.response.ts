import type {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { logger } from "@/shared/common/utils/logger"; // Adjust import path as needed
import { setAuthToken, clearAuthToken } from "./instance";

// Response interceptor
export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  // Log response in development
  if (import.meta.env.DEV) {
    logger.apiResponse(response.status, response.config.url || "", {
      data: response.data,
      headers: response.headers,
    });
  }

  // Example: Standardize response format
  if (response.data && response.data.data !== undefined) {
    return response;
  }

  return response;
};

// Response error interceptor
export const responseErrorInterceptor = async (
  error: AxiosError,
): Promise<any> => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  // Log error
  logger.apiError(
    error.response?.status || 500,
    originalRequest?.url || "",
    error,
    {
      message: error.message,
      responseData: error.response?.data,
      status: error.response?.status,
    },
  );

  // Handle 401 Unauthorized
  if (error.response?.status === 401 && !originalRequest?._retry) {
    originalRequest._retry = true;

    // Try to refresh token
    const refreshed = await refreshToken();

    if (refreshed) {
      // Retry original request with new token
      if (originalRequest) {
        const token = localStorage.getItem("access_token");
        if (token) {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
        }
        return await import("axios").then(({ default: axios }) =>
          axios(originalRequest),
        );
      }
    } else {
      // Redirect to login
      clearAuthToken();
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Use Vue Router to redirect
      const router = window.__appRouter;
      if (router) {
        clearAuthToken();
        router.push({
          name: "login",
          query: { redirect: router.currentRoute.value.fullPath },
        });
      }
    }
  }

  // Handle 403 Forbidden
  if (error.response?.status === 403) {
    logger.warn("Forbidden access", {
      url: originalRequest?.url,
      method: originalRequest?.method,
    });
  }

  // Handle 404 Not Found
  if (error.response?.status === 404) {
    logger.warn("Resource not found", {
      url: originalRequest?.url,
    });
  }

  // Handle 429 Too Many Requests
  if (error.response?.status === 429) {
    const retryAfter = error.response.headers["retry-after"];
    logger.warn(`Rate limited. Retry after ${retryAfter} seconds`);

    if (retryAfter) {
      // Wait and retry
      await new Promise((resolve) =>
        setTimeout(resolve, Number(retryAfter) * 1000),
      );
      if (originalRequest) {
        return await import("axios").then(({ default: axios }) =>
          axios(originalRequest),
        );
      }
    }
  }

  // Handle 500+ Server Errors
  if (error.response && error.response.status >= 500) {
    logger.error("Server error", {
      status: error.response.status,
      url: originalRequest?.url,
      data: error.response.data,
    });
  }

  // Handle network errors (no response)
  if (error.request && !error.response) {
    logger.error("Network error - No response received", {
      url: originalRequest?.url,
      method: originalRequest?.method,
    });
  }

  // Handle request timeout
  if (error.code === "ECONNABORTED") {
    logger.error("Request timeout", {
      url: originalRequest?.url,
      timeout: originalRequest?.timeout,
    });
  }

  // Handle cancellation
  if (error.code === "ERR_CANCELED") {
    logger.info("Request cancelled", {
      url: originalRequest?.url,
    });
  }

  return Promise.reject(error);
};

// Helper function to refresh token
async function refreshToken(): Promise<boolean> {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      return false;
    }

    const { default: axios } = await import("axios");
    const { publicApiInstance } = await import("./instance");

    const response = await publicApiInstance.post("/auth/refresh", {
      refresh_token: refreshToken,
    });

    const { access_token, refresh_token } = response.data.data;

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    setAuthToken(access_token);

    return true;
  } catch (error) {
    logger.error("Token refresh failed", { error });
    return false;
  }
}

// Helper function to check if error is network error
export const isNetworkError = (error: AxiosError): boolean => {
  return !error.response && !!error.request;
};

// Helper function to check if error is timeout
export const isTimeoutError = (error: AxiosError): boolean => {
  return error.code === "ECONNABORTED";
};

// Helper function to check if error is cancellation
export const isCancelError = (error: AxiosError): boolean => {
  return error.code === "ERR_CANCELED";
};
