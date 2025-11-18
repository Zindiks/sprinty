import { useState } from "react";
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
import { useProductivityTrends } from "../../../hooks/useAnalytics";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ProductivityTrendChartProps {
  organizationId: string;
}

const ProductivityTrendChart = ({ organizationId }: ProductivityTrendChartProps) => {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [daysBack, setDaysBack] = useState(30);

  const { data: trends, isLoading } = useProductivityTrends(organizationId, period, daysBack);

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

  if (!trends || trends.data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Trends</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No trend data available
        </div>
      </div>
    );
  }

  const getTrendIcon = () => {
    switch (trends.summary.trend) {
      case "increasing":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "decreasing":
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trends.summary.trend) {
      case "increasing":
        return "text-green-600";
      case "decreasing":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Productivity Trends</h3>
          <div className="flex items-center gap-2 mt-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {trends.summary.trend.charAt(0).toUpperCase() + trends.summary.trend.slice(1)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as "weekly" | "monthly")}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          <select
            value={daysBack}
            onChange={(e) => setDaysBack(Number(e.target.value))}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Created</p>
          <p className="text-2xl font-bold text-blue-600">{trends.summary.totalCreated}</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Completed</p>
          <p className="text-2xl font-bold text-green-600">{trends.summary.totalCompleted}</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600">Avg per Day</p>
          <p className="text-2xl font-bold text-purple-600">{trends.summary.averagePerPeriod}</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trends.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => {
              const date = new Date(value as string);
              return date.toLocaleDateString();
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="cardsCreated"
            stroke="#3b82f6"
            name="Created"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="cardsCompleted"
            stroke="#10b981"
            name="Completed"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductivityTrendChart;
