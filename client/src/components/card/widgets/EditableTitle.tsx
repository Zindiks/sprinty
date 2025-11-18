import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableTitleProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const EditableTitle = ({
  value,
  onChange,
  className,
  disabled = false,
}: EditableTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleStartEdit = () => {
    if (disabled) return;
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== value) {
      onChange(trimmed);
    } else {
      setEditValue(value);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
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

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn('text-2xl font-bold h-auto py-2', className)}
        disabled={disabled}
      />
    );
  }

  return (
    <div
      onClick={handleStartEdit}
      className={cn(
        'group relative cursor-pointer rounded px-2 py-2 -mx-2 hover:bg-accent transition-colors',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <h2 className="text-2xl font-bold pr-8">{value}</h2>
      {!disabled && (
        <Pencil className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
      )}
    </div>
  );
};
