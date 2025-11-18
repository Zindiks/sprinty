import { CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelectionStore } from "@/hooks/store/useSelectionStore";

export const SelectionModeButton = () => {
  const { selectionMode, setSelectionMode, clearSelection } = useSelectionStore();

  const handleToggle = () => {
    if (selectionMode) {
      clearSelection();
    }
    setSelectionMode(!selectionMode);
  };

  return (
    <Button
      variant={selectionMode ? "default" : "ghost"}
      size="sm"
      onClick={handleToggle}
      aria-label={selectionMode ? "Exit selection mode" : "Enter selection mode"}
      className="h-auto p-1.5"
    >
      <CheckSquare className="h-4 w-4" />
    </Button>
  );
};
