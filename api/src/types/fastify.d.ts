import { FastifyRequest } from 'fastify'

/**
 * Extend Fastify's type definitions to include user context
 * This allows TypeScript autocomplete for request.user throughout the codebase
 */
declare module 'fastify' {
  interface FastifyRequest {
    /**
     * Authenticated user information
     * Populated by requireAuth middleware
     * Will be undefined if optionalAuth is used and user is not authenticated
     */
    user?: {
      /** User's UUID from database */
      id: string
      /** User's email address */
      email: string
      /** User's username (nullable) */
      username: string | null
      /** Account creation timestamp */
      created_at: string
      /** Last update timestamp */
      updated_at: string
    }
  }
}
