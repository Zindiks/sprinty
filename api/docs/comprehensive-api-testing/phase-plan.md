# Comprehensive API Testing Plan

**Status:** Planning
**Created:** 2025-11-17
**Branch:** claude/add-tests-015E1vebyZTYchXRuZSsBwxU

---

## Overview

This document outlines a comprehensive testing strategy for all untested API features in the Sprinty project. The goal is to increase test coverage from 28.5% to 85%+ across all critical modules.

---

## Current Test Coverage Status

### ✅ Tested Modules (28.5% - 6/21 modules)
- **OAuth** - 88 lines of tests
- **Organizations** - 103 lines of tests
- **Boards** - 91 lines of tests
- **Lists** - 132 lines of tests
- **Cards** - 108 lines of tests (partial - missing detail endpoints)
- **Search** - 746 lines of tests (comprehensive - unit, integration, controller)

### ⚠️ Untested Modules (71.5% - 15/21 modules)
- **Profiles** - 0 tests (5 endpoints)
- **Bulk Card Operations** - 0 tests (6 endpoints) ⚠️ CRITICAL
- **Assignees** - 0 tests (5 endpoints)
- **Labels** - 0 tests (10 endpoints)
- **Checklists** - 0 tests (9 endpoints)
- **Comments** - 0 tests (9 endpoints)
- **Attachments** - 0 tests (8 endpoints) ⚠️ Security concern
- **Activities** - 0 tests (7 endpoints)
- **Sprints** - 0 tests (11 endpoints)
- **Time Tracking** - 0 tests (8 endpoints)
- **Analytics** - 0 tests (10 endpoints)
- **Reports** - 0 tests (5 endpoints)
- **Templates** - 0 tests (7 endpoints)
- **Dashboard Layouts** - 0 tests (6 endpoints)
- **WebSocket** - 0 tests (12 events) ⚠️ CRITICAL

---

## Testing Strategy

### Test Levels
1. **Unit Tests** - Service layer business logic (mocked repositories)
2. **Integration Tests** - Full API endpoint tests (real database)
3. **Controller Tests** - Request/response handling (mocked services)

### Coverage Goals
- **Overall Target:** 85%+
- **Critical Paths:** 90%+
- **Business Logic:** 85%+
- **Security-Sensitive:** 95%+ (Attachments, Auth, etc.)

### Testing Stack (Already Configured)
- **Framework:** Jest v29.7.0
- **HTTP Testing:** Supertest v7.0.0
- **Assertions:** Chai v5.1.2
- **Mocking:** Jest mocks + Nock v14.0.0
- **Coverage:** V8 provider

---

## Phase Breakdown

### Phase 1: Critical Security & Core Features (HIGH PRIORITY)
**Duration:** 3-4 days
**Goal:** Test security-sensitive and critical business features

#### 1.1 User Profiles (Foundation)
- **Endpoints:** 5
- **Priority:** High (needed for other tests)
- **Test Types:** Unit + Integration
- **Estimated Tests:** 25-30
- **Files to Create:**
  - `api/src/__test__/profile.test.ts`
  - `api/src/__test__/profile.integration.test.ts`

**Test Coverage:**
- ✅ Get profile by user ID
- ✅ Get profile by ID
- ✅ Create profile
- ✅ Update profile
- ✅ Delete profile
- ✅ Error cases (not found, validation)
- ✅ Edge cases (duplicate, missing fields)

#### 1.2 Bulk Card Operations (CRITICAL)
- **Endpoints:** 6
- **Priority:** CRITICAL (recent feature, zero tests)
- **Test Types:** Unit + Integration + Performance
- **Estimated Tests:** 40-45
- **Files to Create:**
  - `api/src/__test__/bulk-operations.test.ts`
  - `api/src/__test__/bulk-operations.integration.test.ts`

**Test Coverage:**
- ✅ Bulk move cards
- ✅ Bulk assign users
- ✅ Bulk add labels
- ✅ Bulk set due dates
- ✅ Bulk archive cards
- ✅ Bulk delete cards
- ✅ Transaction rollback on failure
- ✅ Authorization checks
- ✅ Performance with 100+ cards
- ✅ Error handling (partial failures)

