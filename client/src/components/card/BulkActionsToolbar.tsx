import { useSelectionStore } from "@/hooks/store/useSelectionStore";
import { Separator } from "@/components/ui/separator";
import { BulkMoveAction } from "./bulk-actions/BulkMoveAction";
import { BulkAssignAction } from "./bulk-actions/BulkAssignAction";
import { BulkLabelAction } from "./bulk-actions/BulkLabelAction";
import { BulkDueDateAction } from "./bulk-actions/BulkDueDateAction";
import { BulkArchiveAction } from "./bulk-actions/BulkArchiveAction";
import { BulkDeleteAction } from "./bulk-actions/BulkDeleteAction";
import { useBulkActions } from "@/hooks/useBulkActions";
import { Loader2 } from "lucide-react";

/**
 * BulkActionsToolbar
 * Floating toolbar that appears when cards are selected
 * Contains all bulk operation actions
 */
export const BulkActionsToolbar = () => {
  const { getSelectedCount, selectionMode } = useSelectionStore();
  const { isLoading } = useBulkActions();
  const count = getSelectedCount();

  // Only show when in selection mode and cards are selected
  if (!selectionMode || count === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-lg px-3 py-2 flex items-center gap-2 z-50 border border-gray-200 animate-in slide-in-from-bottom-2 fade-in-0 duration-200">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      )}

      {/* Selection count */}
      <span className="text-sm font-medium px-2" role="status" aria-live="polite">
        {count} selected
      </span>

      <Separator orientation="vertical" className="h-6" />

      {/* Bulk actions */}
      <div className="flex items-center gap-1" role="toolbar" aria-label="Bulk actions">
        <BulkMoveAction />
        <BulkAssignAction />
        <BulkLabelAction />
        <BulkDueDateAction />

        <Separator orientation="vertical" className="h-6 mx-1" />

        <BulkArchiveAction />
        <BulkDeleteAction />
      </div>
    </div>
  );
};
