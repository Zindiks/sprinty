# Authorization Security Improvement - Complete Plan

**Created:** 2025-11-17
**Status:** 🔴 CRITICAL SECURITY INITIATIVE
**Overall Estimated Duration:** 8-10 days (4 phases)

---

## 🚨 Executive Summary

The Sprinty API currently has **NO AUTHORIZATION ENFORCEMENT**. This is a **CRITICAL SECURITY VULNERABILITY** that allows any authenticated user to:

- ✗ Access, modify, or delete ANY organization
- ✗ View, edit, or delete ANY board, card, list
- ✗ Download ANY file attachment
- ✗ Execute bulk operations on ANY resources
- ✗ Join ANY board room via WebSocket and receive real-time updates
- ✗ Search across ANY organization's data
- ✗ View ANY user's activity and time tracking

**This comprehensive plan addresses all authorization gaps across 4 phases.**

---

## 📊 Vulnerability Assessment

### Current Security State

| Layer | Status | Risk Level |
|-------|--------|-----------|
| **Authentication** | ⚠️ Partial | Medium |
| **Authorization** | ❌ Missing | **CRITICAL** |
| **Organization Access** | ❌ None | **CRITICAL** |
| **Board Access** | ❌ None | **CRITICAL** |
| **Resource Ownership** | ❌ None | High |
| **WebSocket Authorization** | ❌ None | **CRITICAL** |

### Attack Surface

- **150+ unprotected endpoints** allowing cross-organization access
- **WebSocket** has explicit TODO about missing authorization
- **Bulk operations** can mass-delete resources without permission checks
- **File downloads** accessible by anyone
- **Search** allows data exfiltration across organizations
- **Role system** exists but completely unused

### Documentation Evidence

The official documentation explicitly acknowledges these issues:

**From `api/docs/features.md`:**
- Line 50: "⚠️ **No authorization middleware** - Access control not enforced"
- Line 98: "⚠️ **No access control** - Any user can access any organization"
- Line 641: "⚠️ **No authorization on join** - Any user can join any board room"
- Line 759: "2. **No Authorization Middleware** - Security vulnerability"

**From `api/docs/architecture.md`:**
- Line 1472: "- **No Authorization:** Biggest security risk"

---

## 📋 Four-Phase Implementation Plan

### Phase 1: Authentication Middleware Foundation
**Duration:** 2-3 days | **Priority:** 🔴 P0 Critical

**Goal:** Establish authentication foundation by ensuring all requests have validated user context.

**Deliverables:**
- ✅ Register `@fastify/cookie` and `@fastify/session` plugins
- ✅ Create `AuthenticationService` to validate OAuth tokens
- ✅ Implement `requireAuth` middleware
- ✅ Populate `request.user` on all authenticated requests
- ✅ Update all controllers to use `request.user.id`
- ✅ Remove 7+ TODO comments about missing auth context

**Impact:**
- All endpoints require valid authentication
- `request.user` available throughout application
- Foundation for all authorization checks

**See:** [phase-1.md](./phase-1.md)

---

### Phase 2: Organization & Board Authorization
**Duration:** 2-3 days | **Priority:** 🔴 P0 Critical | **Depends On:** Phase 1

**Goal:** Implement authorization ensuring users can only access resources within their organizations.

**Deliverables:**
- ✅ Create `AuthorizationService` for permission checks
- ✅ Implement `requireOrgMember`, `requireOrgAdmin`, `requireBoardAccess` middleware
- ✅ Fix and populate `user_organization` role field
- ✅ Apply authorization to all 150+ endpoints
- ✅ Protect organization, board, list, card, comment, attachment endpoints
- ✅ Secure bulk operations
- ✅ Scope search to user's organizations

**Impact:**
- Users can only access organizations they're members of
- Board access controlled via organization membership
- All child resources protected through board access chain
- Role-based permissions enforced (admin vs member)

**See:** [phase-2.md](./phase-2.md)

---

### Phase 3: Resource Ownership & Fine-Grained Permissions
**Duration:** 2 days | **Priority:** 🟡 P1 High | **Depends On:** Phase 2

**Goal:** Implement resource ownership controls - only resource creators can modify/delete their resources.

**Deliverables:**
- ✅ Create `OwnershipService` for ownership checks
- ✅ Implement `requireCommentOwner`, `requireAttachmentOwner` middleware
- ✅ Enforce author-only edit/delete for comments
- ✅ Enforce uploader-only delete for attachments
- ✅ Add template visibility controls (public/org/private)
- ✅ Ensure dashboard layouts are user-private
- ✅ Optional: Audit logging for authorization failures

