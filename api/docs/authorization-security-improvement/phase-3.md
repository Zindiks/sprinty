# Authorization Security Improvement - Phase 3: Resource Ownership & Fine-Grained Permissions

**Status:** Planned
**Created:** 2025-11-17
**Priority:** 🟡 HIGH - P1
**Depends On:** Phase 2 (Organization & Board Authorization)
**Estimated Duration:** 2 days

---

## Overview

Phase 3 implements **resource ownership** controls - ensuring users can only modify/delete resources they created, while still allowing read access to anyone with board access.

**Key Principle:** Read access via board membership, Write/Delete access via ownership.

---

## Goals

- [ ] Implement comment ownership enforcement (author-only edit/delete)
- [ ] Implement attachment ownership enforcement (uploader-only delete)
- [ ] Implement activity log protection (read-only for non-authors)
- [ ] Add template visibility controls (org-specific vs system templates)
- [ ] Create `requireResourceOwner` middleware
- [ ] Update controllers to check ownership before modifications
- [ ] Comprehensive testing (90%+ coverage)

---

## Current State (After Phase 2)

### What Works
- ✅ Users can only access boards in their organizations
- ✅ Board-level authorization enforced

### Remaining Gaps
- ❌ Any board member can edit ANY comment (should be author-only)
- ❌ Any board member can delete ANY attachment (should be uploader-only)
- ❌ Templates don't respect organization visibility
- ❌ No audit trail for authorization failures

---

## Ownership Rules by Resource

| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| **Comment** | Board access | Board access | **Author only** | **Author only** |
| **Attachment** | Board access | Board access | **Uploader only** (rename) | **Uploader only** |
| **Time Log** | Board access | Board access | **Logger only** | **Logger only** |
| **Checklist Item** | Board access | Board access | Anyone with board access | Anyone with board access |
| **Template** | Org admin | Org members OR public | **Creator only** | **Creator only** |
| **Dashboard Layout** | User | **User only** | **User only** | **User only** |

---

## Implementation Plan

### Task 1: Create Ownership Service

**New File:** `/api/src/services/ownership.service.ts`

```typescript
class OwnershipService {
  /**
   * Check if user owns a comment
   */
  async ownsComment(userId: string, commentId: string): Promise<boolean>

  /**
   * Check if user owns an attachment
   */
  async ownsAttachment(userId: string, attachmentId: string): Promise<boolean>

  /**
   * Check if user owns a time log
   */
  async ownsTimeLog(userId: string, timeLogId: string): Promise<boolean>

  /**
   * Check if user owns a template
   */
  async ownsTemplate(userId: string, templateId: string): Promise<boolean>

  /**
   * Check if user owns a dashboard layout
   */
  async ownsDashboardLayout(userId: string, layoutId: string): Promise<boolean>

  /**
   * Get resource owner ID
   */
  async getResourceOwner(
    resourceType: 'comment' | 'attachment' | 'timeLog' | 'template' | 'layout',
    resourceId: string
  ): Promise<string | null>
}
```

**Implementation:**
```typescript
async ownsComment(userId: string, commentId: string): Promise<boolean> {
  const comment = await db('comments')
    .where({ id: commentId })
    .first()

  return comment?.user_id === userId
}

async ownsAttachment(userId: string, attachmentId: string): Promise<boolean> {
  const attachment = await db('attachments')
    .where({ id: attachmentId })
    .first()

  return attachment?.user_id === userId
}
```

---

### Task 2: Create Ownership Middleware

**File:** `/api/src/middleware/ownership.middleware.ts`

