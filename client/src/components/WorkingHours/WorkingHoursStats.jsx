// src/components/WorkingHours/WorkingHoursStats.jsx
import { useTheme } from "../../context/ThemeContext";
import {
  BarChart2,
  Clock,
  Target,
  CheckCircle,
  ThumbsUp,
  Tag,
} from "lucide-react";

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

  const statCardClass = `rounded-lg p-4 ${
    isDark ? "bg-gray-700" : "bg-gray-100"
  }`;

  const headingClass = `text-lg font-medium mb-3 flex items-center gap-2 ${
    isDark ? "text-white" : "text-gray-900"
  }`;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average Completion */}
        <div className={statCardClass}>
          <h3 className={headingClass}>
            <Target size={20} />
            Average Completion
          </h3>
          <p
            className={`text-3xl font-bold ${getCompletionColorClass(
              stats.averageCompletion
            )}`}
          >
            {stats.averageCompletion.toFixed(1)}%
          </p>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Across {stats.totalDays || 0} days
          </p>
        </div>

        {/* Total Hours */}
        <div className={statCardClass}>
          <h3 className={headingClass}>
            <Clock size={20} />
            Hours Overview
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Target
              </p>
              <p className="text-xl font-semibold">
                {stats.totalTargetHours?.toFixed(1) || 0}h
              </p>
            </div>
            <div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Achieved
              </p>
              <p className="text-xl font-semibold">
                {stats.totalAchievedHours?.toFixed(1) || 0}h
              </p>
            </div>
            <div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Efficiency
              </p>
              <p
                className={`text-xl font-semibold ${getCompletionColorClass(
                  efficiency
                )}`}
              >
                {efficiency.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className={statCardClass}>
          <h3 className={headingClass}>
            <ThumbsUp size={20} />
            Mood Distribution
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.moodDistribution || {}).map(
              ([mood, count]) => (
                <div key={mood} className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getMoodColorClass(
                      mood,
                      isDark
                    )}`}
                  >
                    {mood}
                  </span>
                  <span
                    className={`font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {count} days
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className={statCardClass}>
        <h3 className={headingClass}>
          <Tag size={20} />
          Category Breakdown
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.categoryBreakdown || {}).length > 0 ? (
            Object.entries(stats.categoryBreakdown).map(([category, hours]) => (
              <div key={category}>
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {category}
                  </span>
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {hours.toFixed(1)} hours
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className={getCategoryProgressColor(category, isDark)}
                    style={{
                      width: `${(
                        (hours / stats.totalAchievedHours) *
                        100
                      ).toFixed(1)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No category data available.
            </p>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className={`${statCardClass} text-center`}>
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {stats.totalDays || 0} total days tracked with{" "}
          {stats.totalAchievedHours?.toFixed(1) || 0} hours achieved out of{" "}
          {stats.totalTargetHours?.toFixed(1) || 0} target hours.
        </p>
      </div>
    </div>
  );
};

// Helper functions for styling
const getMoodColorClass = (mood, isDark) => {
  const moodColors = {
    Productive: isDark
      ? "bg-green-900/30 text-green-300"
      : "bg-green-100 text-green-800",
    Normal: isDark
      ? "bg-blue-900/30 text-blue-300"
      : "bg-blue-100 text-blue-800",
    Distracted: isDark
      ? "bg-red-900/30 text-red-300"
      : "bg-red-100 text-red-800",
  };

  return (
    moodColors[mood] ||
    (isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-800")
  );
};

const getCategoryProgressColor = (category, isDark) => {
  const categoryColors = {
    Coding: isDark ? "bg-blue-500" : "bg-blue-600",
    Learning: isDark ? "bg-green-500" : "bg-green-600",
    "Project Work": isDark ? "bg-purple-500" : "bg-purple-600",
    Other: isDark ? "bg-gray-500" : "bg-gray-600",
  };

  return (
    categoryColors[category] || (isDark ? "bg-indigo-500" : "bg-indigo-600")
  );
};

export default WorkingHoursStats;