#### 1.3 Attachments (Security-Sensitive)
- **Endpoints:** 8
- **Priority:** High (file upload, security concern)
- **Test Types:** Unit + Integration + Security
- **Estimated Tests:** 35-40
- **Files to Create:**
  - `api/src/__test__/attachment.test.ts`
  - `api/src/__test__/attachment.integration.test.ts`

**Test Coverage:**
- ✅ Upload attachment (multipart)
- ✅ Get attachment by ID
- ✅ Get all attachments for card
- ✅ Download attachment
- ✅ Update attachment (rename)
- ✅ Delete attachment
- ✅ Get attachment count
- ✅ Get attachments by user
- ✅ File type validation
- ✅ File size limits (10MB)
- ✅ Malicious file detection
- ✅ Path traversal prevention
- ✅ Authorization checks

**Phase 1 Deliverables:**
- 100-115 new tests
- 3 new test files
- Coverage: Profiles (90%+), Bulk Ops (95%+), Attachments (95%+)

---

### Phase 2: Card Detail Features (MEDIUM-HIGH PRIORITY)
**Duration:** 4-5 days
**Goal:** Complete card-related functionality testing

#### 2.1 Labels
- **Endpoints:** 10
- **Priority:** Medium-High
- **Test Types:** Unit + Integration
- **Estimated Tests:** 45-50
- **Files to Create:**
  - `api/src/__test__/label.test.ts`
  - `api/src/__test__/label.integration.test.ts`

**Test Coverage:**
- ✅ Create label
- ✅ Update label (name, color)
- ✅ Delete label
- ✅ Get label by ID
- ✅ Get all board labels
- ✅ Get labels with counts
- ✅ Add label to card
- ✅ Remove label from card
- ✅ Get card labels
- ✅ Get cards by label
- ✅ Duplicate label handling
- ✅ Color validation
- ✅ Cascading deletes

#### 2.2 Checklists
- **Endpoints:** 9
- **Priority:** Medium
- **Test Types:** Unit + Integration
- **Estimated Tests:** 40-45
- **Files to Create:**
  - `api/src/__test__/checklist.test.ts`
  - `api/src/__test__/checklist.integration.test.ts`

**Test Coverage:**
- ✅ Create checklist item
- ✅ Update checklist item
- ✅ Toggle completion
- ✅ Delete checklist item
- ✅ Get item by ID
- ✅ Get all items for card
- ✅ Get progress stats
- ✅ Get items with progress
- ✅ Reorder items
- ✅ Validation (title length)
- ✅ Order conflict resolution

#### 2.3 Comments
- **Endpoints:** 9
- **Priority:** Medium
- **Test Types:** Unit + Integration
- **Estimated Tests:** 40-45
- **Files to Create:**
  - `api/src/__test__/comment.test.ts`
  - `api/src/__test__/comment.integration.test.ts`

**Test Coverage:**
- ✅ Create comment
- ✅ Update comment (author-only)
- ✅ Delete comment (author-only)
- ✅ Get comment by ID
- ✅ Get all comments for card
- ✅ Get comments with user details
- ✅ Get threaded comments (nested)
- ✅ Get replies to comment
- ✅ Get comment count
- ✅ Threading functionality
- ✅ Authorization (edit/delete own)
- ✅ Pagination

#### 2.4 Assignees
- **Endpoints:** 5
- **Priority:** Medium
- **Test Types:** Unit + Integration
- **Estimated Tests:** 25-30
- **Files to Create:**
  - `api/src/__test__/assignee.test.ts`
  - `api/src/__test__/assignee.integration.test.ts`

**Test Coverage:**
- ✅ Add assignee to card
- ✅ Remove assignee from card
- ✅ Get all assignees for card
- ✅ Check if user is assigned
- ✅ Get user's assigned cards
- ✅ Duplicate assignment prevention
- ✅ User validation
- ✅ Card validation

**Phase 2 Deliverables:**
- 150-170 new tests
- 8 new test files
- Coverage: Labels (90%+), Checklists (85%+), Comments (85%+), Assignees (90%+)

---

### Phase 3: Activities & Tracking (MEDIUM PRIORITY)
**Duration:** 3-4 days
**Goal:** Test activity logging and time tracking

