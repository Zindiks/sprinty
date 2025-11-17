# Client Testing - Master Plan

**Status:** Planned
**Created:** 2025-11-17
**Assigned To:** Claude

---

## Executive Summary

This document outlines a comprehensive testing strategy for the Sprinty client application, covering all **24 feature categories** and **150+ individual features**. The plan is organized into **8 phases** that progressively build test coverage from foundational utilities to complex end-to-end workflows.

### Current Status
- **Implementation:** 100% (150+ features fully implemented)
- **Test Coverage:** 0% (zero tests exist)
- **Testing Framework:** None installed

### Goals
- Achieve **75%+ overall test coverage**
- Create **~365 comprehensive test cases**
- Establish **testing infrastructure** from scratch
- Document **testing patterns** for future development

---

## Testing Infrastructure

### Recommended Test Stack

```json
{
  "devDependencies": {
    "vitest": "^1.x",
    "@vitest/ui": "^1.x",
    "@testing-library/react": "^14.x",
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/user-event": "^14.x",
    "jsdom": "^23.x",
    "msw": "^2.x",
    "@faker-js/faker": "^8.x",
    "happy-dom": "^12.x"
  }
}
```

**Why This Stack?**
- **Vitest:** Fast, Vite-native test runner (better than Jest for Vite projects)
- **React Testing Library:** Industry standard for React component testing
- **MSW:** Mock Service Worker for API mocking
- **JSDOM/Happy-DOM:** Lightweight DOM implementation for tests

---

## Phase Organization

The 24 feature categories are organized into 8 phases based on:
1. **Criticality** - Core business logic first
2. **Dependencies** - Foundation before advanced features
3. **Complexity** - Simple before complex
4. **ROI** - High-impact tests first

```
Phase 1: Foundation & Setup (1-2 days)
    ↓
Phase 2: Core Business Logic (3-4 days)
    ↓
Phase 3: State Management (2-3 days)
    ↓
Phase 4: Card Management & Collaboration (4-5 days)
    ↓
Phase 5: Advanced Features (3-4 days)
    ↓
Phase 6: Dashboard & Analytics (2-3 days)
    ↓
Phase 7: Search, Templates & Shortcuts (2-3 days)
    ↓
Phase 8: Real-time & Integration Tests (3-4 days)
```

**Total Estimated Time:** 20-28 days (3-4 weeks)

---

## Phase 1: Foundation & Testing Infrastructure Setup

**Duration:** 1-2 days
**Estimated Tests:** ~40 test cases
**Coverage Goal:** 90%+ for utilities

### Objectives
- Install and configure testing framework
- Create test utilities and helpers
- Test foundational utilities
- Establish testing patterns

### Feature Categories Covered
- **24. UI/UX Features** (partial - test utilities only)

### Tasks

#### 1.1 Testing Infrastructure Setup
- [ ] Install Vitest, React Testing Library, MSW, JSDOM
- [ ] Configure `vitest.config.ts`
- [ ] Set up test globals and environment
- [ ] Create `client/src/__tests__/setup.ts`
- [ ] Configure TypeScript paths for tests

#### 1.2 Test Utilities Creation
- [ ] Create `__tests__/utils/test-utils.tsx` (custom render with providers)
- [ ] Create `__tests__/utils/mock-data.ts` (fixture data)
- [ ] Create `__tests__/utils/server-handlers.ts` (MSW handlers)
- [ ] Create `__tests__/utils/test-helpers.ts` (common assertions)

#### 1.3 Utility Function Tests
- [ ] **dateUtils.ts** - 24 test cases
  - Formatting functions (6 tests)
  - Comparison functions (8 tests)
  - Calculation functions (6 tests)
  - Status helpers (4 tests)
- [ ] **filterTasks.ts** - 8 test cases
  - Status filtering
  - Priority filtering
  - Due date filtering
  - Combined filters
- [ ] **lib/utils.ts** - 4 test cases
  - `cn()` class merging utility
- [ ] **lib/responsive.ts** - 4 test cases
  - Responsive utilities

### Deliverables
- ✅ Testing infrastructure fully configured
- ✅ Test utilities and helpers ready
- ✅ 40+ utility tests written and passing
- ✅ CI/CD integration (GitHub Actions)

### Files Created
- `vitest.config.ts`
- `client/src/__tests__/setup.ts`
- `client/src/__tests__/utils/test-utils.tsx`
- `client/src/__tests__/utils/mock-data.ts`
- `client/src/__tests__/utils/server-handlers.ts`
- `client/src/__tests__/unit/utils/dateUtils.test.ts`
- `client/src/__tests__/unit/utils/filterTasks.test.ts`
- `client/src/__tests__/unit/utils/utils.test.ts`

