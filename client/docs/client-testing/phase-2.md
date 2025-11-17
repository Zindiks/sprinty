# Client Testing - Phase 2: Core Business Logic - Hooks

**Status:** In Progress 🚧
**Created:** 2025-11-17
**Started:** 2025-11-17
**Assigned To:** Claude

---

## Overview

Phase 2 focuses on testing the core business logic hooks that power the application's main features: board management, list management, and card management. These hooks use React Query for server state management and implement optimistic updates for better UX.

---

## Goals

- [ ] Test all board management operations (useBoards)
- [ ] Test all list management operations (useLists)
- [ ] Test all card management operations (useCards, useCardDetails)
- [ ] Test card filtering logic (useCardFilters)
- [ ] Test bulk operations (useBulkActions)
- [ ] Achieve 80%+ coverage on all tested hooks
- [ ] Establish hook testing patterns with MSW
- [ ] Document optimistic update testing strategies

---

## Scope

### In Scope
- Board CRUD operations (useBoards)
- List CRUD operations (useLists)
- Card CRUD operations (useCards, useCardDetails)
- Card filtering and sorting (useCardFilters)
- Bulk card operations (useBulkActions)
- React Query integration testing
- MSW API mocking
- Loading states
- Error handling
- Cache invalidation
- Optimistic updates

### Out of Scope
- Component integration tests (Phase 4+)
- Real-time WebSocket features (Phase 8)
- Context providers (Phase 3)
- Advanced features (Phase 5+)

---

## Tasks

### 1. Board Management Hook (useBoards)

#### 1.1 Read and Analyze Hook
- [ ] Read `src/hooks/useBoards.ts`
- [ ] Identify all queries and mutations
- [ ] Document API endpoints used
- [ ] Understand cache invalidation strategy

#### 1.2 Write Tests (8 tests)
- [ ] Test `GetBoards` query - loading state
- [ ] Test `GetBoards` query - success with data
- [ ] Test `GetBoards` query - error handling
- [ ] Test `GetBoard` query - single board fetch
- [ ] Test `CreateBoard` mutation - success
- [ ] Test `UpdateBoard` mutation - success
- [ ] Test `DeleteBoard` mutation - success
- [ ] Test cache invalidation after mutations

---

### 2. List Management Hook (useLists)

#### 2.1 Read and Analyze Hook
- [ ] Read `src/hooks/useLists.ts`
- [ ] Identify all queries and mutations
- [ ] Document API endpoints used

#### 2.2 Write Tests (10 tests)
- [ ] Test `GetLists` query - success
- [ ] Test `CreateList` mutation - success
- [ ] Test `UpdateListTitle` mutation - success
- [ ] Test `DeleteList` mutation - success
- [ ] Test `ReorderLists` mutation - success
- [ ] Test `CopyList` mutation - success
- [ ] Test optimistic list creation
- [ ] Test optimistic list update
- [ ] Test error rollback on failed mutation
- [ ] Test cache synchronization

---

### 3. Card Management Hooks

#### 3.1 useCards Hook (12 tests)
- [ ] Read `src/hooks/useCards.ts`
- [ ] Test `GetCards` query - success
- [ ] Test `CreateCard` mutation - quick add
- [ ] Test `CreateCard` mutation - full form
- [ ] Test `UpdateCard` mutation - details
- [ ] Test `UpdateCardPosition` mutation - drag & drop
- [ ] Test `DeleteCard` mutation - success
- [ ] Test `ArchiveCard` mutation - success
- [ ] Test `UnarchiveCard` mutation - success
- [ ] Test optimistic card creation
- [ ] Test optimistic position update
- [ ] Test error handling with toast
- [ ] Test cache invalidation

#### 3.2 useCardDetails Hook (6 tests)
- [ ] Read `src/hooks/useCardDetails.ts`
- [ ] Test fetch card with all relations
- [ ] Test loading state
- [ ] Test error state
- [ ] Test cache integration with useCards
- [ ] Test refetch on updates
- [ ] Test stale data handling

---

### 4. Card Filtering Hook (useCardFilters)

#### 4.1 Write Tests (18 tests)
- [ ] Read `src/hooks/useCardFilters.ts`
- [ ] Test due date filter - all
- [ ] Test due date filter - overdue
- [ ] Test due date filter - today
- [ ] Test due date filter - this week
- [ ] Test due date filter - none
- [ ] Test priority filter - all levels
- [ ] Test priority filter - critical
- [ ] Test priority filter - high
- [ ] Test priority filter - medium
- [ ] Test priority filter - low
- [ ] Test sort by due date (asc/desc)
- [ ] Test sort by priority
- [ ] Test sort by created date
- [ ] Test sort by title
- [ ] Test combined filters + sort
- [ ] Test filter statistics calculation
- [ ] Test clear filters
- [ ] Test filter state persistence

---

### 5. Bulk Operations Hook (useBulkActions)

#### 5.1 Write Tests (18 tests)
- [ ] Read `src/hooks/useBulkActions.ts`
- [ ] Test bulk move - success (all cards moved)
- [ ] Test bulk move - partial failure
- [ ] Test bulk move - complete failure
- [ ] Test bulk assign - success
- [ ] Test bulk assign - partial failure
- [ ] Test bulk assign - complete failure
- [ ] Test bulk label - success
- [ ] Test bulk label - partial failure
- [ ] Test bulk label - complete failure
- [ ] Test bulk due date - success
- [ ] Test bulk due date - partial failure
- [ ] Test bulk due date - complete failure
- [ ] Test bulk archive - success
- [ ] Test bulk archive - error handling
- [ ] Test bulk delete - success with confirmation
- [ ] Test bulk delete - cancel confirmation
- [ ] Test bulk delete - error handling
- [ ] Test cache invalidation after bulk ops