#### 3.1 Activities
- **Endpoints:** 7
- **Priority:** Medium
- **Test Types:** Unit + Integration
- **Estimated Tests:** 35-40
- **Files to Create:**
  - `api/src/__test__/activity.test.ts`
  - `api/src/__test__/activity.integration.test.ts`

**Test Coverage:**
- ✅ Log new activity
- ✅ Get activity by ID
- ✅ Get card activities (paginated)
- ✅ Get user activities
- ✅ Get activities with filters
- ✅ Get activity stats
- ✅ Delete all activities for card
- ✅ Activity types (all 11 types)
- ✅ Pagination
- ✅ Filtering (date range, type)
- ✅ Stats calculation

#### 3.2 Time Tracking
- **Endpoints:** 8
- **Priority:** Medium
- **Test Types:** Unit + Integration
- **Estimated Tests:** 35-40
- **Files to Create:**
  - `api/src/__test__/time-tracking.test.ts`
  - `api/src/__test__/time-tracking.integration.test.ts`

**Test Coverage:**
- ✅ Log time for card
- ✅ Get time log by ID
- ✅ Get card time logs
- ✅ Get total time for card
- ✅ Get user time logs
- ✅ Get time logs in date range
- ✅ Update time log
- ✅ Delete time log
- ✅ Duration validation (positive)
- ✅ Date range queries
- ✅ Aggregation accuracy
- ✅ User-specific filtering

**Phase 3 Deliverables:**
- 70-80 new tests
- 4 new test files
- Coverage: Activities (85%+), Time Tracking (90%+)

---

### Phase 4: Agile/Scrum Features (MEDIUM PRIORITY)
**Duration:** 4-5 days
**Goal:** Test sprint management and analytics

#### 4.1 Sprints
- **Endpoints:** 11
- **Priority:** Medium-High
- **Test Types:** Unit + Integration
- **Estimated Tests:** 50-55
- **Files to Create:**
  - `api/src/__test__/sprint.test.ts`
  - `api/src/__test__/sprint.integration.test.ts`

**Test Coverage:**
- ✅ Create sprint
- ✅ Get sprint by ID (with stats)
- ✅ Get all sprints for board
- ✅ Get active sprint
- ✅ Update sprint
- ✅ Delete sprint
- ✅ Get cards in sprint
- ✅ Add cards to sprint
- ✅ Remove cards from sprint
- ✅ Start sprint (status change)
- ✅ Complete sprint (status change)
- ✅ Sprint status validation
- ✅ Date range validation
- ✅ Only one active sprint per board
- ✅ Stats calculation (completion, etc.)

#### 4.2 Analytics
- **Endpoints:** 10
- **Priority:** Medium
- **Test Types:** Unit + Integration
- **Estimated Tests:** 45-50
- **Files to Create:**
  - `api/src/__test__/analytics.test.ts`
  - `api/src/__test__/analytics.integration.test.ts`

**Test Coverage:**
- ✅ Personal dashboard stats
- ✅ Board analytics
- ✅ Sprint burndown chart
- ✅ Board velocity
- ✅ Assigned tasks
- ✅ Due date analytics
- ✅ Personal trends
- ✅ Boards overview
- ✅ Weekly metrics
- ✅ Monthly metrics
- ✅ Calculation accuracy
- ✅ Date range handling
- ✅ Empty data scenarios

**Phase 4 Deliverables:**
- 95-105 new tests
- 4 new test files
- Coverage: Sprints (90%+), Analytics (85%+)

---

### Phase 5: Templates, Reports & Customization (LOWER PRIORITY)
**Duration:** 3-4 days
**Goal:** Test customization and export features

#### 5.1 Templates
- **Endpoints:** 7
- **Priority:** Medium
- **Test Types:** Unit + Integration
- **Estimated Tests:** 35-40
- **Files to Create:**
  - `api/src/__test__/template.test.ts`
  - `api/src/__test__/template.integration.test.ts`

**Test Coverage:**
- ✅ Get template by ID
- ✅ Get all templates
- ✅ Create template
- ✅ Update template
- ✅ Delete template
- ✅ Create board from template
- ✅ Save board as template
- ✅ System vs custom templates
- ✅ Category filtering
- ✅ JSONB structure validation
- ✅ Template instantiation accuracy

