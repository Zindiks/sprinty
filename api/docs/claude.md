# Claude Workflow Documentation (API)

**Last Updated:** 2025-11-17

This document explains the workflow and conventions for AI assistants (Claude) working on the API (backend) of this project.

---

## Table of Contents
1. [Documentation Workflow](#documentation-workflow)
2. [Phase Management](#phase-management)
3. [Directory Structure](#directory-structure)
4. [Naming Conventions](#naming-conventions)
5. [Document Templates](#document-templates)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

---

## Documentation Workflow

### Overview
When working on API features or tasks, Claude should maintain detailed documentation of planning, implementation, and completion phases.

### Core Principles
1. **Plan First:** Always create a plan before implementation
2. **Document Progress:** Update documents as work progresses
3. **Mark Completion:** Rename documents when phases are complete
4. **Organized Structure:** Keep documentation in feature-specific folders
5. **Test Everything:** Document testing approach and results

---

## Phase Management

### Phase Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│                    Feature Request                       │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  1. CREATE PLAN                                          │
│  api/docs/<feature-name>/phase-1.md                     │
│                                                          │
│  - Break down the feature into phases                   │
│  - Define API endpoints and schemas                     │
│  - Plan database changes (migrations)                   │
│  - List tasks and acceptance criteria                   │
│  - Plan testing strategy                                │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  2. START WORK (Mark as WIP)                            │
│  Rename: phase-1.md → phase-1-wip.md 🚧                │
│                                                          │
│  - Update document with implementation details          │
│  - Document database schema changes                     │
│  - Track API endpoint implementations                   │
│  - Note technical decisions                             │
│  - Document test coverage                               │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  3. COMPLETE PHASE                                       │
│  Rename: phase-1-wip.md → phase-1-done.md              │
│                                                          │
│  - Mark all tasks as complete                           │
│  - Confirm all tests passing                            │
│  - Document final API contract                          │
│  - Note any technical debt                              │
│  - List any follow-up items                            │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  4. NEXT PHASE (if applicable)                          │
│  Create: api/docs/<feature-name>/phase-2.md            │
│                                                          │
│  - Repeat the cycle for the next phase                 │
└─────────────────────────────────────────────────────────┘
```

### Phase Statuses

| Status | Filename Suffix | Emoji | Meaning |
|--------|----------------|-------|---------|
| **Planned** | `phase-N.md` | - | Phase is planned but not started |
| **In Progress** | `phase-N-wip.md` | 🚧 | Phase is actively being worked on |
| **Completed** | `phase-N-done.md` | ✅ | Phase is complete |

---

## Directory Structure

### Feature Documentation Location
```
api/
└── docs/
    ├── features.md           # Feature status reference (global)
    ├── architecture.md       # Architecture documentation (global)
    ├── claude.md            # This file (workflow guide)
    │
    └── <feature-name>/      # Feature-specific folder
        ├── phase-1.md       # Initial plan
        ├── phase-1-wip.md   # Work in progress (🚧)
        ├── phase-1-done.md  # Completed
        ├── phase-2.md       # Next phase plan
        ├── phase-2-wip.md   # WIP
        ├── phase-2-done.md  # Completed
        ├── migration.sql    # Database changes (if applicable)
        └── README.md        # Feature overview (optional)
```

### Example Structure
```
api/docs/
├── features.md
├── architecture.md
├── claude.md
│
├── authorization-middleware/
│   ├── phase-1-done.md      # ✅ Basic auth checks
│   ├── phase-2-wip.md       # 🚧 RBAC implementation
│   └── phase-3.md           # Role-based permissions (planned)
│
├── bulk-card-operations/
│   ├── phase-1-done.md      # ✅ Bulk move endpoint
│   ├── phase-2-done.md      # ✅ Bulk assign/labels
│   └── phase-3-done.md      # ✅ Bulk archive/delete
│
├── reminder-system-fix/
│   ├── phase-1-done.md      # ✅ Register routes
│   └── phase-2-wip.md       # 🚧 Cron job setup
│
└── websocket-authorization/
    └── phase-1.md           # Board access check (planned)
```

---

## Naming Conventions

### Feature Folder Names
- Use lowercase with hyphens
- Be descriptive but concise
- Examples:
  - ✅ `authorization-middleware`
  - ✅ `bulk-card-operations`
  - ✅ `websocket-authorization`
  - ✅ `reminder-system-fix`
  - ❌ `AuthMiddleware` (avoid camelCase)
  - ❌ `feature1` (not descriptive)

### Phase Document Names
- Always use `phase-N.md` format
- Add suffix for status:
  - `phase-1.md` - Planned
  - `phase-1-wip.md` - In Progress (🚧)
  - `phase-1-done.md` - Completed (✅)

### Optional Documents
- `README.md` - Feature overview and summary
- `migration.sql` - Database schema changes
- `api-contract.md` - Endpoint documentation
- `test-plan.md` - Testing strategy

---

## Document Templates

### Phase Plan Template (API)

```markdown
# [Feature Name] - Phase [N]: [Phase Title]

**Status:** Planned | In Progress 🚧 | Completed ✅
**Created:** YYYY-MM-DD
**Started:** YYYY-MM-DD (if WIP)
**Completed:** YYYY-MM-DD (if done)
**Assigned To:** Claude / Developer Name

---

## Overview
Brief description of what this phase aims to accomplish from an API perspective.

---

## Goals
- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

---

## API Changes

### New Endpoints
- `POST /api/v1/resource` - Create resource
- `GET /api/v1/resource/:id` - Get resource
- `PUT /api/v1/resource/:id` - Update resource
- `DELETE /api/v1/resource/:id` - Delete resource

### Modified Endpoints
- `GET /api/v1/existing` - Add new query parameter

### Deprecated Endpoints
- `GET /api/v1/old-endpoint` - Use `/new-endpoint` instead

---

## Database Changes

### New Tables
\`\`\`sql
CREATE TABLE resource (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Modified Tables
\`\`\`sql
ALTER TABLE existing_table
ADD COLUMN new_field VARCHAR(100);
\`\`\`

### Indexes
\`\`\`sql
CREATE INDEX idx_resource_name ON resource(name);
\`\`\`

---

## Request/Response Schemas

### Create Resource Request
\`\`\`typescript
{
  name: string,         // required, 1-255 chars
  description?: string  // optional
}
\`\`\`

### Resource Response
\`\`\`typescript
{
  id: string,           // UUID
  name: string,
  description: string | null,
  created_at: string    // ISO 8601
}
\`\`\`

---

## Implementation Tasks

### 1. Database Layer
- [ ] Create migration file
- [ ] Define schema with indexes
- [ ] Add seed data (if needed)

### 2. Repository Layer
- [ ] Create `resource.repository.ts`
- [ ] Implement CRUD methods
- [ ] Add query optimizations

### 3. Service Layer
- [ ] Create `resource.service.ts`
- [ ] Implement business logic
- [ ] Add validation

### 4. Controller Layer
- [ ] Create `resource.controller.ts`
- [ ] Handle request/response
- [ ] Error handling

### 5. Route Layer
- [ ] Create `resource.route.ts`
- [ ] Define TypeBox schemas
- [ ] Add route handlers

### 6. Integration
- [ ] Register routes in bootstrap.ts
- [ ] Add to Swagger documentation
- [ ] Update API contract docs

---

## Testing Strategy

### Unit Tests
- [ ] Repository tests (database operations)
- [ ] Service tests (business logic)
- [ ] Controller tests (request handling)

### Integration Tests
- [ ] Full API endpoint tests
- [ ] Database transaction tests
- [ ] Error case handling

### Test Coverage Goals
- Repository: 90%+
- Service: 85%+
- Controller: 80%+
- Overall: 85%+

---

## Security Considerations
- [ ] Authorization checks implemented
- [ ] Input validation via TypeBox
- [ ] SQL injection prevention (parameterized queries)
- [ ] Rate limiting (if needed)
- [ ] CORS configuration

---

## Dependencies
- Dependency 1
- Dependency 2

---

## Acceptance Criteria
- [ ] All endpoints functional
- [ ] All tests passing
- [ ] No SQL injection vulnerabilities
- [ ] Swagger docs updated
- [ ] Migration runs successfully
- [ ] No breaking changes (or documented)

---

## Risks & Mitigations
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Breaking change | High | Medium | Versioned API |

---

## Performance Considerations
- Query optimization strategy
- Index requirements
- Caching approach (if applicable)
- Expected load

---

## Related Files
- `src/modules/resource/resource.route.ts`
- `src/modules/resource/resource.controller.ts`
- `src/modules/resource/resource.service.ts`
- `src/modules/resource/resource.repository.ts`
- `src/db/migrations/YYYYMMDD_create_resource.ts`
- `src/__test__/resource.test.ts`

---

## Next Steps
- [ ] Next step 1
- [ ] Next step 2
```

### WIP Update Template (🚧)

When starting work, rename to `phase-N-wip.md` and add:

```markdown
## Implementation Progress

### Completed
- ✅ Migration created - `20250117_create_resource.ts`
- ✅ Repository implemented - All CRUD operations
- ✅ Service layer created - Business logic complete
- ✅ Controller created - Request handling done

### In Progress
- 🚧 Writing unit tests
  - Repository tests: 15/20 done
  - Service tests: 10/15 done
  - Challenge: Mocking database transactions

### Blocked
- ⛔ Integration tests - Waiting on test database setup

---

## Database Migration

\`\`\`sql
-- Migration: 20250117_create_resource.ts
CREATE TABLE resource (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_resource_name ON resource(name);
\`\`\`

**Migration Status:** ✅ Applied successfully

---

## API Endpoints Implemented

### POST /api/v1/resource
**Status:** ✅ Implemented
\`\`\`typescript
// Request
{
  "name": "Example Resource",
  "description": "Optional description"
}

// Response (201 Created)
{
  "id": "uuid-here",
  "name": "Example Resource",
  "description": "Optional description",
  "created_at": "2025-01-17T10:00:00Z",
  "updated_at": "2025-01-17T10:00:00Z"
}
\`\`\`

### GET /api/v1/resource/:id
**Status:** ✅ Implemented
\`\`\`typescript
// Response (200 OK)
{
  "id": "uuid-here",
  "name": "Example Resource",
  "description": "Optional description",
  "created_at": "2025-01-17T10:00:00Z",
  "updated_at": "2025-01-17T10:00:00Z"
}

// Error (404 Not Found)
{
  "error": "Resource not found",
  "statusCode": 404
}
\`\`\`

---

## Technical Decisions

### Decision 1: Repository Pattern
**Context:** Need clean separation between business logic and data access
**Decision:** Use repository pattern with Knex query builder
**Rationale:**
- Easier to test (can mock repository)
- Clean separation of concerns
- Can swap database later if needed

### Decision 2: TypeBox Validation
**Context:** Need request validation
**Decision:** Use TypeBox for schema validation
**Rationale:**
- Type-safe validation
- Auto-generates Swagger docs
- Better than manual validation

---

## Challenges & Solutions

### Challenge 1: Transaction Handling
**Problem:** Complex operation requires multiple database writes
**Solution:** Used Knex transaction API
\`\`\`typescript
await db.transaction(async (trx) => {
  const resource = await trx('resource').insert(data).returning('*')
  await trx('related').insert({ resource_id: resource.id })
})
\`\`\`
**Result:** Atomic operations, automatic rollback on error

---

## Test Results

### Unit Tests
- ✅ Repository: 15/20 tests passing (75%)
- 🚧 Service: 10/15 tests passing (66%)
- ⏳ Controller: 0/12 tests (not started)

### Coverage
\`\`\`
File                  | % Stmts | % Branch | % Funcs | % Lines
----------------------|---------|----------|---------|--------
resource.repository   |   85.71 |    75.00 |   80.00 |   85.71
resource.service      |   66.67 |    50.00 |   60.00 |   66.67
resource.controller   |    0.00 |     0.00 |    0.00 |    0.00
----------------------|---------|----------|---------|--------
\`\`\`

---

## Code Changes
- Created: `src/modules/resource/` (5 files)
- Created: `src/db/migrations/20250117_create_resource.ts`
- Created: `src/__test__/resource.test.ts`
- Modified: `src/bootstrap.ts` (registered routes)
- Modified: `src/swagger.ts` (added tag)
```

### Completion Template (✅)

When done, rename to `phase-N-done.md` and add:

```markdown
## ✅ Completion Summary

**Completed Date:** 2025-01-17
**Duration:** 3 days
**Status:** Successfully completed

### All Tasks Completed
- ✅ Migration created and applied
- ✅ Repository layer implemented (4 methods)
- ✅ Service layer implemented (business logic)
- ✅ Controller layer implemented (request handling)
- ✅ Routes registered and tested
- ✅ Unit tests written (85% coverage)
- ✅ Integration tests added
- ✅ Swagger documentation updated

### Deliverables
- **Database:** 1 new table, 1 index
- **Code:** 5 new files, 2 modified files
- **Lines of Code:** 450 lines (including tests)
- **Tests:** 35 unit tests, 8 integration tests
- **Documentation:** API contract documented in Swagger

### API Endpoints Delivered

| Endpoint | Method | Status | Tests |
|----------|--------|--------|-------|
| `/api/v1/resource` | POST | ✅ | 🧪 8 tests |
| `/api/v1/resource/:id` | GET | ✅ | 🧪 6 tests |
| `/api/v1/resource/:id` | PUT | ✅ | 🧪 7 tests |
| `/api/v1/resource/:id` | DELETE | ✅ | 🧪 5 tests |

### Test Coverage Final
\`\`\`
File                  | % Stmts | % Branch | % Funcs | % Lines
----------------------|---------|----------|---------|--------
resource.repository   |   92.86 |    87.50 |   90.00 |   92.86
resource.service      |   88.89 |    75.00 |   85.00 |   88.89
resource.controller   |   85.71 |    80.00 |   83.33 |   85.71
----------------------|---------|----------|---------|--------
All files             |   89.15 |    80.83 |   86.11 |   89.15
\`\`\`

### Performance Metrics
- Average response time: 45ms
- P95 response time: 120ms
- Queries optimized with indexes
- No N+1 query issues

---

## Migration Record

\`\`\`bash
# Migration applied successfully
✔ Migrated: 20250117_create_resource.ts

# No rollback needed
\`\`\`

---

## Follow-up Items
- [ ] Add caching layer (deferred to Phase 2)
- [ ] Implement soft deletes (tracked in backlog)
- [ ] Add audit logging (separate ticket)

---

## Lessons Learned
- TypeBox validation caught edge cases early
- Transaction handling pattern worked well
- Integration tests found 2 bugs unit tests missed
- Swagger auto-generation saved time

---

## Production Readiness Checklist
- ✅ All tests passing
- ✅ Error handling comprehensive
- ✅ Input validation implemented
- ✅ SQL injection prevention (parameterized queries)
- ✅ No authorization bypass
- ✅ Rate limiting not needed (low-traffic endpoint)
- ✅ Logging added
- ✅ Metrics tracked
- ✅ Documentation complete

---

## Next Phase
Phase 2 will add caching and soft delete functionality.
See: `api/docs/<feature>/phase-2.md`
```

---

## Best Practices

### 1. Always Create Migrations First
Before implementing any feature that requires database changes:
1. Create migration file
2. Run migration locally
3. Verify schema in database
4. Then implement code

```bash
# Create migration
npm run migrate:make feature_name

# Run migration
npm run migrate:latest

# Rollback if needed
npm run migrate:rollback
```

### 2. Follow Layered Architecture
Always implement in this order:
1. Database (migration)
2. Repository (data access)
3. Service (business logic)
4. Controller (request handling)
5. Routes (HTTP layer)
6. Tests (at each layer)

### 3. Write Tests Alongside Code
Don't wait until the end:
- Write repository tests after implementing repository
- Write service tests after implementing service
- Write integration tests after routes work

### 4. Document API Contracts
For every endpoint, document:
- Request schema (with examples)
- Response schema (with examples)
- Error responses
- Authentication requirements
- Authorization requirements

### 5. Use TypeBox for Validation
```typescript
// Define schema once
export const CreateResourceSchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.Optional(Type.String())
})

// Gets you:
// 1. Runtime validation
// 2. TypeScript types
// 3. Swagger documentation
// 4. Error messages
```

### 6. Transaction Best Practices
```typescript
// ✅ Good - explicit transaction
async function complexOperation() {
  return await db.transaction(async (trx) => {
    const resource = await trx('resource').insert(data).returning('*')
    await trx('related').insert({ resource_id: resource.id })
    return resource
  })
}

// ❌ Bad - no transaction, partial failure possible
async function complexOperation() {
  const resource = await db('resource').insert(data).returning('*')
  await db('related').insert({ resource_id: resource.id }) // Could fail!
  return resource
}
```

### 7. Error Handling Pattern
```typescript
// Service layer
async getResource(id: string) {
  const resource = await repository.findById(id)

  if (!resource) {
    throw new NotFoundError(`Resource ${id} not found`)
  }

  return resource
}

// Controller layer
async getResource(request, reply) {
  try {
    const resource = await service.getResource(request.params.id)
    return reply.send(resource)
  } catch (error) {
    if (error instanceof NotFoundError) {
      return reply.code(404).send({ error: error.message })
    }
    throw error // Let global error handler deal with it
  }
}
```

### 8. WebSocket Integration
When implementing features with real-time updates:
```typescript
// In controller after database operation
async createCard(request, reply) {
  const card = await cardService.createCard(request.body)

  // Broadcast to all users in board
  const wsService = getWebSocketService()
  wsService.emitCardCreated(card.list_id, card)

  return reply.code(201).send(card)
}
```

---

## Examples

### Example 1: Simple Feature (Single Phase)

**Feature:** Add export endpoint for board CSV

```
api/docs/board-csv-export/
└── phase-1-done.md
```

**phase-1-done.md:**
```markdown
# Board CSV Export - Phase 1: Implementation

**Status:** Completed ✅
**Created:** 2025-01-15
**Completed:** 2025-01-15

## Overview
Add endpoint to export board data to CSV format.

## API Endpoint
`GET /api/v1/boards/:boardId/export/csv`

## Implementation
- Added `exportBoardCSV` method to board service
- Created CSV generation utility
- Added route with authentication check
- Response returns CSV file with proper headers

## Tests
- ✅ Unit tests for CSV generation (5 tests)
- ✅ Integration test for endpoint (3 tests)
- Coverage: 92%

## Files Created
- `src/modules/boards/board.export.ts` (CSV generation)
- `src/__test__/board-export.test.ts`

## Files Modified
- `src/modules/boards/board.route.ts` (added route)
- `src/modules/boards/board.service.ts` (added method)

## Result
Users can now export board data with one API call.
```

### Example 2: Complex Feature (Multiple Phases)

**Feature:** Authorization middleware system

```
api/docs/authorization-middleware/
├── phase-1-done.md      # Basic auth checks
├── phase-2-wip.md       # RBAC implementation (🚧)
└── phase-3.md           # Resource-level permissions (planned)
```

**phase-1-done.md:**
```markdown
# Authorization Middleware - Phase 1: Basic Auth Checks

**Status:** Completed ✅
**Created:** 2025-01-10
**Completed:** 2025-01-14

## Overview
Implement foundational authorization middleware to check if users are authenticated and have access to resources.

## Middleware Implemented

### 1. requireAuth
Checks if user is authenticated.
\`\`\`typescript
export const requireAuth = async (request, reply) => {
  if (!request.user) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }
}
\`\`\`

### 2. requireOrgMember
Checks if user is member of organization.
\`\`\`typescript
export const requireOrgMember = async (request, reply) => {
  const { organization_id } = request.params
  const userId = request.user.id

  const isMember = await authService.isOrgMember(userId, organization_id)
  if (!isMember) {
    return reply.code(403).send({ error: 'Not a member' })
  }
}
\`\`\`

### 3. requireBoardAccess
Checks if user has access to board.
\`\`\`typescript
export const requireBoardAccess = async (request, reply) => {
  const { board_id } = request.params
  const userId = request.user.id

  const hasAccess = await authService.canAccessBoard(userId, board_id)
  if (!hasAccess) {
    return reply.code(403).send({ error: 'No access' })
  }
}
\`\`\`

## Implementation Details

### Auth Service
Created `auth.service.ts` with methods:
- `isOrgMember(userId, orgId)` - Check membership
- `canAccessBoard(userId, boardId)` - Check board access via org membership
- `getUserRole(userId, orgId)` - Get user's role in org

### Database Queries
\`\`\`typescript
async isOrgMember(userId: string, orgId: string) {
  const membership = await db('user_organization')
    .where({ user_id: userId, organization_id: orgId })
    .first()

  return !!membership
}

async canAccessBoard(userId: string, boardId: string) {
  const board = await db('boards')
    .where({ id: boardId })
    .first()

  if (!board) return false

  return await this.isOrgMember(userId, board.organization_id)
}
\`\`\`

## Routes Protected
Added middleware to:
- All board endpoints (requireBoardAccess)
- All organization endpoints (requireOrgMember)
- All card endpoints (requireBoardAccess via list → board)

## Example Usage
\`\`\`typescript
// board.route.ts
fastify.get('/boards/:board_id', {
  preHandler: [requireAuth, requireBoardAccess],
  handler: boardController.getBoard
})
\`\`\`

## Tests
- ✅ Auth service tests (18 tests)
- ✅ Middleware tests (15 tests)
- ✅ Integration tests (12 tests)
- Coverage: 94%

## Files Created
- `src/middleware/auth.middleware.ts` (3 middleware functions)
- `src/services/auth.service.ts` (authorization logic)
- `src/__test__/auth-middleware.test.ts`
- `src/__test__/auth-service.test.ts`

## Files Modified
- 20 route files (added preHandler)

## Security Impact
- ✅ Unauthorized users can't access resources
- ✅ Users can only access boards in their organizations
- ✅ 403 Forbidden vs 404 Not Found properly used

## Performance
- Average overhead: ~5ms per request
- Database queries cached at request level
- No N+1 query issues

## Next Phase
Phase 2 will implement role-based access control (RBAC) to differentiate between admin and member permissions.
See: `api/docs/authorization-middleware/phase-2.md`
```

**phase-2-wip.md:**
```markdown
# Authorization Middleware - Phase 2: RBAC Implementation 🚧

**Status:** In Progress 🚧
**Created:** 2025-01-15
**Started:** 2025-01-16

## Overview
Implement role-based access control to enforce admin vs member permissions.

## Goals
- [ ] Create `requireOrgAdmin` middleware
- [ ] Protect admin-only endpoints
- [x] Add role checks to auth service
- [x] Add tests for role enforcement

## Implementation Progress

### Completed
- ✅ Extended auth service with role checks
- ✅ Created `getUserRole()` method
- ✅ Added database indexes on role column

### In Progress
- 🚧 Implementing `requireOrgAdmin` middleware
  - Basic implementation done
  - Testing edge cases
  - Challenge: Handling board-level admin checks

### Blocked
- None currently

## Middleware Implementation

\`\`\`typescript
// src/middleware/auth.middleware.ts
export const requireOrgAdmin = async (request, reply) => {
  const { organization_id } = request.params
  const userId = request.user.id

  const role = await authService.getUserRole(userId, organization_id)

  if (role !== 'admin') {
    return reply.code(403).send({
      error: 'Admin access required',
      message: 'Only organization administrators can perform this action'
    })
  }
}
\`\`\`

## Endpoints to Protect (Admin Only)
- [x] `POST /api/v1/organizations` - Create org
- [x] `PUT /api/v1/organizations/:id` - Update org
- [x] `DELETE /api/v1/organizations/:id` - Delete org
- [ ] `POST /api/v1/boards` - Create board (needs admin)
- [ ] `DELETE /api/v1/boards/:id` - Delete board (needs admin)
- [ ] `POST /api/v1/templates` - Create custom template (admin)
- [ ] `DELETE /api/v1/templates/:id` - Delete template (admin)

## Testing
- ✅ Role check tests: 8/8 passing
- 🚧 Middleware tests: 5/12 passing
- ⏳ Integration tests: not started

## Next Steps
1. Finish implementing board admin checks
2. Add remaining middleware tests
3. Write integration tests
4. Update documentation
```

### Example 3: Bug Fix

**Feature:** Fix reminder routes not registered

```
api/docs/reminder-system-fix/
├── phase-1-done.md      # Register routes
└── phase-2-wip.md       # Fix cron job
```

**phase-1-done.md:**
```markdown
# Reminder System Fix - Phase 1: Register Routes

**Status:** Completed ✅
**Created:** 2025-01-17
**Completed:** 2025-01-17

## Problem
Reminder routes exist but were not registered in `bootstrap.ts`, causing all reminder endpoints to return 404.

## Root Cause
Routes were implemented but registration was missed in bootstrap file:
- `src/modules/reminders/reminder.route.ts` exists
- Never added to `src/bootstrap.ts`

## Solution
Added route registration to bootstrap:

\`\`\`typescript
// src/bootstrap.ts
import reminderRoutes from './modules/reminders/reminder.route'

// ... other registrations ...

// Register reminder routes
await server.register(reminderRoutes, { prefix: '/api/v1' })
\`\`\`

## Testing
Tested all endpoints manually:
- ✅ `POST /api/v1/reminders` - Create reminder (201)
- ✅ `GET /api/v1/reminders/card/:card_id` - Get reminders (200)
- ✅ `GET /api/v1/reminders/user` - Get user reminders (200)
- ✅ `DELETE /api/v1/reminders/:id` - Delete reminder (204)

## Files Modified
- `src/bootstrap.ts` (added 1 line)

## Verification
\`\`\`bash
# Before fix
$ curl http://localhost:4000/api/v1/reminders
{"statusCode":404,"error":"Not Found"}

# After fix
$ curl http://localhost:4000/api/v1/reminders
{"statusCode":400,"error":"Missing required parameters"}
# (400 is correct - endpoint requires params)
\`\`\`

## Impact
- ✅ All reminder endpoints now accessible
- ✅ No breaking changes
- ✅ Existing code untouched

## Follow-up
Phase 2 will verify cron job is running and sending reminders.
See: `api/docs/reminder-system-fix/phase-2.md`
```

---

## Workflow Summary

### Quick Reference

**Starting a new API feature:**
1. Create folder: `api/docs/<feature-name>/`
2. Create plan: `api/docs/<feature-name>/phase-1.md`
3. Plan:
   - API endpoints and schemas
   - Database migrations
   - Testing strategy

**Starting work on a phase:**
1. Rename: `phase-1.md` → `phase-1-wip.md` (🚧)
2. Implement in order: DB → Repository → Service → Controller → Routes
3. Write tests alongside code
4. Update document with progress

**Completing a phase:**
1. Verify all tests passing
2. Mark all tasks complete
3. Rename: `phase-1-wip.md` → `phase-1-done.md` (✅)
4. Add completion summary with metrics
5. Create next phase plan if needed

**Small changes/fixes:**
- For minor changes, a single phase is fine
- For bug fixes, create a folder and document the fix
- Update `features.md` if status changes

---

## Integration with Other Documentation

### features.md
- Reference for all API endpoints and their status
- Update when feature status changes
- Link to phase documents for details

### architecture.md
- Reference for tech stack and patterns
- Consult when planning architecture changes
- Update if adding new patterns

### Phase Documents
- Detailed implementation documentation
- Living documents during development
- Historical record after completion

---

## API-Specific Tips

### 1. Database Migrations
Always create migrations for schema changes:
```bash
# Create migration
npm run migrate:make descriptive_name

# Run migration
npm run migrate:latest

# Check status
npm run migrate:status

# Rollback if needed
npm run migrate:rollback
```

### 2. TypeBox Schemas
Define schemas before implementing routes:
```typescript
export const CreateResourceSchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.Optional(Type.String())
})

export type CreateResourceType = Static<typeof CreateResourceSchema>
```

### 3. Testing Layers
Test at every layer:
- **Repository:** Database operations
- **Service:** Business logic
- **Controller:** Request/response handling
- **Integration:** Full HTTP flow

### 4. Swagger Documentation
Schemas auto-generate Swagger docs:
```typescript
fastify.post('/resource', {
  schema: {
    tags: ['Resources'],
    body: CreateResourceSchema,
    response: {
      201: ResourceResponseSchema,
      400: ErrorSchema,
      404: ErrorSchema
    }
  },
  handler: controller.createResource
})
```

### 5. WebSocket Events
Document real-time events:
```markdown
## WebSocket Events

### Server → Client
- `resource:created` - New resource added
- `resource:updated` - Resource changed
- `resource:deleted` - Resource removed

### Client → Server
- `resource:subscribe` - Subscribe to resource updates
```

### 6. Performance Testing
Document performance characteristics:
```markdown
## Performance Metrics
- Average response time: 45ms
- P95 response time: 120ms
- Database queries: 2 (optimized with indexes)
- No N+1 issues
```

---

## Conclusion

This workflow ensures:
- ✅ **Organized Documentation** - Easy to find and understand
- ✅ **Progress Tracking** - Clear status at a glance
- ✅ **Knowledge Preservation** - Decisions and context preserved
- ✅ **Collaboration** - Easy for multiple people/Claudes to work together
- ✅ **Historical Record** - Understand how features evolved
- ✅ **API Contract Documentation** - Clear endpoint specifications
- ✅ **Database Change Tracking** - Migration history preserved
- ✅ **Test Coverage Visibility** - Know what's tested and what's not

By following this workflow, we maintain a clear, organized, and comprehensive record of all API development work.

---

**Remember:** Good API documentation is like a contract with your future self and your frontend team. Be clear, be thorough, and be kind to whoever reads it next! 🤝
