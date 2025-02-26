import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Line,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, BarChart2, PieChart, TrendingUp, Info } from "lucide-react";

// Utility function to format date
const formatWeekLabel = (date) => {
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
};

// Comprehensive data processing function
const processScheduleData = (schedules) => {
  if (!Array.isArray(schedules) || schedules.length === 0) {
    return {
      processedData: [],
      overallStats: {
        totalSchedules: 0,
        averageTasksPerSchedule: 0,
        averageCompletionRate: 0,
        priorityTasksPercentage: 0,
        totalHours: 0,
      },
    };
  }

  // Detailed grouping by date
  const groupedData = schedules.reduce((acc, schedule) => {
    const dateKey = new Date(schedule.date).toISOString().split("T")[0];

    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        fullDate: formatWeekLabel(new Date(schedule.date)),
        scheduleCount: 0,
        totalTasks: 0,
        completedTasks: 0,
        highPriorityTasks: 0,
        totalHours: 0,
        categories: {},
        items: [],
      };
    }

    const dayData = acc[dateKey];
    dayData.scheduleCount++;

    // Capture detailed schedule information
    schedule.items.forEach((item) => {
      dayData.totalTasks++;
      dayData.items.push(item);

      if (item.completed) {
        dayData.completedTasks++;
      }

      if (item.priority === "High") {
        dayData.highPriorityTasks++;
      }

      const start = new Date(`2000-01-01T${item.startTime}`);
      const end = new Date(`2000-01-01T${item.endTime}`);
      const itemDuration = (end - start) / (1000 * 60 * 60);
      dayData.totalHours += itemDuration;

      dayData.categories[item.category] =
        (dayData.categories[item.category] || 0) + 1;
    });

    return acc;
  }, {});

  // Convert to array and sort
  const processedData = Object.values(groupedData)
    .map((day) => ({
      ...day,
      completionRate:
        day.totalTasks > 0
          ? ((day.completedTasks / day.totalTasks) * 100).toFixed(1)
          : 0,
      priorityTasksPercentage:
        day.totalTasks > 0
          ? ((day.highPriorityTasks / day.totalTasks) * 100).toFixed(1)
          : 0,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-15); // Last 15 days

  // Comprehensive overall stats
  const overallStats = {
    totalSchedules: schedules.length,
    averageTasksPerSchedule:
      processedData.reduce((sum, day) => sum + day.totalTasks, 0) /
        processedData.length || 0,
    averageCompletionRate:
      processedData.reduce((sum, day) => sum + Number(day.completionRate), 0) /
        processedData.length || 0,
    priorityTasksPercentage:
      processedData.reduce(
        (sum, day) => sum + Number(day.priorityTasksPercentage),
        0
      ) / processedData.length || 0,
    totalHours:
      processedData.reduce((sum, day) => sum + day.totalHours, 0) || 0,
  };

  return { processedData, overallStats };
};

// Main Chart Component
const ScheduleTimelineChart = ({ schedules = [], isDark = false }) => {
  const [chartType, setChartType] = useState("bar");
  const [showInfo, setShowInfo] = useState(false);

  // Process schedule data
  const { processedData, overallStats } = useMemo(
    () => processScheduleData(schedules),
    [schedules]
  );

  // Color palette with semantic dark/light mode colors
  const COLOR_PALETTE = {
    schedules: isDark ? "#4f46e5" : "#6366f1",
    totalTasks: isDark ? "#059669" : "#10b981",
    completedTasks: isDark ? "#0891b2" : "#06b6d4",
    highPriorityTasks: isDark ? "#dc2626" : "#ef4444",
    completionRate: isDark ? "#10b981" : "#059669",
  };

  // Render empty state if no data
  if (processedData.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-full text-center p-4 
          ${isDark ? "text-gray-400" : "text-gray-600"}`}
      >
        <Calendar className="w-12 h-12 mb-4 opacity-50 text-indigo-500" />
        <p>No schedule data available to visualize</p>
      </div>
    );
  }

  // Custom tooltip component with comprehensive information
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dayData = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-2xl shadow-2xl text-sm backdrop-blur-sm
            ${
              isDark
                ? "bg-black/90 text-white border border-indigo-500/30"
                : "bg-white/90 text-gray-900 border border-indigo-300/50"
            }`}
        >
          <p className="font-bold mb-2 text-indigo-400">{label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span
                    className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {entry.name}:
                  </span>
                </div>
                <span
                  className={`font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {entry.value}
                </span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 space-y-1">
              <p className="text-xs">
                Total Categories: {Object.keys(dayData.categories).length}
              </p>
              <p className="text-xs">
                Total Hours: {dayData.totalHours.toFixed(1)}
              </p>
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Chart Controls */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setChartType(chartType === "bar" ? "line" : "bar")}
            className={`p-2 rounded-lg ${
              isDark ? "hover:bg-indigo-500/10" : "hover:bg-indigo-50"
            }`}
          >
            {chartType === "bar" ? (
              <BarChart2 className="w-5 h-5" />
            ) : (
              <PieChart className="w-5 h-5" />
            )}
          </button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded-lg ${
              isDark ? "hover:bg-indigo-500/10" : "hover:bg-indigo-50"
            }`}
          >
            <Info className="w-5 h-5" />
          </motion.button>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp
            className={`w-4 h-4 ${
              overallStats.averageCompletionRate > 70
                ? "text-green-500"
                : "text-gray-400"
            }`}
          />
          <span
            className={`text-xs ${
              overallStats.averageCompletionRate > 70
                ? "text-green-500"
                : isDark
                ? "text-gray-400"
                : "text-gray-600"
            }`}
          >
            {overallStats.averageCompletionRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 mx-4 mb-4 rounded-lg ${
              isDark
                ? "bg-gray-800/50 text-gray-300"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Total Schedules",
                  value: overallStats.totalSchedules,
                },
                {
                  label: "Avg Tasks/Schedule",
                  value: overallStats.averageTasksPerSchedule.toFixed(1),
                },
                {
                  label: "Completion Rate",
                  value: `${overallStats.averageCompletionRate.toFixed(1)}%`,
                },
                {
                  label: "Priority Tasks",
                  value: `${overallStats.priorityTasksPercentage.toFixed(1)}%`,
                },
                {
                  label: "Total Hours",
                  value: overallStats.totalHours.toFixed(1),
                },
              ].map((stat, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-xs opacity-70">{stat.label}</p>
                  <p className="text-sm font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart Container */}
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart
              data={processedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={
                  isDark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.15)"
                }
              />
              <XAxis
                dataKey="fullDate"
                tick={{
                  fill: isDark ? "#818cf8" : "#6366f1",
                  fontSize: 10,
                }}
              />
              <YAxis
                tick={{
                  fill: isDark ? "#818cf8" : "#6366f1",
                  fontSize: 10,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                formatter={(value) => (
                  <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                    {value}
                  </span>
                )}
              />
              <Bar
                dataKey="scheduleCount"
                name="Schedules"
                fill={COLOR_PALETTE.schedules}
                stackId="a"
              />
              <Bar
                dataKey="totalTasks"
                name="Total Tasks"
                fill={COLOR_PALETTE.totalTasks}
                stackId="a"
              />
              <Bar
                dataKey="completedTasks"
                name="Completed Tasks"
                fill={COLOR_PALETTE.completedTasks}
                stackId="a"
              />
              <Bar
                dataKey="highPriorityTasks"
                name="High Priority Tasks"
                fill={COLOR_PALETTE.highPriorityTasks}
                stackId="a"
              />
              <ReferenceLine
                y={0}
                stroke={isDark ? "#818cf8" : "#6366f1"}
                strokeDasharray="3 3"
              />
            </BarChart>
          ) : (
            <ComposedChart
              data={processedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={
                  isDark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.15)"
                }
              />
              <XAxis
                dataKey="fullDate"
                tick={{
                  fill: isDark ? "#818cf8" : "#6366f1",
                  fontSize: 10,
                }}
              />
              <YAxis
                tick={{
                  fill: isDark ? "#818cf8" : "#6366f1",
                  fontSize: 10,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                formatter={(value) => (
                  <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                    {value}
                  </span>
                )}
              />
              <Bar
                dataKey="totalTasks"
                name="Total Tasks"
                fill={COLOR_PALETTE.totalTasks}
              />
              <Line
                type="monotone"
                dataKey="completionRate"
                name="Completion Rate"
                stroke={COLOR_PALETTE.completionRate}
                strokeWidth={3}
                dot={{
                  fill: COLOR_PALETTE.completionRate,
                  r: 6,
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{ r: 8, fill: COLOR_PALETTE.completionRate }}
                yAxisId="right"
                connectNulls
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{
                  fill: isDark ? "#818cf8" : "#6366f1",
                  fontSize: 10,
                }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScheduleTimelineChart;
