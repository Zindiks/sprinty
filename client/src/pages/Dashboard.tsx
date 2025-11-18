import { useState, useMemo, useEffect } from "react";
import { usePersonalDashboard, useBoardAnalytics } from "../hooks/useAnalytics";
import { useStore } from "../hooks/store/useStore";
import { useDashboardStore } from "../hooks/store/useDashboardStore";
import { useLayoutStore } from "../hooks/store/useLayoutStore";
import { useDefaultLayout, useUpdateLayout, useCreateLayout } from "../hooks/useDashboardLayouts";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  LayoutDashboard,
  LineChart,
  Calendar,
  Target,
  Layout,
} from "lucide-react";
import { OverdueCardsWidget } from "@/components/dashboard/OverdueCardsWidget";
import { UpcomingDueDatesWidget } from "@/components/dashboard/UpcomingDueDatesWidget";

// Import new widget components
import ProductivityTrendChart from "../components/dashboard/widgets/ProductivityTrendChart";
import BoardsOverviewWidget from "../components/dashboard/widgets/BoardsOverviewWidget";
import WeeklyCompletionWidget from "../components/dashboard/widgets/WeeklyCompletionWidget";
import MonthlyCompletionWidget from "../components/dashboard/widgets/MonthlyCompletionWidget";
import VelocityChart from "../components/dashboard/widgets/VelocityChart";
import DashboardFilters from "../components/dashboard/DashboardFilters";
import QuickFilterButtons from "../components/dashboard/QuickFilterButtons";
import DashboardGrid from "../components/dashboard/customizable/DashboardGrid";
import { filterAndSortTasks } from "../utils/filterTasks";
import { layoutTemplates } from "../components/dashboard/customizable/layoutTemplates";

type TabType = "overview" | "trends" | "boards" | "sprint" | "custom";

