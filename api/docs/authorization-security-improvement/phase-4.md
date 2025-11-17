# Authorization Security Improvement - Phase 4: WebSocket Authorization & Real-time Security

**Status:** Planned
**Created:** 2025-11-17
**Priority:** 🔴 CRITICAL - P0
**Depends On:** Phase 2 (Organization & Board Authorization)
**Estimated Duration:** 2 days

---

## Overview

Phase 4 secures the WebSocket (Socket.io) real-time communication layer by implementing proper authorization checks for board access and replacing the temporary authentication mechanism with JWT tokens.

**Critical Issue:** Currently, ANY authenticated user can join ANY board room and receive real-time updates for boards they don't have access to.

---

## Goals

- [ ] Replace temporary base64 token auth with JWT
- [ ] Implement board access authorization in `board:join` handler
- [ ] Apply authorization to all WebSocket events
- [ ] Remove TODO comment about missing authorization
- [ ] Use existing `createBoardAuthorizationMiddleware` function
- [ ] Add rate limiting per user (not just per connection)
- [ ] Comprehensive testing of WebSocket authorization
- [ ] Test concurrent connections and authorization

---

## Current State

### What Works
- ✅ Authentication middleware validates user identity
- ✅ Rate limiting: 100 events/min per connection
- ✅ User presence tracking

### Critical Vulnerabilities
- ❌ **Line 96-97** in `websocket.server.ts`: `// TODO: Add authorization check here`
- ❌ Any authenticated user can join ANY board room
- ❌ No validation that user has access to board
- ❌ Temporary authentication: base64-encoded JSON token (not secure)
- ❌ `createBoardAuthorizationMiddleware` defined but NEVER USED

**Explicit TODO in Code:**
```typescript
// src/modules/websocket/websocket.server.ts:96-97
// TODO: Add authorization check here
// Verify user has access to the board
```

---

## Attack Scenarios (Before Phase 4)

### Scenario 1: Unauthorized Board Monitoring
```javascript
// Malicious user connects to WebSocket
const socket = io('http://api.sprinty.com', {
  auth: { token: validTokenForUser123 }
})

// Join ANY board room (no authorization check)
socket.emit('board:join', 'victim-board-uuid')

// Now receives ALL real-time updates for that board
socket.on('card:created', (card) => {
  console.log('Stole card data:', card)
})
```

### Scenario 2: Presence Spoofing
```javascript
// Join multiple boards user shouldn't access
socket.emit('board:join', 'board-1')
socket.emit('board:join', 'board-2')
socket.emit('board:join', 'board-3')

// User presence shown on boards they don't belong to
// Causes confusion for legitimate users
```

---

## Implementation Plan

### Task 1: Implement JWT Authentication

**New File:** `/api/src/utils/jwt.util.ts`

```typescript
import jwt from 'jsonwebtoken'

export interface JWTPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

/**
 * Generate JWT token for user
 */
export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET!,
    { expiresIn: '30d' }
  )
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
  } catch (error) {
    return null
  }
}
```

**Install Dependency:**
```bash
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

---

### Task 2: Update OAuth to Generate JWT

**File:** `/api/src/modules/oauth/oauth.controller.ts`

**After successful GitHub OAuth:**
```typescript
async githubCallback(request, reply) {
  // ... existing GitHub OAuth flow ...

  // Find or create user
  const user = await this.oauthService.findOrCreateUser(githubUser)

  // Generate JWT instead of using raw GitHub token
  const jwtToken = generateToken(user.id, user.email)

  // Set JWT in cookie
  reply.setCookie("accessToken", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  })

  return reply.redirect(process.env.CLIENT_URL!)
}
```

**Benefits:**
- ✅ Self-contained tokens (no GitHub API calls to validate)
- ✅ Expiration built-in
- ✅ Can add custom claims (roles, permissions)
- ✅ Faster validation

---

### Task 3: Update WebSocket Authentication Middleware

**File:** `/api/src/modules/websocket/websocket.middleware.ts`

**Replace temporary auth with JWT:**

```typescript
// Before: Lines 11-49 (temporary implementation)
export const authenticationMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const token = socket.handshake.auth.token as string

    if (!token) {
      return next(new Error("Authentication required"))
    }

    // TEMPORARY: Parse base64-encoded JSON token
    const decoded = JSON.parse(Buffer.from(token, "base64").toString())
    // ...
  }
}

