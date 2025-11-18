import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Search } from "lucide-react";
import { useAssignees } from "@/hooks/useAssignees";
import { useUser } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";

interface AssigneeSelectorProps {
  cardId: string;
  open: boolean;
  onClose: () => void;
  currentAssignees: string[];
}

export const AssigneeSelector = ({
  cardId,
  open,
  onClose,
  currentAssignees,
}: AssigneeSelectorProps) => {
  const { user: currentUser } = useUser();
  const { addAssignee } = useAssignees(cardId);
  const [searchQuery, setSearchQuery] = useState("");

  // For now, we'll use the current user as the only available user
  // In a real app, this would fetch organization members
  const availableUsers = currentUser ? [currentUser] : [];

  const filteredUsers = availableUsers.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.login?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });

  const getInitials = (username?: string, email?: string) => {
    if (username) {
      return username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const handleAddAssignee = (userId: string) => {
    addAssignee.mutate(
      { card_id: cardId, user_id: userId },
      {
        onSuccess: () => {
          onClose();
          setSearchQuery("");
        },
      }
    );
  };

  const isAssigned = (userId: string) => {
    return currentAssignees.includes(userId);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Assignee</DialogTitle>
          <DialogDescription>
            Search for a user to assign to this card
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* User List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No users found
              </p>
            ) : (
              filteredUsers.map((user) => {
                const assigned = isAssigned(user.id);
                return (
                  <button
                    key={user.id}
                    onClick={() => !assigned && handleAddAssignee(user.id)}
                    disabled={assigned || addAssignee.isPending}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors",
                      assigned
                        ? "bg-accent cursor-not-allowed"
                        : "hover:bg-accent cursor-pointer"
                    )}
                  >
                    <Avatar className="w-10 h-10">
                      {user.avatar_url && (
                        <AvatarImage
                          src={user.avatar_url}
                          alt={user.login || user.email}
                        />
                      )}
                      <AvatarFallback>
                        {getInitials(user.login, user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">
                        {user.login || "Unknown User"}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    {assigned && (
                      <Check className="w-5 h-5 text-primary shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <p className="text-xs text-muted-foreground text-center">
            {availableUsers.length === 1 && "Currently showing only your user account"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
