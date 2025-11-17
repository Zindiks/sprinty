# Sprinty Codebase Exploration Summary

## Project Overview
**Sprinty** is a modern task management application with drag-and-drop capabilities. It's built as a monorepo with separate `/api` and `/client` directories.

**Current Branch:** `claude/add-due-dates-calendar-01AUakQ8Ytz4mft61UksF551` (for due dates calendar feature implementation)

---

## 1. TECH STACK

### Backend
- **Framework:** Fastify v5.2.1 (Node.js API framework)
- **Language:** TypeScript 5.7.3
- **Database:** PostgreSQL (Primary) + SQLite (Testing/Development)
- **ORM/Query Builder:** Knex.js v3.1.0
- **Real-time Communication:** Socket.io v4.8.1
- **Database Driver:** pg v8.13.1
- **API Documentation:** Fastify Swagger + Swagger UI
- **Request Validation:** @sinclair/typebox v0.34.14
- **Key Dependencies:**
  - @fastify/cors
  - @fastify/session
  - @fastify/oauth2
  - @fastify/multipart
  - fastify-metrics (Prometheus metrics)
- **Testing:** Jest, Mocha, Chai, Supertest

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite v6.0.11
- **Language:** TypeScript 5.6.2
- **State Management:** Zustand v5.0.3
- **Data Fetching:** React Query (TanStack) v5.64.1 + Axios
- **Real-time Communication:** Socket.io-client v4.8.1
- **UI Component Library:** Radix UI (various components)
- **Styling:** Tailwind CSS v3.4.16
- **Drag & Drop:** @hello-pangea/dnd v17.0.0
- **Icons:** Lucide React v0.468.0
- **Router:** React Router DOM v7.0.2
- **Utilities:**
  - clsx (classname utility)
  - tailwind-merge
  - lodash v4.17.21
  - usehooks-ts

---

## 2. DATABASE SCHEMA

### Cards Table
**Location:** `/home/user/sprinty/api/src/db/migrations/`

**Schema Files:**
- Initial table: `20250112221005_create_cards_table.ts`
- Extended fields: `20251117000001_add_card_details_fields.ts`

**Card Fields:**
```
- id (UUID, primary)
- list_id (UUID, foreign key to lists)
- title (String, required)
- order (Integer)
- description (Text, optional)
- status (String, optional)
- due_date (TIMESTAMP, nullable) ✓ ALREADY EXISTS
- priority (ENUM: low|medium|high|critical, default: medium)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Status:** due_date field has ALREADY BEEN ADDED via migration `20251117000001_add_card_details_fields.ts`

### Related Tables
- **card_assignees:** Tracks assignees for cards
- **card_labels:** Junction table for card labels
- **card_activities:** Audit trail for card changes (includes due_date_set, due_date_changed, due_date_removed actions)
- **comments:** Card comments with threading support
- **attachments:** File attachments
- **checklist_items:** Card checklists

---

## 3. BACKEND API STRUCTURE

### Base URL
```
http://localhost:8080/api/v1
```

### Cards API Endpoints

**Location:** `/home/user/sprinty/api/src/modules/cards/`

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/cards/:id` | Get single card | ✓ |
| GET | `/cards/:id/with-assignees` | Get card with assignees | ✓ |
| GET | `/cards/:id/details` | Get card with full details (assignees, labels, comments, activities) | ✓ |
| GET | `/cards/list/:list_id` | Get all cards in a list | ✓ |
| POST | `/cards` | Create new card | ✓ |
| PATCH | `/cards/update` | Update card title only | ✓ |
| **PATCH** | **/cards/details** | **Update card details (title, description, status, due_date, priority)** | ✓ **READY** |
| PUT | `/cards/order` | Update card ordering | ✓ |
| DELETE | `/cards/:id/list/:list_id` | Delete card | ✓ |

### Key Update Endpoint
**PATCH `/api/v1/cards/details`**

**Request Body (Schema: UpdateCardDetailsSchema):**
```typescript
{
  id: string (UUID),
  list_id: string (UUID),
  title?: string,
  description?: string | null,
  status?: string,
  due_date?: string (ISO date-time) | null,
  priority?: "low" | "medium" | "high" | "critical"
}
```

**Response:** Full card object with all fields including due_date

---

## 4. FRONTEND STRUCTURE

### Directory Layout
```
/home/user/sprinty/client/src/
├── components/
│   ├── card/
│   │   ├── CardItem.tsx (already displays due_date)
│   │   ├── CardDetailsModal.tsx (already displays due_date)
│   │   ├── CardForm.tsx
│   │   └── FormTextarea.tsx
│   ├── ui/ (Radix UI components)
│   ├── board/
│   ├── list/
│   └── ...
├── hooks/
│   ├── useCards.ts (card mutations)
│   ├── useLists.ts
│   ├── useBoards.ts
│   ├── useAnalytics.ts
│   ├── use-toast.ts (toast notifications)
│   └── websocket/
├── pages/
│   ├── BoardView.tsx
│   ├── Dashboard.tsx
│   └── ...
├── contexts/
│   ├── WebSocketContext.tsx (real-time communication)
│   └── UserContext.tsx
├── types/
│   └── types.tsx (TypeScript interfaces)
└── lib/
    └── utils.ts (cn utility for classnames)
```