// After: Use JWT
export const authenticationMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const token = socket.handshake.auth.token as string

    if (!token) {
      return next(new Error("Authentication required"))
    }

    // Verify JWT token
    const payload = verifyToken(token)

    if (!payload) {
      return next(new Error("Invalid or expired token"))
    }

    // Attach user data to socket
    socket.data.userId = payload.userId
    socket.data.userEmail = payload.email

    next()
  } catch (error) {
    next(new Error("Authentication failed"))
  }
}
```

---

### Task 4: Implement Board Authorization Middleware

**File:** `/api/src/modules/websocket/websocket.middleware.ts`

**Use the existing but unused function:**

```typescript
// Lines 55-81: createBoardAuthorizationMiddleware (already exists!)
export function createBoardAuthorizationMiddleware(
  checkBoardAccess: (userId: string, boardId: string) => Promise<boolean>
) {
  return async (
    [boardId]: [string],
    next: (err?: Error) => void,
    socket: Socket
  ) => {
    try {
      const userId = socket.data.userId

      if (!userId) {
        return next(new Error("User not authenticated"))
      }

      // Check if user has access to the board
      const hasAccess = await checkBoardAccess(userId, boardId)

      if (!hasAccess) {
        return next(new Error("Access denied to this board"))
      }

      next()
    } catch (error) {
      next(new Error("Authorization check failed"))
    }
  }
}
```

---

### Task 5: Apply Board Authorization to board:join Event

**File:** `/api/src/modules/websocket/websocket.server.ts`

**Before (Lines 90-119):**
```typescript
socket.on('board:join', async (boardId: string) => {
  // TODO: Add authorization check here
  // Verify user has access to the board

  const userId = socket.data.userId
  const userEmail = socket.data.userEmail

  if (!userId || !userEmail) {
    socket.emit('error', { message: 'User not authenticated' })
    return
  }

  await this.wsService.joinBoard(socket, boardId, userId, userEmail)
})
```

**After:**
```typescript
// Create board authorization middleware
const boardAuthMiddleware = createBoardAuthorizationMiddleware(
  async (userId: string, boardId: string) => {
    // Use AuthorizationService from Phase 2
    return await authorizationService.canAccessBoard(userId, boardId)
  }
)

// Apply middleware to board:join event
socket.use((event, next) => {
  if (event[0] === 'board:join') {
    const boardId = event[1]
    boardAuthMiddleware([boardId], next, socket)
  } else {
    next()
  }
})

socket.on('board:join', async (boardId: string) => {
  // Authorization already checked by middleware
  const userId = socket.data.userId!
  const userEmail = socket.data.userEmail!

  await this.wsService.joinBoard(socket, boardId, userId, userEmail)

  socket.emit('board:joined', {
    boardId,
    message: 'Successfully joined board'
  })
})
```

---

### Task 6: Add Authorization to Other WebSocket Events

**Currently:** No other events require authorization (server → client broadcasts)

**Future Events to Protect (if client can send):**
- `card:update` - Check card access before broadcasting
- `list:move` - Check board access before broadcasting
- Any future client-initiated events

---

### Task 7: Enhanced Rate Limiting

**Current:** 100 events/min per connection

**Enhancement:** Rate limit per user across all connections

**File:** `/api/src/modules/websocket/websocket.middleware.ts`

```typescript
// User-based rate limiting
const userRateLimits = new Map<string, { count: number; resetAt: number }>()

