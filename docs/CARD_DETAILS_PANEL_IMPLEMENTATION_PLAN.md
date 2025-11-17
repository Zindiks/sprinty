# Card Details Panel - Implementation Plan

## Executive Summary

**Current State:**
- ✅ Backend APIs fully implemented (assignees, labels, checklists, comments, attachments, activities)
- ✅ Read-only CardDetailsModal exists
- ❌ No interactive editing capabilities
- ❌ Missing frontend hooks for card features
- ❌ No real-time updates in modal

**Goal:** Transform the read-only card details modal into a comprehensive, interactive side panel with full CRUD capabilities, real-time updates, and enhanced UX.

**Timeline:** 4-5 weeks (5 phases)

---

## Architecture Decisions

### 1. UI Pattern: Side Panel vs Modal

**Decision: Side Panel (Sheet Component)**

**Rationale:**
- Better UX - Keep board context visible (like Trello/Linear)
- More space for content
- Less jarring than full-screen modal
- Supports keyboard navigation and shortcuts
- Modern pattern used by leading project management tools

**Implementation:**
- Use shadcn/ui `Sheet` component (already available)
- Slide from right side (800px width)
- Overlay with backdrop
- Close with Esc, X button, or backdrop click

### 2. State Management Strategy

**Server State: TanStack Query (React Query)**
- All API data fetching and caching
- Optimistic updates for better UX
- Automatic background refetching
- Query invalidation on mutations

**Client State: Component State (useState)**
- UI state (open/closed, editing mode, etc.)
- Form state (draft values)
- Minimal global state needed

**Real-time State: WebSocket Context**
- Live updates when others edit
- Presence indicators
- Activity stream updates

### 3. Component Architecture

```
CardDetailsPanel/
├── CardDetailsPanel.tsx          # Main container
├── sections/
│   ├── CardHeader.tsx            # Title, close button, actions
│   ├── CardDescription.tsx       # Editable description
│   ├── CardMetadata.tsx          # Priority, status, due date
│   ├── AssigneeSection.tsx       # User assignment
│   ├── LabelSection.tsx          # Labels management
│   ├── ChecklistSection.tsx      # Checklists with progress
│   ├── AttachmentSection.tsx     # File uploads
│   ├── CommentSection.tsx        # Comments with threading
│   └── ActivitySection.tsx       # Activity timeline
├── widgets/
│   ├── AssigneeSelector.tsx      # User picker
│   ├── LabelManager.tsx          # Label creator/selector
│   ├── PrioritySelector.tsx      # Priority dropdown
│   ├── DueDatePicker.tsx         # Date picker
│   ├── StatusSelector.tsx        # Status dropdown
│   ├── ChecklistItem.tsx         # Individual checklist item
│   ├── CommentItem.tsx           # Comment with replies
│   ├── AttachmentItem.tsx        # Attachment with preview
│   └── ActivityItem.tsx          # Activity timeline item
└── hooks/
    ├── useCardDetails.ts         # Card CRUD
    ├── useAssignees.ts          # Assignee operations
    ├── useLabels.ts             # Label operations
    ├── useChecklists.ts         # Checklist operations
    ├── useComments.ts           # Comment operations
    ├── useAttachments.ts        # Attachment operations
    └── useActivities.ts         # Activity fetching
```

---

## Implementation Phases

## Phase 1: Foundation & Core Infrastructure (Week 1)

**Goal:** Set up the foundational architecture and basic panel structure

### Tasks:

#### 1.1 Create Custom Hooks
- [ ] **useCardDetails** - Card CRUD operations
  - Fetch card with full details
  - Update title, description, priority, status, due date
  - Delete card
  - Optimistic updates

- [ ] **useAssignees** - Assignee management
  - Fetch assignees for card
  - Add assignee
  - Remove assignee
  - Query invalidation

- [ ] **useLabels** - Label operations
  - Fetch board labels
  - Fetch card labels
  - Create new label (with color)
  - Add label to card
  - Remove label from card
  - Update label
  - Delete label

- [ ] **useChecklists** - Checklist operations
  - Fetch checklists with progress
  - Create checklist item
  - Update item text
  - Toggle completion
  - Delete item
  - Reorder items

- [ ] **useComments** - Comment operations
  - Fetch comments with threading
  - Create comment
  - Create reply
  - Update comment (author only)
  - Delete comment (author only)

