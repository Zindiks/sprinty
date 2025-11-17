import type { Card } from "@/types/types";
import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { CardDetailsModal } from "./CardDetailsModal";
import { Calendar, Flag, Users, CheckSquare, AlertCircle, Clock } from "lucide-react";
import axios from "axios";
import {
  formatDueDateShort,
  getDueDateColor,
  getDueDateStatus
} from "@/lib/dateUtils";
import { CardDetailsPanel } from "./CardDetailsPanel";
import { Calendar, Flag } from "lucide-react";

interface CardItemProps {
  index: number;
  data: Card;
}

const CardItem = ({ index, data }: CardItemProps) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleCardClick = (e: React.MouseEvent) => {
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
      <Draggable draggableId={data.id} index={index}>
        {(provided) => (
          <div
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
            role="button"
            className="border-2 border-transparent hover:border-primary py-2 px-3 text-sm bg-background rounded-md shadow-sm cursor-pointer"
            onClick={handleCardClick}
          >
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
                {data.due_date && (() => {
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

      <CardDetailsPanel
        cardId={selectedCardId}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />
    </>
  );
};

export default CardItem;
