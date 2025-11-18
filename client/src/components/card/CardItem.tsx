import type { Card } from '@/types/types';
import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';
import { CardCheckbox } from './CardCheckbox';
import { Calendar, Flag, AlertCircle, Clock } from 'lucide-react';
import { useSelectionStore } from '@/hooks/store/useSelectionStore';
import { cn } from '@/lib/utils';
import { formatDueDateShort, getDueDateColor, getDueDateStatus } from '@/lib/dateUtils';
import { CardDetailsPanel } from './CardDetailsPanel';

interface CardItemProps {
  index: number;
  data: Card;
  allCardIds?: string[];
}

const CardItem = ({ index, data, allCardIds = [] }: CardItemProps) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Selection state
  const { selectionMode, isCardSelected, toggleCard, selectRange, lastSelectedCardId } =
    useSelectionStore();

  const isSelected = isCardSelected(data.id);

  const handleCardClick = (e: React.MouseEvent) => {
    // If in selection mode, handle selection instead of opening panel
    if (selectionMode) {
      e.preventDefault();

      // Cmd/Ctrl + Click - Toggle individual card
      if (e.metaKey || e.ctrlKey) {
        toggleCard(data.id);
        return;
      }

      // Shift + Click - Range selection
      if (e.shiftKey && lastSelectedCardId && allCardIds.length > 0) {
        selectRange(lastSelectedCardId, data.id, allCardIds);
        return;
      }

      // Regular click in selection mode - Toggle
      toggleCard(data.id);
      return;
    }

    // Normal behavior - open panel
    e.preventDefault();
    setSelectedCardId(data.id);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedCardId(null);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <Draggable draggableId={data.id} index={index} isDragDisabled={selectionMode}>
        {(provided) => (
          <div
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
            role="button"
            className={cn(
              'group relative border-2 py-2 px-3 text-sm bg-background rounded-md shadow-sm cursor-pointer transition-all',
              selectionMode && 'pl-8',
              isSelected
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50'
                : 'border-transparent hover:border-primary',
            )}
            onClick={handleCardClick}
          >
            {/* Selection Checkbox */}
            <CardCheckbox
              cardId={data.id}
              cardTitle={data.title}
              isSelected={isSelected}
              onToggle={toggleCard}
              visible={selectionMode || isSelected}
            />

            <div className="space-y-2">
              <div className="font-medium">{data.title}</div>

              {/* Card Metadata */}
              <div className="flex items-center gap-2 flex-wrap">
                {data.priority && (
                  <Badge variant={getPriorityColor(data.priority)} className="text-xs">
                    <Flag className="w-3 h-3 mr-1" />
                    {data.priority}
                  </Badge>
                )}
                {data.due_date &&
                  (() => {
                    const status = getDueDateStatus(data.due_date);
                    const color = getDueDateColor(data.due_date);
                    const isOverdue = status === 'overdue';
                    const isToday = status === 'today';

                    return (
                      <Badge variant={color} className="text-xs">
                        {isOverdue ? (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        ) : isToday ? (
                          <Clock className="w-3 h-3 mr-1" />
                        ) : (
                          <Calendar className="w-3 h-3 mr-1" />
                        )}
                        {formatDueDateShort(data.due_date)}
                      </Badge>
                    );
                  })()}
              </div>
            </div>
          </div>
        )}
      </Draggable>

      <CardDetailsPanel cardId={selectedCardId} isOpen={isPanelOpen} onClose={handleClosePanel} />
    </>
  );
};

export default CardItem;
