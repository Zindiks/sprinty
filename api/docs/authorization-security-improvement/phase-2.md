# Authorization Security Improvement - Phase 2: Organization & Board Authorization

**Status:** Planned
**Created:** 2025-11-17
**Priority:** 🔴 CRITICAL - P0
**Depends On:** Phase 1 (Authentication Middleware)
**Estimated Duration:** 2-3 days

---

## Overview

Phase 2 implements **authorization** - ensuring users can only access resources they have permission to access. This focuses on organization membership and board access control.

**Key Principle:** User must be a member of an organization to access its boards, lists, cards, and all child resources.

---

## Goals

- [ ] Create `AuthorizationService` for permission checks
- [ ] Implement `requireOrgMember` middleware
- [ ] Implement `requireBoardAccess` middleware
- [ ] Apply authorization to all organization endpoints
- [ ] Apply authorization to all board endpoints
- [ ] Apply authorization to all child resources (lists, cards, etc.)
- [ ] Fix and populate `user_organization` role field
- [ ] Comprehensive testing (90%+ coverage)

---

## Current State

### What Works (After Phase 1)
- ✅ `request.user` is populated
- ✅ Users are authenticated

### Critical Gaps
- ❌ `user_organization` table has role field but **NEVER QUERIED**
- ❌ Any authenticated user can access ANY organization
- ❌ Any authenticated user can access ANY board
- ❌ No checks on child resources (lists, cards, comments, attachments)

---

## Authorization Model

### Hierarchy
```
User → Organization Membership → Board Access → Resource Access
         (via user_organization)   (via board.organization_id)
```

### Permission Rules
1. **Organization Level:**
   - User must be in `user_organization` to access organization
   - Role field: `ADMIN` | `MEMBER` | `GUEST`

2. **Board Level:**
   - Board belongs to organization
   - User has board access IF user is member of board's organization

3. **Resource Level:**
   - List belongs to board
   - Card belongs to list → belongs to board → belongs to organization
   - User has resource access IF user can access the board

---

## Implementation Plan

### Task 1: Fix user_organization Schema & Seed Data

**File:** `/api/src/db/schemas/user-organization.ts`

Add missing role field:
```typescript
export const userOrganizationSchema = Type.Object({
  user_id: Type.String({ format: 'uuid' }),
  organization_id: Type.String({ format: 'uuid' }),
  role: Type.Union([
    Type.Literal('ADMIN'),
    Type.Literal('MEMBER'),
    Type.Literal('GUEST')
  ]),
  joined_at: Type.String({ format: 'date-time' })
})
```

**File:** `/api/src/db/seeds/development/021-user-organization.ts`

Populate role field in seed data:
```typescript
await knex('user_organization').insert([
  {
    user_id: user1.id,
    organization_id: org1.id,
    role: 'ADMIN', // Creator is admin
  },
  {
    user_id: user2.id,
    organization_id: org1.id,
    role: 'MEMBER', // Other users are members
  }
])
```

---

### Task 2: Create Authorization Service

**New File:** `/api/src/services/authorization.service.ts`

**Methods:**
```typescript
class AuthorizationService {
  /**
   * Check if user is member of organization
   */
  async isOrgMember(userId: string, orgId: string): Promise<boolean>

  /**
   * Get user's role in organization
   */
  async getUserOrgRole(userId: string, orgId: string): Promise<'ADMIN' | 'MEMBER' | 'GUEST' | null>

  /**
   * Check if user is admin of organization
   */
  async isOrgAdmin(userId: string, orgId: string): Promise<boolean>

  /**
   * Check if user can access board (via org membership)
   */
  async canAccessBoard(userId: string, boardId: string): Promise<boolean>

  /**
   * Get organization ID from board ID
   */
  async getBoardOrganization(boardId: string): Promise<string | null>

  /**
   * Get board ID from list ID
   */
  async getListBoard(listId: string): Promise<string | null>

  /**
   * Get board ID from card ID (via list)
   */
  async getCardBoard(cardId: string): Promise<string | null>
}
```

