import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableDescriptionProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const EditableDescription = ({
  value,
  onChange,
  disabled = false,
}: EditableDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to end
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value || "");
  }, [value]);

  const handleStartEdit = () => {
    if (disabled) return;
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed !== value) {
      onChange(trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Cmd/Ctrl + Enter to save
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    // Escape to cancel
    else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a more detailed description..."
          className="min-h-[120px] resize-y"
          disabled={disabled}
        />
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Cmd</kbd> +{" "}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd> to save,{" "}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Esc</kbd> to cancel
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleStartEdit}
      className={cn(
        "group relative rounded p-3 -mx-3 hover:bg-accent transition-colors cursor-pointer min-h-[60px]",
        disabled && "cursor-not-allowed opacity-50",
        !value && "border border-dashed"
      )}
    >
      {value ? (
        <div className="text-sm text-muted-foreground whitespace-pre-wrap pr-8">
          {value}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground italic">
          Add a more detailed description...
        </div>
      )}
      {!disabled && (
        <Pencil className="absolute right-3 top-3 w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
      )}
    </div>
  );
};
