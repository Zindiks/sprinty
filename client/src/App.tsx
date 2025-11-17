import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes";
import { Toaster } from "./components/ui/toaster";
import { UserProvider } from "./contexts/UserContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { useUser } from "./contexts/UserContext";

const queryClient = new QueryClient();

/**
 * WebSocket Integration Component
 * Wraps WebSocketProvider with user credentials from UserContext
 */
function WebSocketIntegration({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  // Only initialize WebSocket if user is authenticated
  if (!user) {
    return <>{children}</>;
  }

  return (
    <WebSocketProvider
      serverUrl="http://localhost:4000"
      userId={user.id}
      userEmail={user.email}
    >
      {children}
    </WebSocketProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider apiBaseUrl="http://localhost:4000">
        <WebSocketIntegration>
          <AppRoutes />
          <Toaster />
        </WebSocketIntegration>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
