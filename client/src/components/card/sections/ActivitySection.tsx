import { useState } from 'react';
import { History } from 'lucide-react';
import { useActivities } from '@/hooks/useActivities';
import type { ActivityFilters as Filters } from '@/hooks/useActivities';
import { ActivityItem } from '../widgets/ActivityItem';
import { ActivityFilters } from '../widgets/ActivityFilters';

interface ActivitySectionProps {
  cardId: string;
}

export const ActivitySection = ({ cardId }: ActivitySectionProps) => {
  const [filters, setFilters] = useState<Filters>({});
  const { activities, isLoading } = useActivities(cardId, filters);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <History className="w-4 h-4" />
          Activity
          {activities && activities.length > 0 && (
            <span className="text-xs text-muted-foreground">({activities.length})</span>
          )}
        </h3>
        <ActivityFilters onFiltersChange={handleFiltersChange} activeFilters={filters} />
      </div>

      {/* Activity Timeline */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : activities && activities.length > 0 ? (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

          {/* Activities */}
          <div className="space-y-0 relative">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic text-center py-8">
          No activity to display
          {Object.keys(filters).length > 0 && ' with current filters'}.
        </p>
      )}
    </div>
  );
};
