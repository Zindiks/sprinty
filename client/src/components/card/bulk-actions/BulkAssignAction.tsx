import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSelectionStore } from "@/hooks/store/useSelectionStore";
import { useBulkActions } from "@/hooks/useBulkActions";
import { Users } from "lucide-react";
import { useState } from "react";

/**
 * BulkAssignAction component
 * Phase 3: UI placeholder
 * Phase 4: Will integrate with actual user/member data
 */
export const BulkAssignAction = () => {
  const [open, setOpen] = useState(false);
  const { getSelectedCards } = useSelectionStore();
  const { bulkAssignUsers } = useBulkActions();

  // TODO Phase 4: Fetch organization members
  const mockUsers = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Bob Johnson" },
  ];

  const handleAssign = (userId: string) => {
    const selectedCards = getSelectedCards();
    if (selectedCards.length > 0) {
      bulkAssignUsers(selectedCards, [userId]);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          <Users className="h-4 w-4 mr-2" />
          Assign
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="space-y-1">
          <h4 className="font-medium text-sm px-2 py-1.5">Assign to</h4>
          <div className="space-y-0.5">
            {mockUsers.map((user) => (
              <Button
                key={user.id}
                variant="ghost"
                className="w-full justify-start h-8 px-2 text-sm"
                onClick={() => handleAssign(user.id)}
              >
                {user.name}
              </Button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground px-2 py-1.5">
            Phase 4: Will load real users
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