### Acceptance Criteria
- [ ] All tests run with `npm test`
- [ ] Coverage report generates with `npm run test:coverage`
- [ ] 90%+ coverage on utility functions
- [ ] Test utilities work with all providers
- [ ] MSW mocking works for API calls

---

## Phase 2: Core Business Logic - Hooks

**Duration:** 3-4 days
**Estimated Tests:** ~90 test cases
**Coverage Goal:** 80%+ for hooks

### Objectives
- Test all data-fetching hooks (React Query)
- Test business logic hooks (filtering, bulk operations)
- Establish hook testing patterns

### Feature Categories Covered
- **3. Board Management** (hooks)
- **4. List Management** (hooks)
- **5. Card Management - Basic Operations** (hooks)
- **6. Card Management - Advanced Features** (partial - filtering hooks)

### Tasks

#### 2.1 Board Management Hooks (8 tests)
- [ ] **useBoards.ts**
  - GET all boards (loading, success, error states)
  - GET single board
  - CREATE board
  - UPDATE board title
  - DELETE board
  - Organization filtering
  - Cache invalidation on mutations
  - Error handling with toast

#### 2.2 List Management Hooks (10 tests)
- [ ] **useLists.ts**
  - GET lists for board
  - CREATE list
  - UPDATE list title
  - DELETE list
  - Reorder lists
  - Copy list
  - Optimistic updates
  - Error rollback
  - Cache synchronization

#### 2.3 Card Management Hooks (24 tests)
- [ ] **useCards.ts** - 12 tests
  - GET cards for list
  - CREATE card (quick add)
  - UPDATE card details
  - UPDATE card position
  - DELETE card
  - Archive/unarchive card
  - Drag & drop integration
  - Optimistic updates
  - Error handling

- [ ] **useCardDetails.ts** - 6 tests
  - Fetch card with all relations
  - Loading states
  - Error states
  - Cache integration

- [ ] **useCardFilters.ts** - 18 tests
  - Due date filters (all, overdue, today, this week, none)
  - Priority filters (low, medium, high, critical)
  - Sort by due date (asc/desc)
  - Sort by priority
  - Sort by created date
  - Sort by title (alphabetical)
  - Combined filters + sort
  - Filter statistics calculation
  - Clear filters
  - Filter persistence

#### 2.4 Bulk Operations Hook (18 tests)
- [ ] **useBulkActions.ts**
  - Bulk move cards (3 tests: success, partial failure, complete failure)
  - Bulk assign users (3 tests)
  - Bulk add labels (3 tests)
  - Bulk set due dates (3 tests)
  - Bulk archive cards (3 tests)
  - Bulk delete cards (3 tests: with confirmation, cancel, error)

#### 2.5 Action Hook (6 tests)
- [ ] **useActions.ts**
  - Action orchestration
  - Action history
  - Undo/redo functionality

### Deliverables
- ✅ 90+ hook tests written and passing
- ✅ 80%+ coverage on all tested hooks
- ✅ Hook testing patterns documented
- ✅ MSW handlers for all API endpoints

### Files Created
- `__tests__/unit/hooks/useBoards.test.ts`
- `__tests__/unit/hooks/useLists.test.ts`
- `__tests__/unit/hooks/useCards.test.ts`
- `__tests__/unit/hooks/useCardDetails.test.ts`
- `__tests__/unit/hooks/useCardFilters.test.ts`
- `__tests__/unit/hooks/useBulkActions.test.ts`
- `__tests__/unit/hooks/useActions.test.ts`

### Acceptance Criteria
- [ ] All hook tests pass
- [ ] Optimistic updates are tested
- [ ] Error handling is verified
- [ ] Cache invalidation works correctly
- [ ] Loading states are tested

---

## Phase 3: State Management & Context

**Duration:** 2-3 days
**Estimated Tests:** ~50 test cases
**Coverage Goal:** 85%+ for stores/contexts

### Objectives
- Test all Zustand stores
- Test all React Context providers
- Verify state persistence (localStorage)
- Test state synchronization

### Feature Categories Covered
- **1. Authentication & User Management** (UserContext)
- **6. Card Management - Advanced Features** (Selection store)
- **17. Dashboard & Analytics** (Dashboard store, Layout store)
- **24. UI/UX Features** (Global store)

### Tasks

#### 3.1 Zustand Store Tests (40 tests)

##### useSelectionStore.ts (12 tests)
- [ ] Toggle card selection
- [ ] Select single card
- [ ] Deselect card
- [ ] Select range (Shift+Click logic)
- [ ] Select all cards
- [ ] Clear selection
- [ ] Selection mode toggle
- [ ] Last selected card tracking
- [ ] Set operations (add/remove from Set)
- [ ] Persistence

