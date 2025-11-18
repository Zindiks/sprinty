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
import { useBoardVelocity } from "../../../hooks/useAnalytics";
import { Zap } from "lucide-react";

interface VelocityChartProps {
  boardId: string;
}

const VelocityChart = ({ boardId }: VelocityChartProps) => {
  const { data: velocity, isLoading } = useBoardVelocity(boardId);

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

  if (!velocity || velocity.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sprint Velocity</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No sprint velocity data available
        </div>
      </div>
    );
  }

  // Format data for chart
  const chartData = velocity.map((sprint) => ({
    name: sprint.name,
    completed: parseInt(sprint.cards_completed as string),
    status: sprint.status,
  }));

  // Calculate average velocity
  const avgVelocity =
    chartData.reduce((sum, sprint) => sum + sprint.completed, 0) / chartData.length;

  // Get latest completed sprint velocity
  const completedSprints = chartData.filter((s) => s.status === "completed");
  const latestVelocity =
    completedSprints.length > 0 ? completedSprints[completedSprints.length - 1].completed : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">Sprint Velocity</h3>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-600">Latest Sprint</p>
          <p className="text-2xl font-bold text-yellow-600">{latestVelocity}</p>
          <p className="text-xs text-gray-500">cards</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Average</p>
          <p className="text-2xl font-bold text-blue-600">{avgVelocity.toFixed(1)}</p>
          <p className="text-xs text-gray-500">cards/sprint</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Sprints</p>
          <p className="text-2xl font-bold text-green-600">{chartData.length}</p>
          <p className="text-xs text-gray-500">tracked</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis label={{ value: "Cards Completed", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" fill="#eab308" name="Cards Completed" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Sprint Status Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600">Completed: {completedSprints.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">
            Active: {chartData.filter((s) => s.status === "active").length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span className="text-gray-600">
            Planned: {chartData.filter((s) => s.status === "planned").length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VelocityChart;
