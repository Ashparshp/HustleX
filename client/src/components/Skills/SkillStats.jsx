// src/components/Skills/SkillStats.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  BarChart2,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Brain,
  Tag,
  Award,
  Zap,
  Calendar,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const SkillStats = ({ stats }) => {
  const { isDark } = useTheme();

  if (!stats) return null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Stat cards
  const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    color,
    delay,
  }) => {
    return (
      <motion.div
        variants={itemVariants}
        className={`p-6 rounded-lg border ${
          isDark
            ? "bg-black/80 border-indigo-500/30 hover:border-indigo-500/60"
            : "bg-white border-indigo-300/30 hover:border-indigo-300/60"
        } transition-all duration-300`}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Icon className={color} size={20} />
            <h3
              className={`font-medium ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
            </h3>
          </div>
          <div
            className={`p-2 rounded-lg ${
              isDark ? "bg-gray-900" : "bg-gray-100"
            }`}
          >
            <Icon className={color} size={18} />
          </div>
        </div>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        {description && (
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {description}
          </p>
        )}
      </motion.div>
    );
  };

  // Category item
  const CategoryItem = ({ category, count, total }) => {
    const percentage = ((count / total) * 100).toFixed(1);
    const color = getCategoryProgressColor(category, isDark);
    const bgColor = getCategoryBackgroundColor(category, isDark);
    const textColor = getCategoryTextColor(category, isDark);

    return (
      <motion.div variants={itemVariants} className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className={`font-medium ${textColor}`}>{category}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {count} skill{count !== 1 ? "s" : ""}
            </span>
            <span className={`text-sm font-bold ${textColor}`}>
              {percentage}%
            </span>
          </div>
        </div>
        <div
          className={`relative h-2 rounded-full overflow-hidden ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          }`}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`absolute left-0 top-0 h-full ${color}`}
          />
          <div className={`absolute inset-0 ${bgColor} opacity-20`}></div>
        </div>
      </motion.div>
    );
  };

  // Distribution graph
  const StatusDistribution = () => {
    const total = stats.total || 1; // Avoid division by zero
    const completed = stats.completed || 0;
    const inProgress = stats.inProgress || 0;
    const upcoming = stats.upcoming || 0;

    const completedPercentage = (completed / total) * 100;
    const inProgressPercentage = (inProgress / total) * 100;
    const upcomingPercentage = (upcoming / total) * 100;

    return (
      <motion.div
        variants={itemVariants}
        className={`p-6 rounded-lg border ${
          isDark
            ? "bg-black/80 border-indigo-500/30 hover:border-indigo-500/60"
            : "bg-white border-indigo-300/30 hover:border-indigo-300/60"
        } transition-all duration-300`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar
            className={isDark ? "text-indigo-400" : "text-indigo-600"}
            size={20}
          />
          <h3
            className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Status Distribution
          </h3>
        </div>

        <div className="h-10 flex rounded-lg overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completedPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className={`${
              isDark ? "bg-green-500" : "bg-green-600"
            } relative group`}
          >
            {completedPercentage > 10 && (
              <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                {completed}
              </span>
            )}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${inProgressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className={`${
              isDark ? "bg-yellow-500" : "bg-yellow-600"
            } relative group`}
          >
            {inProgressPercentage > 10 && (
              <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                {inProgress}
              </span>
            )}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${upcomingPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className={`${
              isDark ? "bg-blue-500" : "bg-blue-600"
            } relative group`}
          >
            {upcomingPercentage > 10 && (
              <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                {upcoming}
              </span>
            )}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </motion.div>
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <div
              className={`w-3 h-3 rounded-full ${
                isDark ? "bg-green-500" : "bg-green-600"
              }`}
            ></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className={`w-3 h-3 rounded-full ${
                isDark ? "bg-yellow-500" : "bg-yellow-600"
              }`}
            ></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className={`w-3 h-3 rounded-full ${
                isDark ? "bg-blue-500" : "bg-blue-600"
              }`}
            ></div>
            <span>Upcoming</span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Average Progress
  const AverageProgress = () => {
    const progress = stats.averageProgress?.toFixed(1) || 0;
    return (
      <motion.div
        variants={itemVariants}
        className={`p-6 rounded-lg border ${
          isDark
            ? "bg-black/80 border-indigo-500/30 hover:border-indigo-500/60"
            : "bg-white border-indigo-300/30 hover:border-indigo-300/60"
        } transition-all duration-300`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain
            className={isDark ? "text-purple-400" : "text-purple-600"}
            size={20}
          />
          <h3
            className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Average Progress
          </h3>
        </div>

        <div className="relative pt-2 pb-8">
          <div className="flex justify-between mb-1">
            <span
              className={`text-xs ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              0%
            </span>
            <span
              className={`text-xs ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              50%
            </span>
            <span
              className={`text-xs ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              100%
            </span>
          </div>

          <div
            className={`h-4 bg-gray-200 rounded-full overflow-hidden ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${
                progress >= 75
                  ? isDark
                    ? "bg-green-500"
                    : "bg-green-600"
                  : progress >= 50
                  ? isDark
                    ? "bg-yellow-500"
                    : "bg-yellow-600"
                  : progress >= 25
                  ? isDark
                    ? "bg-orange-500"
                    : "bg-orange-600"
                  : isDark
                  ? "bg-red-500"
                  : "bg-red-600"
              }`}
            />
          </div>

          <div className="absolute top-full left-0 w-full mt-1 flex justify-between">
            <span
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Beginner
            </span>
            <span
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Intermediate
            </span>
            <span
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Advanced
            </span>
          </div>

          <motion.div
            initial={{ left: 0, opacity: 0 }}
            animate={{ left: `${progress}%`, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-0 -ml-3 -mt-1"
          >
            <div className="relative">
              <div
                className={`w-6 h-6 rounded-full border-2 ${
                  isDark
                    ? "bg-gray-800 border-purple-500"
                    : "bg-white border-purple-600"
                }`}
              ></div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                <div
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    isDark
                      ? "bg-gray-800 text-purple-300"
                      : "bg-gray-100 text-purple-700"
                  }`}
                >
                  {progress}%
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Skills"
          value={stats.total || 0}
          icon={BarChart2}
          color={isDark ? "text-indigo-400" : "text-indigo-600"}
        />
        <StatCard
          title="Completed"
          value={stats.completed || 0}
          description={`${
            stats.completionRate?.toFixed(1) || 0
          }% completion rate`}
          icon={CheckCircle}
          color={isDark ? "text-green-400" : "text-green-600"}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress || 0}
          icon={Clock}
          color={isDark ? "text-yellow-400" : "text-yellow-600"}
        />
        <StatCard
          title="Upcoming"
          value={stats.upcoming || 0}
          icon={ArrowUpRight}
          color={isDark ? "text-blue-400" : "text-blue-600"}
        />
      </div>

      {/* Charts & visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatusDistribution />
        <AverageProgress />
      </div>

      {/* Category distribution */}
      {stats.categoryCounts && Object.keys(stats.categoryCounts).length > 0 && (
        <motion.div
          variants={itemVariants}
          className={`p-6 rounded-lg border ${
            isDark
              ? "bg-black/80 border-indigo-500/30 hover:border-indigo-500/60"
              : "bg-white border-indigo-300/30 hover:border-indigo-300/60"
          } transition-all duration-300`}
        >
          <div className="flex items-center gap-2 mb-6">
            <Tag
              className={isDark ? "text-indigo-400" : "text-indigo-600"}
              size={20}
            />
            <h3
              className={`font-medium ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Category Distribution
            </h3>
          </div>

          <div className="space-y-2">
            {Object.entries(stats.categoryCounts)
              .sort(([, count1], [, count2]) => count2 - count1)
              .map(([category, count]) => (
                <CategoryItem
                  key={category}
                  category={category}
                  count={count}
                  total={stats.total}
                />
              ))}
          </div>
        </motion.div>
      )}

      {/* Overall stats */}
      <motion.div
        variants={itemVariants}
        className={`p-6 rounded-lg border ${
          isDark
            ? "bg-black/80 border-indigo-500/30 hover:border-indigo-500/60"
            : "bg-white border-indigo-300/30 hover:border-indigo-300/60"
        } transition-all duration-300 text-center`}
      >
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          <span className="font-medium">Summary:</span> You have{" "}
          {stats.total || 0} skills tracked with {stats.completed || 0}{" "}
          completed,
          {stats.inProgress || 0} in progress, and {stats.upcoming || 0}{" "}
          upcoming. Your overall completion rate is{" "}
          {stats.completionRate?.toFixed(1) || 0}%.
        </p>
      </motion.div>
    </motion.div>
  );
};

