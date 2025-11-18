import { PresenceUser } from "@/types/websocket.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users } from "lucide-react";

interface PresenceIndicatorProps {
  users: PresenceUser[];
  maxVisible?: number;
}

export function PresenceIndicator({ users, maxVisible = 5 }: PresenceIndicatorProps) {
  if (users.length === 0) {
    return null;
  }

  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
      {/* User Icon */}
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          {users.length} {users.length === 1 ? "user" : "users"} viewing
        </span>
      </div>

      {/* Avatar Stack */}
      <div className="flex -space-x-2">
        <TooltipProvider delayDuration={0}>
          {visibleUsers.map((user) => (
            <Tooltip key={user.id}>
              <TooltipTrigger>
                <Avatar className="h-8 w-8 border-2 border-white hover:z-10 transition-transform hover:scale-110">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={user.email} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs">
                      {getInitials(user.email)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <div className="text-xs">
                  <p className="font-semibold">{user.email}</p>
                  <p className="text-gray-400">Joined {getTimeAgo(user.joinedAt)}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}

          {/* Overflow indicator */}
          {remainingCount > 0 && (
            <Tooltip>
              <TooltipTrigger>
                <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 hover:z-10 transition-transform hover:scale-110">
                  +{remainingCount}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <div className="text-xs">
                  {users.slice(maxVisible).map((user) => (
                    <p key={user.id}>{user.email}</p>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>

      {/* Online indicator dot */}
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs text-green-600 font-medium">Live</span>
      </div>
    </div>
  );
}

/**
 * Get initials from email
 */
function getInitials(email: string): string {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return name.substring(0, 2).toUpperCase();
}

/**
 * Get relative time
 */
function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

  return `${Math.floor(seconds / 86400)}d ago`;
}
