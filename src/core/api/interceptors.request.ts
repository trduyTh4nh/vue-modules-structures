import type { InternalAxiosRequestConfig, AxiosError } from "axios";
import { logger } from "@/shared/common/utils/logger"; // Adjust import path as needed

// Request interceptor
export const requestInterceptor = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  // Log request in development
  if (import.meta.env.DEV) {
    logger.apiRequest(config.method?.toUpperCase() || "GET", config.url || "", {
      params: config.params,
      data: config.data,
      headers: config.headers,
    });
  }

  // Example: Add language header
  const language = localStorage.getItem("language") || "en";
  config.headers["Accept-Language"] = language;

  // Example: Add timestamp to prevent cache
  if (config.method?.toLowerCase() === "get") {
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
  }

  // Example: Add abort controller for timeout
  const controller = new AbortController();
  config.signal = controller.signal;

  // Store controller in config for later use if needed
  // @ts-ignore - Adding custom property
  config._abortController = controller;

  // Set timeout if not already set
  if (!config.timeout) {
    config.timeout = 30000;
  }

  return config;
};

// Request error interceptor
export const requestErrorInterceptor = (
  error: AxiosError,
): Promise<AxiosError> => {
  logger.error(
    "Request Error",
    {
      message: error.message,
      config: error.config,
      name: error.name,
    },
    error,
  );

  return Promise.reject(error);
};

// Helper function to cancel request
export const cancelRequest = (config: InternalAxiosRequestConfig): void => {
  // @ts-ignore
  if (config._abortController) {
    // @ts-ignore
    config._abortController.abort();
  }
};
