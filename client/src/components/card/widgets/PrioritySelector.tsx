import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Flag, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Priority = "low" | "medium" | "high" | "critical";

interface PrioritySelectorProps {
  value?: Priority;
  onChange: (priority: Priority | undefined) => void;
  disabled?: boolean;
}

const priorities: {
  value: Priority;
  label: string;
  variant: "secondary" | "default" | "destructive";
}[] = [
  { value: "low", label: "Low", variant: "secondary" },
  { value: "medium", label: "Medium", variant: "default" },
  { value: "high", label: "High", variant: "destructive" },
  { value: "critical", label: "Critical", variant: "destructive" },
];

export const PrioritySelector = ({ value, onChange, disabled = false }: PrioritySelectorProps) => {
  const [open, setOpen] = useState(false);

  const selectedPriority = priorities.find((p) => p.value === value);

  const handleSelect = (priority: Priority | undefined) => {
    onChange(priority);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} className="h-8 gap-2">
          <Flag className="w-4 h-4" />
          {selectedPriority ? (
            <Badge variant={selectedPriority.variant} className="text-xs">
              {selectedPriority.label}
            </Badge>
          ) : (
            <span className="text-xs">Set priority</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="start">
        <div className="space-y-1">
          {priorities.map((priority) => (
            <button
              key={priority.value}
              onClick={() => handleSelect(priority.value)}
              className={cn(
                "flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm hover:bg-accent",
                value === priority.value && "bg-accent"
              )}
            >
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4" />
                <span>{priority.label}</span>
              </div>
              {value === priority.value && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
          {value && (
            <>
              <div className="my-1 h-px bg-border" />
              <button
                onClick={() => handleSelect(undefined)}
                className="flex w-full items-center rounded-sm px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
              >
                Clear priority
              </button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