```typescript
/**
 * Requires user to own the comment
 * For update/delete operations
 */
export async function requireCommentOwner(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user!.id
  const commentId = request.params.id || request.params.comment_id

  if (!commentId) {
    return reply.code(400).send({ error: 'comment_id required' })
  }

  const isOwner = await ownershipService.ownsComment(userId, commentId)

  if (!isOwner) {
    return reply.code(403).send({
      error: 'Forbidden',
      message: 'Only the comment author can perform this action'
    })
  }
}

/**
 * Requires user to own the attachment
 * For update/delete operations
 */
export async function requireAttachmentOwner(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user!.id
  const attachmentId = request.params.id

  if (!attachmentId) {
    return reply.code(400).send({ error: 'attachment_id required' })
  }

  const isOwner = await ownershipService.ownsAttachment(userId, attachmentId)

  if (!isOwner) {
    return reply.code(403).send({
      error: 'Forbidden',
      message: 'Only the uploader can delete this attachment'
    })
  }
}

/**
 * Generic ownership check
 * Pass resource type and ID extractor
 */
export function requireOwnership(
  resourceType: 'comment' | 'attachment' | 'timeLog' | 'template' | 'layout',
  getResourceId: (req: FastifyRequest) => string | undefined
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user!.id
    const resourceId = getResourceId(request)

    if (!resourceId) {
      return reply.code(400).send({ error: `${resourceType}_id required` })
    }

    const checkMethod = `owns${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`
    const isOwner = await ownershipService[checkMethod](userId, resourceId)

    if (!isOwner) {
      return reply.code(403).send({
        error: 'Forbidden',
        message: `Only the owner can perform this action on this ${resourceType}`
      })
    }
  }
}
```

---

### Task 3: Apply Ownership Middleware

**Comments** - `/api/src/modules/comments/comment.route.ts`

```typescript
// Read: Anyone with card access
fastify.get('/comments/card/:card_id', {
  preHandler: [requireAuth, requireCardAccess],
  handler: controller.getAllComments
})

// Create: Anyone with card access
fastify.post('/comments', {
  preHandler: [requireAuth, requireCardAccess],
  handler: controller.createComment
})

// Update: AUTHOR ONLY
fastify.patch('/comments', {
  preHandler: [requireAuth, requireCardAccess, requireCommentOwner],
  handler: controller.updateComment
})

// Delete: AUTHOR ONLY
fastify.delete('/comments/:id/card/:card_id', {
  preHandler: [requireAuth, requireCardAccess, requireCommentOwner],
  handler: controller.deleteComment
})
```

**Attachments** - `/api/src/modules/attachments/attachment.route.ts`

```typescript
// Upload: Anyone with card access
fastify.post('/attachments/card/:card_id', {
  preHandler: [requireAuth, requireCardAccess],
  handler: controller.uploadAttachment
})

// Download: Anyone with card access
fastify.get('/attachments/:id/card/:card_id/download', {
  preHandler: [requireAuth, requireCardAccess],
  handler: controller.downloadAttachment
})

// Rename: UPLOADER ONLY
fastify.patch('/attachments', {
  preHandler: [requireAuth, requireCardAccess, requireAttachmentOwner],
  handler: controller.updateAttachment
})

// Delete: UPLOADER ONLY
fastify.delete('/attachments/:id/card/:card_id', {
  preHandler: [requireAuth, requireCardAccess, requireAttachmentOwner],
  handler: controller.deleteAttachment
})
```

**Time Tracking** - `/api/src/modules/time-tracking/time-tracking.route.ts`

```typescript
// Update: LOGGER ONLY
fastify.patch('/time-tracking/:id', {
  preHandler: [
    requireAuth,
    requireOwnership('timeLog', req => req.params.id)
  ],
  handler: controller.updateTimeLog
})

// Delete: LOGGER ONLY
fastify.delete('/time-tracking/:id', {
  preHandler: [
    requireAuth,
    requireOwnership('timeLog', req => req.params.id)
  ],
  handler: controller.deleteTimeLog
})
```

---

### Task 4: Template Visibility Controls

**Update Template Schema** - Add visibility field

**Migration:** `/api/src/db/migrations/20251117_add_template_visibility.ts`

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('board_templates', (table) => {
    table.enum('visibility', ['PUBLIC', 'ORGANIZATION', 'PRIVATE'])
      .notNullable()
      .defaultTo('ORGANIZATION')
  })
}
```

**Visibility Rules:**
- `PUBLIC`: System templates, visible to all users
- `ORGANIZATION`: Visible only to org members
- `PRIVATE`: Visible only to creator (future feature)

**Template Service** - Filter by visibility

```typescript
async getTemplates(userId: string, organizationId?: string) {
  let query = db('board_templates')
    .where('is_system', true) // Public system templates
    .orWhere('created_by', userId) // User's own templates

  // Add org templates if org specified
  if (organizationId) {
    query = query.orWhere(builder => {
      builder
        .where('organization_id', organizationId)
        .where('visibility', 'ORGANIZATION')
    })
  }

  return await query.select('*')
}
```

---

### Task 5: Dashboard Layout Ownership

**Already Private by Design** - Dashboard layouts have user_id

Ensure queries filter by user:

```typescript
// dashboard-layout.service.ts
async getUserLayouts(userId: string) {
  return await db('dashboard_layouts')
    .where({ user_id: userId })
    .select('*')
}

async getLayout(layoutId: string, userId: string) {
  return await db('dashboard_layouts')
    .where({ id: layoutId, user_id: userId }) // Enforce ownership
    .first()
}
```

**Routes already check user via Phase 1** - No additional middleware needed

---

### Task 6: Audit Logging for Authorization Failures

**New File:** `/api/src/services/audit.service.ts`

```typescript
class AuditService {
  /**
   * Log authorization failure
   */
  async logAuthFailure(
    userId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    reason: 'not_authenticated' | 'not_authorized' | 'not_owner'
  ): Promise<void>

