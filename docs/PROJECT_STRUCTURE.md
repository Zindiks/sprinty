## Project Structure

> **Last Updated:** 2025-11-17

### Overview

Sprinty is a full-stack application with a modular architecture. The project is organized into two main directories: **api** (backend) and **client** (frontend), with shared documentation in the **docs** directory.

```
sprinty/
├── api/                          # Backend Fastify application
├── client/                       # Frontend React application
├── docs/                         # Project documentation
├── .github/                      # GitHub Actions workflows
├── README.md                     # Main project documentation
└── .gitignore                    # Git exclusions
```

---

### Backend (api/)

The backend is built with **Fastify** and follows a modular architecture pattern. Each feature is organized into its own module with clear separation of concerns.

```
api/
├── src/
│   ├── app.ts                     # Application entry point
│   ├── bootstrap.ts               # Server initialization & plugin registration
│   ├── swagger.ts                 # Swagger/OpenAPI documentation
│   ├── configs/
│   │   ├── config.ts              # Environment & Fastify configuration
│   │   └── envConfig.ts           # Environment variable parsing
│   ├── db/
│   │   ├── knexFile.ts            # Knex configuration
│   │   ├── knexInstance.ts        # Knex instance creation
│   │   ├── knexPlugin.ts          # Fastify-Knex plugin
│   │   ├── migrations/            # Database migrations (21 files)
│   │   ├── schemas/               # Database schema definitions (15 files)
│   │   └── seeds/                 # Database seed data
│   ├── modules/                   # Feature modules (18 modules)
│   │   ├── <feature>/
│   │   │   ├── <feature>.controller.ts    # HTTP request handlers
│   │   │   ├── <feature>.service.ts       # Business logic
│   │   │   ├── <feature>.repository.ts    # Data access layer
│   │   │   ├── <feature>.route.ts         # Route definitions
│   │   │   └── <feature>.schema.ts        # TypeBox validation schemas
│   │   ├── activities/            # Activity history/logging
│   │   ├── analytics/             # Analytics & reporting
│   │   ├── assignees/             # Card assignees management
│   │   ├── attachments/           # File attachments
│   │   ├── boards/                # Board CRUD operations
│   │   ├── cards/                 # Card management
│   │   ├── checklists/            # Checklist items
│   │   ├── comments/              # Card comments
│   │   ├── labels/                # Card labels/tags
│   │   ├── lists/                 # List management
│   │   ├── oauth/                 # GitHub OAuth integration
│   │   ├── organizations/         # Organization management
│   │   ├── profiles/              # User profiles
│   │   ├── reports/               # Report generation
│   │   ├── search/                # Global search
│   │   ├── sprints/               # Sprint management
│   │   ├── time-tracking/         # Time tracking
│   │   └── websocket/             # Real-time WebSocket server
│   └── __test__/                  # Backend tests
├── knexfile.js                    # Knex CLI configuration
├── jest.config.ts                 # Jest test configuration
├── tsconfig.json                  # TypeScript compiler options
├── package.json                   # Dependencies and scripts
├── docker-compose.yml             # Docker services (Postgres, Redis, Prometheus, Grafana)
└── README.md                      # Backend documentation
```

#### Module Architecture Pattern

Each module follows a consistent layered architecture:

- **Controller**: Handles HTTP requests and responses
- **Service**: Contains business logic and orchestration
- **Repository**: Manages data access and database queries
- **Route**: Defines API endpoints and attaches controllers
- **Schema**: TypeBox schemas for request/response validation

#### Key Technologies
- **Framework**: Fastify 5.2.1
- **Language**: TypeScript 5.7.3
- **Database**: PostgreSQL (via Knex.js 3.1.0)
- **Authentication**: GitHub OAuth2
- **Real-time**: Socket.io 4.8.1
- **Testing**: Jest 29.7.0
- **API Docs**: Swagger/OpenAPI
- **Monitoring**: Prometheus & Grafana

---

### Frontend (client/)

The frontend is built with **React** and **Vite**, using modern state management patterns and UI component libraries.

