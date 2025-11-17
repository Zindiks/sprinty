# Real-Time Collaboration Implementation Plan

> **Created:** 2025-11-17
> **Status:** In Progress
> **Estimated Effort:** 4-6 weeks
> **Priority:** High

---

## Table of Contents

1. [Overview](#overview)
2. [Requirements](#requirements)
3. [Technical Architecture](#technical-architecture)
4. [Technology Stack](#technology-stack)
5. [Implementation Phases](#implementation-phases)
6. [Database Schema Changes](#database-schema-changes)
7. [API Endpoints & Events](#api-endpoints--events)
8. [Frontend Architecture](#frontend-architecture)
9. [Security Considerations](#security-considerations)
10. [Testing Strategy](#testing-strategy)
11. [Performance Considerations](#performance-considerations)
12. [Rollout Strategy](#rollout-strategy)

---

## Overview

Real-time collaboration enables multiple users to work simultaneously on the same board with live updates. Users will see changes made by others in real-time without manual page refreshes.

### Current State
- REST API with standard HTTP requests
- Client-side state management with TanStack Query and Zustand
- No real-time updates - users must refresh to see changes
- No presence indicators

### Target State
- WebSocket-based real-time communication
- Automatic propagation of changes to all connected users
- Presence indicators showing who's viewing/editing
- Optimistic UI updates with conflict resolution
- Seamless synchronization with minimal latency

---

## Requirements

### Functional Requirements

#### Must Have (Phase 1)
- ✅ Real-time card creation, updates, and deletion
- ✅ Real-time card movement between lists
- ✅ Real-time list creation, updates, and deletion
- ✅ Real-time board updates (title, description)
- ✅ WebSocket authentication using existing session
- ✅ Room-based broadcasting (board-level isolation)

#### Should Have (Phase 2)
- ✅ Presence indicators (who's viewing the board)
- ✅ Optimistic UI updates
- ✅ Conflict resolution for concurrent edits
- ✅ Connection status indicator
- ✅ Automatic reconnection on disconnect

#### Nice to Have (Phase 3)
- 🔲 Typing indicators for card/list editing
- 🔲 User cursors showing mouse positions
- 🔲 Real-time notifications for @mentions
- 🔲 Activity feed with live updates
- 🔲 Collaborative editing with operational transformation

### Non-Functional Requirements
- **Latency:** < 100ms for event propagation
- **Scalability:** Support 50+ concurrent users per board
- **Reliability:** Auto-reconnect within 5 seconds of disconnect
- **Security:** Authenticate all WebSocket connections
- **Compatibility:** Works with existing REST API

---

## Technical Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ React        │  │ Zustand      │  │ TanStack     │      │
│  │ Components   │←→│ Store        │←→│ Query        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ↑                  ↑                                 │
│         │                  │                                 │
│         │          ┌───────┴────────┐                        │
│         │          │ Socket.io      │                        │
│         │          │ Client         │                        │
│         │          └───────┬────────┘                        │
└─────────┼──────────────────┼──────────────────────────────────┘
          │                  │
          │ HTTP/REST        │ WebSocket
          │                  │
┌─────────┼──────────────────┼──────────────────────────────────┐
│         ↓                  ↓                                  │
│  ┌──────────────┐  ┌───────────────┐                         │
│  │ Fastify      │  │ Socket.io     │                         │
│  │ REST API     │  │ Server        │                         │
│  └──────┬───────┘  └───────┬───────┘                         │
│         │                  │                                  │
│         │          ┌───────┴────────┐                         │
│         │          │ WebSocket      │                         │
│         │          │ Service        │                         │
│         │          └───────┬────────┘                         │
│         │                  │                                  │
│  ┌──────┴──────────────────┴────────┐                        │
│  │     Business Logic Layer          │                        │
│  │  (Controllers, Services, Repos)   │                        │
│  └──────────────┬────────────────────┘                        │
│                 │                                             │
│         ┌───────┴────────┐                                    │
│         │   PostgreSQL   │                                    │
│         │   Database     │                                    │
│         └────────────────┘                                    │
│                                                               │
│                    Backend Server                             │
└───────────────────────────────────────────────────────────────┘
```

### Event Flow

```
User A makes change → REST API → Database Update → Success Response
                                         ↓
                                  Emit WebSocket Event
                                         ↓
                          ┌──────────────┴──────────────┐
                          │                             │
                    User A receives          User B receives
                    (optional confirmation)   (live update)
                          │                             │
                          ↓                             ↓
                    Update UI (confirm)          Update UI (new data)
```

---

## Technology Stack

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| Socket.io | WebSocket library with fallbacks | ^4.7.0 |
| @fastify/websocket | Fastify WebSocket plugin | ^10.0.0 |
| Fastify | Existing HTTP server | ^5.2.1 |
| TypeScript | Type safety | ^5.7.3 |

**Decision: Socket.io vs Native WebSocket**
- **Choice:** Socket.io
- **Rationale:**
  - Built-in reconnection logic
  - Fallback to HTTP long-polling
  - Room/namespace support out of the box
  - Better browser compatibility
  - Event-based API (cleaner than message-based)

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| socket.io-client | WebSocket client | ^4.7.0 |
| React | UI framework | ^18.3.1 |
| Zustand | State management | ^5.0.3 |
| TanStack Query | Server state cache | ^5.64.1 |

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)

#### Backend Setup
1. **Install Dependencies**
   ```bash
   cd api
   npm install socket.io @types/socket.io
   ```

2. **Create WebSocket Server Module**
   - `api/src/modules/websocket/websocket.server.ts`
   - `api/src/modules/websocket/websocket.types.ts`
   - `api/src/modules/websocket/websocket.middleware.ts`

3. **Integrate with Fastify**
   - Attach Socket.io to existing Fastify server
   - Configure CORS for WebSocket
   - Set up authentication middleware

4. **Event Types & Schemas**
   - Define event type enums
   - Create TypeBox schemas for events
   - Add type safety for event payloads

#### Frontend Setup
1. **Install Dependencies**
   ```bash
   cd client
   npm install socket.io-client
   ```

2. **Create WebSocket Context**
   - `client/src/contexts/WebSocketContext.tsx`
   - `client/src/hooks/useWebSocket.ts`
   - `client/src/services/websocket.service.ts`

3. **Connection Management**
   - Auto-connect on board view
   - Auto-disconnect on unmount
   - Reconnection logic

---

### Phase 2: Core Events (Week 3-4)

#### Board Events
- `board:updated` - Board title/description changed
- `board:deleted` - Board removed
- `board:joined` - User joined board view
- `board:left` - User left board view

#### List Events
- `list:created` - New list added
- `list:updated` - List title changed
- `list:moved` - List reordered
- `list:deleted` - List removed

#### Card Events
- `card:created` - New card added
- `card:updated` - Card title/description changed
- `card:moved` - Card moved to different list/position
- `card:deleted` - Card removed

#### Implementation
1. **Backend Event Handlers**
   - Create event emitters in controllers
   - Add room management (join/leave boards)
   - Implement broadcasting logic

2. **Frontend Event Listeners**
   - Subscribe to events on mount
   - Update Zustand store on events
   - Invalidate TanStack Query cache

---

### Phase 3: Presence & UX (Week 5)

#### Presence System
1. **Track Active Users**
   - Store connected users per board
   - Emit presence updates
   - Handle user disconnect cleanup

2. **Presence UI**
   - Avatar list of active users
   - User count badge
   - "User X is editing" indicators

#### Optimistic Updates
1. **Client-Side Prediction**
   - Immediately update UI on user action
   - Send update to server
   - Rollback on server error

2. **Conflict Resolution**
   - Last-write-wins for simple fields
   - Server timestamp as source of truth
   - Show conflict warnings if needed

---

### Phase 4: Testing & Polish (Week 6)

#### Testing
- Unit tests for event handlers
- Integration tests for WebSocket flows
- Load testing (50+ concurrent users)
- Cross-browser testing

#### Performance
- Event batching for rapid changes
- Throttle/debounce frequent events
- Memory leak prevention
- Connection pool management

#### Documentation
- API documentation for WebSocket events
- Frontend integration guide
- Troubleshooting guide

---

## Database Schema Changes

### New Table: `board_presence`

```sql
CREATE TABLE board_presence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  socket_id VARCHAR(255) NOT NULL,
  joined_at TIMESTAMP DEFAULT NOW(),
  last_seen TIMESTAMP DEFAULT NOW(),
  UNIQUE(board_id, socket_id)
);

CREATE INDEX idx_board_presence_board_id ON board_presence(board_id);
CREATE INDEX idx_board_presence_user_id ON board_presence(user_id);
```

**Purpose:** Track which users are currently viewing each board.

### Migration File
- `api/src/db/migrations/YYYYMMDDHHMMSS_create_board_presence_table.ts`

---

## API Endpoints & Events

### WebSocket Connection

```typescript
// Client connects to WebSocket
const socket = io('http://localhost:3000', {
  auth: {
    token: sessionToken // from existing OAuth session
  },
  transports: ['websocket', 'polling']
});
```

### Event Schema

```typescript
// Event envelope structure
interface WebSocketEvent<T> {
  event: string;
  boardId: string;
  userId: string;
  timestamp: number;
  data: T;
}

// Example: Card moved event
interface CardMovedPayload {
  cardId: string;
  sourceListId: string;
  destinationListId: string;
  sourceIndex: number;
  destinationIndex: number;
}

socket.emit('card:move', {
  event: 'card:move',
  boardId: 'board-123',
  userId: 'user-456',
  timestamp: Date.now(),
  data: {
    cardId: 'card-789',
    sourceListId: 'list-111',
    destinationListId: 'list-222',
    sourceIndex: 2,
    destinationIndex: 0
  }
});
```

### Full Event List

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `board:join` | Client → Server | `{ boardId }` | Join board room |
| `board:leave` | Client → Server | `{ boardId }` | Leave board room |
| `board:updated` | Server → Clients | `{ board }` | Board updated |
| `board:presence` | Server → Clients | `{ users[] }` | Active users list |
| `list:created` | Server → Clients | `{ list }` | New list created |
| `list:updated` | Server → Clients | `{ list }` | List updated |
| `list:moved` | Server → Clients | `{ listId, newIndex }` | List reordered |
| `list:deleted` | Server → Clients | `{ listId }` | List deleted |
| `card:created` | Server → Clients | `{ card }` | New card created |
| `card:updated` | Server → Clients | `{ card }` | Card updated |
| `card:moved` | Server → Clients | `{ cardMove }` | Card moved |
| `card:deleted` | Server → Clients | `{ cardId }` | Card deleted |
| `error` | Server → Client | `{ message, code }` | Error occurred |

---

## Frontend Architecture

### WebSocket Context

```typescript
// client/src/contexts/WebSocketContext.tsx
interface WebSocketContextValue {
  socket: Socket | null;
  connected: boolean;
  joinBoard: (boardId: string) => void;
  leaveBoard: (boardId: string) => void;
  presenceUsers: User[];
}

export const WebSocketProvider: React.FC<{children}> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [presenceUsers, setPresenceUsers] = useState<User[]>([]);

  // Initialize socket
  // Handle events
  // Provide context value
};
```

### Zustand Store Integration

```typescript
// client/src/hooks/store/useStore.tsx
interface Store {
  // Existing state...

  // WebSocket handlers
  handleCardCreated: (card: Card) => void;
  handleCardUpdated: (card: Card) => void;
  handleCardMoved: (moveData: CardMoveData) => void;
  handleCardDeleted: (cardId: string) => void;

  // Similar for lists and boards
}

// In WebSocket event listeners
socket.on('card:created', (event) => {
  useStore.getState().handleCardCreated(event.data);
});
```

### TanStack Query Invalidation

```typescript
// Invalidate cache on real-time events
socket.on('list:created', (event) => {
  queryClient.invalidateQueries(['lists', event.boardId]);
});

socket.on('card:updated', (event) => {
  queryClient.setQueryData(['card', event.data.cardId], event.data);
});
```

---

## Security Considerations

### Authentication
1. **WebSocket Auth Middleware**
   - Validate session token on connection
   - Reject unauthenticated connections
   - Verify user has access to requested boards

2. **Authorization**
   - Check user membership in organization
   - Verify board access permissions
   - Validate room join requests

### Data Validation
- Validate all event payloads with TypeBox schemas
- Sanitize user input
- Rate limit event emissions per user

### Security Checklist
- ✅ Authenticate WebSocket connections
- ✅ Authorize board room access
- ✅ Validate event payloads
- ✅ Rate limit events
- ✅ Encrypt WebSocket traffic (WSS)
- ✅ CORS configuration for WebSocket
- ✅ Session hijacking prevention

---

## Testing Strategy

### Unit Tests

```typescript
// Backend event handler tests
describe('WebSocket Card Events', () => {
  it('should emit card:created event when card is created', async () => {
    const mockSocket = createMockSocket();
    const card = await createCard({ listId: 'list-123' });

    expect(mockSocket.emit).toHaveBeenCalledWith('card:created', {
      event: 'card:created',
      data: expect.objectContaining({ id: card.id })
    });
  });
});

// Frontend WebSocket hook tests
describe('useWebSocket', () => {
  it('should connect on mount', () => {
    const { result } = renderHook(() => useWebSocket());
    expect(result.current.connected).toBe(true);
  });
});
```

### Integration Tests

```typescript
// Test full event flow
describe('Real-time card movement', () => {
  it('should update UI when card is moved by another user', async () => {
    // User A moves card
    await userA.moveCard(cardId, newListId);

    // User B should see update
    await waitFor(() => {
      expect(userB.getCardPosition(cardId)).toBe(newListId);
    });
  });
});
```

### Load Testing
- Simulate 50+ concurrent users on same board
- Measure event propagation latency
- Monitor memory usage and connection stability
- Test reconnection under load

---

## Performance Considerations

### Optimization Strategies

1. **Event Batching**
   - Batch rapid successive events (e.g., drag operations)
   - Flush batches every 50-100ms
   - Reduces network overhead

2. **Throttling**
   - Throttle presence updates (max 1/second)
   - Throttle typing indicators
   - Prevents event flooding

3. **Payload Minimization**
   - Send only changed fields, not full objects
   - Use delta updates where possible
   - Compress large payloads

4. **Connection Management**
   - Heartbeat/ping-pong to detect dead connections
   - Auto-cleanup stale presence entries
   - Connection pooling limits

5. **Caching**
   - Cache user presence in Redis (optional)
   - Cache board membership for quick auth checks
   - In-memory cache for active board rooms

### Performance Targets
- Event propagation: < 100ms (p95)
- Connection time: < 500ms
- Memory per connection: < 5MB
- Max concurrent connections per server: 1000+

---

## Rollout Strategy

### Phase 1: Internal Testing (Week 1-2)
- Deploy to staging environment
- Internal team testing
- Fix critical bugs

### Phase 2: Beta Testing (Week 3-4)
- Enable for select users via feature flag
- Monitor performance metrics
- Gather user feedback

### Phase 3: Gradual Rollout (Week 5-6)
- Enable for 25% of users
- Monitor error rates and latency
- Scale to 50%, then 100%

### Monitoring & Metrics
- WebSocket connection count
- Event processing latency
- Error rates per event type
- Active board rooms
- Memory/CPU usage

### Rollback Plan
- Feature flag to disable real-time features
- Fallback to polling-based updates
- Maintain backward compatibility with REST API

---

## Success Criteria

### Functional Success
- ✅ Users see changes within 100ms
- ✅ No data loss or race conditions
- ✅ Presence indicators work reliably
- ✅ Auto-reconnect works seamlessly

### Performance Success
- ✅ p95 latency < 100ms
- ✅ 99.9% uptime for WebSocket server
- ✅ Support 50+ concurrent users per board
- ✅ < 5% error rate for events

### User Success
- ✅ Positive user feedback
- ✅ Increased collaboration activity
- ✅ Reduced confusion from stale data
- ✅ Improved productivity metrics

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| WebSocket connection instability | High | Medium | Implement robust reconnection logic, fallback to polling |
| Race conditions on concurrent edits | High | High | Last-write-wins strategy, server timestamp validation |
| Scalability issues with many users | Medium | Medium | Horizontal scaling with Redis adapter for Socket.io |
| Increased server load | Medium | High | Implement event batching, rate limiting, and caching |
| Security vulnerabilities | High | Low | Thorough auth/authz, input validation, security audit |

---

## Future Enhancements

### Post-MVP Features
1. **Operational Transformation**
   - Conflict-free collaborative editing
   - Similar to Google Docs
   - Complex but powerful

2. **Event Sourcing**
   - Store all events for audit trail
   - Enable undo/redo
   - Time-travel debugging

3. **Horizontal Scaling**
   - Redis adapter for Socket.io
   - Multi-server deployment
   - Load balancing

4. **Advanced Presence**
   - User cursors
   - Typing indicators
   - Active editing highlights

5. **Offline Support**
   - Queue events while offline
   - Sync on reconnect
   - Conflict resolution

---

## References

### Documentation
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Fastify WebSocket](https://github.com/fastify/fastify-websocket)
- [Real-time Best Practices](https://socket.io/docs/v4/emitting-events/)

### Related Files
- `docs/INCOMPLETE_FEATURES_AND_ROADMAP.md` - Overall project roadmap
- `docs/PROJECT_STRUCTURE.md` - Project architecture
- `api/src/bootstrap.ts` - Server initialization

---

## Conclusion

This implementation plan provides a comprehensive roadmap for adding real-time collaboration to Sprinty. The phased approach ensures we build a solid foundation before adding advanced features.

**Key Principles:**
- Start simple, iterate quickly
- Security and performance first
- Maintain backward compatibility
- Test thoroughly before rollout

**Next Steps:**
1. Review and approve this plan
2. Create GitHub issues for each phase
3. Begin Phase 1 implementation
4. Set up monitoring infrastructure

---

*Document Version: 1.0*
*Last Updated: 2025-11-17*
*Author: Claude AI*
