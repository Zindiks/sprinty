import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Circle, CheckCircle2, AlertCircle, XCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'todo' | 'in_progress' | 'done' | 'blocked';

interface StatusSelectorProps {
  value?: string;
  onChange: (status: string) => void;
  disabled?: boolean;
}

const statuses: {
  value: Status;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: 'todo',
    label: 'To Do',
    icon: <Circle className="w-4 h-4" />,
    color: 'text-muted-foreground',
  },
  {
    value: 'in_progress',
    label: 'In Progress',
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'text-blue-500',
  },
  {
    value: 'done',
    label: 'Done',
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'text-green-500',
  },
  {
    value: 'blocked',
    label: 'Blocked',
    icon: <XCircle className="w-4 h-4" />,
    color: 'text-red-500',
  },
];

export const StatusSelector = ({ value, onChange, disabled = false }: StatusSelectorProps) => {
  const [open, setOpen] = useState(false);

  const selectedStatus = statuses.find((s) => s.value === value);

  const handleSelect = (status: Status) => {
    onChange(status);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} className="h-8 gap-2">
          {selectedStatus ? (
            <>
              <span className={selectedStatus.color}>{selectedStatus.icon}</span>
              <span className="text-xs">{selectedStatus.label}</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4" />
              <span className="text-xs">Set status</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" align="start">
        <div className="space-y-1">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => handleSelect(status.value)}
              className={cn(
                'flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm hover:bg-accent',
                value === status.value && 'bg-accent',
              )}
            >
              <div className="flex items-center gap-2">
                <span className={status.color}>{status.icon}</span>
                <span>{status.label}</span>
              </div>
              {value === status.value && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
