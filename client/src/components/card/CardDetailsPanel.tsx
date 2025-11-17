import { useEffect } from "react";
import type { CardWithDetails } from "@/types/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity as ActivityIcon,
} from "lucide-react";
import { useCardDetails } from "@/hooks/useCardDetails";
import { useStore } from "@/hooks/store/useStore";
import { EditableTitle } from "./widgets/EditableTitle";
import { EditableDescription } from "./widgets/EditableDescription";
import { PrioritySelector } from "./widgets/PrioritySelector";
import { StatusSelector } from "./widgets/StatusSelector";
import { DueDatePicker } from "./widgets/DueDatePicker";
import { CardActions } from "./widgets/CardActions";
import { AssigneeSection } from "./sections/AssigneeSection";
import { LabelSection } from "./sections/LabelSection";
import { ChecklistSection } from "./sections/ChecklistSection";
import { CommentSection } from "./sections/CommentSection";
import { AttachmentSection } from "./sections/AttachmentSection";

interface CardDetailsPanelProps {
  cardId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CardDetailsPanel = ({
  cardId,
  isOpen,
  onClose,
}: CardDetailsPanelProps) => {
  const { cardDetails, isLoading, updateDetails, deleteCard } = useCardDetails(cardId || undefined);
  const { board_id } = useStore();

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handler functions
  const handleUpdateTitle = (title: string) => {
    if (!cardId) return;
    updateDetails.mutate({ id: cardId, title });
  };

  const handleUpdateDescription = (description: string) => {
    if (!cardId) return;
    updateDetails.mutate({ id: cardId, description });
  };

  const handleUpdatePriority = (priority: "low" | "medium" | "high" | "critical" | undefined) => {
    if (!cardId) return;
    updateDetails.mutate({ id: cardId, priority });
  };

  const handleUpdateStatus = (status: string) => {
    if (!cardId) return;
    updateDetails.mutate({ id: cardId, status });
  };

  const handleUpdateDueDate = (due_date: string | undefined) => {
    if (!cardId) return;
    updateDetails.mutate({ id: cardId, due_date });
  };

  const handleDeleteCard = () => {
    if (!cardId || !cardDetails) return;
    deleteCard.mutate(
      { id: cardId, list_id: cardDetails.list_id },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent size="wide" className="overflow-y-auto p-0">
        {isLoading && (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {!isLoading && cardDetails && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="p-6 pb-4">
              <div className="flex items-start justify-between pr-8">
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
            </SheetHeader>

            {/* Main Content */}
            <div className="flex-1 px-6 pb-6 space-y-6">
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
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Description</h3>
                <EditableDescription
                  value={cardDetails.description}
                  onChange={handleUpdateDescription}
                  disabled={updateDetails.isPending}
                />
              </div>

              <Separator />

              {/* Assignees Section */}
              <AssigneeSection cardId={cardDetails.id} />

              <Separator />

              {/* Labels Section */}
              <LabelSection cardId={cardDetails.id} boardId={board_id} />

              <Separator />

              {/* Checklist Section */}
              <ChecklistSection cardId={cardDetails.id} />

              <Separator />

              {/* Comments Section */}
              <CommentSection cardId={cardDetails.id} />

              <Separator />

              {/* Attachments Section */}
              <AttachmentSection cardId={cardDetails.id} />

              <Separator />

              {/* Activity Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <ActivityIcon className="w-4 h-4" />
                  Activity
                  {cardDetails.activities && cardDetails.activities.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({cardDetails.activities.length})
                    </span>
                  )}
                </h3>
                {cardDetails.activities && cardDetails.activities.length > 0 ? (
                  <div className="space-y-3">
                    {cardDetails.activities.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">
                              {activity.user.username || activity.user.email}
                            </span>{" "}
                            <span className="text-muted-foreground">
                              {activity.action_type.replace(/_/g, " ")}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No activity yet
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {!isLoading && !cardDetails && cardId && (
          <div className="p-6 text-center text-muted-foreground">
            <p>Card not found</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