**Database Queries:**
```typescript
async isOrgMember(userId: string, orgId: string): Promise<boolean> {
  const membership = await db('user_organization')
    .where({ user_id: userId, organization_id: orgId })
    .first()

  return !!membership
}

async canAccessBoard(userId: string, boardId: string): Promise<boolean> {
  // Get board's organization
  const board = await db('boards')
    .where({ id: boardId })
    .first()

  if (!board) return false

  // Check org membership
  return await this.isOrgMember(userId, board.organization_id)
}
```

---

### Task 3: Create Authorization Middleware

**New File:** `/api/src/middleware/authorization.middleware.ts`

**Middleware: `requireOrgMember`**
```typescript
/**
 * Requires user to be a member of the organization
 * Expects organization_id in request params or body
 */
export async function requireOrgMember(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user!.id // requireAuth ensures this exists
  const orgId = request.params.organization_id || request.body.organization_id

  if (!orgId) {
    return reply.code(400).send({ error: 'organization_id required' })
  }

  const isMember = await authzService.isOrgMember(userId, orgId)

  if (!isMember) {
    return reply.code(403).send({
      error: 'Forbidden',
      message: 'You are not a member of this organization'
    })
  }
}
```

**Middleware: `requireOrgAdmin`**
```typescript
/**
 * Requires user to be an admin of the organization
 * For admin-only operations (create board, delete org, etc.)
 */
export async function requireOrgAdmin(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user!.id
  const orgId = request.params.organization_id || request.body.organization_id

  if (!orgId) {
    return reply.code(400).send({ error: 'organization_id required' })
  }

  const isAdmin = await authzService.isOrgAdmin(userId, orgId)

  if (!isAdmin) {
    return reply.code(403).send({
      error: 'Forbidden',
      message: 'Admin access required for this operation'
    })
  }
}
```

**Middleware: `requireBoardAccess`**
```typescript
/**
 * Requires user to have access to the board
 * Checks via organization membership
 */
export async function requireBoardAccess(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user!.id
  const boardId = request.params.id || request.params.board_id || request.body.board_id

  if (!boardId) {
    return reply.code(400).send({ error: 'board_id required' })
  }

  const hasAccess = await authzService.canAccessBoard(userId, boardId)

  if (!hasAccess) {
    return reply.code(403).send({
      error: 'Forbidden',
      message: 'You do not have access to this board'
    })
  }
}
```

**Middleware: `requireCardAccess`** (checks via card → list → board)
```typescript
export async function requireCardAccess(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user!.id
  const cardId = request.params.id || request.params.card_id || request.body.card_id

  if (!cardId) {
    return reply.code(400).send({ error: 'card_id required' })
  }

  const boardId = await authzService.getCardBoard(cardId)

  if (!boardId) {
    return reply.code(404).send({ error: 'Card not found' })
  }

  const hasAccess = await authzService.canAccessBoard(userId, boardId)

  if (!hasAccess) {
    return reply.code(403).send({
      error: 'Forbidden',
      message: 'You do not have access to this resource'
    })
  }
}
```

---

### Task 4: Apply Middleware to Routes

**Organization Routes** - `/api/src/modules/organizations/organization.route.ts`

```typescript
// Public: List user's organizations
fastify.get('/organizations/all', {
  preHandler: [requireAuth], // User sees only THEIR orgs
  handler: controller.getAllOrganizations // Update to filter by user
})

// Requires org membership
fastify.get('/organizations/:organization_id', {
  preHandler: [requireAuth, requireOrgMember],
  handler: controller.getOrganization
})

// Requires org admin
fastify.put('/organizations/:organization_id', {
  preHandler: [requireAuth, requireOrgAdmin],
  handler: controller.updateOrganization
})

// Requires org admin
fastify.delete('/organizations/:organization_id', {
  preHandler: [requireAuth, requireOrgAdmin],
  handler: controller.deleteOrganization
})
```