#### 5.2 Reports
- **Endpoints:** 5
- **Priority:** Medium
- **Test Types:** Unit + Integration
- **Estimated Tests:** 25-30
- **Files to Create:**
  - `api/src/__test__/report.test.ts`
  - `api/src/__test__/report.integration.test.ts`

**Test Coverage:**
- ✅ Board report (CSV)
- ✅ Time tracking report (CSV)
- ✅ Sprint report (CSV)
- ✅ User activity report (CSV)
- ✅ Calendar export (iCal)
- ✅ CSV format validation
- ✅ iCal format validation
- ✅ Data accuracy
- ✅ Empty data handling
- ✅ Large dataset handling

#### 5.3 Dashboard Layouts
- **Endpoints:** 6
- **Priority:** Low
- **Test Types:** Unit + Integration
- **Estimated Tests:** 25-30
- **Files to Create:**
  - `api/src/__test__/dashboard-layout.test.ts`
  - `api/src/__test__/dashboard-layout.integration.test.ts`

**Test Coverage:**
- ✅ Get all layouts
- ✅ Get default layout
- ✅ Get layout by ID
- ✅ Create layout
- ✅ Update layout
- ✅ Delete layout
- ✅ Default layout enforcement (one per user)
- ✅ JSONB widget validation
- ✅ User-specific layouts

**Phase 5 Deliverables:**
- 85-100 new tests
- 6 new test files
- Coverage: Templates (85%+), Reports (85%+), Dashboard Layouts (80%+)

---

### Phase 6: Real-time Features (CRITICAL BUT COMPLEX)
**Duration:** 5-6 days
**Goal:** Test WebSocket events and real-time communication

#### 6.1 WebSocket Events
- **Events:** 12 (bidirectional)
- **Priority:** High (critical feature, untested)
- **Test Types:** Integration + E2E
- **Estimated Tests:** 50-60
- **Files to Create:**
  - `api/src/__test__/websocket.test.ts`
  - `api/src/__test__/websocket.integration.test.ts`

**Test Coverage:**

**Client → Server:**
- ✅ `board:join` - Join board room
- ✅ `board:leave` - Leave board room
- ✅ Authorization on join ⚠️ SECURITY
- ✅ Invalid board ID handling
- ✅ Reconnection handling

**Server → Client:**
- ✅ `board:updated` - Board changed event
- ✅ `board:deleted` - Board deleted event
- ✅ `board:presence` - User presence updates
- ✅ `list:created` - New list event
- ✅ `list:updated` - List changed event
- ✅ `list:moved` - List reordered event
- ✅ `list:deleted` - List deleted event
- ✅ `card:created` - New card event
- ✅ `card:updated` - Card changed event
- ✅ `card:moved` - Card moved event
- ✅ `card:deleted` - Card deleted event

**Infrastructure:**
- ✅ Room management
- ✅ Presence tracking
- ✅ Rate limiting (100 events/min)
- ✅ Connection/disconnection handling
- ✅ Multiple client simulation
- ✅ Event ordering
- ✅ Payload validation
- ✅ Error broadcasting

**Phase 6 Deliverables:**
- 50-60 new tests
- 2 new test files
- Coverage: WebSocket (90%+)

---

## Testing Best Practices

### 1. Test Structure
```typescript
describe('ModuleName', () => {
  let service: ModuleService
  let repository: jest.Mocked<ModuleRepository>

  beforeEach(() => {
    // Setup mocks
    repository = new MockedRepository() as jest.Mocked<ModuleRepository>
    service = new ModuleService()
    service['repository'] = repository
  })

  describe('methodName', () => {
    it('should handle success case', async () => {
      // Arrange
      const input = { /* test data */ }
      repository.method.mockResolvedValue(expectedOutput)

      // Act
      const result = await service.method(input)

      // Assert
      expect(result).toEqual(expectedOutput)
      expect(repository.method).toHaveBeenCalledWith(input)
    })

    it('should handle error case', async () => {
      // Arrange
      repository.method.mockRejectedValue(new Error('Error'))

      // Act & Assert
      await expect(service.method(input)).rejects.toThrow('Error')
    })
  })
})
```

