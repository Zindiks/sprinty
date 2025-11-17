# Board Templates - Implementation Phases

## Quick Reference Guide

**Total Duration:** 2 weeks (15 days)
**Team Size:** 1-2 developers

---

## Phase 1: Database & Core Backend ⚙️
**Duration:** 3 days | **Days 1-3**

### Goals
- Set up database infrastructure for templates
- Build core CRUD API endpoints

### Tasks Checklist
- [ ] Create database migration for `board_templates` table
- [ ] Define Drizzle schema (`api/src/db/schemas/board-templates.ts`)
- [ ] Create module structure: `api/src/modules/templates/`
- [ ] Implement template service (CRUD operations)
- [ ] Build API routes and controllers
- [ ] Add authentication and authorization middleware
- [ ] Test API endpoints with Postman/Thunder Client

### Key Files Created
```
api/src/db/migrations/20250117000000_create_board_templates_table.ts
api/src/db/schemas/board-templates.ts
api/src/modules/templates/template.schema.ts
api/src/modules/templates/template.service.ts
api/src/modules/templates/template.route.ts
api/src/modules/templates/template.controller.ts
```

### Validation Criteria
✅ Migration runs successfully up and down
✅ Can create, read, update, delete templates via API
✅ Organization isolation enforced
✅ All API endpoints return correct status codes

---

## Phase 2: Template Seeding & Board Creation 🌱
**Duration:** 2 days | **Days 4-5**

### Goals
- Populate database with pre-built templates
- Enable board creation from templates

### Tasks Checklist
- [ ] Create seed file: `api/src/db/seeds/004-board-templates.ts`
- [ ] Add 5 system templates (Kanban, Scrum, Personal, Bug Tracking, Content Calendar)
- [ ] Implement `boardService.createFromTemplate()` method
- [ ] Add `POST /api/v1/boards/from-template` endpoint
- [ ] Use database transactions for atomicity
- [ ] Emit WebSocket events for real-time updates
- [ ] Test all pre-built templates

### Key Files Modified/Created
```
api/src/db/seeds/004-board-templates.ts
api/src/modules/boards/board.service.ts (new method)
api/src/modules/boards/board.route.ts (new endpoint)
api/src/modules/boards/board.controller.ts (new handler)
```

### Validation Criteria
✅ All 5 templates seeded in database
✅ Can create boards from each template
✅ Lists created in correct order
✅ Example cards created when requested
✅ WebSocket events fire correctly

---

## Phase 3: Save Board as Template 💾
**Duration:** 2 days | **Days 6-7**

### Goals
- Allow users to convert existing boards to templates

### Tasks Checklist
- [ ] Implement `templateService.createFromBoard()` method
- [ ] Add `POST /api/v1/templates/from-board` endpoint
- [ ] Validate user owns the board being converted
- [ ] Transform board structure to template JSON
- [ ] Handle with/without example cards option
- [ ] Test custom template creation
- [ ] Verify organization_id correctly set

### Key Files Modified/Created
```
api/src/modules/templates/template.service.ts (new method)
api/src/modules/templates/template.route.ts (new endpoint)
api/src/modules/templates/template.controller.ts (new handler)
```

### Validation Criteria
✅ Board converts to template successfully
✅ Template structure JSON matches board
✅ Custom templates are organization-specific
✅ Cannot convert other organization's boards

---

## Phase 4: Frontend Hooks & API Integration 🔗
**Duration:** 2 days | **Days 8-9**

### Goals
- Build React Query hooks for template operations
- Set up API client functions

### Tasks Checklist
- [ ] Add template endpoints to API client
- [ ] Create `useTemplates` hook (`client/src/hooks/useTemplates.ts`)
- [ ] Implement queries: `getTemplates`, `getTemplate`
- [ ] Implement mutations: `createBoardFromTemplate`, `createTemplateFromBoard`, `deleteTemplate`, `updateTemplate`
- [ ] Add TypeScript types to `client/src/types/types.tsx`
- [ ] Set up query invalidation and caching
- [ ] Test hooks in isolation

