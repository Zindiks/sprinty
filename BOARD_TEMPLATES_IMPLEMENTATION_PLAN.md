# Board Templates Implementation Plan

## Overview
Add pre-built and custom board templates to allow users to quickly create boards from templates instead of setting up structure from scratch.

**Estimated Effort:** 2 weeks
**Priority:** 🟡 High
**Dependencies:** None

---

## Current System Analysis

### Existing Structure
- **Boards:** UUID-based, belong to organizations, have title & description
- **Lists:** Belong to boards, have title & order (integer for positioning)
- **Cards:** Belong to lists (cascade delete through hierarchy)
- **API Pattern:** RESTful with WebSocket real-time updates
- **Frontend:** React Query hooks + TypeScript, Dialog-based modals

### Key Files
- Database Schemas: `api/src/db/schemas/{boards,lists}.ts`
- Migrations: `api/src/db/migrations/2025011222100*`
- Backend Routes: `api/src/modules/{boards,lists}/*.route.ts`
- Frontend Hooks: `client/src/hooks/{useBoards,useLists}.ts`
- UI Components: `client/src/components/board/CreateBoardModal.tsx`

---

## Database Schema Design

### New Table: `board_templates`

```typescript
// api/src/db/schemas/board-templates.ts
export const board_templates = pgTable('board_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 30 }).notNull(), // 'pre-built' | 'custom'
  icon: varchar('icon', { length: 20 }), // emoji or icon identifier
  is_system: boolean('is_system').default(false).notNull(), // true for pre-built templates
  organization_id: uuid('organization_id').references(() => organizations.id, {
    onDelete: 'cascade',
  }), // null for system templates, populated for custom
  created_by: uuid('created_by').references(() => users.id, {
    onDelete: 'set null',
  }),
  structure: jsonb('structure').notNull(), // JSON definition of lists and example cards
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
```

### Template Structure JSON Schema

```typescript
{
  "lists": [
    {
      "title": "To Do",
      "order": 0,
      "exampleCards": [
        {
          "title": "Example task 1",
          "description": "This is an example card"
        },
        {
          "title": "Example task 2",
          "description": "Another example"
        }
      ]
    },
    {
      "title": "In Progress",
      "order": 1,
      "exampleCards": []
    },
    {
      "title": "Done",
      "order": 2,
      "exampleCards": []
    }
  ]
}
```

### Indexes
```sql
CREATE INDEX idx_board_templates_category ON board_templates(category);
CREATE INDEX idx_board_templates_organization ON board_templates(organization_id);
CREATE INDEX idx_board_templates_system ON board_templates(is_system);
```

---

## API Design

### Endpoints

#### 1. Get All Templates
```
GET /api/v1/templates?organization_id={id}
```
**Response:**
```typescript
{
  system: Template[], // Pre-built templates (is_system=true)
  custom: Template[]  // Organization's custom templates
}
```

#### 2. Get Template by ID
```
GET /api/v1/templates/:id
```
**Response:** Full template with structure

#### 3. Create Board from Template
```
POST /api/v1/boards/from-template
Body: {
  template_id: string,
  organization_id: string,
  board_title?: string,        // Optional override
  include_example_cards: boolean
}
```
**Process:**
1. Fetch template structure
2. Create board
3. Create lists based on template.structure.lists
4. Optionally create example cards
5. Return full board with lists

#### 4. Save Board as Template
```
POST /api/v1/templates/from-board
Body: {
  board_id: string,
  template_name: string,
  description?: string,
  category: string,
  icon?: string,
  include_cards_as_examples: boolean
}
```
**Process:**
1. Fetch board with all lists and cards
2. Transform to template structure JSON
3. Create custom template (organization_id set, is_system=false)

#### 5. Delete Custom Template
```
DELETE /api/v1/templates/:id
```
**Validation:** Only allow if template belongs to user's organization and is_system=false

#### 6. Update Custom Template
```
PUT /api/v1/templates/:id
Body: {
  name?: string,
  description?: string,
  icon?: string,
  structure?: TemplateStructure
}
```

