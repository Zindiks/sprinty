import { Filter, ArrowUpDown, Calendar, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { DueDateFilter, SortOption } from '@/hooks/useCardFilters';

interface FilterBarProps {
  dueDateFilter: DueDateFilter;
  sortOption: SortOption;
  onDueDateFilterChange: (filter: DueDateFilter) => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
  stats?: {
    all: number;
    today: number;
    week: number;
    overdue: number;
    none: number;
    upcoming: number;
  };
}

export const FilterBar = ({
  dueDateFilter,
  sortOption,
  onDueDateFilterChange,
  onSortChange,
  onReset,
  stats,
}: FilterBarProps) => {
  const hasActiveFilters = dueDateFilter !== 'all' || sortOption !== 'created_at';

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Due Date Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={dueDateFilter} onValueChange={onDueDateFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by due date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cards {stats && `(${stats.all})`}</SelectItem>
            <SelectItem value="overdue">Overdue {stats && `(${stats.overdue})`}</SelectItem>
            <SelectItem value="today">Due Today {stats && `(${stats.today})`}</SelectItem>
            <SelectItem value="week">Due This Week {stats && `(${stats.week})`}</SelectItem>
            <SelectItem value="upcoming">Upcoming {stats && `(${stats.upcoming})`}</SelectItem>
            <SelectItem value="none">No Due Date {stats && `(${stats.none})`}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <Select value={sortOption} onValueChange={onSortChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Created Date</SelectItem>
            <SelectItem value="due_date">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="title">Title (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filter Badge */}
      {dueDateFilter !== 'all' && (
        <Badge variant="secondary" className="gap-1">
          <Calendar className="h-3 w-3" />
          {getDueDateFilterLabel(dueDateFilter)}
        </Badge>
      )}

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-8 px-2 text-xs">
          <X className="h-3 w-3 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
};

function getDueDateFilterLabel(filter: DueDateFilter): string {
  const labels: Record<DueDateFilter, string> = {
    all: 'All',
    today: 'Today',
    week: 'This Week',
    overdue: 'Overdue',
    none: 'No Due Date',
    upcoming: 'Upcoming',
  };
  return labels[filter];
}
