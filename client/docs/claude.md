# Claude Workflow Documentation

**Last Updated:** 2025-11-17

This document explains the workflow and conventions for AI assistants (Claude) working on this project.

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
When working on features or tasks in this project, Claude should maintain detailed documentation of planning, implementation, and completion phases.

### Core Principles
1. **Plan First:** Always create a plan before implementation
2. **Document Progress:** Update documents as work progresses
3. **Mark Completion:** Rename documents when phases are complete
4. **Organized Structure:** Keep documentation in feature-specific folders

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
│  client/docs/<feature-name>/phase-1.md                  │
│                                                          │
│  - Break down the feature into phases                   │
│  - Define scope and requirements                        │
│  - List tasks and acceptance criteria                   │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  2. START WORK (Mark as WIP)                            │
│  Rename: phase-1.md → phase-1-wip.md 🚧                │
│                                                          │
│  - Update document with implementation details          │
│  - Add notes about challenges/decisions                 │
│  - Track blockers and TODOs                            │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  3. COMPLETE PHASE                                       │
│  Rename: phase-1-wip.md → phase-1-done.md              │
│                                                          │
│  - Mark all tasks as complete                           │
│  - Add completion date                                  │
│  - Note any technical decisions made                    │
│  - List any follow-up items                            │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  4. NEXT PHASE (if applicable)                          │
│  Create: client/docs/<feature-name>/phase-2.md         │
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
client/
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
        └── README.md        # Feature overview (optional)
```

### Example Structure
```
client/docs/
├── features.md
├── architecture.md
├── claude.md
│
├── search-feature/
│   ├── phase-1-done.md      # ✅ Global search implementation
│   ├── phase-2-done.md      # ✅ Command palette
│   └── phase-3-wip.md       # 🚧 Advanced filters
│
├── bulk-actions/
│   ├── phase-1-done.md      # ✅ Multi-select UI
│   ├── phase-2-done.md      # ✅ Bulk operations
│   └── phase-3-done.md      # ✅ Keyboard shortcuts
│
├── real-time-collaboration/
│   ├── phase-1-done.md      # ✅ WebSocket setup
│   ├── phase-2-done.md      # ✅ Presence indicators
│   └── phase-3-wip.md       # 🚧 Collaborative editing
│
└── testing-infrastructure/
    └── phase-1.md           # Unit testing setup (planned)
```

---

## Naming Conventions

### Feature Folder Names
- Use lowercase with hyphens
- Be descriptive but concise
- Examples:
  - ✅ `search-feature`
  - ✅ `bulk-actions`
  - ✅ `real-time-collaboration`
  - ✅ `testing-infrastructure`
  - ❌ `SearchFeature` (avoid camelCase)
  - ❌ `feature1` (not descriptive)

### Phase Document Names
- Always use `phase-N.md` format
- Add suffix for status:
  - `phase-1.md` - Planned
  - `phase-1-wip.md` - In Progress (🚧)
  - `phase-1-done.md` - Completed (✅)

### Optional Documents
- `README.md` - Feature overview and summary
- `notes.md` - Miscellaneous notes
- `decisions.md` - Architecture decision records

---

## Document Templates

### Phase Plan Template

```markdown
# [Feature Name] - Phase [N]: [Phase Title]

**Status:** Planned | In Progress 🚧 | Completed ✅
**Created:** YYYY-MM-DD
**Started:** YYYY-MM-DD (if WIP)
**Completed:** YYYY-MM-DD (if done)
**Assigned To:** Claude / Developer Name

---

## Overview
Brief description of what this phase aims to accomplish.

---

## Goals
- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

---

## Scope

### In Scope
- Item 1
- Item 2

### Out of Scope
- Item 1 (defer to phase N+1)
- Item 2 (not needed)

---

## Tasks

### 1. Task Category
- [ ] Subtask 1
- [ ] Subtask 2
- [ ] Subtask 3

### 2. Task Category
- [ ] Subtask 1
- [ ] Subtask 2

---

## Technical Approach
Describe the technical approach, architecture decisions, and implementation strategy.

---

## Dependencies
- Dependency 1
- Dependency 2

---

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

---

## Testing Plan
- Unit tests: [Description]
- Integration tests: [Description]
- E2E tests: [Description]

---

## Risks & Mitigations
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Risk 1 | High | Medium | Mitigation strategy |

---

## Notes
- Note 1
- Note 2

