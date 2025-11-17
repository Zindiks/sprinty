import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useComments } from "@/hooks/useComments";
import { useUser } from "@/contexts/UserContext";

interface AddCommentProps {
  cardId: string;
  parentCommentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
}

export const AddComment = ({
  cardId,
  parentCommentId,
  onSuccess,
  placeholder = "Write a comment...",
}: AddCommentProps) => {
  const { user: currentUser } = useUser();
  const { createComment } = useComments(cardId);
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getInitials = (username?: string, email?: string) => {
    if (username) {
      return username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (trimmed) {
      createComment.mutate(
        {
          card_id: cardId,
          content: trimmed,
          parent_comment_id: parentCommentId,
        },
        {
          onSuccess: () => {
            setContent("");
            setIsFocused(false);
            onSuccess?.();
          },
        }
      );
    }
  };

  const handleCancel = () => {
    setContent("");
    setIsFocused(false);
    onSuccess?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (!currentUser) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Please log in to comment
      </p>
    );
  }

  return (
    <div className="flex gap-3">
      <Avatar className="w-8 h-8 flex-shrink-0">
        {currentUser.avatar_url && (
          <AvatarImage
            src={currentUser.avatar_url}
            alt={currentUser.login || currentUser.email}
          />
        )}
        <AvatarFallback className="text-xs">
          {getInitials(currentUser.login, currentUser.email)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <Textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          disabled={createComment.isPending}
          className="min-h-[80px] resize-y"
        />

        {(isFocused || content) && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!content.trim() || createComment.isPending}
            >
              {createComment.isPending
                ? "Posting..."
                : parentCommentId
                ? "Reply"
                : "Comment"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={createComment.isPending}
            >
              Cancel
            </Button>
            <span className="text-xs text-muted-foreground ml-2">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">
                Cmd
              </kbd>{" "}
              +{" "}
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">
                Enter
              </kbd>{" "}
              to post
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