##### useDashboardStore.ts (15 tests)
- [ ] Set status filter
- [ ] Set priority filter
- [ ] Set due date filter
- [ ] Set selected boards
- [ ] Set search query
- [ ] Set sort by
- [ ] Set sort order
- [ ] Toggle "show only assigned to me"
- [ ] Get active filter count
- [ ] Reset all filters
- [ ] Filter persistence (localStorage)
- [ ] Multiple filter combinations
- [ ] Board multi-select

##### useLayoutStore.ts (10 tests)
- [ ] Add widget to layout
- [ ] Remove widget from layout
- [ ] Update widget position
- [ ] Reorder widgets
- [ ] Switch layout (current layout ID)
- [ ] Toggle edit mode
- [ ] Layout persistence (localStorage)
- [ ] Widget validation
- [ ] Max widget limit

##### useStore.tsx (3 tests)
- [ ] Set organization_id
- [ ] Set board_id
- [ ] Global state updates

#### 3.2 Context Provider Tests (10 tests)

##### UserContext.tsx (6 tests)
- [ ] Fetch user on mount
- [ ] User login flow
- [ ] User logout
- [ ] Refresh user data
- [ ] Loading states
- [ ] Error handling (unauthorized)

##### WebSocketContext.tsx (covered in Phase 8 - Real-time)

##### SearchContext.tsx (4 tests)
- [ ] Open search dialog
- [ ] Close search dialog
- [ ] Initial state
- [ ] Dialog state toggle

### Deliverables
- ✅ 50+ store/context tests written and passing
- ✅ 85%+ coverage on state management
- ✅ LocalStorage persistence verified
- ✅ State synchronization tested

### Files Created
- `__tests__/unit/stores/useSelectionStore.test.ts`
- `__tests__/unit/stores/useDashboardStore.test.ts`
- `__tests__/unit/stores/useLayoutStore.test.ts`
- `__tests__/unit/stores/useStore.test.ts`
- `__tests__/integration/contexts/UserContext.test.tsx`
- `__tests__/integration/contexts/SearchContext.test.tsx`

### Acceptance Criteria
- [ ] All store tests pass
- [ ] LocalStorage persistence works
- [ ] State updates trigger re-renders correctly
- [ ] Context providers work with test utilities

---

## Phase 4: Card Management & Collaboration

**Duration:** 4-5 days
**Estimated Tests:** ~80 test cases
**Coverage Goal:** 75%+ for components/hooks

### Objectives
- Test card collaboration features (comments, checklists, attachments, assignees, labels)
- Test card activity tracking
- Test bulk operations UI
- Verify optimistic updates

### Feature Categories Covered
- **7. Bulk Operations** (components)
- **8. Card Collaboration - Assignees**
- **9. Card Collaboration - Labels**
- **10. Card Collaboration - Checklists**
- **11. Card Collaboration - Comments**
- **12. Card Collaboration - Attachments**
- **13. Card Collaboration - Activity Tracking**

### Tasks

#### 4.1 Collaboration Hooks (50 tests)

##### useLabels.ts (10 tests)
- [ ] Fetch labels for board
- [ ] Create new label
- [ ] Update label (name, color)
- [ ] Delete label
- [ ] Add label to card
- [ ] Remove label from card
- [ ] Optimistic label creation
- [ ] Optimistic label assignment
- [ ] Error rollback
- [ ] Color validation

##### useComments.ts (12 tests)
- [ ] Fetch comments for card
- [ ] Add comment
- [ ] Edit own comment
- [ ] Delete own comment
- [ ] Reply to comment (threading)
- [ ] Comment sorting (newest/oldest)
- [ ] Optimistic comment add
- [ ] User attribution display
- [ ] Timestamp formatting
- [ ] Edit restrictions (own comments only)
- [ ] Rich text support
- [ ] Error handling

##### useChecklists.ts (10 tests)
- [ ] Fetch checklist items
- [ ] Add checklist item
- [ ] Toggle item completion
- [ ] Edit checklist item
- [ ] Delete checklist item
- [ ] Reorder items
- [ ] Progress calculation (3/5 complete)
- [ ] Optimistic toggle
- [ ] Progress bar updates
- [ ] Item validation

##### useAssignees.ts (8 tests)
- [ ] Fetch assignees for card
- [ ] Add assignee to card
- [ ] Remove assignee from card
- [ ] Multi-user assignment
- [ ] Avatar display logic
- [ ] User search/filter
- [ ] Optimistic updates
- [ ] Error handling

