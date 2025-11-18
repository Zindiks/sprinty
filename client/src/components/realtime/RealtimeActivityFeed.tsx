import { useEffect } from "react";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { useToast } from "@/hooks/use-toast";
import { Bell, Plus, Edit, Trash2, Move } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "card" | "list" | "board";
  action: "created" | "updated" | "deleted" | "moved";
  title: string;
  timestamp: number;
  userEmail?: string;
}

export function RealtimeActivityFeed({ boardId }: { boardId: string }) {
  const { toast } = useToast();
  const wsContext = useWebSocket();

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // Card events
    unsubscribers.push(
      wsContext.onCardCreated((event) => {
        toast({
          title: "Card created",
          description: `"${event.data.title}" was added`,
          duration: 3000,
        });
      })
    );

    unsubscribers.push(
      wsContext.onCardUpdated((event) => {
        if (event.data.title) {
          toast({
            title: "Card updated",
            description: `"${event.data.title}" was modified`,
            duration: 2000,
          });
        }
      })
    );

    unsubscribers.push(
      wsContext.onCardDeleted((_event) => {
        toast({
          title: "Card deleted",
          description: "A card was removed",
          duration: 2000,
          variant: "destructive",
        });
      })
    );

    unsubscribers.push(
      wsContext.onCardMoved((_event) => {
        // Silent update - we don't show toast for moves as they happen frequently
      })
    );

    // List events
    unsubscribers.push(
      wsContext.onListCreated((event) => {
        toast({
          title: "List created",
          description: `"${event.data.title}" was added`,
          duration: 3000,
        });
      })
    );

    unsubscribers.push(
      wsContext.onListUpdated((event) => {
        if (event.data.title) {
          toast({
            title: "List updated",
            description: `"${event.data.title}" was modified`,
            duration: 2000,
          });
        }
      })
    );

    unsubscribers.push(
      wsContext.onListDeleted((_event) => {
        toast({
          title: "List deleted",
          description: "A list was removed",
          duration: 2000,
          variant: "destructive",
        });
      })
    );

    // Board events
    unsubscribers.push(
      wsContext.onBoardUpdated((event) => {
        if (event.data.title) {
          toast({
            title: "Board updated",
            description: `Board renamed to "${event.data.title}"`,
            duration: 3000,
          });
        }
      })
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [boardId, wsContext, toast]);

  // This component manages background activity tracking and toasts
  // It doesn't render a visible UI, just triggers toasts
  return null;
}

/**
 * Activity Feed Sidebar (optional - can be toggled)
 */
export function ActivityFeedSidebar({ activities }: { activities: ActivityItem[] }) {
  if (activities.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="w-64 border-l border-gray-200 bg-gray-50 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <ActivityItem key={`${activity.id}-${activity.timestamp}`} activity={activity} />
        ))}
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: ActivityItem }) {
  const icon = getActivityIcon(activity.action);
  const color = getActivityColor(activity.action);

  return (
    <div className="p-3 hover:bg-gray-100 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`p-1.5 rounded-lg ${color.bg}`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">
            <span className="font-medium capitalize">{activity.type}</span>{" "}
            <span className="text-gray-600">{activity.action}</span>
          </p>
          {activity.title && <p className="text-sm text-gray-600 truncate">{activity.title}</p>}
          <p className="text-xs text-gray-400 mt-0.5">{getTimeAgo(activity.timestamp)}</p>
        </div>
      </div>
    </div>
  );
}

function getActivityIcon(action: string) {
  switch (action) {
    case "created":
      return <Plus className="h-4 w-4 text-green-600" />;
    case "updated":
      return <Edit className="h-4 w-4 text-blue-600" />;
    case "deleted":
      return <Trash2 className="h-4 w-4 text-red-600" />;
    case "moved":
      return <Move className="h-4 w-4 text-purple-600" />;
    default:
      return <Bell className="h-4 w-4 text-gray-600" />;
  }
}

function getActivityColor(action: string) {
  switch (action) {
    case "created":
      return { bg: "bg-green-100", text: "text-green-600" };
    case "updated":
      return { bg: "bg-blue-100", text: "text-blue-600" };
    case "deleted":
      return { bg: "bg-red-100", text: "text-red-600" };
    case "moved":
      return { bg: "bg-purple-100", text: "text-purple-600" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-600" };
  }
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

  return `${Math.floor(seconds / 86400)}d ago`;
}
