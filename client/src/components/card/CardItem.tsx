import type { Card, CardWithDetails } from "@/types/types";
import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { CardDetailsModal } from "./CardDetailsModal";
import { CardCheckbox } from "./CardCheckbox";
import { Calendar, Flag } from "lucide-react";
import { useSelectionStore } from "@/hooks/store/useSelectionStore";
import { cn } from "@/lib/utils";
import axios from "axios";

interface CardItemProps {
  index: number;
  data: Card;
  allCardIds?: string[];
}

const CardItem = ({ index, data, allCardIds = [] }: CardItemProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardWithDetails | null>(null);

  // Selection state
  const {
    selectionMode,
    isCardSelected,
    toggleCard,
    selectRange,
    lastSelectedCardId,
  } = useSelectionStore();

  const isSelected = isCardSelected(data.id);

  const handleCardClick = async (e: React.MouseEvent) => {
    // If in selection mode, handle selection instead of opening modal
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

    // Normal behavior - open modal
    e.preventDefault();
    setIsDialogOpen(true);

    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/cards/${data.id}/details`
      );
      setCardDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch card details:", error);
      // Fallback to basic card data
      setCardDetails({
        ...data,
        assignees: [],
        labels: [],
        checklist_items: [],
        checklist_progress: { total: 0, completed: 0, percentage: 0 },
        comments: [],
        attachments: [],
        activities: [],
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCardDetails(null);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "critical":
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <>
      <Draggable
        draggableId={data.id}
        index={index}
        isDragDisabled={selectionMode}
      >
        {(provided) => (
          <div
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
            role="button"
            className={cn(
              "group relative border-2 py-2 px-3 text-sm bg-background rounded-md shadow-sm cursor-pointer transition-all",
              selectionMode && "pl-8",
              isSelected
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50"
                : "border-transparent hover:border-primary"
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
                  <Badge
                    variant={getPriorityColor(data.priority)}
                    className="text-xs"
                  >
                    <Flag className="w-3 h-3 mr-1" />
                    {data.priority}
                  </Badge>
                )}
                {data.due_date && (
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(data.due_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </Draggable>

      <CardDetailsModal
        card={cardDetails}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default CardItem;