### Key Files Created
```
client/src/hooks/useTemplates.ts
client/src/types/types.tsx (add Template types)
client/src/lib/api.ts (add template endpoints)
```

### Validation Criteria
✅ API calls succeed from frontend
✅ React Query caching works correctly
✅ Mutations invalidate relevant queries
✅ Type safety enforced across frontend

---

## Phase 5: Template Gallery UI 🎨
**Duration:** 3 days | **Days 10-12**

### Goals
- Build the main template selection interface
- Replace existing board creation modal

### Tasks Checklist
- [ ] Create `TemplateGalleryModal` component
- [ ] Create `TemplateCard` component
- [ ] Implement tabs: Pre-built, Custom, Blank Board
- [ ] Add template grid layout (responsive)
- [ ] Add search/filter functionality
- [ ] Show template preview (list names)
- [ ] Board title input after selection
- [ ] "Include example cards" toggle
- [ ] Update `CreateBoardModal` to use gallery
- [ ] Add loading states and error handling
- [ ] Style with existing UI library

### Key Files Created/Modified
```
client/src/components/templates/TemplateGalleryModal.tsx
client/src/components/templates/TemplateCard.tsx
client/src/components/board/CreateBoardModal.tsx (updated)
```

### Validation Criteria
✅ Gallery opens when creating board
✅ Can browse pre-built templates
✅ Can browse custom templates
✅ Can select template and create board
✅ Board redirects to new board view
✅ Responsive design works on mobile
✅ Loading and error states display correctly

---

## Phase 6: Save as Template UI & Management 📋
**Duration:** 2 days | **Days 13-14**

### Goals
- Complete the custom template workflow
- Add template management interface

### Tasks Checklist
- [ ] Create `SaveAsTemplateDialog` component
- [ ] Add "Save as Template" to board settings menu
- [ ] Implement icon/emoji picker
- [ ] Create `TemplatesPage` for management (optional but recommended)
- [ ] Create `EditTemplateDialog` component
- [ ] Add delete confirmation dialog
- [ ] Add toast notifications for all operations
- [ ] Add navigation link to templates page
- [ ] Test full custom template workflow

### Key Files Created
```
client/src/components/templates/SaveAsTemplateDialog.tsx
client/src/components/templates/EditTemplateDialog.tsx
client/src/pages/templates/TemplatesPage.tsx
client/src/components/board/BoardHeader.tsx (add menu item)
```

### Validation Criteria
✅ Can save board as template from board view
✅ Template appears in gallery immediately
✅ Can edit custom template name, description, icon
✅ Can delete custom templates
✅ Cannot delete system templates
✅ All operations show success/error feedback

---

## Phase 7: Testing, Polish & Documentation ✨
**Duration:** 1 day | **Day 14**

### Goals
- Comprehensive testing and bug fixes
- Polish UI/UX
- Update documentation

### Tasks Checklist
- [ ] End-to-end testing of full workflow
- [ ] Test all 5 pre-built templates
- [ ] Test custom template CRUD operations
- [ ] Security testing (organization isolation)
- [ ] Performance testing (large templates)
- [ ] Responsive design testing (mobile, tablet, desktop)
- [ ] Accessibility testing (keyboard nav, screen readers)
- [ ] Fix any bugs found
- [ ] Add empty states ("No custom templates")
- [ ] Code review and refactoring
- [ ] Update user documentation
- [ ] Add code comments
- [ ] Update README

### Validation Criteria
✅ No critical bugs
✅ All user flows work smoothly
✅ Performance acceptable (< 1s board creation)
✅ Accessible to keyboard and screen reader users
✅ Documentation complete
✅ Code reviewed and approved

---

## Daily Standup Checkpoints

### Week 1
- **Day 1:** Migration complete, schema defined
- **Day 2:** Template CRUD API working
- **Day 3:** API testing complete, Phase 1 done ✓
- **Day 4:** Templates seeded, board creation API working
- **Day 5:** Phase 2 done ✓
- **Day 6:** Save as template API working
- **Day 7:** Phase 3 done ✓