---

## Technical Approach

### Hook Testing Pattern

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/__tests__/utils/test-utils';
import { useBoards } from '@/hooks/useBoards';

describe('useBoards', () => {
  it('should fetch boards successfully', async () => {
    const { result } = renderHook(() => useBoards('org-123'), {
      wrapper: createWrapper(),
    });

    // Initial loading state
    expect(result.current.isLoading).toBe(true);

    // Wait for data
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify data
    expect(result.current.boards).toHaveLength(3);
  });
});
```

### MSW Handler Pattern

```typescript
// __tests__/utils/server-handlers.ts
import { http, HttpResponse } from 'msw';
import { mockBoards } from './mock-data';

export const handlers = [
  // GET boards
  http.get('http://localhost:3001/api/v1/boards/:orgId/all', () => {
    return HttpResponse.json(mockBoards(3));
  }),

  // POST create board
  http.post('http://localhost:3001/api/v1/boards', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(mockBoard(body));
  }),

  // DELETE board
  http.delete('http://localhost:3001/api/v1/boards/:id', () => {
    return HttpResponse.json({ success: true });
  }),
];
```

### Testing Optimistic Updates

```typescript
it('should optimistically update card position', async () => {
  const { result } = renderHook(() => useCards('list-123'), {
    wrapper: createWrapper(),
  });

  await waitFor(() => {
    expect(result.current.cards).toBeDefined();
  });

  const originalCards = result.current.cards;

  // Trigger optimistic update
  act(() => {
    result.current.updatePosition('card-1', { order: 5 });
  });

  // Should immediately reflect in UI (before API response)
  expect(result.current.cards[0].order).toBe(5);

  // Wait for API confirmation
  await waitFor(() => {
    expect(result.current.isPending).toBe(false);
  });

  // Verify final state
  expect(result.current.cards[0].order).toBe(5);
});
```

### Testing Error Rollback

```typescript
it('should rollback on mutation error', async () => {
  // Mock API error
  server.use(
    http.post('http://localhost:3001/api/v1/cards', () => {
      return HttpResponse.json({ error: 'Failed' }, { status: 500 });
    })
  );

  const { result } = renderHook(() => useCards('list-123'), {
    wrapper: createWrapper(),
  });

  const originalLength = result.current.cards?.length || 0;

  // Attempt to create card (will fail)
  act(() => {
    result.current.createCard({ title: 'New Card' });
  });

  // Wait for error
  await waitFor(() => {
    expect(result.current.isError).toBe(true);
  });

  // Should rollback to original state
  expect(result.current.cards).toHaveLength(originalLength);
});
```

---

## MSW Server Setup

### Setup File Enhancement

```typescript
// __tests__/setup.ts
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers } from './utils/server-handlers';

// Setup MSW server
export const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
```

---

## Dependencies

### Technical Dependencies
- Phase 1 test utilities ✅
- MSW server setup (to be created)
- Mock data factories ✅
- React Query test utilities ✅

### Knowledge Dependencies
- React Query testing patterns
- MSW request handling
- Optimistic update patterns
- Cache invalidation strategies

---

## Acceptance Criteria

- [ ] All 72+ hook tests written and passing
- [ ] 80%+ coverage on all tested hooks
- [ ] MSW handlers created for all API endpoints
- [ ] Optimistic updates tested and working
- [ ] Error handling verified with rollback
- [ ] Cache invalidation tested
- [ ] Loading states tested
- [ ] Toast notifications tested (mocked)
- [ ] No console errors/warnings
- [ ] All tests run in < 10 seconds

---

## Expected Test Count

| Hook | Test Count | Priority |
|------|------------|----------|
| useBoards | 8 | High |
| useLists | 10 | High |
| useCards | 12 | High |
| useCardDetails | 6 | High |
| useCardFilters | 18 | High |
| useBulkActions | 18 | High |
| **TOTAL** | **72** | - |

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| MSW setup complexity | Medium | Medium | Use existing MSW v2 examples, test incrementally |
| React Query cache issues | High | Low | Use createTestQueryClient() with no cache |
| Optimistic updates hard to test | Medium | Medium | Use waitFor() and check intermediate states |
| API endpoint discovery | Low | Low | Read existing hook code for endpoints |

---

## Progress Tracking

### Completed
- ✅ Phase 2 planning document created

### In Progress
- 🚧 Reading and analyzing useBoards hook

### Blocked
- None

---

## Notes

### Testing Strategy
- Test ONE hook at a time
- Write MSW handlers incrementally as needed
- Start with simplest hooks (queries only) before complex ones (mutations)
- Focus on happy path first, then error cases

### Key Patterns to Test
1. **Loading states** - Initial render should show isLoading
2. **Success states** - Data should populate after API response
3. **Error states** - Errors should be handled gracefully
4. **Mutations** - Should trigger, succeed, and invalidate cache
5. **Optimistic updates** - UI should update immediately
6. **Rollback** - Failed mutations should revert to previous state

---

## Next Steps

After Phase 2 completion:
1. Rename to `phase-2-done.md`
2. Update features.md with test coverage
3. Create `phase-3.md` for State Management testing
4. Commit and push all changes

---

**Current Status:** 🚧 In Progress - Setting up MSW and starting useBoards tests
**Estimated Completion:** 3-4 days from start