export const userRateLimitMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  const userId = socket.data.userId
  const now = Date.now()

  if (!userId) {
    return next()
  }

  let userLimit = userRateLimits.get(userId)

  // Reset if window expired
  if (!userLimit || now > userLimit.resetAt) {
    userLimit = { count: 0, resetAt: now + 60000 } // 1 minute window
    userRateLimits.set(userId, userLimit)
  }

  // Check limit
  if (userLimit.count >= 200) { // 200 events/min per user
    return next(new Error('Rate limit exceeded'))
  }

  userLimit.count++
  next()
}
```

---

### Task 8: Security Logging

**Log authorization failures:**

```typescript
socket.on('board:join', async (boardId: string) => {
  try {
    // Authorization check
    const hasAccess = await authorizationService.canAccessBoard(userId, boardId)

    if (!hasAccess) {
      // Log security event
      logger.warn('WebSocket: Unauthorized board access attempt', {
        userId,
        boardId,
        ip: socket.handshake.address,
        timestamp: new Date().toISOString()
      })

      socket.emit('error', {
        code: 'FORBIDDEN',
        message: 'You do not have access to this board'
      })
      return
    }

    await this.wsService.joinBoard(socket, boardId, userId, userEmail)
  } catch (error) {
    logger.error('WebSocket: board:join error', { error, userId, boardId })
    socket.emit('error', { message: 'Failed to join board' })
  }
})
```

---

## Testing Strategy

### Unit Tests

**File:** `/api/src/__test__/websocket-auth.test.ts`

Test cases:
- ✅ JWT generation creates valid tokens
- ✅ JWT verification accepts valid tokens
- ✅ JWT verification rejects invalid tokens
- ✅ JWT verification rejects expired tokens
- ✅ `authenticationMiddleware` allows valid JWT
- ✅ `authenticationMiddleware` blocks invalid JWT
- ✅ `createBoardAuthorizationMiddleware` allows authorized users
- ✅ `createBoardAuthorizationMiddleware` blocks unauthorized users

**Target Coverage:** 95%+

---

### Integration Tests

**File:** `/api/src/__test__/websocket.integration.test.ts`

Test scenarios:
- ✅ User can connect with valid JWT
- ✅ User cannot connect with invalid JWT
- ✅ User can join board they have access to
- ✅ User cannot join board they don't have access to (error event)
- ✅ User receives updates only for boards they've joined
- ✅ User is removed from presence when they leave
- ✅ Rate limiting prevents event spam
- ✅ Multiple connections from same user work correctly

**Testing Library:** `socket.io-client` for client simulation

**Example Test:**
```typescript
import { io, Socket } from 'socket.io-client'

describe('WebSocket Authorization', () => {
  let socket: Socket
  let validJWT: string

  beforeEach(() => {
    validJWT = generateToken('user-123', 'user@example.com')
  })

  it('should allow joining board user has access to', (done) => {
    socket = io('http://localhost:4000', {
      auth: { token: validJWT }
    })

    socket.on('connect', () => {
      socket.emit('board:join', 'board-user-has-access-to')
    })

    socket.on('board:joined', (data) => {
      expect(data.boardId).toBe('board-user-has-access-to')
      done()
    })

    socket.on('error', (error) => {
      done(new Error(`Should not receive error: ${error.message}`))
    })
  })

  it('should block joining board user lacks access to', (done) => {
    socket = io('http://localhost:4000', {
      auth: { token: validJWT }
    })

    socket.on('connect', () => {
      socket.emit('board:join', 'board-user-lacks-access-to')
    })

    socket.on('error', (error) => {
      expect(error.code).toBe('FORBIDDEN')
      done()
    })

    socket.on('board:joined', () => {
      done(new Error('Should not successfully join unauthorized board'))
    })
  })
})
```

---

## Client Changes Required

### Update WebSocket Connection

**Before:**
```typescript
const socket = io(API_URL, {
  auth: {
    token: btoa(JSON.stringify({ userId, userEmail })) // Temporary
  }
})
```

**After:**
```typescript
const socket = io(API_URL, {
  auth: {
    token: jwtToken // Get from OAuth callback
  }
})
```

**Store JWT:**
```typescript
// After OAuth callback
const jwtToken = getCookie('accessToken')
localStorage.setItem('jwt', jwtToken)

// Use in WebSocket connection
const token = localStorage.getItem('jwt')
const socket = io(API_URL, { auth: { token } })
```

---

## API/Protocol Changes

### New WebSocket Events

**board:joined** (Success confirmation)
```typescript
{
  boardId: string
  message: 'Successfully joined board'
}
```

**error** (Authorization failure)
```typescript
{
  code: 'FORBIDDEN' | 'UNAUTHORIZED' | 'RATE_LIMIT'
  message: string
}
```

---

## Environment Variables

**Add to `.env`:**
```bash
# JWT Secret (generate strong random string)
JWT_SECRET=your-256-bit-secret-here

