// src/components/Contests/ContestStats.jsx
import { motion } from "framer-motion";
import {
  Trophy,
  Award,
  BarChart2,
  Target,
  Hash,
  Calendar,
  CheckSquare,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { formatDisplayDate } from "../../utils/dateUtils";

const ContestStats = ({ stats }) => {
  const { isDark } = useTheme();

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle
          size={48}
          className={isDark ? "text-gray-500" : "text-gray-400"}
        />
        <p className={`mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          No statistics available
        </p>
      </div>
    );
  }

  const platforms = stats.platforms || {};
  const recentTrend = stats.recent_trend || [];

  const statCardClass = `rounded-lg p-4 ${
    isDark ? "bg-gray-700" : "bg-gray-100"
  }`;

  const headingClass = `text-lg font-medium mb-3 flex items-center gap-2 ${
    isDark ? "text-white" : "text-gray-900"
  }`;

  // Get platform color
  const getPlatformColor = (platform) => {
    const platformColors = {
      LeetCode: isDark
        ? "text-yellow-400 bg-yellow-900/30"
        : "text-yellow-600 bg-yellow-100",
      CodeChef: isDark
        ? "text-blue-400 bg-blue-900/30"
        : "text-blue-600 bg-blue-100",
      CodeForces: isDark
        ? "text-red-400 bg-red-900/30"
        : "text-red-600 bg-red-100",
      HackerRank: isDark
        ? "text-green-400 bg-green-900/30"
        : "text-green-600 bg-green-100",
      AtCoder: isDark
        ? "text-purple-400 bg-purple-900/30"
        : "text-purple-600 bg-purple-100",
      TopCoder: isDark
        ? "text-orange-400 bg-orange-900/30"
        : "text-orange-600 bg-orange-100",
    };

    return (
      platformColors[platform] ||
      (isDark ? "text-gray-400 bg-gray-700" : "text-gray-600 bg-gray-100")
    );
  };

  // Calculate participation rate
  const participationRate =
    stats.total > 0 ? Math.round((stats.participated / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Participation Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={statCardClass}
        >
          <h3 className={headingClass}>
            <CheckSquare
              className={isDark ? "text-purple-400" : "text-purple-600"}
            />
            Participation
          </h3>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Total Contests
              </span>
              <span className="font-semibold">{stats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Participated
              </span>
              <span className="font-semibold">{stats.participated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Participation Rate
              </span>
              <span
                className={`font-semibold ${
                  participationRate >= 70
                    ? isDark
                      ? "text-green-400"
                      : "text-green-600"
                    : participationRate >= 40
                    ? isDark
                      ? "text-yellow-400"
                      : "text-yellow-600"
                    : isDark
                    ? "text-red-400"
                    : "text-red-600"
                }`}
              >
                {participationRate}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600 mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${participationRate}%` }}
                transition={{ duration: 0.5 }}
                className={`h-2 rounded-full ${
                  participationRate >= 70
                    ? isDark
                      ? "bg-green-500"
                      : "bg-green-600"
                    : participationRate >= 40
                    ? isDark
                      ? "bg-yellow-500"
                      : "bg-yellow-600"
                    : isDark
                    ? "bg-red-500"
                    : "bg-red-600"
                }`}
              />
            </div>
          </div>
        </motion.div>

        {/* Ranking Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={statCardClass}
        >
          <h3 className={headingClass}>
            <Trophy className={isDark ? "text-amber-400" : "text-amber-600"} />
            Rankings
          </h3>
          <div className="flex flex-col space-y-2">
            {stats.best_rank ? (
              <>
                <div className="flex justify-between items-center">
                  <span
                    className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Best Rank
                  </span>
                  <span
                    className={`font-semibold ${
                      isDark ? "text-amber-400" : "text-amber-600"
                    }`}
                  >
                    {stats.best_rank}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Average Rank
                  </span>
                  <span className="font-semibold">{stats.average_rank}</span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-6">
                <span
                  className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  No ranking data available
                </span>
              </div>
            )}

            {stats.average_solve_rate !== null && (
              <div className="flex justify-between items-center">
                <span
                  className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Avg. Solve Rate
                </span>
                <span
                  className={`font-semibold ${
                    stats.average_solve_rate >= 0.7
                      ? isDark
                        ? "text-green-400"
                        : "text-green-600"
                      : stats.average_solve_rate >= 0.4
                      ? isDark
                        ? "text-yellow-400"
                        : "text-yellow-600"
                      : isDark
                      ? "text-red-400"
                      : "text-red-600"
                  }`}
                >
                  {Math.round(stats.average_solve_rate * 100)}%
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Platform Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={statCardClass}
        >
          <h3 className={headingClass}>
            <Hash className={isDark ? "text-indigo-400" : "text-indigo-600"} />
            Platform Breakdown
          </h3>
          <div className="flex flex-col space-y-2 max-h-32 overflow-y-auto">
            {Object.keys(platforms).length > 0 ? (
              Object.entries(platforms).map(([platform, data]) => (
                <div
                  key={platform}
                  className="flex justify-between items-center"
                >
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${getPlatformColor(
                      platform
                    )}`}
                  >
                    {platform}
                  </span>
                  <span className="font-semibold">
                    {data.participated}/{data.total}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-2">
                <span
                  className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  No platform data
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Trend */}
      {recentTrend && recentTrend.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={statCardClass}
        >
          <h3 className={headingClass}>
            <BarChart2 className={isDark ? "text-blue-400" : "text-blue-600"} />
            Recent Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th
                    className={`text-left text-xs font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Date
                  </th>
                  <th
                    className={`text-left text-xs font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Contest
                  </th>
                  <th
                    className={`text-left text-xs font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Platform
                  </th>
                  <th
                    className={`text-left text-xs font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Rank
                  </th>
                  <th
                    className={`text-left text-xs font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Solved
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentTrend.map((contest, index) => (
                  <tr key={index}>
                    <td
                      className={`py-2 text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {formatDisplayDate(contest.date)}
                    </td>
                    <td
                      className={`py-2 text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {contest.name}
                    </td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${getPlatformColor(
                          contest.platform
                        )}`}
                      >
                        {contest.platform}
                      </span>
                    </td>
                    <td
                      className={`py-2 text-sm font-medium ${
                        isDark ? "text-amber-400" : "text-amber-600"
                      }`}
                    >
                      {contest.rank || "-"}
                    </td>
                    <td className="py-2">
                      {contest.solved && contest.totalProblems ? (
                        <span
                          className={`text-sm ${
                            isDark ? "text-green-400" : "text-green-600"
                          }`}
                        >
                          {contest.solved}/{contest.totalProblems}
                        </span>
                      ) : (
                        <span className="text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`${statCardClass} text-center`}
      >
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          <span className="font-medium">Summary:</span> You've participated in{" "}
          {stats.participated} out of {stats.total} contests
          {stats.best_rank ? ` with a best rank of ${stats.best_rank}` : ""}.
        </p>
      </motion.div>
    </div>
  );
};

export default ContestStats;
