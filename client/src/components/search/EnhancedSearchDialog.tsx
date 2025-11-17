/**
 * Enhanced Search Dialog - Prototype Implementation
 *
 * This is an enhanced version of GlobalSearchDialog with Phase 1 improvements:
 * - Type filter toggles
 * - Recent items
 * - Search scope indicator
 * - Better mobile experience
 * - Result highlighting
 *
 * To use: Replace GlobalSearchDialog import with this component
 */

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
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/useSearch";
import { useStore } from "@/hooks/store/useStore";
import {
  Loader2,
  FileText,
  List,
  Square,
  Clock,
  Globe,
  Layout,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RecentItem {
  id: string;
  title: string;
  type: "board" | "list" | "card";
  board_id?: string;
  timestamp: number;
}

type SearchType = "board" | "list" | "card";

export function EnhancedSearchDialog({
  open,
  onOpenChange,
}: EnhancedSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<Set<SearchType>>(
    new Set(["board", "list", "card"])
  );
  const [searchScope, setSearchScope] = useState<"global" | "board">("global");
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

  const { organization_id, board_id } = useStore();
  const navigate = useNavigate();
  const { search } = useSearch();

  // Load recent items from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("search-recent-items");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentItems(parsed.slice(0, 5));
      } catch (e) {
        console.error("Failed to load recent items:", e);
      }
    }
  }, []);

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
      board_id: searchScope === "board" ? board_id : undefined,
      type: "all",
      limit: 30,
    },
    debouncedQuery.length >= 1
  );

  const saveRecentItem = useCallback((item: RecentItem) => {
    setRecentItems((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id);
      const newItems = [item, ...filtered].slice(0, 5);
      localStorage.setItem("search-recent-items", JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const handleSelect = useCallback(
    (
      type: "board" | "list" | "card",
      id: string,
      title: string,
      boardId?: string
    ) => {
      // Save to recent items
      saveRecentItem({
        id,
        title,
        type,
        board_id: boardId,
        timestamp: Date.now(),
      });

      // Navigate
      if (type === "board") {
        navigate(`/board/${id}`);
      } else if (type === "list" || type === "card") {
        navigate(`/board/${boardId}`);
      }

      onOpenChange(false);
      setSearchQuery("");
    },
    [navigate, onOpenChange, saveRecentItem]
  );

  const toggleType = (type: SearchType) => {
    setActiveTypes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        if (newSet.size > 1) {
          // Don't allow deselecting all
          newSet.delete(type);
        }
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const toggleScope = () => {
    setSearchScope((prev) => (prev === "global" ? "board" : "global"));
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={i}
              className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const filteredResults =
    data && {
      boards: activeTypes.has("board") ? data.results.boards : [],
      lists: activeTypes.has("list") ? data.results.lists : [],
      cards: activeTypes.has("card") ? data.results.cards : [],
    };

  const hasResults =
    filteredResults &&
    (filteredResults.boards.length > 0 ||
      filteredResults.lists.length > 0 ||
      filteredResults.cards.length > 0);

  const getIcon = (type: SearchType) => {
    switch (type) {
      case "board":
        return Square;
      case "list":
        return List;
      case "card":
        return FileText;
    }
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-[640px] max-h-screen sm:max-h-[85vh]"
    >
      <CommandInput
        placeholder="Search boards, lists, and cards..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />

      {/* Search Controls Bar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b bg-muted/30">
        {/* Type Filters */}
        <div className="flex gap-1">
          {(["board", "list", "card"] as SearchType[]).map((type) => {
            const Icon = getIcon(type);
            const isActive = activeTypes.has(type);

            return (
              <Button
                key={type}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                onClick={() => toggleType(type)}
                className={cn(
                  "h-7 px-2 text-xs",
                  isActive && "bg-secondary"
                )}
              >
                <Icon className="h-3 w-3 mr-1" />
                <span className="capitalize">{type}s</span>
              </Button>
            );
          })}
        </div>

        {/* Scope Toggle */}
        {board_id && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleScope}
            className="h-7 px-2 text-xs"
          >
            {searchScope === "global" ? (
              <>
                <Globe className="h-3 w-3 mr-1" />
                All Boards
              </>
            ) : (
              <>
                <Layout className="h-3 w-3 mr-1" />
                This Board
              </>
            )}
          </Button>
        )}
      </div>

      <CommandList>
        {/* Loading State */}
        {(isLoading || isFetching) && debouncedQuery.length >= 1 && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* No Results */}
        {!isLoading &&
          !isFetching &&
          debouncedQuery.length >= 1 &&
          !hasResults && (
            <CommandEmpty>
              <div className="p-4 space-y-3 text-center">
                <p className="text-sm">No results found for "{debouncedQuery}"</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Try:</p>
                  <ul className="list-none space-y-0.5">
                    <li>• Different keywords</li>
                    <li>• Checking your filters</li>
                    <li>• Searching in all boards</li>
                  </ul>
                </div>
              </div>
            </CommandEmpty>
          )}

        {/* Search Results */}
        {hasResults && filteredResults && (
          <>
            {filteredResults.boards.length > 0 && (
              <CommandGroup heading="Boards">
                {filteredResults.boards.map((board) => (
                  <CommandItem
                    key={board.id}
                    value={`board-${board.id}`}
                    onSelect={() =>
                      handleSelect("board", board.id, board.title)
                    }
                    className="py-3 sm:py-2"
                  >
                    <Square className="mr-2 h-4 w-4 flex-shrink-0" />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-medium truncate">
                        {highlightMatch(board.title, debouncedQuery)}
                      </span>
                      {board.description && (
                        <span className="text-xs text-muted-foreground truncate">
                          {highlightMatch(board.description, debouncedQuery)}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filteredResults.lists.length > 0 && (
              <CommandGroup heading="Lists">
                {filteredResults.lists.map((list) => (
                  <CommandItem
                    key={list.id}
                    value={`list-${list.id}`}
                    onSelect={() =>
                      handleSelect("list", list.id, list.title, list.board_id)
                    }
                    className="py-3 sm:py-2"
                  >
                    <List className="mr-2 h-4 w-4 flex-shrink-0" />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-medium truncate">
                        {highlightMatch(list.title, debouncedQuery)}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        in {list.board_title}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filteredResults.cards.length > 0 && (
              <CommandGroup heading="Cards">
                {filteredResults.cards.map((card) => (
                  <CommandItem
                    key={card.id}
                    value={`card-${card.id}`}
                    onSelect={() =>
                      handleSelect("card", card.id, card.title, card.board_id)
                    }
                    className="py-3 sm:py-2"
                  >
                    <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-medium truncate">
                        {highlightMatch(card.title, debouncedQuery)}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        in {card.list_title} • {card.board_title}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        )}

        {/* Recent Items (shown when no query) */}
        {!debouncedQuery && recentItems.length > 0 && (
          <CommandGroup heading="Recent">
            {recentItems.map((item) => {
              const Icon = getIcon(item.type);
              return (
                <CommandItem
                  key={item.id}
                  value={`recent-${item.id}`}
                  onSelect={() =>
                    handleSelect(item.type, item.id, item.title, item.board_id)
                  }
                  className="py-3 sm:py-2"
                >
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="font-medium truncate">{item.title}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {/* Empty State with Instructions */}
        {!debouncedQuery && recentItems.length === 0 && (
          <div className="p-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Type to search across all boards, lists, and cards
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">Keyboard shortcuts:</p>
              <div className="flex flex-col items-center gap-1">
                <p>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">↑↓</kbd>{" "}
                  Navigate results
                </p>
                <p>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    Enter
                  </kbd>{" "}
                  Open selected
                </p>
                <p>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>{" "}
                  Close
                </p>
              </div>
            </div>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}
