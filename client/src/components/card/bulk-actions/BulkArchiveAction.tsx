import { Button } from '@/components/ui/button';
import { useSelectionStore } from '@/hooks/store/useSelectionStore';
import { useBulkActions } from '@/hooks/useBulkActions';
import { Archive } from 'lucide-react';

export const BulkArchiveAction = () => {
  const { getSelectedCards } = useSelectionStore();
  const { bulkArchiveCards } = useBulkActions();

  const handleArchive = () => {
    const selectedCards = getSelectedCards();
    if (selectedCards.length > 0) {
      bulkArchiveCards(selectedCards);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleArchive}
      className="h-8"
      aria-label="Archive selected cards"
    >
      <Archive className="h-4 w-4 mr-2" />
      Archive
    </Button>
  );
};
