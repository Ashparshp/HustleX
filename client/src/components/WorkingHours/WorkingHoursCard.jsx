import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  Clock,
  CalendarDays,
  Award,
  MessageSquare,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { formatDisplayDate } from "../../utils/dateUtils";

const WorkingHoursCard = ({ entry, onEdit, onDelete }) => {
  const { isDark } = useTheme();

  const getStatusColor = (status) => {
    const colors = {
      Completed: isDark
        ? "text-green-400 bg-green-500/10 border-green-500/20"
        : "text-green-600 bg-green-100 border-green-200",
      "On Track": isDark
        ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
        : "text-blue-600 bg-blue-100 border-blue-200",
      "In Progress": isDark
        ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
        : "text-yellow-600 bg-yellow-100 border-yellow-200",
      Behind: isDark
        ? "text-red-400 bg-red-500/10 border-red-500/20"
        : "text-red-600 bg-red-100 border-red-200",
    };
    return colors[status] || colors.Behind;
  };

  const getProgressColor = (achieved, target) => {
    const percentage = (achieved / target) * 100;
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getMoodColor = (mood) => {
    const colors = {
      Productive: isDark
        ? "bg-green-500/10 text-green-400"
        : "bg-green-100 text-green-600",
      Normal: isDark
        ? "bg-blue-500/10 text-blue-400"
        : "bg-blue-100 text-blue-600",
      Distracted: isDark
        ? "bg-red-500/10 text-red-400"
        : "bg-red-100 text-red-600",
    };
    return colors[mood] || colors.Normal;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const progressPercentage = Math.min(
    (entry.achievedHours / entry.targetHours) * 100,
    100
  );
  const isCompleted = progressPercentage === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative group"
    >
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r rounded-lg blur opacity-30 
                   group-hover:opacity-50 transition duration-300
                   ${
                     isCompleted
                       ? "from-green-500 to-emerald-500"
                       : "from-indigo-500 to-blue-500"
                   }`}
      />
      <div
        className={`relative p-6 rounded-lg border backdrop-blur-sm transition-all duration-300
        ${
          isDark
            ? "bg-black border-indigo-500/30 group-hover:border-indigo-400"
            : "bg-white border-indigo-300/50 group-hover:border-indigo-500"
        }`}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {isCompleted && (
                  <Award
                    className={`w-5 h-5 ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  />
                )}
                <span
                  className={`font-medium text-lg ${
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  }`}
                >
                  {entry.category}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    entry.status
                  )}`}
                >
                  {entry.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays
                  className={`w-4 h-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {formatDisplayDate(entry.date)}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEdit}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-indigo-500/10 text-indigo-400"
                    : "hover:bg-indigo-50 text-indigo-600"
                }`}
                title="Edit entry"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDelete}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-red-500/10 text-red-400"
                    : "hover:bg-red-50 text-red-600"
                }`}
                title="Delete entry"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Clock
                  className={`w-4 h-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Progress
                </span>
              </div>
              <span
                className={`font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {entry.achievedHours}/{entry.targetHours} hours (
                {progressPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-2.5 rounded-full transition-colors ${getProgressColor(
                  entry.achievedHours,
                  entry.targetHours
                )}`}
              />
            </div>
          </div>

          {entry.notes && (
            <div
              className={`p-3 rounded-lg ${
                isDark ? "bg-gray-900" : "bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-2">
                <MessageSquare
                  className={`w-4 h-4 mt-0.5 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {entry.notes}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span
              className={`px-3 py-1 rounded-full font-medium ${getMoodColor(
                entry.mood
              )}`}
            >
              {entry.mood}
            </span>
            <div className="flex items-center gap-2">
              <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                Updated: {formatTime(entry.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkingHoursCard;
