import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import {
  Edit2,
  Trash2,
  Calendar,
  Check,
  X,
  Award,
  BarChart2,
  Clock,
  MessageSquare,
} from "lucide-react";

const GoalList = ({ goals, onEdit, onDelete, platforms }) => {
  const { isDark } = useTheme();
  const [expandedGoal, setExpandedGoal] = useState(null);

  // Toggle expanded view for a goal
  const toggleExpand = (id) => {
    if (expandedGoal === id) {
      setExpandedGoal(null);
    } else {
      setExpandedGoal(id);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format duration in hours and minutes
  const formatDuration = (minutes) => {
    if (!minutes) return "Not specified";

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${remainingMinutes} min`;
  };

  // Get platform color class
  const getPlatformColorClass = (platformName) => {
    const colorMap = {
      // Color assignments based on common platforms
      LeetCode: "bg-yellow-500",
      CodeForces: "bg-red-500",
      HackerRank: "bg-green-500",
      CodeChef: "bg-blue-500",
      "Advent of Code": "bg-purple-500",
      GitHub: "bg-gray-500",
      Kaggle: "bg-blue-400",
      HackerEarth: "bg-indigo-500",
      "Google CodeJam": "bg-red-400",
      Other: "bg-gray-400",
    };

    return colorMap[platformName] || "bg-gray-400";
  };

  // Generate progress indicators
  const getProgressIndicator = (goal) => {
    if (!goal.participated) return null;

    if (goal.solved !== null && goal.totalProblems !== null) {
      const percentage = Math.round((goal.solved / goal.totalProblems) * 100);

      return (
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>
              {goal.solved} / {goal.totalProblems} solved
            </span>
            <span>{percentage}%</span>
          </div>
          <div
            className={`h-2 rounded-full ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <div
              className={`h-2 rounded-full ${
                percentage >= 80
                  ? "bg-green-500"
                  : percentage >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      );
    }

    return null;
  };

  // If no goals, show empty state
  if (goals.length === 0) {
    return (
      <div
        className={`text-center py-12 rounded-lg border-2 border-dashed ${
          isDark
            ? "border-gray-700 text-gray-400"
            : "border-gray-300 text-gray-500"
        }`}
      >
        <h3 className="text-lg font-medium mb-2">No goals found</h3>
        <p className="max-w-sm mx-auto mb-6">
          You haven't added any coding goals or competitions yet. Get started by
          adding your first goal!
        </p>

        <div className="flex justify-center space-x-4">
          {platforms.slice(0, 4).map((platform, index) => {
            // Handle both string platforms and object platforms
            const platformName =
              typeof platform === "string" ? platform : platform.name;
            return (
              <div
                key={index}
                className={`w-12 h-12 flex items-center justify-center rounded-full ${getPlatformColorClass(
                  platformName
                )} text-white text-lg font-bold`}
                style={
                  platform.color ? { backgroundColor: platform.color } : {}
                }
              >
                {platformName.substring(0, 2)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <motion.div
          key={goal._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`rounded-lg shadow-md overflow-hidden ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Header */}
          <div
            className={`p-4 flex justify-between items-center border-b ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-md text-white text-sm font-medium ${getPlatformColorClass(
                  goal.platform
                )}`}
              >
                {(typeof goal.platform === "string"
                  ? goal.platform
                  : goal.platform.name
                )
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
              <div className="ml-3">
                <h3
                  className={`font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {goal.platform}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {goal.participated ? "Participated" : "Not participated"}
                </p>
              </div>
            </div>

            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(goal)}
                className={`p-1 rounded-md ${
                  isDark
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(goal._id)}
                className={`p-1 rounded-md ${
                  isDark
                    ? "text-gray-400 hover:text-red-400 hover:bg-gray-700"
                    : "text-gray-500 hover:text-red-500 hover:bg-gray-100"
                }`}
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h2
              className={`text-lg font-semibold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {goal.name}
            </h2>

            <div className="space-y-2">
              {/* Date */}
              <div
                className={`flex items-center text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <Calendar size={16} className="mr-2" />
                {formatDate(goal.date)}
              </div>

              {/* Participation */}
              <div
                className={`flex items-center text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {goal.participated ? (
                  <Check size={16} className="mr-2 text-green-500" />
                ) : (
                  <X size={16} className="mr-2 text-red-500" />
                )}
                {goal.participated ? "Participated" : "Did not participate"}
              </div>

              {/* Duration if specified */}
              {goal.duration && (
                <div
                  className={`flex items-center text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <Clock size={16} className="mr-2" />
                  {formatDuration(goal.duration)}
                </div>
              )}

              {/* Progress indicator */}
              {getProgressIndicator(goal)}

              {/* Rank if participated */}
              {goal.participated && goal.rank && (
                <div
                  className={`flex items-center text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <Award size={16} className="mr-2" />
                  Rank: {goal.rank}
                </div>
              )}

              {/* Notes indicator - only shows if there are notes */}
              {goal.notes && (
                <div
                  className={`flex items-center text-sm cursor-pointer ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                  onClick={() => toggleExpand(goal._id)}
                >
                  <MessageSquare size={16} className="mr-2" />
                  <span className="underline">
                    {expandedGoal === goal._id ? "Hide notes" : "View notes"}
                  </span>
                </div>
              )}
            </div>

            {/* Expanded notes */}
            {expandedGoal === goal._id && goal.notes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-3 p-3 rounded-md text-sm ${
                  isDark
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <div className="whitespace-pre-line">{goal.notes}</div>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GoalList;
