import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pencil, Trash2, Reply, CornerDownRight } from 'lucide-react';
import type { Comment } from '@/types/types';
import { useUser } from '@/contexts/UserContext';
import { AddComment } from './AddComment';
import { cn } from '@/lib/utils';

interface CommentItemProps {
  comment: Comment;
  cardId: string;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  isPending: boolean;
  depth?: number;
}

export const CommentItem = ({
  comment,
  cardId,
  onUpdate,
  onDelete,
  isPending,
  depth = 0,
}: CommentItemProps) => {
  const { user: currentUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const [showReply, setShowReply] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isAuthor = currentUser?.id === comment.user_id;
  const hasReplies = comment.replies && comment.replies.length > 0;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length,
      );
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(comment.content);
  }, [comment.content]);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== comment.content) {
      onUpdate(trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(comment.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  const getInitials = (username?: string, email?: string) => {
    if (username) {
      return username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <>
      <div className={cn('space-y-3', depth > 0 && 'ml-8 pl-4 border-l-2')}>
        <div className="flex gap-3">
          <Avatar className="w-8 h-8 shrink-0">
            {comment.user.avatar_url && (
              <AvatarImage
                src={comment.user.avatar_url}
                alt={comment.user.username || comment.user.email}
              />
            )}
            <AvatarFallback className="text-xs">
              {getInitials(comment.user.username, comment.user.email)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <span className="font-medium">{comment.user.username || comment.user.email}</span>
              <span className="text-muted-foreground text-xs">
                {formatDate(comment.created_at)}
              </span>
              {comment.is_edited && (
                <span className="text-muted-foreground text-xs italic">(edited)</span>
              )}
            </div>

            {/* Content */}
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  ref={textareaRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isPending}
                  className="min-h-[80px] resize-y"
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleSave} disabled={isPending}>
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancel} disabled={isPending}>
                    Cancel
                  </Button>
                  <span className="text-xs text-muted-foreground ml-2">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Cmd</kbd> +{' '}
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd> to save
                  </span>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap wrap-break-word">
                  {comment.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {depth < 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setShowReply(!showReply)}
                    >
                      <Reply className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                  )}
                  {isAuthor && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setIsEditing(true)}
                        disabled={isPending}
                      >
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-destructive hover:text-destructive"
                        onClick={handleDeleteClick}
                        disabled={isPending}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                  {hasReplies && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setShowReplies(!showReplies)}
                    >
                      <CornerDownRight className="w-3 h-3 mr-1" />
                      {showReplies ? 'Hide' : 'Show'} {comment.replies!.length}{' '}
                      {comment.replies!.length === 1 ? 'reply' : 'replies'}
                    </Button>
                  )}
                </div>
              </>
            )}

            {/* Reply Form */}
            {showReply && !isEditing && (
              <div className="mt-2">
                <AddComment
                  cardId={cardId}
                  parentCommentId={comment.id}
                  onSuccess={() => setShowReply(false)}
                  placeholder="Write a reply..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Nested Replies */}
        {hasReplies && showReplies && !isEditing && (
          <div className="space-y-3">
            {comment.replies!.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                cardId={cardId}
                onUpdate={
                  (content) => onUpdate(content) // This will need to be passed from parent
                }
                onDelete={onDelete} // This will need to be passed from parent
                isPending={isPending}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete comment?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The comment will be permanently deleted.
              {hasReplies && (
                <span className="block mt-2 text-destructive">
                  Warning: This comment has {comment.replies!.length}{' '}
                  {comment.replies!.length === 1 ? 'reply' : 'replies'} that will also be deleted.
                </span>
              )}
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
