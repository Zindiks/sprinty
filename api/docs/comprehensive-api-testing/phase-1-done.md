# API Testing - Phase 1: Critical Security & Core Features

**Status:** Planned
**Created:** 2025-11-17
**Priority:** CRITICAL
**Duration Estimate:** 3-4 days

---

## Overview

Phase 1 focuses on testing critical, security-sensitive, and foundational API features that currently have zero test coverage. These features are essential for the application's core functionality and security.

---

## Goals

- ✅ Establish foundation with User Profiles tests
- ✅ Secure critical Bulk Card Operations (currently untested!)
- ✅ Validate Attachments security (file upload concerns)
- ✅ Achieve 90%+ coverage for all three modules
- ✅ Create reusable test patterns for future phases

---

## Modules to Test

### 1. User Profiles (Foundation)
**Priority:** High - Needed for other tests
**Current Status:** ❌ 0 tests
**Endpoints:** 5
**Test Goal:** 90%+ coverage

| Endpoint | Method | Status | Priority |
|----------|--------|--------|----------|
| `/profiles/user/:user_id` | GET | ❌ Not tested | High |
| `/profiles/:id` | GET | ❌ Not tested | High |
| `/profiles` | POST | ❌ Not tested | High |
| `/profiles/user/:user_id` | PUT | ❌ Not tested | High |
| `/profiles/user/:user_id` | DELETE | ❌ Not tested | High |

**Estimated Tests:** 25-30 tests

---

### 2. Bulk Card Operations (CRITICAL)
**Priority:** CRITICAL - Recent feature with zero tests
**Current Status:** ❌ 0 tests
**Endpoints:** 6
**Test Goal:** 95%+ coverage

| Endpoint | Method | Status | Priority |
|----------|--------|--------|----------|
| `/cards/bulk/move` | POST | ❌ Not tested | Critical |
| `/cards/bulk/assign` | POST | ❌ Not tested | Critical |
| `/cards/bulk/labels` | POST | ❌ Not tested | Critical |
| `/cards/bulk/due-date` | POST | ❌ Not tested | Critical |
| `/cards/bulk/archive` | POST | ❌ Not tested | Critical |
| `/cards/bulk` | DELETE | ❌ Not tested | Critical |

**Estimated Tests:** 40-45 tests

**Critical Concerns:**
- ⚠️ No tests for transaction rollback on failure
- ⚠️ No tests for partial failure scenarios
- ⚠️ No authorization tests
- ⚠️ No performance tests (what happens with 100+ cards?)

---

### 3. Attachments (Security-Sensitive)
**Priority:** High - File upload security
**Current Status:** ❌ 0 tests
**Endpoints:** 8
**Test Goal:** 95%+ coverage

| Endpoint | Method | Status | Priority |
|----------|--------|--------|----------|
| `/attachments/card/:card_id` | POST | ❌ Not tested | Critical |
| `/attachments/:id/card/:card_id` | GET | ❌ Not tested | Medium |
| `/attachments/card/:card_id` | GET | ❌ Not tested | Medium |
| `/attachments/:id/card/:card_id/download` | GET | ❌ Not tested | High |
| `/attachments` | PATCH | ❌ Not tested | Low |
| `/attachments/:id/card/:card_id` | DELETE | ❌ Not tested | Medium |
| `/attachments/card/:card_id/count` | GET | ❌ Not tested | Low |
| `/attachments/user/:user_id` | GET | ❌ Not tested | Low |

**Estimated Tests:** 35-40 tests

**Security Concerns:**
- ⚠️ File type validation (malicious files)
- ⚠️ File size limits (10MB max)
- ⚠️ Path traversal attacks
- ⚠️ Virus scanning (if applicable)
- ⚠️ Storage limits per user

---

## Implementation Plan

### Step 1: User Profiles Tests
**Duration:** 1 day

#### Files to Create:
- `api/src/__test__/profile.test.ts` (Unit tests)
- `api/src/__test__/profile.integration.test.ts` (Integration tests)

