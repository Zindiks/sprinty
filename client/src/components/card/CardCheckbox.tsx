import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface CardCheckboxProps {
  cardId: string;
  cardTitle: string;
  isSelected: boolean;
  onToggle: (cardId: string) => void;
  visible: boolean;
}

export const CardCheckbox = ({
  cardId,
  cardTitle,
  isSelected,
  onToggle,
  visible,
}: CardCheckboxProps) => {
  return (
    <div
      className={cn(
        'absolute top-2 left-2 z-10 transition-opacity duration-150',
        visible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
      )}
    >
      <Checkbox
        id={`card-checkbox-${cardId}`}
        aria-label={`Select card: ${cardTitle}`}
        checked={isSelected}
        onCheckedChange={() => onToggle(cardId)}
        onClick={(e) => e.stopPropagation()}
        className="bg-white"
      />
    </div>
  );
};
