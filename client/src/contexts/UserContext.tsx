import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

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
  apiBaseUrl?: string;
}

/**
 * User Provider Component
 * Manages user authentication state
 */
export const UserProvider: React.FC<UserProviderProps> = ({
  children,
  apiBaseUrl = 'http://localhost:4000',
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch current user from API
   */
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/api/v1/oauth/user`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();

        // Map the GitHub user data to our User interface
        // Assuming the backend returns GitHub user data with an id
        const userData: User = {
          id: data.id?.toString() || data.login, // Use GitHub ID or login as fallback
          login: data.login,
          email: data.email || `${data.login}@github.user`, // Fallback email if not available
          avatar_url: data.avatar_url,
        };

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
  }, [apiBaseUrl]);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await fetch(`${apiBaseUrl}/api/v1/oauth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      setUser(null);

      // Clear cookies
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      console.log('User logged out');
    } catch (err) {
      console.error('Error logging out:', err);
      setError(err as Error);
    }
  }, [apiBaseUrl]);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  /**
   * Fetch user on mount and handle access token from URL
   */
  useEffect(() => {
    // Check for access token in URL params (OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');

    if (token) {
      document.cookie = `accessToken=${token}; path=/; samesite=strict`;
      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

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
