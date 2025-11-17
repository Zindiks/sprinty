import { useDueDateAnalytics, type DueDateCard } from "@/hooks/useAnalytics";
import { Clock, Calendar, AlertTriangle } from "lucide-react";
import { formatDueDateDisplay } from "@/lib/dateUtils";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface UpcomingDueDatesWidgetProps {
  boardId: string | null;
}

export const UpcomingDueDatesWidget = ({ boardId }: UpcomingDueDatesWidgetProps) => {
  const { data: analytics, isLoading } = useDueDateAnalytics(boardId);
  const navigate = useNavigate();

  if (!boardId || isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Upcoming Due Dates
        </h2>
        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCardClick = (card: DueDateCard) => {
    navigate(`/board/${boardId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Upcoming Due Dates
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{analytics.summary.dueToday}</p>
          <p className="text-xs text-gray-600">Due Today</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{analytics.summary.dueThisWeek}</p>
          <p className="text-xs text-gray-600">Due This Week</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{analytics.summary.upcoming}</p>
          <p className="text-xs text-gray-600">Future</p>
        </div>
      </div>

      {/* Due Today Cards */}
      {analytics.dueTodayCards.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            Due Today
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {analytics.dueTodayCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className="p-3 border border-yellow-200 bg-yellow-50/50 rounded-lg hover:bg-yellow-100/50 transition cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{card.title}</h4>
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(card.priority)}`}>
                        {card.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{card.list_title}</p>
                    {card.due_date && (
                      <div className="flex items-center gap-1 text-xs text-yellow-700 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDueDateDisplay(card.due_date)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Due Date Cards Info */}
      {analytics.summary.noDueDate > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Cards without due dates</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">{analytics.summary.noDueDate}</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {analytics.summary.dueToday === 0 &&
       analytics.summary.dueThisWeek === 0 &&
       analytics.summary.upcoming === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No upcoming due dates</p>
        </div>
      )}
    </div>
  );
};
