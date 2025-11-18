import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Plus } from "lucide-react";
import { useLabels } from "@/hooks/useLabels";
import { LabelCreator } from "./LabelCreator";
import { cn } from "@/lib/utils";

interface LabelManagerProps {
  cardId: string;
  boardId: string;
  open: boolean;
  onClose: () => void;
  currentLabels: string[];
}

export const LabelManager = ({
  cardId,
  boardId,
  open,
  onClose,
  currentLabels,
}: LabelManagerProps) => {
  const { boardLabels, isLoadingBoardLabels, addLabelToCard, removeLabelFromCard } = useLabels(
    boardId,
    cardId
  );
  const [showCreator, setShowCreator] = useState(false);

  const isLabelApplied = (labelId: string) => {
    return currentLabels.includes(labelId);
  };

  const handleToggleLabel = (labelId: string) => {
    if (isLabelApplied(labelId)) {
      removeLabelFromCard.mutate({ card_id: cardId, label_id: labelId });
    } else {
      addLabelToCard.mutate({ card_id: cardId, label_id: labelId });
    }
  };

  return (
    <>
      <Dialog open={open && !showCreator} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Labels</DialogTitle>
            <DialogDescription>Add or remove labels from this card</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Create New Label Button */}
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => setShowCreator(true)}
            >
              <Plus className="w-4 h-4" />
              Create new label
            </Button>

            {/* Label List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {isLoadingBoardLabels ? (
                <div className="space-y-2">
                  <div className="w-full h-10 rounded bg-muted animate-pulse" />
                  <div className="w-full h-10 rounded bg-muted animate-pulse" />
                  <div className="w-full h-10 rounded bg-muted animate-pulse" />
                </div>
              ) : boardLabels && boardLabels.length > 0 ? (
                boardLabels.map((label) => {
                  const applied = isLabelApplied(label.id);
                  return (
                    <button
                      key={label.id}
                      onClick={() => handleToggleLabel(label.id)}
                      disabled={addLabelToCard.isPending || removeLabelFromCard.isPending}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-accent cursor-pointer",
                        applied && "bg-accent"
                      )}
                    >
                      <div className="flex-1 flex items-center gap-3">
                        <div className="w-8 h-8 rounded" style={{ backgroundColor: label.color }} />
                        <span className="text-sm font-medium text-left">{label.name}</span>
                      </div>
                      {applied && <Check className="w-5 h-5 text-primary flex-shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">No labels created yet</p>
                  <Button variant="outline" size="sm" onClick={() => setShowCreator(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first label
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <LabelCreator boardId={boardId} open={showCreator} onClose={() => setShowCreator(false)} />
    </>
  );
};
