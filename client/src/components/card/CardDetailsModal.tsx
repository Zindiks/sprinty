import { useState } from "react";
import type {
  CardWithDetails,
  ChecklistItem,
  Comment,
  Attachment,
  Label,
  Assignee,
  Activity,
  ActivityActionType,
} from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";
import { useCards } from "@/hooks/useCards";
import {
  Calendar,
  Flag,
  Users,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Clock,
  Activity as ActivityIcon,
} from "lucide-react";

interface CardDetailsModalProps {
  card: CardWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CardDetailsModal = ({
  card,
  isOpen,
  onClose,
}: CardDetailsModalProps) => {
  const { updateCardDetails } = useCards();

  if (!card) return null;

  const handleDueDateChange = (newDueDate: string | null) => {
    updateCardDetails.mutate({
      id: card.id,
      list_id: card.list_id,
      due_date: newDueDate,
    });
  };

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
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{card.title}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            {card.priority && (
              <Badge variant={getPriorityColor(card.priority)}>
                <Flag className="w-3 h-3 mr-1" />
                {card.priority}
              </Badge>
            )}
            {card.status && (
              <Badge variant="outline">{card.status}</Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          {card.description && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Description</h3>
              <DialogDescription className="text-base">
                {card.description}
              </DialogDescription>
            </div>
          )}

          {/* Due Date Section */}
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Due Date
            </h3>
            <DatePicker
              date={card.due_date}
              onDateChange={handleDueDateChange}
              placeholder="Set due date"
            />
          </div>

          {/* Metadata Row */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Created {formatDate(card.created_at)}</span>
            </div>
          </div>

          <Separator />

          {/* Assignees */}
          {card.assignees && card.assignees.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Assignees ({card.assignees.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {card.assignees.map((assignee: Assignee) => (
                  <Badge key={assignee.id} variant="secondary">
                    {assignee.user.username || assignee.user.email}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Labels */}
          {card.labels && card.labels.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Labels</h3>
              <div className="flex flex-wrap gap-2">
                {card.labels.map((label: Label) => (
                  <Badge
                    key={label.id}
                    style={{ backgroundColor: label.color }}
                    className="text-white"
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Checklist */}
          {card.checklist_items && card.checklist_items.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Checklist ({card.checklist_progress.completed}/
                {card.checklist_progress.total})
              </h3>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">
                    {card.checklist_progress.percentage}% complete
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${card.checklist_progress.percentage}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {card.checklist_items.map((item: ChecklistItem) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-accent"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      readOnly
                      className="h-4 w-4"
                    />
                    <span
                      className={
                        item.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }
                    >
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Attachments */}
          {card.attachments && card.attachments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attachments ({card.attachments.length})
              </h3>
              <div className="space-y-2">
                {card.attachments.map((attachment: Attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 border rounded hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <Paperclip className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {attachment.original_filename}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(attachment.file_size)} •{" "}
                          {attachment.user.username || attachment.user.email}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Comments */}
          {card.comments && card.comments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Comments ({card.comments.length})
              </h3>
              <div className="space-y-4">
                {card.comments.map((comment: Comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {comment.user.username || comment.user.email}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.created_at)}
                          </span>
                          {comment.is_edited && (
                            <span className="text-xs text-muted-foreground italic">
                              (edited)
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {comment.content}
                        </p>
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-8 space-y-2 border-l-2 pl-4">
                        {comment.replies.map((reply: Comment) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">
                                  {reply.user.username || reply.user.email}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(reply.created_at)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          {card.activities && card.activities.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <ActivityIcon className="w-4 h-4" />
                  Activity Timeline ({card.activities.length})
                </h3>
                <div className="space-y-3">
                  {card.activities.map((activity: Activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">
                            {activity.user.username || activity.user.email}
                          </span>
                          <span className="text-muted-foreground">
                            {formatActivityAction(activity.action_type)}
                          </span>
                          {activity.metadata && (
                            <span className="text-xs text-muted-foreground">
                              {formatActivityMetadata(activity.action_type, activity.metadata)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(activity.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const formatActivityAction = (actionType: ActivityActionType): string => {
  const actionMap: Record<ActivityActionType, string> = {
    created: "created this card",
    updated: "updated this card",
    moved: "moved this card",
    archived: "archived this card",
    assignee_added: "added an assignee",
    assignee_removed: "removed an assignee",
    label_added: "added a label",
    label_removed: "removed a label",
    comment_added: "added a comment",
    attachment_added: "added an attachment",
    checklist_item_added: "added a checklist item",
    checklist_item_completed: "completed a checklist item",
    due_date_set: "set the due date",
    due_date_changed: "changed the due date",
    due_date_removed: "removed the due date",
    priority_changed: "changed the priority",
    description_changed: "updated the description",
    title_changed: "changed the title",
  };
  return actionMap[actionType] || actionType;
};

const formatActivityMetadata = (actionType: ActivityActionType, metadata: any): string => {
  if (!metadata) return "";

  try {
    switch (actionType) {
      case "priority_changed":
        return metadata.new_value ? `to ${metadata.new_value}` : "";
      case "label_added":
      case "label_removed":
        return metadata.label_name ? `"${metadata.label_name}"` : "";
      case "assignee_added":
      case "assignee_removed":
        return metadata.assignee_name ? `${metadata.assignee_name}` : "";
      case "due_date_set":
      case "due_date_changed":
        return metadata.new_value ? `to ${new Date(metadata.new_value).toLocaleDateString()}` : "";
      case "title_changed":
        return metadata.new_value ? `to "${metadata.new_value}"` : "";
      default:
        return "";
    }
  } catch {
    return "";
  }
};
