import knexInstance from '../db/knexInstance'

/**
 * User role in organization
 */
export type UserRole = 'ADMIN' | 'MEMBER' | 'GUEST'

/**
 * AuthorizationService
 * Handles permission checks for resources based on organization membership and roles
 */
export class AuthorizationService {
  private readonly knex = knexInstance

  /**
   * Check if user is a member of organization
   * @param userId - User UUID
   * @param orgId - Organization UUID
   * @returns true if user is a member (any role), false otherwise
   */
  async isOrgMember(userId: string, orgId: string): Promise<boolean> {
    const membership = await this.knex('user_organization')
      .where({ user_id: userId, organization_id: orgId })
      .first()

    return !!membership
  }

  /**
   * Get user's role in organization
   * @param userId - User UUID
   * @param orgId - Organization UUID
   * @returns User's role or null if not a member
   */
  async getUserOrgRole(userId: string, orgId: string): Promise<UserRole | null> {
    const membership = await this.knex('user_organization')
      .where({ user_id: userId, organization_id: orgId })
      .first()

    return membership?.role || null
  }

  /**
   * Check if user is an admin of organization
   * @param userId - User UUID
   * @param orgId - Organization UUID
   * @returns true if user has ADMIN role, false otherwise
   */
  async isOrgAdmin(userId: string, orgId: string): Promise<boolean> {
    const role = await this.getUserOrgRole(userId, orgId)
    return role === 'ADMIN'
  }

  /**
   * Get organization ID from board ID
   * @param boardId - Board UUID
   * @returns Organization UUID or null if board not found
   */
  async getBoardOrganization(boardId: string): Promise<string | null> {
    const board = await this.knex('boards')
      .where({ id: boardId })
      .first()

    return board?.organization_id || null
  }

  /**
   * Check if user can access board (via organization membership)
   * @param userId - User UUID
   * @param boardId - Board UUID
   * @returns true if user is member of board's organization, false otherwise
   */
  async canAccessBoard(userId: string, boardId: string): Promise<boolean> {
    // Get board's organization
    const orgId = await this.getBoardOrganization(boardId)

    if (!orgId) {
      return false
    }

    // Check if user is member of organization
    return await this.isOrgMember(userId, orgId)
  }

  /**
   * Get board ID from list ID
   * @param listId - List UUID
   * @returns Board UUID or null if list not found
   */
  async getListBoard(listId: string): Promise<string | null> {
    const list = await this.knex('lists')
      .where({ id: listId })
      .first()

    return list?.board_id || null
  }

  /**
   * Get board ID from card ID (via list)
   * @param cardId - Card UUID
   * @returns Board UUID or null if card not found
   */
  async getCardBoard(cardId: string): Promise<string | null> {
    // Get card with its list info
    const result = await this.knex('cards')
      .join('lists', 'cards.list_id', 'lists.id')
      .where('cards.id', cardId)
      .select('lists.board_id')
      .first()

    return result?.board_id || null
  }

  /**
   * Check if user can access card (via board access)
   * @param userId - User UUID
   * @param cardId - Card UUID
   * @returns true if user can access the card's board, false otherwise
   */
  async canAccessCard(userId: string, cardId: string): Promise<boolean> {
    const boardId = await this.getCardBoard(cardId)

    if (!boardId) {
      return false
    }

    return await this.canAccessBoard(userId, boardId)
  }

  /**
   * Check if user can access list (via board access)
   * @param userId - User UUID
   * @param listId - List UUID
   * @returns true if user can access the list's board, false otherwise
   */
  async canAccessList(userId: string, listId: string): Promise<boolean> {
    const boardId = await this.getListBoard(listId)

    if (!boardId) {
      return false
    }

    return await this.canAccessBoard(userId, boardId)
  }

  /**
   * Get all organizations user is a member of
   * @param userId - User UUID
   * @returns Array of organization IDs
   */
  async getUserOrganizations(userId: string): Promise<string[]> {
    const memberships = await this.knex('user_organization')
      .where({ user_id: userId })
      .select('organization_id')

    return memberships.map(m => m.organization_id)
  }

