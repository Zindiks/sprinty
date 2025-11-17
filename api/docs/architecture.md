# API Architecture Documentation

**Last Updated:** 2025-11-17

---

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Architecture Patterns](#architecture-patterns)
4. [Database Schema](#database-schema)
5. [Authentication & Security](#authentication--security)
6. [Real-time Communication](#real-time-communication)
7. [API Documentation](#api-documentation)
8. [Configuration & Environment](#configuration--environment)
9. [Infrastructure](#infrastructure)
10. [Performance & Scalability](#performance--scalability)

---

## Tech Stack

### Core Framework & Runtime

| Technology | Version | Purpose |
|------------|---------|---------|
| Fastify | 5.2.1 | High-performance Node.js web framework |
| Node.js | Latest LTS | JavaScript runtime |
| TypeScript | 5.7.3 | Type-safe JavaScript |
| TypeBox | 0.34.14 | Runtime type validation |

**Why Fastify?**
- 2-3x faster than Express
- Built-in schema validation
- Excellent TypeScript support
- Plugin architecture
- Low overhead

---

### Database & ORM

| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | Latest | Production RDBMS |
| Knex.js | 3.1.0 | Query builder & migrations |
| SQLite3 | 5.1.7 | Development/testing database |

**Connection Pool Configuration:**
```typescript
{
  min: 2,           // Minimum connections
  max: 10,          // Maximum connections
  idleTimeoutMillis: 30000
}
```

---

### Authentication & Security

| Technology | Version | Purpose |
|------------|---------|---------|
| @fastify/oauth2 | 8.1.1 | OAuth 2.0 implementation |
| @fastify/session | 11.1.0 | Session management |
| @fastify/cors | 10.0.2 | CORS configuration |
| @fastify/multipart | 9.3.0 | File upload handling (10MB limit) |

---

### API & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| @fastify/swagger | 9.4.2 | OpenAPI spec generation |
| @fastify/swagger-ui | 5.2.1 | Interactive API docs |
| @sinclair/typebox | 0.34.14 | JSON Schema validation |
| @fastify/type-provider-typebox | 5.1.0 | TypeBox integration |

---

### Real-time Communication

| Technology | Version | Purpose |
|------------|---------|---------|
| Socket.io | 4.8.1 | WebSocket server |
| node-cron | 4.2.1 | Scheduled tasks (reminders) |

---

### Infrastructure & Monitoring

| Technology | Version | Purpose |
|------------|---------|---------|
| fastify-metrics | 12.1.0 | Prometheus metrics |
| Prometheus | - | Metrics collection (port 9090) |
| Grafana | - | Metrics visualization (port 3030) |
| Redis | - | Cache layer (port 6379) |
| Docker | - | Containerization |
| PM2 | - | Process manager |

---

### Testing Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| Jest | 29.7.0 | Test runner |
| ts-jest | 29.2.5 | TypeScript support for Jest |
| supertest | 7.0.0 | HTTP assertions |
| chai | 5.1.2 | BDD assertions |
| nock | 14.0.0 | HTTP mocking |

**Test Configuration:**
```typescript
{
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testMatch: ["**/__test__/**/*.test.ts"]
}
```

---

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| ts-node | 10.9.2 | TypeScript execution |
| ts-node-dev | 2.0.0 | Hot reload dev server |
| dotenv | 16.4.7 | Environment variables |
| @fastify/env | 5.0.2 | Env validation |

---

## Project Structure

```
api/
├── src/
│   ├── app.ts                          # Application entry point
│   ├── bootstrap.ts                    # Server initialization & plugin registration
│   ├── swagger.ts                      # Swagger/OpenAPI configuration
│   │
│   ├── configs/                        # Configuration management
│   │   ├── config.ts                   # Application config
│   │   └── envConfig.ts                # Environment variable schemas
│   │
│   ├── db/                             # Database layer
│   │   ├── knexFile.ts                # Knex configuration
│   │   ├── knexInstance.ts            # Database instance
│   │   ├── knexPlugin.ts              # Fastify plugin for Knex
│   │   ├── migrations/                # 21 migration files
│   │   │   ├── 20241205_create_users.ts
│   │   │   ├── 20241205_create_profiles.ts
│   │   │   ├── 20241205_create_organizations.ts
│   │   │   ├── 20241205_create_boards.ts
│   │   │   ├── 20241205_create_lists.ts
│   │   │   ├── 20241205_create_cards.ts
│   │   │   ├── 20241205_create_card_assignees.ts
│   │   │   ├── 20241205_create_labels.ts
│   │   │   ├── 20241205_create_card_labels.ts
│   │   │   ├── 20241205_create_checklist_items.ts
│   │   │   ├── 20241205_create_comments.ts
│   │   │   ├── 20241205_create_attachments.ts
│   │   │   ├── 20241205_create_card_activities.ts
│   │   │   ├── 20241205_create_sprints.ts
│   │   │   ├── 20241205_create_time_logs.ts
│   │   │   ├── 20241205_create_board_templates.ts
│   │   │   ├── 20241205_create_dashboard_layouts.ts
│   │   │   └── 20241205_create_card_reminders.ts
│   │   ├── schemas/                   # 16 TypeBox schema files
│   │   └── seeds/                     # Seed data files
│   │
│   ├── modules/                        # Feature modules (domain-driven)
│   │   │
│   │   ├── oauth/                     # Authentication
│   │   │   ├── oauth.route.ts
│   │   │   ├── oauth.controller.ts
│   │   │   ├── oauth.service.ts
│   │   │   └── oauth.schema.ts
│   │   │
│   │   ├── profiles/                  # User profiles
│   │   │   ├── profile.route.ts
│   │   │   ├── profile.controller.ts
│   │   │   ├── profile.service.ts
│   │   │   ├── profile.repository.ts
│   │   │   └── profile.schema.ts
│   │   │
│   │   ├── organizations/             # Multi-org support
│   │   │   ├── organization.route.ts
│   │   │   ├── organization.controller.ts
│   │   │   ├── organization.service.ts
│   │   │   ├── organization.repository.ts
│   │   │   └── organization.schema.ts
│   │   │
│   │   ├── boards/                    # Board CRUD
│   │   │   ├── board.route.ts
│   │   │   ├── board.controller.ts
│   │   │   ├── board.service.ts
│   │   │   ├── board.repository.ts
│   │   │   └── board.schema.ts
│   │   │
│   │   ├── lists/                     # List management
│   │   │   ├── list.route.ts
│   │   │   ├── list.controller.ts
│   │   │   ├── list.service.ts
│   │   │   ├── list.repository.ts
│   │   │   └── list.schema.ts
│   │   │
│   │   ├── cards/                     # Card CRUD & bulk ops
│   │   │   ├── card.route.ts
│   │   │   ├── card.controller.ts
│   │   │   ├── card.service.ts
│   │   │   ├── card.repository.ts
│   │   │   └── card.schema.ts
│   │   │
│   │   ├── assignees/                 # Card assignee management
│   │   ├── labels/                    # Label management
│   │   ├── checklists/                # Checklist items
│   │   ├── comments/                  # Card comments (threaded)
│   │   ├── attachments/               # File attachments
│   │   ├── activities/                # Activity tracking
│   │   │
│   │   ├── sprints/                   # Sprint management
│   │   ├── time-tracking/             # Time logging
│   │   │
│   │   ├── analytics/                 # Analytics & metrics
│   │   ├── reports/                   # CSV/iCal exports
│   │   │
│   │   ├── search/                    # Global search
│   │   ├── templates/                 # Board templates
│   │   ├── dashboard-layouts/         # User customization
│   │   │
│   │   ├── reminders/                 # Card reminders (⚠️ NOT REGISTERED)
│   │   │
│   │   └── websocket/                 # Real-time features
│   │       ├── websocket.server.ts
│   │       ├── websocket.service.ts
│   │       └── websocket.middleware.ts
│   │
│   └── __test__/                       # Test files
│       ├── oauth.test.ts              # 88 lines
│       ├── organization.test.ts       # 103 lines
│       ├── board.test.ts              # 91 lines
│       ├── list.test.ts               # 132 lines
│       ├── card.test.ts               # 108 lines
│       ├── search.test.ts             # 294 lines
│       ├── search.integration.test.ts # 257 lines
│       └── search.controller.test.ts  # 195 lines
│
├── docker-compose.yml                  # Container orchestration
├── Dockerfile                          # Container definition
├── jest.config.ts                      # Test configuration
├── knexfile.js                         # Knex entry point
├── package.json                        # Dependencies
└── tsconfig.json                       # TypeScript config
```

### Module Statistics
- **Total Modules:** 21
- **Registered Modules:** 20
- **Unregistered:** 1 (reminders)
- **Controllers:** 21 files
- **Services:** 22 files
- **Repositories:** 19 files
- **Routes:** 20 registered + 1 unregistered

---

## Architecture Patterns

### 1. Domain-Driven Module Structure

Each feature module follows a consistent layered architecture:

```
module/
├── {module}.route.ts      # Route definitions & schema validation
├── {module}.controller.ts # HTTP request/response handling
├── {module}.service.ts    # Business logic
├── {module}.repository.ts # Database operations
└── {module}.schema.ts     # TypeBox validation schemas
```

**Layer Responsibilities:**

```
┌─────────────────────────────────────────────────────────────┐
│  Route Layer (*.route.ts)                                   │
│  - Define HTTP routes                                       │
│  - Schema validation (TypeBox)                              │
│  - Route-level middleware                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│  Controller Layer (*.controller.ts)                         │
│  - Extract request data                                     │
│  - Call service methods                                     │
│  - Format responses                                         │
│  - Error handling                                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│  Service Layer (*.service.ts)                               │
│  - Business logic                                           │
│  - Validation                                               │
│  - Orchestrate multiple repositories                        │
│  - Transaction management                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│  Repository Layer (*.repository.ts)                         │
│  - Database queries                                         │
│  - Raw SQL via Knex                                         │
│  - Data mapping                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Example Flow: Create Card

```typescript
// 1. Route Definition (card.route.ts)
fastify.post('/cards', {
  schema: {
    body: CreateCardSchema,
    response: {
      201: CardResponseSchema
    }
  },
  handler: cardController.createCard
})

// 2. Controller (card.controller.ts)
async createCard(request, reply) {
  const cardData = request.body
  const card = await cardService.createCard(cardData)

  // Broadcast WebSocket event
  wsService.emitCardCreated(card.list_id, card)

  return reply.code(201).send(card)
}

// 3. Service (card.service.ts)
async createCard(cardData) {
  // Business logic & validation
  const order = await this.getNextCardOrder(cardData.list_id)

  const card = await cardRepository.create({
    ...cardData,
    order
  })

  // Log activity
  await activityService.logActivity({
    card_id: card.id,
    action_type: 'created',
    user_id: cardData.user_id
  })

  return card
}

// 4. Repository (card.repository.ts)
async create(cardData) {
  const [card] = await db('cards')
    .insert(cardData)
    .returning('*')

  return card
}
```

### 3. Plugin Architecture

Fastify's plugin system is leveraged for modularity:

```typescript
// bootstrap.ts
export async function bootstrap() {
  const server = fastify({
    logger: true,
    ajv: {
      customOptions: { removeAdditional: 'all' }
    }
  })

  // Core plugins
  await server.register(knexPlugin)
  await server.register(cors)
  await server.register(session)
  await server.register(oauth2)
  await server.register(multipart)
  await server.register(swagger)
  await server.register(swaggerUI)
  await server.register(metrics)

  // WebSocket
  const wsService = new WebSocketService(server)
  server.decorate('wsService', wsService)
  server.decorate('io', wsService.io)

  // Feature modules
  await server.register(oauthRoutes, { prefix: '/api/v1' })
  await server.register(boardRoutes, { prefix: '/api/v1' })
  await server.register(listRoutes, { prefix: '/api/v1' })
  await server.register(cardRoutes, { prefix: '/api/v1' })
  // ... 17 more modules

  return server
}
```

### 4. Schema Validation with TypeBox

```typescript
import { Type } from '@sinclair/typebox'

// Define schemas
export const CreateCardSchema = Type.Object({
  list_id: Type.String({ format: 'uuid' }),
  title: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.Optional(Type.String()),
  priority: Type.Optional(Type.Union([
    Type.Literal('low'),
    Type.Literal('medium'),
    Type.Literal('high'),
    Type.Literal('critical')
  ])),
  due_date: Type.Optional(Type.String({ format: 'date-time' }))
})

// Automatic validation & TypeScript inference
type CreateCardType = Static<typeof CreateCardSchema>
```

**Benefits:**
- Runtime validation
- TypeScript type inference
- JSON Schema generation for OpenAPI
- Error messages

### 5. Database Transaction Pattern

```typescript
// Service layer handles transactions
async moveCard(cardId: string, newListId: string) {
  return await db.transaction(async (trx) => {
    // 1. Get old position
    const card = await trx('cards')
      .where({ id: cardId })
      .first()

    // 2. Update card
    await trx('cards')
      .where({ id: cardId })
      .update({ list_id: newListId, order: 0 })

    // 3. Reorder old list
    await trx('cards')
      .where({ list_id: card.list_id })
      .where('order', '>', card.order)
      .decrement('order', 1)

    // 4. Reorder new list
    await trx('cards')
      .where({ list_id: newListId })
      .increment('order', 1)

    // 5. Log activity
    await trx('card_activities').insert({
      card_id: cardId,
      action_type: 'moved',
      action_details: JSON.stringify({ from: card.list_id, to: newListId })
    })

    return card
  })
}
```

---

## Database Schema

### Entity Relationship Overview

```
Organizations
    ↓ (1:N)
Boards
    ↓ (1:N)
Lists
    ↓ (1:N)
Cards
    ↓ (1:N) [CASCADE DELETE]
├── Card Assignees
├── Card Labels
├── Checklist Items
├── Comments (with threading)
├── Attachments
├── Activities
├── Time Logs
└── Reminders
```

### Core Tables

#### Users & Authentication
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  bio TEXT,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
```

#### Organizations
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_organization (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- 'admin' or 'member'
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, organization_id)
);

CREATE INDEX idx_user_org_user ON user_organization(user_id);
CREATE INDEX idx_user_org_org ON user_organization(organization_id);
```

#### Board Hierarchy
```sql
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_boards_org ON boards(organization_id);

CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_lists_board ON lists(board_id);
CREATE INDEX idx_lists_board_order ON lists(board_id, order);

CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo',
  priority VARCHAR(20) DEFAULT 'medium',
  due_date TIMESTAMP,
  order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cards_list ON cards(list_id);
CREATE INDEX idx_cards_sprint ON cards(sprint_id);
CREATE INDEX idx_cards_list_order ON cards(list_id, order);
CREATE INDEX idx_cards_due_date ON cards(due_date);
CREATE INDEX idx_cards_priority ON cards(priority);
CREATE INDEX idx_cards_status ON cards(status);
```

#### Card Details
```sql
CREATE TABLE card_assignees (
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (card_id, user_id)
);

CREATE INDEX idx_card_assignees_card ON card_assignees(card_id);
CREATE INDEX idx_card_assignees_user ON card_assignees(user_id);

CREATE TABLE labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) NOT NULL, -- Hex color
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(board_id, name)
);

CREATE INDEX idx_labels_board ON labels(board_id);

CREATE TABLE card_labels (
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (card_id, label_id)
);

CREATE INDEX idx_card_labels_card ON card_labels(card_id);
CREATE INDEX idx_card_labels_label ON card_labels(label_id);

CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_checklist_card ON checklist_items(card_id);
CREATE INDEX idx_checklist_card_order ON checklist_items(card_id, order);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_card ON comments(card_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);

CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER NOT NULL, -- bytes
  mime_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attachments_card ON attachments(card_id);
CREATE INDEX idx_attachments_user ON attachments(user_id);

CREATE TABLE card_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action_type VARCHAR(50) NOT NULL,
  action_details TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activities_card ON card_activities(card_id);
CREATE INDEX idx_activities_user ON card_activities(user_id);
CREATE INDEX idx_activities_type ON card_activities(action_type);
CREATE INDEX idx_activities_created ON card_activities(created_at);
```

#### Agile Features
```sql
CREATE TABLE sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  goal TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'planned', -- 'planned', 'active', 'completed', 'cancelled'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sprints_board ON sprints(board_id);
CREATE INDEX idx_sprints_board_status ON sprints(board_id, status);

CREATE TABLE time_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  duration_minutes INTEGER NOT NULL,
  description TEXT,
  logged_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT positive_duration CHECK (duration_minutes > 0)
);

CREATE INDEX idx_time_logs_card ON time_logs(card_id);
CREATE INDEX idx_time_logs_user ON time_logs(user_id);
CREATE INDEX idx_time_logs_logged_at ON time_logs(logged_at);
CREATE INDEX idx_time_logs_card_user ON time_logs(card_id, user_id);
```

#### Templates & Customization
```sql
CREATE TABLE board_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  description TEXT,
  category VARCHAR(30),
  icon VARCHAR(20),
  is_system BOOLEAN DEFAULT FALSE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  structure JSONB NOT NULL, -- Stores lists, example cards, etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_templates_category ON board_templates(category);
CREATE INDEX idx_templates_org ON board_templates(organization_id);
CREATE INDEX idx_templates_system ON board_templates(is_system);

CREATE TABLE dashboard_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  widgets JSONB DEFAULT '[]',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_layouts_user ON dashboard_layouts(user_id);
CREATE UNIQUE INDEX idx_layouts_user_default ON dashboard_layouts(user_id, is_default)
  WHERE is_default = TRUE;
```

#### Reminders
```sql
CREATE TABLE card_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  remind_at TIMESTAMP NOT NULL,
  is_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reminders_card ON card_reminders(card_id);
CREATE INDEX idx_reminders_user ON card_reminders(user_id);
CREATE INDEX idx_reminders_remind_at ON card_reminders(remind_at);
CREATE INDEX idx_reminders_card_user ON card_reminders(card_id, user_id);
```

### Database Migration Strategy

**21 Migrations** following chronological order:
1. Core tables (users, organizations, boards)
2. Hierarchy tables (lists, cards)
3. Association tables (assignees, labels)
4. Detail tables (checklists, comments, attachments)
5. Tracking tables (activities, time logs)
6. Advanced features (sprints, templates, reminders)

**Migration Commands:**
```bash
# Run all pending migrations
npm run migrate:latest

# Rollback last migration
npm run migrate:rollback

# Create new migration
npm run migrate:make migration_name
```

---

## Authentication & Security

### OAuth 2.0 Flow (GitHub)

```
┌────────────┐                                  ┌────────────┐
│   Client   │                                  │  GitHub    │
│  (Browser) │                                  │   OAuth    │
└──────┬─────┘                                  └─────┬──────┘
       │                                              │
       │  1. GET /oauth/github/callback               │
       ├─────────────────────────────────────────────>│
       │                                              │
       │  2. Redirect to GitHub                       │
       │<─────────────────────────────────────────────┤
       │                                              │
       │  3. User authorizes                          │
       ├─────────────────────────────────────────────>│
       │                                              │
┌──────▼─────┐                                  ┌─────▼──────┐
│    API     │                                  │  GitHub    │
│  Server    │  4. Exchange code for token     │   OAuth    │
│            │<─────────────────────────────────┤            │
│            │                                  │            │
│            │  5. Get user profile             │            │
│            │─────────────────────────────────>│            │
│            │<─────────────────────────────────┤            │
└──────┬─────┘                                  └────────────┘
       │
       │  6. Create/find user in DB
       ├──────────────────┐
       │                  │
       │  7. Set cookie   │
       │<─────────────────┘
       │
       │  8. Redirect to client with token
       ├─────────────────────────────────────────────>
       │
```

### Cookie Configuration

```typescript
{
  httpOnly: true,                           // Prevent XSS
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  path: '/',
  sameSite: 'strict',                       // CSRF protection
  maxAge: 30 * 24 * 60 * 60 * 1000         // 30 days
}
```

### Critical Security Issues ⚠️

#### 1. No Authorization Middleware
```typescript
// MISSING: Authorization checks before operations
async getBoard(request, reply) {
  const { id } = request.params

  // ⚠️ NO CHECK: Is user member of board's organization?
  // ⚠️ NO CHECK: Does user have access to this board?

  const board = await boardService.getBoard(id)
  return reply.send(board)
}

// SHOULD BE:
async getBoard(request, reply) {
  const { id } = request.params
  const userId = request.user.id

  // Check if user has access
  const hasAccess = await authService.canAccessBoard(userId, id)
  if (!hasAccess) {
    return reply.code(403).send({ error: 'Forbidden' })
  }

  const board = await boardService.getBoard(id)
  return reply.send(board)
}
```

#### 2. Roles Not Enforced
```typescript
// Schema has roles but they're not checked
user_organization {
  role: 'admin' | 'member'  // Defined but never validated
}

// Missing middleware like:
async requireOrgAdmin(request, reply) {
  const { organization_id } = request.params
  const userId = request.user.id

  const role = await db('user_organization')
    .where({ user_id: userId, organization_id })
    .first()

  if (role?.role !== 'admin') {
    return reply.code(403).send({ error: 'Admin access required' })
  }
}
```

#### 3. WebSocket No Authorization
```typescript
// websocket.server.ts
socket.on('board:join', async (boardId: string) => {
  // ⚠️ TODO: Add authorization check here

  // Anyone can join any board!
  const userId = socket.data.userId
  await wsService.joinBoard(socket, boardId, userId, socket.data.userEmail)
})
```

### Recommended Security Improvements

1. **Implement Authorization Middleware**
```typescript
// auth.middleware.ts
export const requireAuth = async (request, reply) => {
  if (!request.user) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }
}

export const requireOrgMember = async (request, reply) => {
  const { organization_id } = request.params
  const userId = request.user.id

  const isMember = await authService.isOrgMember(userId, organization_id)
  if (!isMember) {
    return reply.code(403).send({ error: 'Not a member of this organization' })
  }
}

export const requireBoardAccess = async (request, reply) => {
  const { board_id } = request.params
  const userId = request.user.id

  const hasAccess = await authService.canAccessBoard(userId, board_id)
  if (!hasAccess) {
    return reply.code(403).send({ error: 'No access to this board' })
  }
}
```

2. **Add Rate Limiting**
```typescript
import rateLimit from '@fastify/rate-limit'

await server.register(rateLimit, {
  max: 100,              // 100 requests
  timeWindow: '1 minute' // per minute
})
```

3. **File Upload Validation**
```typescript
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain'
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

async function validateFile(file) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new Error('File type not allowed')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large')
  }
}
```

---

## Real-time Communication

### Socket.io Architecture

```typescript
class WebSocketService {
  private io: Server
  private boardPresence: Map<boardId, Map<userId, PresenceUser>>

  constructor(fastify) {
    this.io = new Server(fastify.server, {
      cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000
    })

    this.setupMiddleware()
    this.setupEventHandlers()
  }
}
```

### Middleware Stack

```typescript
// 1. Authentication
io.use(authenticationMiddleware)
// Validates user session, attaches userId & userEmail to socket

// 2. Rate Limiting
io.use(rateLimitMiddleware)
// Limits to 100 events per minute per connection

// 3. Error Handling
io.use(errorHandlerMiddleware)
// Centralized error handling for WebSocket events
```

### Event Flow

```
Client connects
    ↓
Authentication middleware validates session
    ↓
User joins board room
    ↓
┌─────────────────────────────────────────┐
│  Room: board:{boardId}                  │
│  - user1 (socket1)                      │
│  - user2 (socket2)                      │
│  - user3 (socket3)                      │
└─────────────────────────────────────────┘
    ↓
HTTP Request: Create card
    ↓
Controller calls WebSocket service
    ↓
wsService.emitCardCreated(boardId, cardData)
    ↓
All users in room receive event
    ↓
Clients update UI in real-time
```

### Room Management

```typescript
class WebSocketService {
  async joinBoard(socket, boardId, userId, userEmail) {
    // Join Socket.io room
    await socket.join(`board:${boardId}`)

    // Track presence
    if (!this.boardPresence.has(boardId)) {
      this.boardPresence.set(boardId, new Map())
    }

    this.boardPresence.get(boardId).set(userId, {
      id: userId,
      email: userEmail,
      joinedAt: Date.now()
    })

    // Broadcast presence update
    this.io.to(`board:${boardId}`).emit('board:presence',
      Array.from(this.boardPresence.get(boardId).values())
    )
  }

  leaveBoard(socket, boardId, userId) {
    socket.leave(`board:${boardId}`)

    this.boardPresence.get(boardId)?.delete(userId)

    this.io.to(`board:${boardId}`).emit('board:presence',
      Array.from(this.boardPresence.get(boardId)?.values() || [])
    )
  }
}
```

### Broadcast Methods

```typescript
// Broadcast to all users in board except sender
emitToBoard(boardId, event, data, excludeSocketId?) {
  if (excludeSocketId) {
    this.io.to(`board:${boardId}`)
      .except(excludeSocketId)
      .emit(event, data)
  } else {
    this.io.to(`board:${boardId}`)
      .emit(event, data)
  }
}

// Specialized broadcast methods
emitCardCreated(boardId, cardData) {
  this.emitToBoard(boardId, 'card:created', cardData)
}

emitCardUpdated(boardId, cardData) {
  this.emitToBoard(boardId, 'card:updated', cardData)
}

emitCardMoved(boardId, moveData) {
  this.emitToBoard(boardId, 'card:moved', moveData)
}
```

### Scalability Limitations ⚠️

**Current Implementation:**
- Single instance only
- In-memory presence tracking
- No Redis adapter

**For Production at Scale:**
```typescript
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'

const pubClient = createClient({ url: process.env.REDIS_URL })
const subClient = pubClient.duplicate()

await pubClient.connect()
await subClient.connect()

io.adapter(createAdapter(pubClient, subClient))
```

---

## API Documentation

### Swagger/OpenAPI Integration

```typescript
// swagger.ts
export const swaggerConfig = {
  swagger: {
    info: {
      title: 'Sprinty API',
      description: 'API documentation for Sprinty Kanban application',
      version: '1.0.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: 'localhost:4000',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'OAuth', description: 'Authentication endpoints' },
      { name: 'Boards', description: 'Board management' },
      { name: 'Lists', description: 'List operations' },
      { name: 'Cards', description: 'Card operations' },
      // ... more tags
    ]
  }
}

// Swagger UI config
export const swaggerUIConfig = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  },
  staticCSP: true,
  transformStaticCSP: (header) => header
}
```

### Auto-Generated from TypeBox Schemas

```typescript
// TypeBox schema automatically becomes OpenAPI spec
export const CreateCardSchema = Type.Object({
  list_id: Type.String({ format: 'uuid' }),
  title: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.Optional(Type.String()),
  priority: Type.Optional(Type.Union([
    Type.Literal('low'),
    Type.Literal('medium'),
    Type.Literal('high'),
    Type.Literal('critical')
  ]))
})