// Helper function for category progress color
const getCategoryProgressColor = (category, isDark) => {
  const colorMap = {
    "MERN Stack": isDark ? "bg-blue-500" : "bg-blue-600",
    "Java & Ecosystem": isDark ? "bg-yellow-500" : "bg-yellow-600",
    DevOps: isDark ? "bg-red-500" : "bg-red-600",
    "Data Science & ML": isDark ? "bg-purple-500" : "bg-purple-600",
    "Mobile Development": isDark ? "bg-green-500" : "bg-green-600",
    "Go Backend": isDark ? "bg-cyan-500" : "bg-cyan-600",
  };

  return colorMap[category] || (isDark ? "bg-indigo-500" : "bg-indigo-600");
};

// Helper function for category background color
const getCategoryBackgroundColor = (category, isDark) => {
  const colorMap = {
    "MERN Stack": isDark ? "bg-blue-500" : "bg-blue-100",
    "Java & Ecosystem": isDark ? "bg-yellow-500" : "bg-yellow-100",
    DevOps: isDark ? "bg-red-500" : "bg-red-100",
    "Data Science & ML": isDark ? "bg-purple-500" : "bg-purple-100",
    "Mobile Development": isDark ? "bg-green-500" : "bg-green-100",
    "Go Backend": isDark ? "bg-cyan-500" : "bg-cyan-100",
  };

  return colorMap[category] || (isDark ? "bg-indigo-500" : "bg-indigo-100");
};

// Helper function for category text color
const getCategoryTextColor = (category, isDark) => {
  const colorMap = {
    "MERN Stack": isDark ? "text-blue-400" : "text-blue-700",
    "Java & Ecosystem": isDark ? "text-yellow-400" : "text-yellow-700",
    DevOps: isDark ? "text-red-400" : "text-red-700",
    "Data Science & ML": isDark ? "text-purple-400" : "text-purple-700",
    "Mobile Development": isDark ? "text-green-400" : "text-green-700",
    "Go Backend": isDark ? "text-cyan-400" : "text-cyan-700",
  };

  return colorMap[category] || (isDark ? "text-indigo-400" : "text-indigo-700");
};

export default SkillStats;
