import React from "react";
import { motion } from "framer-motion";
import {
  BarChart2,
  Clock,
  Target,
  CheckCircle,
  ThumbsUp,
  Tag,
  TrendingUp,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const WorkingHoursStats = ({ stats }) => {
  const { isDark } = useTheme();

  // Helper to get color classes based on completion percentage
  const getCompletionColorClass = (percentage) => {
    if (percentage >= 90) {
      return isDark ? "text-green-400" : "text-green-600";
    } else if (percentage >= 75) {
      return isDark ? "text-lime-400" : "text-lime-600";
    } else if (percentage >= 50) {
      return isDark ? "text-yellow-400" : "text-yellow-600";
    } else if (percentage >= 25) {
      return isDark ? "text-orange-400" : "text-orange-600";
    } else {
      return isDark ? "text-red-400" : "text-red-600";
    }
  };

  // Calculate efficiency percentage
  const efficiency =
    stats.totalTargetHours > 0
      ? (stats.totalAchievedHours / stats.totalTargetHours) * 100
      : 0;

  return (
    <div className="max-h-[80vh] overflow-y-auto pr-1 custom-scrollbar">
      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Average Completion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-lg p-5 border shadow-sm ${
              isDark
                ? "bg-gray-900/70 border-indigo-500/30"
                : "bg-white/90 border-indigo-300/50"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3
                className={`text-lg font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Target
                    className={getCompletionColorClass(stats.averageCompletion)}
                    size={18}
                  />
                  <span className="text-base">Average Completion</span>
                </div>
              </h3>
              <div
                className={`p-1.5 rounded-lg ${
                  isDark
                    ? "bg-indigo-500/10 border border-indigo-500/30"
                    : "bg-indigo-100/50 border border-indigo-300/50"
                }`}
              >
                <Calendar
                  className={isDark ? "text-indigo-400" : "text-indigo-600"}
                  size={16}
                />
              </div>
            </div>
            <p
              className={`text-3xl font-bold ${getCompletionColorClass(
                stats.averageCompletion
              )}`}
            >
              {stats.averageCompletion
                ? stats.averageCompletion.toFixed(1)
                : "0"}
              %
            </p>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Across {stats.totalDays || 0} days
            </p>
          </motion.div>

          {/* Total Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-lg p-5 border shadow-sm ${
              isDark
                ? "bg-gray-900/70 border-indigo-500/30"
                : "bg-white/90 border-indigo-300/50"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3
                className={`text-lg font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock
                    className={isDark ? "text-blue-400" : "text-blue-600"}
                    size={18}
                  />
                  <span className="text-base">Hours Overview</span>
                </div>
              </h3>
              <div
                className={`p-1.5 rounded-lg ${
                  efficiency >= 80
                    ? isDark
                      ? "bg-green-500/10 border border-green-500/30"
                      : "bg-green-100/50 border border-green-300/50"
                    : isDark
                    ? "bg-red-500/10 border border-red-500/30"
                    : "bg-red-100/50 border border-red-300/50"
                }`}
              >
                <TrendingUp
                  className={
                    efficiency >= 80
                      ? isDark
                        ? "text-green-400"
                        : "text-green-600"
                      : isDark
                      ? "text-red-400"
                      : "text-red-600"
                  }
                  size={16}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-3 gap-2">
              <div className="text-center flex-1 p-2 rounded-lg border-b-2 border-indigo-500">
                <p
                  className={`text-xs mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Target
                </p>
                <p
                  className={`text-lg font-semibold ${
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  }`}
                >
                  {stats.totalTargetHours?.toFixed(1) || "0"}h
                </p>
              </div>
              <div className="text-center flex-1 p-2 rounded-lg border-b-2 border-blue-500">
                <p
                  className={`text-xs mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Achieved
                </p>
                <p
                  className={`text-lg font-semibold ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {stats.totalAchievedHours?.toFixed(1) || "0"}h
                </p>
              </div>
              <div className="text-center flex-1 p-2 rounded-lg border-b-2 border-purple-500">
                <p
                  className={`text-xs mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Efficiency
                </p>
                <p
                  className={`text-lg font-semibold ${getCompletionColorClass(
                    efficiency
                  )}`}
                >
                  {efficiency.toFixed(1)}%
                </p>
              </div>
            </div>
          </motion.div>

          {/* Mood Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-lg p-5 border shadow-sm ${
              isDark
                ? "bg-gray-900/70 border-indigo-500/30"
                : "bg-white/90 border-indigo-300/50"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3
                className={`text-lg font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ThumbsUp
                    className={isDark ? "text-purple-400" : "text-purple-600"}
                    size={18}
                  />
                  <span className="text-base">Mood Distribution</span>
                </div>
              </h3>
              <div
                className={`p-1.5 rounded-lg ${
                  isDark
                    ? "bg-indigo-500/10 border border-indigo-500/30"
                    : "bg-indigo-100/50 border border-indigo-300/50"
                }`}
              >
                <CheckCircle
                  className={isDark ? "text-indigo-400" : "text-indigo-600"}
                  size={16}
                />
              </div>
            </div>

            <div className="space-y-3 mt-3">
              {Object.entries(stats.moodDistribution || {}).length > 0 ? (
                Object.entries(stats.moodDistribution || {}).map(
                  ([mood, count]) => (
                    <div
                      key={mood}
                      className="flex justify-between items-center"
                    >
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getMoodColorClass(
                          mood,
                          isDark
                        )}`}
                      >
                        {mood}
                      </span>
                      <span
                        className={`font-medium text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {count} day{count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )
                )
              ) : (
                <div className="flex items-center justify-center py-4 gap-2">
                  <AlertTriangle
                    size={16}
                    className={isDark ? "text-yellow-400" : "text-yellow-600"}
                  />
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    No mood data available
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-lg p-5 border shadow-sm ${
            isDark
              ? "bg-gray-900/70 border-indigo-500/30"
              : "bg-white/90 border-indigo-300/50"
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <h3
              className={`text-lg font-medium ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Tag
                  className={isDark ? "text-indigo-400" : "text-indigo-600"}
                  size={18}
                />
                <span className="text-base">Category Breakdown</span>
              </div>
            </h3>
          </div>

          <div className="space-y-4 mt-3">
            {Object.entries(stats.categoryBreakdown || {}).length > 0 ? (
              Object.entries(stats.categoryBreakdown || {}).map(
                ([category, hours]) => (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`font-medium text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            isDark
                              ? "bg-indigo-500/10 text-indigo-300"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {((hours / stats.totalAchievedHours) * 100).toFixed(
                            1
                          )}
                          %
                        </span>
                        <span
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {hours.toFixed(1)}h
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200/50 rounded-full h-2 dark:bg-gray-700/50">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(hours / stats.totalAchievedHours) * 100}%`,
                        }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={`${getCategoryProgressColor(
                          category,
                          isDark
                        )} rounded-full`}
                        style={{ height: "8px" }}
                      ></motion.div>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="flex items-center gap-2 text-center justify-center py-6 px-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <AlertTriangle
                  size={18}
                  className={isDark ? "text-yellow-400" : "text-yellow-600"}
                />
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  No category data available
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`rounded-lg py-4 px-5 border text-center shadow-sm ${
            isDark
              ? "bg-gray-900/70 border-indigo-500/30"
              : "bg-white/90 border-indigo-300/50"
          }`}
        >
          <p
            className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}
          >
            <span className="font-medium">Summary:</span> You've tracked{" "}
            {stats.totalDays || 0} total day{stats.totalDays !== 1 ? "s" : ""}{" "}
            with {stats.totalAchievedHours?.toFixed(1) || "0"} hours achieved
            out of {stats.totalTargetHours?.toFixed(1) || "0"} target hours.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Helper functions for styling
const getMoodColorClass = (mood, isDark) => {
  const moodColors = {
    Productive: isDark
      ? "bg-green-500/10 text-green-400 border border-green-500/30"
      : "bg-green-100/70 text-green-700 border border-green-300/50",
    Normal: isDark
      ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
      : "bg-blue-100/70 text-blue-700 border border-blue-300/50",
    Distracted: isDark
      ? "bg-red-500/10 text-red-400 border border-red-500/30"
      : "bg-red-100/70 text-red-700 border border-red-300/50",
  };

  return (
    moodColors[mood] ||
    (isDark
      ? "bg-gray-500/10 text-gray-400 border border-gray-500/30"
      : "bg-gray-100/70 text-gray-700 border border-gray-300/50")
  );
};

const getCategoryProgressColor = (category, isDark) => {
  const categoryColors = {
    Coding: isDark ? "bg-blue-500" : "bg-blue-600",
    Learning: isDark ? "bg-green-500" : "bg-green-600",
    "Project Work": isDark ? "bg-purple-500" : "bg-purple-600",
    Development: isDark ? "bg-indigo-500" : "bg-indigo-600",
    Research: isDark ? "bg-amber-500" : "bg-amber-600",
    Meeting: isDark ? "bg-pink-500" : "bg-pink-600",
    Planning: isDark ? "bg-teal-500" : "bg-teal-600",
    Other: isDark ? "bg-gray-500" : "bg-gray-600",
  };

  return (
    categoryColors[category] || (isDark ? "bg-indigo-500" : "bg-indigo-600")
  );
};

export default WorkingHoursStats;
