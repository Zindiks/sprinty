import { useEffect, useRef } from 'react';

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCardDetails } from '@/hooks/useCardDetails';
import { useStore } from '@/hooks/store/useStore';
import { EditableTitle } from './widgets/EditableTitle';
import { EditableDescription } from './widgets/EditableDescription';
import { PrioritySelector } from './widgets/PrioritySelector';
import { StatusSelector } from './widgets/StatusSelector';
import { DueDatePicker } from './widgets/DueDatePicker';
import { CardActions } from './widgets/CardActions';
import { AssigneeSection } from './sections/AssigneeSection';
import { LabelSection } from './sections/LabelSection';
import { ChecklistSection } from './sections/ChecklistSection';
import { CommentSection } from './sections/CommentSection';
import { AttachmentSection } from './sections/AttachmentSection';
import { ActivitySection } from './sections/ActivitySection';
import { KeyboardShortcutsDialog, useKeyboardShortcuts } from './widgets/KeyboardShortcutsDialog';

interface CardDetailsPanelProps {
  cardId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CardDetailsPanel = ({ cardId, isOpen, onClose }: CardDetailsPanelProps) => {
  const { cardDetails, isLoading, updateDetails, deleteCard } = useCardDetails(cardId || undefined);
  const { board_id } = useStore();
  const { showDialog, setShowDialog } = useKeyboardShortcuts();

  // Refs for keyboard navigation
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const commentSectionRef = useRef<HTMLDivElement>(null);
  const assigneeSectionRef = useRef<HTMLDivElement>(null);
  const labelSectionRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      const target = e.target as HTMLElement;
      const isEditing =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Always handle Escape
      if (e.key === 'Escape' && isOpen) {
        onClose();
        return;
      }

      // Skip other shortcuts if editing
      if (isEditing) return;

      // Card-specific shortcuts
      if (isOpen && cardDetails) {
        switch (e.key.toLowerCase()) {
          case 't':
            e.preventDefault();
            titleRef.current?.querySelector('button')?.click();
            break;
          case 'd':
            e.preventDefault();
            descriptionRef.current?.querySelector('button')?.click();
            break;
          case 'c':
            e.preventDefault();
            commentSectionRef.current?.querySelector('textarea')?.focus();
            break;
          case 'a':
            e.preventDefault();
            assigneeSectionRef.current?.querySelector('button')?.click();
            break;
          case 'l':
            e.preventDefault();
            labelSectionRef.current?.querySelector('button')?.click();
            break;
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, cardDetails]);

  // Handler functions
  const handleUpdateTitle = (title: string) => {
    if (!cardId || !cardDetails) return;
    updateDetails.mutate({ id: cardId, list_id: cardDetails.list_id, title });
  };

  const handleUpdateDescription = (description: string) => {
    if (!cardId || !cardDetails) return;
    updateDetails.mutate({ id: cardId, list_id: cardDetails.list_id, description });
  };

  const handleUpdatePriority = (priority: 'low' | 'medium' | 'high' | 'critical' | undefined) => {
    if (!cardId || !cardDetails) return;
    updateDetails.mutate({ id: cardId, list_id: cardDetails.list_id, priority });
  };

  const handleUpdateStatus = (status: string) => {
    if (!cardId || !cardDetails) return;
    updateDetails.mutate({ id: cardId, list_id: cardDetails.list_id, status });
  };

  const handleUpdateDueDate = (due_date: string | undefined) => {
    if (!cardId || !cardDetails) return;
    updateDetails.mutate({ id: cardId, list_id: cardDetails.list_id, due_date });
  };

  const handleDeleteCard = () => {
    if (!cardId || !cardDetails) return;
    deleteCard.mutate(
      { id: cardId, list_id: cardDetails.list_id },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {isLoading && (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {!isLoading && cardDetails && (
          <div className="flex flex-col">
            {/* Header */}
            <DialogHeader className="p-6 pb-4">
              <div className="flex items-start justify-between pr-8" ref={titleRef}>
                <EditableTitle
                  value={cardDetails.title}
                  onChange={handleUpdateTitle}
                  disabled={updateDetails.isPending}
                />
                <CardActions
                  cardId={cardDetails.id}
                  onDelete={handleDeleteCard}
                  disabled={deleteCard.isPending}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                in list <span className="font-medium">List Name</span>
              </div>
            </DialogHeader>

            {/* Main Content */}
            <div className="px-6 pb-6 space-y-6">
              {/* Metadata Section */}
              <div className="flex flex-wrap gap-3">
                <PrioritySelector
                  value={cardDetails.priority}
                  onChange={handleUpdatePriority}
                  disabled={updateDetails.isPending}
                />
                <StatusSelector
                  value={cardDetails.status}
                  onChange={handleUpdateStatus}
                  disabled={updateDetails.isPending}
                />
                <DueDatePicker
                  value={cardDetails.due_date}
                  onChange={handleUpdateDueDate}
                  disabled={updateDetails.isPending}
                />
              </div>

              <Separator />

              {/* Description Section */}
              <div className="space-y-3" ref={descriptionRef}>
                <h3 className="text-sm font-semibold">Description</h3>
                <EditableDescription
                  value={cardDetails.description}
                  onChange={handleUpdateDescription}
                  disabled={updateDetails.isPending}
                />
              </div>

              <Separator />

              {/* Assignees Section */}
              <div ref={assigneeSectionRef}>
                <AssigneeSection cardId={cardDetails.id} />
              </div>

              <Separator />

              {/* Labels Section */}
              <div ref={labelSectionRef}>
                <LabelSection cardId={cardDetails.id} boardId={board_id} />
              </div>

              <Separator />

              {/* Checklist Section */}
              <ChecklistSection cardId={cardDetails.id} />

              <Separator />

              {/* Comments Section */}
              <div ref={commentSectionRef}>
                <CommentSection cardId={cardDetails.id} />
              </div>

              <Separator />

              {/* Attachments Section */}
              <AttachmentSection cardId={cardDetails.id} />

              <Separator />

              {/* Activity Section */}
              <ActivitySection cardId={cardDetails.id} />
            </div>
          </div>
        )}

        {!isLoading && !cardDetails && cardId && (
          <div className="p-6 text-center text-muted-foreground">
            <p>Card not found</p>
          </div>
        )}
      </DialogContent>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog open={showDialog} onOpenChange={setShowDialog} />
    </Dialog>
  );
};
