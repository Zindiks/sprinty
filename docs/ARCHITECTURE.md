# Sprinty Architecture Documentation

> **Last Updated:** 2025-11-17
> **Version:** 1.0

This document provides a comprehensive overview of Sprinty's technical architecture, design patterns, and implementation details.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Principles](#architecture-principles)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Database Architecture](#database-architecture)
6. [Real-Time Architecture](#real-time-architecture)
7. [Authentication & Authorization](#authentication--authorization)
8. [State Management](#state-management)
9. [API Design](#api-design)
10. [Data Flow](#data-flow)
11. [Error Handling](#error-handling)
12. [Performance Optimization](#performance-optimization)
13. [Security Architecture](#security-architecture)
14. [Deployment Architecture](#deployment-architecture)

---

## System Overview

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      Client (Browser)                    │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   React     │  │   Zustand    │  │   TanStack    │  │
│  │ Components  │◄─┤    Store     │◄─┤    Query      │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│         │                │                  │            │
│         │         ┌──────┴──────┐          │            │
│         │         │ Socket.io   │          │            │
│         │         │   Client    │          │            │
│         │         └──────┬──────┘          │            │
└─────────┼────────────────┼─────────────────┼────────────┘
          │                │                 │
          │ HTTP/REST      │ WebSocket       │ HTTP/REST
          │                │                 │
┌─────────┼────────────────┼─────────────────┼────────────┐
│         ▼                ▼                 ▼            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Fastify    │  │  Socket.io   │  │   Fastify    │ │
│  │   Routes     │  │   Server     │  │  Middleware  │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                 │                  │          │
│  ┌──────┴─────────────────┴──────────────────┴───────┐ │
│  │              Business Logic Layer                  │ │
│  │        (Controllers, Services, Repositories)       │ │
│  └─────────────────────────┬────────────────────────┘ │
│                            │                            │
│         ┌──────────────────┴──────────────────┐        │
│         │                                      │        │
│    ┌────▼────┐                          ┌─────▼─────┐ │
│    │PostgreSQL│                          │   Redis   │ │
│    │ Database │                          │   Cache   │ │
│    └──────────┘                          └───────────┘ │
│                                                         │
│                    Backend (Fastify + Node.js)         │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18.3.1 | UI framework |
| | Vite 6.0.11 | Build tool and dev server |
| | TypeScript 5.6.2 | Type safety |
| | Tailwind CSS 3.4.16 | Styling |
| | Zustand 5.0.3 | Client state management |
| | TanStack Query 5.64.1 | Server state management |
| | Socket.io-client 4.8.1 | Real-time communication |
| **Backend** | Fastify 5.2.1 | Web framework |
| | TypeScript 5.7.3 | Type safety |
| | Socket.io 4.8.1 | Real-time server |
| | TypeBox | Schema validation |
| | Jest 29.7.0 | Testing framework |
| **Database** | PostgreSQL | Primary database |
| | Knex.js 3.1.0 | Query builder & migrations |
| **Cache** | Redis | Caching layer |
| **Monitoring** | Prometheus | Metrics collection |
| | Grafana | Metrics visualization |
| **DevOps** | Docker Compose | Local development |
| | GitHub Actions | CI/CD |

---

## Architecture Principles

### 1. Modular Design
- Each feature is a self-contained module
- Clear separation of concerns (Controller → Service → Repository)
- Easy to add, remove, or modify features independently

### 2. Type Safety
- TypeScript throughout the entire stack
- Runtime validation with TypeBox
- Shared types between frontend and backend (potential future improvement)

### 3. Scalability
- Horizontal scaling support via Redis adapter for Socket.io
- Database connection pooling
- Caching strategy with Redis

### 4. Maintainability
- Consistent code structure across modules
- Comprehensive documentation
- Code quality enforcement (ESLint, Prettier)

### 5. Performance
- Optimistic UI updates
- Server-side caching
- Efficient database queries with indexes
- Lazy loading and code splitting (frontend)

---

## Backend Architecture

### Module Structure

Each backend module follows a consistent layered architecture:

```
api/src/modules/<feature>/
├── <feature>.controller.ts    # HTTP request handling
├── <feature>.service.ts       # Business logic
├── <feature>.repository.ts    # Data access
├── <feature>.route.ts         # Route definitions
└── <feature>.schema.ts        # Validation schemas
```

### Layer Responsibilities

#### **Controller Layer**
- **Purpose**: Handle HTTP requests and responses
- **Responsibilities**:
  - Extract data from request (body, params, query)
  - Call service layer methods
  - Format responses
  - Handle HTTP errors
- **Example**: `boards/board.controller.ts`

```typescript
// Simplified example
export class BoardController {
  async getBoardController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params;
    const board = await boardService.getBoard(id);
    return reply.send(board);
  }
}
```

#### **Service Layer**
- **Purpose**: Business logic and orchestration
- **Responsibilities**:
  - Validate business rules
  - Orchestrate multiple repository calls
  - Transform data between layers
  - Emit WebSocket events
- **Example**: `boards/board.service.ts`

```typescript
// Simplified example
export class BoardService {
  async getBoard(id: string) {
    const board = await boardRepository.findById(id);
    if (!board) throw new NotFoundError('Board not found');
    return board;
  }
}
```

#### **Repository Layer**
- **Purpose**: Data access and persistence
- **Responsibilities**:
  - Execute database queries
  - Map database rows to domain objects
  - Handle database errors
  - No business logic
- **Example**: `boards/board.repository.ts`

```typescript
// Simplified example
export class BoardRepository {
  async findById(id: string) {
    return knex('boards').where({ id }).first();
  }
}
```

#### **Route Layer**
- **Purpose**: API endpoint definitions
- **Responsibilities**:
  - Define routes and HTTP methods
  - Attach validation schemas
  - Bind controllers
  - Add middleware
- **Example**: `boards/board.route.ts`

#### **Schema Layer**
- **Purpose**: Request/response validation
- **Responsibilities**:
  - Define TypeBox schemas
  - Validate request bodies, params, queries
  - Generate Swagger documentation
- **Example**: `boards/board.schema.ts`

### Module Registration

Modules are registered in `api/src/bootstrap.ts`:

```typescript
// Simplified example
async function bootstrap() {
  await fastify.register(boardRoutes, { prefix: '/api/v1/boards' });
  await fastify.register(listRoutes, { prefix: '/api/v1/lists' });
  await fastify.register(cardRoutes, { prefix: '/api/v1/cards' });
  // ... other modules
}
```

### Dependency Injection

Fastify's plugin system provides dependency injection:

```typescript
// Register Knex plugin
fastify.decorate('knex', knexInstance);

// Access in controllers/services
const boards = await fastify.knex('boards').select('*');
```

---

## Frontend Architecture

### Component Hierarchy

```
App (Root)
├── QueryClientProvider (React Query)
├── UserProvider (Auth Context)
├── WebSocketProvider (Real-time Context)
└── Router
    ├── Home (Landing page)
    ├── Boards (Board list)
    ├── BoardView (Main workspace)
    │   ├── BoardNavBar
    │   ├── ListContainer[]
    │   │   ├── ListHeader
    │   │   ├── CardItem[]
    │   │   └── AddCardForm
    │   └── AddListForm
    ├── Dashboard
    ├── ProfilePage
    └── Organization
```

### Component Organization

```
client/src/components/
├── board/              # Board-specific components
│   ├── BoardList.tsx
│   ├── BoardNavBar.tsx
│   └── BoardTitleForm.tsx
├── list/               # List-specific components
│   ├── ListContainer.tsx
│   ├── ListHeader.tsx
│   └── AddListForm.tsx
├── card/               # Card-specific components
│   ├── CardItem.tsx
│   ├── CardModal.tsx
│   └── AddCardForm.tsx
└── ui/                 # Reusable UI components (shadcn/ui)
    ├── Button.tsx
    ├── Dialog.tsx
    ├── Input.tsx
    └── ...
```

### Component Patterns

#### **Container Components**
- Manage data fetching and state
- Pass data to presentational components
- Handle user actions

```typescript
// Example: ListContainer.tsx
export function ListContainer({ listId }: Props) {
  const { data: cards } = useCards(listId);
  const { mutate: createCard } = useCreateCard();

  return (
    <div>
      {cards.map(card => (
        <CardItem key={card.id} card={card} />
      ))}
      <AddCardForm onSubmit={createCard} />
    </div>
  );
}
```

#### **Presentational Components**
- Receive data via props
- Focus on UI rendering
- No data fetching or business logic

```typescript
// Example: CardItem.tsx
export function CardItem({ card }: Props) {
  return (
    <div className="card">
      <h3>{card.title}</h3>
      <p>{card.description}</p>
    </div>
  );
}
```

### Custom Hooks

Custom hooks encapsulate data fetching and state logic:

```
client/src/hooks/
├── useBoards.ts        # Board CRUD operations
├── useLists.ts         # List CRUD operations
├── useCards.ts         # Card CRUD operations
├── useProfile.ts       # Profile management
└── websocket/
    └── useBoardWebSocket.ts  # Real-time updates
```

**Example Hook:**
```typescript
// useBoards.ts
export function useBoards(organizationId: string) {
  return useQuery({
    queryKey: ['boards', organizationId],
    queryFn: () => fetchBoards(organizationId),
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
    },
  });
}
```

---

## Database Architecture

### Schema Design

#### **Entity-Relationship Model**

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────┐
│    users    │───────│ user_organization│───────│organizations│
└─────────────┘       └──────────────────┘       └─────────────┘
       │                                                  │
       │ 1:1                                             │ 1:N
       │                                                  │
┌─────────────┐                                    ┌─────────────┐
│  profiles   │                                    │   boards    │
└─────────────┘                                    └─────────────┘
                                                         │
                                                         │ 1:N
                                                         │
                                                    ┌─────────────┐
                                                    │    lists    │
                                                    └─────────────┘
                                                         │
                                                         │ 1:N
                                                         │
                                                    ┌─────────────┐
                                                    │    cards    │
                                                    └─────────────┘
                                                         │
                        ┌────────────────────────────────┼────────────────┐
                        │                                │                │
                   ┌────────────┐                  ┌────────────┐  ┌────────────┐
                   │card_labels │                  │card_assignees│ │  comments  │
                   └────────────┘                  └────────────┘  └────────────┘
```

### Core Tables

#### **users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **boards**
```sql
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  organization_id UUID REFERENCES organizations(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **cards**
```sql
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'TODO',
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  due_date TIMESTAMP,
  priority VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Indexing Strategy

```sql
-- Performance indexes
CREATE INDEX idx_boards_organization_id ON boards(organization_id);
CREATE INDEX idx_lists_board_id ON lists(board_id);
CREATE INDEX idx_cards_list_id ON cards(list_id);
CREATE INDEX idx_card_assignees_card_id ON card_assignees(card_id);
CREATE INDEX idx_card_assignees_user_id ON card_assignees(user_id);
CREATE INDEX idx_comments_card_id ON comments(card_id);
```

### Migration Strategy

- **Version Control**: All schema changes tracked in migrations
- **Rollback Support**: Each migration has a down() method
- **Naming Convention**: `YYYYMMDDHHMMSS_descriptive_name.ts`
- **Order**: Migrations run in chronological order

**Example Migration:**
```typescript
// 20250112_create_boards_table.ts
export async function up(knex: Knex) {
  return knex.schema.createTable('boards', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title', 255).notNullable();
    table.text('description');
    table.uuid('organization_id').references('id').inTable('organizations');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('boards');
}
```

---

## Real-Time Architecture

### WebSocket Communication

Sprinty uses **Socket.io** for bidirectional real-time communication.

#### **Architecture**

```
┌──────────────┐                    ┌──────────────┐
│  Client A    │                    │  Client B    │
│  (Browser)   │                    │  (Browser)   │
└──────┬───────┘                    └──────┬───────┘
       │                                   │
       │ socket.emit('card:create')       │
       │                                   │
       ▼                                   │
┌──────────────────────────────────────────────────┐
│           Socket.io Server (Fastify)             │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │           Room: board-123                  │ │
│  │   [Client A Socket, Client B Socket]       │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  on('card:create') → Validate → Save to DB      │
│  io.to('board-123').emit('card:created', data)  │
└──────────────────────────────────────────────────┘
       │                                   │
       │  socket.on('card:created')       │
       │                                   ▼
       │                           Update UI automatically
       ▼
Update UI automatically
```

#### **Event Types**

| Event | Direction | Purpose |
|-------|-----------|---------|
| `board:join` | Client → Server | Join board room |
| `board:leave` | Client → Server | Leave board room |
| `board:updated` | Server → Clients | Board changed |
| `list:created` | Server → Clients | New list added |
| `list:updated` | Server → Clients | List modified |
| `list:deleted` | Server → Clients | List removed |
| `card:created` | Server → Clients | New card added |
| `card:updated` | Server → Clients | Card modified |
| `card:moved` | Server → Clients | Card moved |
| `card:deleted` | Server → Clients | Card removed |
| `board:presence` | Server → Clients | User list updated |

#### **Room-Based Broadcasting**

Users join board-specific rooms to receive only relevant updates:

```typescript
// Backend: Join room
socket.on('board:join', (boardId) => {
  socket.join(`board-${boardId}`);
  io.to(`board-${boardId}`).emit('board:presence', activeUsers);
});

// Backend: Broadcast to room
io.to(`board-${boardId}`).emit('card:created', cardData);

// Frontend: Listen for events
socket.on('card:created', (card) => {
  queryClient.setQueryData(['cards', listId], (old) => [...old, card]);
});
```

---

## Authentication & Authorization

### OAuth 2.0 Flow (GitHub)

```
┌────────┐                                         ┌────────────┐
│ Client │                                         │   GitHub   │
└────┬───┘                                         └─────┬──────┘
     │                                                   │
     │ 1. Click "Login with GitHub"                     │
     ├──────────────────────────────────────────────────▶
     │                                                   │
     │ 2. Redirect to GitHub OAuth page                 │
     ◀──────────────────────────────────────────────────┤
     │                                                   │
     │ 3. User authorizes app                           │
     ├──────────────────────────────────────────────────▶
     │                                                   │
     │ 4. Redirect to callback with code                │
     ◀──────────────────────────────────────────────────┤
     │                                                   │
┌────┴───┐                                         ┌─────┴──────┐
│  API   │                                         │   GitHub   │
└────┬───┘                                         └─────┬──────┘
     │                                                   │
     │ 5. Exchange code for access token                │
     ├──────────────────────────────────────────────────▶
     │                                                   │
     │ 6. Receive access token                          │
     ◀──────────────────────────────────────────────────┤
     │                                                   │
     │ 7. Fetch user data                               │
     ├──────────────────────────────────────────────────▶
     │                                                   │
     │ 8. Receive user profile                          │
     ◀──────────────────────────────────────────────────┤
     │                                                   │
┌────┴───┐                                         ┌─────┴──────┐
│ Client │                                         │     API    │
└────┬───┘                                         └─────┬──────┘
     │                                                   │
     │ 9. Create session & return token                 │
     ◀──────────────────────────────────────────────────┤
     │                                                   │
     │ 10. Store token in memory/localStorage           │
     │                                                   │
```

### Session Management

- **Session Storage**: In-memory or Redis-backed sessions
- **Token Format**: Session ID stored in HTTP-only cookies
- **WebSocket Auth**: Session token passed during connection handshake

---

## State Management

### Frontend State Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Application State                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │     TanStack Query (Server State)            │  │
│  │  - Boards, Lists, Cards (cached)             │  │
│  │  - Automatic refetching                      │  │
│  │  - Optimistic updates                        │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │     Zustand (Client State)                   │  │
│  │  - Drag and drop state                       │  │
│  │  - UI state (modals, dropdowns)             │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │     React Context (Global State)             │  │
│  │  - UserContext (auth, profile)               │  │
│  │  - WebSocketContext (connection)             │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │     Local Component State                    │  │
│  │  - Form inputs                               │  │
│  │  - Temporary UI state                        │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### State Management Decisions

| State Type | Technology | Reason |
|-----------|-----------|--------|
| Server data (boards, cards) | TanStack Query | Caching, refetching, optimistic updates |
| Drag-and-drop state | Zustand | Needs to be shared across components |
| User authentication | React Context | Global state, rarely changes |
| WebSocket connection | React Context | Single connection, global access |
| Form inputs | Local useState | Component-specific, no sharing needed |

---

## API Design

### RESTful Conventions

- **Resource-based URLs**: `/api/v1/boards/:id`
- **HTTP Methods**: GET, POST, PUT, PATCH, DELETE
- **Status Codes**:
  - `200 OK`: Successful GET, PUT, PATCH
  - `201 Created`: Successful POST
  - `204 No Content`: Successful DELETE
  - `400 Bad Request`: Invalid input
  - `401 Unauthorized`: Not authenticated
  - `403 Forbidden`: Not authorized
  - `404 Not Found`: Resource doesn't exist
  - `500 Internal Server Error`: Server error

### API Versioning

All endpoints are prefixed with `/api/v1/` to support future versioning:

```
/api/v1/boards
/api/v1/lists
/api/v1/cards
```

### Request/Response Format

**Request:**
```json
POST /api/v1/boards
Content-Type: application/json

{
  "title": "My Project",
  "description": "Project board",
  "organization_id": "uuid-here"
}
```

**Response:**
```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "board-uuid",
  "title": "My Project",
  "description": "Project board",
  "organization_id": "uuid-here",
  "created_at": "2025-11-17T10:00:00Z",
  "updated_at": "2025-11-17T10:00:00Z"
}
```

---

## Data Flow

### Creating a Card (Example)

```
┌─────────┐                                           ┌─────────┐
│ User    │                                           │ Browser │
└────┬────┘                                           └────┬────┘
     │                                                     │
     │ 1. Click "Add Card"                                │
     ├────────────────────────────────────────────────────▶
     │                                                     │
     │ 2. Fill form and submit                            │
     ├────────────────────────────────────────────────────▶
     │                                                     │
┌────┴────────────────────────────────────────────────────┴────┐
│                     Frontend (React)                         │
│                                                              │
│  3. useCreateCard.mutate({ title, listId })                 │
│  4. Optimistic update (add card to UI immediately)          │
│  5. POST /api/v1/cards                                      │
└────┬─────────────────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────────────────────┐
│                     Backend (Fastify)                        │
│                                                              │
│  6. cardController.createCard()                             │
│  7. Validate request body with TypeBox                      │
│  8. cardService.createCard()                                │
│  9. cardRepository.insert(card)                             │
│  10. Database INSERT                                        │
│  11. Emit WebSocket event: io.emit('card:created', card)    │
│  12. Return card to client                                  │
└────┬─────────────────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────────────────────┐
│                     Database (PostgreSQL)                    │
│                                                              │
│  13. INSERT INTO cards (...)                                │
│  14. Return inserted card                                   │
└────┬─────────────────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────────────────────┐
│                     WebSocket (Socket.io)                    │
│                                                              │
│  15. Broadcast 'card:created' to all users in board room    │
└────┬─────────────────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────────────────────┐
│                     Frontend (Other Users)                   │
│                                                              │
│  16. Receive 'card:created' event                           │
│  17. Update TanStack Query cache                            │
│  18. UI automatically re-renders with new card              │
└──────────────────────────────────────────────────────────────┘
```

---

## Error Handling

### Backend Error Handling

```typescript
// Custom error classes
export class NotFoundError extends Error {
  statusCode = 404;
}

export class ValidationError extends Error {
  statusCode = 400;
}

// Global error handler
fastify.setErrorHandler((error, request, reply) => {
  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    error: error.name,
    message: error.message,
    statusCode,
  });
});
```

### Frontend Error Handling

```typescript
// TanStack Query error handling
const { data, error, isError } = useQuery({
  queryKey: ['boards'],
  queryFn: fetchBoards,
  onError: (error) => {
    toast.error(`Failed to load boards: ${error.message}`);
  },
});

// Try-catch for mutations
const createBoard = useMutation({
  mutationFn: async (data) => {
    try {
      return await api.post('/boards', data);
    } catch (error) {
      toast.error('Failed to create board');
      throw error;
    }
  },
});
```

---

## Performance Optimization

### Backend Optimizations

1. **Database Query Optimization**
   - Use indexes on foreign keys
   - Avoid N+1 queries with joins
   - Use `select()` to limit columns

2. **Caching with Redis**
   - Cache frequently accessed data
   - Cache session data
   - Cache board presence information

3. **Connection Pooling**
   - Knex connection pool configured
   - Reuse database connections

### Frontend Optimizations

1. **Code Splitting**
   - Route-based code splitting with React Router
   - Lazy load components with `React.lazy()`

2. **Memoization**
   - Use `React.memo()` for expensive components
   - Use `useMemo()` for expensive calculations
   - Use `useCallback()` for function references

3. **Virtual Scrolling**
   - For long lists of cards (future enhancement)

4. **Optimistic Updates**
   - Update UI before server response
   - Rollback on error

---

## Security Architecture

### Current Security Measures

1. **Authentication**
   - OAuth 2.0 with GitHub
   - Session-based authentication
   - HTTP-only cookies

2. **Input Validation**
   - TypeBox schema validation
   - Sanitize user input
   - Type safety with TypeScript

3. **CORS Configuration**
   - Whitelist allowed origins
   - Credentials support

4. **WebSocket Security**
   - Authenticate connections with session tokens
   - Room-based authorization

### Planned Security Enhancements

1. **Rate Limiting**
2. **CSRF Protection**
3. **Content Security Policy**
4. **Two-Factor Authentication**
5. **API Key Authentication**

---

## Deployment Architecture

### Current (Development)

```
┌──────────────────────────────────────┐
│      Developer Machine (localhost)   │
│                                      │
│  ┌────────┐  ┌────────┐  ┌────────┐ │
│  │  API   │  │ Client │  │Postgres│ │
│  │ :4000  │  │ :5173  │  │ :5432  │ │
│  └────────┘  └────────┘  └────────┘ │
└──────────────────────────────────────┘
```

### Future (AWS Production)

```
                  ┌─────────────┐
                  │ CloudFront  │
                  │    (CDN)    │
                  └──────┬──────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
    ┌─────▼─────┐               ┌──────▼──────┐
    │  S3       │               │  Load       │
    │  Bucket   │               │  Balancer   │
    │  (Static) │               └──────┬──────┘
    └───────────┘                      │
                                       │
                        ┌──────────────┼──────────────┐
                        │              │              │
                  ┌─────▼─────┐  ┌────▼────┐  ┌─────▼─────┐
                  │  EC2/ECS  │  │ EC2/ECS │  │  EC2/ECS  │
                  │  (API)    │  │  (API)  │  │   (API)   │
                  └─────┬─────┘  └────┬────┘  └─────┬─────┘
                        │              │              │
                        └──────────────┼──────────────┘
                                       │
                        ┌──────────────┴──────────────┐
                        │                             │
                  ┌─────▼─────┐               ┌──────▼──────┐
                  │    RDS    │               │ ElastiCache │
                  │(PostgreSQL)│               │   (Redis)   │
                  └───────────┘               └─────────────┘
```

---

## Conclusion

Sprinty's architecture is designed for scalability, maintainability, and performance. The modular design, clear separation of concerns, and modern technology stack provide a solid foundation for future growth.

**Key Architectural Strengths:**
- ✅ Modular, layered architecture
- ✅ Type safety throughout the stack
- ✅ Real-time collaboration with WebSocket
- ✅ Efficient state management
- ✅ Comprehensive error handling
- ✅ Performance optimizations

**Future Architectural Improvements:**
- Microservices architecture (if needed for scale)
- Event sourcing for audit trail
- GraphQL for more flexible API
- Server-side rendering (SSR) for better SEO

---

*Last updated: 2025-11-17*
*For questions or clarifications, open an issue on GitHub.*
