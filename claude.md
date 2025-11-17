# Sprinty Project - Claude Workflow Guide

**Last Updated:** 2025-11-17

This is the **master workflow guide** for AI assistants (Claude) working on the Sprinty project. Read this document completely before starting any work.

---

## 🚨 CRITICAL: Read This First

### Before Doing ANYTHING:

1. **STOP and READ** the appropriate documentation:
   - Working on **client**? → Read `client/docs/`
   - Working on **API**? → Read `api/docs/`
   - Not sure? → Read both

2. **ANALYZE FIRST, IMPLEMENT LATER**
   - Never jump straight to coding
   - Always analyze the codebase thoroughly
   - Understand existing patterns and architecture
   - Check what already exists

3. **DOCUMENTATION IS THE SOURCE OF TRUTH**
   - All documentation must be kept up-to-date
   - Every change you make must be reflected in docs
   - Documentation is not optional - it's required

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Workflow Overview](#workflow-overview)
3. [Before Starting Any Task](#before-starting-any-task)
4. [Working on Client vs API](#working-on-client-vs-api)
5. [Documentation Requirements](#documentation-requirements)
6. [Analysis Before Planning](#analysis-before-planning)
7. [Implementation Workflow](#implementation-workflow)
8. [Updating Documentation](#updating-documentation)
9. [Quality Checklist](#quality-checklist)
10. [Common Mistakes to Avoid](#common-mistakes-to-avoid)

---

## Project Structure

```
sprinty/
├── client/                    # React TypeScript frontend
│   ├── src/                  # Source code
│   └── docs/                 # CLIENT DOCUMENTATION
│       ├── features.md       # Feature status & test coverage
│       ├── architecture.md   # Tech stack & project structure
│       └── claude.md         # Client-specific workflow
│
├── api/                      # Fastify TypeScript backend
│   ├── src/                  # Source code
│   └── docs/                 # API DOCUMENTATION
│       ├── features.md       # Endpoint status & test coverage
│       ├── architecture.md   # Tech stack & database schema
│       └── claude.md         # API-specific workflow
│
├── docs/                     # Root documentation
│   ├── FEATURES.md          # High-level feature list
│   └── NEW_FEATURES_PROPOSAL.md
│
├── README.md                 # Project overview
└── claude.md                 # THIS FILE - Master workflow guide
```

---

## Workflow Overview

### The Golden Rule: **Documentation → Analysis → Planning → Implementation**

```
┌─────────────────────────────────────────────────────────────┐
│  1. READ DOCUMENTATION                                      │
│  - Read features.md (what exists)                           │
│  - Read architecture.md (how it's built)                    │
│  - Read claude.md (how to work on it)                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  2. ANALYZE CODEBASE                                        │
│  - Use Task tool with Explore agent                         │
│  - Understand existing patterns                             │
│  - Identify related code                                    │
│  - Check what already exists                                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  3. PLAN THE WORK                                           │
│  - Create phase plan document                               │
│  - Break down into manageable tasks                         │
│  - Identify risks and dependencies                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  4. IMPLEMENT                                               │
│  - Follow established patterns                              │
│  - Write tests alongside code                               │
│  - Update documentation as you go                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  5. UPDATE DOCUMENTATION                                    │
│  - Update features.md with new status                       │
│  - Update architecture.md if patterns changed               │
│  - Mark phase as complete                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Before Starting Any Task

### Mandatory Pre-Work Checklist

When given a task, you **MUST** complete these steps in order:

#### ✅ Step 1: Identify the Scope
```
❓ Questions to answer:
- Is this a client-side change?
- Is this an API change?
- Does it affect both?
- Is this a new feature or modifying existing?
```

#### ✅ Step 2: Read the Documentation
```
📖 Required Reading:

If working on CLIENT:
1. client/docs/features.md      - What features exist?
2. client/docs/architecture.md  - How is it structured?
3. client/docs/claude.md        - How do I work on it?

If working on API:
1. api/docs/features.md         - What endpoints exist?
2. api/docs/architecture.md     - How is it structured?
3. api/docs/claude.md           - How do I work on it?

If working on BOTH:
- Read ALL six documentation files
```

#### ✅ Step 3: Analyze the Codebase
```
🔍 Use the Task tool with Explore agent:

- Set thoroughness to "medium" or "very thorough"
- Search for related features
- Understand existing patterns
- Find similar implementations
- Check test coverage

Example:
"Analyze the client codebase to understand how filters are
currently implemented. Look for filter components, hooks,
and state management patterns. Thoroughness: medium"
```

#### ✅ Step 4: Verify Your Understanding
```
🤔 Before planning, confirm:
- [ ] I know what features already exist
- [ ] I understand the tech stack
- [ ] I've seen similar implementations
- [ ] I know the testing patterns
- [ ] I understand the architecture patterns
```

---

## Working on Client vs API

### Client (Frontend) Work

**When to work on client:**
- UI components
- User interactions
- State management
- Client-side routing
- Real-time updates (client-side)

**Required Documentation:**
- `client/docs/features.md` - Check if feature exists, test status
- `client/docs/architecture.md` - Understand React patterns, hooks, state
- `client/docs/claude.md` - Follow client workflow

**Tech Stack to Know:**
- React 18.3.1 + TypeScript 5.6.2
- Vite 6.0.11
- Zustand (state) + TanStack Query (server state)
- Shadcn UI + TailwindCSS
- Socket.io client (real-time)

**Key Patterns:**
- Feature-based component organization
- Custom hooks for business logic
- TypeScript strict mode
- No tests currently (need to add)

---

### API (Backend) Work

**When to work on API:**
- Database schema changes
- API endpoints
- Business logic
- Authentication/Authorization
- WebSocket events (server-side)
- Cron jobs

**Required Documentation:**
- `api/docs/features.md` - Check if endpoint exists, test status
- `api/docs/architecture.md` - Understand Fastify, database schema
- `api/docs/claude.md` - Follow API workflow

**Tech Stack to Know:**
- Fastify 5.2.1 + TypeScript 5.7.3
- PostgreSQL + Knex.js 3.1.0
- TypeBox validation
- Socket.io server (real-time)
- Jest (testing)

**Key Patterns:**
- Domain-driven module structure
- Layered architecture (Route → Controller → Service → Repository)
- TypeBox schema validation
- Database migrations with Knex
- 28.5% test coverage (need to improve)

**Critical Issues:**
- ⚠️ NO authorization middleware (security risk!)
- ⚠️ Reminders module not registered
- ⚠️ WebSocket has no access control

---

## Documentation Requirements

### Documentation is Mandatory

**Every change you make MUST be documented.** No exceptions.

### What to Update

#### When Adding a New Feature:

1. **Create phase documents:**
   - `{client|api}/docs/<feature-name>/phase-1.md`
   - Update as you progress (phase-1-wip.md → phase-1-done.md)

2. **Update features.md:**
   - Add new feature/endpoint to the table
   - Mark implementation status
   - Mark test status
   - Update statistics

3. **Update architecture.md (if applicable):**
   - New architectural patterns
   - New dependencies
   - Database schema changes
   - Performance considerations

#### When Modifying Existing Feature:

1. **Update phase documents:**
   - Create new phase if significant change
   - Or update existing phase document

2. **Update features.md:**
   - Change implementation status
   - Update test status
   - Add notes about changes

3. **Update architecture.md (if needed):**
   - Document architectural changes
   - Update tech stack if dependencies changed

#### When Fixing a Bug:

1. **Create bug fix document:**
   - `{client|api}/docs/<bug-name>/phase-1.md`
   - Document problem, root cause, solution

2. **Update features.md:**
   - Note the fix in the relevant section

---

## Analysis Before Planning

### Why Analysis First?

**Bad Approach (Don't do this):**
```
User: "Add a filter feature to the board view"
Claude: "I'll create a FilterComponent..."
❌ WRONG - No analysis done!
```

**Good Approach (Do this):**
```
User: "Add a filter feature to the board view"

Claude: "Let me first analyze the codebase to understand:
1. If filtering already exists
2. How filters are currently implemented
3. What patterns are used

I'll use the Task tool to explore..."

[Runs analysis]

Claude: "Based on my analysis:
- FilterBar component exists in client/src/components/board/
- Uses useCardFilters hook for state
- Filters by due date, priority, status
- No tests exist

Now I'll create a plan to extend this..."
✅ CORRECT - Analysis first!
```

### Analysis Checklist

Before planning, you MUST analyze:

- [ ] **Does this feature already exist?**
  - Check features.md
  - Search codebase
  - Look for similar patterns

- [ ] **What are the existing patterns?**
  - How are similar features implemented?
  - What naming conventions are used?
  - What folder structure is used?

- [ ] **What's the test coverage?**
  - Do similar features have tests?
  - What testing patterns are used?
  - What needs to be tested?

- [ ] **What are the dependencies?**
  - What other features does this depend on?
  - What features depend on this?
  - What database changes are needed? (API only)

- [ ] **What are the risks?**
  - Breaking changes?
  - Performance impact?
  - Security concerns?

### Using the Task Tool for Analysis

**Always use the Task tool with Explore agent for analysis:**

```typescript
// Good example
Task({
  subagent_type: "Explore",
  model: "sonnet",
  description: "Analyze filter implementation",
  prompt: `Analyze the client codebase to understand how filtering
  is currently implemented. I need to know:

  1. What filter components exist
  2. How filter state is managed
  3. What patterns are used
  4. What's the test coverage

  Set thoroughness to "very thorough".`
})
```

**Thoroughness Levels:**
- `"quick"` - Basic search (only when you know exactly what you're looking for)
- `"medium"` - Moderate exploration (most common)
- `"very thorough"` - Comprehensive analysis (for complex features)

---

## Implementation Workflow

### Client Implementation Order

```
1. Analysis (Task tool)
2. Plan (create phase-1.md)
3. Component (create/modify .tsx files)
4. Hook (if needed - create/modify use*.ts)
5. State (if needed - update Zustand/Context)
6. API Integration (if needed - use React Query)
7. Tests (MUST ADD - currently missing)
8. Documentation (update features.md)
```

### API Implementation Order

```
1. Analysis (Task tool)
2. Plan (create phase-1.md)
3. Database (migration if needed)
   └─ npm run migrate:make feature_name
4. Repository (data access layer)
5. Service (business logic)
6. Controller (request handling)
7. Routes (HTTP endpoints + schemas)
8. Register (add to bootstrap.ts)
9. Tests (REQUIRED - Jest tests)
10. Documentation (update features.md)
```

### Full-Stack Feature Order

```
1. Analysis (BOTH client and API)
2. Plan (create phase docs in BOTH)
3. API First:
   └─ Database → Repository → Service → Controller → Routes
4. API Tests
5. Client:
   └─ Components → Hooks → State → API Integration
6. Client Tests
7. Integration Testing
8. Documentation (update BOTH features.md)
```

---

## Updating Documentation

### When to Update

**Update documentation in REAL-TIME, not at the end!**

```
❌ BAD:
- Implement entire feature
- Then try to remember what you did
- Update docs at the end

✅ GOOD:
- Create phase-1.md (plan)
- Rename to phase-1-wip.md (start work)
- Update WIP doc as you make progress
- Rename to phase-1-done.md (finish)
- Update features.md immediately
```

### How to Update features.md

#### Adding a New Feature

**Client Example:**
```markdown
## 25. New Feature Category

### Feature Name

| Feature | Implementation Status | Test Status | Notes |
|---------|----------------------|-------------|-------|
| Feature 1 | ✅ Implemented | ⚠️ No Tests | Description |
| Feature 2 | 🚧 In Progress | ⚠️ No Tests | WIP |

**Files:**
- `src/components/feature/Component.tsx`
- `src/hooks/useFeature.ts`
```

**API Example:**
```markdown
## 13. New Feature Category

### Endpoints

| Endpoint | Method | Implementation Status | Test Status | Notes |
|----------|--------|----------------------|-------------|-------|
| `/api/v1/resource` | POST | ✅ Implemented | 🧪 Tested | Create resource |
| `/api/v1/resource/:id` | GET | ✅ Implemented | 🧪 Tested | Get resource |

**Status**: ✅ IMPLEMENTED & TESTED

**Files:**
- `src/modules/resource/resource.route.ts`
- `src/modules/resource/resource.controller.ts`
- `src/modules/resource/resource.service.ts`
- `src/modules/resource/resource.repository.ts`
- `src/__test__/resource.test.ts`
```

#### Updating Test Status

**When you add tests:**
```markdown
# Before
| Feature | Implementation Status | Test Status | Notes |
|---------|----------------------|-------------|-------|
| Feature 1 | ✅ Implemented | ⚠️ No Tests | - |

# After
| Feature | Implementation Status | Test Status | Notes |
|---------|----------------------|-------------|-------|
| Feature 1 | ✅ Implemented | 🧪 Tested | 15 unit tests, 85% coverage |
```

### How to Update architecture.md

**Update architecture.md when:**
- Adding new dependencies
- Changing architectural patterns
- Modifying database schema (API)
- Adding new state management (Client)
- Performance optimizations
- Security changes

**Example Update:**
```markdown
## Recent Changes

### 2025-01-17: Added Authorization Middleware
- New dependency: `@fastify/rate-limit`
- New middleware layer for authorization
- Updated security section
- See: api/docs/authorization-middleware/phase-1-done.md
```

---

## Quality Checklist

### Before Marking Phase as Complete

- [ ] **Code Quality**
  - [ ] Follows existing patterns
  - [ ] TypeScript strict mode passes
  - [ ] No linting errors
  - [ ] Code is readable and maintainable

- [ ] **Testing**
  - [ ] Unit tests written (API required, Client recommended)
  - [ ] Tests are passing
  - [ ] Edge cases covered
  - [ ] Test coverage documented

- [ ] **Documentation**
  - [ ] Phase document marked as done
  - [ ] features.md updated
  - [ ] architecture.md updated (if applicable)
  - [ ] API contracts documented (API only)
  - [ ] Database migrations documented (API only)

- [ ] **Integration**
  - [ ] Routes registered (API only)
  - [ ] Components imported and used (Client only)
  - [ ] No breaking changes (or documented)
  - [ ] WebSocket events documented (if applicable)

- [ ] **Security** (Critical!)
  - [ ] Authorization checks added (API)
  - [ ] Input validation implemented
  - [ ] No SQL injection vulnerabilities (API)
  - [ ] No XSS vulnerabilities (Client)

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Skipping Analysis
```
User: "Add a search feature"
Claude: *immediately starts coding*
```
**Why wrong:** Feature might already exist, or patterns might be different
**Do instead:** Read docs, analyze codebase, THEN plan

### ❌ Mistake 2: Not Reading Documentation
```
Claude: *starts implementing without reading features.md*
Claude: *creates feature that already exists*
```
**Why wrong:** Duplicates work, doesn't follow patterns
**Do instead:** Read features.md and architecture.md FIRST

### ❌ Mistake 3: Not Updating Documentation
```
Claude: *implements entire feature*
Claude: *forgets to update features.md*
Next Claude: *doesn't know feature exists*
```
**Why wrong:** Documentation becomes stale and useless
**Do instead:** Update docs in real-time as you work

### ❌ Mistake 4: No Tests
```
Claude: "Feature complete!"
User: "Where are the tests?"
Claude: "Uh..."
```
**Why wrong:** Untested code will break
**Do instead:** Write tests alongside code (especially API)

### ❌ Mistake 5: Ignoring Existing Patterns
```
Claude: *creates new state management pattern*
Claude: *doesn't follow Zustand convention*
```
**Why wrong:** Inconsistent codebase is hard to maintain
**Do instead:** Follow established patterns from architecture.md

### ❌ Mistake 6: Not Using Task Tool for Analysis
```
Claude: *uses Grep and Read directly*
Claude: *misses important context*
```
**Why wrong:** Manual search is incomplete and error-prone
**Do instead:** Use Task tool with Explore agent

### ❌ Mistake 7: Implementing Without Planning
```
Claude: *starts writing code immediately*
Claude: *realizes halfway through it won't work*
```
**Why wrong:** Wastes time, creates technical debt
**Do instead:** Create phase plan BEFORE coding

### ❌ Mistake 8: Forgetting Security (API)
```
Claude: *creates API endpoint*
Claude: *no authorization check*
User: *anyone can access anything*
```
**Why wrong:** CRITICAL SECURITY VULNERABILITY
**Do instead:** ALWAYS add authorization checks

---

## Step-by-Step Guide for New Task

### Example: "Add bulk delete feature for cards"

#### Step 1: Identify Scope
```
This affects BOTH client and API:
- API: Need endpoint for bulk delete
- Client: Need UI for selecting and deleting
```

#### Step 2: Read Documentation
```
Read:
✅ api/docs/features.md
   → Found: Bulk operations section
   → Status: Some bulk ops exist, need to check if delete exists

✅ api/docs/architecture.md
   → Understand: Fastify, TypeBox, layered architecture

✅ api/docs/claude.md
   → Follow: API workflow (DB → Repo → Service → Controller → Routes)

✅ client/docs/features.md
   → Found: Bulk actions toolbar exists
   → Status: Need to check if delete button exists

✅ client/docs/architecture.md
   → Understand: React, Zustand, TanStack Query

✅ client/docs/claude.md
   → Follow: Client workflow (Components → Hooks → State)
```

#### Step 3: Analyze Codebase
```
Use Task tool:

API Analysis:
"Analyze the API to check if bulk delete endpoint exists.
Look in src/modules/cards for bulk operations.
Check card.route.ts, card.controller.ts, card.service.ts.
Thoroughness: medium"

Client Analysis:
"Analyze the client to understand bulk actions implementation.
Look for BulkActionsToolbar and bulk operation components.
Check what bulk operations currently exist.
Thoroughness: medium"
```

#### Step 4: Review Analysis Results
```
API Findings:
- Bulk operations exist: move, assign, labels, due-date, archive
- DELETE /cards/bulk endpoint EXISTS but might need review
- Tests: No tests for bulk operations ⚠️

Client Findings:
- BulkActionsToolbar exists
- Individual bulk action components in src/components/card/bulk-actions/
- BulkDeleteAction.tsx EXISTS
- useBulkActions hook exists
- useSelectionStore for managing selected cards
```

#### Step 5: Create Plan
```
Create phase documents:

api/docs/bulk-delete-review/phase-1.md
- Verify bulk delete endpoint works
- Add tests (CRITICAL - currently missing)
- Add authorization check

client/docs/bulk-delete-review/phase-1.md
- Verify BulkDeleteAction component works
- Ensure proper error handling
- Add confirmation dialog
```

#### Step 6: Implement (API First)
```
1. Review endpoint: DELETE /cards/bulk
2. Add authorization check (CRITICAL!)
3. Write tests:
   - Unit tests for service
   - Integration tests for endpoint
4. Update api/docs/features.md
```

#### Step 7: Implement (Client)
```
1. Review BulkDeleteAction component
2. Ensure confirmation dialog exists
3. Test integration with API
4. Update client/docs/features.md
```

#### Step 8: Update Documentation
```
Update api/docs/features.md:
- Mark bulk delete as tested
- Add test count

Update client/docs/features.md:
- Verify bulk delete status
- Add notes about confirmation

Mark phase docs as done:
- phase-1-wip.md → phase-1-done.md
```

---

## Summary: The Perfect Workflow

### Every Single Time You Get a Task:

```
1. 📖 READ documentation (features.md + architecture.md + claude.md)
2. 🔍 ANALYZE codebase (Task tool with Explore agent)
3. 📝 PLAN the work (create phase-1.md)
4. 💻 IMPLEMENT (follow established patterns)
5. 🧪 TEST (write tests alongside code)
6. 📚 UPDATE documentation (features.md + phase docs)
7. ✅ VERIFY quality checklist
8. 🎉 MARK complete (phase-1-done.md)
```

### Remember:

- **Documentation is not optional** - It's required
- **Analysis before implementation** - Always
- **Tests are mandatory** - Especially for API
- **Security is critical** - Add authorization checks
- **Follow existing patterns** - Don't reinvent
- **Update in real-time** - Not at the end

---

## Quick Reference

### Client Work
```bash
# Documentation to read
client/docs/features.md       # What exists?
client/docs/architecture.md   # How is it built?
client/docs/claude.md         # How do I work on it?

# Where to create phase docs
client/docs/<feature-name>/phase-1.md
```

### API Work
```bash
# Documentation to read
api/docs/features.md          # What endpoints exist?
api/docs/architecture.md      # How is it built?
api/docs/claude.md            # How do I work on it?

# Where to create phase docs
api/docs/<feature-name>/phase-1.md

# Database migrations
npm run migrate:make feature_name
npm run migrate:latest
```

### Both Client and API
```bash
# Read ALL documentation
client/docs/features.md
client/docs/architecture.md
client/docs/claude.md
api/docs/features.md
api/docs/architecture.md
api/docs/claude.md

# Create phase docs in BOTH
client/docs/<feature-name>/phase-1.md
api/docs/<feature-name>/phase-1.md
```

---

## Final Reminders

### 🔴 Critical Rules - NEVER Break These:

1. **ALWAYS read documentation first**
2. **ALWAYS analyze before planning**
3. **ALWAYS update documentation with changes**
4. **ALWAYS write tests (especially API)**
5. **ALWAYS add authorization checks (API)**
6. **ALWAYS follow existing patterns**

### 🎯 Success Criteria:

You've done a good job when:
- Documentation is up-to-date
- Tests are written and passing
- Security is not compromised
- Patterns are consistent
- Future Claude can understand what you did

### 💡 Pro Tips:

- Use Task tool liberally for analysis
- Don't guess - always check the docs
- Update docs as you work, not after
- When in doubt, ask the user
- Security > Speed > Features

---

**Remember: The goal is not just to make features work, but to make the codebase maintainable, secure, and well-documented for everyone who comes after you.** 🚀

Good luck, and happy coding! 🤝
