# Authorization Security Improvement - Phase 1: Foundation & Authentication Middleware

**Status:** Planned
**Created:** 2025-11-17
**Priority:** 🔴 CRITICAL - P0
**Estimated Duration:** 2-3 days

---

## 🚨 SECURITY CRITICAL - Executive Summary

The Sprinty API currently has **ZERO authorization enforcement**. Any authenticated user can:
- Access, modify, or delete ANY organization
- View, edit, or delete ANY board, card, list
- Download ANY file attachment
- Execute bulk operations on ANY resources
- Join ANY board room via WebSocket and receive real-time updates

This phase establishes the **foundation** for all authorization checks by implementing authentication middleware and populating user context.

---

## Overview

This phase focuses on establishing the authentication foundation that all subsequent authorization checks will depend on:

1. **Fix Plugin Registration** - Register cookie and session plugins
2. **Create Authentication Service** - Validate tokens and load user context
3. **Implement Auth Middleware** - Populate `request.user` on all requests
4. **Apply to All Routes** - Ensure all endpoints have user context
5. **Update Controllers** - Remove TODO comments and use real user data
6. **Comprehensive Testing** - Unit and integration tests

---

## Goals

- [x] ~~Analyze current authentication state~~ (✅ Completed)
- [ ] Register `@fastify/cookie` and `@fastify/session` plugins
- [ ] Create `AuthenticationService` to validate OAuth tokens
- [ ] Implement `requireAuth` middleware
- [ ] Apply middleware to all API routes (global or per-route)
- [ ] Populate `request.user` with user data
- [ ] Update all controllers to use `request.user.id` instead of hardcoded/undefined values
- [ ] Write comprehensive tests (90%+ coverage)

---

## Current State Analysis

### What Works
- ✅ GitHub OAuth flow (`/oauth/github/callback`)
- ✅ Sets `accessToken` cookie with GitHub token
- ✅ HTTP-only, secure cookies in production
- ✅ Logout clears cookie

### Critical Gaps
- ❌ No plugins registered (`@fastify/cookie`, `@fastify/session`)
- ❌ No middleware to verify tokens
- ❌ `request.user` is NEVER populated
- ❌ Controllers have `// @ts-ignore - user is added by auth middleware` but middleware doesn't exist
- ❌ 7+ TODO comments about "get user from auth context"

### Files Affected (Controllers expecting request.user)
1. `/api/src/modules/analytics/analytics.controller.ts` (6 references)
2. `/api/src/modules/dashboard-layouts/dashboard-layouts.controller.ts` (6 references)
3. `/api/src/modules/time-tracking/time-tracking.controller.ts` (3 references)
4. `/api/src/modules/templates/template.controller.ts` (1 reference)
5. `/api/src/modules/reports/report.controller.ts` (1 reference)
6. `/api/src/modules/comments/comment.controller.ts` (3 TODO comments)
7. `/api/src/modules/assignees/assignee.controller.ts` (1 TODO comment)
8. `/api/src/modules/attachments/attachment.controller.ts` (1 TODO comment)

---

## Implementation Plan

### Task 1: Register Core Plugins

**File:** `/api/src/bootstrap.ts`

**Changes:**
```typescript
import cookie from '@fastify/cookie'
import session from '@fastify/session'

// After Fastify initialization, before other plugins
await server.register(cookie, {
  secret: process.env.COOKIE_SECRET || 'change-this-secret-in-production',
  parseOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
})

// Optional: Session management for future use
await server.register(session, {
  secret: process.env.API_SESSION_SECRET,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
})
```

**Dependencies:**
- `@fastify/cookie` v10.0.2 (already installed)
- `@fastify/session` v11.1.0 (already installed)

---

### Task 2: Create Authentication Service

**New File:** `/api/src/services/auth.service.ts`

**Purpose:**
- Validate GitHub OAuth tokens
- Fetch user data from database
- Cache user lookups to reduce database calls

