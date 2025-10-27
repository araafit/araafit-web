/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import showToast from "../utils/notification";
import { notificationStyles } from "../style/custom";

/* ------------------------------------------------------------- */

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

const currentPath = window.location.pathname;

// Base API URL - update this to your backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://araafit-backend.vercel.app/api";

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
let shouldRefresh = false;

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

    // Priority: admin access token > user access token > guest user token
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

    // console.log("error:", error, originalRequest._retry);

    // Do not attempt refresh for auth endpoints
    if (error.config?.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    // Check if error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = tokenUtils.getRefreshToken();
      const adminRefreshToken = tokenUtils.getAdminRefreshToken();
      const guestToken = localStorage.getItem("araafit_guest_token");

      // If token should refresh, the go ahead and queue request.
      if (shouldRefresh) {
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
      shouldRefresh = true;

      if (currentPath.includes("/admin-dashboard/")) {
        // If not refresh token, redirect to login
        if (!adminRefreshToken || adminRefreshToken === "undefined") {
          console.log("No admin refresh token, Should redirect to login");

          setTimeout(() => (window.location.href = "/auth/admin-login"), 1000);

          return Promise.reject(error);
        }

        // Enough retry. token is invalid, just go to admin login page.
        if (originalRequest._retry && failedQueue.length >= 2) {
          const adminAccessToken = tokenUtils.getAdminAccessToken();

          if (adminAccessToken && tokenUtils.isTokenExpired(adminAccessToken)) {
            showToast.error("Session expired. Redirecting to admin login.", {
              icon: null,
              style: notificationStyles.alertError,
              position: "top-center",
            });

            // setTimeout(() => (window.location.href = "/auth/admin-login"), 1000);

            return Promise.reject(error);
          }
        }

        console.log("Making request to get refresh token...");
        try {
          const response = await axios.post(`${API_BASE_URL}/admin/refresh`, {
            refresh_token: adminRefreshToken,
          });

          const newTokens: AuthTokens = response.data;
          tokenUtils.setAdminTokens(newTokens);

          // Update the authorization header
          apiClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newTokens.access_token}`;
          originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;

          processQueue(null, newTokens.access_token);

          return apiClient(originalRequest);
        } catch (refreshError) {
          console.log(
            "Unable to refresh token for admin. Should redirect login page"
          );

          // Admin refresh failed, clear admin tokens and redirect
          tokenUtils.clearAdminTokens();

          showToast.error("Admin session expired. Please login again.", {
            icon: null,
            style: notificationStyles.alertError,
            position: "top-center",
          });

          processQueue(refreshError, null);

          setTimeout(() => (window.location.href = "/auth/admin-login"), 1000);

          return Promise.reject(refreshError);
        } finally {
          shouldRefresh = false;
        }
      }

      if (currentPath.includes("/dashboard/")) {
        if (!refreshToken || refreshToken === "undefined") {
          console.log("No user refresh token, Should redirect to login");

          setTimeout(() => (window.location.href = "/auth/login"), 1000);

          return Promise.reject(error);
        }

        // Enough retry. token is invalid, just go to user login page.
        if (originalRequest._retry && failedQueue.length >= 2) {
          const userAccessToken = tokenUtils.getAccessToken();

          if (userAccessToken && tokenUtils.isTokenExpired(userAccessToken)) {
            showToast.error("Session expired. Redirecting to user login.", {
              icon: null,
              style: notificationStyles.alertError,
              position: "top-center",
            });

            setTimeout(() => (window.location.href = "/auth/login"), 1000);

            return Promise.reject(error);
          }
        }

        console.log("Making request to get user refresh token ...");
        try {
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
        } catch (error) {
          tokenUtils.clearTokens();

          showToast.error("Session expired. Redirecting login.", {
            icon: null,
            style: notificationStyles.alertError,
            position: "top-center",
          });

          console.log("User refresh token failed");

          setTimeout(() => (window.location.href = "/auth/login"), 1000);

          return Promise.reject(error);
        } finally {
          shouldRefresh = false;
        }
      }

      // If guest user token exist but no user refresh token, handle guest token expiry
      if (guestToken && !refreshToken) {
        // Guest token expired, clear it and redirect to measurement or login
        tokenUtils.clearTokens();
        localStorage.removeItem("araafit_guest_token");

        showToast.error("Guest session expired. Please get measured again.", {
          icon: null,
          style: notificationStyles.alertError,
          position: "top-center",
        });

        setTimeout(() => (window.location.href = "/get-measured"), 1000);

        return Promise.reject(error);
      }
    }

    // Handle other errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          showToast.error(data.message || "Invalid request", {
            icon: null,
            style: notificationStyles.alertError,
            position: "top-center",
          });
          break;
        case 403:
          showToast.error("Access denied", {
            icon: null,
            style: notificationStyles.alertError,
            position: "top-center",
          });
          break;
        case 404:
          showToast.error("Resource not found", {
            icon: null,
            style: notificationStyles.alertError,
            position: "top-center",
          });
          break;
        case 500:
          showToast.error("Server error. Please try again later.", {
            icon: null,
            style: notificationStyles.alertError,
            position: "top-center",
          });
          break;
        default:
          showToast.error(data.message || "An error occurred", {
            icon: null,
            style: notificationStyles.alertError,
            position: "top-center",
          });
      }
    } else if (error.request) {
      showToast.error("Network error. Please check your connection.", {
        icon: null,
        style: notificationStyles.alertError,
        position: "top-center",
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
