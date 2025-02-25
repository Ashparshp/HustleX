import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  BarChart2,
  TrendingUp,
  Award,
  Calendar,
  Check,
  X,
  Info,
} from "lucide-react";

const GoalStats = ({ stats }) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
        <p>Add more goals and track your participation to see analytics.</p>
      </div>
    );
  }

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
            activeTab === "platforms"
              ? isDark
                ? "border-b-2 border-indigo-500 text-white"
                : "border-b-2 border-indigo-600 text-gray-900"
              : isDark
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("platforms")}
        >
          Platforms
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "trends"
              ? isDark
                ? "border-b-2 border-indigo-500 text-white"
                : "border-b-2 border-indigo-600 text-gray-900"
              : isDark
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("trends")}
        >
          Recent Trends
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
                    Total Goals
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.total}
                  </div>
                </div>

                <div>
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Participation Rate
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.participation_rate
                      ? stats.participation_rate.toFixed(1) + "%"
                      : "0%"}
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {stats.participated} / {stats.total} goals
                  </div>
                </div>

                <div>
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Best Rank Achieved
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.best_rank || "N/A"}
                  </div>
                </div>

                <div>
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Average Rank
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.average_rank
                      ? Math.round(stats.average_rank)
                      : "N/A"}
                  </div>
                </div>

                {stats.average_solve_rate !== null && (
                  <div>
                    <div
                      className={`text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Average Solve Rate
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {(stats.average_solve_rate * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Platform distribution visualization */}
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
                Platform Distribution
              </h3>

              <div className="space-y-2">
                {Object.keys(stats.platforms).length > 0 ? (
                  Object.entries(stats.platforms).map(([platform, data]) => (
                    <div key={platform}>
                      <div className="flex justify-between mb-1">
                        <span
                          className={`text-sm font-medium ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {platform}
                        </span>
                        <span
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {data.participated} / {data.total} (
                          {Math.round((data.participated / data.total) * 100)}
                          %)
                        </span>
                      </div>
                      <div
                        className={`h-2 w-full rounded-full mb-3 ${
                          isDark ? "bg-gray-600" : "bg-gray-200"
                        }`}
                      >
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{
                            width: `${(data.total / stats.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className={`text-center py-6 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No platform data available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Platforms Tab */}
        {activeTab === "platforms" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.keys(stats.platforms).length > 0 ? (
              Object.entries(stats.platforms).map(([platform, data]) => (
                <div
                  key={platform}
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <h3
                    className={`text-lg font-medium mb-3 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {platform}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Total Goals
                      </span>
                      <span
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {data.total}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Participated
                      </span>
                      <span
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {data.participated} (
                        {Math.round((data.participated / data.total) * 100)}
                        %)
                      </span>
                    </div>

                    {data.best_rank && (
                      <div className="flex justify-between">
                        <span
                          className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Best Rank
                        </span>
                        <span
                          className={`font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {data.best_rank}
                        </span>
                      </div>
                    )}

                    {data.avg_rank && (
                      <div className="flex justify-between">
                        <span
                          className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Average Rank
                        </span>
                        <span
                          className={`font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {data.avg_rank}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div
                className={`col-span-full text-center py-8 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No platform data available
              </div>
            )}
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === "trends" && (
          <div>
            <h3
              className={`text-lg font-medium mb-3 flex items-center ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <TrendingUp size={20} className="mr-2" />
              Recent Performance
            </h3>

            {stats.recent_trend && stats.recent_trend.length > 0 ? (
              <div
                className={`rounded-lg overflow-hidden border ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div
                  className={`overflow-x-auto ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead
                      className={`${isDark ? "bg-gray-700" : "bg-gray-50"}`}
                    >
                      <tr>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            isDark
                              ? "text-gray-300 uppercase tracking-wider"
                              : "text-gray-500 uppercase tracking-wider"
                          }`}
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            isDark
                              ? "text-gray-300 uppercase tracking-wider"
                              : "text-gray-500 uppercase tracking-wider"
                          }`}
                        >
                          Platform
                        </th>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            isDark
                              ? "text-gray-300 uppercase tracking-wider"
                              : "text-gray-500 uppercase tracking-wider"
                          }`}
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            isDark
                              ? "text-gray-300 uppercase tracking-wider"
                              : "text-gray-500 uppercase tracking-wider"
                          }`}
                        >
                          Rank
                        </th>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            isDark
                              ? "text-gray-300 uppercase tracking-wider"
                              : "text-gray-500 uppercase tracking-wider"
                          }`}
                        >
                          Solved
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        isDark ? "divide-gray-700" : "divide-gray-200"
                      }`}
                    >
                      {stats.recent_trend.map((goal, index) => (
                        <tr
                          key={index}
                          className={isDark ? "bg-gray-800" : "bg-white"}
                        >
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              isDark ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            {goal.name}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              isDark ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            {goal.platform}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {formatDate(goal.date)}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              isDark ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            {goal.rank || "N/A"}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              isDark ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            {goal.solved && goal.totalProblems
                              ? `${goal.solved}/${
                                  goal.totalProblems
                                } (${Math.round(
                                  (goal.solved / goal.totalProblems) * 100
                                )}%)`
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div
                className={`text-center py-10 rounded-lg ${
                  isDark
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <p>No recent participation data available.</p>
                <p className="mt-2 text-sm">
                  Participate in more competitions to see your trends.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalStats;
