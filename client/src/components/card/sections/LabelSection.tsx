import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag, X, Plus } from 'lucide-react';
import { useLabels } from '@/hooks/useLabels';
import { LabelManager } from '../widgets/LabelManager';

interface LabelSectionProps {
  cardId: string;
  boardId: string;
}

export const LabelSection = ({ cardId, boardId }: LabelSectionProps) => {
  const { cardLabels, isLoadingCardLabels, removeLabelFromCard } = useLabels(boardId, cardId);
  const [showManager, setShowManager] = useState(false);

  const handleRemoveLabel = (labelId: string) => {
    removeLabelFromCard.mutate({ card_id: cardId, label_id: labelId });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Labels
          {cardLabels && cardLabels.length > 0 && (
            <span className="text-xs text-muted-foreground">({cardLabels.length})</span>
          )}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowManager(true)}
          className="h-7 gap-1"
        >
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>

      {isLoadingCardLabels ? (
        <div className="flex gap-2">
          <div className="w-16 h-6 rounded bg-muted animate-pulse" />
          <div className="w-20 h-6 rounded bg-muted animate-pulse" />
        </div>
      ) : cardLabels && cardLabels.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {cardLabels.map((label) => (
            <div key={label.id} className="group relative">
              <Badge
                style={{ backgroundColor: label.color }}
                className="text-white pr-6 hover:opacity-90 transition-opacity"
              >
                {label.name}
                <button
                  onClick={() => handleRemoveLabel(label.id)}
                  disabled={removeLabelFromCard.isPending}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black/20 hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">No labels yet</p>
      )}

      <LabelManager
        cardId={cardId}
        boardId={boardId}
        open={showManager}
        onClose={() => setShowManager(false)}
        currentLabels={cardLabels?.map((l) => l.id) || []}
      />
    </div>
  );
};