- [ ] **useAttachments** - Attachment operations
  - Fetch attachments
  - Upload file
  - Download file
  - Delete attachment
  - Update attachment name

- [ ] **useActivities** - Activity fetching
  - Fetch activity timeline
  - Pagination support
  - Filter by action type

#### 1.2 TypeScript Types Enhancement
- [ ] Extend existing types in `types.tsx`
- [ ] Add complete type definitions for:
  - CardDetails (with all relations)
  - Assignee
  - Label
  - Checklist
  - Comment (with threading)
  - Attachment
  - Activity
- [ ] Create form types for mutations

#### 1.3 Create CardDetailsPanel Component
- [ ] Create basic Sheet component structure
- [ ] Add header with title and close button
- [ ] Add scrollable content area
- [ ] Add loading and error states
- [ ] Implement open/close logic
- [ ] Add keyboard shortcuts (Esc to close)
- [ ] Integrate with CardItem click handler

**Deliverables:**
- 7 custom hooks with full CRUD operations
- Enhanced TypeScript types
- Basic CardDetailsPanel shell that opens/closes
- All hooks tested with basic operations

**Success Criteria:**
- Panel opens when clicking a card
- Panel closes with Esc or X button
- All API hooks successfully fetch/mutate data
- No TypeScript errors

---

## Phase 2: Core Editing Features (Week 1-2)

**Goal:** Implement inline editing for basic card properties

### Tasks:

#### 2.1 Editable Card Header
- [ ] Create inline editable title
  - Click to edit
  - Auto-save on blur
  - Cancel with Esc
  - Optimistic update
  - Error handling

- [ ] Add card actions dropdown
  - Archive card
  - Delete card (with confirmation)
  - Copy card link
  - Move to another list

#### 2.2 Editable Description Section
- [ ] Create CardDescription component
- [ ] Add textarea with auto-resize
- [ ] Implement markdown preview toggle
- [ ] Add "Edit" and "Save/Cancel" modes
- [ ] Save on Cmd+Enter (Mac) or Ctrl+Enter (Windows)
- [ ] Auto-save on blur
- [ ] Show character count
- [ ] Optimistic updates

#### 2.3 Card Metadata Section
- [ ] **PrioritySelector**
  - Dropdown with options: Low, Medium, High, Critical
  - Color-coded badges
  - Save on selection
  - Optimistic update

- [ ] **StatusSelector**
  - Dropdown with options: To Do, In Progress, Done, Blocked
  - Update status
  - Trigger activity log

- [ ] **DueDatePicker**
  - Calendar popup (use shadcn/ui Calendar)
  - Show relative time (e.g., "2 days from now")
  - Highlight overdue dates
  - Clear date option
  - Trigger activity log

#### 2.4 Real-time Updates (Basic)
- [ ] Subscribe to WebSocket CARD_UPDATED events
- [ ] Update panel when card changes
- [ ] Show toast notification when others edit
- [ ] Conflict resolution (last write wins)

**Deliverables:**
- Fully editable title and description
- Working priority, status, and due date selectors
- Basic real-time updates
- Proper loading and error states

**Success Criteria:**
- All card fields are editable
- Changes save successfully
- Updates reflect immediately (optimistic)
- Real-time updates from other users work
- No data loss on network errors

---

## Phase 3: Assignees & Labels (Week 2)

**Goal:** Implement user assignment and label management

### Tasks:

#### 3.1 Assignee Section
- [ ] Create AssigneeSection component
- [ ] Display assigned users with avatars
  - User avatar (from GitHub)
  - Username/email
  - Remove button (X)

- [ ] Create AssigneeSelector component
  - Popover with user search
  - Filter organization members
  - Avatar + name display
  - Multi-select support
  - "Add Assignee" button

- [ ] Implement add/remove functionality
  - Add assignee mutation
  - Remove assignee mutation
  - Optimistic updates
  - Activity logging

- [ ] Real-time updates
  - Subscribe to assignee changes
  - Update avatar list live

#### 3.2 Label Section
- [ ] Create LabelSection component
- [ ] Display card labels
  - Color-coded badges
  - Label name
  - Remove button (X)

- [ ] Create LabelManager component
  - Popover with label list
  - Show all board labels
  - Checkboxes for applied labels
  - Add/remove labels
  - "Create Label" option

- [ ] Create LabelCreator dialog
  - Label name input
  - Color picker (preset colors)
  - Custom color hex input
  - Preview badge
  - Save/cancel buttons

