// src/components/Skills/SkillStats.jsx
import React from "react";
import {
  BarChart,
  CheckCircle,
  Clock,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";

const SkillStats = ({ stats, isDark }) => {
  if (!stats) return null;

  // Helper to get color classes based on completion percentage
  const getCompletionColorClass = (percentage) => {
    if (percentage >= 75) {
      return isDark ? "text-green-400" : "text-green-600";
    } else if (percentage >= 50) {
      return isDark ? "text-yellow-400" : "text-yellow-600";
    } else if (percentage >= 25) {
      return isDark ? "text-orange-400" : "text-orange-600";
    } else {
      return isDark ? "text-red-400" : "text-red-600";
    }
  };

  const statCardClass = `rounded-lg p-4 ${
    isDark ? "bg-gray-700" : "bg-gray-100"
  }`;

  const headingClass = `text-lg font-medium mb-3 flex items-center gap-2 ${
    isDark ? "text-white" : "text-gray-900"
  }`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Skills */}
        <div className={statCardClass}>
          <h3 className={headingClass}>
            <BarChart size={20} />
            Total Skills
          </h3>
          <p className="text-3xl font-bold">{stats.total || 0}</p>
        </div>

        {/* Completion Status */}
        <div className={statCardClass}>
          <h3 className={headingClass}>
            <CheckCircle size={20} />
            Completed
          </h3>
          <p
            className={`text-3xl font-bold ${getCompletionColorClass(
              stats.completionRate
            )}`}
          >
            {stats.completed || 0}
          </p>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {stats.completionRate?.toFixed(1) || 0}% completion rate
          </p>
        </div>

        {/* In Progress */}
        <div className={statCardClass}>
          <h3 className={headingClass}>
            <Clock size={20} />
            In Progress
          </h3>
          <p className="text-3xl font-bold">{stats.inProgress || 0}</p>
        </div>

        {/* Upcoming */}
        <div className={statCardClass}>
          <h3 className={headingClass}>
            <ArrowUpRight size={20} />
            Upcoming
          </h3>
          <p className="text-3xl font-bold">{stats.upcoming || 0}</p>
        </div>
      </div>

      {/* Average Progress */}
      <div className={statCardClass}>
        <h3 className={headingClass}>
          <AlertTriangle size={20} />
          Average Progress
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mb-2">
          <div
            className={`h-4 rounded-full ${
              isDark ? "bg-indigo-500" : "bg-indigo-600"
            }`}
            style={{
              width: `${stats.averageProgress?.toFixed(1) || 0}%`,
            }}
          ></div>
        </div>
        <p
          className={`text-right ${isDark ? "text-gray-300" : "text-gray-700"}`}
        >
          {stats.averageProgress?.toFixed(1) || 0}%
        </p>
      </div>

      {/* Category Distribution */}
      {stats.categoryCounts && Object.keys(stats.categoryCounts).length > 0 && (
        <div className={statCardClass}>
          <h3 className={headingClass}>Category Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryCounts).map(([category, count]) => (
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
                    {count} skill{count !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className={getCategoryProgressColor(category, isDark)}
                    style={{
                      width: `${((count / stats.total) * 100).toFixed(1)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Distribution */}
      <div className={`${statCardClass} text-center`}>
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {stats.total || 0} total skills with {stats.completed || 0} completed,{" "}
          {stats.inProgress || 0} in progress, and {stats.upcoming || 0}{" "}
          upcoming
        </p>
      </div>
    </div>
  );
};

// Helper function for category progress color
const getCategoryProgressColor = (category, isDark) => {
  // Generate a somewhat consistent color based on the category name
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const colorOptions = [
    isDark ? "bg-blue-500" : "bg-blue-600",
    isDark ? "bg-green-500" : "bg-green-600",
    isDark ? "bg-purple-500" : "bg-purple-600",
    isDark ? "bg-red-500" : "bg-red-600",
    isDark ? "bg-yellow-500" : "bg-yellow-600",
    isDark ? "bg-pink-500" : "bg-pink-600",
    isDark ? "bg-indigo-500" : "bg-indigo-600",
    isDark ? "bg-teal-500" : "bg-teal-600",
  ];

  const index = Math.abs(hashCode(category)) % colorOptions.length;
  return colorOptions[index];
};

export default SkillStats;
