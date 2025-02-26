import { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit2,
  Trash2,
  Calendar,
  Check,
  X,
  Award,
  Clock,
  MessageSquare,
  Medal,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const GoalList = ({ goals, onEdit, onDelete, platforms }) => {
  const { isDark } = useTheme();
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [deletingGoal, setDeletingGoal] = useState(null);

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

  // Get platform color variants
  const getPlatformVariants = {
    leetcode: {
      color: isDark ? "text-yellow-400" : "text-yellow-600",
      bg: isDark ? "bg-yellow-500/10" : "bg-yellow-100",
    },
    codechef: {
      color: isDark ? "text-green-400" : "text-green-600",
      bg: isDark ? "bg-green-500/10" : "bg-green-100",
    },
    codeforces: {
      color: isDark ? "text-red-400" : "text-red-600",
      bg: isDark ? "bg-red-500/10" : "bg-red-100",
    },
    hackerrank: {
      color: isDark ? "text-blue-400" : "text-blue-600",
      bg: isDark ? "bg-blue-500/10" : "bg-blue-100",
    },
    default: {
      color: isDark ? "text-indigo-400" : "text-indigo-600",
      bg: isDark ? "bg-indigo-500/10" : "bg-indigo-100",
    },
  };

  // Get platform details
  const getPlatformDetails = (platformName) => {
    const normalizedPlatform = (
      typeof platformName === "string" ? platformName : platformName.name
    )
      .toLowerCase()
      .replace(/\s+/g, "");
    return (
      getPlatformVariants[normalizedPlatform] || getPlatformVariants.default
    );
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

  // Handle delete confirmation
  const handleConfirmDelete = async (goalId) => {
    try {
      await onDelete(goalId);
      setDeletingGoal(null);
    } catch (error) {
      console.error("Deletion error:", error);
    }
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
            const platformName =
              typeof platform === "string" ? platform : platform.name;
            const platformDetails = getPlatformDetails(platformName);
            return (
              <div
                key={index}
                className={`w-12 h-12 flex items-center justify-center rounded-full ${platformDetails.bg} ${platformDetails.color} text-lg font-bold`}
              >
                {platformName.substring(0, 2).toUpperCase()}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => {
        const platformDetails = getPlatformDetails(goal.platform);
        const isDeleting = deletingGoal === goal._id;

        return (
          <motion.div
            key={goal._id}
            whileHover={{ y: -2, scale: 1.02 }}
            className="relative group"
          >
            <div
              className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg blur opacity-30 
                         group-hover:opacity-50 transition duration-300"
            />

            <div
              className={`relative p-6 rounded-lg border backdrop-blur-sm transition-all duration-300
                ${
                  isDark
                    ? "bg-black border-indigo-500/30 group-hover:border-indigo-400"
                    : "bg-white border-indigo-300/50 group-hover:border-indigo-500"
                }`}
            >
              {isDeleting ? (
                <div className="text-center space-y-4">
                  <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                    Confirm goal deletion?
                  </p>
                  <div className="flex justify-center gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleConfirmDelete(goal._id)}
                      className={`px-4 py-2 rounded-lg ${
                        isDark
                          ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      Delete
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeletingGoal(null)}
                      className={`px-4 py-2 rounded-lg ${
                        isDark
                          ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center gap-3">
                        <div className="flex-grow">
                          <div className="flex justify-between items-center">
                            <span
                              className={`font-medium ${platformDetails.color}`}
                            >
                              {goal.platform}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${platformDetails.bg} ${platformDetails.color}`}
                            >
                              {goal.name}
                            </span>
                          </div>
                          <div
                            className={`text-sm mt-1 flex items-center gap-2 ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            <Calendar className="w-4 h-4" />
                            {formatDate(goal.date)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEdit(goal)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "hover:bg-indigo-500/10 text-indigo-400"
                            : "hover:bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeletingGoal(goal._id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "hover:bg-red-500/10 text-red-400"
                            : "hover:bg-red-50 text-red-600"
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div
                      className={`flex items-center text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {goal.participated ? (
                        <Check size={16} className="mr-2 text-green-500" />
                      ) : (
                        <X size={16} className="mr-2 text-red-500" />
                      )}
                      {goal.participated
                        ? "Participated"
                        : "Did not participate"}
                    </div>

                    {goal.duration && (
                      <div
                        className={`flex items-center text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <Clock size={16} className="mr-2" />
                        {formatDuration(goal.duration)}
                      </div>
                    )}

                    {/* Progress indicator */}
                    {getProgressIndicator(goal)}

                    {goal.participated && goal.rank && (
                      <div
                        className={`flex items-center text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <Medal
                          size={16}
                          className={`mr-2 ${platformDetails.color}`}
                        />
                        Rank: {goal.rank}
                      </div>
                    )}

                    {goal.notes && (
                      <div
                        className={`flex items-center text-sm cursor-pointer ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                        onClick={() =>
                          setExpandedGoal(
                            expandedGoal === goal._id ? null : goal._id
                          )
                        }
                      >
                        <MessageSquare size={16} className="mr-2" />
                        <span className="underline">
                          {expandedGoal === goal._id
                            ? "Hide notes"
                            : "View notes"}
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
                      className={`mt-4 pt-4 border-t border-dashed text-sm ${
                        isDark
                          ? "border-gray-700 text-gray-300"
                          : "border-gray-200 text-gray-700"
                      }`}
                    >
                      <div className="whitespace-pre-line">{goal.notes}</div>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GoalList;
