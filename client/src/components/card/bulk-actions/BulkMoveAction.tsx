import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSelectionStore } from "@/hooks/store/useSelectionStore";
import { useBulkActions } from "@/hooks/useBulkActions";
import { useLists } from "@/hooks/useLists";
import { useStore } from "@/hooks/store/useStore";
import { List } from "@/types/types";
import { MoveRight } from "lucide-react";
import { useState } from "react";

export const BulkMoveAction = () => {
  const [open, setOpen] = useState(false);
  const { getSelectedCards } = useSelectionStore();
  const { bulkMoveCards } = useBulkActions();
  const { board_id } = useStore();
  const { lists } = useLists(board_id);
  const listsData = lists.data;

  const handleMove = (listId: string) => {
    const selectedCards = getSelectedCards();
    if (selectedCards.length > 0) {
      bulkMoveCards(selectedCards, listId);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          <MoveRight className="h-4 w-4 mr-2" />
          Move
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="space-y-1">
          <h4 className="font-medium text-sm px-2 py-1.5">Move to list</h4>
          <div className="space-y-0.5">
            {listsData?.map((list: List) => (
              <Button
                key={list.id}
                variant="ghost"
                className="w-full justify-start h-8 px-2 text-sm"
                onClick={() => handleMove(list.id)}
              >
                {list.title}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