##### useAttachments.ts (10 tests)
- [ ] Fetch attachments for card
- [ ] Upload single file
- [ ] Upload multiple files
- [ ] Download attachment
- [ ] Delete attachment
- [ ] File type validation
- [ ] File size limits
- [ ] Metadata display (name, size, date)
- [ ] File type icons
- [ ] Error handling (upload failure)

#### 4.2 Activity Tracking (5 tests)
- [ ] **useActivities.ts**
  - Fetch activity log
  - Activity type filtering (14 types)
  - User attribution
  - Timestamp display
  - Pagination

#### 4.3 Bulk Operations Components (15 tests)
- [ ] **BulkActionsToolbar.tsx** (5 tests)
  - Toolbar visibility (shown when cards selected)
  - Action button rendering
  - Selected count display
  - Clear selection
  - Toolbar positioning

- [ ] **Bulk Action Components** (10 tests - 2 each)
  - BulkMoveAction.tsx
  - BulkAssignAction.tsx
  - BulkLabelAction.tsx
  - BulkDueDateAction.tsx
  - BulkArchiveAction.tsx

### Deliverables
- ✅ 80+ collaboration tests written
- ✅ 75%+ coverage on collaboration features
- ✅ Optimistic updates verified
- ✅ Component integration tested

### Files Created
- `__tests__/unit/hooks/useLabels.test.ts`
- `__tests__/unit/hooks/useComments.test.ts`
- `__tests__/unit/hooks/useChecklists.test.ts`
- `__tests__/unit/hooks/useAssignees.test.ts`
- `__tests__/unit/hooks/useAttachments.test.ts`
- `__tests__/unit/hooks/useActivities.test.ts`
- `__tests__/integration/components/BulkActionsToolbar.test.tsx`
- `__tests__/integration/components/BulkMoveAction.test.tsx`
- (+ 4 more bulk action component tests)

### Acceptance Criteria
- [ ] All collaboration features tested
- [ ] Optimistic updates work correctly
- [ ] Error handling verified
- [ ] Threading/nesting works (comments)
- [ ] File uploads tested (mock FormData)

---

## Phase 5: Advanced Features & Time Management

**Duration:** 3-4 days
**Estimated Tests:** ~60 test cases
**Coverage Goal:** 75%+ for features

### Objectives
- Test time tracking functionality
- Test reminders system
- Test calendar view
- Test filters & sorting UI

### Feature Categories Covered
- **16. Calendar View**
- **18. Filters & Sorting**
- **19. Time Tracking**
- **20. Reminders**

### Tasks

#### 5.1 Time Tracking (12 tests)
- [ ] **useTimeTracking.ts**
  - Log time on card
  - View time logs
  - Calculate time totals
  - Edit time log
  - Delete time log
  - User-specific tracking
  - Export time logs (CSV)
  - Time format validation
  - Negative time prevention
  - Time aggregation by user
  - Time aggregation by card
  - Date range filtering

#### 5.2 Reminders (10 tests)
- [ ] **useReminders.ts**
  - Set custom reminder
  - 24-hour before reminder
  - 1-hour before reminder
  - Custom time reminder
  - Edit reminder
  - Delete reminder
  - Reminder validation (future dates only)
  - Multiple reminders per card
  - Reminder notifications (WebSocket - partial)
  - Error handling

#### 5.3 Calendar View (15 tests)
- [ ] **CalendarView.tsx**
  - Month view rendering
  - Week view rendering
  - Day view rendering
  - Event display (cards with due dates)
  - Click event navigation
  - Drag & drop event (reschedule)
  - Event colors (priority-based)
  - Calendar navigation (prev/next month)
  - Export calendar (CSV/iCal)
  - Filter events by board
  - Loading states
  - Empty state (no due dates)
  - Event tooltip
  - Multi-day events
  - All-day events

#### 5.4 Filters & Sorting Components (23 tests)
- [ ] **FilterBar.tsx** (15 tests)
  - Due date filter dropdown
  - Priority filter dropdown
  - Status filter dropdown
  - Sort options dropdown
  - Filter combinations
  - Filter statistics display
  - Clear all filters button
  - Filter persistence
  - Filter badge indicators
  - Mobile responsive filters
  - Keyboard navigation
  - Filter validation
  - Empty filter state
  - Filter presets
  - Filter URL sync (query params)

- [ ] **Dashboard Filters** (8 tests)
  - Board selection filter
  - "Assigned to me" toggle
  - Search query input
  - Date range picker
  - Combined filter application
  - Filter reset
  - Filter state persistence
  - Filter count indicator

### Deliverables
- ✅ 60+ advanced feature tests written
- ✅ 75%+ coverage on time tracking, reminders, calendar
- ✅ Filter combinations tested thoroughly
- ✅ Calendar drag & drop verified

