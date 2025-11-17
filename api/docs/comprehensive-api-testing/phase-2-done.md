# API Testing - Phase 2: Card Detail Features

**Status:** Planned
**Created:** 2025-11-17
**Priority:** MEDIUM-HIGH
**Duration Estimate:** 4-5 days

---

## Overview

Phase 2 focuses on testing card-related detail features that enhance card functionality. These modules provide rich interaction capabilities for cards including labeling, task tracking, commenting, and user assignment.

---

## Goals

- ✅ Complete testing for all card detail features
- ✅ Achieve 85%+ coverage for all modules
- ✅ Validate complex queries (joins, counts, filtering)
- ✅ Test duplicate prevention mechanisms
- ✅ Verify cascading behaviors

---

## Modules to Test

### 1. Labels
**Priority:** Medium-High
**Current Status:** ❌ 0 tests
**Endpoints:** 10
**Test Goal:** 90%+ coverage

| Endpoint | Method | Status | Priority |
|----------|--------|--------|----------|
| `/labels` | POST | ❌ Not tested | High |
| `/labels/:id` | GET | ❌ Not tested | Medium |
| `/labels/:id` | PUT | ❌ Not tested | Medium |
| `/labels/:id` | DELETE | ❌ Not tested | Medium |
| `/labels/board/:board_id` | GET | ❌ Not tested | High |
| `/labels/board/:board_id/with-counts` | GET | ❌ Not tested | Medium |
| `/cards/:card_id/labels` | POST | ❌ Not tested | High |
| `/cards/:card_id/labels/:label_id` | DELETE | ❌ Not tested | High |
| `/cards/:card_id/labels` | GET | ❌ Not tested | High |
| `/labels/:label_id/cards` | GET | ❌ Not tested | Medium |

**Estimated Tests:** 45-50 tests

**Key Features to Test:**
- Label CRUD operations
- Color validation
- Name validation (length, uniqueness per board)
- Assigning labels to cards
- Removing labels from cards
- Getting cards by label
- Label counts per board
- Duplicate prevention
- Cascading deletes

---

### 2. Checklists
**Priority:** Medium
**Current Status:** ❌ 0 tests
**Endpoints:** 9
**Test Goal:** 85%+ coverage

| Endpoint | Method | Status | Priority |
|----------|--------|--------|----------|
| `/checklist-items` | POST | ❌ Not tested | High |
| `/checklist-items/:id` | GET | ❌ Not tested | Medium |
| `/checklist-items/:id` | PUT | ❌ Not tested | High |
| `/checklist-items/:id` | DELETE | ❌ Not tested | Medium |
| `/checklist-items/card/:card_id` | GET | ❌ Not tested | High |
| `/checklist-items/:id/toggle` | PATCH | ❌ Not tested | High |
| `/checklist-items/card/:card_id/progress` | GET | ❌ Not tested | Medium |
| `/checklist-items/card/:card_id/with-progress` | GET | ❌ Not tested | Medium |
| `/checklist-items/card/:card_id/reorder` | PUT | ❌ Not tested | Medium |

**Estimated Tests:** 40-45 tests

**Key Features to Test:**
- Checklist item CRUD operations
- Toggle completion status
- Progress calculation (% complete)
- Ordering/reordering items
- Title validation
- Getting items with progress
- Cascading deletes

---

### 3. Comments
**Priority:** Medium
**Current Status:** ❌ 0 tests
**Endpoints:** 9
**Test Goal:** 85%+ coverage

| Endpoint | Method | Status | Priority |
|----------|--------|--------|----------|
| `/comments` | POST | ❌ Not tested | High |
| `/comments/:id` | GET | ❌ Not tested | Medium |
| `/comments/:id` | PUT | ❌ Not tested | High |
| `/comments/:id` | DELETE | ❌ Not tested | Medium |
| `/comments/card/:card_id` | GET | ❌ Not tested | High |
| `/comments/card/:card_id/with-users` | GET | ❌ Not tested | High |
| `/comments/:parent_id/replies` | GET | ❌ Not tested | Medium |
| `/comments/card/:card_id/threaded` | GET | ❌ Not tested | Medium |
| `/comments/card/:card_id/count` | GET | ❌ Not tested | Low |

**Estimated Tests:** 40-45 tests

**Key Features to Test:**
- Comment CRUD operations
- User joins (author information)
- Threading (parent-child relationships)
- Replies to comments
- Threaded view (nested structure)
- Comment count
- Authorization (edit own comments only)
- Content validation
- Pagination

---

### 4. Assignees
**Priority:** Medium
**Current Status:** ❌ 0 tests
**Endpoints:** 5
**Test Goal:** 90%+ coverage

| Endpoint | Method | Status | Priority |
|----------|--------|--------|----------|
| `/cards/:card_id/assignees` | POST | ❌ Not tested | High |
| `/cards/:card_id/assignees/:user_id` | DELETE | ❌ Not tested | High |
| `/cards/:card_id/assignees` | GET | ❌ Not tested | High |
| `/cards/:card_id/assignees/:user_id/check` | GET | ❌ Not tested | Low |
| `/users/:user_id/assigned-cards` | GET | ❌ Not tested | Medium |

