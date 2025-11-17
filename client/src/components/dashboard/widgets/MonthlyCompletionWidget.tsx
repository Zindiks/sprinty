import { useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMonthlyMetrics } from "../../../hooks/useAnalytics";
import { Calendar, TrendingUp } from "lucide-react";

interface MonthlyCompletionWidgetProps {
  organizationId: string;
}

const MonthlyCompletionWidget = ({ organizationId }: MonthlyCompletionWidgetProps) => {
  const [monthsBack, setMonthsBack] = useState(6);
  const [viewMode, setViewMode] = useState<"overview" | "breakdown">("overview");
  const { data: metrics, isLoading } = useMonthlyMetrics(organizationId, monthsBack);

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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Trends
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No monthly metrics available
        </div>
      </div>
    );
  }

  // Calculate totals
  const totals = metrics.reduce(
    (acc, month) => ({
      created: acc.created + month.cardsCreated,
      completed: acc.completed + month.cardsCompleted,
      timeSpent: acc.timeSpent + month.timeSpentHours,
    }),
    { created: 0, completed: 0, timeSpent: 0 }
  );

  // Format data for overview chart
  const overviewData = metrics.map((month) => ({
    month: month.month,
    monthName: month.monthName.split(" ")[0],
    created: month.cardsCreated,
    completed: month.cardsCompleted,
    timeSpent: month.timeSpentHours,
  }));

  // Get latest month for breakdown
  const latestMonth = metrics[metrics.length - 1];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Trends
          </h3>
        </div>

        <div className="flex gap-2">
          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("overview")}
              className={`px-3 py-1.5 text-sm ${
                viewMode === "overview"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode("breakdown")}
              className={`px-3 py-1.5 text-sm border-l ${
                viewMode === "breakdown"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Breakdown
            </button>
          </div>

          {/* Month selector */}
          <select
            value={monthsBack}
            onChange={(e) => setMonthsBack(Number(e.target.value))}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={3}>Last 3 months</option>
            <option value={6}>Last 6 months</option>
            <option value={12}>Last 12 months</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
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
          <p className="text-xl font-bold text-purple-600">
            {totals.timeSpent.toFixed(1)}h
          </p>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <p className="text-xs text-gray-600">Avg Completion</p>
          <p className="text-xl font-bold text-orange-600">
            {metrics.length > 0
              ? (totals.completed / metrics.length).toFixed(0)
              : 0}
            /mo
          </p>
        </div>
      </div>

      {/* Chart */}
      {viewMode === "overview" ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={overviewData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="created"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="Created"
            />
            <Area
              type="monotone"
              dataKey="completed"
              stackId="2"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Completed"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            {latestMonth.monthName} - Weekly Breakdown
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={latestMonth.weeklyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weekNumber" label={{ value: "Week", position: "insideBottom" }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="cardsCompleted"
                stroke="#10b981"
                strokeWidth={2}
                name="Cards Completed"
              />
              <Line
                type="monotone"
                dataKey="timeSpentHours"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Hours"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Boards Table */}
      {latestMonth.topBoards && latestMonth.topBoards.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <h4 className="text-sm font-semibold text-gray-900">
              Top Boards - {latestMonth.monthName}
            </h4>
          </div>
          <div className="space-y-2">
            {latestMonth.topBoards.slice(0, 5).map((board, index) => (
              <div
                key={board.boardId}
                className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs font-semibold text-gray-500 w-6">
                    #{index + 1}
                  </span>
                  <span className="text-sm text-gray-900 truncate">
                    {board.boardTitle}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600 font-semibold">
                    {board.cardsCompleted} cards
                  </span>
                  <span className="text-purple-600 font-semibold">
                    {board.timeSpentHours.toFixed(1)}h
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyCompletionWidget;