// Generates OpenAPI spec:
{
  "type": "object",
  "properties": {
    "list_id": { "type": "string", "format": "uuid" },
    "title": { "type": "string", "minLength": 1, "maxLength": 255 },
    "description": { "type": "string" },
    "priority": {
      "enum": ["low", "medium", "high", "critical"]
    }
  },
  "required": ["list_id", "title"]
}
```

### Accessing Documentation

- **Swagger UI:** `http://localhost:4000/docs`
- **OpenAPI JSON:** `http://localhost:4000/docs/json`
- **Health Check:** `http://localhost:4000/health`
- **Metrics:** `http://localhost:4000/metrics`

---

## Configuration & Environment

### Environment Variables

```bash
# Server
NODE_ENV=development
PORT=4000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sprinty
DATABASE_CLIENT=pg

# Authentication
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
API_SESSION_SECRET=your_session_secret_here

# CORS
CORS_ORIGIN=http://localhost:3000

# Redis
REDIS_URL=redis://localhost:6379

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### Configuration Schema Validation

```typescript
// envConfig.ts
import { Type } from '@sinclair/typebox'

export const envSchema = Type.Object({
  NODE_ENV: Type.Union([
    Type.Literal('development'),
    Type.Literal('production'),
    Type.Literal('test')
  ]),
  PORT: Type.Number({ default: 4000 }),
  DATABASE_URL: Type.String(),
  GITHUB_CLIENT_ID: Type.String(),
  GITHUB_CLIENT_SECRET: Type.String(),
  API_SESSION_SECRET: Type.String(),
  CORS_ORIGIN: Type.String({ default: 'http://localhost:3000' })
})

