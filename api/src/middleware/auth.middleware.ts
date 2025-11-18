import { FastifyRequest, FastifyReply } from 'fastify'
import { authenticationService } from '../services/auth.service'

/**
 * Request-level cache for user data
 * Prevents repeated token validations within the same request
 */
const requestCache = new WeakMap<FastifyRequest, Map<string, any>>()

/**
 * Get or create cache for a request
 */
function getRequestCache(request: FastifyRequest): Map<string, any> {
  if (!requestCache.has(request)) {
    requestCache.set(request, new Map())
  }
  return requestCache.get(request)!
}

/**
 * requireAuth Middleware
 *
 * Requires user to be authenticated via valid accessToken cookie.
 * - Validates token with GitHub API
 * - Populates request.user with authenticated user data
 * - Returns 401 Unauthorized if token is missing or invalid
 *
 * Usage:
 * ```typescript
 * fastify.get('/protected', {
 *   preHandler: [requireAuth],
 *   handler: async (request, reply) => {
 *     const userId = request.user!.id // user is guaranteed to exist
 *   }
 * })
 * ```
 */
export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const accessToken = request.cookies.accessToken

  // Check if token exists
  if (!accessToken) {
    return reply.code(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Authentication required',
    })
  }

  // Get request-level cache
  const cache = getRequestCache(request)

  // Validate token and get user data (with caching)
  const user = await authenticationService.validateTokenWithCache(
    accessToken,
    cache
  )

  // Check if token is valid
  if (!user) {
    return reply.code(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid or expired access token',
    })
  }

  // Populate request.user
  request.user = user
}

/**
 * optionalAuth Middleware
 *
 * Optionally authenticates user if valid accessToken cookie is present.
 * - Validates token with GitHub API if present
 * - Populates request.user if token is valid
 * - Does NOT return 401 if token is missing or invalid
 * - Allows request to continue regardless of authentication status
 *
 * Use for public endpoints that show different data when authenticated.
 *
 * Usage:
 * ```typescript
 * fastify.get('/public', {
 *   preHandler: [optionalAuth],
 *   handler: async (request, reply) => {
 *     if (request.user) {
 *       // User is authenticated - show personalized data
 *     } else {
 *       // User is anonymous - show public data
 *     }
 *   }
 * })
 * ```
 */
export async function optionalAuth(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const accessToken = request.cookies.accessToken

  // If no token, continue without authentication
  if (!accessToken) {
    return
  }

  // Get request-level cache
  const cache = getRequestCache(request)

  // Try to validate token
  const user = await authenticationService.validateTokenWithCache(
    accessToken,
    cache
  )

  // Populate request.user if valid, otherwise leave undefined
  if (user) {
    request.user = user
  }

  // Always continue, regardless of authentication status
}
