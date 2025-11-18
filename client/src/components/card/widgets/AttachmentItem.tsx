import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  Download,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import type { Attachment } from '@/types/types';
import { useUser } from '@/contexts/UserContext';

interface AttachmentItemProps {
  attachment: Attachment;
  onDownload: () => void;
  onDelete: () => void;
  isPending: boolean;
}

export const AttachmentItem = ({
  attachment,
  onDownload,
  onDelete,
  isPending,
}: AttachmentItemProps) => {
  const { user: currentUser } = useUser();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const isOwner = currentUser?.id === attachment.uploaded_by;

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return FileImage;
    if (mimeType.startsWith('video/')) return FileVideo;
    if (mimeType.startsWith('audio/')) return FileAudio;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isImage = attachment.mime_type.startsWith('image/');
  const FileIcon = getFileIcon(attachment.mime_type);

  const API_HOST = import.meta.env.VITE_API_HOST;
  const API_PORT = import.meta.env.VITE_API_PORT;
  const API_VERSION = import.meta.env.VITE_API_VERSION;
  const imageUrl = isImage
    ? `${API_HOST}:${API_PORT}${API_VERSION}/attachments/${attachment.id}/card/${attachment.card_id}/download`
    : null;

  return (
    <>
      <div className="group flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
        {/* File Icon or Image Preview */}
        {isImage && imageUrl ? (
          <button
            onClick={() => setShowImagePreview(true)}
            className="relative w-12 h-12 shrink-0 rounded overflow-hidden bg-muted cursor-pointer"
          >
            <img src={imageUrl} alt={attachment.filename} className="w-full h-full object-cover" />
          </button>
        ) : (
          <div className="w-12 h-12 shrink-0 rounded bg-muted flex items-center justify-center">
            <FileIcon className="w-6 h-6 text-muted-foreground" />
          </div>
        )}

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.filename}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatFileSize(attachment.file_size)}</span>
            <span>•</span>
            <span>{attachment.user?.username || attachment.user?.email || 'Unknown'}</span>
            <span>•</span>
            <span>{formatDate(attachment.uploaded_at)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onDownload}
            title="Download"
          >
            <Download className="w-4 h-4" />
          </Button>
          {isImage && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowImagePreview(true)}
              title="Preview"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isPending}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Image Preview Dialog */}
      {isImage && imageUrl && (
        <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{attachment.filename}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-auto">
              <img src={imageUrl} alt={attachment.filename} className="w-full h-auto" />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete attachment?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The file "{attachment.filename}" will be permanently
              deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete();
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