---

## Pre-built System Templates

### 1. Kanban Board
```json
{
  "name": "Kanban Board",
  "description": "Classic three-column workflow",
  "category": "pre-built",
  "icon": "📋",
  "is_system": true,
  "organization_id": null,
  "structure": {
    "lists": [
      {
        "title": "To Do",
        "order": 0,
        "exampleCards": [
          {"title": "Plan project scope", "description": "Define goals and deliverables"}
        ]
      },
      {
        "title": "In Progress",
        "order": 1,
        "exampleCards": []
      },
      {
        "title": "Done",
        "order": 2,
        "exampleCards": []
      }
    ]
  }
}
```

### 2. Scrum Board
```json
{
  "name": "Scrum Board",
  "description": "Sprint-based agile workflow",
  "category": "pre-built",
  "icon": "🏃",
  "structure": {
    "lists": [
      {"title": "Backlog", "order": 0},
      {"title": "Sprint", "order": 1},
      {"title": "In Progress", "order": 2},
      {"title": "Review", "order": 3},
      {"title": "Done", "order": 4}
    ]
  }
}
```

### 3. Personal Tasks
```json
{
  "name": "Personal Tasks",
  "description": "Time-based task organization",
  "category": "pre-built",
  "icon": "✅",
  "structure": {
    "lists": [
      {"title": "Today", "order": 0},
      {"title": "Tomorrow", "order": 1},
      {"title": "This Week", "order": 2},
      {"title": "Later", "order": 3}
    ]
  }
}
```

### 4. Bug Tracking
```json
{
  "name": "Bug Tracking",
  "description": "Bug lifecycle management",
  "category": "pre-built",
  "icon": "🐛",
  "structure": {
    "lists": [
      {"title": "New", "order": 0},
      {"title": "In Progress", "order": 1},
      {"title": "Testing", "order": 2},
      {"title": "Closed", "order": 3}
    ]
  }
}
```

### 5. Content Calendar
```json
{
  "name": "Content Calendar",
  "description": "Content creation workflow",
  "category": "pre-built",
  "icon": "📝",
  "structure": {
    "lists": [
      {"title": "Ideas", "order": 0},
      {"title": "Writing", "order": 1},
      {"title": "Review", "order": 2},
      {"title": "Published", "order": 3}
    ]
  }
}
```

---

## Frontend Design

### 1. Template Gallery Modal Component
**File:** `client/src/components/templates/TemplateGalleryModal.tsx`

**Features:**
- Dialog/Modal that opens when creating a new board
- Tabs: "Pre-built Templates" | "Custom Templates" | "Blank Board"
- Template cards with:
  - Icon
  - Name
  - Description
  - Preview of lists (e.g., "3 lists: To Do, In Progress, Done")
  - "Use Template" button
- Search/filter by category
- Preview drawer showing full structure before creation

**User Flow:**
1. User clicks "Create Board" button
2. Template gallery modal opens
3. User browses pre-built or custom templates
4. User clicks template → board title input appears
5. Toggle: "Include example cards"
6. User confirms → board created → redirects to board view

### 2. Save as Template Feature
**Location:** Board settings menu or board header dropdown

**UI:**
- "Save as Template" menu item
- Opens dialog with:
  - Template name input
  - Description textarea
  - Icon/emoji picker
  - Checkbox: "Include existing cards as examples"
  - Save button
- Success toast: "Template saved! Find it in Custom Templates."

### 3. Template Management Page
**File:** `client/src/pages/templates/TemplatesPage.tsx`

**Features:**
- List all custom templates for organization
- Edit template (name, description, icon)
- Delete template (with confirmation)
- Preview template structure
- "Create Board" button for each template

### 4. Updated CreateBoardModal
**Changes to:** `client/src/components/board/CreateBoardModal.tsx`

- Replace simple form with Template Gallery
- Keep "Create Blank Board" option
- Add template selection flow

---

## TypeScript Types

