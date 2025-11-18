import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useWeeklyMetrics } from "../../../hooks/useAnalytics";
import { Calendar } from "lucide-react";

interface WeeklyCompletionWidgetProps {
  organizationId: string;
}

const WeeklyCompletionWidget = ({ organizationId }: WeeklyCompletionWidgetProps) => {
  const [weeksBack, setWeeksBack] = useState(4);
  const { data: metrics, isLoading } = useWeeklyMetrics(organizationId, weeksBack);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!metrics || metrics.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Metrics</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No weekly metrics available
        </div>
      </div>
    );
  }

  // Calculate totals
  const totals = metrics.reduce(
    (acc, week) => ({
      created: acc.created + week.cardsCreated,
      completed: acc.completed + week.cardsCompleted,
      timeSpent: acc.timeSpent + week.timeSpentHours,
    }),
    { created: 0, completed: 0, timeSpent: 0 }
  );

  // Format data for chart
  const chartData = metrics.map((week) => ({
    week: `${new Date(week.weekStartDate).getMonth() + 1}/${new Date(week.weekStartDate).getDate()}`,
    created: week.cardsCreated,
    completed: week.cardsCompleted,
    hours: week.timeSpentHours,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Weekly Performance</h3>
        </div>

        {/* Week selector */}
        <select
          value={weeksBack}
          onChange={(e) => setWeeksBack(Number(e.target.value))}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={4}>Last 4 weeks</option>
          <option value={8}>Last 8 weeks</option>
          <option value={12}>Last 12 weeks</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">Total Created</p>
          <p className="text-xl font-bold text-blue-600">{totals.created}</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-gray-600">Total Completed</p>
          <p className="text-xl font-bold text-green-600">{totals.completed}</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-xs text-gray-600">Hours Logged</p>
          <p className="text-xl font-bold text-purple-600">{totals.timeSpent.toFixed(1)}h</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="created" fill="#3b82f6" name="Created" />
          <Bar dataKey="completed" fill="#10b981" name="Completed" />
        </BarChart>
      </ResponsiveContainer>

      {/* Top Boards Table */}
      {metrics[0]?.topBoards && metrics[0].topBoards.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Top Boards This Week</h4>
          <div className="space-y-2">
            {metrics[0].topBoards.map((board, index) => (
              <div
                key={board.boardId}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500">#{index + 1}</span>
                  <span className="text-sm text-gray-900">{board.boardTitle}</span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {board.cardsCompleted} completed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyCompletionWidget;
