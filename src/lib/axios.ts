/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import showToast from "../utils/notification";
import { notificationStyles } from "../style/custom";
import { tokenUtils, type AuthTokens } from "./utils";
import { type ToastOptions } from "react-hot-toast";

/* ------------------------------------------------------------- */

const currentPath = window.location.pathname;

// Track recently shown error messages to prevent duplicates
const shownErrors = new Set<string>();
const ERROR_TOAST_COOLDOWN = 5000; // 5 seconds

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;

let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

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

function showErrorOnce(message: string, options: ToastOptions) {
  const errorKey = `${message}-${options.position}`;

  if (!shownErrors.has(errorKey)) {
    shownErrors.add(errorKey);
    showToast.error(message, options);

    // Clear after cool-down period
    setTimeout(() => shownErrors.delete(errorKey), ERROR_TOAST_COOLDOWN);
  }
}

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

const handleLogout = (userType: "admin" | "user" | "guest") => {
  // Clear tokens based on user type
  if (userType === "admin") {
    tokenUtils.clearAdminTokens();
    showErrorOnce("Admin session expired. Please login again.", {
      icon: null,
      style: notificationStyles.alertError,
      position: "top-center",
    });
    setTimeout(() => (window.location.href = "/auth/admin-login"), 1000);
  } else if (userType === "user") {
    tokenUtils.clearTokens();
    showErrorOnce("Session expired. Please login again.", {
      icon: null,
      style: notificationStyles.alertError,
      position: "top-center",
    });
    setTimeout(() => (window.location.href = "/auth/login"), 1000);
  } else if (userType === "guest") {
    tokenUtils.clearTokens();
    localStorage.removeItem("araafit_guest_token");
    showErrorOnce("Guest session expired. Please get measured again.", {
      icon: null,
      style: notificationStyles.alertError,
      position: "top-center",
    });
    setTimeout(() => (window.location.href = "/get-measured"), 1000);
  }
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = tokenUtils.getAccessToken();
    const guestToken = localStorage.getItem("araafit_guest_token");
    const adminAccessToken = tokenUtils.getAdminAccessToken();

    console.log("adminAccessToken", adminAccessToken);
    console.log("accessToken", accessToken);
    console.log("guestToken", guestToken);

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

    // Do not attempt refresh for auth endpoints
    if (error.config?.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    // Check if error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = tokenUtils.getRefreshToken();
      const adminRefreshToken = tokenUtils.getAdminRefreshToken();
      const guestToken = localStorage.getItem("araafit_guest_token");

      // If token already refreshing, queue request.
      if (isRefreshing) {
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

      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        console.log("Max refresh attempts exceeded. Logging out...");

        // reset for next session
        refreshAttempts = 0;
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;
      refreshAttempts++;

      // ADMIN REFRESH LOGIC
      if (currentPath.includes("/admin-dashboard/")) {
        if (!adminRefreshToken || adminRefreshToken === "undefined") {
          console.log("No admin refresh token, redirecting to login");

          isRefreshing = false;
          refreshAttempts = 0;
          handleLogout("admin");
          return Promise.reject(error);
        }

        console.log(
          `Admin refresh attempt ${refreshAttempts}/${MAX_REFRESH_ATTEMPTS}`
        );
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
        } catch (refreshError: any) {
          console.log("Admin token refresh failed");

          // Check if refresh itself returned 401 (refresh token expired)
          if (refreshError.response?.status === 401) {
            console.log("Admin refresh token expired, logging out");
            processQueue(refreshError, null);
            handleLogout("admin");
            return Promise.reject(refreshError);
          }

          // For other errors, reject but don't logout yet
          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (
        currentPath.includes("/dashboard") ||
        currentPath.includes("/dashboard/")
      ) {
        if (!refreshToken || refreshToken === "undefined") {
          console.log("No user refresh token, redirecting to login");
          isRefreshing = false;
          refreshAttempts = 0;
          handleLogout("user");
          return Promise.reject(error);
        }

        console.log(
          `User refresh attempt ${refreshAttempts}/${MAX_REFRESH_ATTEMPTS}`
        );
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

          // Reset attempts on success
          refreshAttempts = 0;

          return apiClient(originalRequest);
        } catch (refreshError: any) {
          console.log("User token refresh failed");

          // Check if refresh itself returned 401 (refresh token expired)
          if (refreshError.response?.status === 401) {
            console.log("User refresh token expired, logging out");
            processQueue(refreshError, null);
            handleLogout("user");
            return Promise.reject(refreshError);
          }

          // For other errors, reject but don't logout yet
          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // GUEST TOKEN LOGIC
      if (guestToken && !refreshToken) {
        console.log("Guest session expired");
        isRefreshing = false;
        refreshAttempts = 0;
        handleLogout("guest");
        return Promise.reject(error);
      }
    }

    // Handle other errors
    if (error.response && !originalRequest._retry) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          showErrorOnce(data.message || "Invalid request", {
            icon: null,
            style: notificationStyles.alertError,
            position: "top-right",
          });
          break;
        case 403:
          showErrorOnce(data.message || "Access denied", {
            icon: null,
            style: notificationStyles.alertError,
            position: "top-right",
          });
          break;
        case 404:
          // showErrorOnce("Resource not found", {
          //   icon: null,
          //   style: notificationStyles.alertError,
          //   position: "top-right",
          // });
          console.log("Error:", data.message);
          break;
        case 500:
          showErrorOnce("Server error. Please try again later.", {
            icon: null,
            style: notificationStyles.alertError,
            position: "top-right",
          });
          break;
        default:
          showToast.error(data.message || "An error occurred", {
            icon: null,
            style: notificationStyles.alertError,
            position: "top-right",
          });
      }
    } else if (error.request && !originalRequest._retry) {
      showErrorOnce("Network error. Please check your connection.", {
        icon: null,
        style: notificationStyles.alertError,
        position: "top-right",
        duration: 7000,
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
