import apiClient from '@/lib/axios';

/**
 * User interface matching the API response
 */
export interface AuthUser {
  id: string;
  login: string;
  email: string;
  avatar_url?: string;
}

/**
 * Authentication Service
 *
 * Provides methods for authentication operations using the configured API client.
 * All methods use cookie-based authentication (credentials included).
 */
export const authService = {
  /**
   * Get the current authenticated user
   * @returns Promise<AuthUser | null> - User data or null if not authenticated
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await apiClient.get<AuthUser>('/oauth/user');
      return response.data;
    } catch (error) {
      // Return null for 401/403 (not authenticated)
      // This is expected behavior, not an error
      return null;
    }
  },

  /**
   * Logout the current user
   * Clears session on server and removes cookies
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/oauth/logout');
      // Clear any local cookies
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch {
      // Even if logout fails on server, clear local state
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      throw new Error('Logout failed');
    }
  },

  /**
   * Initiate GitHub OAuth flow
   * Redirects to GitHub authentication
   */
  loginWithGitHub(): void {
    const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost';
    const API_PORT = import.meta.env.VITE_API_PORT || '4000';
    const API_VERSION = import.meta.env.VITE_API_VERSION || '/api/v1';

    window.location.href = `${API_HOST}:${API_PORT}${API_VERSION}/oauth/github`;
  },

  /**
   * Handle OAuth callback (called automatically by UserContext)
   * Processes access token from URL params
   */
  handleOAuthCallback(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');

    if (token) {
      // Store token in cookie
      document.cookie = `accessToken=${token}; path=/; samesite=strict`;

      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);

      return true;
    }

    return false;
  },
};
