import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useSelectionStore } from "@/hooks/store/useSelectionStore";
import { useBulkActions } from "@/hooks/useBulkActions";
import { Calendar } from "lucide-react";
import { useState } from "react";

/**
 * BulkDueDateAction component
 * Phase 3: UI placeholder with simple date input
 * Phase 4: Can enhance with proper calendar picker
 */
export const BulkDueDateAction = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const { getSelectedCards } = useSelectionStore();
  const { bulkSetDueDate } = useBulkActions();

  const handleSetDueDate = () => {
    const selectedCards = getSelectedCards();
    if (selectedCards.length > 0 && date) {
      bulkSetDueDate(selectedCards, date);
      setOpen(false);
      setDate("");
    }
  };

  const handleClearDueDate = () => {
    const selectedCards = getSelectedCards();
    if (selectedCards.length > 0) {
      bulkSetDueDate(selectedCards, null);
      setOpen(false);
      setDate("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          <Calendar className="h-4 w-4 mr-2" />
          Due Date
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Set due date</h4>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSetDueDate}
              disabled={!date}
              className="flex-1"
              size="sm"
            >
              Set Date
            </Button>
            <Button
              onClick={handleClearDueDate}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              Clear
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Phase 4: Can add calendar picker
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
