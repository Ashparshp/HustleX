// src/components/Timetable/TimetableStats.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Clock,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

const TimetableStats = ({ stats, onClose }) => {
  const { isDark } = useTheme();
  // Toggle between pie chart and list view for better mobile interaction
  const [activeView, setActiveView] = useState("pie");

  // Enhanced color palette with semantic meanings and accessibility
  const COLOR_PALETTE = [
    {
      fill: isDark ? "#10B981" : "#059669",
      name: "Productive",
      description: "High efficiency activities",
    },
    {
      fill: isDark ? "#F59E0B" : "#D97706",
      name: "Learning",
      description: "Skill development activities",
    },
    {
      fill: isDark ? "#EF4444" : "#DC2626",
      name: "Challenging",
      description: "Complex or difficult tasks",
    },
    {
      fill: isDark ? "#6366F1" : "#4F46E5",
      name: "Strategic",
      description: "Long-term goal-oriented tasks",
    },
    {
      fill: isDark ? "#EC4899" : "#DB2777",
      name: "Creativity",
      description: "Innovative and creative work",
    },
  ];

  // Transform category data with additional information
  const categoryData = stats?.currentWeek?.byCategory
    ? Object.entries(stats.currentWeek.byCategory).map(
        ([name, data], index) => ({
          name,
          value: data.completionRate,
          color: COLOR_PALETTE[index % COLOR_PALETTE.length].fill,
          description: COLOR_PALETTE[index % COLOR_PALETTE.length].description,
        })
      )
    : [];

  // Custom tooltip for detailed information on hover
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-lg shadow-xl text-sm backdrop-blur-sm
            ${
              isDark
                ? "bg-black/80 text-white border border-indigo-500/30"
                : "bg-white/90 text-gray-900 border border-indigo-300/50"
            }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <p className="font-bold">{data.name}</p>
          </div>
          <p className="text-xs text-gray-500">{data.description}</p>
          <p className="mt-1">
            Completion Rate:
            <span className="font-semibold ml-1">{data.value.toFixed(1)}%</span>
          </p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-6xl mx-auto"
      >
        <div
          className={`rounded-2xl overflow-hidden border backdrop-blur-sm ${
            isDark
              ? "bg-black/90 border-indigo-500/30"
              : "bg-white/90 border-indigo-300/50"
          }`}
        >
          {/* Responsive Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200/10 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h3
                className={`text-xl sm:text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Timetable Statistics
              </h3>
              <p
                className={`text-xs sm:text-sm mt-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Insights into your productivity and progress
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* View Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setActiveView(activeView === "pie" ? "list" : "pie")
                }
                className={`p-2 rounded-lg ${
                  isDark
                    ? "hover:bg-indigo-500/10 text-indigo-400"
                    : "hover:bg-indigo-50 text-indigo-600"
                }`}
              >
                {activeView === "pie" ? (
                  <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </motion.button>
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`p-2 rounded-lg ${
                  isDark
                    ? "hover:bg-indigo-500/10 text-indigo-400"
                    : "hover:bg-indigo-50 text-indigo-600"
                }`}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>
          </div>

          {/* Responsive Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
            {/* Category Distribution Section */}
            <div>
              <h4
                className={`text-base sm:text-lg font-semibold mb-2 sm:mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Current Week Distribution
              </h4>

              <AnimatePresence mode="wait">
                {activeView === "pie" ? (
                  <motion.div
                    key="pie-chart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-48 sm:h-64"
                  >
                    {categoryData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="80%"
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={
                                  COLOR_PALETTE[index % COLOR_PALETTE.length]
                                    .fill
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend
                            iconType="circle"
                            formatter={(value) => (
                              <span
                                className={`text-xs sm:text-sm ${
                                  isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {value}
                              </span>
                            )}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p
                          className={isDark ? "text-gray-400" : "text-gray-600"}
                        >
                          No category data available
                        </p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="category-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2 sm:space-y-3"
                  >
                    {categoryData.length > 0 ? (
                      categoryData.map((category, index) => (
                        <div
                          key={category.name}
                          className={`p-2 sm:p-3 rounded-lg flex justify-between items-center ${
                            isDark
                              ? "bg-gray-800/50 hover:bg-gray-800/70"
                              : "bg-gray-100/50 hover:bg-gray-200/50"
                          } transition-colors`}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div
                              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <div>
                              <p
                                className={`text-xs sm:text-sm font-medium ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {category.name}
                              </p>
                              <p
                                className={`text-[10px] sm:text-xs ${
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                {
                                  COLOR_PALETTE[index % COLOR_PALETTE.length]
                                    .description
                                }
                              </p>
                            </div>
                          </div>
                          <p
                            className={`text-sm sm:text-base font-semibold ${
                              isDark ? "text-indigo-400" : "text-indigo-600"
                            }`}
                          >
                            {category.value.toFixed(1)}%
                          </p>
                        </div>
                      ))
                    ) : (
                      <div
                        className={`p-4 text-center ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        No category data available
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Overall Progress Section */}
            <div>
              <h4
                className={`text-base sm:text-lg font-semibold mb-2 sm:mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Overall Progress
              </h4>
              <div className="space-y-2 sm:space-y-4">
                {[
                  {
                    label: "Total Weeks Tracked",
                    value: stats?.overall?.totalWeeks || 0,
                    icon: Clock,
                  },
                  {
                    label: "Average Completion Rate",
                    value: `${(
                      stats?.overall?.averageCompletionRate || 0
                    ).toFixed(1)}%`,
                    icon: Activity,
                    trend:
                      (stats?.overall?.averageCompletionRate || 0) > 70
                        ? "up"
                        : "down",
                  },
                  {
                    label: "Best Week",
                    value: stats?.overall?.bestWeek
                      ? new Date(
                          stats.overall.bestWeek.weekStartDate
                        ).toLocaleDateString()
                      : "N/A",
                    subValue: stats?.overall?.bestWeek
                      ? `${stats.overall.bestWeek.completionRate.toFixed(1)}%`
                      : null,
                    icon: TrendingUp,
                  },
                  {
                    label: "Areas for Improvement",
                    value: stats?.overall?.worstWeek
                      ? new Date(
                          stats.overall.worstWeek.weekStartDate
                        ).toLocaleDateString()
                      : "N/A",
                    subValue: stats?.overall?.worstWeek
                      ? `${stats.overall.worstWeek.completionRate.toFixed(1)}%`
                      : null,
                    icon: TrendingDown,
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`p-2 sm:p-3 rounded-lg flex items-center justify-between ${
                      isDark
                        ? "bg-gray-800/50 hover:bg-gray-800/70"
                        : "bg-gray-100/50 hover:bg-gray-200/50"
                    } transition-colors`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <stat.icon
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          stat.trend === "up"
                            ? "text-green-500"
                            : stat.trend === "down"
                            ? "text-red-500"
                            : isDark
                            ? "text-indigo-400"
                            : "text-indigo-600"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-xs sm:text-sm ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {stat.label}
                        </p>
                        <p
                          className={`text-sm sm:text-base font-semibold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {stat.value}
                          {stat.subValue && (
                            <span
                              className={`text-xs ml-2 ${
                                stat.trend === "up"
                                  ? "text-green-500"
                                  : stat.trend === "down"
                                  ? "text-red-500"
                                  : isDark
                                  ? "text-indigo-400"
                                  : "text-indigo-600"
                              }`}
                            >
                              {stat.subValue}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="p-4 sm:p-6 border-t border-gray-800/30">
            <div
              className={`rounded-lg p-4 text-center ${
                isDark ? "bg-gray-800/30" : "bg-gray-100/50"
              }`}
            >
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                <span className="font-medium">Week Summary: </span>
                {stats?.currentWeek?.completionRate
                  ? `You've completed ${stats.currentWeek.completionRate.toFixed(
                      1
                    )}% of your activities this week.`
                  : "No data available for the current week."}

                {stats?.overall?.averageCompletionRate && (
                  <>
                    {" "}
                    Your overall average is{" "}
                    {stats.overall.averageCompletionRate.toFixed(1)}% across{" "}
                    {stats.overall.totalWeeks} weeks.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TimetableStats;
