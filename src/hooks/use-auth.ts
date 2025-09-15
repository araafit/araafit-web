import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth-store';
import { useGetProfile } from './auth.hooks';
import { tokenUtils } from '../lib/axios';

/**
 * Main authentication hook that provides:
 * - Current user state
 * - Authentication status
 * - Loading states
 * - Auto profile fetching for authenticated users
 */
export const useAuth = () => {
  const {
    user,
    adminUser,
    isAuthenticated,
    isLoading: authLoading,
    isGuest,
    isAdmin,
    setUser,
    setLoading,
    initializeAuth,
    logout,
  } = useAuthStore();

  // Fetch profile for authenticated non-guest, non-admin users
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useGetProfile();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Update user when profile data changes (only for regular users, not admins)
  useEffect(() => {
    if (profileData && isAuthenticated && !isAdmin) {
      setUser(profileData);
    }
  }, [profileData, isAuthenticated, isAdmin, setUser]);

  // Handle profile fetch errors
  useEffect(() => {
    if (profileError && isAuthenticated) {
      console.error('Failed to fetch profile:', profileError);
      
      // For admin users, profile errors are expected (admins don't use regular profile endpoint)
      if (isAdmin) {
        console.warn('Admin user profile fetch failed (this is expected)');
        return;
      }
      
      // For guest users, profile errors might be expected (no profile endpoint access)
      if (isGuest) {
        // For guests, just log the error but don't logout
        console.warn('Guest user profile fetch failed (this might be expected)');
        return;
      }
      
      // For full users, if token is expired or invalid, logout
      const token = tokenUtils.getAccessToken();
      if (!token || tokenUtils.isTokenExpired(token)) {
        logout();
      }
    }
  }, [profileError, isAuthenticated, isGuest, isAdmin, logout]);

  // Set loading state
  useEffect(() => {
    // For guests and admins, don't wait for profile data since they might not have profile access
    // For full users, wait for profile data to load
    const isLoading = authLoading || (isAuthenticated && !isGuest && !isAdmin && profileLoading && !profileData && !profileError);
    setLoading(isLoading);
  }, [authLoading, isAuthenticated, isGuest, isAdmin, profileLoading, profileData, profileError, setLoading]);

  // Helper functions
  const isLoggedIn = isAuthenticated;
  const isFullUser = isAuthenticated && !isGuest && !isAdmin;
  const isGuestUser = isAuthenticated && isGuest;
  const isAdminUser = isAuthenticated && isAdmin;
  const hasCompleteProfile = user && user.firstName && user.lastName && user.email;

  return {
    // User data
    user,
    adminUser,
    
    // Authentication status
    isAuthenticated,
    isLoggedIn,
    isGuest,
    isGuestUser,
    isFullUser,
    isAdmin,
    isAdminUser,
    
    // Loading states
    isLoading: authLoading || profileLoading,
    authLoading,
    profileLoading,
    
    // Profile status
    hasCompleteProfile,
    
    // Actions
    refetchProfile,
    logout,
    
    // Error state
    profileError,
  };
};

export default useAuth;
