## Features

> **Last Updated:** 2025-11-17
> **Implementation Status:** See [Roadmap](INCOMPLETE_FEATURES_AND_ROADMAP.md) for detailed status

Sprinty is a modern task management application with a comprehensive feature set designed for both individual productivity and team collaboration. Below is a categorized list of implemented and planned features.

---

### ✅ **Core Features** (Implemented)

#### Board Management
- **Create Boards**: Create multiple boards to organize different projects
- **Board Details**: Each board has a title and optional description
- **Board Organization**: Boards are organized by user or organization
- **Update Boards**: Edit board title and description in real-time
- **Delete Boards**: Remove boards with cascade deletion of lists and cards
- **Board Navigation**: Intuitive navigation between boards

#### List Management
- **Create Lists**: Add multiple lists within each board
- **List Reordering**: Drag and drop lists to reorder them
- **Update Lists**: Edit list titles
- **Delete Lists**: Remove lists with cascade deletion of cards
- **Position Management**: Maintain list order with position tracking

#### Card Management
- **Create Cards**: Add cards to any list
- **Card Details**: Each card includes:
  - Title
  - Description (rich text)
  - Status (TODO, IN_PROGRESS, DONE)
  - Created and updated timestamps
  - Position within list
- **Drag-and-Drop**: Seamlessly move cards:
  - Between lists
  - Within the same list to reorder
  - Optimistic UI updates for instant feedback
- **Update Cards**: Edit card title, description, status
- **Delete Cards**: Remove cards from lists

---

### ✅ **Authentication & User Management** (Implemented)

#### OAuth2 Authentication
- **GitHub OAuth**: Secure login via GitHub account
- **Session Management**: Persistent user sessions
- **User Context**: Global user state management
- **Logout**: Secure session termination

#### User Profiles
- **View Profile**: Display user information
  - Username
  - Email
  - Bio
  - Date of birth
  - Avatar URL
- **Edit Profile**: Update profile information with validation
- **Username Uniqueness**: Prevent duplicate usernames
- **Email Uniqueness**: Prevent duplicate emails
- **Profile Validation**: Server-side and client-side validation
- **Avatar Support**: URL-based avatar images (S3 upload planned)

---

### ✅ **Organization Management** (Implemented)

- **Create Organizations**: Set up team workspaces
- **Organization Boards**: Boards can belong to organizations
- **User-Organization Membership**: Join and manage organizations
- **Role System**: Database schema supports roles (ADMIN, MEMBER, GUEST)
  - *Note: Role-based access control UI and authorization middleware pending*

---

### ✅ **Advanced Card Features** (Infrastructure Implemented)

The following card features have backend APIs and database schemas in place:

#### Assignees
- **Assign Users**: Assign multiple users to cards
- **Card Assignees API**: Full CRUD operations for assignees
- **View Assignees**: See who's responsible for each task

#### Labels/Tags
- **Create Labels**: Define custom labels with names and colors
- **Assign Labels**: Tag cards with multiple labels
- **Label Management**: Full CRUD operations for labels
- **Filter by Labels**: (UI pending)

#### Checklists
- **Add Checklist Items**: Create sub-tasks within cards
- **Check Off Items**: Mark checklist items as complete
- **Progress Tracking**: View completion progress (e.g., 3/5 items)
- **Checklist Management**: Full CRUD operations

#### Attachments
- **File Attachments**: Attach files to cards
- **Attachment Metadata**: Store filename, file type, URL
- **Attachment Management**: Full CRUD operations
- **File Upload**: S3 integration for file storage (planned)

#### Comments
- **Add Comments**: Discuss cards with team members
- **Comment Thread**: View all comments on a card
- **Comment Management**: Full CRUD operations
- **@Mentions**: Mention users in comments (planned)

#### Activity History
- **Activity Log**: Track all changes to cards
- **Activity Types**: Created, updated, moved, assigned, etc.
- **Activity Feed**: View timeline of card activities
- **User Attribution**: See who performed each action

---

### ✅ **Real-Time Collaboration** (Partially Implemented)

Sprinty uses Socket.io for real-time updates:

#### Real-Time Events (Implemented)
- **Live Card Updates**: See card changes instantly
- **Live List Updates**: Real-time list creation, updates, and deletion
- **Live Board Updates**: Board title and description changes
- **Presence Indicators**: See who's viewing the board
- **Connection Status**: Visual indicator for WebSocket connection
- **Auto-Reconnection**: Automatic reconnection on disconnect

#### In Progress
- **Optimistic UI Updates**: Client-side prediction with rollback
- **Conflict Resolution**: Handle concurrent edits gracefully
- **Activity Feed**: Real-time activity notifications

---

### 🚧 **Advanced Features** (Modules Exist, Partial Implementation)

The following features have backend modules but require UI integration and/or completion:

#### Search & Analytics
- **Global Search**: Search across boards, lists, and cards (API exists)
- **Analytics Dashboard**: Board statistics and insights (API exists)
- **Reports**: Generate reports on productivity (API exists)

#### Time Tracking
- **Track Time**: Log time spent on cards (API exists)
- **Time Reports**: View time tracking data (API exists)

#### Sprint Management
- **Create Sprints**: Define sprint cycles (API exists)
- **Sprint Planning**: Assign cards to sprints (API exists)
- **Burndown Charts**: Visualize sprint progress (planned)

---

### 📋 **Planned Features** (See Roadmap)

#### Notifications System
- In-app notifications
- Email notifications
- Notification preferences
- Due date reminders
- @Mention notifications