# JWT Expiration
JWT_EXPIRES_IN=30d
```

**Generate Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Security Improvements

### Before Phase 4
- ❌ Temporary base64 JSON tokens (not secure)
- ❌ No board access authorization on WebSocket
- ❌ Any user can join any board room
- ❌ TODO comment acknowledging missing authorization

### After Phase 4
- ✅ Secure JWT tokens with expiration
- ✅ Board authorization enforced on `board:join`
- ✅ Users can only join boards they have access to
- ✅ Security logging for unauthorized attempts
- ✅ User-based rate limiting
- ✅ TODO comment removed

---

## Performance Considerations

### JWT vs GitHub API Validation
- **Before:** ~50-100ms per auth (GitHub API call)
- **After:** ~1-2ms per auth (local JWT verification)
- **Improvement:** 50x faster authentication

### Authorization Check Overhead
- +10-20ms per `board:join` (database query)
- Acceptable for connection event (not per message)

---

## Acceptance Criteria

- [ ] JWT authentication implemented for WebSocket
- [ ] Board authorization enforced on `board:join` event
- [ ] TODO comment removed from `websocket.server.ts`
- [ ] Invalid tokens rejected at connection time
- [ ] Unauthorized board access attempts rejected with clear error
- [ ] Security logging for auth failures
- [ ] User-based rate limiting implemented
- [ ] Unit tests: 95%+ coverage
- [ ] Integration tests: All WebSocket scenarios
- [ ] Client updated to use JWT tokens
- [ ] No performance degradation

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Breaking existing WebSocket connections | High | High | Coordinate with frontend, staged rollout |
| JWT secret exposure | Critical | Low | Use environment variables, secure secret management |
| Token expiration issues | Medium | Medium | Implement refresh token flow (Phase 5) |
| Performance impact | Low | Low | JWT verification is very fast |

---

## Rollout Strategy

### Phase 1: Backend Deploy
1. Deploy JWT generation in OAuth (backward compatible)
2. Support both old and new token formats temporarily
3. Monitor logs for token format usage

### Phase 2: Frontend Update
1. Update client to use JWT from cookie
2. Test WebSocket connections
3. Verify authorization errors handled gracefully

### Phase 3: Remove Legacy Support
1. Remove base64 token support
2. Require JWT for all WebSocket connections
3. Monitor error rates

---

## Related Files

### New Files
- `src/utils/jwt.util.ts` (JWT generation/verification)
- `src/__test__/websocket-auth.test.ts` (Unit tests)
- `src/__test__/websocket.integration.test.ts` (Integration tests)

### Modified Files
- `src/modules/oauth/oauth.controller.ts` (Generate JWT)
- `src/modules/websocket/websocket.middleware.ts` (JWT authentication)
- `src/modules/websocket/websocket.server.ts` (Board authorization)
- `src/modules/websocket/websocket.service.ts` (Error handling)
- `package.json` (Add jsonwebtoken dependency)

### New Dependencies
- `jsonwebtoken` - JWT generation and verification
- `@types/jsonwebtoken` - TypeScript types

---

## Success Metrics

### Before Phase 4
- ❌ WebSocket TODO comment exists
- ❌ 0% of board:join events authorized
- ❌ Temporary authentication mechanism

### After Phase 4
- ✅ WebSocket TODO removed
- ✅ 100% of board:join events authorized
- ✅ Secure JWT authentication
- ✅ Authorization failures logged
- ✅ 50x faster authentication

---

## Next Steps (Post-Phase 4)

Optional future enhancements:
- **Phase 5:** Token refresh mechanism for long-lived sessions
- **Phase 6:** Redis adapter for Socket.io (multi-instance support)
- **Phase 7:** Fine-grained WebSocket permissions (who can broadcast what)
- **Phase 8:** WebSocket message payload validation

---

## Notes

- JWT secret MUST be kept secure (environment variable, secrets manager)
- Coordinate with frontend team on token storage and usage
- Monitor JWT expiration rates to tune expiration time
- Consider shorter-lived JWTs with refresh tokens for enhanced security

---

**Estimated Effort:** 12-16 hours of development + testing
**Assignee:** Claude / Development Team
**Priority:** 🔴 CRITICAL - Close major security hole in real-time layer
