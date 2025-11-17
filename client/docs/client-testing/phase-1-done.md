# Client Testing - Phase 1: Foundation & Testing Infrastructure Setup

**Status:** In Progress 🚧
**Created:** 2025-11-17
**Started:** 2025-11-17
**Assigned To:** Claude

---

## Overview

Phase 1 establishes the foundation for all client testing by setting up the testing infrastructure, creating reusable test utilities, and testing the most critical utility functions (especially dateUtils.ts which is used throughout the application).

---

## Goals

- [x] Create phase planning document
- [ ] Install and configure testing framework (Vitest + React Testing Library)
- [ ] Create reusable test utilities (custom render, mock data, MSW handlers)
- [ ] Write 40+ tests for utility functions
- [ ] Achieve 90%+ coverage on utilities
- [ ] Establish testing patterns for future phases

---

## Scope

### In Scope
- Testing infrastructure setup (Vitest, React Testing Library, MSW, JSDOM)
- Test configuration and environment setup
- Test utility creation (custom render with providers, mock data, MSW handlers)
- Unit tests for utility functions:
  - `lib/dateUtils.ts` (24 tests)
  - `utils/filterTasks.ts` (8 tests)
  - `lib/utils.ts` (4 tests)
  - `lib/responsive.ts` (4 tests - optional)
- Documentation of testing patterns

### Out of Scope
- Component tests (Phase 2+)
- Hook tests (Phase 2+)
- Integration tests (Phase 4+)
- E2E tests (Phase 8)

---

## Tasks

### 1. Testing Infrastructure Setup

#### 1.1 Install Dependencies
- [ ] Install Vitest (`vitest@^1.x`, `@vitest/ui@^1.x`)
- [ ] Install React Testing Library (`@testing-library/react@^14.x`, `@testing-library/jest-dom@^6.x`, `@testing-library/user-event@^14.x`)
- [ ] Install MSW (`msw@^2.x`)
- [ ] Install DOM environment (`jsdom@^23.x` or `happy-dom@^12.x`)
- [ ] Install faker for mock data (`@faker-js/faker@^8.x`)

#### 1.2 Configure Vitest
- [ ] Create `vitest.config.ts` in client root
- [ ] Configure test environment (jsdom/happy-dom)
- [ ] Set up TypeScript paths for tests
- [ ] Configure coverage thresholds
- [ ] Add test scripts to `package.json`

#### 1.3 Test Setup
- [ ] Create `client/src/__tests__/setup.ts` with global test setup
- [ ] Configure testing-library matchers
- [ ] Set up MSW server for API mocking

### 2. Test Utilities Creation

#### 2.1 Custom Render Utility
- [ ] Create `__tests__/utils/test-utils.tsx`
- [ ] Implement custom render function with all providers:
  - QueryClientProvider (React Query)
  - UserProvider (UserContext)
  - WebSocketProvider (WebSocketContext)
  - SearchProvider (SearchContext)
- [ ] Export re-exports from @testing-library/react

#### 2.2 Mock Data
- [ ] Create `__tests__/utils/mock-data.ts`
- [ ] Create mock factories for:
  - User
  - Organization
  - Board
  - List
  - Card
  - CardWithDetails
  - Comment
  - Label
  - ChecklistItem
  - Assignee
  - Attachment
  - Activity

#### 2.3 MSW Handlers
- [ ] Create `__tests__/utils/server-handlers.ts`
- [ ] Implement handlers for core API endpoints:
  - Auth endpoints
  - Board endpoints
  - List endpoints
  - Card endpoints
  - (More will be added in Phase 2)

#### 2.4 Test Helpers
- [ ] Create `__tests__/utils/test-helpers.ts`
- [ ] Implement common assertion helpers
- [ ] Implement date mocking utilities
- [ ] Implement localStorage mocking utilities

### 3. Utility Function Tests

#### 3.1 dateUtils.ts Tests (24 test cases)
- [ ] **Formatting Functions (6 tests)**
  - formatDueDate()
  - formatDueDateDisplay()
  - formatDueDateShort()
  - formatRelativeTime()
  - formatTimestamp()
  - formatDuration()

- [ ] **Comparison Functions (8 tests)**
  - isDueToday()
  - isDueTomorrow()
  - isDueThisWeek()
  - isDueNextWeek()
  - isOverdue()
  - isPastDue()
  - isWithinRange()
  - compareDueDates()

- [ ] **Calculation Functions (6 tests)**
  - getDaysUntilDue()
  - getHoursUntilDue()
  - getRelativeTime()
  - addDays()
  - addWeeks()
  - addMonths()

- [ ] **Status Helpers (4 tests)**
  - getDueDateStatus()
  - getDueDateColor()
  - getDueDateBadgeVariant()
  - getQuickDatePresets()

#### 3.2 filterTasks.ts Tests (8 test cases)
- [ ] Filter by status (todo, in_progress, done)
- [ ] Filter by priority (low, medium, high, critical)
- [ ] Filter by due date (overdue, today, this week, none)
- [ ] Filter by assignee
- [ ] Filter by label
- [ ] Combined filters (multiple criteria)
- [ ] Sort tasks (by due date, priority, created, title)
- [ ] Empty filter state (return all tasks)

#### 3.3 lib/utils.ts Tests (4 test cases)
- [ ] `cn()` merges classes correctly
- [ ] `cn()` handles conditional classes
- [ ] `cn()` handles Tailwind conflicts (twMerge)
- [ ] `cn()` handles empty/undefined inputs

