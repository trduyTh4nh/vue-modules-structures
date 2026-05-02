import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import {
  requestErrorInterceptor,
  requestInterceptor,
} from "./interceptors.request";
import {
  responseErrorInterceptor,
  responseInterceptor,
} from "./interceptors.response";

export type HttpClient = AxiosInstance;

// default config
const defaultConfig: AxiosRequestConfig = {
  baseURL: 'http://localhost:5000',
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  //   withCredentials: true,
};

// main instance
export const apiInstance: AxiosInstance = axios.create(defaultConfig);

// public instance (no interceptors)
export const publicApiInstance: AxiosInstance = axios.create(defaultConfig);

// upload file instance
export const uploadApiInstance: AxiosInstance = axios.create({
  ...defaultConfig,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});

// // Attach request interceptors
// apiInstance.interceptors.request.use(
//   requestInterceptor,
//   requestErrorInterceptor,
// );

// // Attach response interceptors
// apiInstance.interceptors.response.use(
//   responseInterceptor,
//   responseErrorInterceptor,
// );

// Upload instance with interceptors
uploadApiInstance.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor,
);
uploadApiInstance.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor,
);

// Helper functions
export const getApiInstance = (): AxiosInstance => apiInstance;
export const getPublicApiInstance = (): AxiosInstance => publicApiInstance;
export const getUploadApiInstance = (): AxiosInstance => uploadApiInstance;

// Function to update base URL (useful for dynamic API endpoints)
export const setApiBaseUrl = (baseURL: string): void => {
  apiInstance.defaults.baseURL = baseURL;
  publicApiInstance.defaults.baseURL = baseURL;
  uploadApiInstance.defaults.baseURL = baseURL;
};

// Function to set auth token globally
export const setAuthToken = (token: string | null): void => {
  if (token) {
    apiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    uploadApiInstance.defaults.headers.common["Authorization"] =
      `Bearer ${token}`;
  } else {
    delete apiInstance.defaults.headers.common["Authorization"];
    delete uploadApiInstance.defaults.headers.common["Authorization"];
  }
};

// Function to clear all headers (logout)
export const clearAuthToken = (): void => {
  delete apiInstance.defaults.headers.common["Authorization"];
  delete uploadApiInstance.defaults.headers.common["Authorization"];
};
