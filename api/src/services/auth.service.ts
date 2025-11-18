import { fetchUserData, UserService } from '../modules/oauth/oauth.service'

/**
 * User data structure returned by authentication
 */
export interface AuthenticatedUser {
  id: string
  email: string
  username: string | null
  created_at: string
  updated_at: string
}

/**
 * AuthenticationService
 * Handles token validation and user authentication
 */
export class AuthenticationService {
  private readonly userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  /**
   * Validates GitHub OAuth access token and returns authenticated user
   * @param accessToken - GitHub OAuth access token from cookie
   * @returns User object or null if token is invalid
   */
  async validateToken(accessToken: string): Promise<AuthenticatedUser | null> {
    try {
      // Validate token with GitHub API
      const githubUser = await fetchUserData(accessToken)

      if (!githubUser) {
        return null
      }

      // Get user from database
      const user = await this.userService.getUser(githubUser.id)

      if (!user) {
        // User exists in GitHub but not in our database
        // This shouldn't happen after OAuth flow, but handle gracefully
        return null
      }

      // Get profile data
      const profile = await this.userService.getProfile(user.id)

      if (!profile) {
        return null
      }

      // Return standardized user object
      return {
        id: user.id,
        email: profile.email,
        username: profile.username,
        created_at: user.created_at,
        updated_at: user.updated_at,
      }
    } catch (error) {
      console.error('Token validation error:', error)
      return null
    }
  }

  /**
   * Gets user by UUID from database
   * @param userId - User UUID
   * @returns User object or null if not found
   */
  async getUserById(userId: string): Promise<AuthenticatedUser | null> {
    try {
      // Note: UserService.getUser expects GitHub ID, not UUID
      // We need to query by UUID directly
      const profile = await this.userService.getProfile(userId)

      if (!profile) {
        return null
      }

      return {
        id: userId,
        email: profile.email,
        username: profile.username,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      }
    } catch (error) {
      console.error('Get user by ID error:', error)
      return null
    }
  }

  /**
   * Validates token and caches result at request level
   * Used by authentication middleware to avoid repeated GitHub API calls
   * @param accessToken - GitHub OAuth access token
   * @param cache - Optional Map for request-level caching
   * @returns User object or null
   */
  async validateTokenWithCache(
    accessToken: string,
    cache?: Map<string, AuthenticatedUser>
  ): Promise<AuthenticatedUser | null> {
    // Check cache first
    if (cache?.has(accessToken)) {
      return cache.get(accessToken)!
    }

    // Validate token
    const user = await this.validateToken(accessToken)

    // Store in cache if provided and user found
    if (user && cache) {
      cache.set(accessToken, user)
    }

    return user
  }
}

// Export singleton instance
export const authenticationService = new AuthenticationService()