  /**
   * Get all boards user can access (via organization memberships)
   * @param userId - User UUID
   * @returns Array of board IDs
   */
  async getUserAccessibleBoards(userId: string): Promise<string[]> {
    const boards = await this.knex('boards')
      .join('user_organization', 'boards.organization_id', 'user_organization.organization_id')
      .where('user_organization.user_id', userId)
      .select('boards.id')

    return boards.map(b => b.id)
  }

  /**
   * Add user to organization with specified role
   * @param userId - User UUID
   * @param orgId - Organization UUID
   * @param role - User role (ADMIN, MEMBER, GUEST)
   */
  async addUserToOrganization(userId: string, orgId: string, role: UserRole): Promise<void> {
    await this.knex('user_organization').insert({
      user_id: userId,
      organization_id: orgId,
      role: role
    })
  }

  /**
   * Remove user from organization
   * @param userId - User UUID
   * @param orgId - Organization UUID
   */
  async removeUserFromOrganization(userId: string, orgId: string): Promise<void> {
    await this.knex('user_organization')
      .where({ user_id: userId, organization_id: orgId })
      .delete()
  }

  /**
   * Update user's role in organization
   * @param userId - User UUID
   * @param orgId - Organization UUID
   * @param role - New role
   */
  async updateUserRole(userId: string, orgId: string, role: UserRole): Promise<void> {
    await this.knex('user_organization')
      .where({ user_id: userId, organization_id: orgId })
      .update({ role })
  }

  /**
   * Get card ID from comment ID
   * @param commentId - Comment UUID
   * @returns Card UUID or null if comment not found
   */
  async getCommentCard(commentId: string): Promise<string | null> {
    const comment = await this.knex('comments')
      .where({ id: commentId })
      .first()

    return comment?.card_id || null
  }

  /**
   * Check if user can access comment (via card access)
   * @param userId - User UUID
   * @param commentId - Comment UUID
   * @returns true if user can access the comment's card, false otherwise
   */
  async canAccessComment(userId: string, commentId: string): Promise<boolean> {
    const cardId = await this.getCommentCard(commentId)

    if (!cardId) {
      return false
    }

    return await this.canAccessCard(userId, cardId)
  }

  /**
   * Get board ID from sprint ID
   * @param sprintId - Sprint UUID
   * @returns Board UUID or null if sprint not found
   */
  async getSprintBoard(sprintId: string): Promise<string | null> {
    const sprint = await this.knex('sprints')
      .where({ id: sprintId })
      .first()

    return sprint?.board_id || null
  }

  /**
   * Check if user can access sprint (via board access)
   * @param userId - User UUID
   * @param sprintId - Sprint UUID
   * @returns true if user can access the sprint's board, false otherwise
   */
  async canAccessSprint(userId: string, sprintId: string): Promise<boolean> {
    const boardId = await this.getSprintBoard(sprintId)

    if (!boardId) {
      return false
    }

    return await this.canAccessBoard(userId, boardId)
  }

  /**
   * Get time log owner
   * @param timeLogId - Time Log UUID
   * @returns Time log with user_id or null if not found
   */
  async getTimeLogOwner(timeLogId: string): Promise<{ user_id: string } | null> {
    const timeLog = await this.knex('time_logs')
      .where({ id: timeLogId })
      .select('user_id')
      .first()

    return timeLog || null
  }

  /**
   * Get reminder owner
   * @param reminderId - Reminder UUID
   * @returns Reminder with user_id or null if not found
   */
  async getReminderOwner(reminderId: string): Promise<{ user_id: string } | null> {
    const reminder = await this.knex('reminders')
      .where({ id: reminderId })
      .select('user_id')
      .first()

    return reminder || null
  }
}

// Export singleton instance
export const authorizationService = new AuthorizationService()
