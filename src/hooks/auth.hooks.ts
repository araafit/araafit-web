/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  authService,
  type VerifyEmailRequest,
  type VerifyOtpRequest,
  type RegisterRequest,
  type GuestUserRequest,
  type CompleteRegistrationRequest,
  type LoginRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
} from "../services/auth.service";
import { useAuthStore } from "../stores/auth-store";
import { tokenUtils } from "../lib/utils";
import showToast from "../utils/notification";
import { notificationStyles } from "../style/custom";
import type { GoogleAuthRequest } from "../services/auth.service";

/* ---------------------------------------------------------------------------------- */

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
} as const;


/* Google Auth */ 

export const useGoogleAuth = () => {
  const { setUser, setTokens } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: GoogleAuthRequest) => authService.googleAuth(token),
    onSuccess: (data) => {
      setTokens({
        access_token: data.tokens.access_token,
        refresh_token: data.tokens.refresh_token,
        expires_in: data.tokens.expires_in,
        token_type: data.tokens.token_type,
      });
      setUser(data.user);

      // Cache the user profile
      queryClient.setQueryData(authKeys.profile(), data.user);

      toast.success("Logged in with Google successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Google authentication failed");
    },
  });
}

// Get Profile Query
export const useGetProfile = () => {
  const { isAuthenticated, isGuest, isAdmin } = useAuthStore();

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authService.getProfile,
    enabled: isAuthenticated && !isAdmin, // Fetch for all authenticated users (including guests)
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry if it's a 401/403 for guest users - they might not have profile access
      if (
        isGuest &&
        (error?.response?.status === 401 || error?.response?.status === 403)
      ) {
        return false;
      }
      // Retry once for other errors
      return failureCount < 1;
    },
  });
};

// Verify Email Mutation
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => authService.verifyEmail(data),
    onSuccess: (data) => {
      if (data.data.isSuccess) {
        showToast.success(
          data.message || "Sent! Check your email for an OTP code",
          { icon: null, style: notificationStyles.alertSuccess }
        );
      } else {
        showToast.error(data.message, { icon: null, style: notificationStyles.alertError });
      }
    },
    onError: (error: any) => {
      showToast.error(
        error.response?.data?.message || "Failed to send verification email", { icon: null, style: notificationStyles.alertError }
      );
    },
  });
};

// Verify OTP Mutation
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => authService.verifyOtp(data),
    onSuccess: (data) => {
      if (data.data.isSuccess) {
        showToast.success(data.message, {icon: null, style: notificationStyles.alertSuccess, duration: 10000});
      } else {
        showToast.error(data.message || "OTP is expired or invalid", {icon: null, style: notificationStyles.alertError, duration: 10000});
      }
    },
    onError: (error: any) => {
      showToast.error(error.response?.data?.message || "Failed to verify OTP", {icon: null, style: notificationStyles.alertError});
    },
  });
};

// Register Mutation
export const useRegister = () => {
  const { setUser, setTokens } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      // Set tokens and user in store
      setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
      });
      setUser(data.user);

      // Cache the user profile
      queryClient.setQueryData(authKeys.profile(), data.user);

      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
};

// Guest User Mutation
export const useCreateGuestUser = () => {
  const { setUser, setGuestToken } = useAuthStore();

  return useMutation({
    mutationFn: (data: GuestUserRequest) => authService.createGuestUser(data),
    onSuccess: (data) => {
      setGuestToken(data.token);
      setUser(data.user);
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create guest user"
      );
    },
  });
};

// Complete Registration Mutation (Guest to Full User)
export const useCompleteRegistration = () => {
  const { setUser, setTokens } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompleteRegistrationRequest) =>
      authService.completeRegistration(data),
    onSuccess: (data) => {
      // Clear guest token and set regular tokens
      localStorage.removeItem("araafit_guest_token");

      setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
      });
      setUser(data.user);

      // Cache the user profile
      queryClient.setQueryData(authKeys.profile(), data.user);

      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to complete registration"
      );
    },
  });
};

// Login Mutation
export const useLogin = () => {
  const { setUser, setTokens } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      console.log("data", data);
      setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
      });
      setUser(data.user);

      // Cache the user profile
      queryClient.setQueryData(authKeys.profile(), data.user);

      toast.success(data.message || "Logged in successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
};

// Logout Mutation
export const useLogout = () => {
  const { logout, isGuest } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // For guest users, no need to call server logout
      if (isGuest) {
        return { message: "Guest session ended" };
      }

      // For full users, call server logout
      const refreshToken = tokenUtils.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }
      return authService.logout({ refreshToken });
    },
    onSuccess: (data) => {
      logout();
      queryClient.clear(); // Clear all cached data
      toast.success(data.message || "Logged out successfully");
    },
    onError: (error: any) => {
      // Even if logout fails on server, clear local state
      logout();
      queryClient.clear();

      if (isGuest) {
        toast.success("Guest session ended");
      } else {
        toast.error(error.response?.data?.message || "Logout failed");
      }
    },
  });
};

// Forgot Password Mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to send reset email"
      );
    },
  });
};

// Reset Password Mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reset password");
    },
  });
};
