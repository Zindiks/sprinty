import BoardList from "@/components/board/BoardList";
import { CreateBoardModal } from "@/components/board/CreateBoardModal";
import { StaticSidebar } from "@/components/SidebarStatic";
import { useSearchDialog } from "@/contexts/SearchContext";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Boards = () => {
  const { openSearch } = useSearchDialog();

  return (
    <div className="flex h-screen">
      <StaticSidebar />
      <main className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Boards</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={openSearch}
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
      </main>
    </div>
  );
};

export default Boards;
