# Sprinty Client

> **Last Updated:** 2025-11-17

The frontend application for Sprinty, built with React, TypeScript, and Vite.

---

## Overview

Sprinty's client is a modern React application that provides an intuitive interface for managing boards, lists, and cards with drag-and-drop functionality and real-time collaboration features.

### Tech Stack

- **React 18.3.1** - UI framework
- **TypeScript 5.6.2** - Type safety
- **Vite 6.0.11** - Build tool and dev server
- **Tailwind CSS 3.4.16** - Utility-first CSS framework
- **Zustand 5.0.3** - Client state management
- **TanStack Query 5.64.1** - Server state management and caching
- **React Router DOM 7.0.2** - Client-side routing
- **Socket.io-client 4.8.1** - Real-time WebSocket communication
- **shadcn/ui** - Accessible component library
- **@hello-pangea/dnd** - Drag and drop functionality
- **Axios** - HTTP client

---

## Getting Started

### Prerequisites

- **Node.js** v22 or higher
- **npm** or **yarn**
- Sprinty API server running on `http://localhost:4000`

### Installation

```bash
cd client
npm install
```

### Configuration

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:4000
VITE_WS_URL=http://localhost:4000
```

### Development Server

```bash
npm run dev
```

The application will start at **`http://localhost:5173`**

---

## Project Structure

```
client/
├── src/
│   ├── main.tsx                   # Application entry point
│   ├── App.tsx                    # Root component
│   ├── index.css                  # Global styles (Tailwind)
│   ├── components/                # React components
│   │   ├── board/                 # Board-related components
│   │   ├── card/                  # Card-related components
│   │   ├── list/                  # List-related components
│   │   ├── ui/                    # shadcn/ui components
│   │   └── ...                    # Other feature components
│   ├── contexts/                  # React Context providers
│   │   ├── UserContext.tsx        # User authentication context
│   │   └── WebSocketContext.tsx   # WebSocket connection context
│   ├── hooks/                     # Custom React hooks
│   │   ├── useBoards.ts           # Board data fetching
│   │   ├── useCards.ts            # Card data fetching
│   │   ├── useLists.ts            # List data fetching
│   │   └── ...                    # Other custom hooks
│   ├── pages/                     # Page components
│   │   ├── Home.tsx               # Landing page
│   │   ├── BoardView.tsx          # Main board workspace
│   │   ├── Dashboard.tsx          # User dashboard
│   │   └── ...                    # Other pages
│   ├── routes/                    # Route definitions
│   ├── types/                     # TypeScript type definitions
│   └── lib/                       # Utility functions
├── public/                        # Static assets
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

---

## Key Features

### State Management

The application uses a multi-layered state management approach:

1. **TanStack Query** - Server state (boards, lists, cards)
   - Automatic caching and refetching
   - Optimistic updates
   - Background synchronization

2. **Zustand** - Client state
   - Drag-and-drop state
   - UI state (modals, dropdowns)

3. **React Context** - Global state
   - User authentication (`UserContext`)
   - WebSocket connection (`WebSocketContext`)

4. **Local State** - Component-specific state
   - Form inputs
   - Temporary UI state

### Real-Time Updates

The client uses Socket.io for real-time collaboration:

- **Connection Management**: Auto-connect when viewing a board
- **Event Handling**: Listen for card, list, and board updates
- **Presence**: Show who's currently viewing the board
- **Auto-Reconnection**: Reconnect automatically on disconnect

```typescript
// Example: Real-time card updates
const { socket } = useWebSocket();

useEffect(() => {
  socket?.on('card:created', (card) => {
    queryClient.setQueryData(['cards', listId], (old) => [...old, card]);
  });

  return () => {
    socket?.off('card:created');
  };
}, [socket]);
```

### Drag and Drop

Card and list reordering is powered by `@hello-pangea/dnd`:

```typescript
<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="board">
    {lists.map((list) => (
      <Draggable key={list.id} draggableId={list.id}>
        <ListContainer list={list} />
      </Draggable>
    ))}
  </Droppable>
</DragDropContext>
```

---

## Custom Hooks

### Data Fetching Hooks

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

### WebSocket Hook

```typescript
// useBoardWebSocket.ts
export function useBoardWebSocket(boardId: string) {
  const { socket } = useWebSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.emit('board:join', boardId);

    socket.on('card:created', handleCardCreated);
    socket.on('card:updated', handleCardUpdated);
    socket.on('card:deleted', handleCardDeleted);

    return () => {
      socket.emit('board:leave', boardId);
      socket.off('card:created', handleCardCreated);
    };
  }, [socket, boardId]);
}
```

---

## Styling

### Tailwind CSS

The application uses Tailwind CSS for styling with a custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom color palette
      },
    },
  },
  plugins: [],
};
```

### shadcn/ui Components

Reusable UI components from shadcn/ui are located in `src/components/ui/`:

- `Button.tsx`
- `Dialog.tsx`
- `Input.tsx`
- `Card.tsx`
- And more...

These components use Radix UI primitives for accessibility and can be customized via Tailwind classes.

---

## Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality

```bash
npm run lint         # Lint code with ESLint
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
```

### Testing

```bash
npm test             # Run tests (not yet implemented)
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:4000` |
| `VITE_WS_URL` | WebSocket server URL | `http://localhost:4000` |

---

## Build and Deployment

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to AWS S3 + CloudFront

```bash
# Build the app
npm run build

# Upload to S3 (example)
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## Vite Configuration

The project uses Vite with the following configuration:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
```

### Path Alias

The `@` alias points to the `src/` directory:

```typescript
import { Button } from '@/components/ui/button';
import { useBoards } from '@/hooks/useBoards';
```

---

## Contributing

### Code Style

- Use TypeScript for all new code
- Follow the existing component structure
- Use functional components with hooks
- Write meaningful variable and function names
- Add JSDoc comments for complex functions

### Component Guidelines

1. **Presentational Components**: Focus on rendering UI
2. **Container Components**: Handle data fetching and state
3. **Custom Hooks**: Extract reusable logic
4. **TypeScript**: Define proper types for props

### Example Component Structure

```typescript
// CardItem.tsx
import { Card } from '@/types/types';

interface CardItemProps {
  card: Card;
  onUpdate: (card: Card) => void;
  onDelete: (cardId: string) => void;
}

export function CardItem({ card, onUpdate, onDelete }: CardItemProps) {
  return (
    <div className="card">
      <h3>{card.title}</h3>
      <p>{card.description}</p>
      <button onClick={() => onDelete(card.id)}>Delete</button>
    </div>
  );
}
```

---

## Troubleshooting

### Port 5173 Already in Use

```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Or change the port in vite.config.ts
```

### API Connection Error

- Ensure the backend API is running on `http://localhost:4000`
- Check that `VITE_API_URL` in `.env` is correct
- Verify CORS configuration in the backend

### WebSocket Connection Issues

- Ensure Socket.io server is running
- Check `VITE_WS_URL` in `.env`
- Verify WebSocket CORS configuration

---

## Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## License

MIT

---

*Last updated: 2025-11-17*
*For more information, see the [main project README](../README.md)*