**Estimated Tests:** 25-30 tests

**Key Features to Test:**
- Add assignee to card
- Remove assignee from card
- Get all assignees for card
- Check if user is assigned
- Get user's assigned cards
- Duplicate assignment prevention
- User/card validation
- User information joins

---

## Implementation Order

1. **Labels** (Day 1) - Most complex, sets patterns
2. **Assignees** (Day 2) - Simpler, builds confidence
3. **Checklists** (Day 3) - Progress calculation logic
4. **Comments** (Day 4-5) - Threading complexity

---

## Testing Strategy

### Unit Tests (Service Layer)
- Mock repository methods
- Test business logic
- Validate error handling
- Test edge cases

### Integration Tests (Optional)
- Full API endpoint tests
- Database interactions
- Join operations
- Mark as `.skip` for future work

---

## Common Test Patterns

### CRUD Pattern
```typescript
describe('create', () => {
  it('should create with valid data')
  it('should validate required fields')
  it('should handle duplicates')
  it('should handle database errors')
})

describe('read', () => {
  it('should return when found')
  it('should return null/undefined when not found')
  it('should include related data (joins)')
})

describe('update', () => {
  it('should update with valid data')
  it('should return undefined when not found')
  it('should validate input')
})

describe('delete', () => {
  it('should delete successfully')
  it('should return false when not found')
  it('should cascade to related records')
})
```

### Association Pattern (Labels, Assignees)
```typescript
describe('add association', () => {
  it('should add successfully')
  it('should prevent duplicates')
  it('should validate both IDs')
})

describe('remove association', () => {
  it('should remove successfully')
  it('should handle not found')
})

describe('list associations', () => {
  it('should return all')
  it('should return empty array')
  it('should include user/label details')
})
```

---

## Acceptance Criteria

### Phase 2 Complete When:
- ✅ All unit tests passing
- ✅ Coverage goals met:
  - Labels: 90%+
  - Checklists: 85%+
  - Comments: 85%+
  - Assignees: 90%+
- ✅ Complex queries tested (joins, counts)
- ✅ Duplicate prevention validated
- ✅ Cascading behaviors verified
- ✅ No test flakiness

---

## Expected Deliverables

### Test Files (8 new files)
1. `api/src/__test__/label.test.ts`
2. `api/src/__test__/label.integration.test.ts`
3. `api/src/__test__/checklist.test.ts`
4. `api/src/__test__/checklist.integration.test.ts`
5. `api/src/__test__/comment.test.ts`
6. `api/src/__test__/comment.integration.test.ts`
7. `api/src/__test__/assignee.test.ts`
8. `api/src/__test__/assignee.integration.test.ts`

### Test Count
- **Total:** 150-170 tests
- **Labels:** 45-50 tests
- **Checklists:** 40-45 tests
- **Comments:** 40-45 tests
- **Assignees:** 25-30 tests

---

## Success Metrics

### Quantitative
- ✅ 150-170 tests created
- ✅ 85%+ line coverage
- ✅ 80%+ branch coverage
- ✅ All tests passing
- ✅ Test execution < 60s

### Qualitative
- ✅ Tests are maintainable
- ✅ Tests document behavior
- ✅ Tests catch regressions
- ✅ Patterns from Phase 1 reused

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Complex threading logic (Comments) | Medium | Medium | Start simple, add complexity gradually |
| Progress calculation bugs (Checklists) | Low | Medium | Test edge cases (0%, 100%, partial) |
| Join query complexity | Medium | Low | Mock joins, test separately |
| Test execution time | Low | Medium | Run in parallel where possible |

---

## Time Breakdown

| Module | Estimated Time |
|--------|----------------|
| **Labels** | 1.5-2 days |
| - Unit tests (45 tests) | 6-8 hours |
| - Integration blueprints | 2-3 hours |
| **Assignees** | 1 day |
| - Unit tests (25 tests) | 4-5 hours |
| - Integration blueprints | 1-2 hours |
| **Checklists** | 1.5 days |
| - Unit tests (40 tests) | 6-7 hours |
| - Integration blueprints | 2 hours |
| **Comments** | 1.5-2 days |
| - Unit tests (40 tests) | 6-8 hours |
| - Integration blueprints | 2-3 hours |
| **TOTAL** | 5-6.5 days |

---

## Next Steps

1. Create `phase-2.md` plan document ✅
2. Rename to `phase-2-wip.md` when starting
3. Begin with Labels tests
4. Follow with Assignees
5. Then Checklists
6. Finish with Comments
7. Mark as `phase-2-done.md` when complete

---

**Status:** ✅ Phase 2 Planned - Ready to Begin
**Next:** Rename to `phase-2-wip.md` and start Labels tests