### Card Components Details

**CardItem.tsx** (`/home/user/sprinty/client/src/components/card/CardItem.tsx`)
- Already displays due_date as a badge
- Shows priority flag
- Uses Calendar icon from lucide-react
- Date format: `new Date(due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })`
- Component is draggable using @hello-pangea/dnd

**CardDetailsModal.tsx** (`/home/user/sprinty/client/src/components/card/CardDetailsModal.tsx`)
- Read-only view of card details
- Displays due_date with formatDate() utility
- Shows activity timeline with due_date change tracking
- Supports activity metadata parsing for due_date changes
- Activity actions include: due_date_set, due_date_changed, due_date_removed

### Card Type Definition
```typescript
interface Card {
  id: string;
  list_id: string;
  title: string;
  order: number;
  description?: string;
  status: string;
  due_date?: string;  // ISO datetime string
  priority?: "low" | "medium" | "high" | "critical";
  created_at: string;
  updated_at: string;
}

interface CardWithDetails extends Card {
  assignees: Assignee[];
  labels: Label[];
  checklist_items: ChecklistItem[];
  checklist_progress: ChecklistProgress;
  comments: Comment[];
  attachments: Attachment[];
  activities: Activity[];
}
```

---

## 5. DATE HANDLING & UTILITIES

### Frontend Date Utilities
**Location:** Components use inline date formatting

**Patterns Found:**
1. **ISO string storage:** All dates stored as ISO 8601 strings
2. **Local date formatting:**
   ```typescript
   // CardItem.tsx
   new Date(data.due_date).toLocaleDateString("en-US", {
     month: "short",
     day: "numeric",
   })
   
   // CardDetailsModal.tsx
   new Date(dateString).toLocaleDateString("en-US", {
     month: "short",
     day: "numeric",
     year: "numeric",
   })
   ```

### Backend Date Handling
- Uses PostgreSQL TIMESTAMP type
- Knex.js `knex.fn.now()` for automatic timestamps
- All dates converted to ISO strings in responses
- Activity metadata stores date changes

**No specialized date library (like date-fns or dayjs) is currently in use**

---

## 6. NOTIFICATION & ACTIVITY SYSTEM

### Toast Notifications
**Location:** `/home/user/sprinty/client/src/hooks/use-toast.ts`

Built on **Radix UI Toast** (@radix-ui/react-toast)

**Usage:**
```typescript
const { toast } = useToast();
toast({
  variant: "destructive" | "default",
  title: "Title",
  description: "Message",
  duration: 1000 // optional
});
```

**Integration Point:** Used in hooks (useCards, useBoards, useLists)

### Activity Logging System
**Location:** `/home/user/sprinty/api/src/modules/activities/`

**Components:**
- `activity.service.ts` - Business logic
- `activity.repository.ts` - Database operations
- `activity.controller.ts` - HTTP handlers
- `activity.schema.ts` - TypeScript types and Knex schema

**Activity Table Structure:**
```sql
CREATE TABLE card_activities (
  id UUID PRIMARY KEY,
  card_id UUID NOT NULL (foreign key),
  user_id UUID NOT NULL (foreign key),
  action_type ENUM (
    'created', 'updated', 'moved', 'archived',
    'assignee_added', 'assignee_removed',
    'label_added', 'label_removed',
    'comment_added', 'attachment_added',
    'checklist_item_added', 'checklist_item_completed',
    'due_date_set',      // ✓ Already supported
    'due_date_changed',  // ✓ Already supported
    'due_date_removed',  // ✓ Already supported
    'priority_changed',
    'description_changed',
    'title_changed'
  ),
  metadata JSONB NULL,
  created_at TIMESTAMP DEFAULT now()
)
```

**Activity Action Types Already Support Due Date:**
- `due_date_set` - When due date is first set
- `due_date_changed` - When due date is modified
- `due_date_removed` - When due date is cleared

**Activity Methods:**
- `logActivity(input: CreateActivity)` - Log activity
- `getActivitiesByCardId(card_id)` - Retrieve card activities
- `getActivityStats(card_id)` - Get activity statistics

### WebSocket Real-time Events
**Location:** `/home/user/sprinty/api/src/modules/websocket/`

**Service:** `WebSocketService` handles real-time communication

**Supported Events:**
- CARD_CREATED
- CARD_UPDATED
- CARD_MOVED
- CARD_DELETED
- LIST_CREATED, LIST_UPDATED, etc.
- BOARD_PRESENCE (tracks active users)

**Frontend Integration:** `useWebSocket()` hook in WebSocketContext

---