#### 3.4 lib/responsive.ts Tests (Optional - 4 test cases)
- [ ] Responsive breakpoint detection
- [ ] Mobile detection
- [ ] Tablet detection
- [ ] Desktop detection

---

## Technical Approach

### Testing Stack
```json
{
  "vitest": "^1.x",
  "@vitest/ui": "^1.x",
  "@testing-library/react": "^14.x",
  "@testing-library/jest-dom": "^6.x",
  "@testing-library/user-event": "^14.x",
  "jsdom": "^23.x",
  "msw": "^2.x",
  "@faker-js/faker": "^8.x"
}
```

### Test Organization
```
client/src/
└── __tests__/
    ├── setup.ts                    # Global test setup
    ├── utils/
    │   ├── test-utils.tsx          # Custom render
    │   ├── mock-data.ts            # Fixture data
    │   ├── server-handlers.ts      # MSW handlers
    │   └── test-helpers.ts         # Common helpers
    │
    └── unit/
        └── utils/
            ├── dateUtils.test.ts   # 24 tests
            ├── filterTasks.test.ts # 8 tests
            └── utils.test.ts       # 4 tests
```

### Vitest Configuration Pattern
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/__tests__/'],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Custom Render Pattern
```typescript
// __tests__/utils/test-utils.tsx
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '@/contexts/UserContext';
import { WebSocketProvider } from '@/contexts/WebSocketContext';
import { SearchProvider } from '@/contexts/SearchContext';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

export function createWrapper() {
  const queryClient = createTestQueryClient();

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <WebSocketProvider>
            <SearchProvider>
              {children}
            </SearchProvider>
          </WebSocketProvider>
        </UserProvider>
      </QueryClientProvider>
    );
  };
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: createWrapper(), ...options });
}

// Re-export everything
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
```

---

## Dependencies

### Package Dependencies
- Vite build system (already installed)
- React 18.3.1 (already installed)
- TypeScript 5.6.2 (already installed)

### Knowledge Dependencies
- None (this is the foundation phase)

---

## Acceptance Criteria

- [ ] All testing dependencies installed successfully
- [ ] `npm test` runs tests with Vitest
- [ ] `npm run test:coverage` generates coverage report
- [ ] `npm run test:ui` opens Vitest UI
- [ ] Custom render utility works with all providers
- [ ] MSW successfully mocks API calls
- [ ] 40+ utility tests written and passing
- [ ] 90%+ coverage on dateUtils.ts
- [ ] 90%+ coverage on filterTasks.ts
- [ ] 90%+ coverage on lib/utils.ts
- [ ] Test patterns documented in this file
- [ ] Zero console errors/warnings in tests

---

## Testing Plan

### dateUtils.ts Testing Strategy
- **Mock Luxon DateTime.now()** for consistent test results
- **Test all edge cases:**
  - Past dates (overdue)
  - Current date (today)
  - Future dates (upcoming)
  - Null/undefined inputs
  - Invalid date formats
- **Test timezone handling** (use fixed timezone in tests)
- **Test formatting consistency** across different date inputs

### filterTasks.ts Testing Strategy
- **Test with realistic mock data** (boards, cards, lists)
- **Test filter combinations** (status + priority + due date)
- **Test sorting stability** (consistent ordering)
- **Test edge cases:**
  - Empty task list
  - All tasks filtered out
  - No filters applied (return all)

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Luxon date mocking is complex | Medium | High | Use `vi.setSystemTime()` and Luxon's `Settings.now` |
| MSW setup fails with Vite | Medium | Low | Use MSW v2 which has better Vite support |
| TypeScript path resolution in tests | Low | Medium | Configure Vitest resolve.alias to match tsconfig |
| Test environment memory leaks | Low | Low | Use `afterEach(cleanup)` from RTL |

---

## Notes

### Why Start with Utilities?
1. **High ROI** - dateUtils is used in 20+ components/hooks
2. **No dependencies** - Can test in isolation
3. **Foundation** - Establishes testing patterns
4. **Quick wins** - Build confidence and momentum

### Testing Philosophy
- **Test behavior, not implementation**
- **Write tests that give confidence**
- **Keep tests simple and readable**
- **Mock external dependencies (API, localStorage, dates)**
- **Avoid testing library internals (React Query, Zustand)**

---

## Related Files

### Files to Create
- `vitest.config.ts`
- `client/src/__tests__/setup.ts`
- `client/src/__tests__/utils/test-utils.tsx`
- `client/src/__tests__/utils/mock-data.ts`
- `client/src/__tests__/utils/server-handlers.ts`
- `client/src/__tests__/utils/test-helpers.ts`
- `client/src/__tests__/unit/utils/dateUtils.test.ts`
- `client/src/__tests__/unit/utils/filterTasks.test.ts`
- `client/src/__tests__/unit/utils/utils.test.ts`

### Files to Modify
- `client/package.json` (add dependencies and scripts)

### Files to Read
- `client/src/lib/dateUtils.ts` (source to test)
- `client/src/utils/filterTasks.ts` (source to test)
- `client/src/lib/utils.ts` (source to test)

---

## Progress Tracking

### Completed
- ✅ Phase planning document created
- ✅ Task breakdown defined

### In Progress
- 🚧 Installing testing dependencies

### Blocked
- None

---

## Next Steps

After Phase 1 completion:
1. Rename this file to `phase-1-done.md`
2. Update `client/docs/features.md` with test status
3. Create `phase-2.md` for Core Business Logic testing
4. Begin Phase 2 implementation

---

**Estimated Completion:** 1-2 days from start
**Current Status:** 🚧 In Progress
