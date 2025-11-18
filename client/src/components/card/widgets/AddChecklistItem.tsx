import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useChecklists } from "@/hooks/useChecklists";

interface AddChecklistItemProps {
  cardId: string;
}

export const AddChecklistItem = ({ cardId }: AddChecklistItemProps) => {
  const { createItem, checklistItems } = useChecklists(cardId);
  const [isAdding, setIsAdding] = useState(false);
  const [itemTitle, setItemTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAdd = () => {
    const trimmed = itemTitle.trim();
    if (trimmed) {
      createItem.mutate(
        {
          card_id: cardId,
          title: trimmed,
          order: checklistItems.length,
        },
        {
          onSuccess: () => {
            setItemTitle("");
            // Keep the input open for adding more items
            inputRef.current?.focus();
          },
        }
      );
    }
  };

  const handleCancel = () => {
    setItemTitle("");
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (!isAdding) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2"
        onClick={() => setIsAdding(true)}
      >
        <Plus className="w-4 h-4" />
        Add item
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Input
        ref={inputRef}
        placeholder="Add checklist item..."
        value={itemTitle}
        onChange={(e) => setItemTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={createItem.isPending}
        className="text-sm"
      />
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleAdd} disabled={!itemTitle.trim() || createItem.isPending}>
          {createItem.isPending ? "Adding..." : "Add"}
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd> to add,{" "}
        <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Esc</kbd> to cancel
      </p>
    </div>
  );
};
