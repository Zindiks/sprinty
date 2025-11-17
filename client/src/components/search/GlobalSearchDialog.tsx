import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/useSearch";
import { useStore } from "@/hooks/store/useStore";
import { Loader2, FileText, List, Square } from "lucide-react";

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearchDialog({
  open,
  onOpenChange,
}: GlobalSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { organization_id } = useStore();
  const navigate = useNavigate();
  const { search } = useSearch();

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isFetching } = search(
    {
      query: debouncedQuery,
      organization_id,
      type: "all",
      limit: 30,
    },
    debouncedQuery.length >= 1,
  );

  const handleSelect = useCallback(
    (type: "board" | "list" | "card", id: string, boardId?: string) => {
      if (type === "board") {
        navigate(`/board/${id}`);
      } else if (type === "list" || type === "card") {
        navigate(`/board/${boardId}`);
      }
      onOpenChange(false);
      setSearchQuery("");
    },
    [navigate, onOpenChange],
  );

  const hasResults =
    data &&
    (data.results.boards.length > 0 ||
      data.results.lists.length > 0 ||
      data.results.cards.length > 0);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search boards, lists, and cards..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        {(isLoading || isFetching) && debouncedQuery.length >= 1 && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {!isLoading && !isFetching && debouncedQuery.length >= 1 && !hasResults && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}

        {hasResults && (
          <>
            {data.results.boards.length > 0 && (
              <CommandGroup heading="Boards">
                {data.results.boards.map((board) => (
                  <CommandItem
                    key={board.id}
                    value={`board-${board.id}`}
                    onSelect={() => handleSelect("board", board.id)}
                  >
                    <Square className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{board.title}</span>
                      {board.description && (
                        <span className="text-xs text-muted-foreground">
                          {board.description}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {data.results.lists.length > 0 && (
              <CommandGroup heading="Lists">
                {data.results.lists.map((list) => (
                  <CommandItem
                    key={list.id}
                    value={`list-${list.id}`}
                    onSelect={() =>
                      handleSelect("list", list.id, list.board_id)
                    }
                  >
                    <List className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{list.title}</span>
                      <span className="text-xs text-muted-foreground">
                        in {list.board_title}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {data.results.cards.length > 0 && (
              <CommandGroup heading="Cards">
                {data.results.cards.map((card) => (
                  <CommandItem
                    key={card.id}
                    value={`card-${card.id}`}
                    onSelect={() =>
                      handleSelect("card", card.id, card.board_id)
                    }
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{card.title}</span>
                      <span className="text-xs text-muted-foreground">
                        in {card.list_title} • {card.board_title}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        )}

        {!debouncedQuery && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Type to search across all boards, lists, and cards
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}