- [ ] Implement label operations
  - Create new label
  - Add label to card
  - Remove label from card
  - Edit existing label
  - Delete label
  - Optimistic updates

- [ ] Real-time updates
  - Subscribe to label changes
  - Update badge list live

**Deliverables:**
- Working assignee selector with user search
- Full label management system
- Label creation with color picker
- Real-time updates for assignees and labels

**Success Criteria:**
- Can add/remove assignees with avatars
- Can create labels with custom colors
- Can apply/remove labels from cards
- Labels visible on card in board view
- Real-time updates work for both features
- Activity log records changes

---

## Phase 4: Checklists (Week 2-3)

**Goal:** Implement comprehensive checklist functionality

### Tasks:

#### 4.1 Checklist Section
- [ ] Create ChecklistSection component
- [ ] Display checklist items
  - Checkbox for completion
  - Item text
  - Edit button
  - Delete button
  - Drag handle for reordering

- [ ] Show progress bar
  - Total items count
  - Completed items count
  - Percentage completed
  - Visual progress bar

- [ ] Create "Add item" input
  - Text input
  - Enter to add
  - Clear on add
  - Focus management

#### 4.2 Checklist Item Component
- [ ] Create ChecklistItem component
- [ ] Implement toggle completion
  - Click checkbox
  - Optimistic update
  - Strike-through completed items
  - Show completion time
  - Show who completed

- [ ] Implement inline editing
  - Click to edit text
  - Save on Enter/blur
  - Cancel on Esc
  - Character limit

- [ ] Implement delete
  - Delete button
  - Confirmation dialog
  - Optimistic removal

- [ ] Add drag-and-drop reordering
  - Use @dnd-kit/sortable
  - Drag handle
  - Visual feedback
  - Save new order on drop
  - Optimistic reordering

#### 4.3 Checklist Enhancements
- [ ] Add bulk actions
  - "Clear completed" button
  - "Delete all" button (with confirmation)
  - "Add from template" (future)

- [ ] Add keyboard shortcuts
  - Ctrl+Enter: Add new item
  - Tab: Indent item (future - sub-items)

- [ ] Real-time updates
  - Subscribe to checklist changes
  - Update items live
  - Update progress bar
  - Show who's editing

**Deliverables:**
- Complete checklist system with progress tracking
- Drag-and-drop reordering
- Inline editing and deletion
- Real-time collaborative updates

**Success Criteria:**
- Can add/edit/delete checklist items
- Completion toggle works with visual feedback
- Progress bar accurately reflects completion
- Reordering works smoothly
- Real-time updates show others' changes
- Activity log records checklist actions

---

## Phase 5: Comments & Attachments (Week 3)

**Goal:** Implement commenting system and file attachments

### Tasks:

#### 5.1 Comment Section
- [ ] Create CommentSection component
- [ ] Add comment input area
  - Textarea with auto-resize
  - User avatar
  - "Add Comment" button
  - Cancel button
  - Character limit
  - Markdown support (optional)

- [ ] Display comment list
  - Chronological order (newest first)
  - User avatar
  - Username
  - Timestamp (relative: "2 hours ago")
  - Comment text
  - Edit button (author only)
  - Delete button (author only)
  - Reply button

#### 5.2 Comment Item Component
- [ ] Create CommentItem component
- [ ] Implement edit functionality
  - "Edit" mode toggle
  - Textarea with current text
  - Save/Cancel buttons
  - Optimistic update
  - Show "edited" indicator

- [ ] Implement delete functionality
  - Delete button
  - Confirmation dialog
  - Optimistic removal

- [ ] Implement threaded replies
  - "Reply" button
  - Indented reply list
  - Reply input inline
  - Collapse/expand threads
  - Reply count indicator

#### 5.3 Comment Enhancements
- [ ] Add @mentions (optional)
  - Autocomplete on @
  - Link to user profile
  - Notify mentioned users

- [ ] Add emoji reactions (optional)
  - Emoji picker
  - Show reaction counts
  - Toggle reactions

- [ ] Real-time updates
  - New comments appear live
  - Edits update live
  - Deletions remove live
  - "User is typing" indicator

#### 5.4 Attachment Section
- [ ] Create AttachmentSection component
- [ ] Implement file upload
  - Drag-and-drop zone
  - File input button
  - Multiple file support
  - Max 10MB per file
  - MIME type validation
  - Upload progress indicator

