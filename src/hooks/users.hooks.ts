/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  usersService,
  type UpdatePasswordRequest,
  type UpdateProfileRequest,
} from "../services/users.service";
import { useAuthStore } from "../stores/auth-store";
import { authKeys } from "./auth.hooks";

export const useUpdateProfile = () => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => {
      console.log("Calling updateProfile with data:", data);
      return usersService.updateProfile(data);
    },
    onSuccess: (data) => {
      console.log("Profile update successful:", data);
      setUser(data.user);
      queryClient.setQueryData(authKeys.profile(), data.user);
      toast.success(data.message || "Profile updated successfully");
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: UpdatePasswordRequest) => usersService.updatePassword(data),
    onSuccess: (data) => {
      toast.success(data.message || "Password updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update password");
    },
  });
};

export const useDeleteMe = () => {
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersService.deleteMe(),
    onSuccess: (data) => {
      toast.success(data.message || "Account deleted successfully");
      clearAuth();
      queryClient.clear();
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete account");
    },
  });
};


