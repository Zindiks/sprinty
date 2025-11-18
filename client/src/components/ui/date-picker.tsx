import * as React from 'react';
import { Calendar as CalendarIcon, Clock, X } from 'lucide-react';
import { DateTime } from 'luxon';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatDueDateDisplay, toISOString, parseISOToDate } from '@/lib/dateUtils';

interface DatePickerProps {
  date?: string | Date;
  onDateChange: (date: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  showTime?: boolean;
  showQuickPresets?: boolean;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = 'Select due date',
  disabled = false,
  showTime = true,
  showQuickPresets = true,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date ? (typeof date === 'string' ? parseISOToDate(date) : date) : undefined,
  );
  const [timeString, setTimeString] = React.useState<string>(() => {
    if (date) {
      const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
      return dt.toFormat('HH:mm');
    }
    return '17:00'; // Default to 5 PM
  });

  // Quick preset dates
  const quickPresets = React.useMemo(() => {
    const now = DateTime.now();
    return [
      {
        label: 'Today 5PM',
        date: now.set({ hour: 17, minute: 0, second: 0 }).toJSDate(),
      },
      {
        label: 'Tomorrow 5PM',
        date: now.plus({ days: 1 }).set({ hour: 17, minute: 0, second: 0 }).toJSDate(),
      },
      {
        label: 'In 3 Days',
        date: now.plus({ days: 3 }).set({ hour: 17, minute: 0, second: 0 }).toJSDate(),
      },
      {
        label: 'End of Week',
        date: now.endOf('week').set({ hour: 17, minute: 0, second: 0 }).toJSDate(),
      },
      {
        label: 'Next Monday',
        date: now
          .plus({ weeks: 1 })
          .startOf('week')
          .set({ hour: 9, minute: 0, second: 0 })
          .toJSDate(),
      },
      {
        label: 'End of Month',
        date: now.endOf('month').set({ hour: 17, minute: 0, second: 0 }).toJSDate(),
      },
    ];
  }, []);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return;

    setSelectedDate(newDate);

    if (showTime) {
      // Apply the current time to the selected date
      const [hours, minutes] = timeString.split(':').map(Number);
      const dt = DateTime.fromJSDate(newDate).set({ hour: hours, minute: minutes });
      onDateChange(toISOString(dt.toJSDate()));
    } else {
      // Set to end of day
      const dt = DateTime.fromJSDate(newDate).endOf('day');
      onDateChange(toISOString(dt.toJSDate()));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeString(newTime);

    if (selectedDate) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const dt = DateTime.fromJSDate(selectedDate).set({ hour: hours, minute: minutes });
      onDateChange(toISOString(dt.toJSDate()));
    }
  };

  const handleQuickPreset = (presetDate: Date) => {
    setSelectedDate(presetDate);
    const dt = DateTime.fromJSDate(presetDate);
    onDateChange(toISOString(dt.toJSDate()));
    setOpen(false);
  };

  const handleClear = () => {
    setSelectedDate(undefined);
    onDateChange(null);
    setOpen(false);
  };

  // Sync external date changes
  React.useEffect(() => {
    if (date) {
      const newDate = typeof date === 'string' ? parseISOToDate(date) : date;
      setSelectedDate(newDate);
      const dt = DateTime.fromJSDate(newDate);
      setTimeString(dt.toFormat('HH:mm'));
    } else {
      setSelectedDate(undefined);
    }
  }, [date]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground',
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? formatDueDateDisplay(selectedDate) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-3">
          {showQuickPresets && (
            <>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Quick Presets</Label>
                <div className="grid grid-cols-3 gap-2">
                  {quickPresets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickPreset(preset.date)}
                      className="h-8 text-xs"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />

          {showTime && (
            <>
              <Separator />
              <div className="space-y-2 px-1">
                <Label htmlFor="time" className="text-xs font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={timeString}
                  onChange={handleTimeChange}
                  className="h-8"
                />
              </div>
            </>
          )}

          {selectedDate && (
            <>
              <Separator />
              <div className="flex justify-between items-center px-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-8 text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
                <Button size="sm" onClick={() => setOpen(false)} className="h-8">
                  Done
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
