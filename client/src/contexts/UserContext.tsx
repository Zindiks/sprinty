import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService, type AuthUser } from '@/services/auth.service';

/**
 * User data structure
 */
export interface User {
  id: string;
  login: string;
  email: string;
  avatar_url?: string;
}

/**
 * Map AuthUser to User interface
 */
const mapAuthUser = (authUser: AuthUser): User => ({
  id: authUser.id?.toString() || authUser.login,
  login: authUser.login,
  email: authUser.email || `${authUser.login}@github.user`,
  avatar_url: authUser.avatar_url,
});

/**
 * User Context Value
 */
interface UserContextValue {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

/**
 * User Provider Props
 */
interface UserProviderProps {
  children: React.ReactNode;
}

/**
 * User Provider Component
 * Manages user authentication state
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch current user from API using auth service
   */
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const authUser = await authService.getCurrentUser();

      if (authUser) {
        const userData = mapAuthUser(authUser);
        setUser(userData);
        console.log('User authenticated:', userData);
      } else {
        setUser(null);
        console.log('User not authenticated');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err as Error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user using auth service
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      console.log('User logged out');
    } catch (err) {
      console.error('Error logging out:', err);
      setError(err as Error);
      // Still clear user state even if logout fails
      setUser(null);
    }
  }, []);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  /**
   * Fetch user on mount and handle OAuth callback
   */
  useEffect(() => {
    // Handle OAuth callback using auth service
    authService.handleOAuthCallback();

    // Fetch user data
    fetchUser();
  }, [fetchUser]);

  const value: UserContextValue = {
    user,
    loading,
    error,
    refreshUser,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

/**
 * Custom hook to use user context
 */
export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
