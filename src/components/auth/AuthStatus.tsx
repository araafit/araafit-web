import { useAuth } from "../../hooks/use-auth";
import { useLogout } from "../../hooks/auth.hooks";
import Button from "../../shared-components/button";
import Spinner from "../../shared-components/spinner";

/**
 * Simple auth status component showing current user state
 * Can be used in navigation or anywhere you need to show auth status
 */
export const AuthStatus = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    isGuestUser, 
    isFullUser 
  } = useAuth();
  const logoutMutation = useLogout();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Spinner size="sm" />
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Not authenticated</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* User info */}
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {isGuestUser ? "Guest User" : `${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
        </span>
        {user?.email && (
          <span className="text-xs text-gray-500">{user.email}</span>
        )}
        <span className="text-xs text-blue-600">
          {isGuestUser ? "Guest" : isFullUser ? "Authenticated" : "User"}
        </span>
      </div>

      {/* Logout button */}
      <Button
        text="Logout"
        variant="outline"
        //size="sm"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        className="text-xs px-2 py-1"
      />
    </div>
  );
};

/**
 * Minimal auth indicator for use in navigation bars
 */
export const AuthIndicator = () => {
  const { isAuthenticated, isGuestUser, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span>Not logged in</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${isGuestUser ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
      <span>
        {isGuestUser ? 'Guest' : (user?.firstName || 'User')}
      </span>
    </div>
  );
};

export default AuthStatus;
