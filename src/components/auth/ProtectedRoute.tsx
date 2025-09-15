import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import Spinner from "../../shared-components/spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireFullUser?: boolean;
  adminOnly?: boolean;
  redirectTo?: string;
}

/**
 * Route protection component that handles authentication and authorization
 */
export const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireFullUser = false,
  adminOnly = false,
  redirectTo,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user, isGuestUser } = useAuth();
  const location = useLocation();

  // Show loading while authentication state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    const redirectPath = redirectTo || "/auth/login";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If full user is required but user is a guest
  if (requireFullUser && isGuestUser) {
    const redirectPath = redirectTo || "/auth/register";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If admin only but user is not admin (you'll need to add admin role to user type)
  if (adminOnly && (!user || user.email?.includes("@admin."))) {
    const redirectPath = redirectTo || "/auth/admin-login";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If user is authenticated but shouldn't access this route (like login pages)
  if (!requireAuth && isAuthenticated) {
    const redirectPath = redirectTo || "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

/**
 * Component that only shows children to authenticated users
 */
export const AuthOnly = ({ children }: { children: ReactNode }) => {
  return (
    <ProtectedRoute requireAuth={true}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * Component that only shows children to full (non-guest) users
 */
export const FullUserOnly = ({ children }: { children: ReactNode }) => {
  return (
    <ProtectedRoute requireAuth={true} requireFullUser={true}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * Component that only shows children to guest users or unauthenticated users
 */
export const GuestOnly = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isGuestUser } = useAuth();
  
  if (isAuthenticated && !isGuestUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

/**
 * Component that redirects authenticated users away from auth pages
 */
export const PublicOnly = ({ children }: { children: ReactNode }) => {
  return (
    <ProtectedRoute requireAuth={false}>
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
