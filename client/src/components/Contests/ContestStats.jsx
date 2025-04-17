 
import { useState } from "react";
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
  TrendingUp,
  Users,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { formatDisplayDate } from "../../utils/dateUtils";

const ContestStats = ({ stats }) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("recent");

  if (!stats) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col items-center justify-center py-8 rounded-lg border ${
          isDark
            ? "bg-black border-purple-500/30 text-gray-400"
            : "bg-white border-purple-300/50 text-gray-600"
        }`}
      >
        <AlertCircle
          size={36}
          className={isDark ? "text-gray-700" : "text-gray-300"}
        />
        <p className="mt-3 text-center px-4">
          No statistics available. Participate in coding contests to see your
          performance here.
        </p>
      </motion.div>
    );
  }

  const platforms = stats.platforms || {};
  const recentTrend = stats.recent_trend || [];

  
  const participationRate =
    stats.total > 0 ? Math.round((stats.participated / stats.total) * 100) : 0;

  
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
      (isDark ? "text-gray-400 bg-gray-800/50" : "text-gray-600 bg-gray-100")
    );
  };

  
  const getPerformanceColor = (value, thresholds) => {
    const { high, medium } = thresholds;
    if (value >= high) {
      return isDark ? "text-green-400" : "text-green-600";
    } else if (value >= medium) {
      return isDark ? "text-yellow-400" : "text-yellow-600";
    } else {
      return isDark ? "text-red-400" : "text-red-600";
    }
  };

  const statCardClass = `rounded-lg p-4 relative overflow-hidden transition-all duration-300 border ${
    isDark
      ? "bg-black border-purple-500/30 hover:border-purple-400/60"
      : "bg-white border-purple-300/50 hover:border-purple-500/60"
  }`;

  const headingClass = `text-base font-semibold flex items-center gap-2 mb-3 ${
    isDark ? "text-white" : "text-gray-800"
  }`;

  return (
    <div className="space-y-4">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={statCardClass}
          whileHover={{ translateY: -3 }}
        >
          <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden opacity-10">
            <CheckSquare
              className={`text-purple-500 absolute right-0 rotate-12 transform opacity-20 -top-4 h-20 w-20`}
            />
          </div>

          <h3 className={headingClass}>
            <CheckSquare
              className={isDark ? "text-purple-400" : "text-purple-600"}
              size={18}
            />
            Participation
          </h3>

          <div className="flex flex-col space-y-3 relative z-10">
            <div className="flex justify-between items-center">
              <span
                className={`${
                  isDark ? "text-gray-300" : "text-gray-700"
                } text-sm`}
              >
                Total Contests
              </span>
              <span
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.total}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span
                className={`${
                  isDark ? "text-gray-300" : "text-gray-700"
                } text-sm`}
              >
                Participated
              </span>
              <span
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.participated}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span
                className={`${
                  isDark ? "text-gray-300" : "text-gray-700"
                } text-sm`}
              >
                Participation Rate
              </span>
              <span
                className={`font-semibold ${getPerformanceColor(
                  participationRate,
                  { high: 70, medium: 40 }
                )}`}
              >
                {participationRate}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mt-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${participationRate}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={statCardClass}
          whileHover={{ translateY: -3 }}
        >
          <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden opacity-10">
            <Trophy
              className={`text-amber-500 absolute right-0 rotate-12 transform opacity-20 -top-4 h-20 w-20`}
            />
          </div>

          <h3 className={headingClass}>
            <Trophy
              className={isDark ? "text-amber-400" : "text-amber-600"}
              size={18}
            />
            Rankings
          </h3>

          <div className="flex flex-col space-y-3 relative z-10">
            {stats.best_rank ? (
              <>
                <div className="flex justify-between items-center">
                  <span
                    className={`${
                      isDark ? "text-gray-300" : "text-gray-700"
                    } flex items-center gap-1 text-sm`}
                  >
                    <Award size={14} /> Best Rank
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
                    className={`${
                      isDark ? "text-gray-300" : "text-gray-700"
                    } flex items-center gap-1 text-sm`}
                  >
                    <Users size={14} /> Average Rank
                  </span>
                  <span
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.average_rank}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-4">
                <span
                  className={`${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } text-sm`}
                >
                  No ranking data available
                </span>
              </div>
            )}

            {stats.average_solve_rate !== null && (
              <div className="flex justify-between items-center">
                <span
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } flex items-center gap-1 text-sm`}
                >
                  <Target size={14} /> Avg. Solve Rate
                </span>
                <span
                  className={`font-semibold ${getPerformanceColor(
                    stats.average_solve_rate * 100,
                    { high: 70, medium: 40 }
                  )}`}
                >
                  {Math.round(stats.average_solve_rate * 100)}%
                </span>
              </div>
            )}
          </div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={statCardClass}
          whileHover={{ translateY: -3 }}
        >
          <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden opacity-10">
            <Hash
              className={`text-indigo-500 absolute right-0 rotate-12 transform opacity-20 -top-4 h-20 w-20`}
            />
          </div>

          <h3 className={headingClass}>
            <Hash
              className={isDark ? "text-indigo-400" : "text-indigo-600"}
              size={18}
            />
            Platform Breakdown
          </h3>

          <div className="flex flex-col space-y-2 max-h-32 overflow-y-auto pr-1 relative z-10">
            {Object.keys(platforms).length > 0 ? (
              Object.entries(platforms).map(([platform, data]) => {
                const participationRate =
                  data.total > 0
                    ? Math.round((data.participated / data.total) * 100)
                    : 0;
                return (
                  <div
                    key={platform}
                    className="flex justify-between items-center"
                  >
                    <span
                      className={`px-1.5 py-0.5 text-xs rounded-md font-medium ${getPlatformColor(
                        platform
                      )}`}
                    >
                      {platform}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {data.participated}/{data.total}
                      </span>
                      <div className="w-12 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                        <div
                          className={`h-1.5 rounded-full ${
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
                          style={{ width: `${participationRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center py-3">
                <span
                  className={`${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } text-sm`}
                >
                  No platform data available
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      
      {recentTrend && recentTrend.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={statCardClass}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className={headingClass.replace("mb-3", "")}>
              <BarChart2
                className={isDark ? "text-blue-400" : "text-blue-600"}
                size={18}
              />
              Performance Tracker
            </h3>

            <div
              className={`flex rounded-md overflow-hidden border ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <button
                onClick={() => setActiveTab("recent")}
                className={`px-2 py-1 text-xs font-medium transition-colors ${
                  activeTab === "recent"
                    ? isDark
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-purple-100 text-purple-700"
                    : isDark
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setActiveTab("trend")}
                className={`px-2 py-1 text-xs font-medium transition-colors ${
                  activeTab === "trend"
                    ? isDark
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-purple-100 text-purple-700"
                    : isDark
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Trends
              </button>
            </div>
          </div>

          {/* Recent Contests Table */}
          {activeTab === "recent" && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr
                    className={
                      isDark
                        ? "border-b border-gray-800"
                        : "border-b border-gray-200"
                    }
                  >
                    <th
                      className={`text-left py-2 px-2 font-medium text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Date
                    </th>
                    <th
                      className={`text-left py-2 px-2 font-medium text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Contest
                    </th>
                    <th
                      className={`text-left py-2 px-2 font-medium text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Platform
                    </th>
                    <th
                      className={`text-left py-2 px-2 font-medium text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Rank
                    </th>
                    <th
                      className={`text-left py-2 px-2 font-medium text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Solved
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDark ? "divide-gray-800" : "divide-gray-200"
                  }`}
                >
                  {recentTrend.map((contest, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      className={`${
                        isDark ? "hover:bg-gray-900/50" : "hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td
                        className={`py-2 px-2 text-xs ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="opacity-70" />
                          {formatDisplayDate(contest.date)}
                        </div>
                      </td>
                      <td
                        className={`py-2 px-2 text-xs font-medium ${
                          isDark ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {contest.name}
                      </td>
                      <td className="py-2 px-2">
                        <span
                          className={`px-1.5 py-0.5 text-xs rounded-md font-medium ${getPlatformColor(
                            contest.platform
                          )}`}
                        >
                          {contest.platform}
                        </span>
                      </td>
                      <td
                        className={`py-2 px-2 text-xs font-medium ${
                          isDark ? "text-amber-400" : "text-amber-600"
                        } flex items-center gap-1`}
                      >
                        <Trophy size={12} />
                        {contest.rank || "-"}
                      </td>
                      <td className="py-2 px-2">
                        {contest.solved && contest.totalProblems ? (
                          <span
                            className={`text-xs ${
                              isDark ? "text-green-400" : "text-green-600"
                            } flex items-center gap-1`}
                          >
                            <CheckSquare size={12} />
                            {contest.solved}/{contest.totalProblems}
                          </span>
                        ) : (
                          <span className="text-xs">-</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Trends View */}
          {activeTab === "trend" && (
            <div className="h-48 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp
                  size={28}
                  className={
                    isDark
                      ? "text-gray-600 mx-auto mb-2"
                      : "text-gray-400 mx-auto mb-2"
                  }
                />
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Trend analysis will be available soon
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Keep participating in contests to see your performance trends
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`${statCardClass} text-center py-4`}
      >
        <div className="flex justify-center items-center gap-2 mb-1">
          <Award
            className={isDark ? "text-purple-400" : "text-purple-600"}
            size={18}
          />
          <h3
            className={`text-base font-medium ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Performance Summary
          </h3>
        </div>
        <p
          className={`${
            isDark ? "text-gray-300" : "text-gray-600"
          } max-w-3xl mx-auto text-sm`}
        >
          You've participated in{" "}
          <span className="font-semibold">{stats.participated}</span> out of{" "}
          <span className="font-semibold">{stats.total}</span> contests
          {stats.best_rank ? ` with a best rank of ${stats.best_rank}` : ""}.
          {stats.average_solve_rate
            ? ` Your average solve rate is ${Math.round(
                stats.average_solve_rate * 100
              )}%.`
            : ""}
          {Object.keys(platforms).length > 0
            ? ` You're most active on ${
                Object.entries(platforms).sort(
                  (a, b) => b[1].participated - a[1].participated
                )[0][0]
              }.`
            : ""}
        </p>
      </motion.div>
    </div>
  );
};

export default ContestStats;