### Files Created
- `__tests__/unit/hooks/useTimeTracking.test.ts`
- `__tests__/unit/hooks/useReminders.test.ts`
- `__tests__/integration/components/CalendarView.test.tsx`
- `__tests__/integration/components/FilterBar.test.tsx`
- `__tests__/integration/components/DashboardFilters.test.tsx`

### Acceptance Criteria
- [ ] Time tracking calculations correct
- [ ] Calendar renders all view modes
- [ ] Filters apply correctly in combination
- [ ] Reminder validation works
- [ ] Calendar export generates valid files

---

## Phase 6: Dashboard & Analytics

**Duration:** 2-3 days
**Estimated Tests:** ~45 test cases
**Coverage Goal:** 70%+ for analytics

### Objectives
- Test analytics data hooks
- Test dashboard widgets
- Test customizable dashboard layout
- Verify chart rendering

### Feature Categories Covered
- **17. Dashboard & Analytics**

### Tasks

#### 6.1 Analytics Hooks (20 tests)
- [ ] **useAnalytics.ts** (20 tests - 2 per query)
  - Dashboard overview (personal stats)
  - Productivity trend (line chart data)
  - Boards overview (board statistics)
  - Weekly completion metrics
  - Monthly completion metrics
  - Velocity chart (sprint velocity)
  - Burndown chart (sprint burndown)
  - Overdue cards list
  - Upcoming due dates
  - Board performance metrics
  - Loading states for all queries
  - Error states for all queries
  - Data transformations
  - Date range filtering
  - Cache invalidation

#### 6.2 Dashboard Components (15 tests)
- [ ] **Dashboard.tsx** (5 tests)
  - Tab navigation (Overview, Custom, Trends, Boards, Sprint)
  - Tab content rendering
  - Initial data loading
  - Error boundary
  - Empty states

- [ ] **DashboardGrid.tsx** (10 tests)
  - Widget grid layout
  - Add widget to grid
  - Remove widget from grid
  - Drag & drop widget reordering
  - Widget resize
  - Edit mode toggle
  - Save layout
  - Load saved layout
  - Layout templates
  - Responsive grid (mobile)

#### 6.3 Analytics Widgets (10 tests - 2 each)
- [ ] **ProductivityTrendChart.tsx**
  - Chart renders with data
  - Empty state handling

- [ ] **VelocityChart.tsx**
  - Sprint velocity calculation
  - Chart rendering

- [ ] **BurndownChart.tsx**
  - Burndown calculation
  - Ideal line vs actual

- [ ] **BoardsOverviewWidget.tsx**
  - Board statistics display
  - Navigation to boards

- [ ] **WeeklyCompletionWidget.tsx**
  - Weekly metrics calculation
  - Progress bar rendering

### Deliverables
- ✅ 45+ dashboard tests written
- ✅ 70%+ coverage on analytics
- ✅ Chart rendering verified
- ✅ Dashboard customization tested

### Files Created
- `__tests__/unit/hooks/useAnalytics.test.ts`
- `__tests__/unit/hooks/useDashboardLayouts.test.ts`
- `__tests__/integration/components/Dashboard.test.tsx`
- `__tests__/integration/components/DashboardGrid.test.tsx`
- `__tests__/integration/widgets/ProductivityTrendChart.test.tsx`
- `__tests__/integration/widgets/VelocityChart.test.tsx`
- `__tests__/integration/widgets/BurndownChart.test.tsx`

### Acceptance Criteria
- [ ] All analytics queries tested
- [ ] Dashboard widgets render correctly
- [ ] Layout persistence works
- [ ] Charts display with mock data
- [ ] Empty states handled gracefully

---

## Phase 7: Search, Templates & Keyboard Shortcuts

**Duration:** 2-3 days
**Estimated Tests:** ~40 test cases
**Coverage Goal:** 75%+ for features

### Objectives
- Test global search functionality
- Test command palette
- Test template system
- Test keyboard shortcuts

### Feature Categories Covered
- **15. Search & Discovery**
- **21. Templates System**
- **22. Keyboard Shortcuts**

### Tasks

#### 7.1 Search Functionality (20 tests)
- [ ] **useSearch.ts** (10 tests)
  - Search boards by title
  - Search lists by title
  - Search cards (title + description)
  - Search comments
  - Filter by assignee
  - Filter by label
  - Filter by due date
  - Include/exclude archived items
  - Search query debouncing
  - Error handling

- [ ] **Search Components** (10 tests)
  - GlobalSearch.tsx (3 tests)
  - CommandPalette.tsx (4 tests - Cmd+K trigger, navigation, actions)
  - EnhancedSearchDialog.tsx (3 tests - advanced filters, results display)