- [ ] Display attachment list
  - File name
  - File size
  - Upload date
  - Uploaded by (user)
  - Thumbnail (for images)
  - Download button
  - Delete button (uploader only)

#### 5.5 Attachment Item Component
- [ ] Create AttachmentItem component
- [ ] Implement file preview
  - Image preview (inline)
  - PDF preview (modal)
  - Other files: icon + name
  - Full-screen view for images

- [ ] Implement download
  - Download button
  - Trigger file download
  - Track download analytics (optional)

- [ ] Implement delete
  - Delete button
  - Confirmation dialog
  - Optimistic removal

- [ ] Implement rename
  - Inline edit filename
  - Save on Enter/blur
  - Validation

#### 5.6 Real-time Updates
- [ ] Subscribe to attachment changes
- [ ] Update list when files uploaded
- [ ] Show upload progress for others
- [ ] Activity log for attachments

**Deliverables:**
- Full commenting system with threading
- File upload with drag-and-drop
- Image preview and file downloads
- Real-time updates for both features

**Success Criteria:**
- Can add/edit/delete comments
- Threaded replies work correctly
- Can upload multiple files
- Image previews display correctly
- Download functionality works
- Real-time updates for comments and attachments
- Activity log records all actions

---

## Phase 6: Activity Timeline & Polish (Week 4)

**Goal:** Add activity timeline and polish the entire feature

### Tasks:

#### 6.1 Activity Timeline
- [ ] Create ActivitySection component
- [ ] Display activity feed
  - Chronological order (newest first)
  - User avatar
  - Action description
  - Timestamp (relative)
  - Action icon
  - Related data (before/after)

- [ ] Create ActivityItem component
  - Format action types
  - Show user who performed action
  - Show what changed
  - Different icons per action type
  - Color coding by action category

- [ ] Implement activity formatting
  - "User added assignee X"
  - "User changed priority from Low to High"
  - "User completed checklist item X"
  - "User added comment"
  - "User uploaded attachment X"
  - "User moved card from List A to List B"

- [ ] Add filtering
  - Filter by action type
  - Filter by user
  - Date range filter (optional)

- [ ] Add pagination
  - Load more button
  - Infinite scroll (optional)
  - Show loading state

#### 6.2 Real-time Activity Updates
- [ ] Subscribe to activity events
- [ ] New activities appear live
- [ ] Activity count updates
- [ ] Auto-scroll to new activities (optional)

#### 6.3 Keyboard Shortcuts
- [ ] Implement global shortcuts
  - `Esc` - Close panel
  - `Cmd+Enter` / `Ctrl+Enter` - Save description
  - `C` - Focus comment input
  - `T` - Edit title
  - `D` - Edit description
  - `A` - Add assignee
  - `L` - Add label

- [ ] Add shortcut help dialog
  - `?` - Show keyboard shortcuts
  - Modal with all shortcuts listed
  - Organized by category

#### 6.4 UX Enhancements
- [ ] Add loading skeletons
  - Skeleton for each section
  - Smooth loading transitions
  - Progressive loading

- [ ] Improve error handling
  - User-friendly error messages
  - Retry mechanisms
  - Offline support indicators
  - Toast notifications for errors

- [ ] Add empty states
  - "No assignees yet"
  - "No labels yet"
  - "No checklist items"
  - "No comments yet"
  - "No attachments yet"
  - Helpful CTAs for each

- [ ] Add confirmation dialogs
  - Delete card
  - Delete comment
  - Delete attachment
  - Clear all checklist items

- [ ] Optimize performance
  - Lazy load sections
  - Virtualize long lists
  - Debounce search inputs
  - Memoize expensive computations

#### 6.5 Accessibility
- [ ] ARIA labels for all interactive elements
- [ ] Keyboard navigation for all features
- [ ] Focus management (trap focus in panel)
- [ ] Screen reader announcements
- [ ] High contrast mode support
- [ ] Focus indicators
- [ ] Alt text for images

#### 6.6 Mobile Responsiveness
- [ ] Full-screen panel on mobile
- [ ] Touch-friendly targets
- [ ] Swipe to close
- [ ] Responsive layout
- [ ] Mobile-optimized file upload

#### 6.7 Polish & Refinement
- [ ] Smooth animations
  - Panel slide-in/out
  - Section expand/collapse
  - Item add/remove
  - Loading transitions

- [ ] Visual hierarchy
  - Clear section separators
  - Consistent spacing
  - Typography scale
  - Color system

