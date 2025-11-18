import { MessageSquare } from "lucide-react";
import { useComments } from "@/hooks/useComments";
import { CommentItem } from "../widgets/CommentItem";
import { AddComment } from "../widgets/AddComment";

interface CommentSectionProps {
  cardId: string;
}

export const CommentSection = ({ cardId }: CommentSectionProps) => {
  const { comments, isLoading, updateComment, deleteComment } = useComments(cardId);

  // Filter top-level comments (no parent)
  const topLevelComments = comments?.filter((c) => !c.parent_comment_id) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Comments
          {comments && comments.length > 0 && (
            <span className="text-xs text-muted-foreground">({comments.length})</span>
          )}
        </h3>
      </div>

      {/* Add Comment */}
      <AddComment cardId={cardId} />

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-16 w-full bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-16 w-full bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      ) : topLevelComments.length > 0 ? (
        <div className="space-y-4">
          {topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              cardId={cardId}
              onUpdate={(content) =>
                updateComment.mutate({
                  id: comment.id,
                  card_id: cardId,
                  content,
                })
              }
              onDelete={() =>
                deleteComment.mutate({
                  id: comment.id,
                  card_id: cardId,
                })
              }
              isPending={updateComment.isPending || deleteComment.isPending}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic text-center py-4">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
};