  /**
   * Log successful authorization
   */
  async logAuthSuccess(
    userId: string,
    action: string,
    resourceType: string,
    resourceId: string
  ): Promise<void>
}
```

**Integration in Middleware:**
```typescript
// In requireCommentOwner
if (!isOwner) {
  await auditService.logAuthFailure(
    userId,
    'delete_comment',
    'comment',
    commentId,
    'not_owner'
  )

  return reply.code(403).send({
    error: 'Forbidden',
    message: 'Only the comment author can perform this action'
  })
}
```

**Store in Database** - Optional audit_logs table for compliance

---

## Testing Strategy

### Unit Tests

**File:** `/api/src/__test__/ownership.service.test.ts`

Test cases:
- ✅ `ownsComment()` returns true for owner
- ✅ `ownsComment()` returns false for non-owner
- ✅ `ownsAttachment()` checks user_id correctly
- ✅ `ownsTimeLog()` checks user_id correctly
- ✅ `ownsTemplate()` checks created_by correctly

**Target Coverage:** 95%+

---

**File:** `/api/src/__test__/ownership.middleware.test.ts`

Test cases:
- ✅ `requireCommentOwner` allows owner
- ✅ `requireCommentOwner` blocks non-owner (403)
- ✅ `requireAttachmentOwner` allows uploader
- ✅ `requireAttachmentOwner` blocks non-uploader (403)
- ✅ Generic `requireOwnership` works for all resource types

**Target Coverage:** 95%+

---

### Integration Tests

**File:** `/api/src/__test__/ownership.integration.test.ts`

Test scenarios:
- ✅ User can edit their own comment
- ✅ User cannot edit someone else's comment (403)
- ✅ User can delete their own attachment
- ✅ User cannot delete someone else's attachment (403)
- ✅ User can view all comments on cards they have access to
- ✅ Templates filtered by visibility correctly
- ✅ Dashboard layouts are user-specific
- ✅ Audit logs created on authorization failures

**Target Coverage:** All ownership scenarios

---

## API Changes

### New Error Responses

**403 Forbidden - Not Comment Owner**
```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "Only the comment author can perform this action"
}
```

**403 Forbidden - Not Attachment Owner**
```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "Only the uploader can delete this attachment"
}
```

---

## Security Improvements

### Before Phase 3
- ❌ Any board member can edit/delete ANY comment
- ❌ Any board member can delete ANY attachment
- ❌ Templates visible across all organizations

### After Phase 3
- ✅ Only comment author can edit/delete their comments
- ✅ Only uploader can delete their attachments
- ✅ Templates respect visibility rules
- ✅ Dashboard layouts are user-private
- ✅ Audit trail for authorization failures

---

## Performance Considerations

**Ownership Checks:** +1 database query per update/delete operation

**Optimization:** Request-level caching of ownership checks

**Expected Overhead:** 5-10ms per ownership check

---

## Acceptance Criteria

- [ ] Comments: Author-only edit/delete enforced
- [ ] Attachments: Uploader-only delete enforced
- [ ] Time logs: Logger-only edit/delete enforced
- [ ] Templates: Visibility rules enforced
- [ ] Dashboard layouts: User-private
- [ ] Audit logging for auth failures
- [ ] Unit tests: 95%+ coverage
- [ ] Integration tests: All ownership scenarios
- [ ] Performance overhead < 10ms per check

---

## Related Files

### New Files
- `src/services/ownership.service.ts`
- `src/middleware/ownership.middleware.ts`
- `src/services/audit.service.ts` (optional)
- `src/db/migrations/20251117_add_template_visibility.ts`
- `src/__test__/ownership.service.test.ts`
- `src/__test__/ownership.middleware.test.ts`
- `src/__test__/ownership.integration.test.ts`

### Modified Files
- `src/modules/comments/comment.route.ts` (Add ownership middleware)
- `src/modules/attachments/attachment.route.ts` (Add ownership middleware)
- `src/modules/time-tracking/time-tracking.route.ts` (Add ownership middleware)
- `src/modules/templates/template.service.ts` (Visibility filtering)
- `src/modules/dashboard-layouts/dashboard-layout.service.ts` (User filtering)

---

## Next Phase (Phase 4)

**Phase 4** will implement WebSocket authorization:
- Fix WebSocket board:join authorization
- Implement JWT tokens for WebSocket auth
- Add real-time authorization checks
- Prevent unauthorized users from joining board rooms

See: `/api/docs/authorization-security-improvement/phase-4.md`
