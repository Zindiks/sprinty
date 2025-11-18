import { useDashboardStore } from '../../hooks/store/useDashboardStore';
import { AlertCircle, Clock, Flame, User } from 'lucide-react';

const QuickFilterButtons = () => {
  const { filters, setDueDateFilter, setStatusFilter, setPriorityFilter, setShowOnlyAssignedToMe } =
    useDashboardStore();

  const quickFilters = [
    {
      id: 'overdue',
      label: 'Overdue',
      icon: AlertCircle,
      color: 'red',
      isActive: filters.dueDate === 'overdue',
      onClick: () => {
        if (filters.dueDate === 'overdue') {
          setDueDateFilter('all');
        } else {
          setDueDateFilter('overdue');
        }
      },
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      icon: Clock,
      color: 'blue',
      isActive: filters.status === 'in_progress',
      onClick: () => {
        if (filters.status === 'in_progress') {
          setStatusFilter('all');
        } else {
          setStatusFilter('in_progress');
        }
      },
    },
    {
      id: 'high_priority',
      label: 'High Priority',
      icon: Flame,
      color: 'orange',
      isActive: filters.priority === 'high' || filters.priority === 'critical',
      onClick: () => {
        if (filters.priority === 'high' || filters.priority === 'critical') {
          setPriorityFilter('all');
        } else {
          setPriorityFilter('high');
        }
      },
    },
    {
      id: 'my_tasks',
      label: 'My Tasks Only',
      icon: User,
      color: 'purple',
      isActive: filters.showOnlyAssignedToMe,
      onClick: () => {
        setShowOnlyAssignedToMe(!filters.showOnlyAssignedToMe);
      },
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {quickFilters.map((filter) => {
        const Icon = filter.icon;
        const baseClasses =
          'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all';

        return (
          <button
            key={filter.id}
            onClick={filter.onClick}
            className={`${baseClasses} ${
              filter.isActive
                ? filter.color === 'red'
                  ? 'bg-red-600 text-white shadow-md hover:bg-red-700'
                  : filter.color === 'blue'
                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                    : filter.color === 'orange'
                      ? 'bg-orange-600 text-white shadow-md hover:bg-orange-700'
                      : 'bg-purple-600 text-white shadow-md hover:bg-purple-700'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

export default QuickFilterButtons;
