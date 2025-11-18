import { useBoardsOverview } from '../../../hooks/useAnalytics';
import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BoardsOverviewWidgetProps {
  organizationId: string;
}

const BoardsOverviewWidget = ({ organizationId }: BoardsOverviewWidgetProps) => {
  const { data: boards, isLoading } = useBoardsOverview(organizationId);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!boards || boards.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Boards Overview</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">No boards found</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Boards I'm Working On</h3>
        <span className="text-sm text-gray-500">
          {boards.length} {boards.length === 1 ? 'board' : 'boards'}
        </span>
      </div>

      {/* Boards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => (
          <div
            key={board.id}
            onClick={() => navigate(`/board/${board.id}`)}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition cursor-pointer"
          >
            {/* Board Title */}
            <h4 className="font-semibold text-gray-900 mb-3 truncate">{board.title}</h4>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-sm font-semibold">{board.totalCards}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 rounded">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Done</p>
                  <p className="text-sm font-semibold">{board.completedCards}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-yellow-100 rounded">
                  <TrendingUp className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">In Progress</p>
                  <p className="text-sm font-semibold">{board.inProgressCards}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-red-100 rounded">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Overdue</p>
                  <p className="text-sm font-semibold">{board.overdueCards}</p>
                </div>
              </div>
            </div>

            {/* Completion Rate Bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Completion Rate</span>
                <span className="font-semibold">{board.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${board.completionRate}%` }}
                ></div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
              <span>Assigned to me: {board.assignedToMeCount}</span>
              {board.lastActivity && (
                <span>
                  Active{' '}
                  {new Date(board.lastActivity).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardsOverviewWidget;
