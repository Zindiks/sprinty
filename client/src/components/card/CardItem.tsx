import type { Card } from "@/types/types";
import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CardItemProps {
  index: number;
  data: Card;
}

const CardItem = ({ index, data }: CardItemProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCardClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Draggable draggableId={data.id} index={index}>
        {(provided) => (
          <Link
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
            role="button"
            to={`?selectedIssue=${data.id}`}
            className="truncate border-2 border-transparent hover:border-primary py-2 px-3 text-sm bg-background rounded-md shadow-sm"
            onClick={handleCardClick}
          >
            {data.title}
          </Link>
        )}
      </Draggable>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{data.title}</DialogTitle>
          </DialogHeader>
          <DialogDescription>{data.description}</DialogDescription>
          <DialogFooter>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CardItem;