```
client/
├── src/
│   ├── main.tsx                   # React entry point
│   ├── App.tsx                    # Root component (React Query, UserProvider, WebSocket)
│   ├── index.css                  # Global styles (Tailwind)
│   ├── components/                # Reusable React components (42 files)
│   │   ├── board/                 # Board components (BoardList, BoardNavBar, etc.)
│   │   ├── card/                  # Card components (CardItem, CardDetails, etc.)
│   │   ├── dashboard/             # Dashboard components
│   │   ├── list/                  # List components (ListContainer, ListOptions, etc.)
│   │   ├── organization/          # Organization components
│   │   ├── profile/               # Profile management components
│   │   ├── realtime/              # Real-time collaboration UI
│   │   ├── search/                # Global search dialog
│   │   ├── ui/                    # shadcn/ui components (Button, Dialog, etc.)
│   │   └── user/                  # User-related components
│   ├── contexts/                  # React Context providers
│   │   ├── UserContext.tsx        # User authentication & profile context
│   │   └── WebSocketContext.tsx   # WebSocket connection context
│   ├── hooks/                     # Custom React hooks (12 hooks)
│   │   ├── store/useStore.tsx     # Zustand store hook
│   │   ├── useBoards.ts           # Boards API hook
│   │   ├── useCards.ts            # Cards API hook
│   │   ├── useLists.ts            # Lists API hook
│   │   ├── useProfile.ts          # Profile management hook
│   │   ├── useSearch.ts           # Search hook
│   │   ├── useAnalytics.ts        # Analytics hook
│   │   ├── useSprints.ts          # Sprints hook
│   │   ├── useTimeTracking.ts     # Time tracking hook
│   │   └── websocket/useBoardWebSocket.ts  # WebSocket hook
│   ├── pages/                     # Page-level components (9 pages)
│   │   ├── Home.tsx               # Landing page
│   │   ├── BoardView.tsx          # Main board view
│   │   ├── BoardLayout.tsx        # Board layout wrapper
│   │   ├── Boards.tsx             # Boards list page
│   │   ├── Dashboard.tsx          # User dashboard
│   │   ├── Organization.tsx       # Organization management
│   │   ├── ProfilePage.tsx        # User profile page
│   │   ├── User.tsx               # User page
│   │   └── Marketing.tsx          # Marketing/info page
│   ├── routes/
│   │   └── index.tsx              # Route definitions
│   ├── types/
│   │   ├── types.tsx              # Type definitions
│   │   └── websocket.types.ts     # WebSocket type definitions
│   └── lib/
│       └── utils.ts               # Utility functions
├── public/                        # Static assets
├── vite.config.ts                 # Vite configuration (with path alias @)
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.app.json              # App-specific TS config
├── tsconfig.node.json             # Node-specific TS config
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── eslint.config.js               # ESLint configuration
├── package.json                   # Dependencies and scripts
├── components.json                # shadcn/ui components config
└── README.md                      # Frontend documentation
```

#### Component Architecture

- **Pages**: Top-level route components
- **Components**: Reusable UI components organized by feature
- **Hooks**: Custom React hooks for data fetching and state management
- **Contexts**: Global state providers (User auth, WebSocket)
- **Types**: TypeScript type definitions

#### Key Technologies
- **Framework**: React 18.3.1 + Vite 6.0.11
- **Language**: TypeScript 5.6.2
- **State Management**: Zustand 5.0.3 + TanStack Query 5.64.1
- **Routing**: React Router DOM 7.0.2
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 3.4.16
- **Drag & Drop**: @hello-pangea/dnd 17.0.0
- **Icons**: Lucide React 0.468.0
- **Real-time**: Socket.io-client 4.8.1
- **HTTP Client**: Axios 1.7.9

---

### Documentation (docs/)

Comprehensive project documentation is maintained in the `docs/` directory.

```
docs/
├── FEATURES.md                              # Feature list
├── PROJECT_STRUCTURE.md                     # This file
├── INSTALLATION.md                          # Setup and running instructions
├── INCOMPLETE_FEATURES_AND_ROADMAP.md       # Detailed roadmap
├── REAL_TIME_COLLABORATION_PLAN.md          # WebSocket implementation guide
├── REALTIME_COLLABORATION_ANALYSIS.md       # Real-time needs analysis
├── CARD_FEATURES_IMPLEMENTATION_PLAN.md     # Card feature development plan
└── db_diagram_v1.png                        # Database schema diagram
```