**Methods:**
```typescript
class AuthenticationService {
  /**
   * Validates GitHub access token and returns user
   * @param accessToken - GitHub OAuth access token from cookie
   * @returns User object or null if invalid
   */
  async validateToken(accessToken: string): Promise<User | null>

  /**
   * Gets user by ID from database
   * @param userId - User UUID
   * @returns User object or null
   */
  async getUserById(userId: string): Promise<User | null>

  /**
   * Fetches user profile from GitHub API
   * @param accessToken - GitHub OAuth token
   * @returns GitHub user data
   */
  async fetchGitHubUser(accessToken: string): Promise<GitHubUser>

  /**
   * Finds or creates user in database from GitHub profile
   * @param githubUser - GitHub user data
   * @returns User from database
   */
  async findOrCreateUser(githubUser: GitHubUser): Promise<User>
}
```

**Implementation Notes:**
- Use GitHub API to validate token: `GET https://api.github.com/user`
- Cache user data at request level to avoid repeated DB queries
- Handle token expiration gracefully
- Log authentication failures for security monitoring

---

### Task 3: Create Authentication Middleware

**New File:** `/api/src/middleware/auth.middleware.ts`

**Middleware: `requireAuth`**
```typescript
/**
 * Requires user to be authenticated
 * - Checks for accessToken cookie
 * - Validates token with GitHub
 * - Populates request.user
 * - Returns 401 if not authenticated
 */
export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void>
```

**Flow:**
```
1. Extract accessToken from cookies
2. If missing → 401 Unauthorized
3. Call authService.validateToken(accessToken)
4. If invalid → 401 Unauthorized
5. If valid → Set request.user = userData
6. Continue to handler
```

**Middleware: `optionalAuth`** (for public endpoints that can work with/without auth)
```typescript
/**
 * Optionally authenticates user
 * - Tries to populate request.user
 * - Does NOT return 401 if missing
 * - Use for public endpoints that show different data when authenticated
 */
export async function optionalAuth(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void>
```

---

### Task 4: TypeScript Type Definitions

**New File:** `/api/src/types/fastify.d.ts`

**Extend Fastify types:**
```typescript
import { FastifyRequest } from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string
      email: string
      username: string | null
      created_at: string
      updated_at: string
    }
  }
}
```

This enables TypeScript autocomplete for `request.user` across the codebase.

---

### Task 5: Apply Middleware to Routes

**Strategy:** Global middleware vs. per-route

**Option A: Global Middleware (Recommended for Phase 1)**
```typescript
// bootstrap.ts
server.addHook('onRequest', requireAuth)

// Exempt OAuth endpoints
server.addHook('onRequest', async (request, reply) => {
  const publicPaths = [
    '/oauth/github/callback',
    '/oauth/user',
    '/oauth/logout',
    '/health',
    '/metrics',
    '/docs'
  ]

  if (publicPaths.some(path => request.url.startsWith(path))) {
    return // Skip auth for public paths
  }

  await requireAuth(request, reply)
})
```

**Option B: Per-Route Middleware (More granular, use in Phase 2)**
```typescript
// board.route.ts
fastify.get('/boards/:id', {
  preHandler: [requireAuth],
  handler: boardController.getBoard
})
```

**Decision:** Use **Option A** in Phase 1 for simplicity, refactor to Option B in Phase 2 when adding fine-grained authorization.

---

### Task 6: Update Controllers

**Remove all TODO comments and use request.user.id**

**Example - Analytics Controller**

**Before:**
```typescript
async getPersonalDashboard(request: FastifyRequest, reply: FastifyReply) {
  // @ts-ignore - user is added by auth middleware
  const userId = request.user?.id;

  if (!userId) {
    return reply.code(401).send({ error: "Unauthorized" });
  }
  // ...
}
```

**After:**
```typescript
async getPersonalDashboard(request: FastifyRequest, reply: FastifyReply) {
  // requireAuth middleware ensures request.user exists
  const userId = request.user!.id;

  const dashboard = await this.analyticsService.getPersonalDashboard(userId);
  return reply.send(dashboard);
}
```

**Files to Update:**
- ✅ `/api/src/modules/analytics/analytics.controller.ts` - 6 occurrences
- ✅ `/api/src/modules/dashboard-layouts/dashboard-layouts.controller.ts` - 6 occurrences
- ✅ `/api/src/modules/time-tracking/time-tracking.controller.ts` - 3 occurrences
- ✅ `/api/src/modules/templates/template.controller.ts` - 1 occurrence
- ✅ `/api/src/modules/reports/report.controller.ts` - 1 occurrence
- ✅ `/api/src/modules/comments/comment.controller.ts` - Replace TODO with request.user.id
- ✅ `/api/src/modules/assignees/assignee.controller.ts` - Replace TODO with request.user.id
- ✅ `/api/src/modules/attachments/attachment.controller.ts` - Replace TODO with request.user.id