#### Test Coverage:
```typescript
// Unit Tests (Service Layer)
describe('ProfileService', () => {
  describe('getProfileByUserId', () => {
    ✅ should return profile when found
    ✅ should return null when not found
    ✅ should handle database errors
  })

  describe('getProfileById', () => {
    ✅ should return profile when found
    ✅ should return null when not found
  })

  describe('createProfile', () => {
    ✅ should create profile with valid data
    ✅ should validate required fields
    ✅ should prevent duplicate profiles
    ✅ should trim whitespace from fields
  })

  describe('updateProfile', () => {
    ✅ should update profile fields
    ✅ should handle non-existent profile
    ✅ should validate field types
    ✅ should not update if no changes
  })

  describe('deleteProfile', () => {
    ✅ should delete profile
    ✅ should handle non-existent profile
    ✅ should cascade delete relations
  })
})

// Integration Tests (Full API)
describe('Profile API Integration', () => {
  ✅ GET /profiles/user/:user_id - success
  ✅ GET /profiles/user/:user_id - not found (404)
  ✅ GET /profiles/:id - success
  ✅ GET /profiles/:id - not found (404)
  ✅ POST /profiles - create success (201)
  ✅ POST /profiles - validation error (400)
  ✅ PUT /profiles/user/:user_id - update success
  ✅ PUT /profiles/user/:user_id - not found (404)
  ✅ DELETE /profiles/user/:user_id - success (204)
  ✅ DELETE /profiles/user/:user_id - not found (404)
})
```

---

### Step 2: Bulk Card Operations Tests
**Duration:** 1.5-2 days

#### Files to Create:
- `api/src/__test__/bulk-operations.test.ts` (Unit tests)
- `api/src/__test__/bulk-operations.integration.test.ts` (Integration tests)

#### Test Coverage:
```typescript
// Unit Tests (Service Layer)
describe('BulkService', () => {
  describe('bulkMoveCards', () => {
    ✅ should move multiple cards to new list
    ✅ should update card orders
    ✅ should rollback on failure (transaction)
    ✅ should handle empty card array
    ✅ should validate list exists
    ✅ should handle partial card IDs
  })

  describe('bulkAssignUsers', () => {
    ✅ should assign users to multiple cards
    ✅ should prevent duplicate assignments
    ✅ should validate user IDs
    ✅ should validate card IDs
    ✅ should rollback on failure
  })

  describe('bulkAddLabels', () => {
    ✅ should add labels to multiple cards
    ✅ should prevent duplicate labels
    ✅ should validate label IDs
    ✅ should rollback on failure
  })

  describe('bulkSetDueDate', () => {
    ✅ should set due date on multiple cards
    ✅ should validate date format
    ✅ should allow null date (clear)
    ✅ should rollback on failure
  })

  describe('bulkArchiveCards', () => {
    ✅ should archive multiple cards
    ✅ should update status correctly
    ✅ should handle already archived
    ✅ should rollback on failure
  })

  describe('bulkDeleteCards', () => {
    ✅ should delete multiple cards
    ✅ should cascade delete relations
    ✅ should rollback on failure
    ✅ should handle non-existent cards
  })
})

// Integration Tests
describe('Bulk Operations Integration', () => {
  ✅ POST /cards/bulk/move - success (200)
  ✅ POST /cards/bulk/move - invalid list (404)
  ✅ POST /cards/bulk/move - invalid cards (400)
  ✅ POST /cards/bulk/assign - success
  ✅ POST /cards/bulk/assign - invalid user (404)
  ✅ POST /cards/bulk/labels - success
  ✅ POST /cards/bulk/labels - invalid label (404)
  ✅ POST /cards/bulk/due-date - success
  ✅ POST /cards/bulk/due-date - invalid date (400)
  ✅ POST /cards/bulk/archive - success
  ✅ DELETE /cards/bulk - success (204)
  ✅ DELETE /cards/bulk - partial failure handling
})

// Performance Tests
describe('Bulk Operations Performance', () => {
  ✅ should handle 10 cards efficiently
  ✅ should handle 50 cards efficiently
  ✅ should handle 100 cards efficiently
  ✅ should not timeout on large operations
})
```

---

### Step 3: Attachments Tests
**Duration:** 1.5 days

#### Files to Create:
- `api/src/__test__/attachment.test.ts` (Unit tests)
- `api/src/__test__/attachment.integration.test.ts` (Integration tests)

