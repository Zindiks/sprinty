import { Plus, X, BarChart3, Calendar, Target, TrendingUp, Users } from 'lucide-react';
import { WidgetType } from '../../../types/types';

interface WidgetOption {
  type: WidgetType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultSize: { width: number; height: number };
}

interface WidgetGalleryProps {
  onAddWidget: (type: WidgetType, size: { width: number; height: number }) => void;
  isOpen: boolean;
  onClose: () => void;
}

const widgetOptions: WidgetOption[] = [
  {
    type: 'PERSONAL_STATS',
    label: 'Personal Stats',
    description: 'Your assigned cards, completed tasks, and deadlines',
    icon: Users,
    defaultSize: { width: 2, height: 1 },
  },
  {
    type: 'ASSIGNED_TASKS',
    label: 'Assigned Tasks',
    description: 'List of all tasks assigned to you',
    icon: Target,
    defaultSize: { width: 3, height: 2 },
  },
  {
    type: 'PRODUCTIVITY_TREND',
    label: 'Productivity Trends',
    description: 'Track cards created vs completed over time',
    icon: TrendingUp,
    defaultSize: { width: 2, height: 1 },
  },
  {
    type: 'BOARDS_OVERVIEW',
    label: 'Boards Overview',
    description: 'Summary of all your active boards',
    icon: Target,
    defaultSize: { width: 3, height: 2 },
  },
  {
    type: 'WEEKLY_COMPLETION',
    label: 'Weekly Completion',
    description: 'Weekly task completion metrics',
    icon: BarChart3,
    defaultSize: { width: 2, height: 1 },
  },
  {
    type: 'MONTHLY_COMPLETION',
    label: 'Monthly Completion',
    description: 'Monthly task completion trends',
    icon: BarChart3,
    defaultSize: { width: 2, height: 1 },
  },
  {
    type: 'VELOCITY_CHART',
    label: 'Sprint Velocity',
    description: 'Track sprint completion velocity',
    icon: TrendingUp,
    defaultSize: { width: 2, height: 1 },
  },
  {
    type: 'BURNDOWN_CHART',
    label: 'Sprint Burndown',
    description: 'Current sprint burndown chart',
    icon: Calendar,
    defaultSize: { width: 2, height: 1 },
  },
];

const WidgetGallery = ({ onAddWidget, isOpen, onClose }: WidgetGalleryProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Widget</h2>
            <p className="text-sm text-gray-600 mt-1">Choose a widget to add to your dashboard</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Widget Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgetOptions.map((widget) => {
              const Icon = widget.icon;
              return (
                <button
                  key={widget.type}
                  onClick={() => {
                    onAddWidget(widget.type, widget.defaultSize);
                    onClose();
                  }}
                  className="flex flex-col items-start p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{widget.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{widget.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                    <Plus className="w-3 h-3" />
                    <span>Click to add</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetGallery;
