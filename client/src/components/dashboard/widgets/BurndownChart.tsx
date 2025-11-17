import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSprintBurndown } from "../../../hooks/useAnalytics";
import { TrendingDown } from "lucide-react";

interface BurndownChartProps {
  sprintId: string;
}

const BurndownChart = ({ sprintId }: BurndownChartProps) => {
  const { data: burndown, isLoading } = useSprintBurndown(sprintId);

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

  if (!burndown) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sprint Burndown
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No burndown data available
        </div>
      </div>
    );
  }

  // Merge burndown data with ideal line
  const chartData = burndown.idealLine.map((idealPoint) => {
    const actualPoint = burndown.burndownData.find(
      (bd) => bd.date === idealPoint.date
    );
    return {
      date: idealPoint.date,
      ideal: idealPoint.ideal,
      actual: actualPoint?.remaining ?? null,
      completed: actualPoint?.completed ?? 0,
    };
  });

  // Calculate sprint progress
  const totalCards = burndown.totalCards;
  const remainingCards =
    burndown.burndownData.length > 0
      ? burndown.burndownData[burndown.burndownData.length - 1].remaining
      : totalCards;
  const completedCards = totalCards - remainingCards;
  const progress = totalCards > 0 ? (completedCards / totalCards) * 100 : 0;

  // Calculate days remaining
  const startDate = new Date(burndown.sprint.startDate);
  const endDate = new Date(burndown.sprint.endDate);
  const today = new Date();
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysElapsed = Math.ceil(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysRemaining = Math.max(0, totalDays - daysElapsed);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Sprint Burndown
            </h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">{burndown.sprint.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Sprint Status</p>
          <span
            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
              burndown.sprint.status === "active"
                ? "bg-green-100 text-green-800"
                : burndown.sprint.status === "completed"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {burndown.sprint.status}
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">Total Cards</p>
          <p className="text-xl font-bold text-blue-600">{totalCards}</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-gray-600">Completed</p>
          <p className="text-xl font-bold text-green-600">{completedCards}</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-xs text-gray-600">Remaining</p>
          <p className="text-xl font-bold text-red-600">{remainingCards}</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-xs text-gray-600">Days Left</p>
          <p className="text-xl font-bold text-purple-600">{daysRemaining}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Sprint Progress</span>
          <span className="font-semibold">{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis label={{ value: "Cards Remaining", angle: -90, position: "insideLeft" }} />
          <Tooltip
            labelFormatter={(value) => {
              const date = new Date(value as string);
              return date.toLocaleDateString();
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="ideal"
            stroke="#94a3b8"
            strokeDasharray="5 5"
            name="Ideal Burndown"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#ef4444"
            name="Actual Burndown"
            strokeWidth={3}
            dot={{ r: 4 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Sprint Timeline */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-gray-600">Start Date</p>
            <p className="font-semibold text-gray-900">
              {new Date(burndown.sprint.startDate).toLocaleDateString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Duration</p>
            <p className="font-semibold text-gray-900">{totalDays} days</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">End Date</p>
            <p className="font-semibold text-gray-900">
              {new Date(burndown.sprint.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurndownChart;