## 7. PROJECT STRUCTURE

### Backend Structure
```
/home/user/sprinty/api/src/
├── app.ts (Fastify setup)
├── bootstrap.ts (Server initialization & plugin registration)
├── swagger.ts (API documentation config)
├── db/
│   ├── migrations/ (Database schemas)
│   ├── seeds/ (Database seeders)
│   ├── schemas/ (Knex schema builders)
│   ├── knexPlugin.ts
│   └── knexInstance.ts
├── modules/
│   ├── cards/ (Card CRUD & business logic)
│   ├── activities/ (Activity logging)
│   ├── websocket/ (Real-time communication)
│   ├── assignees/ (Card assignments)
│   ├── labels/ (Card labels)
│   ├── checklists/ (Checklist items)
│   ├── comments/ (Comments & replies)
│   ├── attachments/ (File uploads)
│   ├── boards/ (Board management)
│   ├── lists/ (List management)
│   ├── sprints/ (Sprint management)
│   ├── time-tracking/ (Time tracking)
│   ├── analytics/ (Analytics & reporting)
│   ├── search/ (Full-text search)
│   └── ...
├── configs/
│   └── config.ts (Environment & configuration)
└── __test__/ (Test files)
```

### Frontend Structure
```
/home/user/sprinty/client/src/
├── components/ (React components)
├── pages/ (Page routes)
├── hooks/ (Custom React hooks)
├── contexts/ (React contexts)
├── types/ (TypeScript definitions)
├── lib/ (Utilities)
├── routes/ (Router configuration)
├── App.tsx
└── main.tsx (Entry point)
```

---

## 8. KEY FINDINGS FOR DUE DATE CALENDAR FEATURE

### Already Implemented:
✓ **Database Schema:** due_date field exists on cards table (TIMESTAMP nullable)
✓ **API Endpoint:** PATCH /cards/details supports due_date updates
✓ **Frontend Display:** CardItem and CardDetailsModal already show due_date
✓ **Activity Logging:** All due_date actions (set, changed, removed) in activity enum
✓ **Type Definitions:** Card interface includes due_date field
✓ **Frontend Styling:** Uses Calendar icon from lucide-react

### Ready for Calendar UI Implementation:
- Toast notification system is in place
- WebSocket real-time updates working
- Activity logging infrastructure ready
- Card details modal structure exists
- Update endpoint supports due_date changes

### Implementation Gaps (Likely TODOs):
- No date picker/calendar component for selecting due_date
- No dedicated calendar view of cards by due_date
- No date-based filtering or sorting UI
- No due_date reminder notifications
- No calendar grid/monthly view

---

## 9. API DOCUMENTATION

### Swagger/OpenAPI Available at:
```
http://localhost:8080/docs
```

### Health Check:
```
GET http://localhost:8080/health
```

---

## 10. FILE LOCATIONS REFERENCE

| Purpose | Location |
|---------|----------|
| Card schema (TypeScript) | `/home/user/sprinty/api/src/modules/cards/card.schema.ts` |
| Card repository | `/home/user/sprinty/api/src/modules/cards/card.repository.ts` |
| Card routes | `/home/user/sprinty/api/src/modules/cards/card.route.ts` |
| Card service | `/home/user/sprinty/api/src/modules/cards/card.service.ts` |
| Card component | `/home/user/sprinty/client/src/components/card/CardItem.tsx` |
| Card details modal | `/home/user/sprinty/client/src/components/card/CardDetailsModal.tsx` |
| Activity service | `/home/user/sprinty/api/src/modules/activities/activity.service.ts` |
| WebSocket service | `/home/user/sprinty/api/src/modules/websocket/websocket.service.ts` |
| Frontend types | `/home/user/sprinty/client/src/types/types.tsx` |
| Database migration | `/home/user/sprinty/api/src/db/migrations/20251117000001_add_card_details_fields.ts` |

---

## 11. ENVIRONMENT SETUP

### Frontend Environment Variables
`/home/user/sprinty/client/.env.example`:
- VITE_API_HOST
- VITE_API_PORT
- VITE_API_VERSION

### Backend Environment Variables
`/home/user/sprinty/api/.env.example`:
- Database connection strings
- Server ports
- Client CORS origins

---

## Summary

The Sprinty application is a **well-structured, modern TypeScript-based task management system** with:

1. **Solid Database Foundation:** PostgreSQL with Knex.js, migrations properly versioned
2. **Complete API Layer:** Fastify REST API with type-safe schema validation
3. **Real-time Capabilities:** Socket.io integrated for live updates
4. **Activity Tracking:** Comprehensive audit trail with metadata support
5. **Modern Frontend:** React 18 with Zustand for state and React Query for data
6. **UI Foundation:** Radix UI components with Tailwind CSS
7. **Due Date Support:** Already partially implemented at database and API layers

**The due_date feature is infrastructure-ready; the main remaining work is implementing the calendar UI component and date picker integration.**

