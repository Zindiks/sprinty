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

/**
 * requireBoardOrgAdmin Middleware
 *
 * Requires user to be an admin of the board's organization.
 * Used for admin-only board operations (delete board, etc.)
 * Returns 403 Forbidden if user is not an admin.
 *
 * Usage:
 * ```typescript
 * fastify.delete('/boards/:id', {
 *   preHandler: [requireAuth, requireBoardOrgAdmin],
 *   handler: controller.deleteBoard
 * })
 * ```
 */
export async function requireBoardOrgAdmin(
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

  // Get the board's organization
  const orgId = await authorizationService.getBoardOrganization(boardId)

  if (!orgId) {
    return reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Board not found',
    })
  }

  // Check if user is admin of the organization
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
 * requireBulkCardAccess Middleware
 *
 * Requires user to have access to all cards in a bulk operation.
 * Expects card_ids array in request body.
 * Returns 403 Forbidden if user cannot access any of the cards.
 *
 * Usage:
 * ```typescript
 * fastify.post('/cards/bulk/move', {
 *   preHandler: [requireAuth, requireBulkCardAccess],
 *   handler: controller.bulkMoveCards
 * })
 * ```
 */
export async function requireBulkCardAccess(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user!.id
  const cardIds = (request.body as any)?.card_ids

  if (!cardIds || !Array.isArray(cardIds) || cardIds.length === 0) {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'card_ids array is required',
    })
  }

  // Check access for each card
  for (const cardId of cardIds) {
    const hasAccess = await authorizationService.canAccessCard(userId, cardId)

    if (!hasAccess) {
      return reply.code(403).send({
        statusCode: 403,
        error: 'Forbidden',
        message: 'You do not have access to one or more cards',
      })
    }
  }
}

/**
 * requireCommentAccess Middleware
 *
 * Requires user to have access to the comment (via card access).
 * Returns 403 Forbidden if user cannot access the comment.
 *
 * Usage:
 * ```typescript
 * fastify.get('/comments/:comment_id/replies', {
 *   preHandler: [requireAuth, requireCommentAccess],
 *   handler: controller.getReplies
 * })
 * ```
 */
export async function requireCommentAccess(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user!.id

  // Try to get comment_id from params or body
  const commentId = (request.params as any).id ||
                    (request.params as any).comment_id ||
                    (request.body as any)?.comment_id

  if (!commentId) {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'comment_id is required',
    })
  }

  const hasAccess = await authorizationService.canAccessComment(userId, commentId)

  if (!hasAccess) {
    return reply.code(403).send({
      statusCode: 403,
      error: 'Forbidden',
      message: 'You do not have access to this resource',
    })
  }
}

/**
 * requireSprintAccess Middleware
 *
 * Requires user to have access to the sprint (via board access).
 * Returns 403 Forbidden if user cannot access the sprint.
 *
 * Usage:
 * ```typescript
 * fastify.get('/sprints/:id', {
 *   preHandler: [requireAuth, requireSprintAccess],
 *   handler: controller.getSprint
 * })
 * ```
 */
export async function requireSprintAccess(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user!.id

  // Try to get sprint_id from params or body
  const sprintId = (request.params as any).id ||
                   (request.params as any).sprint_id ||
                   (request.body as any)?.sprint_id

  if (!sprintId) {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'sprint_id is required',
    })
  }

  const hasAccess = await authorizationService.canAccessSprint(userId, sprintId)

  if (!hasAccess) {
    return reply.code(403).send({
      statusCode: 403,
      error: 'Forbidden',
      message: 'You do not have access to this resource',
    })
  }
}
