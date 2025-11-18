import { FastifyRequest, FastifyReply } from 'fastify'
import { authorizationService } from '../services/authorization.service'

/**
 * requireOrgMember Middleware
 *
 * Requires user to be a member of the organization (any role).
 * Expects organization_id in request params or body.
 * Returns 403 Forbidden if user is not a member.
 *
 * Usage:
 * ```typescript
 * fastify.get('/organizations/:organization_id', {
 *   preHandler: [requireAuth, requireOrgMember],
 *   handler: controller.getOrganization
 * })
 * ```
 */
export async function requireOrgMember(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user!.id // requireAuth ensures this exists

  // Try to get organization_id from params or body
  const orgId = (request.params as any).organization_id ||
                (request.params as any).id || // For /organizations/:id endpoints
                (request.body as any)?.organization_id

  if (!orgId) {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'organization_id is required',
    })
  }

  const isMember = await authorizationService.isOrgMember(userId, orgId)

  if (!isMember) {
    return reply.code(403).send({
      statusCode: 403,
      error: 'Forbidden',
      message: 'You are not a member of this organization',
    })
  }
}

/**
 * requireOrgAdmin Middleware
 *
 * Requires user to be an admin of the organization.
 * Used for admin-only operations (create board, delete org, etc.)
 * Returns 403 Forbidden if user is not an admin.
 *
 * Usage:
 * ```typescript
 * fastify.delete('/organizations/:organization_id', {
 *   preHandler: [requireAuth, requireOrgAdmin],
 *   handler: controller.deleteOrganization
 * })
 * ```
 */
export async function requireOrgAdmin(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user!.id

  // Try to get organization_id from params or body
  const orgId = (request.params as any).organization_id ||
                (request.params as any).id ||
                (request.body as any)?.organization_id

  if (!orgId) {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'organization_id is required',
    })
  }

  const isAdmin = await authorizationService.isOrgAdmin(userId, orgId)

  if (!isAdmin) {
    return reply.code(403).send({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Admin access required for this operation',
    })
  }
}

/**
 * requireBoardAccess Middleware
 *
 * Requires user to have access to the board (via organization membership).
 * Returns 403 Forbidden if user cannot access the board.
 *
 * Usage:
 * ```typescript
 * fastify.get('/boards/:id', {
 *   preHandler: [requireAuth, requireBoardAccess],
 *   handler: controller.getBoard
 * })
 * ```
 */
export async function requireBoardAccess(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user!.id

  // Try to get board_id from params or body
  const boardId = (request.params as any).id ||
                  (request.params as any).board_id ||
                  (request.body as any)?.board_id

  if (!boardId) {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'board_id is required',
    })
  }

  const hasAccess = await authorizationService.canAccessBoard(userId, boardId)

  if (!hasAccess) {
    return reply.code(403).send({
      statusCode: 403,
      error: 'Forbidden',
      message: 'You do not have access to this board',
    })
  }
}

/**
 * requireCardAccess Middleware
 *
 * Requires user to have access to the card (via board → organization membership).
 * Returns 403 Forbidden if user cannot access the card.
 *
 * Usage:
 * ```typescript
 * fastify.get('/cards/:id', {
 *   preHandler: [requireAuth, requireCardAccess],
 *   handler: controller.getCard
 * })
 * ```
 */
export async function requireCardAccess(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user!.id

  // Try to get card_id from params or body
  const cardId = (request.params as any).id ||
                 (request.params as any).card_id ||
                 (request.body as any)?.card_id

  if (!cardId) {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'card_id is required',
    })
  }

  const hasAccess = await authorizationService.canAccessCard(userId, cardId)

  if (!hasAccess) {
    return reply.code(403).send({
      statusCode: 403,
      error: 'Forbidden',
      message: 'You do not have access to this resource',
    })
  }
}

/**
 * requireListAccess Middleware
 *
 * Requires user to have access to the list (via board → organization membership).
 * Returns 403 Forbidden if user cannot access the list.
 *
 * Usage:
 * ```typescript
 * fastify.get('/lists/:id', {
 *   preHandler: [requireAuth, requireListAccess],
 *   handler: controller.getList
 * })
 * ```
 */
export async function requireListAccess(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user!.id

  // Try to get list_id from params or body
  const listId = (request.params as any).id ||
                 (request.params as any).list_id ||
                 (request.body as any)?.list_id

  if (!listId) {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'list_id is required',
    })
  }

  const hasAccess = await authorizationService.canAccessList(userId, listId)

  if (!hasAccess) {
    return reply.code(403).send({
      statusCode: 403,
      error: 'Forbidden',
      message: 'You do not have access to this resource',
    })
  }
}

/**
 * Helper function to check board access from organization_id in params
 * Used for endpoints like GET /boards/:organization_id/all
 */
export async function requireOrgAccessForBoards(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user!.id
  const orgId = (request.params as any).organization_id

  if (!orgId) {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'organization_id is required',
    })
  }

  const isMember = await authorizationService.isOrgMember(userId, orgId)

  if (!isMember) {
    return reply.code(403).send({
      statusCode: 403,
      error: 'Forbidden',
      message: 'You are not a member of this organization',
    })
  }
}