---

## Related Files
- `src/components/feature/Component1.tsx`
- `src/hooks/useFeature.ts`
- `src/types/feature.types.ts`

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
- ✅ Task 1 - Implemented `Component1.tsx`
- ✅ Task 2 - Created `useFeature.ts` hook

### In Progress
- 🚧 Task 3 - Working on API integration
  - Challenge: CORS issue with backend
  - Solution: Added proxy configuration

### Blocked
- ⛔ Task 4 - Waiting on backend API endpoint

---

## Technical Decisions

### Decision 1: State Management
**Context:** Need to decide between Context API vs Zustand
**Decision:** Use Zustand for better performance
**Rationale:** Less re-renders, simpler syntax, better DevTools

### Decision 2: Component Structure
**Context:** Modal vs Side Panel for card details
**Decision:** Implement both, user can choose
**Rationale:** Different use cases prefer different UX

---

## Challenges & Solutions

### Challenge 1: Performance Issue
**Problem:** Dragging cards was laggy with 100+ cards
**Solution:** Implemented virtual scrolling
**Result:** Smooth drag & drop even with 1000+ cards

---

## Code Changes
- Created: `src/components/feature/Component1.tsx`
- Modified: `src/hooks/useCards.ts` (added sorting logic)
- Deleted: `src/utils/oldHelper.ts` (deprecated)
```

### Completion Template (✅)

When done, rename to `phase-N-done.md` and add:

```markdown
## ✅ Completion Summary

**Completed Date:** 2025-11-17
**Duration:** 3 days
**Status:** Successfully completed

### All Tasks Completed
- ✅ Task 1 - Component1.tsx implemented
- ✅ Task 2 - useFeature.ts hook created
- ✅ Task 3 - API integration completed
- ✅ Task 4 - Tests added (80% coverage)
- ✅ Task 5 - Documentation updated

### Deliverables
- 15 new files created
- 3 files modified
- 500+ lines of code
- 20 unit tests added
- 5 integration tests added

### Outcomes
- Feature fully functional
- All acceptance criteria met
- Tests passing
- Code reviewed and merged

---

## Follow-up Items
- [ ] Add E2E tests (deferred to Phase N+1)
- [ ] Optimize performance for mobile (tracked in backlog)
- [ ] Add analytics tracking (separate ticket)

---

## Lessons Learned
- Zustand was a good choice for state management
- Virtual scrolling was essential for performance
- Testing async operations requires careful setup

---

## Next Phase
Phase N+1 will focus on [next feature/improvement].
See: `client/docs/<feature>/phase-N+1.md`
```

---

## Best Practices

### 1. When to Create a New Phase
Create a new phase when:
- Starting a logically separate piece of work
- The current phase is complete
- The work requires different skills/approach
- There's a natural break in the feature

### 2. How Granular Should Phases Be?
- **Too Granular:** Don't create a phase for every tiny task
- **Too Broad:** Don't put an entire feature in one phase
- **Just Right:** Each phase should take 1-5 days of work

**Example Breakdown:**
```
❌ Too Granular:
- Phase 1: Create button component
- Phase 2: Add click handler
- Phase 3: Style button

✅ Just Right:
- Phase 1: Core search functionality (UI + API)
- Phase 2: Advanced filters
- Phase 3: Search analytics

❌ Too Broad:
- Phase 1: Complete search system with filters, analytics,
  keyboard shortcuts, voice search, and AI recommendations
```

### 3. Update Documents Regularly
- Update WIP documents daily
- Add notes about challenges and decisions
- Keep task lists current
- Don't wait until the end to document

### 4. Reference Related Work
- Link to related phase documents
- Reference relevant files in the codebase
- Cross-reference features.md and architecture.md
- Include GitHub issue/PR numbers if applicable

### 5. Be Specific About Changes
```markdown
❌ Bad:
- Updated some components
- Fixed bugs
- Made improvements

✅ Good:
- Modified `CardItem.tsx` to support multi-select (lines 45-67)
- Fixed race condition in `useCards.ts` websocket handler
- Improved performance by memoizing `filterCards` function
```

### 6. Include Context for Future Claude
- Explain **why** decisions were made, not just **what**
- Document challenges and how they were solved
- Note any gotchas or edge cases
- Include relevant links and references

---

## Examples

### Example 1: Simple Feature (Single Phase)

**Feature:** Add export button to dashboard

```
client/docs/dashboard-export/
└── phase-1-done.md
```

**phase-1-done.md:**
```markdown
# Dashboard Export - Phase 1: CSV Export Button

