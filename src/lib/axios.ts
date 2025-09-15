/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "react-hot-toast";

// Types for auth response
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

// Base API URL - update this to your backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management utilities
const ADMIN_ACCESS_TOKEN_STORAGE_KEY = "araafit_admin_access_token";
const ADMIN_REFRESH_TOKEN_STORAGE_KEY = "araafit_admin_refresh_token";
const TOKEN_STORAGE_KEY = "araafit_access_token";
const REFRESH_TOKEN_STORAGE_KEY = "araafit_refresh_token";

export const tokenUtils = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  },

  getAdminAccessToken: (): string | null => {
    return localStorage.getItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY);
  },

  getAdminRefreshToken: (): string | null => {
    return localStorage.getItem(ADMIN_REFRESH_TOKEN_STORAGE_KEY);
  },

  setTokens: (tokens: AuthTokens): void => {
    localStorage.setItem(TOKEN_STORAGE_KEY, tokens.access_token);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refresh_token);
  },

  setAdminTokens: (tokens: AuthTokens): void => {
    localStorage.setItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY, tokens.access_token);
    localStorage.setItem(ADMIN_REFRESH_TOKEN_STORAGE_KEY, tokens.refresh_token);
  },

  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  },

  clearAdminTokens: (): void => {
    localStorage.removeItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_REFRESH_TOKEN_STORAGE_KEY);
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  },
};

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = tokenUtils.getAccessToken();
    const guestToken = localStorage.getItem("araafit_guest_token");
    const adminAccessToken = tokenUtils.getAdminAccessToken();

    // Priority: admin access token > regular access token > guest token
    if (adminAccessToken && !tokenUtils.isTokenExpired(adminAccessToken)) {
      config.headers.Authorization = `Bearer ${adminAccessToken}`;
    } else if (accessToken && !tokenUtils.isTokenExpired(accessToken)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else if (guestToken) {
      // For guest users, use the guest token
      config.headers.Authorization = `Bearer ${guestToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log("error", error, originalRequest._retry);

    // Check if error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenUtils.getRefreshToken();
      const adminRefreshToken = tokenUtils.getAdminRefreshToken();
      const guestToken = localStorage.getItem("araafit_guest_token");

      console.log("refreshToken", refreshToken, typeof adminRefreshToken, adminRefreshToken, guestToken);

      // If we have an admin refresh token, try to refresh admin tokens
      if (adminRefreshToken && adminRefreshToken !== "undefined") {
        console.log("Admin refresh token");
        try {
          const response = await axios.post(`${API_BASE_URL}/admin/refresh`, {
            refresh_token: adminRefreshToken,
          });

          const newTokens: AuthTokens = response.data;
          tokenUtils.setAdminTokens(newTokens);

          processQueue(null, newTokens.access_token);
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Admin refresh failed, clear admin tokens and redirect
          tokenUtils.clearAdminTokens();
          processQueue(refreshError, null);
          toast.error("Admin session expired. Please login again.");
          window.location.href = "/auth/admin-login";
          return Promise.reject(refreshError);
        }
      }

      // If we have a guest token but no refresh token, handle guest token expiry
      if (!refreshToken && guestToken) {
        console.log("Guest token expired");
        // Guest token expired, clear it and redirect to measurement or login
        localStorage.removeItem("araafit_guest_token");
        tokenUtils.clearTokens();
        toast.error("Guest session expired. Please get measured again.");
        window.location.href = "/get-measured";
        return Promise.reject(error);
      }

      if (!refreshToken) {
        console.log("No refresh token");
        // No refresh token, redirect to login
        tokenUtils.clearTokens();
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newTokens: AuthTokens = response.data;
        tokenUtils.setTokens(newTokens);

        // Update the authorization header
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newTokens.access_token}`;
        originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;

        processQueue(null, newTokens.access_token);

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        processQueue(refreshError, null);
        tokenUtils.clearTokens();
        toast.error("Session expired. Please login again.");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          toast.error(data.message || "Invalid request");
          break;
        case 403:
          toast.error("Access denied");
          break;
        case 404:
          toast.error("Resource not found");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(data.message || "An error occurred");
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
