# Card Task Details Implementation Plan

> **Created:** 2025-11-17
> **Status:** Planning Phase
> **Priority:** High - Core functionality from FEATURES.md

---

## Table of Contents

1. [Overview](#overview)
2. [Current State](#current-state)
3. [Features to Implement](#features-to-implement)
4. [Database Schema Design](#database-schema-design)
5. [API Design](#api-design)
6. [Implementation Phases](#implementation-phases)
7. [Testing Strategy](#testing-strategy)
8. [Migration Strategy](#migration-strategy)

---

## Overview

This document outlines the comprehensive plan to implement missing card task detail features as identified in `INCOMPLETE_FEATURES_AND_ROADMAP.md`. These features are essential to fulfill the promise made in `FEATURES.md` about "detailed information about each task, such as descriptions, due dates, and more."

### Goals
- Implement all missing card detail features
- Maintain backward compatibility
- Follow existing code patterns and conventions
- Ensure proper database migrations
- Write comprehensive tests

---

## Current State

### Existing Card Schema

**Database Table: `cards`**
```sql
- id (UUID, primary key)
- list_id (UUID, foreign key → lists)
- title (string, required)
- order (integer, required)
- description (text, optional)
- status (string, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

**Existing Functionality:**
- ✅ Create cards
- ✅ Update card title
- ✅ Update card order (drag & drop)
- ✅ Delete cards
- ✅ Basic description field
- ✅ Status field

---

## Features to Implement

### 1. Due Dates ⏰
- **Description:** Add ability to set due dates for cards
- **Fields:** `due_date` (timestamp, nullable)
- **Additional:** `is_overdue` (computed field)
- **Priority:** High

### 2. Task Assignees 👥
- **Description:** Assign users to cards
- **Implementation:** Many-to-many relationship (cards ↔ users)
- **New Table:** `card_assignees`
- **Priority:** High

### 3. Priority Levels 🎯
- **Description:** Set priority for cards (Low, Medium, High, Critical)
- **Field:** `priority` (enum)
- **Priority:** Medium

### 4. Labels/Tags 🏷️
- **Description:** Color-coded labels for categorization
- **Implementation:** Many-to-many relationship (cards ↔ labels)
- **New Tables:** `labels`, `card_labels`
- **Priority:** High

### 5. Checklists ✅
- **Description:** Sub-tasks within cards
- **Implementation:** One-to-many relationship (cards → checklist_items)
- **New Table:** `checklist_items`
- **Features:** Title, completed status, order
- **Priority:** Medium

### 6. File Attachments 📎
- **Description:** Attach files to cards
- **Implementation:** One-to-many relationship (cards → attachments)
- **New Table:** `attachments`
- **Storage:** Local filesystem (future: S3)
- **Priority:** Medium

### 7. Comments/Discussions 💬
- **Description:** Discussion threads on cards
- **Implementation:** One-to-many relationship (cards → comments)
- **New Table:** `comments`
- **Features:** Rich text, mentions (@user), timestamps
- **Priority:** High

### 8. Activity History 📜
- **Description:** Audit trail of all card changes
- **Implementation:** One-to-many relationship (cards → activities)
- **New Table:** `card_activities`
- **Priority:** Medium

---

## Database Schema Design

### Phase 1: Core Card Enhancements

#### 1.1 Update `cards` table

**Migration:** `20250117_add_card_details_fields.ts`

```typescript
table.timestamp("due_date").nullable();
table.enum("priority", ["low", "medium", "high", "critical"]).defaultTo("medium");
```

#### 1.2 Create `card_assignees` table

**Migration:** `20250117_create_card_assignees_table.ts`

```typescript
table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
table.uuid("card_id").notNullable()
  .references("id").inTable("cards").onDelete("CASCADE");
table.uuid("user_id").notNullable()
  .references("id").inTable("users").onDelete("CASCADE");
table.timestamp("assigned_at").defaultTo(knex.fn.now());
table.uuid("assigned_by").nullable()
  .references("id").inTable("users");
table.unique(["card_id", "user_id"]);
```

### Phase 2: Labels & Tags

#### 2.1 Create `labels` table

**Migration:** `20250117_create_labels_table.ts`

```typescript
table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
table.uuid("board_id").notNullable()
  .references("id").inTable("boards").onDelete("CASCADE");
table.string("name", 50).notNullable();
table.string("color", 7).notNullable(); // Hex color (#FF5733)
table.timestamp("created_at").defaultTo(knex.fn.now());
table.unique(["board_id", "name"]);
```

#### 2.2 Create `card_labels` junction table

**Migration:** `20250117_create_card_labels_table.ts`

```typescript
table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
table.uuid("card_id").notNullable()
  .references("id").inTable("cards").onDelete("CASCADE");
table.uuid("label_id").notNullable()
  .references("id").inTable("labels").onDelete("CASCADE");
table.timestamp("added_at").defaultTo(knex.fn.now());
table.unique(["card_id", "label_id"]);
```

### Phase 3: Checklists

#### 3.1 Create `checklist_items` table

**Migration:** `20250117_create_checklist_items_table.ts`

```typescript
table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
table.uuid("card_id").notNullable()
  .references("id").inTable("cards").onDelete("CASCADE");
table.string("title", 255).notNullable();
table.boolean("completed").defaultTo(false);
table.integer("order").notNullable();
table.uuid("completed_by").nullable()
  .references("id").inTable("users");
table.timestamp("completed_at").nullable();
table.timestamp("created_at").defaultTo(knex.fn.now());
table.timestamp("updated_at").defaultTo(knex.fn.now());
```

### Phase 4: Attachments

#### 4.1 Create `attachments` table

**Migration:** `20250117_create_attachments_table.ts`

```typescript
table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
table.uuid("card_id").notNullable()
  .references("id").inTable("cards").onDelete("CASCADE");
table.string("filename", 255).notNullable();
table.string("original_filename", 255).notNullable();
table.string("mime_type", 100).notNullable();
table.bigInteger("file_size").notNullable(); // bytes
table.string("storage_path", 500).notNullable();
table.uuid("uploaded_by").notNullable()
  .references("id").inTable("users");
table.timestamp("uploaded_at").defaultTo(knex.fn.now());
```

### Phase 5: Comments

#### 5.1 Create `comments` table

**Migration:** `20250117_create_comments_table.ts`

```typescript
table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
table.uuid("card_id").notNullable()
  .references("id").inTable("cards").onDelete("CASCADE");
table.uuid("user_id").notNullable()
  .references("id").inTable("users").onDelete("CASCADE");
table.text("content").notNullable();
table.uuid("parent_comment_id").nullable()
  .references("id").inTable("comments").onDelete("CASCADE");
table.boolean("is_edited").defaultTo(false);
table.timestamp("created_at").defaultTo(knex.fn.now());
table.timestamp("updated_at").defaultTo(knex.fn.now());
```

### Phase 6: Activity History

#### 6.1 Create `card_activities` table

**Migration:** `20250117_create_card_activities_table.ts`

```typescript
table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
table.uuid("card_id").notNullable()
  .references("id").inTable("cards").onDelete("CASCADE");
table.uuid("user_id").notNullable()
  .references("id").inTable("users");
table.enum("action_type", [
  "created", "updated", "moved", "archived",
  "assignee_added", "assignee_removed",
  "label_added", "label_removed",
  "comment_added", "attachment_added",
  "checklist_item_added", "checklist_item_completed",
  "due_date_set", "due_date_changed", "due_date_removed",
  "priority_changed", "description_changed", "title_changed"
]).notNullable();
table.jsonb("metadata").nullable(); // Store action-specific details
table.timestamp("created_at").defaultTo(knex.fn.now());
```

---

## API Design

### Card Endpoints (Enhanced)

#### Update Card Details
```typescript
PATCH /api/cards/:id
Body: {
  title?: string;
  description?: string;
  status?: string;
  due_date?: string | null;
  priority?: "low" | "medium" | "high" | "critical";
}
```

#### Get Card with Full Details
```typescript
GET /api/cards/:id/details
Response: {
  id: string;
  title: string;
  description: string;
  status: string;
  due_date: string | null;
  priority: string;
  assignees: User[];
  labels: Label[];
  checklist_items: ChecklistItem[];
  attachments: Attachment[];
  comments: Comment[];
  activities: Activity[];
  created_at: string;
  updated_at: string;
}
```

### Assignees Endpoints

```typescript
POST   /api/cards/:id/assignees        // Add assignee
DELETE /api/cards/:id/assignees/:userId // Remove assignee
GET    /api/cards/:id/assignees        // List assignees
```

### Labels Endpoints

```typescript
GET    /api/boards/:boardId/labels     // List all board labels
POST   /api/boards/:boardId/labels     // Create label
PUT    /api/boards/:boardId/labels/:id // Update label
DELETE /api/boards/:boardId/labels/:id // Delete label

POST   /api/cards/:id/labels           // Add label to card
DELETE /api/cards/:id/labels/:labelId  // Remove label from card
```

### Checklists Endpoints

```typescript
GET    /api/cards/:id/checklist        // List checklist items
POST   /api/cards/:id/checklist        // Add checklist item
PUT    /api/cards/:cardId/checklist/:itemId // Update item
DELETE /api/cards/:cardId/checklist/:itemId // Delete item
PATCH  /api/cards/:cardId/checklist/:itemId/toggle // Toggle completion
```

### Attachments Endpoints

```typescript
GET    /api/cards/:id/attachments      // List attachments
POST   /api/cards/:id/attachments      // Upload attachment
GET    /api/cards/:cardId/attachments/:id/download // Download
DELETE /api/cards/:cardId/attachments/:id // Delete attachment
```

### Comments Endpoints

```typescript
GET    /api/cards/:id/comments         // List comments
POST   /api/cards/:id/comments         // Add comment
PUT    /api/cards/:cardId/comments/:id // Edit comment
DELETE /api/cards/:cardId/comments/:id // Delete comment
```

### Activity Endpoints

```typescript
GET /api/cards/:id/activities          // Get activity history
Query params: ?limit=50&offset=0&action_type=assignee_added
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal:** Set up database schema and basic API structure

**Tasks:**
1. ✅ Create implementation plan document
2. Create all database migrations
3. Update card schema file
4. Add new TypeBox validation schemas
5. Test migrations locally

**Deliverables:**
- All migration files created
- Database schema updated
- Migration rollback tested

---

### Phase 2: Core Card Fields (Week 1-2)
**Goal:** Implement due dates and priority

**Tasks:**
1. Update `cards` table migration
2. Add `due_date` and `priority` to CardSchema
3. Update CardRepository methods
4. Update CardController
5. Add validation
6. Write unit tests

**Deliverables:**
- Due date functionality working
- Priority levels working
- API endpoints tested

---

### Phase 3: Assignees (Week 2)
**Goal:** Implement user assignment to cards

**Tasks:**
1. Create `card_assignees` table
2. Create AssigneeRepository
3. Create AssigneeController
4. Add assignee routes
5. Update card details endpoint
6. Write tests

**Deliverables:**
- `/api/cards/:id/assignees` endpoints working
- Users can be assigned/unassigned
- Full card response includes assignees

---

### Phase 4: Labels & Tags (Week 2-3)
**Goal:** Implement label system

**Tasks:**
1. Create `labels` and `card_labels` tables
2. Create LabelModule (repository, service, controller, schema, routes)
3. Implement CRUD operations
4. Add label-card association endpoints
5. Update card details to include labels
6. Write tests

**Deliverables:**
- Label management working
- Cards can have multiple labels
- Board-scoped labels working

---

### Phase 5: Checklists (Week 3)
**Goal:** Implement checklist functionality

**Tasks:**
1. Create `checklist_items` table
2. Create ChecklistModule
3. Implement CRUD operations
4. Add toggle completion endpoint
5. Update card details
6. Write tests

**Deliverables:**
- Checklist CRUD working
- Completion tracking working
- Progress calculation working

---

### Phase 6: Comments (Week 3-4)
**Goal:** Implement discussion system

**Tasks:**
1. Create `comments` table
2. Create CommentModule
3. Implement CRUD operations
4. Add threaded reply support
5. Update card details
6. Write tests

**Deliverables:**
- Comment system working
- Edit/delete functionality
- Threaded replies supported

---

### Phase 7: Attachments (Week 4)
**Goal:** Implement file upload system

**Tasks:**
1. Create `attachments` table
2. Create AttachmentModule
3. Implement file upload (multipart/form-data)
4. Add file storage service
5. Implement download endpoint
6. Add file type validation
7. Write tests

**Deliverables:**
- File upload working
- File download working
- Proper MIME type validation
- File size limits enforced

---

### Phase 8: Activity History (Week 4-5)
**Goal:** Implement audit trail

**Tasks:**
1. Create `card_activities` table
2. Create ActivityRepository
3. Create middleware to log activities
4. Implement activity feed endpoint
5. Add filtering and pagination
6. Write tests

**Deliverables:**
- All card actions logged
- Activity feed working
- Proper user attribution
- Filtering and pagination working

---

### Phase 9: Integration & Testing (Week 5)
**Goal:** End-to-end testing and refinement

**Tasks:**
1. Integration testing
2. Performance testing
3. Fix bugs
4. Documentation updates
5. Swagger documentation
6. Code review

**Deliverables:**
- All tests passing
- Documentation updated
- Swagger docs complete
- Performance acceptable

---

## Testing Strategy

### Unit Tests
- Repository methods
- Service layer logic
- Schema validation
- Helper functions

### Integration Tests
- API endpoint testing
- Database transaction testing
- Authentication/authorization
- Error handling

### E2E Tests (Future)
- Complete user workflows
- Cross-feature interactions
- Performance benchmarks

### Test Coverage Goals
- Minimum 80% code coverage
- 100% critical path coverage
- All error cases tested

---

## Migration Strategy

### Running Migrations

```bash
# Development
npm run migrate:latest

# Rollback if needed
npm run migrate:rollback

# Check migration status
npm run migrate:status
```

### Backward Compatibility

All changes are additive:
- New columns are nullable or have defaults
- No existing columns are removed
- Existing API endpoints remain unchanged
- New endpoints follow existing patterns

### Production Deployment

1. Backup database
2. Run migrations in staging
3. Test thoroughly
4. Run migrations in production
5. Monitor for errors
6. Rollback plan ready

---

## File Structure

```
api/src/
├── db/
│   ├── migrations/
│   │   ├── 20250117_add_card_details_fields.ts
│   │   ├── 20250117_create_card_assignees_table.ts
│   │   ├── 20250117_create_labels_table.ts
│   │   ├── 20250117_create_card_labels_table.ts
│   │   ├── 20250117_create_checklist_items_table.ts
│   │   ├── 20250117_create_attachments_table.ts
│   │   ├── 20250117_create_comments_table.ts
│   │   └── 20250117_create_card_activities_table.ts
│   └── schemas/
│       ├── card-assignees.ts
│       ├── labels.ts
│       ├── card-labels.ts
│       ├── checklist-items.ts
│       ├── attachments.ts
│       ├── comments.ts
│       └── card-activities.ts
├── modules/
│   ├── cards/
│   │   ├── card.schema.ts (updated)
│   │   ├── card.repository.ts (updated)
│   │   ├── card.service.ts (updated)
│   │   └── card.controller.ts (updated)
│   ├── assignees/
│   │   ├── assignee.schema.ts
│   │   ├── assignee.repository.ts
│   │   ├── assignee.service.ts
│   │   ├── assignee.controller.ts
│   │   └── assignee.route.ts
│   ├── labels/
│   │   └── [similar structure]
│   ├── checklists/
│   │   └── [similar structure]
│   ├── attachments/
│   │   └── [similar structure]
│   ├── comments/
│   │   └── [similar structure]
│   └── activities/
│       └── [similar structure]
└── __test__/
    ├── assignee.test.ts
    ├── label.test.ts
    ├── checklist.test.ts
    ├── attachment.test.ts
    ├── comment.test.ts
    └── activity.test.ts
```

---

## Success Criteria

### Functional Requirements
- ✅ All 8 missing features implemented
- ✅ All API endpoints working
- ✅ Full card details endpoint returns all data
- ✅ Proper error handling
- ✅ Input validation

### Non-Functional Requirements
- ✅ 80%+ test coverage
- ✅ API response time < 200ms (average)
- ✅ Proper database indexing
- ✅ No breaking changes to existing APIs
- ✅ Swagger documentation complete

### Code Quality
- ✅ Follows existing code patterns
- ✅ TypeScript strict mode compliant
- ✅ Proper error handling
- ✅ Code review passed
- ✅ No linting errors

---

## Dependencies

### Existing
- Fastify
- Knex.js
- PostgreSQL
- TypeBox
- Jest

### New (if needed)
- `@fastify/multipart` - File upload handling
- `uuid` - Already in use
- `mime-types` - MIME type validation

---

## Risks & Mitigation

### Risk 1: Database Performance
**Mitigation:**
- Add proper indexes
- Implement pagination
- Use database query optimization
- Add caching for frequently accessed data

### Risk 2: File Storage Scalability
**Mitigation:**
- Start with local filesystem
- Plan for S3 migration
- Implement file size limits
- Add cleanup for orphaned files

### Risk 3: Breaking Changes
**Mitigation:**
- All changes are additive
- Version API if needed
- Comprehensive testing
- Backward compatibility checks

### Risk 4: Migration Failures
**Mitigation:**
- Test in development first
- Backup before production migration
- Have rollback plan
- Monitor during deployment

---

## Timeline

**Total Estimated Time:** 5 weeks

| Phase | Duration | Completion Date |
|-------|----------|-----------------|
| Phase 1: Foundation | 3 days | Week 1 |
| Phase 2: Core Fields | 4 days | Week 1-2 |
| Phase 3: Assignees | 3 days | Week 2 |
| Phase 4: Labels | 4 days | Week 2-3 |
| Phase 5: Checklists | 3 days | Week 3 |
| Phase 6: Comments | 4 days | Week 3-4 |
| Phase 7: Attachments | 4 days | Week 4 |
| Phase 8: Activities | 4 days | Week 4-5 |
| Phase 9: Testing | 5 days | Week 5 |

---

## Next Steps

1. Review this plan with stakeholders
2. Get approval to proceed
3. Create GitHub issues for each phase
4. Set up project board
5. Begin Phase 1 implementation

---

## References

- [INCOMPLETE_FEATURES_AND_ROADMAP.md](./INCOMPLETE_FEATURES_AND_ROADMAP.md)
- [FEATURES.md](./FEATURES.md)
- [Existing Card Schema](../api/src/db/schemas/cards.ts)
- [Knex.js Documentation](http://knexjs.org/)
- [TypeBox Documentation](https://github.com/sinclairzx81/typebox)

---

*Last updated: 2025-11-17*