- [ ] Micro-interactions
  - Hover states
  - Active states
  - Success feedback
  - Error feedback

- [ ] Copy improvements
  - Helpful placeholder text
  - Clear button labels
  - Informative tooltips
  - Contextual help text

**Deliverables:**
- Complete activity timeline with filtering
- Comprehensive keyboard shortcuts
- Polished UI with animations
- Full accessibility support
- Mobile-responsive design
- Production-ready feature

**Success Criteria:**
- Activity timeline shows all card changes
- All keyboard shortcuts work
- No accessibility violations
- Works perfectly on mobile
- All animations smooth (60fps)
- Loading states informative
- Error handling comprehensive
- User testing feedback addressed

---

## Phase 7: Real-time Collaboration & Testing (Week 4-5)

**Goal:** Enhance real-time features and comprehensive testing

### Tasks:

#### 7.1 Advanced Real-time Features
- [ ] Presence indicators
  - Show who's viewing the card
  - User avatars in header
  - "X people viewing" count
  - Highlight active users

- [ ] Collaborative cursors (optional)
  - Show where others are editing
  - Real-time cursor positions
  - User color coding

- [ ] Conflict resolution
  - Detect concurrent edits
  - Show conflict dialog
  - Manual merge option
  - Auto-merge when possible

- [ ] Optimistic UI improvements
  - Instant feedback for all actions
  - Rollback on errors
  - Retry failed mutations
  - Queue offline actions

#### 7.2 WebSocket Event Handlers
- [ ] Subscribe to card-specific events
  - `CARD_UPDATED`
  - `CARD_DELETED`
  - `ASSIGNEE_ADDED`
  - `ASSIGNEE_REMOVED`
  - `LABEL_ADDED`
  - `LABEL_REMOVED`
  - `CHECKLIST_UPDATED`
  - `COMMENT_ADDED`
  - `COMMENT_UPDATED`
  - `COMMENT_DELETED`
  - `ATTACHMENT_ADDED`
  - `ATTACHMENT_DELETED`
  - `USER_JOINED` (viewing card)
  - `USER_LEFT` (left card)

#### 7.3 Unit Testing
- [ ] Test custom hooks
  - useCardDetails
  - useAssignees
  - useLabels
  - useChecklists
  - useComments
  - useAttachments
  - useActivities

- [ ] Test utilities
  - Date formatters
  - Text formatters
  - Validators

#### 7.4 Component Testing
- [ ] Test CardDetailsPanel
- [ ] Test all sections
  - CardHeader
  - CardDescription
  - AssigneeSection
  - LabelSection
  - ChecklistSection
  - CommentSection
  - AttachmentSection
  - ActivitySection

- [ ] Test all widgets
  - AssigneeSelector
  - LabelManager
  - PrioritySelector
  - DueDatePicker
  - ChecklistItem
  - CommentItem
  - AttachmentItem
  - ActivityItem

#### 7.5 Integration Testing
- [ ] Test complete user flows
  - Create and edit card
  - Add assignees and labels
  - Create and complete checklist
  - Add and edit comments
  - Upload and delete attachments
  - View activity timeline

- [ ] Test real-time collaboration
  - Two users editing same card
  - Concurrent edits
  - Conflict scenarios
  - Network interruptions

#### 7.6 E2E Testing
- [ ] Test critical paths
  - Open card details panel
  - Edit card information
  - Manage assignees
  - Manage labels
  - Complete checklists
  - Add comments
  - Upload files
  - View activity
  - Close panel

- [ ] Test edge cases
  - Very long text inputs
  - Many assignees/labels
  - Large attachments
  - Network errors
  - Concurrent users
  - Browser compatibility

#### 7.7 Performance Testing
- [ ] Measure metrics
  - Panel open time
  - Initial load time
  - API response times
  - WebSocket latency
  - Render performance

- [ ] Optimize bottlenecks
  - Code splitting
  - Lazy loading
  - Image optimization
  - Bundle size reduction
  - Caching strategies

#### 7.8 User Acceptance Testing
- [ ] Internal dogfooding
  - Team uses feature daily
  - Collect feedback
  - Identify pain points
  - Track bugs

- [ ] Beta testing
  - Select user group
  - Gather user feedback
  - Track usage analytics
  - Iterate on feedback

**Deliverables:**
- Full real-time collaboration features
- Comprehensive test suite (unit, integration, E2E)
- Performance optimizations
- User testing feedback incorporated
- Production-ready, battle-tested feature