**Board Routes** - `/api/src/modules/boards/board.route.ts`

```typescript
fastify.get('/boards/:id', {
  preHandler: [requireAuth, requireBoardAccess],
  handler: controller.getBoard
})

fastify.get('/boards/:organization_id/all', {
  preHandler: [requireAuth, requireOrgMember],
  handler: controller.getAllBoards
})

fastify.post('/boards', {
  preHandler: [requireAuth, requireOrgAdmin], // Admin-only
  handler: controller.createBoard
})

fastify.put('/boards/:id', {
  preHandler: [requireAuth, requireBoardAccess],
  handler: controller.updateBoard
})

fastify.delete('/boards/:id', {
  preHandler: [requireAuth, requireOrgAdmin], // Admin-only
  handler: controller.deleteBoard
})
```

**Card Routes** - `/api/src/modules/cards/card.route.ts`

```typescript
fastify.get('/cards/:id', {
  preHandler: [requireAuth, requireCardAccess],
  handler: controller.getCard
})

fastify.post('/cards', {
  preHandler: [requireAuth, requireBoardAccess], // Check list's board
  handler: controller.createCard
})

fastify.patch('/cards/update', {
  preHandler: [requireAuth, requireCardAccess],
  handler: controller.updateCard
})

fastify.delete('/cards/:id/list/:list_id', {
  preHandler: [requireAuth, requireCardAccess],
  handler: controller.deleteCard
})

// Bulk operations
fastify.post('/cards/bulk/move', {
  preHandler: [requireAuth, requireBoardAccess],
  handler: controller.bulkMoveCards
})

fastify.delete('/cards/bulk', {
  preHandler: [requireAuth, requireBoardAccess],
  handler: controller.bulkDeleteCards
})
```

**Similar patterns for:**
- Lists (requireBoardAccess via list.board_id)
- Comments (requireCardAccess)
- Attachments (requireCardAccess + ownership for delete)
- Labels (requireBoardAccess)
- Checklists (requireCardAccess)
- Assignees (requireCardAccess)
- Sprints (requireBoardAccess)
- Time Tracking (requireCardAccess)

---

### Task 5: Update Controllers

**Organization Controller** - Filter by user membership

```typescript
// Before: Returns ALL organizations
async getAllOrganizations(request, reply) {
  const organizations = await this.organizationService.getAllOrganizations()
  return reply.send(organizations)
}

// After: Returns only user's organizations
async getAllOrganizations(request, reply) {
  const userId = request.user!.id
  const organizations = await this.organizationService.getUserOrganizations(userId)
  return reply.send(organizations)
}
```

**New Service Method:**
```typescript
// organization.service.ts
async getUserOrganizations(userId: string) {
  return await db('organizations')
    .join('user_organization', 'organizations.id', 'user_organization.organization_id')
    .where('user_organization.user_id', userId)
    .select('organizations.*', 'user_organization.role')
}
```

---

### Task 6: Update Search Endpoint Authorization

**Search** - Critical data leak vulnerability

```typescript
// Before: Can search ANY organization
fastify.get('/search', {
  handler: controller.search
})

// After: Require org membership
fastify.get('/search', {
  preHandler: [requireAuth, requireOrgMember],
  handler: controller.search
})
```

---

## Testing Strategy

### Unit Tests

**New File:** `/api/src/__test__/authorization.service.test.ts`

Test cases:
- ✅ `isOrgMember()` returns true for members
- ✅ `isOrgMember()` returns false for non-members
- ✅ `getUserOrgRole()` returns correct role
- ✅ `isOrgAdmin()` returns true for admins
- ✅ `isOrgAdmin()` returns false for members
- ✅ `canAccessBoard()` allows org members
- ✅ `canAccessBoard()` blocks non-members
- ✅ `getCardBoard()` traverses card → list → board

**Target Coverage:** 95%+

---

**New File:** `/api/src/__test__/authorization.middleware.test.ts`