**Status:** Completed ✅
**Created:** 2025-11-15
**Completed:** 2025-11-15

## Overview
Add a button to export dashboard data to CSV format.

## Tasks
- ✅ Add export button to dashboard header
- ✅ Implement CSV generation logic
- ✅ Download file in browser
- ✅ Add loading state

## Implementation
Created `src/utils/exportDashboard.ts` with CSV generation logic.
Added button to `Dashboard.tsx` with download handler.

## Files Changed
- `src/pages/Dashboard.tsx` (added button)
- `src/utils/exportDashboard.ts` (new file)

## Result
Users can now export their dashboard data with one click.
```

### Example 2: Complex Feature (Multiple Phases)

**Feature:** Real-time collaboration

```
client/docs/real-time-collaboration/
├── phase-1-done.md      # WebSocket setup
├── phase-2-done.md      # Presence indicators
├── phase-3-wip.md       # Collaborative editing (🚧)
└── phase-4.md           # Conflict resolution (planned)
```

**phase-1-done.md:**
```markdown
# Real-time Collaboration - Phase 1: WebSocket Setup

**Status:** Completed ✅
**Created:** 2025-11-01
**Completed:** 2025-11-05

## Overview
Set up WebSocket infrastructure for real-time updates.

## Goals
- ✅ Install and configure Socket.io client
- ✅ Create WebSocketContext
- ✅ Implement connection management
- ✅ Add automatic reconnection
- ✅ Create useBoardWebSocket hook

## Implementation Details

### WebSocket Context
Created `src/contexts/WebSocketContext.tsx` that:
- Manages Socket.io connection lifecycle
- Provides connection status to components
- Handles reconnection logic
- Emits and listens to events

### Board WebSocket Hook
Created `src/hooks/websocket/useBoardWebSocket.ts` that:
- Joins/leaves board rooms
- Listens for board events
- Updates React Query cache automatically
- Provides real-time board updates

### Events Implemented
- `board:join` - Join a board room
- `board:leave` - Leave a board room
- `board:update` - Board data changed
- `card:create` - New card created
- `card:update` - Card updated
- `card:delete` - Card deleted
- `card:move` - Card moved to different list

## Technical Decisions

### Decision: Socket.io vs Raw WebSocket
**Chosen:** Socket.io
**Rationale:**
- Automatic reconnection
- Room support built-in
- Fallback to polling
- Better error handling

### Decision: Integration with React Query
**Approach:** Update cache on WebSocket events
**Rationale:**
- Single source of truth (cache)
- Automatic UI updates
- Optimistic updates still work

## Files Created
- `src/contexts/WebSocketContext.tsx` (150 lines)
- `src/hooks/websocket/useBoardWebSocket.ts` (200 lines)
- `src/types/websocket.types.ts` (50 lines)

## Files Modified
- `src/App.tsx` (added WebSocketProvider)
- `package.json` (added socket.io-client)

## Testing
- ✅ Manual testing with multiple browser tabs
- ✅ Tested reconnection on network disconnect
- ⚠️ No automated tests yet (deferred to testing phase)

## Next Phase
Phase 2 will implement user presence indicators.
See: `client/docs/real-time-collaboration/phase-2.md`
```

**phase-3-wip.md:**
```markdown
# Real-time Collaboration - Phase 3: Collaborative Editing 🚧

**Status:** In Progress 🚧
**Created:** 2025-11-10
**Started:** 2025-11-12

## Overview
Enable multiple users to edit the same card simultaneously.

## Goals
- [ ] Show who is currently editing a card
- [x] Broadcast editing state
- [ ] Implement field-level locking
- [ ] Show real-time changes
- [ ] Handle conflicts gracefully

## Implementation Progress

### Completed
- ✅ Added `card:editing:start` event
- ✅ Added `card:editing:stop` event
- ✅ Created editing indicator UI component

### In Progress
- 🚧 Implementing field-level locking
  - Challenge: How to handle when two users edit different fields?
  - Current approach: Allow simultaneous edits of different fields
  - TODO: Add visual indicators for locked fields

### Blocked
- ⛔ Conflict resolution strategy
  - Need to decide: last-write-wins vs operational transform
  - Blocked on: researching OT libraries