---

### GitHub Configuration (.github/)

CI/CD workflows and GitHub-specific configuration.

```
.github/
├── workflows/
│   ├── api-tests.yml              # API testing CI/CD
│   ├── codeql.yml                 # Security scanning
│   └── stale.yml                  # Stale issue automation
└── pull_request_template.md       # PR template
```

---

### Database Schema

The database consists of 15 core tables managed through Knex migrations:

**Core Tables:**
- `users` - User accounts
- `organizations` - Organization entities
- `boards` - Project boards
- `lists` - Lists within boards
- `cards` - Individual task cards
- `profiles` - Extended user profile information

**Relationship Tables:**
- `user_organization` - User-org membership with roles (ADMIN, MEMBER, GUEST)
- `card_assignees` - Card-to-user assignments
- `card_labels` - Card-to-label associations

**Feature Tables:**
- `labels` - Label definitions
- `checklist_items` - Checklist items within cards
- `attachments` - File attachments for cards
- `comments` - Comments on cards
- `card_activities` - Activity log for cards
- `board_presence` - Real-time presence tracking

---

### API Structure

All API endpoints are prefixed with `/api/v1/` and organized by module:

- `/oauth` - GitHub authentication
- `/organizations` - Organization CRUD
- `/boards` - Board management
- `/lists` - List management
- `/cards` - Card operations
- `/assignees` - Card assignee management
- `/labels` - Label management
- `/profiles` - User profile management
- `/checklists` - Checklist items
- `/comments` - Card comments
- `/attachments` - File attachments
- `/activities` - Activity logging
- `/search` - Global search
- `/analytics` - Analytics data
- `/time-tracking` - Time tracking
- `/sprints` - Sprint management
- `/reports` - Report generation

**Health Check**: `GET /health` returns `{ status: "OK" }`

**API Documentation**: Available at `http://localhost:4000/docs` via Swagger UI

---

### State Management Strategy

The frontend uses a multi-layered state management approach:

1. **TanStack Query (React Query)** - Server state caching and synchronization
2. **Zustand** - Client-side state management
3. **React Context** - User authentication and WebSocket connections
4. **Local Component State** - UI-specific state (modals, forms, etc.)

---

### Real-Time Architecture

Real-time collaboration is implemented using Socket.io:

- **Backend**: Socket.io server attached to Fastify HTTP server
- **Frontend**: Socket.io client with auto-reconnection
- **Rooms**: Board-based room isolation
- **Events**: Card, list, and board updates + presence indicators
- **Authentication**: Session token validation for WebSocket connections

---

### Development Setup

#### Prerequisites
- Node.js v22+
- npm or yarn
- Docker & Docker Compose (optional)
- GitHub OAuth credentials

#### Running Locally

**Backend:**
```bash
cd api
npm install
npm run dev                    # Start on http://localhost:4000
```

**Frontend:**
```bash
cd client
npm install
npm run dev                    # Start on http://localhost:5173
```

**Docker (All Services):**
```bash
cd api
docker-compose up              # Starts all services
```

**Services:**
- API: http://localhost:4000
- Swagger Docs: http://localhost:4000/docs
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3030
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

### Testing

- **Backend**: Jest for unit and integration tests
- **Frontend**: Tests not yet implemented (planned)
- **E2E**: Not yet implemented (planned)
- **CI/CD**: GitHub Actions for API tests and security scanning

---

### Code Quality & Standards

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Validation**: TypeBox schemas for runtime validation
- **Modular Architecture**: Clear separation of concerns
- **REST API**: RESTful conventions with OpenAPI documentation

---

*For more detailed information, see:*
- [Installation Guide](INSTALLATION.md)
- [Features](FEATURES.md)
- [Roadmap](INCOMPLETE_FEATURES_AND_ROADMAP.md)
- [Real-Time Collaboration Plan](REAL_TIME_COLLABORATION_PLAN.md)


