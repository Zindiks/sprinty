import { useEffect } from "react";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ReminderEvent {
  type: string;
  data: {
    reminder_id: string;
    card_id: string;
    card_title: string;
    due_date: string;
    reminder_type: string;
    board_id: string;
    list_id: string;
  };
  timestamp: string;
}

export const ReminderListener = () => {
  const { socket } = useWebSocket();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const handleReminder = (event: ReminderEvent) => {
      console.log("Received reminder event:", event);

      const { card_title, due_date, reminder_type, board_id } = event.data;

      // Format the reminder type for display
      const reminderLabel =
        reminder_type === "24h"
          ? "24 hours"
          : reminder_type === "1h"
          ? "1 hour"
          : "soon";

      // Show toast notification
      toast({
        title: (
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Reminder: {card_title}</span>
          </div>
        ) as any,
        description: (
          <div className="space-y-2">
            <p>This card is due in {reminderLabel}!</p>
            <p className="text-xs text-muted-foreground">
              Due: {new Date(due_date).toLocaleString()}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigate(`/board/${board_id}`);
              }}
              className="mt-2"
            >
              View Board
            </Button>
          </div>
        ) as any,
        duration: 10000, // 10 seconds
      });

      // Request browser notification permission if not already granted
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          new Notification(`Reminder: ${card_title}`, {
            body: `This card is due in ${reminderLabel}!`,
            icon: "/favicon.ico",
            tag: `reminder-${event.data.reminder_id}`,
          });
        } catch (error) {
          console.error("Failed to show browser notification:", error);
        }
      }
    };

    // Listen for reminder events
    socket.on("reminder", handleReminder);

    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      socket.off("reminder", handleReminder);
    };
  }, [socket, toast, navigate]);

  return null; // This is a listener component, no UI
};
