import BoardList from "@/components/board/BoardList";
import { CreateBoardModal } from "@/components/board/CreateBoardModal";
import { StaticSidebar } from "@/components/SidebarStatic";
import { GlobalSearchDialog } from "@/components/search/GlobalSearchDialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

const Boards = () => {
  const [searchOpen, setSearchOpen] = useState(false);

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

  return (
    <div className="flex h-screen">
      <StaticSidebar />
      <main className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Boards</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
            <kbd className="ml-2 pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>
        <CreateBoardModal />
        <BoardList />
        <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      </main>
    </div>
  );
};

export default Boards;