**Impact:**
- Comment authors can edit/delete their own comments only
- Attachment uploaders can delete their own files only
- Templates respect organization visibility
- Enhanced security audit trail

**See:** [phase-3.md](./phase-3.md)

---

### Phase 4: WebSocket Authorization & Real-time Security
**Duration:** 2 days | **Priority:** 🔴 P0 Critical | **Depends On:** Phase 2

**Goal:** Secure WebSocket layer by implementing board authorization and replacing temporary auth with JWT.

**Deliverables:**
- ✅ Replace temporary base64 token auth with secure JWT
- ✅ Implement board access authorization in `board:join` handler
- ✅ Use existing `createBoardAuthorizationMiddleware` function
- ✅ Remove TODO comment about missing authorization (line 96-97)
- ✅ Add enhanced user-based rate limiting
- ✅ Security logging for unauthorized WebSocket attempts

**Impact:**
- Users can only join boards they have access to
- Secure JWT authentication for WebSocket connections
- 50x faster authentication (JWT vs GitHub API)
- Real-time layer fully secured

**See:** [phase-4.md](./phase-4.md)

---

## 🎯 Implementation Order & Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│  Phase 1: Authentication Middleware (Foundation)             │
│  ✅ MUST complete first - all other phases depend on this    │
└────────────────────────────┬────────────────────────────────┘
                             │
           ┌─────────────────┴─────────────────┐
           │                                   │
           ▼                                   ▼
┌──────────────────────────┐      ┌──────────────────────────┐
│  Phase 2: Authorization  │      │  Phase 4: WebSocket Auth │
│  (Organization & Board)  │      │  (Real-time Security)    │
│  Critical for HTTP API   │      │  Critical for WebSocket  │
└──────────┬───────────────┘      └──────────────────────────┘
           │
           ▼
