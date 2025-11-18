import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DueDatePickerProps {
  value?: string;
  onChange: (date: string | undefined) => void;
  disabled?: boolean;
}

export const DueDatePicker = ({ value, onChange, disabled = false }: DueDatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState(value || "");

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getRelativeTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1 && diffDays <= 7) return `in ${diffDays} days`;
    if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
    if (diffDays < 0) return "Overdue";
    return `in ${diffDays} days`;
  };

  const handleSave = () => {
    onChange(tempDate || undefined);
    setOpen(false);
  };

  const handleClear = () => {
    setTempDate("");
    onChange(undefined);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempDate(value || "");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className={cn("h-8 gap-2", value && isOverdue(value) && "text-red-500 border-red-500")}
        >
          <Calendar className="w-4 h-4" />
          {value ? (
            <div className="flex flex-col items-start">
              <span className="text-xs font-medium">{formatDate(value)}</span>
              <span className="text-[10px] text-muted-foreground">{getRelativeTime(value)}</span>
            </div>
          ) : (
            <span className="text-xs">Set due date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Due Date</label>
            <Input
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              className="w-full"
            />
          </div>
          {tempDate && (
            <div className="text-sm text-muted-foreground">{getRelativeTime(tempDate)}</div>
          )}
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSave} className="flex-1">
              Save
            </Button>
            {value && (
              <Button size="sm" variant="outline" onClick={handleClear}>
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