### Frontend Types
```typescript
// client/src/types/types.tsx

export interface Template {
  id: string;
  name: string;
  description?: string;
  category: 'pre-built' | 'custom';
  icon?: string;
  is_system: boolean;
  organization_id?: string;
  created_by?: string;
  structure: TemplateStructure;
  created_at: string;
  updated_at: string;
}

export interface TemplateStructure {
  lists: TemplateList[];
}

export interface TemplateList {
  title: string;
  order: number;
  exampleCards?: TemplateCard[];
}

export interface TemplateCard {
  title: string;
  description?: string;
}

export interface CreateBoardFromTemplateRequest {
  template_id: string;
  organization_id: string;
  board_title?: string;
  include_example_cards: boolean;
}

export interface CreateTemplateFromBoardRequest {
  board_id: string;
  template_name: string;
  description?: string;
  category: string;
  icon?: string;
  include_cards_as_examples: boolean;
}
```

### Backend Schemas
```typescript
// api/src/modules/templates/template.schema.ts

export type BaseTemplate = {
  name: string;
  description?: string;
  category: string;
  icon?: string;
  structure: TemplateStructure;
};

export type CreateTemplate = BaseTemplate & {
  organization_id?: string;
  is_system: boolean;
};

export type CreateBoardFromTemplate = {
  template_id: string;
  organization_id: string;
  board_title?: string;
  include_example_cards: boolean;
};

export type CreateTemplateFromBoard = {
  board_id: string;
  template_name: string;
  description?: string;
  category: string;
  icon?: string;
  include_cards_as_examples: boolean;
};
```

---

## Implementation Phases

### PHASE 1: Database & Core Backend (Days 1-3)
**Goal:** Set up database schema and core template CRUD operations

#### Tasks:
1. **Database Migration**
   - Create migration: `20250117000000_create_board_templates_table.ts`
   - Define `board_templates` table with all columns
   - Add indexes for performance
   - Test migration up/down

2. **Database Schema**
   - Create `api/src/db/schemas/board-templates.ts`
   - Define Drizzle schema matching migration
   - Export type inference

3. **Backend Module Structure**
   - Create `api/src/modules/templates/` directory
   - Files: `template.schema.ts`, `template.service.ts`, `template.route.ts`, `template.controller.ts`

4. **Template Service**
   - `getAll(organization_id)` - Fetch system + custom templates
   - `getById(id)` - Get single template
   - `create(input)` - Create custom template
   - `update(input, id)` - Update custom template
   - `delete(id)` - Delete custom template (validation: custom only)

5. **Template Routes & Controller**
   - Define all 6 API endpoints
   - Add authentication middleware
   - Validate organization ownership for custom templates

6. **Testing**
   - Test template CRUD via API
   - Verify organization isolation

**Deliverables:**
- ✅ Database migration executed
- ✅ Template API endpoints functional
- ✅ Basic CRUD operations working

---

### PHASE 2: Template Seeding & Board Creation (Days 4-5)
**Goal:** Add pre-built templates and implement "create board from template"

#### Tasks:
1. **Seed Pre-built Templates**
   - Create `api/src/db/seeds/004-board-templates.ts`
   - Add 5 system templates:
     - Kanban Board
     - Scrum Board
     - Personal Tasks
     - Bug Tracking
     - Content Calendar
   - Run seed script

2. **Create Board from Template Service**
   - New method: `boardService.createFromTemplate(input)`
   - Logic:
     1. Fetch template by ID
     2. Create board with title (default to template name)
     3. Create lists from template.structure.lists (ordered)
     4. If `include_example_cards=true`, create cards
   - Use database transaction for atomicity

3. **API Endpoint**
   - `POST /api/v1/boards/from-template`
   - Call new service method
   - Return full board with lists (same as regular board creation)

4. **WebSocket Events**
   - Emit `emitBoardCreated()` after template board creation
   - Ensure real-time updates work

5. **Testing**
   - Test creating boards from each system template
   - Verify lists and example cards created correctly
   - Test with/without example cards