Test cases:
- ✅ `requireOrgMember` allows members
- ✅ `requireOrgMember` blocks non-members (403)
- ✅ `requireOrgAdmin` allows admins
- ✅ `requireOrgAdmin` blocks members (403)
- ✅ `requireBoardAccess` allows org members
- ✅ `requireBoardAccess` blocks non-members (403)
- ✅ `requireCardAccess` checks via board
- ✅ Middleware with missing IDs returns 400

**Target Coverage:** 95%+

---

### Integration Tests

**New File:** `/api/src/__test__/authorization.integration.test.ts`

Test scenarios:
- ✅ User can access their own organization
- ✅ User cannot access other organizations (403)
- ✅ User can create board in their org
- ✅ User cannot create board in other org (403)
- ✅ Admin can delete organization
- ✅ Member cannot delete organization (403)
- ✅ User can access board in their org
- ✅ User cannot access board in other org (403)
- ✅ User can create card in board they have access to
- ✅ User cannot create card in board they don't have access to (403)
- ✅ Bulk operations respect authorization
- ✅ Search is scoped to user's organization

**Target Coverage:** All critical paths

---

## API Changes

### Breaking Changes
- **Before:** `GET /organizations/all` returned ALL organizations
- **After:** Returns only organizations user is member of

### New Error Responses

**403 Forbidden - Not Org Member**
```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "You are not a member of this organization"
}
```

**403 Forbidden - Admin Required**
```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "Admin access required for this operation"
}
```

**403 Forbidden - No Board Access**
```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "You do not have access to this board"
}
```

---

## Security Improvements

### Before Phase 2
- ❌ Any authenticated user can access ANY organization
- ❌ Any authenticated user can access ANY board
- ❌ Any authenticated user can create/delete ANY resource

### After Phase 2
- ✅ Users can only access organizations they're members of
- ✅ Users can only access boards in their organizations
- ✅ All child resources protected via board access
- ✅ Admin-only operations enforced (delete org, create board)
- ✅ Role-based permissions work

---

## Performance Considerations

### Database Queries Added
- +1 query: Check user_organization membership
- +1 query: Get board's organization (for board access checks)
- +1-2 queries: Traverse card → list → board (for card access)

### Optimization Strategies
1. **Request-level caching:** Cache org membership lookup
2. **Denormalization (future):** Add organization_id to cards table
3. **Batch checks:** For bulk operations, check once instead of per-item

**Expected Overhead:** 10-30ms per request

---

## Acceptance Criteria

- [ ] `user_organization` role field populated in seed data
- [ ] All organization endpoints protected
- [ ] All board endpoints protected
- [ ] All child resource endpoints protected
- [ ] Admin-only operations require ADMIN role
- [ ] Search scoped to user's organizations
- [ ] Bulk operations respect authorization
- [ ] Unit tests: 95%+ coverage
- [ ] Integration tests: All critical paths
- [ ] 403 Forbidden returned (not 404) when access denied
- [ ] Performance overhead < 30ms

---

## Related Files

### New Files
- `src/services/authorization.service.ts`
- `src/middleware/authorization.middleware.ts`
- `src/__test__/authorization.service.test.ts`
- `src/__test__/authorization.middleware.test.ts`
- `src/__test__/authorization.integration.test.ts`

### Modified Files
- `src/db/schemas/user-organization.ts` (Add role field)
- `src/db/seeds/development/021-user-organization.ts` (Populate roles)
- 20+ route files (Add authorization middleware)
- `src/modules/organizations/organization.controller.ts` (Filter by user)
- `src/modules/organizations/organization.service.ts` (getUserOrganizations)

---

## Next Phase (Phase 3)

**Phase 3** will implement fine-grained resource ownership and permissions:
- Comment ownership (only author can edit/delete)
- Attachment ownership (only uploader can delete)
- Template visibility (org-specific vs system templates)
- Custom permissions system (future expansion)

See: `/api/docs/authorization-security-improvement/phase-3.md`
