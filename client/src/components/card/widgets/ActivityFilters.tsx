import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter, X } from 'lucide-react';
import type { ActivityActionType } from '@/types/types';
import type { ActivityFilters as Filters } from '@/hooks/useActivities';
import { cn } from '@/lib/utils';

interface ActivityFiltersProps {
  onFiltersChange: (filters: Filters) => void;
  activeFilters: Filters;
}

const ACTION_TYPE_LABELS: Record<ActivityActionType, string> = {
  created: 'Created',
  updated: 'Updated',
  moved: 'Moved',
  archived: 'Archived',
  assignee_added: 'Assignee Added',
  assignee_removed: 'Assignee Removed',
  label_added: 'Label Added',
  label_removed: 'Label Removed',
  comment_added: 'Comment Added',
  attachment_added: 'Attachment Added',
  checklist_item_added: 'Checklist Item Added',
  checklist_item_completed: 'Checklist Item Completed',
  due_date_set: 'Due Date Set',
  due_date_changed: 'Due Date Changed',
  due_date_removed: 'Due Date Removed',
  priority_changed: 'Priority Changed',
  description_changed: 'Description Changed',
  title_changed: 'Title Changed',
};

export const ActivityFilters = ({ onFiltersChange, activeFilters }: ActivityFiltersProps) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Filters>(activeFilters);

  const hasActiveFilters = activeFilters.action_type !== undefined;

  const handleActionTypeToggle = (actionType: ActivityActionType) => {
    const newFilters = {
      ...localFilters,
      action_type: localFilters.action_type === actionType ? undefined : actionType,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const newFilters = {};
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn('h-8 gap-2', hasActiveFilters && 'border-primary bg-primary/10')}
          >
            <Filter className="w-3 h-3" />
            Filter
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center text-xs">
                1
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filter Activities</h4>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-7 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Action Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Action Type</label>
              <div className="grid grid-cols-1 gap-1 max-h-64 overflow-y-auto">
                {(Object.entries(ACTION_TYPE_LABELS) as [ActivityActionType, string][]).map(
                  ([actionType, label]) => (
                    <button
                      key={actionType}
                      onClick={() => handleActionTypeToggle(actionType)}
                      className={cn(
                        'text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent',
                        localFilters.action_type === actionType &&
                          'bg-primary/10 text-primary font-medium',
                      )}
                    >
                      {label}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filter Tags */}
      {activeFilters.action_type && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
          <span>{ACTION_TYPE_LABELS[activeFilters.action_type]}</span>
          <button
            onClick={() => onFiltersChange({ ...activeFilters, action_type: undefined })}
            className="hover:bg-primary/20 rounded p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