┌──────────────────────────┐
│  Phase 3: Ownership      │
│  (Fine-grained Control)  │
│  Enhancement             │
└──────────────────────────┘
```

**Recommended Implementation Order:**
1. **Phase 1** (Foundation - Required for everything)
2. **Phase 2 + Phase 4** in parallel (Both critical, independent)
3. **Phase 3** (Enhancement after core authorization works)

---

## 📈 Success Metrics

### Before Implementation

| Metric | Current State |
|--------|--------------|
| Endpoints with authorization | **0%** (0/150+) |
| `request.user` populated | **Never** |
| Organization access control | **None** |
| Board access control | **None** |
| Resource ownership enforcement | **None** |
| WebSocket authorization | **Explicit TODO** |
| Role-based permissions | **Unused** |
| Security vulnerabilities | **Critical** |

### After All Phases

| Metric | Target State |
|--------|-------------|
| Endpoints with authorization | **100%** |
| `request.user` populated | **Always** |
| Organization access control | **Fully enforced** |
| Board access control | **Fully enforced** |
| Resource ownership enforcement | **Complete** |
| WebSocket authorization | **Implemented & tested** |
| Role-based permissions | **Active** |
| Security vulnerabilities | **Resolved** |

---

## 🔒 Security Improvements Summary

### Phase 1 Fixes
- ✅ **No authentication** → All endpoints require valid auth
- ✅ **Missing user context** → `request.user` populated everywhere
- ✅ **TODO comments** → All 7+ TODO comments resolved

### Phase 2 Fixes
- ✅ **Cross-org access** → Users limited to their organizations
- ✅ **Unprotected boards** → Board access via org membership
- ✅ **Bulk operation abuse** → Authorization checks before bulk ops
- ✅ **Search data leak** → Search scoped to accessible orgs
- ✅ **Unused roles** → Admin vs Member permissions enforced

### Phase 3 Fixes
- ✅ **Comment hijacking** → Only author can edit/delete
- ✅ **File deletion abuse** → Only uploader can delete
- ✅ **Template leaks** → Visibility controls enforced

### Phase 4 Fixes
- ✅ **WebSocket TODO** → Authorization implemented
- ✅ **Unauthorized board joins** → Access checks enforced
- ✅ **Insecure tokens** → JWT with expiration
- ✅ **Presence spoofing** → Can't join unauthorized boards

---

## 🧪 Testing Requirements

### Test Coverage Goals

| Phase | Unit Tests | Integration Tests | Coverage Target |
|-------|-----------|-------------------|-----------------|
| Phase 1 | Auth service, Middleware | End-to-end auth flow | 90%+ |
| Phase 2 | Authz service, Middleware | Cross-org scenarios | 95%+ |
| Phase 3 | Ownership service | Resource ownership | 90%+ |
| Phase 4 | WebSocket auth, JWT | WebSocket scenarios | 95%+ |

### Total Test Estimate
- **~120 unit tests** across all phases
- **~40 integration tests** covering critical paths
- **Manual testing** checklist for each phase

---

## 🚀 Rollout Strategy

### Development Phase
1. Implement Phase 1
2. Test thoroughly with all existing endpoints
3. Implement Phases 2 & 4 in parallel
4. Implement Phase 3
5. Full integration testing

### Staging Phase
1. Deploy to staging environment
2. Frontend team tests integration
3. Load testing for performance validation
4. Security audit by team lead

### Production Phase
1. **Staged rollout:**
   - Phase 1: Authentication (least breaking)
   - Phase 2: Authorization (coordinate with frontend)
   - Phase 4: WebSocket (coordinate with real-time features)
   - Phase 3: Ownership (enhancement)
2. Monitor error rates and performance
3. Security team review

### Rollback Plan
- Each phase can be rolled back independently
- Feature flags for gradual enablement
- Comprehensive logging for troubleshooting

---

## ⚠️ Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Breaking existing clients | High | High | Coordinate with frontend, staged rollout |
| Performance degradation | Medium | Medium | Caching, load testing |
| OAuth flow issues | Low | High | Extensive testing, monitoring |
| WebSocket disconnections | Medium | Medium | Graceful error handling, client retry logic |
| Database query overhead | Medium | Low | Request-level caching, query optimization |

---

## 📦 Dependencies & Requirements

### Existing (Already Installed)
- ✅ `@fastify/cookie` v10.0.2
- ✅ `@fastify/session` v11.1.0
- ✅ `@fastify/oauth2` v8.1.1

### New (Phase 4)
- `jsonwebtoken` - JWT generation/verification
- `@types/jsonwebtoken` - TypeScript types

### No Additional Dependencies for Phases 1-3

---

## 📁 Files Created/Modified

### New Files (Total: 18)

**Services:**
- `src/services/auth.service.ts` (Phase 1)
- `src/services/authorization.service.ts` (Phase 2)
- `src/services/ownership.service.ts` (Phase 3)
- `src/services/audit.service.ts` (Phase 3 - optional)
- `src/utils/jwt.util.ts` (Phase 4)

**Middleware:**
- `src/middleware/auth.middleware.ts` (Phase 1)
- `src/middleware/authorization.middleware.ts` (Phase 2)
- `src/middleware/ownership.middleware.ts` (Phase 3)

**Types:**
- `src/types/fastify.d.ts` (Phase 1)

**Tests:**
- `src/__test__/auth.service.test.ts` (Phase 1)
- `src/__test__/auth.middleware.test.ts` (Phase 1)
- `src/__test__/auth.integration.test.ts` (Phase 1)
- `src/__test__/authorization.service.test.ts` (Phase 2)
- `src/__test__/authorization.middleware.test.ts` (Phase 2)
- `src/__test__/authorization.integration.test.ts` (Phase 2)
- `src/__test__/ownership.service.test.ts` (Phase 3)
- `src/__test__/ownership.middleware.test.ts` (Phase 3)
- `src/__test__/ownership.integration.test.ts` (Phase 3)
- `src/__test__/websocket-auth.test.ts` (Phase 4)
- `src/__test__/websocket.integration.test.ts` (Phase 4)

**Migrations:**
- `src/db/migrations/20251117_add_template_visibility.ts` (Phase 3)

### Modified Files (Total: ~35+)

- `src/bootstrap.ts` (All phases)
- 20+ route files (Phases 2-3)
- 10+ controller files (All phases)
- `src/modules/oauth/oauth.controller.ts` (Phases 1, 4)
- `src/modules/websocket/websocket.server.ts` (Phase 4)
- `src/modules/websocket/websocket.middleware.ts` (Phase 4)
- `src/db/schemas/user-organization.ts` (Phase 2)
- `src/db/seeds/development/021-user-organization.ts` (Phase 2)
- `package.json` (Phase 4)

---

## 🎓 Learning & Documentation

### Key Concepts Introduced

1. **Authentication vs Authorization:**
   - Authentication: "Who are you?" (Phase 1)
   - Authorization: "What can you access?" (Phases 2-4)

2. **Layered Security:**
   - Global authentication (Phase 1)
   - Organization membership (Phase 2)
   - Board access via org (Phase 2)
   - Resource ownership (Phase 3)
   - Real-time authorization (Phase 4)

3. **Middleware Composition:**
   ```typescript
   preHandler: [requireAuth, requireOrgMember, requireBoardAccess]
   ```

4. **Role-Based Access Control (RBAC):**
   - `ADMIN`: Full control over organization
   - `MEMBER`: Access to organization resources
   - `GUEST`: Limited access (future use)

### Architecture Patterns

- **Service Layer Separation:** Authentication, Authorization, Ownership services
- **Middleware Chain:** Composable security checks
- **Request Context:** User data available throughout request lifecycle
- **Hierarchical Authorization:** Resource access through ownership chain

---

## 📞 Team Coordination

### Frontend Team Requirements

**Phase 1:**
- Ensure OAuth flow continues to work
- Handle 401 Unauthorized responses

**Phase 2:**
- Handle 403 Forbidden responses
- Update organization filtering (GET /organizations/all now returns user's orgs only)

**Phase 4:**
- Update WebSocket connection to use JWT from cookie
- Handle WebSocket authorization errors
- Implement reconnection logic

### Database Team

**Phase 2:**
- Ensure `user_organization` table has role field populated
- Verify seed data includes roles

**Phase 3:**
- Review template visibility migration

### DevOps Team

**All Phases:**
- Add `JWT_SECRET` to environment variables (Phase 4)
- Monitor error rates during rollout
- Set up alerts for authorization failures

---

## 📊 Monitoring & Observability

### Metrics to Track

**Authentication Metrics (Phase 1):**
- 401 error rate
- OAuth success rate
- Average authentication latency

**Authorization Metrics (Phase 2):**
- 403 error rate by endpoint
- Organization access attempts
- Board access attempts

**WebSocket Metrics (Phase 4):**
- WebSocket connection success rate
- board:join success/failure rate
- JWT validation latency

### Logging

**Security Events to Log:**
- Failed authentication attempts
- Failed authorization attempts (403)
- Unauthorized WebSocket board join attempts
- Admin-only action attempts by non-admins
- Bulk operation authorization failures

### Alerting

**Critical Alerts:**
- High 401 error rate (> 10% of requests)
- High 403 error rate (> 5% of requests)
- WebSocket authorization failures spike
- OAuth flow failures

---

## ✅ Phase Completion Checklist

Use this checklist to track overall progress:

### Phase 1: Authentication Middleware
- [ ] Plugins registered
- [ ] AuthenticationService created
- [ ] requireAuth middleware implemented
- [ ] request.user populated
- [ ] All TODO comments removed
- [ ] Tests passing (90%+ coverage)
- [ ] Documentation updated

### Phase 2: Organization & Board Authorization
- [ ] AuthorizationService created
- [ ] Authorization middleware implemented
- [ ] All routes protected
- [ ] user_organization roles populated
- [ ] Search scoped to organizations
- [ ] Tests passing (95%+ coverage)
- [ ] Documentation updated

### Phase 3: Resource Ownership
- [ ] OwnershipService created
- [ ] Ownership middleware implemented
- [ ] Comment/attachment ownership enforced
- [ ] Template visibility implemented
- [ ] Tests passing (90%+ coverage)
- [ ] Documentation updated

### Phase 4: WebSocket Authorization
- [ ] JWT implementation complete
- [ ] WebSocket auth using JWT
- [ ] Board authorization enforced
- [ ] TODO comment removed
- [ ] Tests passing (95%+ coverage)
- [ ] Frontend coordinated
- [ ] Documentation updated

---

## 🔗 Quick Links

- [Phase 1: Authentication Middleware](./phase-1.md)
- [Phase 2: Organization & Board Authorization](./phase-2.md)
- [Phase 3: Resource Ownership](./phase-3.md)
- [Phase 4: WebSocket Authorization](./phase-4.md)
- [API Features Documentation](../features.md)
- [API Architecture Documentation](../architecture.md)

---

## 💬 Questions & Support

For questions about this security improvement plan:

1. Review the detailed phase documents
2. Check the API architecture documentation
3. Review existing OAuth implementation
4. Consult team lead for security concerns

---

## 🎯 Final Notes

**This is a critical security initiative that must be prioritized.** The current state represents a **complete absence of authorization controls**, making the application vulnerable to data breaches, unauthorized access, and malicious actions.

**The good news:**
- Authentication infrastructure exists (GitHub OAuth)
- Database schema supports roles (just unused)
- WebSocket has middleware scaffolding (just not applied)
- Architecture supports layered authorization

**The path forward:**
- Phase 1 is the foundation - must complete first
- Phases 2 & 4 address critical vulnerabilities - highest priority
- Phase 3 is an enhancement - can be done after core authorization works

**Estimated total effort:** 8-10 days of focused development + testing
**Priority:** 🔴 **CRITICAL - P0**
**Status:** Ready to implement

---

**Created:** 2025-11-17
**Last Updated:** 2025-11-17
**Version:** 1.0
**Author:** Claude (Security Analysis & Planning)