**Deliverables:**
- ✅ 5 pre-built templates seeded in database
- ✅ API endpoint creates boards from templates
- ✅ Lists and optional cards generated correctly

---

### PHASE 3: Save Board as Template (Days 6-7)
**Goal:** Allow users to convert existing boards into reusable templates

#### Tasks:
1. **Save as Template Service**
   - New method: `templateService.createFromBoard(input)`
   - Logic:
     1. Fetch board with all lists (ordered)
     2. Fetch cards if `include_cards_as_examples=true`
     3. Transform to TemplateStructure JSON
     4. Create template record with organization_id and is_system=false

2. **API Endpoint**
   - `POST /api/v1/templates/from-board`
   - Validate user has access to board
   - Call service method

3. **Validation**
   - Ensure board belongs to user's organization
   - Validate template name is unique within organization
   - Limit description length

4. **Testing**
   - Create board manually → save as template
   - Verify structure JSON matches board
   - Test with/without example cards

**Deliverables:**
- ✅ API endpoint converts boards to templates
- ✅ Custom templates saved correctly
- ✅ JSON structure validated

---

### PHASE 4: Frontend Hooks & API Integration (Days 8-9)
**Goal:** Create React Query hooks for template operations

#### Tasks:
1. **API Client Updates**
   - Add template endpoints to `client/src/lib/api.ts` or API client
   - Define request/response types

2. **useTemplates Hook**
   - File: `client/src/hooks/useTemplates.ts`
   - Queries:
     - `getTemplates(organization_id)` - Fetch all templates
     - `getTemplate(id)` - Fetch single template
   - Mutations:
     - `createBoardFromTemplate(input)`
     - `createTemplateFromBoard(input)`
     - `deleteTemplate(id)`
     - `updateTemplate(id, input)`
   - Query invalidation after mutations

3. **TypeScript Types**
   - Add Template types to `client/src/types/types.tsx`
   - Ensure consistency with backend schemas

4. **Testing**
   - Test hooks in isolation
   - Verify query caching works
   - Test mutation optimistic updates

**Deliverables:**
- ✅ Template API client functions
- ✅ React Query hooks functional
- ✅ Type safety across frontend

---

### PHASE 5: Template Gallery UI (Days 10-12)
**Goal:** Build the main template selection interface

#### Tasks:
1. **TemplateGalleryModal Component**
   - File: `client/src/components/templates/TemplateGalleryModal.tsx`
   - Features:
     - Dialog/Modal with tabs (Pre-built, Custom, Blank)
     - Grid of template cards
     - Template card shows: icon, name, description, list preview
     - Search/filter functionality
     - Template preview drawer (optional)
   - State management: selected template, board title input

2. **Template Card Component**
   - File: `client/src/components/templates/TemplateCard.tsx`
   - Props: template, onSelect
   - Display: icon, name, description, "X lists" badge
   - Hover effect, selected state

3. **Board Title Input Flow**
   - After selecting template, show input for board name
   - Default to template name
   - Toggle: "Include example cards"
   - "Create Board" button

4. **Integration with CreateBoardModal**
   - Update `client/src/components/board/CreateBoardModal.tsx`
   - Replace simple form with TemplateGalleryModal
   - Keep "Create Blank Board" as a tab/option

5. **Styling**
   - Use existing UI library (shadcn/ui or similar)
   - Responsive grid (2-4 columns)
   - Icons: emoji or icon library (Lucide React)

6. **Loading & Error States**
   - Skeleton loading while fetching templates
   - Error toast if template fetch fails
   - Disabled state during board creation

**Deliverables:**
- ✅ Template gallery modal functional
- ✅ Users can browse and select templates
- ✅ Board creation from template works end-to-end

---

### PHASE 6: Save as Template UI & Management (Days 13-14)
**Goal:** Complete the custom template workflow

#### Tasks:
1. **Save as Template Dialog**
   - File: `client/src/components/templates/SaveAsTemplateDialog.tsx`
   - Inputs:
     - Template name (required)
     - Description (optional)
     - Icon/emoji picker (optional)
     - Checkbox: "Include cards as examples"
   - Validation and submit

