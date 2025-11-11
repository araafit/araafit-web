import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* ----------------------------------------------------- */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ------------------ JWT Token Util ------------------ */

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
