import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Draggable } from '@hello-pangea/dnd';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import type { ChecklistItem as ChecklistItemType } from '@/types/types';
import { cn } from '@/lib/utils';

interface ChecklistItemProps {
  item: ChecklistItemType;
  index: number;
  onToggle: () => void;
  onUpdate: (title: string) => void;
  onDelete: () => void;
  isPending: boolean;
}

export const ChecklistItem = ({
  item,
  index,
  onToggle,
  onUpdate,
  onDelete,
  isPending,
}: ChecklistItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(item.title);
  }, [item.title]);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== item.title) {
      onUpdate(trimmed);
    } else {
      setEditValue(item.title);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(item.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            'group flex items-center gap-2 p-2 rounded-lg border transition-colors',
            snapshot.isDragging && 'shadow-lg bg-accent',
            !snapshot.isDragging && 'hover:bg-accent/50',
          )}
        >
          {/* Drag Handle */}
          <div
            {...provided.dragHandleProps}
            className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-50 transition-opacity"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Checkbox */}
          <input
            type="checkbox"
            checked={item.completed}
            onChange={onToggle}
            disabled={isPending}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer disabled:cursor-not-allowed"
          />

          {/* Title */}
          {isEditing ? (
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              disabled={isPending}
              className="flex-1 h-7 text-sm"
            />
          ) : (
            <span
              className={cn(
                'flex-1 text-sm cursor-pointer',
                item.completed && 'line-through text-muted-foreground',
              )}
              onClick={() => !isPending && setIsEditing(true)}
            >
              {item.title}
            </span>
          )}

          {/* Action Buttons */}
          {!isEditing && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setIsEditing(true)}
                disabled={isPending}
              >
                <Pencil className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                onClick={onDelete}
                disabled={isPending}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}

          {/* Completion Info */}
          {item.completed && item.completed_at && !isEditing && (
            <span className="text-xs text-muted-foreground hidden sm:block">
              {new Date(item.completed_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
      )}
    </Draggable>
  );
};
