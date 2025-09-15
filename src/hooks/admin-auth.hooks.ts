/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  adminAuthService,
  type AdminLoginRequest,
  type AdminForgotPasswordRequest,
  type AdminResetPasswordRequest,
} from "../services/admin-auth.service";
import { useAuthStore } from "../stores/auth-store";

// Admin Login Mutation
export const useAdminLogin = () => {
  const { setAdminUser, setAdminTokens } = useAuthStore();

  return useMutation({
    mutationFn: (data: AdminLoginRequest) => adminAuthService.login(data),
    onSuccess: (data) => {
      console.log("data", data);
      // Set admin tokens and user data
      setAdminTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
      });
      setAdminUser(data.user);
      
      toast.success("Admin login successful");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Admin login failed");
    },
  });
};

// Admin Logout Mutation
export const useAdminLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const adminRefreshToken = localStorage.getItem("araafit_admin_refresh_token");
      if (!adminRefreshToken) {
        throw new Error("No admin refresh token found");
      }
      return adminAuthService.logout({ refreshToken: adminRefreshToken });
    },
    onSuccess: (data) => {
      logout();
      queryClient.clear(); // Clear all cached data
      toast.success(data.message);
    },
    onError: (error: any) => {
      console.log("error", error);
      // Even if logout fails on server, clear local state
      logout();
      queryClient.clear();
      toast.error(error.response?.data?.message || "Admin logout failed");
    },
  });
};

// Admin Forgot Password Mutation
export const useAdminForgotPassword = () => {
  return useMutation({
    mutationFn: (data: AdminForgotPasswordRequest) =>
      adminAuthService.forgotPassword(data),
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to send admin reset email"
      );
    },
  });
};

// Admin Reset Password Mutation
export const useAdminResetPassword = () => {
  return useMutation({
    mutationFn: (data: AdminResetPasswordRequest) =>
      adminAuthService.resetPassword(data),
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to reset admin password"
      );
    },
  });
};
