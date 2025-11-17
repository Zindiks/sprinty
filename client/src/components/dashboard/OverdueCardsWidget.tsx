import { useDueDateAnalytics, type DueDateCard } from "@/hooks/useAnalytics";
import { AlertCircle, Calendar } from "lucide-react";
import { formatDueDateDisplay } from "@/lib/dateUtils";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface OverdueCardsWidgetProps {
  boardId: string | null;
}

export const OverdueCardsWidget = ({ boardId }: OverdueCardsWidgetProps) => {
  const { data: analytics, isLoading } = useDueDateAnalytics(boardId);
  const navigate = useNavigate();

  if (!boardId || isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          Overdue Cards
        </h2>
        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        )}
      </div>
    );
  }

  if (!analytics || analytics.summary.overdue === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-green-600" />
          Overdue Cards
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No overdue cards! Great job! 🎉</p>
        </div>
      </div>
    );
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
          <AlertCircle className="w-5 h-5 text-red-600" />
          Overdue Cards
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-3xl font-bold text-red-600">{analytics.summary.overdue}</p>
            <p className="text-xs text-gray-500">Total Overdue</p>
          </div>
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-2xl font-bold text-red-600">{analytics.byPriority.critical}</p>
          <p className="text-xs text-gray-600">Critical</p>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <p className="text-2xl font-bold text-orange-600">{analytics.byPriority.high}</p>
          <p className="text-xs text-gray-600">High</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{analytics.byPriority.medium}</p>
          <p className="text-xs text-gray-600">Medium</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{analytics.byPriority.low}</p>
          <p className="text-xs text-gray-600">Low</p>
        </div>
      </div>

      {/* Overdue Cards List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {analytics.overdueCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className="p-4 border border-red-200 bg-red-50/50 rounded-lg hover:bg-red-100/50 transition cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{card.title}</h3>
                  <Badge variant="destructive" className={`text-xs ${getPriorityColor(card.priority)}`}>
                    {card.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-1">{card.list_title}</p>
                {card.due_date && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <Calendar className="w-3 h-3" />
                    <span>Due: {formatDueDateDisplay(card.due_date)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {analytics.overdueCards.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No overdue cards to display</p>
        </div>
      )}
    </div>
  );
};
