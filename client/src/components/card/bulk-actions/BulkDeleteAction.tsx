import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSelectionStore } from "@/hooks/store/useSelectionStore";
import { useBulkActions } from "@/hooks/useBulkActions";
import { Trash2 } from "lucide-react";

export const BulkDeleteAction = () => {
  const { getSelectedCards, getSelectedCount } = useSelectionStore();
  const { bulkDeleteCards } = useBulkActions();
  const count = getSelectedCount();

  const handleDelete = () => {
    const selectedCards = getSelectedCards();
    if (selectedCards.length > 0) {
      bulkDeleteCards(selectedCards);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-destructive hover:text-destructive"
          aria-label="Delete selected cards"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {count} card{count > 1 ? "s" : ""}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the selected card
            {count > 1 ? "s" : ""} and remove {count > 1 ? "them" : "it"} from the board.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
