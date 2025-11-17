import { Button } from "@/components/ui/button";
import { useSelectionStore } from "@/hooks/store/useSelectionStore";
import { X } from "lucide-react";

export const SelectionIndicator = () => {
  const { getSelectedCount, clearSelection, selectionMode } =
    useSelectionStore();
  const count = getSelectedCount();

  if (!selectionMode || count === 0) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg px-4 py-3 flex items-center gap-4 z-50 border border-gray-200 animate-in slide-in-from-bottom-2 fade-in-0 duration-200">
      <span className="font-medium text-sm">
        {count} card{count > 1 ? "s" : ""} selected
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={clearSelection}
        className="h-8 px-2"
        aria-label="Clear selection"
      >
        <X className="h-4 w-4" />
        Clear
      </Button>
    </div>
  );
};
