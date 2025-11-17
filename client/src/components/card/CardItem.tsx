import type { Card, CardWithDetails } from "@/types/types";
import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { CardDetailsModal } from "./CardDetailsModal";
import { Calendar, Flag, Users, CheckSquare } from "lucide-react";
import axios from "axios";

interface CardItemProps {
  index: number;
  data: Card;
}

const CardItem = ({ index, data }: CardItemProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCardClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDialogOpen(true);
    setIsLoading(true);

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
      });
    } finally {
      setIsLoading(false);
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
