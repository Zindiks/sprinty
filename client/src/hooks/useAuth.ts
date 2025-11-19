import { useUser } from '@/contexts/UserContext';
import { authService } from '@/services/auth.service';
import { useCallback } from 'react';

/**
 * useAuth Hook
 *
 * Convenient wrapper around UserContext that provides authentication
 * state and methods with better developer experience.
 *
 * @returns Authentication state and methods
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, isLoading, login, logout } = useAuth();
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (!isAuthenticated) return <LoginButton onClick={login} />;
 * return <Dashboard user={user} onLogout={logout} />;
 * ```
 */
export const useAuth = () => {
  const { user, loading, error, logout: contextLogout, refreshUser } = useUser();

  /**
   * Login with GitHub OAuth
   * Redirects to GitHub authentication flow
   */
  const login = useCallback(() => {
    authService.loginWithGitHub();
  }, []);

  /**
   * Logout the current user
   * Clears session and refreshes user state
   */
  const logout = useCallback(async () => {
    await contextLogout();
    // Optionally refresh to ensure state is clean
    await refreshUser();
  }, [contextLogout, refreshUser]);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!user;

  /**
   * Check if currently loading auth state
   */
  const isLoading = loading;

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Methods
    login,
    logout,
    refreshUser,
  };
};
