import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useSelectionStore } from "@/hooks/store/useSelectionStore";
import { useBulkActions } from "@/hooks/useBulkActions";
import { Tag } from "lucide-react";
import { useState } from "react";

/**
 * BulkLabelAction component
 * Phase 3: UI placeholder
 * Phase 4: Will integrate with actual label data
 */
export const BulkLabelAction = () => {
  const [open, setOpen] = useState(false);
  const { getSelectedCards } = useSelectionStore();
  const { bulkAddLabels } = useBulkActions();

  // TODO Phase 4: Fetch board labels
  const mockLabels = [
    { id: "1", name: "Bug", color: "red" },
    { id: "2", name: "Feature", color: "blue" },
    { id: "3", name: "Enhancement", color: "green" },
  ];

  const handleAddLabel = (labelId: string) => {
    const selectedCards = getSelectedCards();
    if (selectedCards.length > 0) {
      bulkAddLabels(selectedCards, [labelId]);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          <Tag className="h-4 w-4 mr-2" />
          Label
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="space-y-1">
          <h4 className="font-medium text-sm px-2 py-1.5">Add label</h4>
          <div className="space-y-0.5">
            {mockLabels.map((label) => (
              <Button
                key={label.id}
                variant="ghost"
                className="w-full justify-start h-8 px-2 text-sm"
                onClick={() => handleAddLabel(label.id)}
              >
                <Badge variant="outline" className="mr-2" style={{ borderColor: label.color }}>
                  {label.name}
                </Badge>
              </Button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground px-2 py-1.5">
            Phase 4: Will load real labels
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