**Success Criteria:**
- All tests passing (>90% coverage)
- Real-time updates work flawlessly
- No performance regressions
- Positive user feedback
- All critical bugs fixed
- Feature flag ready for rollout

---

## Technical Specifications

### API Endpoints Used

```typescript
// Cards
GET    /api/v1/cards/:id/details
PATCH  /api/v1/cards/:id/details
DELETE /api/v1/cards/:id

// Assignees
GET    /api/v1/assignees/card/:card_id
POST   /api/v1/assignees/
DELETE /api/v1/assignees/:card_id/user/:user_id

// Labels
GET    /api/v1/labels/board/:board_id
GET    /api/v1/labels/card/:card_id
POST   /api/v1/labels/
PATCH  /api/v1/labels/
POST   /api/v1/labels/card
DELETE /api/v1/labels/card/:card_id/label/:label_id

// Checklists
GET    /api/v1/checklists/card/:card_id/with-progress
POST   /api/v1/checklists/
PATCH  /api/v1/checklists/
PATCH  /api/v1/checklists/:id/card/:card_id/toggle
DELETE /api/v1/checklists/:id/card/:card_id
PUT    /api/v1/checklists/card/:card_id/reorder

// Comments
GET    /api/v1/comments/card/:card_id/threaded
POST   /api/v1/comments/
PATCH  /api/v1/comments/
DELETE /api/v1/comments/:id/card/:card_id

// Attachments
GET    /api/v1/attachments/card/:card_id
POST   /api/v1/attachments/card/:card_id
GET    /api/v1/attachments/:id/card/:card_id/download
DELETE /api/v1/attachments/:id/card/:card_id
PATCH  /api/v1/attachments/

// Activities
GET    /api/v1/activities/card/:card_id
```

### WebSocket Events

```typescript
// Subscribe
socket.emit('join:board', { boardId });
socket.emit('join:card', { cardId }); // Custom event to add

// Listen
socket.on('CARD_UPDATED', handleCardUpdate);
socket.on('CARD_DELETED', handleCardDelete);
socket.on('USER_JOINED', handleUserJoined);
socket.on('USER_LEFT', handleUserLeft);
```

### Data Types

```typescript
interface CardDetails {
  id: string;
  list_id: string;
  title: string;
  description?: string;
  status: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  order: number;
  created_at: string;
  updated_at: string;
  assignees: Assignee[];
  labels: Label[];
  checklists: Checklist[];
  comments: Comment[];
  attachments: Attachment[];
  activities: Activity[];
}

interface Assignee {
  id: string;
  card_id: string;
  user_id: string;
  user: {
    id: string;
    email: string;
    username?: string;
    avatar_url?: string;
  };
  created_at: string;
}

interface Label {
  id: string;
  board_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

interface Checklist {
  id: string;
  card_id: string;
  title: string;
  is_completed: boolean;
  order: number;
  completed_at?: string;
  completed_by?: string;
  created_at: string;
  updated_at: string;
}

interface Comment {
  id: string;
  card_id: string;
  user_id: string;
  content: string;
  parent_comment_id?: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    email: string;
    username?: string;
    avatar_url?: string;
  };
  replies?: Comment[];
}

interface Attachment {
  id: string;
  card_id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  user: {
    id: string;
    email: string;
    username?: string;
    avatar_url?: string;
  };
}

interface Activity {
  id: string;
  card_id: string;
  user_id: string;
  action_type: ActivityAction;
  details?: any;
  created_at: string;
  user: {
    id: string;
    email: string;
    username?: string;
    avatar_url?: string;
  };
}

type ActivityAction =
  | 'created'
  | 'updated'
  | 'moved'
  | 'archived'
  | 'assignee_added'
  | 'assignee_removed'
  | 'label_added'
  | 'label_removed'
  | 'comment_added'
  | 'attachment_added'
  | 'checklist_item_added'
  | 'checklist_item_completed'
  | 'due_date_set'
  | 'due_date_changed'
  | 'due_date_removed'
  | 'priority_changed'
  | 'description_changed'
  | 'title_changed';
```

---

## Dependencies to Add

```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "date-fns": "^3.0.0",
    "react-dropzone": "^14.2.3",
    "react-markdown": "^9.0.1",
    "react-syntax-highlighter": "^15.5.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "@testing-library/jest-dom": "^6.1.5",
    "vitest": "^1.1.0",
    "@vitest/ui": "^1.1.0"
  }
}
```

