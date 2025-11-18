import { TrashIcon, Search, BookTemplate } from 'lucide-react';
import { useBoard } from '@/hooks/useBoards';
import { useNavigate } from 'react-router-dom';
import { Board } from '@/types/types';
import BoardTitleForm from './BoardTitleForm';
import { Button } from '@/components/ui/button';
import { useSearchDialog } from '@/contexts/SearchContext';
import { GlobalSearchDialog } from '@/components/search/GlobalSearchDialog';
import { SaveAsTemplateDialog } from '@/components/templates/SaveAsTemplateDialog';
import { useState } from 'react';

interface BoardNavBarProps {
  data: Board;
}

const BoardNavBar = ({ data }: BoardNavBarProps) => {
  const { deleteBoard } = useBoard(data?.organization_id);
  const navigate = useNavigate();
  const { openSearch } = useSearchDialog();
  const [searchOpen, setSearchOpen] = useState(false);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);

  if (!data) {
    return <h1>error</h1>;
  }

  console.log(data);

  const handleDelete = (board_id: string) => {
    deleteBoard.mutate(board_id, {
      onSuccess: () => {
        navigate('/boards');
      },
    });
  };

  return (
    <div className="h-12 flex bg-black/50 items-center px-6 gap-x-4 text-white">
      <BoardTitleForm data={data} />

      <div className={'ml-auto flex items-center gap-x-2'}>
        <Button
          variant="ghost"
          size="sm"
          onClick={openSearch}
          className="text-white hover:bg-white/20"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
          <kbd className="ml-2 pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSaveTemplateOpen(true)}
          className="text-white hover:bg-white/20"
        >
          <BookTemplate className="h-4 w-4 mr-2" />
          Save as Template
        </Button>

        {/*TODO: Popover menu with additional info about board and so on*/}
        <TrashIcon
          onClick={() => handleDelete(data.id)}
          className="cursor-pointer hover:text-red-400 transition-colors"
        />
      </div>

      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <SaveAsTemplateDialog
        open={saveTemplateOpen}
        onOpenChange={setSaveTemplateOpen}
        boardId={data.id}
      />
    </div>
  );
};

export default BoardNavBar;