// Fastify plugin for env validation
await server.register(fastifyEnv, {
  schema: envSchema,
  dotenv: true
})
```

---

## Infrastructure

### Docker Compose Stack

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/sprinty
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: sprinty
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3030:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    depends_on:
      - prometheus

volumes:
  postgres_data:
  redis_data:
```

### Metrics & Monitoring

**Prometheus Metrics Exposed:**
```
# HTTP Metrics
http_request_duration_seconds
http_request_total
http_request_errors_total

# Process Metrics
process_cpu_user_seconds_total
process_resident_memory_bytes
nodejs_heap_size_used_bytes

# Custom Metrics (can be added)
cards_created_total
websocket_connections_active
database_query_duration_seconds
```

**Grafana Dashboards:**
- HTTP request rates & latency
- Error rates by endpoint
- Database connection pool metrics
- WebSocket connection counts
- Memory & CPU usage

---

## Performance & Scalability

### Current Performance

**Fastify Benchmarks:**
- ~30,000 requests/sec (simple routes)
- ~10,000 requests/sec (database queries)
- Low memory footprint (~50MB idle)
- Fast startup time (~2 seconds)

### Database Optimizations

1. **Connection Pooling**
```typescript
pool: {
  min: 2,
  max: 10,
  idleTimeoutMillis: 30000
}
```