#### 7.2 Template System (12 tests)
- [ ] **useTemplates.ts** (8 tests)
  - Fetch system templates
  - Fetch custom templates
  - Create board from template
  - Save board as template
  - Update template
  - Delete template
  - Template structure validation
  - Template categories

- [ ] **Template Components** (4 tests)
  - TemplateGalleryModal.tsx (browse, filter, select)
  - SaveAsTemplateDialog.tsx (save flow, validation)

#### 7.3 Keyboard Shortcuts (8 tests)
- [ ] **useSelectionKeyboard.ts** (4 tests)
  - Cmd/Ctrl+Click (toggle selection)
  - Shift+Click (range selection)
  - Cmd/Ctrl+A (select all)
  - Escape (clear selection)

- [ ] **useDueDateShortcuts.ts** (4 tests)
  - 'd+t' (set to today)
  - 'd+n' (set to tomorrow)
  - 'd+w' (set to next week)
  - Shortcut validation (only when focused)

### Deliverables
- ✅ 40+ search/template/shortcut tests written
- ✅ 75%+ coverage on these features
- ✅ Keyboard events tested
- ✅ Search debouncing verified

### Files Created
- `__tests__/unit/hooks/useSearch.test.ts`
- `__tests__/unit/hooks/useTemplates.test.ts`
- `__tests__/unit/hooks/useSelectionKeyboard.test.ts`
- `__tests__/unit/hooks/useDueDateShortcuts.test.ts`
- `__tests__/integration/components/GlobalSearch.test.tsx`
- `__tests__/integration/components/CommandPalette.test.tsx`
- `__tests__/integration/components/TemplateGalleryModal.test.tsx`

### Acceptance Criteria
- [ ] Search returns correct results
- [ ] Command palette opens with Cmd+K
- [ ] Templates create boards correctly
- [ ] Keyboard shortcuts work as expected
- [ ] Debouncing prevents excessive API calls

---

## Phase 8: Real-time Features & Integration Tests

**Duration:** 3-4 days
**Estimated Tests:** ~50 test cases
**Coverage Goal:** 70%+ for real-time, integration coverage

### Objectives
- Test WebSocket integration
- Test real-time updates
- Create end-to-end feature tests
- Test accessibility features
- Test organization management

### Feature Categories Covered
- **2. Organization Management**
- **14. Real-time Features**
- **23. Accessibility Features**
- Integration tests for all features

### Tasks

#### 8.1 WebSocket & Real-time (20 tests)
- [ ] **WebSocketContext.tsx** (10 tests)
  - Connection lifecycle (connect, disconnect, reconnect)
  - Join board room
  - Leave board room
  - Event emission
  - Event listening (10 event types)
  - Connection status tracking
  - Presence user tracking
  - Automatic reconnection
  - Error handling
  - Connection status banner integration

- [ ] **useBoardWebSocket.ts** (6 tests)
  - Board-level event handling
  - Cache invalidation on events
  - Optimistic update rollback on conflict
  - Multi-board support
  - Event filtering

- [ ] **Real-time Components** (4 tests)
  - PresenceIndicator.tsx (online users display)
  - ReminderListener.tsx (notification handling)
  - RealtimeActivityFeed.tsx (live updates)
  - ConnectionStatusBanner.tsx (status display)

#### 8.2 Organization Management (8 tests)
- [ ] Multi-organization support
- [ ] Organization creation
- [ ] Organization selection/switching
- [ ] Organization-scoped boards
- [ ] Organization templates
- [ ] Organization members (if applicable)
- [ ] Organization settings
- [ ] Organization context switching

#### 8.3 Accessibility Features (8 tests)
- [ ] **useAccessibility.ts** (8 tests)
  - Skip links functionality
  - ARIA label presence
  - Keyboard navigation (Tab, Enter, Escape)
  - Focus management (trap, restore)
  - Screen reader announcements
  - Reduced motion support
  - High contrast mode
  - Focus visible indicators

#### 8.4 Integration Tests (14 tests)
- [ ] **Card Creation Flow** (3 tests)
  - Quick add card → Card created → Appears in list
  - Full form card creation → All fields saved → Modal closes
  - Create card with assignees/labels → Relations saved

- [ ] **Bulk Operations Flow** (3 tests)
  - Select multiple cards → Bulk move → All cards moved → Selection cleared
  - Select cards → Bulk assign → Assignees added → UI updated
  - Select cards → Bulk delete → Confirmation → Cards deleted

- [ ] **Search Workflow** (2 tests)
  - Open command palette (Cmd+K) → Type query → Results appear → Navigate to card
  - Global search → Filter by board → Results filtered → Click result

- [ ] **Template Usage Flow** (2 tests)
  - Open template gallery → Select template → Create board → Verify structure
  - Save board as template → Template appears in gallery → Reuse template