#### Dashboard
- Personal dashboard with assigned tasks
- Board statistics overview
- Recent activity feed
- Quick access to boards

#### Templates & Automation
- Board templates (Kanban, Scrum, etc.)
- List templates
- Automation rules
- Recurring tasks

#### Mobile & PWA
- Mobile-responsive design improvements
- Progressive Web App (PWA) support
- Offline mode
- Install as mobile app
- Push notifications

#### Advanced Features
- Due dates and calendar view
- Priority levels
- Custom fields
- Advanced filtering
- Export/import functionality
- Third-party integrations

---

### 🔒 **Security & Infrastructure**

#### Current Security Features
- **OAuth2 Authentication**: Secure GitHub authentication
- **Session Management**: Secure session tokens
- **WebSocket Authentication**: Session-based WebSocket auth
- **Input Validation**: TypeBox schema validation
- **CORS Configuration**: Proper cross-origin settings

#### Planned Security Enhancements
- Rate limiting on API endpoints
- CSRF protection
- Content Security Policy headers
- Two-factor authentication (2FA)
- API key authentication for integrations
- Comprehensive audit logging

#### Infrastructure
- **Database**: PostgreSQL with Knex migrations
- **Caching**: Redis (Docker container available)
- **Monitoring**: Prometheus & Grafana integration
- **API Documentation**: Swagger/OpenAPI at `/docs`
- **CI/CD**: GitHub Actions for testing and security scanning
- **Containerization**: Docker Compose for local development

---

### 🎨 **User Experience Features**

- **Modern UI**: Built with shadcn/ui and Tailwind CSS
- **Responsive Design**: Works on desktop and tablet
- **Dark Mode**: (Planned)
- **Keyboard Shortcuts**: (Planned)
- **Command Palette**: (Planned - cmdk integration ready)
- **Toast Notifications**: Success/error feedback
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Accessibility**: Built with Radix UI primitives

---

### 📊 **Developer Features**

- **TypeScript**: Full type safety across frontend and backend
- **Hot Module Replacement**: Fast development with Vite
- **API Documentation**: Interactive Swagger UI
- **Database Migrations**: Version-controlled schema changes
- **Seed Data**: Sample data for development
- **ESLint & Prettier**: Code quality enforcement
- **Testing**: Jest for backend (frontend tests planned)

---

## Feature Comparison

| Feature | Status | Backend API | Frontend UI | Real-Time | Notes |
|---------|--------|-------------|-------------|-----------|-------|
| Boards | ✅ Complete | ✅ | ✅ | ✅ | Full CRUD with real-time updates |
| Lists | ✅ Complete | ✅ | ✅ | ✅ | Full CRUD with drag-and-drop |
| Cards | ✅ Complete | ✅ | ✅ | ✅ | Full CRUD with drag-and-drop |
| User Profiles | ✅ Complete | ✅ | ✅ | ❌ | Recently completed (2025-11-17) |
| Organizations | 🚧 Partial | ✅ | ⚠️ | ❌ | CRUD exists, RBAC UI pending |
| Assignees | 🚧 Partial | ✅ | ⚠️ | ❌ | API complete, UI integration needed |
| Labels | 🚧 Partial | ✅ | ⚠️ | ❌ | API complete, UI integration needed |
| Checklists | 🚧 Partial | ✅ | ⚠️ | ❌ | API complete, UI integration needed |
| Comments | 🚧 Partial | ✅ | ⚠️ | ❌ | API complete, UI integration needed |
| Attachments | 🚧 Partial | ✅ | ⚠️ | ❌ | API complete, S3 upload needed |
| Activities | 🚧 Partial | ✅ | ⚠️ | ⚠️ | API complete, UI integration needed |
| Search | 🚧 Partial | ✅ | ❌ | ❌ | API exists, UI not implemented |
| Analytics | 🚧 Partial | ✅ | ❌ | ❌ | API exists, UI not implemented |
| Time Tracking | 🚧 Partial | ✅ | ❌ | ❌ | API exists, UI not implemented |
| Sprints | 🚧 Partial | ✅ | ❌ | ❌ | API exists, UI not implemented |
| Reports | 🚧 Partial | ✅ | ❌ | ❌ | API exists, UI not implemented |
| Notifications | ❌ Planned | ❌ | ❌ | ❌ | Not yet started |
| Dashboard | ❌ Planned | ❌ | ⚠️ | ❌ | Basic UI exists, features pending |
| Templates | ❌ Planned | ❌ | ❌ | ❌ | Not yet started |
| Mobile/PWA | ❌ Planned | N/A | ❌ | N/A | Responsive design needs work |

**Legend:**
- ✅ Complete - Fully implemented and functional
- 🚧 Partial - Implemented but incomplete
- ⚠️ Minimal - Basic implementation exists
- ❌ Planned - Not yet implemented
- N/A - Not applicable

---

## Quick Start

To explore Sprinty's features:

1. **Set up the project**: See [Installation Guide](INSTALLATION.md)
2. **Run locally**: Start both API and client servers
3. **Log in**: Use GitHub OAuth to authenticate
4. **Create a board**: Start organizing your tasks
5. **Add lists and cards**: Build your workflow
6. **Drag and drop**: Move cards between lists
7. **Invite team members**: Share boards with your organization (coming soon)

For a detailed development roadmap and feature priorities, see [INCOMPLETE_FEATURES_AND_ROADMAP.md](INCOMPLETE_FEATURES_AND_ROADMAP.md).

---

*Last updated: 2025-11-17*