2. **Indexes on Hot Paths**
- All foreign keys indexed
- Composite indexes on frequently joined columns
- Covering indexes for common queries

3. **Query Optimization**
- Use `select()` to limit columns
- Avoid N+1 queries with joins
- Use `returning('*')` sparingly

### Caching Strategy

**Redis Integration (Ready but not fully utilized):**
```typescript
// Cache board data
await redis.set(
  `board:${boardId}`,
  JSON.stringify(board),
  'EX',
  300  // 5 minutes
)

// Cache user sessions
await redis.set(
  `session:${userId}`,
  JSON.stringify(userData),
  'EX',
  3600  // 1 hour
)
```

### Horizontal Scaling Considerations

**Current Limitations:**
- WebSocket presence stored in-memory
- No Redis adapter for Socket.io
- Session storage not distributed

**Required for Multi-Instance:**
1. Redis adapter for Socket.io
2. Shared session store (Redis)
3. Sticky sessions or socket.io-redis
4. Distributed caching
5. Load balancer (Nginx/HAProxy)

### Load Testing Recommendations

```bash
# Using artillery
artillery quick --count 10 --num 100 http://localhost:4000/api/v1/boards

# Using autocannon
autocannon -c 100 -d 30 http://localhost:4000/api/v1/boards

# WebSocket load testing
artillery run websocket-test.yml
```

---

## Conclusion

### Architecture Strengths ✅
- **Modern Stack:** Fastify + TypeScript + PostgreSQL
- **Clean Architecture:** Domain-driven module structure
- **Type Safety:** TypeBox validation throughout
- **API Documentation:** Auto-generated Swagger docs
- **Real-time Support:** Socket.io integration
- **Monitoring Ready:** Prometheus metrics
- **Database Design:** Well-normalized with proper indexes

### Critical Gaps ⚠️
- **No Authorization:** Biggest security risk
- **Limited Tests:** 28.5% module coverage
- **Broken Feature:** Reminders not registered
- **Scalability:** Single-instance limitations
- **No Rate Limiting:** Only WebSocket protected

### Recommended Priorities
1. **Immediate:** Implement authorization middleware
2. **High:** Add tests for critical paths
3. **High:** Register reminder routes
4. **Medium:** Add Redis adapter for Socket.io
5. **Medium:** Implement API rate limiting
6. **Low:** Horizontal scaling preparation

This is a solid foundation with room for security hardening and expanded testing before production deployment.