- [ ] **Real-time Collaboration** (2 tests)
  - User A updates card → User B sees update instantly
  - User A adds comment → User B sees comment in real-time

- [ ] **Dashboard Customization** (2 tests)
  - Add widget → Drag to position → Save layout → Reload page → Layout persists
  - Switch between layouts → Layout content changes

### Deliverables
- ✅ 50+ real-time/integration tests written
- ✅ 70%+ coverage on real-time features
- ✅ WebSocket mocking with MSW
- ✅ End-to-end workflows tested
- ✅ Accessibility verified

### Files Created
- `__tests__/integration/contexts/WebSocketContext.test.tsx`
- `__tests__/unit/hooks/useBoardWebSocket.test.ts`
- `__tests__/unit/hooks/useAccessibility.test.ts`
- `__tests__/integration/features/card-creation-flow.test.tsx`
- `__tests__/integration/features/bulk-operations.test.tsx`
- `__tests__/integration/features/search-workflow.test.tsx`
- `__tests__/integration/features/template-usage.test.tsx`
- `__tests__/integration/features/realtime-collaboration.test.tsx`
- `__tests__/integration/features/dashboard-customization.test.tsx`

### Acceptance Criteria
- [ ] WebSocket connection lifecycle tested
- [ ] Real-time updates work in tests
- [ ] Integration tests cover critical user journeys
- [ ] Accessibility features verified
- [ ] Organization switching works

---

## Test Coverage Summary

### Expected Coverage by Phase

| Phase | Tests | Coverage Area | Est. Coverage |
|-------|-------|---------------|---------------|
| Phase 1 | 40 | Utilities | 90%+ |
| Phase 2 | 90 | Core Hooks | 80%+ |
| Phase 3 | 50 | State Management | 85%+ |
| Phase 4 | 80 | Collaboration | 75%+ |
| Phase 5 | 60 | Advanced Features | 75%+ |
| Phase 6 | 45 | Analytics | 70%+ |
| Phase 7 | 40 | Search/Templates | 75%+ |
| Phase 8 | 50 | Real-time/Integration | 70%+ |
| **TOTAL** | **~455** | **Overall** | **~77%** |

### Feature Category Coverage

| # | Feature Category | Phase | Est. Tests | Priority |
|---|------------------|-------|------------|----------|
| 1 | Authentication & User Management | Phase 3 | 6 | High |
| 2 | Organization Management | Phase 8 | 8 | Medium |
| 3 | Board Management | Phase 2 | 8 | High |
| 4 | List Management | Phase 2 | 10 | High |
| 5 | Card Management - Basic | Phase 2 | 24 | High |
| 6 | Card Management - Advanced | Phase 2, 3 | 30 | High |
| 7 | Bulk Operations | Phase 2, 4 | 33 | High |
| 8 | Card Collaboration - Assignees | Phase 4 | 8 | Medium |
| 9 | Card Collaboration - Labels | Phase 4 | 10 | Medium |
| 10 | Card Collaboration - Checklists | Phase 4 | 10 | Medium |
| 11 | Card Collaboration - Comments | Phase 4 | 12 | Medium |
| 12 | Card Collaboration - Attachments | Phase 4 | 10 | Medium |
| 13 | Card Collaboration - Activity | Phase 4 | 5 | Low |
| 14 | Real-time Features | Phase 8 | 20 | Medium |
| 15 | Search & Discovery | Phase 7 | 20 | High |
| 16 | Calendar View | Phase 5 | 15 | Medium |
| 17 | Dashboard & Analytics | Phase 6 | 45 | Medium |
| 18 | Filters & Sorting | Phase 5 | 23 | High |
| 19 | Time Tracking | Phase 5 | 12 | Low |
| 20 | Reminders | Phase 5 | 10 | Low |
| 21 | Templates System | Phase 7 | 12 | Medium |
| 22 | Keyboard Shortcuts | Phase 7 | 8 | Low |
| 23 | Accessibility Features | Phase 8 | 8 | High |
| 24 | UI/UX Features | Phase 1 | 8 | Low |

---

## Testing Patterns & Best Practices

### Hook Testing Pattern
```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { createWrapper } from '@/__tests__/utils/test-utils';

test('useCards creates a card', async () => {
  const { result } = renderHook(() => useCards('list-123'), {
    wrapper: createWrapper(),
  });

  act(() => {
    result.current.createCard({ title: 'New Card' });
  });

  await waitFor(() => {
    expect(result.current.cards).toHaveLength(1);
  });
});
```

### Component Testing Pattern
```typescript
import { render, screen, userEvent } from '@/__tests__/utils/test-utils';

test('CardItem displays card title', () => {
  render(<CardItem card={mockCard} />);
  expect(screen.getByText('Test Card')).toBeInTheDocument();
});
```