#### Test Coverage:
```typescript
// Unit Tests (Service Layer)
describe('AttachmentService', () => {
  describe('uploadAttachment', () => {
    ✅ should upload valid file
    ✅ should validate file size (10MB max)
    ✅ should validate file type
    ✅ should generate unique filename
    ✅ should store file metadata in DB
    ✅ should reject oversized files
    ✅ should reject invalid file types
  })

  describe('getAttachment', () => {
    ✅ should return attachment metadata
    ✅ should return null if not found
  })

  describe('getCardAttachments', () => {
    ✅ should return all attachments for card
    ✅ should return empty array if none
    ✅ should include user info
  })

  describe('downloadAttachment', () => {
    ✅ should return file stream
    ✅ should handle missing file
    ✅ should set correct content-type
  })

  describe('updateAttachment', () => {
    ✅ should update filename
    ✅ should validate new filename
    ✅ should handle not found
  })

  describe('deleteAttachment', () => {
    ✅ should delete attachment
    ✅ should delete physical file
    ✅ should handle missing file gracefully
  })

  describe('getAttachmentCount', () => {
    ✅ should return correct count
    ✅ should return 0 for card with no attachments
  })

  describe('getUserAttachments', () => {
    ✅ should return user's attachments
    ✅ should filter by user_id correctly
  })
})

// Integration Tests
describe('Attachment API Integration', () => {
  ✅ POST /attachments/card/:card_id - upload success (201)
  ✅ POST /attachments/card/:card_id - file too large (413)
  ✅ POST /attachments/card/:card_id - invalid type (400)
  ✅ GET /attachments/:id/card/:card_id - success
  ✅ GET /attachments/:id/card/:card_id - not found (404)
  ✅ GET /attachments/card/:card_id - list all
  ✅ GET /attachments/:id/card/:card_id/download - success
  ✅ PATCH /attachments - rename success
  ✅ DELETE /attachments/:id/card/:card_id - success (204)
  ✅ GET /attachments/card/:card_id/count - success
  ✅ GET /attachments/user/:user_id - success
})

// Security Tests
describe('Attachment Security', () => {
  ✅ should reject files without extension
  ✅ should reject executable files (.exe, .sh)
  ✅ should reject script files (.js, .py)
  ✅ should sanitize filenames
  ✅ should prevent path traversal (../../etc/passwd)
  ✅ should enforce storage per user (if implemented)
  ✅ should require authentication
  ✅ should check card access before upload
})
```

---

## Test Files Structure

```
api/src/__test__/
├── profile.test.ts                      # Profiles unit tests
├── profile.integration.test.ts          # Profiles integration tests
├── bulk-operations.test.ts              # Bulk ops unit tests
├── bulk-operations.integration.test.ts  # Bulk ops integration tests
├── attachment.test.ts                   # Attachments unit tests
└── attachment.integration.test.ts       # Attachments integration tests
```

---

## Testing Patterns to Follow

### Unit Test Pattern (Service Layer)
```typescript
import { ModuleService } from '../modules/module/module.service'
import { ModuleRepository } from '../modules/module/module.repository'

jest.mock('../modules/module/module.repository')

const MockedRepository = ModuleRepository as jest.Mock<ModuleRepository>

describe('ModuleService', () => {
  let service: ModuleService
  let repository: jest.Mocked<ModuleRepository>

  beforeEach(() => {
    repository = new MockedRepository() as jest.Mocked<ModuleRepository>
    service = new ModuleService()
    // @ts-ignore - inject mocked repository
    service['repository'] = repository
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should handle success case', async () => {
    // Arrange
    const input = { id: '1', name: 'Test' }
    const expected = { id: '1', name: 'Test', created_at: new Date() }
    repository.method.mockResolvedValue(expected)

    // Act
    const result = await service.method(input)

    // Assert
    expect(result).toEqual(expected)
    expect(repository.method).toHaveBeenCalledWith(input)
    expect(repository.method).toHaveBeenCalledTimes(1)
  })
})
```

### Integration Test Pattern (Full API)
```typescript
import { bootstrap } from '../bootstrap'
import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { db } from '../db/knexInstance'

describe('Module Integration Tests', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await bootstrap()
    await db.migrate.latest()
  })

  afterAll(async () => {
    await db.migrate.rollback()
    await app.close()
  })

  beforeEach(async () => {
    // Clear test data
    await db('table').truncate()
  })

  it('POST /api/v1/resource should create resource', async () => {
    const response = await request(app.server)
      .post('/api/v1/resource')
      .send({ name: 'Test Resource' })
      .expect(201)

    expect(response.body).toMatchObject({
      name: 'Test Resource',
      id: expect.any(String),
      created_at: expect.any(String)
    })

    // Verify in database
    const record = await db('table').where({ id: response.body.id }).first()
    expect(record).toBeDefined()
  })
})
```

