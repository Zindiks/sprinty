import { TrashIcon, Search } from "lucide-react";
import { useBoard } from "@/hooks/useBoards";
import { useNavigate } from "react-router-dom";
import { Board } from "@/types/types";
import BoardTitleForm from "./BoardTitleForm";
import { Button } from "@/components/ui/button";
import { GlobalSearchDialog } from "@/components/search/GlobalSearchDialog";
import { useState, useEffect } from "react";

interface BoardNavBarProps {
  data: Board;
}

const BoardNavBar = ({ data }: BoardNavBarProps) => {
  if (!data) {
    return <h1>error</h1>;
  }

  const { deleteBoard } = useBoard(data.organization_id);
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  console.log(data);

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDelete = (board_id: string) => {
    deleteBoard.mutate(board_id, {
      onSuccess: () => {
        navigate("/boards");
      },
    });
  };

  return (
    <div className="h-12 flex bg-black/50 items-center px-6 gap-x-4 text-white">
      <BoardTitleForm data={data} />

      <div className={"ml-auto flex items-center gap-x-2"}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSearchOpen(true)}
          className="text-white hover:bg-white/20"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
          <kbd className="ml-2 pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
        {/*TODO: Popover menu with additional info about board and so on*/}
        <TrashIcon onClick={() => handleDelete(data.id)} className="cursor-pointer" />
      </div>

      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
};

export default BoardNavBar;
