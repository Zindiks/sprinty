import { useState } from 'react';
import { Bell, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReminders, type CreateReminder } from '@/hooks/useReminders';
import { formatDueDateDisplay } from '@/lib/dateUtils';
import { DateTime } from 'luxon';

interface ReminderSectionProps {
  cardId: string;
  userId: string;
  dueDate?: string;
}

export const ReminderSection = ({ cardId, userId, dueDate }: ReminderSectionProps) => {
  const { reminders, isLoading, createReminder, deleteReminder } = useReminders(cardId);
  const [selectedType, setSelectedType] = useState<'24h' | '1h' | 'custom'>('24h');

  const handleCreateReminder = () => {
    if (!dueDate) {
      return;
    }

    const due = DateTime.fromISO(dueDate);
    let reminderTime: string;

    if (selectedType === '24h') {
      reminderTime = due.minus({ hours: 24 }).toISO() || '';
    } else if (selectedType === '1h') {
      reminderTime = due.minus({ hours: 1 }).toISO() || '';
    } else {
      // For custom, default to 2 hours before
      reminderTime = due.minus({ hours: 2 }).toISO() || '';
    }

    const reminderData: CreateReminder = {
      card_id: cardId,
      user_id: userId,
      reminder_time: reminderTime,
      reminder_type: selectedType,
    };

    createReminder.mutate(reminderData);
  };

  const handleDeleteReminder = (reminderId: string) => {
    deleteReminder.mutate(reminderId);
  };

  const getReminderLabel = (type: string) => {
    switch (type) {
      case '24h':
        return '24 hours before';
      case '1h':
        return '1 hour before';
      case 'custom':
        return 'Custom time';
      default:
        return type;
    }
  };

  if (!dueDate) {
    return <div className="text-sm text-muted-foreground">Set a due date to add reminders</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Select
          value={selectedType}
          onValueChange={(value: '24h' | '1h' | 'custom') => setSelectedType(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select reminder time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">24 hours before</SelectItem>
            <SelectItem value="1h">1 hour before</SelectItem>
            <SelectItem value="custom">Custom time</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={handleCreateReminder} disabled={createReminder.isPending}>
          <Bell className="h-4 w-4 mr-1" />
          Add Reminder
        </Button>
      </div>

      {isLoading && <div className="text-sm text-muted-foreground">Loading reminders...</div>}

      {!isLoading && reminders.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Active Reminders:</p>
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between p-2 rounded border bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <span className="font-medium">{getReminderLabel(reminder.reminder_type)}</span>
                  <span className="text-muted-foreground ml-2">
                    ({formatDueDateDisplay(reminder.reminder_time)})
                  </span>
                </div>
                {reminder.sent && (
                  <Badge variant="secondary" className="text-xs">
                    Sent
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteReminder(reminder.id)}
                disabled={deleteReminder.isPending}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {!isLoading && reminders.length === 0 && (
        <div className="text-sm text-muted-foreground">No reminders set for this card</div>
      )}
    </div>
  );
};