### MSW API Mocking Pattern
```typescript
// __tests__/utils/server-handlers.ts
export const handlers = [
  rest.post('/api/v1/cards', async (req, res, ctx) => {
    const body = await req.json();
    return res(ctx.json({ id: '123', ...body }));
  }),
];
```

### Store Testing Pattern
```typescript
import { renderHook, act } from '@testing-library/react';
import { useSelectionStore } from '@/hooks/store/useSelectionStore';

test('toggleCard adds card to selection', () => {
  const { result } = renderHook(() => useSelectionStore());

  act(() => {
    result.current.toggleCard('card-1');
  });

  expect(result.current.selectedCardIds.has('card-1')).toBe(true);
});
```

---

## CI/CD Integration

### GitHub Actions Workflow
```yaml
name: Client Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd client && npm ci
      - run: cd client && npm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./client/coverage/coverage-final.json
```

---

## Dependencies Between Phases

```
Phase 1 (Foundation)
    ↓
Phase 2 (Core Hooks) - DEPENDS ON: Phase 1 (test utilities)
    ↓
Phase 3 (State) - DEPENDS ON: Phase 1 (test utilities)
    ↓
Phase 4 (Collaboration) - DEPENDS ON: Phase 1, 2 (hooks tested)
    ↓
Phase 5 (Advanced) - DEPENDS ON: Phase 1, 2, 3
    ↓
Phase 6 (Analytics) - DEPENDS ON: Phase 1, 2, 3
    ↓
Phase 7 (Search/Templates) - DEPENDS ON: Phase 1, 2
    ↓
Phase 8 (Integration) - DEPENDS ON: All previous phases
```

---

## Risk Mitigation

### High Risk Areas
1. **WebSocket Testing** - Complex connection lifecycle
   - **Mitigation:** Use MSW WebSocket mocking, test reconnection scenarios

2. **Optimistic Updates** - Race conditions
   - **Mitigation:** Test rollback scenarios, verify cache state

3. **File Uploads** - Mock FormData
   - **Mitigation:** Use `@testing-library/user-event` file upload utilities

4. **Date/Time Testing** - Timezone issues
   - **Mitigation:** Mock `DateTime.now()` in Luxon, use fixed timezones

5. **Chart Rendering** - Recharts + JSDOM
   - **Mitigation:** Test data transformations, not SVG rendering

### Medium Risk Areas
1. **Drag & Drop Testing** - Complex user interactions
   - **Mitigation:** Use `@testing-library/user-event` DnD utilities

2. **LocalStorage Persistence** - State sync
   - **Mitigation:** Mock `localStorage`, verify read/write

---

## Success Metrics

### Quantitative Metrics
- [ ] **Overall Coverage:** 75%+ code coverage
- [ ] **Hook Coverage:** 80%+ on all custom hooks
- [ ] **Utility Coverage:** 90%+ on utilities (dateUtils, filterTasks)
- [ ] **Store Coverage:** 85%+ on Zustand stores
- [ ] **Test Count:** 365+ test cases
- [ ] **Build Time:** Tests complete in < 30 seconds
- [ ] **CI/CD:** All tests pass on every commit

### Qualitative Metrics
- [ ] **Confidence:** Can refactor with confidence
- [ ] **Documentation:** Testing patterns documented
- [ ] **Maintenance:** Easy to add new tests
- [ ] **Reliability:** Tests are stable (no flaky tests)
- [ ] **Clarity:** Test failures clearly indicate issues

---

## Next Steps

After reviewing this master plan:

1. **Get User Approval** - Review and approve the phase breakdown
2. **Start Phase 1** - Set up testing infrastructure
3. **Iterate Through Phases** - Complete one phase at a time
4. **Update Documentation** - Keep features.md updated with test status
5. **CI/CD Integration** - Add GitHub Actions workflow

---

## Appendix

### Recommended VS Code Extensions
- Vitest (vitest.explorer)
- Testing Library (testing-library.vscode)
- Coverage Gutters (ryanluker.vscode-coverage-gutters)

### Useful Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- useCards.test.ts

# Run tests matching pattern
npm test -- --grep "bulk operations"

# View coverage report
npm run test:coverage -- --reporter=html
open coverage/index.html
```

### Test File Naming Conventions
- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `*.integration.test.tsx`
- E2E tests: `*.e2e.test.ts`

---

**Document Status:** Ready for review and approval
**Next Action:** Get user feedback on phase breakdown and priorities
**Estimated Total Time:** 20-28 days (3-4 weeks)
**Estimated Test Cases:** ~455 tests
**Expected Coverage:** ~77% overall
