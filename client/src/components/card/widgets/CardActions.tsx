import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MoreHorizontal, Trash2, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CardActionsProps {
  cardId: string;
  onDelete: () => void;
  disabled?: boolean;
}

export const CardActions = ({ cardId, onDelete, disabled = false }: CardActionsProps) => {
  const [open, setOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = () => {
    const url = `${window.location.origin}/card/${cardId}`;
    navigator.clipboard.writeText(url);
    toast({
      description: 'Card link copied to clipboard',
      duration: 2000,
    });
    setOpen(false);
  };

  const handleDeleteClick = () => {
    setOpen(false);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" disabled={disabled} className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="end">
          <div className="space-y-1">
            <button
              onClick={handleCopyLink}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
            >
              <Link2 className="w-4 h-4" />
              Copy link
            </button>
            <div className="my-1 h-px bg-border" />
            <button
              onClick={handleDeleteClick}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-red-500 hover:bg-accent"
            >
              <Trash2 className="w-4 h-4" />
              Delete card
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete card?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the card and all its data
              including comments, attachments, and activity history.
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
