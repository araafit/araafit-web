import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type AuthTokens, tokenUtils } from "../lib/axios";
import { type AdminUser } from "../services/admin-auth.service";

// User interface based on API response
export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  deliveryAddress: string | null;
  dateOfBirth: string | null;
  isVerified: boolean;
  phoneNumber: string | null;
  city: string | null;
  zipCode: string | null;
  bust: number | null;
  waist: number | null;
  hips: number | null;
  height: number | null;
  dressSize: number | null;
  skinTone: string | null;
  isGuest: boolean;
  createdAt: string;
  isActive: boolean;
  blockReason: string | null;
}

// Auth state interface
interface AuthState {
  user: User | null;
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;
  isAdmin: boolean;
}

// Auth actions interface
interface AuthActions {
  setUser: (user: User) => void;
  setAdminUser: (adminUser: AdminUser) => void;
  setAdminTokens: (tokens: AuthTokens) => void;
  setTokens: (tokens: AuthTokens) => void;
  setGuestToken: (token: string) => void;
  logout: () => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

// Complete auth store type
export type AuthStore = AuthState & AuthActions;

// Initial state
const initialState: AuthState = {
  user: null,
  adminUser: null,
  isAuthenticated: false,
  isLoading: true,
  isGuest: false,
  isAdmin: false,
};

// Create the auth store with persistence
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isGuest: user.isGuest,
          isAdmin: false,
          isLoading: false,
        });
      },

      setAdminUser: (adminUser: AdminUser) => {
        set({
          adminUser,
          user: null, // Clear regular user when admin logs in
          isAuthenticated: true,
          isAdmin: true,
          isGuest: false,
          isLoading: false,
        });
      },

      setAdminTokens: (tokens: AuthTokens) => {
        console.log("admin tokens", tokens);
        // Store admin tokens in separate keys
        localStorage.setItem("araafit_admin_access_token", tokens.access_token);
        localStorage.setItem(
          "araafit_admin_refresh_token",
          tokens.refresh_token
        );
        set({
          isAuthenticated: true,
          isAdmin: true,
          isGuest: false,
          isLoading: false,
        });
      },

      setTokens: (tokens: AuthTokens) => {
        tokenUtils.setTokens(tokens);
        // Don't set user here, it should be fetched separately
        set({
          isAuthenticated: true,
          isLoading: false,
        });
      },

      setGuestToken: (token: string) => {
        // For guest users, we store the token in localStorage with a different key
        localStorage.setItem("araafit_guest_token", token);
        set({
          isAuthenticated: true,
          isGuest: true,
          isLoading: false,
        });
      },

      logout: () => {
        tokenUtils.clearTokens();
        localStorage.removeItem("araafit_guest_token");
        localStorage.removeItem("araafit_admin_access_token");
        localStorage.removeItem("araafit_admin_refresh_token");
        set({
          user: null,
          adminUser: null,
          isAuthenticated: false,
          isGuest: false,
          isAdmin: false,
          isLoading: false,
        });
      },

      clearAuth: () => {
        tokenUtils.clearTokens();
        localStorage.removeItem("araafit_guest_token");
        localStorage.removeItem("araafit_admin_access_token");
        localStorage.removeItem("araafit_admin_refresh_token");
        set(initialState);
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initializeAuth: () => {
        const accessToken = tokenUtils.getAccessToken();
        const guestToken = localStorage.getItem("araafit_guest_token");
        const adminAccessToken = localStorage.getItem("araafit_admin_access_token");

        if (adminAccessToken && !tokenUtils.isTokenExpired(adminAccessToken)) {
          // Admin token found and valid
          set({
            isAuthenticated: true,
            isAdmin: true,
            isGuest: false,
            isLoading: false,
          });
        } else if (accessToken && !tokenUtils.isTokenExpired(accessToken)) {
          // Regular user token found
          set({
            isAuthenticated: true,
            isAdmin: false,
            isGuest: false,
            isLoading: false,
          });
        } else if (guestToken) {
          // Guest token found
          set({
            isAuthenticated: true,
            isAdmin: false,
            isGuest: true,
            isLoading: false,
          });
        } else {
          // No tokens found
          set({
            isAuthenticated: false,
            isAdmin: false,
            isGuest: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "araafit-auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist user data, not tokens (tokens are handled separately)
      partialize: (state) => ({
        user: state.user,
        adminUser: state.adminUser,
        isGuest: state.isGuest,
        isAdmin: state.isAdmin,
      }),
      // Rehydrate the store on app load
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initializeAuth();
        }
      },
    }
  )
);

// Selectors for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useAdminUser = () => useAuthStore((state) => state.adminUser);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useIsGuest = () => useAuthStore((state) => state.isGuest);
export const useIsAdmin = () => useAuthStore((state) => state.isAdmin);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