---

## Success Metrics

### Functional Metrics
- ✅ All CRUD operations work for all features
- ✅ Real-time updates with <1 second latency
- ✅ File uploads support up to 10MB
- ✅ No data loss on concurrent edits
- ✅ Activity log captures all actions

### Performance Metrics
- ✅ Panel opens in <300ms
- ✅ Initial data loads in <500ms
- ✅ UI remains responsive (60fps)
- ✅ Bundle size increase <200KB (gzipped)
- ✅ API response times <100ms (p95)

### Quality Metrics
- ✅ Test coverage >90%
- ✅ Zero critical bugs
- ✅ Accessibility score 100 (Lighthouse)
- ✅ Mobile usability score >90
- ✅ No console errors/warnings

### User Metrics
- ✅ User satisfaction >4.5/5
- ✅ Feature adoption >80%
- ✅ Task completion time reduced by 30%
- ✅ Support tickets <5% of users

---

## Risk Mitigation

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| WebSocket connection issues | High | Implement fallback polling, reconnection logic |
| Large file uploads failing | Medium | Add chunked upload, resume capability |
| Concurrent edit conflicts | High | Implement optimistic locking, conflict UI |
| Performance degradation | High | Lazy loading, virtualization, code splitting |
| Type safety issues | Medium | Comprehensive TypeScript types, runtime validation |

### UX Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex UI overwhelming users | Medium | Progressive disclosure, onboarding tooltips |
| Mobile UX subpar | High | Mobile-first design, touch optimization |
| Accessibility barriers | High | WCAG 2.1 AA compliance, screen reader testing |
| Slow loading perceived | Medium | Loading skeletons, optimistic updates |

### Project Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep | Medium | Strict phase boundaries, feature freeze |
| Timeline slippage | Medium | Buffer time, MVP-first approach |
| Backend API changes | Low | API versioning, feature flags |
| Third-party library issues | Low | Lock versions, alternatives identified |

---

## Rollout Plan

### Phase 1: Internal Testing (Week 5)
- Deploy to staging environment
- Internal team testing
- Bug fixes and iterations
- Performance tuning

### Phase 2: Beta Release (Week 6)
- Feature flag enabled for 10% of users
- Monitor error rates and performance
- Collect user feedback
- A/B testing vs old modal

### Phase 3: Gradual Rollout (Week 7)
- Increase to 25% of users
- Continue monitoring
- Address feedback
- Optimize based on real usage

### Phase 4: Full Release (Week 8)
- Enable for 100% of users
- Announce feature
- Update documentation
- Monitor support tickets

---

## Documentation Needs

### Developer Documentation
- [ ] API documentation updates
- [ ] Component API documentation
- [ ] Hook usage examples
- [ ] WebSocket event documentation
- [ ] Testing guide
- [ ] Contributing guide for feature extensions

### User Documentation
- [ ] Feature announcement blog post
- [ ] Help center articles
- [ ] Video tutorials
- [ ] Keyboard shortcuts reference
- [ ] FAQ section
- [ ] Migration guide from old modal

---

## Future Enhancements (Post-MVP)

### Phase 8+
- [ ] Rich text editor for descriptions (WYSIWYG)
- [ ] @mentions with notifications
- [ ] Emoji reactions for comments
- [ ] Checklist templates
- [ ] Attachment link sharing (public links)
- [ ] Card templates
- [ ] Custom fields
- [ ] Time tracking integration
- [ ] Git commit linking
- [ ] Automation rules (if X then Y)
- [ ] Card dependencies
- [ ] Voting on cards
- [ ] Card age/staleness indicators

---

## Conclusion

This implementation plan provides a clear roadmap for building a comprehensive Card Details Panel feature over 4-5 weeks. The phased approach ensures:

1. **Solid foundation** - Hooks and infrastructure first
2. **Incremental value** - Each phase delivers working features
3. **Risk mitigation** - Testing and polish built-in
4. **Quality focus** - Accessibility, performance, UX throughout
5. **Future-proof** - Extensible architecture for enhancements

The backend is production-ready, so we can focus entirely on delivering an exceptional frontend experience that matches the quality of leading project management tools like Trello, Linear, and Asana.

**Next Steps:**
1. Review and approve this plan
2. Set up project board with phase tasks
3. Assign team members to phases
4. Begin Phase 1: Foundation & Core Infrastructure
