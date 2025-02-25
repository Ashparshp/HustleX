import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  BarChart2,
  PieChart,
  TrendingUp,
  Clock,
  CheckCircle,
  Info,
  Calendar,
} from "lucide-react";

const ScheduleStats = ({ stats }) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  // If no stats available
  if (!stats) {
    return (
      <div
        className={`text-center p-8 rounded-lg ${
          isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
        }`}
      >
        <Info size={36} className="mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No statistics available</h3>
        <p>Add more schedules and track your activities to see analytics.</p>
      </div>
    );
  }

  // Calculate percentage
  const calculatePercentage = (value, total) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  // Get color for completion rate
  const getCompletionColor = (rate) => {
    if (rate >= 80) {
      return isDark ? "text-green-400" : "text-green-600";
    } else if (rate >= 50) {
      return isDark ? "text-yellow-400" : "text-yellow-600";
    } else {
      return isDark ? "text-red-400" : "text-red-600";
    }
  };

  // Format hours
  const formatHours = (hours) => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} min`;
    }
    return `${hours.toFixed(1)} hrs`;
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "overview"
              ? isDark
                ? "border-b-2 border-indigo-500 text-white"
                : "border-b-2 border-indigo-600 text-gray-900"
              : isDark
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "categories"
              ? isDark
                ? "border-b-2 border-indigo-500 text-white"
                : "border-b-2 border-indigo-600 text-gray-900"
              : isDark
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "time"
              ? isDark
                ? "border-b-2 border-indigo-500 text-white"
                : "border-b-2 border-indigo-600 text-gray-900"
              : isDark
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("time")}
        >
          Time Analysis
        </button>
      </div>

      {/* Tab contents */}
      <div className="pt-2">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Summary cards */}
            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <h3
                className={`text-lg font-medium mb-3 flex items-center ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <BarChart2 size={20} className="mr-2" />
                Summary
              </h3>

              <div className="space-y-4">
                <div>
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Total Schedules
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.total}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-opacity-20 rounded-lg p-2 text-center bg-gray-500">
                    <div
                      className={`text-xs font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Planned
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stats.planned}
                    </div>
                    <div className="text-xs mt-1">
                      {calculatePercentage(stats.planned, stats.total)}%
                    </div>
                  </div>

                  <div className="bg-opacity-20 rounded-lg p-2 text-center bg-blue-500">
                    <div
                      className={`text-xs font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      In Progress
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stats.inProgress}
                    </div>
                    <div className="text-xs mt-1">
                      {calculatePercentage(stats.inProgress, stats.total)}%
                    </div>
                  </div>

                  <div className="bg-opacity-20 rounded-lg p-2 text-center bg-green-500">
                    <div
                      className={`text-xs font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Completed
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stats.completed}
                    </div>
                    <div className="text-xs mt-1">
                      {calculatePercentage(stats.completed, stats.total)}%
                    </div>
                  </div>
                </div>

                <div>
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Total Scheduled Hours
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.totalHours.toFixed(1)}
                  </div>
                </div>

                <div>
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Average Completion Rate
                  </div>
                  <div
                    className={`text-2xl font-bold ${getCompletionColor(
                      stats.averageCompletion
                    )}`}
                  >
                    {stats.averageCompletion.toFixed(1)}%
                  </div>
                  <div
                    className={`mt-1 h-2 w-full rounded-full ${
                      isDark ? "bg-gray-600" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`h-2 rounded-full ${
                        stats.averageCompletion >= 80
                          ? "bg-green-500"
                          : stats.averageCompletion >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${stats.averageCompletion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status visualization */}
            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <h3
                className={`text-lg font-medium mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Completion Status
              </h3>

              {/* Visual chart placeholder */}
              <div className="relative pt-2">
                <div className="flex h-48 justify-center items-center">
                  <div className="relative w-40 h-40">
                    {/* Completed segment */}
                    <div
                      className="absolute inset-0 bg-green-500 rounded-full"
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${
                          50 +
                          50 *
                            Math.cos(
                              ((stats.completed / stats.total) *
                                360 *
                                Math.PI) /
                                180
                            )
                        }% ${
                          50 -
                          50 *
                            Math.sin(
                              ((stats.completed / stats.total) *
                                360 *
                                Math.PI) /
                                180
                            )
                        }%)`,
                      }}
                    ></div>

                    {/* In Progress segment */}
                    <div
                      className="absolute inset-0 bg-blue-500 rounded-full"
                      style={{
                        clipPath: `polygon(50% 50%, ${
                          50 +
                          50 *
                            Math.cos(
                              ((stats.completed / stats.total) *
                                360 *
                                Math.PI) /
                                180
                            )
                        }% ${
                          50 -
                          50 *
                            Math.sin(
                              ((stats.completed / stats.total) *
                                360 *
                                Math.PI) /
                                180
                            )
                        }%, ${
                          50 +
                          50 *
                            Math.cos(
                              (((stats.completed + stats.inProgress) /
                                stats.total) *
                                360 *
                                Math.PI) /
                                180
                            )
                        }% ${
                          50 -
                          50 *
                            Math.sin(
                              (((stats.completed + stats.inProgress) /
                                stats.total) *
                                360 *
                                Math.PI) /
                                180
                            )
                        }%)`,
                      }}
                    ></div>

                    {/* Planned segment */}
                    <div
                      className="absolute inset-0 bg-gray-500 rounded-full"
                      style={{
                        clipPath: `polygon(50% 50%, ${
                          50 +
                          50 *
                            Math.cos(
                              (((stats.completed + stats.inProgress) /
                                stats.total) *
                                360 *
                                Math.PI) /
                                180
                            )
                        }% ${
                          50 -
                          50 *
                            Math.sin(
                              (((stats.completed + stats.inProgress) /
                                stats.total) *
                                360 *
                                Math.PI) /
                                180
                            )
                        }%, ${50 + 50}% ${50}%)`,
                      }}
                    ></div>

                    {/* Center circle */}
                    <div className="absolute inset-0 w-20 h-20 m-auto rounded-full bg-gray-800 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {stats.total} schedules
                      </span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex justify-center mt-4 space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                    <span
                      className={`text-xs ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Completed
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                    <span
                      className={`text-xs ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      In Progress
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-500 mr-1"></div>
                    <span
                      className={`text-xs ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Planned
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div>
            <h3
              className={`text-lg font-medium mb-3 flex items-center ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <PieChart size={20} className="mr-2" />
              Category Breakdown
            </h3>

            {Object.keys(stats.categories).length === 0 ? (
              <div
                className={`p-6 text-center rounded-lg ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <p>No category data available.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {Object.entries(stats.categories).map(([category, data]) => (
                  <div
                    key={category}
                    className={`p-4 rounded-lg ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {category}
                      </h4>
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {formatHours(data.totalHours)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div
                          className={`text-xs mb-1 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Total Items
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {data.totalItems}
                        </div>
                      </div>
                      <div>
                        <div
                          className={`text-xs mb-1 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Completion Rate
                        </div>
                        <div
                          className={`text-lg font-bold ${getCompletionColor(
                            data.completionRate
                          )}`}
                        >
                          {data.completionRate.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div
                      className={`h-2 w-full rounded-full ${
                        isDark ? "bg-gray-600" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`h-2 rounded-full ${
                          data.completionRate >= 80
                            ? "bg-green-500"
                            : data.completionRate >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${data.completionRate}%` }}
                      ></div>
                    </div>

                    <div
                      className={`mt-2 text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {data.completedItems} of {data.totalItems} items completed
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Time Analysis Tab */}
        {activeTab === "time" && (
          <div>
            <h3
              className={`text-lg font-medium mb-3 flex items-center ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <Clock size={20} className="mr-2" />
              Time Allocation
            </h3>

            {Object.keys(stats.categories).length === 0 ? (
              <div
                className={`p-6 text-center rounded-lg ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <p>No time allocation data available.</p>
              </div>
            ) : (
              <div>
                <div
                  className={`p-4 rounded-lg mb-4 ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Total Hours by Category
                    </h4>
                    <div
                      className={`text-sm font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stats.totalHours.toFixed(1)} hrs total
                    </div>
                  </div>

                  {/* Stacked bar visualization */}
                  <div className="h-8 w-full rounded-full overflow-hidden flex">
                    {Object.entries(stats.categories)
                      .sort((a, b) => b[1].totalHours - a[1].totalHours)
                      .map(([category, data], index) => {
                        // Generate colors based on index
                        const colors = [
                          "bg-blue-500",
                          "bg-green-500",
                          "bg-yellow-500",
                          "bg-purple-500",
                          "bg-red-500",
                          "bg-indigo-500",
                          "bg-pink-500",
                          "bg-teal-500",
                        ];
                        const color = colors[index % colors.length];

                        const percentage =
                          (data.totalHours / stats.totalHours) * 100;
                        return (
                          <div
                            key={category}
                            className={`h-full ${color}`}
                            style={{ width: `${percentage}%` }}
                            title={`${category}: ${formatHours(
                              data.totalHours
                            )} (${percentage.toFixed(1)}%)`}
                          ></div>
                        );
                      })}
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {Object.entries(stats.categories)
                      .sort((a, b) => b[1].totalHours - a[1].totalHours)
                      .map(([category, data], index) => {
                        const colors = [
                          "bg-blue-500",
                          "bg-green-500",
                          "bg-yellow-500",
                          "bg-purple-500",
                          "bg-red-500",
                          "bg-indigo-500",
                          "bg-pink-500",
                          "bg-teal-500",
                        ];
                        const color = colors[index % colors.length];
                        const percentage =
                          (data.totalHours / stats.totalHours) * 100;

                        return (
                          <div key={category} className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full ${color} mr-2`}
                            ></div>
                            <div className="flex-grow min-w-0">
                              <div className="flex justify-between">
                                <span
                                  className={`text-xs truncate mr-2 ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }`}
                                >
                                  {category}
                                </span>
                                <span
                                  className={`text-xs whitespace-nowrap ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }`}
                                >
                                  {formatHours(data.totalHours)} (
                                  {percentage.toFixed(1)}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Hours per schedule metric */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-lg ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <h4
                      className={`text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Average Hours Per Schedule
                    </h4>
                    <div
                      className={`text-2xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {(stats.totalHours / stats.total).toFixed(1)}
                    </div>
                    <div
                      className={`mt-1 text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      hours scheduled per day
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <h4
                      className={`text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Average Tasks Per Schedule
                    </h4>
                    <div
                      className={`text-2xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {(
                        Object.values(stats.categories).reduce(
                          (sum, cat) => sum + cat.totalItems,
                          0
                        ) / stats.total
                      ).toFixed(1)}
                    </div>
                    <div
                      className={`mt-1 text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      items per day
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleStats;