---

## Acceptance Criteria

### Phase 1 Complete When:
- ✅ All unit tests passing
- ✅ All integration tests passing
- ✅ Coverage goals met:
  - Profiles: 90%+
  - Bulk Operations: 95%+
  - Attachments: 95%+
- ✅ Security tests passing (Attachments)
- ✅ Performance tests passing (Bulk ops with 100 cards)
- ✅ No test flakiness
- ✅ CI/CD integration (if applicable)
- ✅ Documentation updated

---

## Dependencies

### Required:
- Jest v29.7.0 ✅ (configured)
- Supertest v7.0.0 ✅ (configured)
- Test database setup ✅
- Knex migrations ✅

### Optional:
- Code coverage reporting
- CI/CD integration
- Test data factories

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Bulk ops break on large datasets | High | Medium | Add performance tests with 100+ cards |
| Attachment security gaps | Critical | Medium | Comprehensive security test suite |
| File upload mocking complexity | Medium | High | Use in-memory file handling for tests |
| Database transaction rollback issues | High | Low | Test rollback scenarios explicitly |
| Test database pollution | Medium | Medium | Clear data in beforeEach hooks |

---

## Performance Benchmarks

### Bulk Operations:
- 10 cards: < 100ms
- 50 cards: < 500ms
- 100 cards: < 2 seconds
- Transaction rollback: < 50ms

### Attachments:
- Upload 1MB file: < 500ms
- Upload 10MB file: < 3 seconds
- Download file: < 200ms

---

## Security Checklist

### Attachments:
- ✅ File type validation (whitelist approach)
- ✅ File size limits (10MB)
- ✅ Filename sanitization
- ✅ Path traversal prevention
- ✅ Authorization checks
- ✅ Storage limits (if implemented)
- ✅ Content-Type validation
- ✅ Extension validation

### Bulk Operations:
- ✅ Authorization checks (can user modify these cards?)
- ✅ Input validation (card IDs, user IDs, etc.)
- ✅ Transaction integrity
- ✅ Rate limiting considerations

---

## Success Metrics

### Quantitative:
- ✅ 100-115 tests created
- ✅ 90%+ line coverage
- ✅ 85%+ branch coverage
- ✅ All tests passing
- ✅ 0 security vulnerabilities

### Qualitative:
- ✅ Tests are maintainable
- ✅ Tests document expected behavior
- ✅ Tests catch regressions
- ✅ Tests are fast (< 30s total)

---

## Next Steps After Phase 1

1. **Update features.md** with test status
2. **Create Phase 2 plan** (Card Detail Features)
3. **Review Phase 1 learnings** for improvements
4. **Consider parallelizing** Phase 2 + Phase 3

---

## Files to Create

### Test Files (6 new files):
1. `api/src/__test__/profile.test.ts`
2. `api/src/__test__/profile.integration.test.ts`
3. `api/src/__test__/bulk-operations.test.ts`
4. `api/src/__test__/bulk-operations.integration.test.ts`
5. `api/src/__test__/attachment.test.ts`
6. `api/src/__test__/attachment.integration.test.ts`

### Documentation:
- This file: `phase-1.md` → `phase-1-wip.md` → `phase-1-done.md`

---

## Time Breakdown

| Task | Estimated Time |
|------|----------------|
| **Profiles Tests** | 1 day |
| - Unit tests (15 tests) | 4 hours |
| - Integration tests (10 tests) | 3 hours |
| - Debugging & fixes | 1 hour |
| **Bulk Operations Tests** | 1.5-2 days |
| - Unit tests (30 tests) | 8 hours |
| - Integration tests (12 tests) | 4 hours |
| - Performance tests (4 tests) | 2 hours |
| - Debugging & fixes | 2 hours |
| **Attachments Tests** | 1.5 days |
| - Unit tests (20 tests) | 6 hours |
| - Integration tests (11 tests) | 4 hours |
| - Security tests (8 tests) | 3 hours |
| - Debugging & fixes | 1 hour |
| **Documentation** | 2 hours |
| **TOTAL** | 3-4 days |

---

**Status:** ✅ Phase 1 Planned - Ready to Begin Implementation
**Next:** Rename to `phase-1-wip.md` and start with Profiles tests
