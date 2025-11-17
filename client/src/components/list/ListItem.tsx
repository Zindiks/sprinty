import { ElementRef, useRef, useState } from "react";
import { List } from "@/types/types";
import ListHeader from "@/components/list/ListHeader";
import CardForm from "@/components/card/CardForm";
import { cn } from "@/lib/utils";
import CardItem from "@/components/card/CardItem";
import { useSelectionKeyboard } from "@/hooks/useSelectionKeyboard";

import { Draggable, Droppable } from "@hello-pangea/dnd";

interface ListItemProps {
  index: number;
  data: List;
}

const ListItem = ({ data, index }: ListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  console.log(data);

  const textareaRef = useRef<ElementRef<"textarea">>(null);

  // Enable keyboard shortcuts for this list
  useSelectionKeyboard({
    listId: data.id,
    cardIds: data.cards.map((c) => c.id),
  });

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);

    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] shadow-md"
          >
            <ListHeader onAddCard={enableEditing} data={data} />

            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                    data.cards.length > 0 ? "mt-2" : "mt-0",
                  )}
                >
                  {data?.cards?.map((card, index) => {
                    return (
                      <CardItem
                        index={index}
                        key={card.id + index}
                        data={card}
                        allCardIds={data.cards.map((c) => c.id)}
                      />
                    );
                  })}

                  {provided.placeholder}
                </ol>
              )}
            </Droppable>

            <CardForm
              ref={textareaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
              list_id={data.id}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default ListItem;