## Technical Challenges

### Challenge: Race Conditions
**Problem:** Two users update card title at same time
**Current Solution:** Last write wins (temporary)
**TODO:** Implement proper conflict resolution

## Files Created
- `src/components/card/EditingIndicator.tsx` (80 lines)

## Files Modified
- `src/hooks/websocket/useBoardWebSocket.ts` (added editing events)
- `src/components/card/CardDetailsModal.tsx` (added indicator)

## Next Steps
1. Research operational transform libraries
2. Implement conflict resolution
3. Add tests for race conditions
4. Update documentation
```

### Example 3: Bug Fix

**Feature:** Fix websocket memory leak

```
client/docs/websocket-memory-leak/
└── phase-1-done.md
```

**phase-1-done.md:**
```markdown
# WebSocket Memory Leak Fix - Phase 1

**Status:** Completed ✅
**Created:** 2025-11-16
**Completed:** 2025-11-16

## Problem
WebSocket connections were not being cleaned up when users navigated away from boards, causing memory leaks.

## Root Cause
The `useBoardWebSocket` hook was not properly removing event listeners in the cleanup function.

## Solution
Added proper cleanup in `useEffect`:

\`\`\`typescript
useEffect(() => {
  socket.on('card:update', handleCardUpdate)

  return () => {
    socket.off('card:update', handleCardUpdate) // ← Added this
  }
}, [])
\`\`\`

## Files Modified
- `src/hooks/websocket/useBoardWebSocket.ts` (lines 45-60)

## Testing
- ✅ Verified with Chrome DevTools memory profiler
- ✅ No more memory growth after navigating away
- ✅ All existing functionality still works

## Impact
- Reduced memory usage by ~50MB per board visit
- Improved app stability for long sessions
```

---

## Workflow Summary

### Quick Reference

**Starting a new feature:**
1. Create folder: `client/docs/<feature-name>/`
2. Create plan: `client/docs/<feature-name>/phase-1.md`
3. Plan the work (goals, tasks, approach)

**Starting work on a phase:**
1. Rename: `phase-1.md` → `phase-1-wip.md` (🚧)
2. Update document with progress
3. Add implementation notes

**Completing a phase:**
1. Mark all tasks complete
2. Rename: `phase-1-wip.md` → `phase-1-done.md` (✅)
3. Add completion summary
4. Create next phase plan if needed

**Small changes/fixes:**
- For minor changes, a single phase is fine
- For bug fixes, create a folder and document the fix
- Update `features.md` if status changes

---

## Integration with Other Documentation

### features.md
- Reference for all features and their status
- Update when feature status changes
- Link to phase documents for details

### architecture.md
- Reference for technical decisions
- Consult when planning architecture changes
- Update if adding new patterns

### Phase Documents
- Detailed implementation documentation
- Living documents during development
- Historical record after completion

---

## Tips for Claude

### 1. Read Before Writing
Before starting work, read:
- `features.md` - Understand current feature status
- `architecture.md` - Understand technical stack
- Existing phase documents - Learn from past work

### 2. Be Detailed
Future Claude (or developers) will thank you for:
- Explaining **why** decisions were made
- Documenting challenges and solutions
- Including code examples and file references
- Noting edge cases and gotchas

### 3. Keep Documents Updated
- Update documents as you work (not just at the end)
- Add notes about challenges immediately
- Keep task lists current
- Document decisions as they're made

### 4. Think About Future Readers
- Will someone understand this in 6 months?
- Did I explain the context?
- Did I include relevant references?
- Is the document well-organized?

### 5. Use Emojis Appropriately
- 🚧 for WIP documents (in filename)
- ✅ for completed items (in content)
- ⚠️ for warnings/caveats
- ⛔ for blockers
- 📝 for notes
- 🎯 for goals

---

## Conclusion

This workflow ensures:
- ✅ **Organized Documentation** - Easy to find and understand
- ✅ **Progress Tracking** - Clear status at a glance
- ✅ **Knowledge Preservation** - Decisions and context preserved
- ✅ **Collaboration** - Easy for multiple people/Claudes to work together
- ✅ **Historical Record** - Understand how features evolved

By following this workflow, we maintain a clear, organized, and comprehensive record of all development work on the client application.

---

**Remember:** Good documentation is like a conversation with your future self. Be clear, be thorough, and be kind to whoever reads it next! 🤝
