import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';
import { useChecklists } from '@/hooks/useChecklists';
import { ChecklistItem } from '../widgets/ChecklistItem';
import { AddChecklistItem } from '../widgets/AddChecklistItem';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ChecklistSectionProps {
  cardId: string;
}

export const ChecklistSection = ({ cardId }: ChecklistSectionProps) => {
  const {
    checklistItems,
    checklistProgress,
    isLoading,
    toggleItem,
    updateItem,
    deleteItem,
    reorderItems,
  } = useChecklists(cardId);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDeleteClick = (itemId: string) => {
    setItemToDelete(itemId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteItem.mutate({ id: itemToDelete, card_id: cardId });
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) return;

    // Reorder items locally
    const items = Array.from(checklistItems);
    const [removed] = items.splice(sourceIndex, 1);
    items.splice(destIndex, 0, removed);

    // Update order values
    const reorderedItems = items.map((item, index) => ({
      id: item.id,
      order: index,
    }));

    reorderItems.mutate({ card_id: cardId, items: reorderedItems });
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Checklist
            {checklistProgress.total > 0 && (
              <span className="text-xs text-muted-foreground">
                {checklistProgress.completed}/{checklistProgress.total}
              </span>
            )}
          </h3>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <div className="w-full h-2 rounded bg-muted animate-pulse" />
            <div className="w-full h-8 rounded bg-muted animate-pulse" />
            <div className="w-full h-8 rounded bg-muted animate-pulse" />
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            {checklistProgress.total > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{Math.round(checklistProgress.percentage)}% complete</span>
                  {checklistProgress.completed === checklistProgress.total && (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      ✓ All done!
                    </span>
                  )}
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${checklistProgress.percentage}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Checklist Items */}
            {checklistItems.length > 0 ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={`checklist-${cardId}`}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                      {checklistItems.map((item, index) => (
                        <ChecklistItem
                          key={item.id}
                          item={item}
                          index={index}
                          onToggle={() => toggleItem.mutate({ id: item.id, card_id: cardId })}
                          onUpdate={(title) =>
                            updateItem.mutate({
                              id: item.id,
                              card_id: cardId,
                              title,
                            })
                          }
                          onDelete={() => handleDeleteClick(item.id)}
                          isPending={
                            toggleItem.isPending || updateItem.isPending || deleteItem.isPending
                          }
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <p className="text-sm text-muted-foreground italic">No checklist items yet</p>
            )}

            {/* Add New Item */}
            <AddChecklistItem cardId={cardId} />
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete checklist item?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The checklist item will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