### Week 2
- **Day 8:** Frontend hooks implemented
- **Day 9:** Phase 4 done ✓, API integration tested
- **Day 10:** Template gallery modal UI built
- **Day 11:** Template selection and board creation working
- **Day 12:** Phase 5 done ✓
- **Day 13:** Save as template UI complete, management page built
- **Day 14:** Phase 6 & 7 done ✓, feature ready for production

---

## Risk Mitigation Checklist

### Before Starting
- [ ] Confirm database backup strategy
- [ ] Ensure local dev environment matches production Postgres version
- [ ] Review existing board creation code thoroughly

### During Development
- [ ] Test migrations in development before staging
- [ ] Keep migration rollback script ready
- [ ] Monitor database query performance
- [ ] Regular commits with clear messages
- [ ] Daily progress updates to team

### Before Deployment
- [ ] Run full test suite
- [ ] Test on staging environment
- [ ] Database migration dry-run on staging
- [ ] Performance testing with realistic data
- [ ] Accessibility audit
- [ ] Security review
- [ ] Backup production database

---

## Resource Requirements

### Development
- **Developers:** 1-2 full-stack or 1 backend + 1 frontend
- **Designer:** Optional (use existing design system)
- **QA:** Recommended for Phase 7

### Infrastructure
- **Database:** No changes needed (existing PostgreSQL)
- **API:** No new services (extends existing Fastify API)
- **Frontend:** No new build tools (existing React setup)

### Third-Party Dependencies
- **New:** Potentially emoji picker library (e.g., `emoji-picker-react`)
- **Existing:** All other dependencies already in project

---

## Success Metrics (Track Post-Launch)

### Week 1
- [ ] 100+ boards created from templates
- [ ] Each pre-built template used at least once
- [ ] 0 critical bugs reported

### Month 1
- [ ] 60% of new boards created from templates
- [ ] 20% of organizations create custom template
- [ ] < 1 second board creation latency (p95)
- [ ] 10+ custom templates created

### Month 3
- [ ] 75% of new boards from templates
- [ ] 50+ custom templates across all organizations
- [ ] Feature adoption rate above 80%

---

## Quick Start Commands

### Backend Setup
```bash
# Run migration
npm run db:migrate

# Run seed
npm run db:seed

# Start API
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Testing
```bash
# Backend tests
npm run test

# Frontend tests
cd client
npm run test

# E2E tests
npm run test:e2e
```

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| TBD | Use JSONB for template structure | Flexibility for varying list/card configurations |
| TBD | Emoji for icons initially | Simple implementation, can upgrade to icon library later |
| TBD | No limit on custom templates | Avoid artificial constraints, monitor usage |
| TBD | 5 pre-built templates for MVP | Covers most common use cases without overwhelming users |
| TBD | Transactions for board creation | Ensure data consistency (board + lists + cards atomic) |

---

## Contact & Support

**Project Lead:** TBD
**Backend Lead:** TBD
**Frontend Lead:** TBD

**Slack Channel:** #board-templates
**Documentation:** Link TBD

---

## Appendix: Pre-built Template Specifications

### 1. Kanban Board 📋
- **Lists:** To Do, In Progress, Done
- **Example Cards:** 1 in "To Do"

### 2. Scrum Board 🏃
- **Lists:** Backlog, Sprint, In Progress, Review, Done
- **Example Cards:** None

### 3. Personal Tasks ✅
- **Lists:** Today, Tomorrow, This Week, Later
- **Example Cards:** None

### 4. Bug Tracking 🐛
- **Lists:** New, In Progress, Testing, Closed
- **Example Cards:** None

### 5. Content Calendar 📝
- **Lists:** Ideas, Writing, Review, Published
- **Example Cards:** None

---

**Last Updated:** 2025-11-17
**Version:** 1.0
**Status:** Ready for Implementation