2. **Integration in Board View**
   - Add "Save as Template" option to board settings menu
   - Location: Board header dropdown or settings gear icon
   - Opens SaveAsTemplateDialog

3. **Template Management Page** (Optional but recommended)
   - File: `client/src/pages/templates/TemplatesPage.tsx`
   - Route: `/templates`
   - Features:
     - List all custom templates for organization
     - Edit template (name, description, icon)
     - Delete template with confirmation dialog
     - Preview structure
     - "Create Board" button
   - Add navigation link in sidebar

4. **Edit Template Dialog**
   - File: `client/src/components/templates/EditTemplateDialog.tsx`
   - Allow editing name, description, icon
   - Note: Structure editing is complex - defer to future version

5. **Delete Confirmation**
   - Dialog: "Are you sure you want to delete this template?"
   - Show template name
   - Confirm button

6. **Success/Error Feedback**
   - Toast notifications for all operations
   - Error handling for API failures

**Deliverables:**
- ✅ Users can save boards as templates
- ✅ Custom templates manageable (edit, delete)
- ✅ Full workflow tested end-to-end

---

### PHASE 7: Testing, Polish & Documentation (Day 14)
**Goal:** Ensure quality and prepare for release

#### Tasks:
1. **End-to-End Testing**
   - Test full workflow: gallery → select → create → save as template → reuse
   - Test all 5 pre-built templates
   - Test custom template CRUD
   - Test edge cases: empty boards, boards with many lists

2. **Permission & Security Testing**
   - Verify organization isolation (users can't access other orgs' templates)
   - Test custom template deletion (only own organization)
   - Validate input sanitization

3. **Performance Testing**
   - Test with large template structures (10+ lists, 50+ cards)
   - Verify database query performance
   - Check frontend rendering performance

4. **UI/UX Polish**
   - Responsive design testing (mobile, tablet, desktop)
   - Accessibility: keyboard navigation, screen reader support
   - Animation and transitions
   - Empty states: "No custom templates yet"

5. **Documentation**
   - Update user documentation (if exists)
   - Add code comments for complex logic
   - Document API endpoints (Swagger/OpenAPI if used)
   - Update README with new feature

6. **Bug Fixes**
   - Address any issues found during testing
   - Code review and refactoring

**Deliverables:**
- ✅ Feature fully tested
- ✅ No critical bugs
- ✅ Documentation complete
- ✅ Ready for production deployment

---

## Technical Considerations

### Database
- **JSONB Performance:** Structure column uses JSONB for flexibility. Postgres handles JSONB efficiently, but avoid deeply nested structures.
- **Indexing:** Add GIN index if querying within structure becomes necessary.
- **Migrations:** Test rollback thoroughly since JSONB changes can be tricky.

### Backend
- **Transactions:** Use database transactions when creating boards from templates (board + lists + cards).
- **Validation:** Validate JSON structure against schema to prevent malformed templates.
- **Rate Limiting:** Consider rate limiting template creation to prevent abuse.

### Frontend
- **Caching:** React Query caches templates - invalidate on creation/update/delete.
- **Optimistic Updates:** Use optimistic updates for better UX (show template immediately, rollback on error).
- **Icon Picker:** Use library like `emoji-picker-react` or `lucide-react` for icon selection.

### WebSocket
- **Real-time Updates:** When board is created from template, emit `boardCreated` event so other users see it immediately.
- **Template Updates:** Consider emitting template events if multiple users manage templates (lower priority).

### Security
- **Authorization:** Always verify user belongs to organization before accessing custom templates.
- **Input Sanitization:** Sanitize template names and descriptions to prevent XSS.
- **System Template Protection:** Ensure is_system templates cannot be modified/deleted via API.

### Migration Strategy
- **Seed Data:** Run seed script to populate pre-built templates in all environments (dev, staging, prod).
- **Rollback Plan:** If issues arise, can disable feature flag and roll back migration.

---

## Success Metrics