const Dashboard = () => {
  const { organization_id, board_id } = useStore();
  const { filters } = useDashboardStore();
  const { widgets, setWidgets, isEditMode, setEditMode } = useLayoutStore();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Dashboard layouts hooks
  const { data: defaultLayout } = useDefaultLayout();
  const updateLayoutMutation = useUpdateLayout();
  const createLayoutMutation = useCreateLayout();

  const { data: personalDashboard, isLoading: loadingPersonal } =
    usePersonalDashboard(organization_id);
  const { data: boardAnalytics, isLoading: loadingBoard } = useBoardAnalytics(board_id);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    if (!personalDashboard?.recentTasks) return [];
    return filterAndSortTasks(personalDashboard.recentTasks, filters);
  }, [personalDashboard?.recentTasks, filters]);

  // Load default layout or initialize with default template
  useEffect(() => {
    if (defaultLayout && defaultLayout.widgets) {
      setWidgets(defaultLayout.widgets);
    } else if (widgets.length === 0) {
      // Initialize with default template if no widgets
      setWidgets(layoutTemplates.default.widgets);
    }
  }, [defaultLayout]);

  const COLORS = {
    primary: "#3b82f6",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    purple: "#8b5cf6",
    cyan: "#06b6d4",
  };

  const handleExportBoard = () => {
    if (!board_id) return;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
    window.open(`${API_URL}/api/v1/reports/board/${board_id}`, "_blank");
  };

  const handleExportTimeTracking = () => {
    if (!board_id) return;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
    window.open(`${API_URL}/api/v1/reports/time-tracking?boardId=${board_id}`, "_blank");
  };

  if (!organization_id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Please select an organization to view the dashboard</p>
      </div>
    );
  }

  // Handler for saving custom layout
  const handleSaveLayout = async () => {
    try {
      if (defaultLayout) {
        // Update existing default layout
        await updateLayoutMutation.mutateAsync({
          layoutId: defaultLayout.id,
          input: { widgets },
        });
      } else {
        // Create new default layout
        await createLayoutMutation.mutateAsync({
          name: "My Custom Dashboard",
          widgets,
          is_default: true,
        });
      }
      setEditMode(false);
    } catch (error) {
      console.error("Failed to save layout:", error);
    }
  };

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: LayoutDashboard },
    { id: "custom" as TabType, label: "Custom", icon: Layout },
    { id: "trends" as TabType, label: "Trends", icon: LineChart },
    { id: "boards" as TabType, label: "Boards", icon: Target },
    { id: "sprint" as TabType, label: "Sprint Analytics", icon: Calendar },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard & Analytics</h1>
          <p className="text-gray-600 mt-2">Track your progress and team performance</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Filters and Quick Actions - Show only on Overview tab */}
        {activeTab === "overview" && (
          <>
            <QuickFilterButtons />
            <div className="mt-4">
              <DashboardFilters />
            </div>
          </>
        )}

        {/* Loading State */}
        {(loadingPersonal || loadingBoard) && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Due Date Widgets */}
        {board_id && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <OverdueCardsWidget boardId={board_id} />
            <UpcomingDueDatesWidget boardId={board_id} />
          </div>
        )}

        {/* Tab Content */}
        {!loadingPersonal && (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Personal Stats Cards */}
                {personalDashboard && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Assigned Cards</p>
                          <p className="text-2xl font-bold text-gray-900 mt-2">
                            {personalDashboard.stats.assignedCards}
                          </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                          <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Completed</p>
                          <p className="text-2xl font-bold text-green-600 mt-2">
                            {personalDashboard.stats.completedCards}
                          </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Due Soon</p>
                          <p className="text-2xl font-bold text-yellow-600 mt-2">
                            {personalDashboard.stats.dueSoon}
                          </p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                          <AlertCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Overdue</p>
                          <p className="text-2xl font-bold text-red-600 mt-2">
                            {personalDashboard.stats.overdue}
                          </p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                          <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Board Analytics */}
                {board_id && boardAnalytics && (
                  <>
                    {/* Stats Overview */}
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Board Statistics</h2>
                        <div className="flex gap-2">
                          <button
                            onClick={handleExportBoard}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            <Download className="w-4 h-4" />
                            Export Board CSV
                          </button>
                          <button
                            onClick={handleExportTimeTracking}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                          >
                            <Download className="w-4 h-4" />
                            Export Time Logs
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600">Total Cards</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">
                            {boardAnalytics.stats.totalCards}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600">Completed</p>
                          <p className="text-3xl font-bold text-green-600 mt-2">
                            {boardAnalytics.stats.completedCards}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                          <p className="text-3xl font-bold text-blue-600 mt-2">
                            {boardAnalytics.stats.completionRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      {/* Charts */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Cards by Status */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Cards by Status
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={boardAnalytics.stats.cardsByStatus}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="status" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="count" fill={COLORS.primary} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Cards by Priority */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Cards by Priority
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={boardAnalytics.stats.cardsByPriority}
                                dataKey="count"
                                nameKey="priority"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                              >
                                {boardAnalytics.stats.cardsByPriority.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      entry.priority === "critical"
                                        ? COLORS.danger
                                        : entry.priority === "high"
                                          ? COLORS.warning
                                          : entry.priority === "medium"
                                            ? COLORS.primary
                                            : COLORS.success
                                    }
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Time Tracking Summary */}
                    {boardAnalytics.timeTracking.logCount > 0 && (
                      <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                          Time Tracking Summary
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-600">Total Hours</p>
                            <p className="text-3xl font-bold text-purple-600 mt-2">
                              {boardAnalytics.timeTracking.totalHours.toFixed(1)}h
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-600">Total Logs</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                              {boardAnalytics.timeTracking.logCount}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-600">Contributors</p>
                            <p className="text-3xl font-bold text-cyan-600 mt-2">
                              {boardAnalytics.timeTracking.byUser.length}
                            </p>
                          </div>
                        </div>

                        {/* Time by User */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Time Logged by User
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={boardAnalytics.timeTracking.byUser}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="userEmail" />
                              <YAxis
                                label={{ value: "Hours", angle: -90, position: "insideLeft" }}
                              />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="totalHours" fill={COLORS.purple} name="Hours" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Recent Activity */}
                    {boardAnalytics.activityTimeline.length > 0 && (
                      <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {boardAnalytics.activityTimeline.slice(0, 15).map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                            >
                              <div className="flex-shrink-0">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {activity.card_title}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {activity.action_type.replace(/_/g, " ")}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {activity.user_email} •{" "}
                                  {new Date(activity.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Assigned Tasks */}
                {personalDashboard && personalDashboard.recentTasks.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Your Assigned Tasks</h2>
                      <span className="text-sm text-gray-500">
                        Showing {filteredTasks.length} of {personalDashboard.recentTasks.length}{" "}
                        tasks
                      </span>
                    </div>
                    {filteredTasks.length > 0 ? (
                      <div className="space-y-4">
                        {filteredTasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3">
                                <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    task.priority === "critical"
                                      ? "bg-red-100 text-red-800"
                                      : task.priority === "high"
                                        ? "bg-orange-100 text-orange-800"
                                        : task.priority === "medium"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {task.priority}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {task.board_title} / {task.list_title}
                              </p>
                              {task.due_date && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Due: {new Date(task.due_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            {task.status && (
                              <span className="ml-4 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                {task.status}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <p>No tasks match the current filters.</p>
                        <p className="text-sm mt-2">
                          Try adjusting your filters to see more results.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Empty State */}
                {!board_id && !loadingPersonal && (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <p className="text-gray-500 text-lg">
                      Select a board to view detailed analytics and insights
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Trends Tab */}
            {activeTab === "trends" && (
              <div className="space-y-8">
                <ProductivityTrendChart organizationId={organization_id} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <WeeklyCompletionWidget organizationId={organization_id} />
                  <MonthlyCompletionWidget organizationId={organization_id} />
                </div>
              </div>
            )}

            {/* Boards Tab */}
            {activeTab === "boards" && (
              <div className="space-y-8">
                <BoardsOverviewWidget organizationId={organization_id} />
              </div>
            )}

            {/* Custom Dashboard Tab */}
            {activeTab === "custom" && (
              <div className="space-y-8">
                <DashboardGrid
                  widgets={widgets}
                  onWidgetsChange={setWidgets}
                  onSave={handleSaveLayout}
                  isEditing={isEditMode}
                />
              </div>
            )}

            {/* Sprint Analytics Tab */}
            {activeTab === "sprint" && (
              <div className="space-y-8">
                {board_id ? (
                  <VelocityChart boardId={board_id} />
                ) : (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <p className="text-gray-500 text-lg">Select a board to view sprint analytics</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