### 2. Integration Test Pattern
```typescript
describe('Module Integration Tests', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await bootstrap()
    // Run migrations
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
      .send({ name: 'Test' })
      .expect(201)

    expect(response.body).toMatchObject({
      name: 'Test',
      id: expect.any(String)
    })
  })
})
```

### 3. WebSocket Test Pattern
```typescript
import { io as ioClient } from 'socket.io-client'

describe('WebSocket Events', () => {
  let serverSocket: Server
  let clientSocket: Socket

  beforeEach((done) => {
    serverSocket = io(app.server)
    clientSocket = ioClient('http://localhost:4000')
    clientSocket.on('connect', done)
  })

  afterEach(() => {
    clientSocket.close()
    serverSocket.close()
  })

  it('should broadcast card:created event', (done) => {
    clientSocket.on('card:created', (data) => {
      expect(data.title).toBe('Test Card')
      done()
    })

    // Trigger server event
    serverSocket.emit('card:created', { title: 'Test Card' })
  })
})
```

---

## Summary Timeline

| Phase | Duration | Tests | Files | Priority | Features |
|-------|----------|-------|-------|----------|----------|
| **Phase 1** | 3-4 days | 100-115 | 6 | CRITICAL | Profiles, Bulk Ops, Attachments |
| **Phase 2** | 4-5 days | 150-170 | 8 | HIGH | Labels, Checklists, Comments, Assignees |
| **Phase 3** | 3-4 days | 70-80 | 4 | MEDIUM | Activities, Time Tracking |
| **Phase 4** | 4-5 days | 95-105 | 4 | MEDIUM | Sprints, Analytics |
| **Phase 5** | 3-4 days | 85-100 | 6 | LOW | Templates, Reports, Dashboards |
| **Phase 6** | 5-6 days | 50-60 | 2 | CRITICAL | WebSocket Events |
| **TOTAL** | 22-28 days | 550-630 | 30 | - | All Features |

---

## Expected Outcomes

### Test Coverage Improvement
- **Before:** 28.5% (6/21 modules, ~1,268 test lines)
- **After:** 85%+ (21/21 modules, ~1,900 test lines)
- **Increase:** +600% more test lines

### Quality Improvements
- ✅ All critical paths tested
- ✅ Security vulnerabilities caught early
- ✅ Edge cases covered
- ✅ Regression prevention
- ✅ Confidence in refactoring
- ✅ Documentation via tests

### Risk Mitigation
- ✅ Bulk operations verified (currently untested!)
- ✅ File upload security validated
- ✅ WebSocket events verified
- ✅ Business logic validated
- ✅ Data integrity ensured

---

## Execution Approach

### Parallel Execution (Recommended)
Some phases can be executed in parallel:
- **Phase 1 + Phase 3** (different modules)
- **Phase 2 + Phase 4** (different modules)
- **Phase 5** (independent)
- **Phase 6** (requires most phases complete)

### Sequential Execution (Conservative)
Execute phases 1-6 in order for maximum stability.

---

## Next Steps

1. **Review and approve this plan**
2. **Choose execution approach** (parallel vs sequential)
3. **Start with Phase 1** (Critical features)
4. **Create phase-specific documents** as work progresses
5. **Update features.md** after each phase
6. **Track progress** with phase-N-wip.md documents

---

## Questions for Consideration

1. **Priority:** Should we focus on critical features first (Phase 1, 6) or go sequential?
2. **Scope:** Any specific features more urgent than others?
3. **Timeline:** Is 22-28 days acceptable, or should we compress certain phases?
4. **Resources:** Will this be worked on by one developer or can it be parallelized?
5. **Environment:** Do we need separate test database setup documented?

---

## Notes

- This plan assumes Jest is properly configured (it is)
- Each phase will have its own detailed phase document (phase-N.md)
- Test files follow existing patterns from oauth.test.ts and card.test.ts
- Integration tests require test database setup
- WebSocket tests may require additional tooling (socket.io-client)
- All tests should follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies, use real database for integration tests

---

**Status:** ✅ Plan Created - Ready for Review
**Next:** Get approval and begin Phase 1