### User Adoption
- **Target:** 60% of new boards created from templates within 30 days
- **Metric:** Track `from-template` endpoint usage vs regular board creation

### Template Usage
- **Target:** Each pre-built template used at least 10 times in first month
- **Metric:** Count boards created per template_id

### Custom Templates
- **Target:** 20% of organizations create at least 1 custom template
- **Metric:** Count distinct organization_ids in custom templates

### Performance
- **Target:** Board creation from template < 1 second (p95)
- **Metric:** API endpoint latency monitoring

---

## Future Enhancements (Post-MVP)

1. **Template Marketplace**
   - Public template gallery
   - Community-contributed templates
   - Template ratings and reviews

2. **Advanced Template Editing**
   - Visual editor for template structure
   - Drag-and-drop list ordering
   - Edit example cards directly

3. **Template Variables**
   - Parameterized templates (e.g., sprint number, date range)
   - User fills in variables during board creation

4. **Template Sharing**
   - Share templates across organizations
   - Export/import templates as JSON files

5. **Template Analytics**
   - Track which templates are most popular
   - A/B test template designs

6. **AI-Generated Templates**
   - Analyze user's workflow and suggest custom templates
   - Auto-generate templates from board usage patterns

7. **Template Versioning**
   - Keep history of template changes
   - Rollback to previous versions

---

## Dependencies & Prerequisites

### Backend Dependencies
- Existing: Drizzle ORM, Fastify, TypeBox
- New: None (uses existing stack)

### Frontend Dependencies
- Existing: React, React Query, TypeScript
- New (potential):
  - `emoji-picker-react` or similar for icon picker
  - Enhanced UI components if needed (likely already have via shadcn/ui)

### Database
- PostgreSQL with JSONB support (already in use)

### DevOps
- Database migration execution in CI/CD
- Seed script execution in deployment pipeline

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| JSONB structure becomes unwieldy for complex templates | Medium | Low | Validate structure size, limit nesting depth |
| Performance issues with large templates (100+ lists) | High | Low | Add pagination, limit template size |
| User confusion with too many templates | Medium | Medium | Categorization, search, featured templates |
| Custom templates create org-specific dependencies | Low | Low | Clear UX about template ownership |
| WebSocket events overload with many template creations | Medium | Low | Rate limiting, batch events |

---

## Open Questions

1. **Icon Library:** Use emoji (simple) or icon library like Lucide (more professional)?
   - **Recommendation:** Start with emoji for simplicity, add icon library later.

2. **Template Limits:** Should we limit number of custom templates per organization?
   - **Recommendation:** Start with no limit, monitor usage.

3. **Example Card Limit:** Max number of example cards per list?
   - **Recommendation:** 5 cards per list to keep templates lightweight.

4. **Template Preview:** Should users see a visual preview of the board before creation?
   - **Recommendation:** Phase 1: text preview ("3 lists: To Do, In Progress, Done"). Phase 2: visual preview.

5. **Template Categories:** Allow custom categories for custom templates?
   - **Recommendation:** Start with single "Custom" category, add categories in future.

---

## Timeline Summary

| Phase | Duration | Key Deliverable |
|-------|----------|-----------------|
| Phase 1 | 3 days | Database & Core Backend |
| Phase 2 | 2 days | Pre-built Templates & Board Creation |
| Phase 3 | 2 days | Save Board as Template |
| Phase 4 | 2 days | Frontend Hooks & API Integration |
| Phase 5 | 3 days | Template Gallery UI |
| Phase 6 | 2 days | Save as Template UI & Management |
| Phase 7 | 1 day | Testing, Polish & Documentation |
| **Total** | **15 days** | **~2 weeks** |

---

## Conclusion

This implementation plan provides a comprehensive roadmap for adding board templates to Sprinty. The phased approach ensures incremental progress with testable deliverables at each stage. The feature leverages the existing architecture and follows established patterns in the codebase, minimizing technical debt.

**Next Steps:**
1. Review and approve this plan
2. Create tickets/issues for each phase
3. Begin Phase 1 implementation
4. Regular check-ins after each phase completion