---

## Testing Strategy

### Unit Tests

**New File:** `/api/src/__test__/auth.service.test.ts`

Test cases:
- ✅ `validateToken()` with valid GitHub token
- ✅ `validateToken()` with invalid token
- ✅ `validateToken()` with expired token
- ✅ `findOrCreateUser()` creates new user
- ✅ `findOrCreateUser()` finds existing user
- ✅ `getUserById()` returns user
- ✅ `getUserById()` returns null for non-existent user

**Target Coverage:** 90%+

---

**New File:** `/api/src/__test__/auth.middleware.test.ts`

Test cases:
- ✅ `requireAuth()` allows valid token
- ✅ `requireAuth()` blocks missing token (401)
- ✅ `requireAuth()` blocks invalid token (401)
- ✅ `requireAuth()` populates request.user
- ✅ `optionalAuth()` populates user if token present
- ✅ `optionalAuth()` continues without user if no token

**Target Coverage:** 95%+

---

### Integration Tests

**New File:** `/api/src/__test__/auth.integration.test.ts`

Test scenarios:
- ✅ Protected endpoint with valid auth returns 200
- ✅ Protected endpoint without auth returns 401
- ✅ Protected endpoint with invalid token returns 401
- ✅ Public endpoint accessible without auth
- ✅ OAuth flow sets cookie correctly
- ✅ Logout clears cookie
- ✅ Multiple requests with same token don't hit GitHub API (caching)

**Target Coverage:** Full happy path + error paths

---

### Manual Testing Checklist

- [ ] OAuth login flow works end-to-end
- [ ] Cookie is set after successful login
- [ ] `request.user` is populated on protected endpoints
- [ ] 401 returned when accessing protected endpoint without cookie
- [ ] 401 returned when accessing with invalid/expired token
- [ ] Logout clears cookie
- [ ] Public endpoints still accessible
- [ ] Controllers using `request.user.id` work correctly
- [ ] No regression in existing functionality

---

## API Changes

### No Breaking Changes
- Existing OAuth endpoints unchanged
- New middleware is transparent to clients
- Responses remain the same (except now enforcing auth)

### Behavior Changes
- **Before:** Most endpoints accessible without authentication
- **After:** Most endpoints require valid `accessToken` cookie
- **Impact:** Clients MUST authenticate via OAuth before accessing resources

### Error Responses

**401 Unauthorized (New)**
```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

**401 Invalid Token (New)**
```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired access token"
}
```

---

## Database Changes

### No Schema Changes Required
- Uses existing `users` table
- No new tables needed
- No migrations required

---

## Security Considerations

### ✅ Improvements
- [x] All endpoints require authentication
- [x] Invalid tokens rejected
- [x] User identity verified on every request
- [x] HTTP-only cookies prevent XSS token theft
- [x] SameSite=strict prevents CSRF

### ⚠️ Still Missing (Addressed in Phase 2+)
- [ ] Authorization (user can access resource)
- [ ] Role-based access control (admin vs member)
- [ ] Resource ownership checks
- [ ] WebSocket authentication improvements

### 🔒 Best Practices Applied
- [x] Token validation on every request
- [x] Graceful error handling
- [x] Security logging (failed auth attempts)
- [x] No sensitive data in error messages
- [x] Request-level caching to avoid performance impact

---

## Performance Considerations

### Potential Impact
- **Per-request overhead:** ~10-20ms (GitHub API call if not cached)
- **Database queries:** +1 query per request (user lookup)
- **Mitigation:**
  - Cache user data at request level
  - Consider Redis caching for high-traffic deployments

### Optimization Strategy
```typescript
// Request-level cache (no external dependency)
const userCache = new Map<string, User>()

