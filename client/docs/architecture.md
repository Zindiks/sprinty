# Client Architecture Documentation

**Last Updated:** 2025-11-17

---

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Architecture Patterns](#architecture-patterns)
4. [Key Technologies](#key-technologies)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Real-time Features](#real-time-features)
8. [Routing](#routing)
9. [Styling System](#styling-system)
10. [Development Tools](#development-tools)

---

## Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| TypeScript | 5.6.2 | Type-safe JavaScript |
| Vite | 6.0.11 | Build tool & dev server |
| Node.js | Latest | Runtime environment |

### UI Framework & Components

| Technology | Version | Purpose |
|------------|---------|---------|
| Shadcn UI | Latest | Component library (New York style) |
| Radix UI | 14+ components | Unstyled accessible components |
| TailwindCSS | 3.4.16 | Utility-first CSS framework |
| Lucide React | 0.468.0 | Icon library |
| CVA | 0.7.1 | Component variant utilities |

### State Management

| Technology | Version | Purpose |
|------------|---------|---------|
| Zustand | 5.0.3 | Lightweight global state |
| TanStack Query | 5.64.1 | Server state management |
| React Context | Built-in | Local context state |

### Data & API

| Technology | Version | Purpose |
|------------|---------|---------|
| Axios | 1.7.9 | HTTP client |
| Socket.io Client | 4.8.1 | Real-time WebSocket |
| React Query | 5.64.1 | Data fetching & caching |

### Specialized Libraries

| Technology | Version | Purpose |
|------------|---------|---------|
| @hello-pangea/dnd | 17.0.0 | Drag & drop (React Beautiful DnD fork) |
| react-big-calendar | 1.19.4 | Calendar views |
| react-day-picker | 9.11.1 | Date picker component |
| Recharts | 3.4.1 | Data visualization |
| Luxon | 3.7.2 | Date/time manipulation |
| cmdk | 1.0.0 | Command palette |

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| ESLint | 9.15.0 | Code linting |
| TypeScript ESLint | 8.15.0 | TypeScript linting |
| Vite React SWC | 3.5.0 | Fast refresh with SWC |
| PostCSS | 8.4.49 | CSS processing |
| Autoprefixer | 10.4.20 | CSS vendor prefixes |

---

## Project Structure

```
client/
├── public/                          # Static assets
│   └── vite.svg                    # Favicon and static files
│
├── src/
│   ├── components/                  # React components (organized by feature)
│   │   ├── board/                  # Board management (7 files)
│   │   │   ├── BoardList.tsx       # Grid view of all boards
│   │   │   ├── BoardNavBar.tsx     # Board navigation header
│   │   │   ├── BoardTitleForm.tsx  # Inline title editor
│   │   │   ├── CreateBoardModal.tsx # Board creation modal
│   │   │   ├── FilterBar.tsx       # Card filtering UI
│   │   │   └── KeyboardShortcutsHelp.tsx # Shortcuts help dialog
│   │   │
│   │   ├── card/                   # Card components (13 files + subdirs)
│   │   │   ├── bulk-actions/       # Bulk operation components (6 files)
│   │   │   │   ├── BulkArchiveAction.tsx
│   │   │   │   ├── BulkAssignAction.tsx
│   │   │   │   ├── BulkDeleteAction.tsx
│   │   │   │   ├── BulkDueDateAction.tsx
│   │   │   │   ├── BulkLabelAction.tsx
│   │   │   │   └── BulkMoveAction.tsx
│   │   │   │
│   │   │   ├── sections/          # Card detail sections (6 files)
│   │   │   │   ├── ActivitySection.tsx    # Activity history
│   │   │   │   ├── AssigneeSection.tsx    # User assignment
│   │   │   │   ├── AttachmentSection.tsx  # File attachments
│   │   │   │   ├── ChecklistSection.tsx   # Checklist items
│   │   │   │   ├── CommentSection.tsx     # Comments & replies
│   │   │   │   └── LabelSection.tsx       # Label management
│   │   │   │
│   │   │   ├── widgets/           # Card widgets (18 files)
│   │   │   │   # Various card-related UI widgets
│   │   │   │
│   │   │   ├── BulkActionsToolbar.tsx  # Floating toolbar for bulk ops
│   │   │   ├── CardDetailsModal.tsx    # Modal view of card details
│   │   │   ├── CardDetailsPanel.tsx    # Side panel view of card details
│   │   │   ├── CardForm.tsx           # Card creation/edit form
│   │   │   ├── CardItem.tsx           # Individual card in list view
│   │   │   └── SelectionModeButton.tsx # Toggle selection mode
│   │   │
│   │   ├── dashboard/             # Dashboard & analytics (6 files + subdirs)
│   │   │   ├── customizable/      # Customizable dashboard features
│   │   │   │   ├── DashboardGrid.tsx       # Grid layout system
│   │   │   │   ├── WidgetGallery.tsx       # Widget selection modal
│   │   │   │   ├── WidgetWrapper.tsx       # Widget container
│   │   │   │   └── layoutTemplates.ts      # Predefined layouts
│   │   │   │
│   │   │   └── widgets/           # Analytics widgets (6 files)
│   │   │       ├── BoardsOverviewWidget.tsx      # Board statistics
│   │   │       ├── BurndownChart.tsx             # Sprint burndown
│   │   │       ├── MonthlyCompletionWidget.tsx   # Monthly metrics
│   │   │       ├── ProductivityTrendChart.tsx    # Productivity trends
│   │   │       ├── VelocityChart.tsx             # Sprint velocity
│   │   │       └── WeeklyCompletionWidget.tsx    # Weekly metrics
│   │   │
│   │   ├── list/                  # List management (6 files)
│   │   │   # List CRUD operations and UI
│   │   │
│   │   ├── organization/          # Organization components (2 files)
│   │   │   # Multi-org management UI
│   │   │
│   │   ├── profile/               # User profile (1 file)
│   │   │   └── ProfileCard.tsx    # User profile display
│   │   │
│   │   ├── realtime/              # Real-time features (4 files)
│   │   │   ├── ConnectionStatusBanner.tsx  # WebSocket status
│   │   │   ├── PresenceIndicator.tsx       # User presence
│   │   │   ├── RealtimeActivityFeed.tsx    # Live activity stream
│   │   │   └── ReminderListener.tsx        # Reminder notifications
│   │   │
│   │   ├── search/                # Search functionality (4 files)
│   │   │   ├── CommandPalette.tsx          # Cmd+K command palette
│   │   │   ├── EnhancedSearchDialog.tsx    # Advanced search UI
│   │   │   ├── GlobalSearch.tsx            # Global search component
│   │   │   └── GlobalSearchDialog.tsx      # Search modal
│   │   │
│   │   ├── templates/             # Board templates (3 files)
│   │   │   ├── SaveAsTemplateDialog.tsx    # Save board as template
│   │   │   ├── TemplateCard.tsx            # Template preview card
│   │   │   └── TemplateGalleryModal.tsx    # Template selection modal
│   │   │
│   │   ├── ui/                    # Shadcn UI components (24 files)
│   │   │   ├── alert-dialog.tsx   # Confirmation dialogs
│   │   │   ├── avatar.tsx         # User avatar component
│   │   │   ├── badge.tsx          # Badge component
│   │   │   ├── button.tsx         # Button variants
│   │   │   ├── calendar.tsx       # Calendar picker
│   │   │   ├── card.tsx           # Card container
│   │   │   ├── checkbox.tsx       # Checkbox input
│   │   │   ├── command.tsx        # Command menu
│   │   │   ├── dialog.tsx         # Modal dialogs
│   │   │   ├── dropdown-menu.tsx  # Dropdown menus
│   │   │   ├── input.tsx          # Text input
│   │   │   ├── label.tsx          # Form label
│   │   │   ├── popover.tsx        # Popover component
│   │   │   ├── progress.tsx       # Progress bar
│   │   │   ├── select.tsx         # Select dropdown
│   │   │   ├── separator.tsx      # Visual separator
│   │   │   ├── skeleton.tsx       # Loading skeleton
│   │   │   ├── tabs.tsx           # Tab navigation
│   │   │   ├── textarea.tsx       # Multi-line input
│   │   │   ├── toast.tsx          # Toast notifications
│   │   │   ├── toaster.tsx        # Toast container
│   │   │   └── tooltip.tsx        # Tooltip component
│   │   │
│   │   └── user/                  # User components (1 file)
│   │       └── UserMenu.tsx       # User dropdown menu
│   │
│   ├── contexts/                  # React Context providers (3 files)
│   │   ├── SearchContext.tsx      # Global search state
│   │   ├── UserContext.tsx        # User authentication & data
│   │   └── WebSocketContext.tsx   # WebSocket connection management
│   │
│   ├── hooks/                     # Custom React hooks (26 files)
│   │   ├── store/                # Zustand stores (4 files)
│   │   │   ├── useDashboardStore.ts    # Dashboard state
│   │   │   ├── useLayoutStore.ts       # Layout preferences
│   │   │   ├── useSelectionStore.ts    # Card selection state
│   │   │   └── useStore.tsx            # Global app store
│   │   │
│   │   ├── websocket/            # WebSocket hooks (1 file)
│   │   │   └── useBoardWebSocket.ts    # Board-level WebSocket
│   │   │
│   │   ├── useAccessibility.ts   # Accessibility utilities
│   │   ├── useActions.ts         # Action management
│   │   ├── useActivities.ts      # Activity log data
│   │   ├── useAnalytics.ts       # Analytics data fetching
│   │   ├── useAssignees.ts       # Assignee management
│   │   ├── useAttachments.ts     # File attachment handling
│   │   ├── useBoards.ts          # Board CRUD operations
│   │   ├── useBulkActions.ts     # Bulk operations logic
│   │   ├── useCardDetails.ts     # Card details data
│   │   ├── useCardFilters.ts     # Card filtering logic
│   │   ├── useCards.ts           # Card CRUD operations
│   │   ├── useChecklists.ts      # Checklist management
│   │   ├── useComments.ts        # Comment CRUD operations
│   │   ├── useDashboardLayouts.ts # Dashboard layout management
│   │   ├── useDueDateShortcuts.ts # Due date keyboard shortcuts
│   │   ├── useLabels.ts          # Label management
│   │   ├── useLists.ts           # List CRUD operations
│   │   ├── useProfile.ts         # User profile data
│   │   ├── useReminders.ts       # Reminder management
│   │   ├── useSearch.ts          # Search functionality
│   │   ├── useSelectionKeyboard.ts # Multi-select keyboard controls
│   │   ├── useSprints.ts         # Sprint management
│   │   ├── useTemplates.ts       # Template operations
│   │   └── useTimeTracking.ts    # Time tracking features
│   │
│   ├── lib/                       # Utility libraries (5 files)
│   │   ├── animations.ts          # Animation utilities
│   │   ├── calendarLocalizer.ts   # Calendar configuration
│   │   ├── dateUtils.ts           # Date manipulation helpers
│   │   ├── responsive.ts          # Responsive design utilities
│   │   └── utils.ts               # General utilities (cn, etc.)
│   │
│   ├── pages/                     # Page components (10 files)
│   │   ├── BoardLayout.tsx        # Board layout wrapper
│   │   ├── BoardView.tsx          # Individual board view (lists & cards)
│   │   ├── Boards.tsx             # All boards grid view
│   │   ├── CalendarView.tsx       # Calendar interface
│   │   ├── Dashboard.tsx          # Analytics dashboard
│   │   ├── Home.tsx               # Landing page
│   │   ├── Marketing.tsx          # Marketing/landing page
│   │   ├── Organization.tsx       # Organization management
│   │   ├── ProfilePage.tsx        # User profile page
│   │   └── User.tsx               # User authentication page
│   │
│   ├── routes/                    # Routing configuration (1 file)
│   │   └── index.tsx              # Route definitions
│   │
│   ├── styles/                    # Global styles
│   │   └── (various CSS files)
│   │
│   ├── types/                     # TypeScript type definitions (3 files)
│   │   ├── actions.ts             # Action type definitions
│   │   ├── types.tsx              # Core type definitions
│   │   └── websocket.types.ts     # WebSocket event types
│   │
│   ├── utils/                     # Utility functions (1 file)
│   │   └── filterTasks.ts         # Task filtering logic
│   │
│   ├── App.tsx                    # Root application component
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global CSS & Tailwind imports
│
├── .env.example                   # Environment variables template
├── components.json                # Shadcn UI configuration
├── eslint.config.js               # ESLint configuration
├── index.html                     # HTML entry point
├── package.json                   # Dependencies & scripts
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.js             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.app.json              # App-specific TS config
├── tsconfig.node.json             # Node-specific TS config
└── vite.config.ts                 # Vite build configuration
```

### File Statistics
- **Total TypeScript/TSX Files:** 165
- **Total Lines of Code:** ~7,572
- **Custom Hooks:** 26
- **React Components:** 70+
- **UI Components (Shadcn):** 24
- **Context Providers:** 3
- **Zustand Stores:** 4

---

## Architecture Patterns

### 1. Component Organization
```
Feature-Based Organization
├── Each feature has its own folder
├── Components are co-located with related logic
├── Shared UI components in /ui folder
└── Business logic extracted to custom hooks
```

### 2. Data Flow Pattern
```
Server → React Query (Cache) → Context/Zustand → Components
              ↓
         WebSocket Updates
              ↓
         Component Re-render
```

### 3. State Management Layers

**Layer 1: Server State (React Query)**
- API data fetching
- Caching & synchronization
- Optimistic updates
- Background refetching

**Layer 2: Global Client State (Zustand)**
- Dashboard state (`useDashboardStore`)
- Layout preferences (`useLayoutStore`)
- Card selection state (`useSelectionStore`)
- App-wide settings (`useStore`)

**Layer 3: Context State (React Context)**
- User authentication (`UserContext`)
- WebSocket connection (`WebSocketContext`)
- Search state (`SearchContext`)

**Layer 4: Local Component State (useState)**
- UI state (modals, dropdowns, form inputs)
- Temporary state (validation, loading)

### 4. Hook Pattern
```typescript
// Custom hooks encapsulate business logic
// Example: useCards.ts

export const useCards = (listId: string) => {
  // React Query for server state
  const query = useQuery(['cards', listId], fetchCards)

  // Mutations with optimistic updates
  const createMutation = useMutation(createCard, {
    onMutate: async (newCard) => {
      // Optimistic update
      await queryClient.cancelQueries(['cards', listId])
      const previous = queryClient.getQueryData(['cards', listId])
      queryClient.setQueryData(['cards', listId], old => [...old, newCard])
      return { previous }
    },
    onError: (err, newCard, context) => {
      // Rollback on error
      queryClient.setQueryData(['cards', listId], context.previous)
    }
  })

  return { cards: query.data, createCard: createMutation.mutate }
}
```

### 5. Component Composition Pattern
```
Page Components (Routes)
    ↓
Layout Components (Wrappers)
    ↓
Feature Components (Board, Card, etc.)
    ↓
UI Components (Shadcn)
```

---

## Key Technologies

### React 18.3.1
- **Concurrent Features:** Used for better performance
- **Automatic Batching:** Optimized state updates
- **Transitions:** Smooth UI updates
- **Suspense:** Loading state management

### TypeScript 5.6.2
- **Strict Mode:** Enabled for type safety
- **Type Inference:** Leveraged throughout
- **Interface Definitions:** Clear contracts between components
- **Generic Types:** Reusable type patterns

### Vite 6.0.11
- **Fast HMR:** Instant hot module replacement
- **SWC Plugin:** Fast refresh with SWC compiler
- **Build Optimization:** Tree-shaking and code splitting
- **Dev Server:** Lightning-fast development server

---

## State Management

### Zustand Stores

#### 1. Dashboard Store (`useDashboardStore`)
```typescript
interface DashboardStore {
  filters: FilterState
  selectedBoard: string | null
  dateRange: DateRange
  setFilters: (filters: FilterState) => void
  resetFilters: () => void
}
```

#### 2. Layout Store (`useLayoutStore`)
```typescript
interface LayoutStore {
  sidebarOpen: boolean
  viewMode: 'list' | 'grid' | 'calendar'
  toggleSidebar: () => void
  setViewMode: (mode: ViewMode) => void
}
```

#### 3. Selection Store (`useSelectionStore`)
```typescript
interface SelectionStore {
  selectedCards: Set<string>
  selectionMode: boolean
  toggleSelection: (cardId: string) => void
  selectAll: () => void
  clearSelection: () => void
}
```

#### 4. Global Store (`useStore`)
```typescript
interface GlobalStore {
  theme: 'light' | 'dark'
  notifications: Notification[]
  addNotification: (notification: Notification) => void
}
```

### React Query Configuration
```typescript
// Query client setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: true,
      retry: 2
    }
  }
})
```

---

## API Integration

### Base Configuration
```typescript
// API base URL
const API_BASE_URL = 'http://localhost:4000/api/v1'

// Axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Cookie-based auth
  headers: {
    'Content-Type': 'application/json'
  }
})
```

### API Endpoints
```
Authentication:
- GET  /auth/github          # GitHub OAuth
- GET  /auth/user            # Get current user
- POST /auth/logout          # Logout

Boards:
- GET    /boards             # List boards
- POST   /boards             # Create board
- GET    /boards/:id         # Get board
- PUT    /boards/:id         # Update board
- DELETE /boards/:id         # Delete board

Lists:
- GET    /lists              # List lists
- POST   /lists              # Create list
- PUT    /lists/:id          # Update list
- DELETE /lists/:id          # Delete list

Cards:
- GET    /cards              # List cards
- POST   /cards              # Create card
- GET    /cards/:id          # Get card
- PUT    /cards/:id          # Update card
- DELETE /cards/:id          # Delete card
- POST   /cards/bulk         # Bulk operations

Templates:
- GET    /templates          # List templates
- POST   /templates          # Create template
- POST   /boards/from-template # Create board from template

Analytics:
- GET    /analytics/overview # Dashboard overview
- GET    /analytics/trends   # Productivity trends
- GET    /analytics/velocity # Sprint velocity

Search:
- GET    /search             # Global search

... and many more
```

---

## Real-time Features

### WebSocket Integration

#### Socket.io Client Setup
```typescript
// WebSocket connection
const socket = io('http://localhost:4000', {
  withCredentials: true,
  transports: ['websocket', 'polling']
})

// Event handlers
socket.on('connect', () => console.log('Connected'))
socket.on('disconnect', () => console.log('Disconnected'))
socket.on('board:update', handleBoardUpdate)
socket.on('card:create', handleCardCreate)
socket.on('card:update', handleCardUpdate)
socket.on('card:delete', handleCardDelete)
```

#### Real-time Event Types
```typescript
// WebSocket events
type WebSocketEvents = {
  'board:join': (boardId: string) => void
  'board:leave': (boardId: string) => void
  'board:update': (board: Board) => void
  'card:create': (card: Card) => void
  'card:update': (card: Card) => void
  'card:delete': (cardId: string) => void
  'card:move': (payload: CardMovePayload) => void
  'user:presence': (users: User[]) => void
  'notification': (notification: Notification) => void
}
```

#### Integration with React Query
```typescript
// Automatically update cache when WebSocket events arrive
socket.on('card:update', (card) => {
  queryClient.setQueryData(['cards', card.listId], (old) =>
    old.map(c => c.id === card.id ? card : c)
  )
})
```

---

## Routing

### React Router v7 Setup
```typescript
// Route configuration (src/routes/index.tsx)
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth/user',
    element: <User />,
  },
  {
    path: '/boards',
    element: <Boards />,
  },
  {
    path: '/boards/:boardId',
    element: <BoardLayout />,
    children: [
      {
        index: true,
        element: <BoardView />,
      },
      {
        path: 'calendar',
        element: <CalendarView />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/organization',
    element: <Organization />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
])
```

### Protected Routes Pattern
```typescript
// Authentication check
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext)

  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/auth/user" />

  return children
}
```

---

## Styling System

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ... more colors
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        // Custom animations
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

### CSS Architecture
```
Global Styles (index.css)
    ↓
Tailwind Base, Components, Utilities
    ↓
Component-Specific Styles (inline with className)
    ↓
Dynamic Styles (class-variance-authority)
```

### Utility Functions
```typescript
// cn() utility for conditional classes
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage
<div className={cn(
  'base-classes',
  condition && 'conditional-class',
  variant === 'primary' && 'primary-styles'
)} />
```

---

## Development Tools

### ESLint Configuration
```javascript
// eslint.config.js
export default {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-refresh/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-hooks', 'react-refresh'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
}
```

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Build & Deployment

### Build Process
```bash
# Development
npm run dev          # Start Vite dev server on port 3000

# Production build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

### Environment Variables
```bash
# .env.example
VITE_API_BASE_URL=http://localhost:4000
VITE_WS_URL=http://localhost:4000
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

### Production Build Output
```
dist/
├── assets/
│   ├── index-[hash].js     # Main bundle
│   ├── vendor-[hash].js    # Vendor chunk
│   └── index-[hash].css    # Compiled CSS
├── index.html              # Entry HTML
└── vite.svg                # Favicon
```

---

## Performance Optimizations

### Code Splitting
- Route-based splitting with React Router
- Dynamic imports for large components
- Lazy loading for modals and dialogs

### React Query Optimizations
- Stale-while-revalidate strategy
- Optimistic updates for instant feedback
- Background refetching
- Query deduplication

### Rendering Optimizations
- `React.memo` for expensive components
- `useMemo` for expensive calculations
- `useCallback` for stable function references
- Virtualization for long lists (when needed)

### Bundle Optimization
- Tree-shaking with Vite
- Code splitting by route
- Vendor chunk separation
- Gzip compression

---

## Security Considerations

### Authentication
- Cookie-based authentication (HttpOnly)
- GitHub OAuth integration
- CSRF protection
- Secure session management

### Data Validation
- Type safety with TypeScript
- Runtime validation (when needed)
- Input sanitization
- XSS prevention (React default escaping)

### API Security
- Credentials sent with every request
- CORS configuration
- Rate limiting (backend)
- SQL injection prevention (backend)

---

## Future Improvements

### Testing Infrastructure
- Add Vitest for unit tests
- Add React Testing Library for component tests
- Add Playwright for E2E tests
- Set up MSW for API mocking
- Target 75%+ code coverage

### Performance
- Implement virtual scrolling for large lists
- Add service worker for offline support
- Optimize bundle size (currently ~200KB gzipped)
- Add image optimization

### Developer Experience
- Add Storybook for component documentation
- Add Playwright for visual regression testing
- Add conventional commits and changelogs
- Add pre-commit hooks with Husky

### Features
- Progressive Web App (PWA) support
- Offline mode
- Mobile app (React Native)
- Desktop app (Electron)

---

## Conclusion

This is a **modern, production-ready React application** built with:
- ✅ TypeScript for type safety
- ✅ React 18 with modern patterns
- ✅ Vite for blazing-fast development
- ✅ Tailwind CSS for rapid styling
- ✅ React Query for efficient data fetching
- ✅ Zustand for lightweight state management
- ✅ Socket.io for real-time features
- ✅ Comprehensive feature set (150+ features)

**Primary Gap:** Comprehensive test coverage needs to be added for production confidence.
