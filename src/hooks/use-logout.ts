import { useNavigate } from "react-router-dom";
import { useLogout as useLogoutMutation } from "./auth.hooks";
import { useAuth } from "./use-auth";

/**
 * Simplified logout hook with automatic navigation
 * Use this when you want a simple logout function with automatic redirect
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const { isGuestUser } = useAuth();
  const logoutMutation = useLogoutMutation();

  const logout = (redirectTo?: string) => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        // Default redirect based on user type
        const defaultRedirect = isGuestUser ? "/get-measured" : "/auth/login";
        navigate(redirectTo || defaultRedirect);
      },
    });
  };

  return {
    logout,
    isLoading: logoutMutation.isPending,
    isSuccess: logoutMutation.isSuccess,
    error: logoutMutation.error,
  };
};

/**
 * Quick logout function for immediate use
 * Logs out and redirects to login page
 */
export const useQuickLogout = () => {
  const { logout, isLoading } = useLogout();
  
  return {
    logout: () => logout("/auth/login"),
    isLoading,
  };
};

export default useLogout;