// Cache for duration of request
request.user = userCache.get(userId) || await authService.getUserById(userId)
```

**Phase 2 Optimization:** Add Redis caching for user lookups across requests

---

## Dependencies

### Existing Packages (Already Installed)
- ✅ `@fastify/cookie` v10.0.2
- ✅ `@fastify/session` v11.1.0
- ✅ `@fastify/oauth2` v8.1.1

### No New Dependencies Required

---

## Acceptance Criteria

- [ ] All routes (except OAuth, health, docs) require authentication
- [ ] `request.user` is populated with valid user data
- [ ] Invalid/missing tokens return 401 Unauthorized
- [ ] OAuth flow still works end-to-end
- [ ] All TODO comments about auth context removed
- [ ] All controllers using `request.user.id` work correctly
- [ ] Unit tests: 90%+ coverage
- [ ] Integration tests: 100% critical paths covered
- [ ] No performance degradation (< 20ms overhead)
- [ ] TypeScript compilation passes with no errors
- [ ] Documentation updated

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Breaking existing clients | High | High | Ensure OAuth flow works; coordinate with frontend team |
| Performance degradation | Medium | Medium | Implement request-level caching |
| GitHub API rate limits | Medium | Low | Cache user data; implement fallback |
| Token expiration handling | Medium | Medium | Clear error messages; refresh token strategy in Phase 3 |

---

## Related Files

### New Files
- `src/services/auth.service.ts` (Authentication service)
- `src/middleware/auth.middleware.ts` (requireAuth, optionalAuth)
- `src/types/fastify.d.ts` (TypeScript type extensions)
- `src/__test__/auth.service.test.ts` (Unit tests)
- `src/__test__/auth.middleware.test.ts` (Middleware tests)
- `src/__test__/auth.integration.test.ts` (Integration tests)

### Modified Files
- `src/bootstrap.ts` (Plugin registration, global middleware)
- `src/modules/analytics/analytics.controller.ts` (Use request.user)
- `src/modules/dashboard-layouts/dashboard-layouts.controller.ts` (Use request.user)
- `src/modules/time-tracking/time-tracking.controller.ts` (Use request.user)
- `src/modules/templates/template.controller.ts` (Use request.user)
- `src/modules/reports/report.controller.ts` (Use request.user)
- `src/modules/comments/comment.controller.ts` (Use request.user)
- `src/modules/assignees/assignee.controller.ts` (Use request.user)
- `src/modules/attachments/attachment.controller.ts` (Use request.user)

---

## Rollout Strategy

### Development
1. Implement authentication middleware
2. Test locally with OAuth flow
3. Run full test suite
4. Manual testing with Postman/curl

### Staging
1. Deploy to staging environment
2. Frontend team tests integration
3. Load testing to verify performance
4. Security audit of implementation

### Production
1. Deploy during low-traffic window
2. Monitor error rates (401 responses)
3. Check performance metrics
4. Frontend team coordinates client updates

---

## Success Metrics

### Before Phase 1
- ❌ 0% of endpoints have authentication checks
- ❌ `request.user` never populated
- ❌ Anyone can access any resource

### After Phase 1
- ✅ 100% of endpoints (except public) require authentication
- ✅ `request.user` populated on all requests
- ✅ Invalid tokens rejected (401 Unauthorized)
- ✅ TODO comments removed from controllers
- ✅ 90%+ test coverage for auth code

### Metrics to Monitor
- 401 error rate (expect spike initially, then stabilize)
- Average request latency (should stay < +20ms)
- OAuth success rate (should remain 95%+)
- GitHub API rate limit usage

---

## Next Steps (Phase 2 Preview)

Phase 1 establishes **authentication** (who you are).

**Phase 2** will implement **authorization** (what you can access):
- Organization membership checks
- Board access authorization
- Role-based permissions (admin vs member)
- Resource ownership validation

See: `/api/docs/authorization-security-improvement/phase-2.md` (to be created)

---

## Notes

- Phase 1 is **blocking** for all other authorization work
- Must coordinate with frontend team on OAuth flow
- Consider implementing token refresh mechanism in Phase 3
- WebSocket authentication will be addressed separately in Phase 4

---

**Estimated Effort:** 16-24 hours of development + testing
**Assignee:** Claude / Development Team
**Priority:** 🔴 CRITICAL - Must complete before adding authorization checks
