import { useState } from "react";
import type {
  CardWithDetails,
  ChecklistItem,
  Comment,
  Attachment,
  Label,
  Assignee,
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
import {
  Calendar,
  Flag,
  Users,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Clock,
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
  if (!card) return null;

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

          {/* Metadata Row */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            {card.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(card.due_date)}</span>
              </div>
            )}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
