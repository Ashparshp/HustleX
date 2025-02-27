// src/components/Contests/ContestCard.jsx
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  Trophy,
  Calendar,
  MessageSquare,
  Award,
  Clock,
  Target,
  Code,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { formatDisplayDate } from "../../utils/dateUtils";

const ContestCard = ({ contest, onEdit, onDelete }) => {
  const { isDark } = useTheme();

  // Format date for display
  const formatDate = (date) => {
    return formatDisplayDate(date);
  };

  // Format time duration from minutes to hours and minutes
  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
  };

  // Get platform-specific color
  const getPlatformColor = (platform) => {
    const platformColors = {
      LeetCode: isDark
        ? "text-yellow-400 bg-yellow-500/10"
        : "text-yellow-600 bg-yellow-100",
      CodeChef: isDark
        ? "text-blue-400 bg-blue-500/10"
        : "text-blue-600 bg-blue-100",
      CodeForces: isDark
        ? "text-red-400 bg-red-500/10"
        : "text-red-600 bg-red-100",
      HackerRank: isDark
        ? "text-green-400 bg-green-500/10"
        : "text-green-600 bg-green-100",
      AtCoder: isDark
        ? "text-purple-400 bg-purple-500/10"
        : "text-purple-600 bg-purple-100",
      TopCoder: isDark
        ? "text-orange-400 bg-orange-500/10"
        : "text-orange-600 bg-orange-100",
    };

    return (
      platformColors[platform] ||
      (isDark ? "text-gray-400 bg-gray-500/10" : "text-gray-600 bg-gray-100")
    );
  };

  // Calculate solved percentage
  const getSolvedPercentage = () => {
    if (!contest.solved || !contest.totalProblems) return null;
    return Math.round((contest.solved / contest.totalProblems) * 100);
  };

  const solvedPercentage = getSolvedPercentage();

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
                     contest.participated
                       ? "from-purple-500 to-indigo-500"
                       : "from-gray-400 to-gray-500"
                   }`}
      />
      <div
        className={`relative p-6 rounded-lg border backdrop-blur-sm transition-all duration-300
        ${
          isDark
            ? "bg-black border-purple-500/30 group-hover:border-purple-400"
            : "bg-white border-purple-300/50 group-hover:border-purple-500"
        }`}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${getPlatformColor(
                    contest.platform
                  )}`}
                >
                  {contest.platform}
                </span>
                {contest.participated && (
                  <Award
                    className={`w-5 h-5 ${
                      isDark ? "text-amber-400" : "text-amber-600"
                    }`}
                  />
                )}
              </div>
              <h3
                className={`font-medium text-lg ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {contest.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Calendar
                  className={`w-4 h-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {formatDate(contest.date)}
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
                    ? "hover:bg-purple-500/10 text-purple-400"
                    : "hover:bg-purple-50 text-purple-600"
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

          {/* Participation Details */}
          {contest.participated && (
            <div
              className={`p-3 rounded-lg ${
                isDark ? "bg-gray-900" : "bg-gray-50"
              }`}
            >
              <div className="grid grid-cols-2 gap-3">
                {contest.rank && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy
                        className={`w-4 h-4 ${
                          isDark ? "text-amber-400" : "text-amber-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Rank
                      </span>
                    </div>
                    <p
                      className={`text-lg font-semibold ${
                        isDark ? "text-amber-300" : "text-amber-700"
                      }`}
                    >
                      {contest.rank}
                    </p>
                  </div>
                )}

                {contest.solved && contest.totalProblems && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Code
                        className={`w-4 h-4 ${
                          isDark ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Problems
                      </span>
                    </div>
                    <p
                      className={`${
                        isDark ? "text-blue-300" : "text-blue-700"
                      }`}
                    >
                      <span className="text-lg font-semibold">
                        {contest.solved}
                      </span>
                      <span className="text-sm font-medium">
                        /{contest.totalProblems}
                      </span>
                      {solvedPercentage && (
                        <span className="ml-1 text-xs">
                          ({solvedPercentage}%)
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Bar for Solved Problems */}
              {contest.solved && contest.totalProblems && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (contest.solved / contest.totalProblems) * 100
                        }%`,
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`h-1.5 rounded-full ${
                        isDark ? "bg-blue-500" : "bg-blue-600"
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Duration */}
          {contest.duration && (
            <div className="flex items-center gap-2">
              <Clock
                className={`w-4 h-4 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <span
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Duration: {formatDuration(contest.duration)}
              </span>
            </div>
          )}

          {/* Notes */}
          {contest.notes && (
            <div
              className={`rounded-lg ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
            >
              <div className="flex items-start gap-2 p-3">
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
                  {contest.notes}
                </p>
              </div>
            </div>
          )}

          {/* Participation Badge */}
          <div className="flex justify-end">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                contest.participated
                  ? isDark
                    ? "bg-green-500/10 text-green-400"
                    : "bg-green-100 text-green-600"
                  : isDark
                  ? "bg-gray-700 text-gray-400"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {contest.participated ? "Participated" : "Not Participated"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContestCard;
