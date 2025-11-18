import { Paperclip } from "lucide-react";
import { useAttachments } from "@/hooks/useAttachments";
import { AttachmentItem } from "../widgets/AttachmentItem";
import { AddAttachment } from "../widgets/AddAttachment";

interface AttachmentSectionProps {
  cardId: string;
}

export const AttachmentSection = ({ cardId }: AttachmentSectionProps) => {
  const { attachments, isLoading, deleteAttachment, downloadAttachment } = useAttachments(cardId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Paperclip className="w-4 h-4" />
          Attachments
          {attachments && attachments.length > 0 && (
            <span className="text-xs text-muted-foreground">({attachments.length})</span>
          )}
        </h3>
      </div>

      {/* Add Attachment */}
      <AddAttachment cardId={cardId} />

      {/* Attachments List */}
      {isLoading ? (
        <div className="space-y-2">
          <div className="w-full h-16 rounded border bg-muted animate-pulse" />
          <div className="w-full h-16 rounded border bg-muted animate-pulse" />
        </div>
      ) : attachments && attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <AttachmentItem
              key={attachment.id}
              attachment={attachment}
              onDownload={() => downloadAttachment(attachment.id, attachment.filename)}
              onDelete={() =>
                deleteAttachment.mutate({
                  id: attachment.id,
                  card_id: cardId,
                })
              }
              isPending={deleteAttachment.isPending}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic text-center py-4">
          No attachments yet. Drag and drop files or click to upload.
        </p>
      )}
    </div>
  );
};
