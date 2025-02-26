import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ListPlus, BarChart2, PieChart as PieChartIcon } from "lucide-react";

const CategoryDistributionChart = ({ schedules, isDark }) => {
  const [chartType, setChartType] = useState("pie");

  const COLOR_PALETTE = [
    {
      fill: isDark ? "#4f46e5" : "#6366f1",
      gradient: "#818cf8",
      category: "Technical Skills",
    },
    {
      fill: isDark ? "#059669" : "#10b981",
      gradient: "#34d399",
      category: "Professional Development",
    },
    {
      fill: isDark ? "#0891b2" : "#06b6d4",
      gradient: "#22d3ee",
      category: "Learning",
    },
    {
      fill: isDark ? "#dc2626" : "#ef4444",
      gradient: "#f87171",
      category: "Project Management",
    },
    {
      fill: isDark ? "#d946ef" : "#e879f9",
      gradient: "#f0abfc",
      category: "Soft Skills",
    },
    {
      fill: isDark ? "#8b5cf6" : "#a78bfa",
      gradient: "#c4b5fd",
      category: "Personal Growth",
    },
  ];

  const categoryData = useMemo(() => {
    if (!Array.isArray(schedules) || schedules.length === 0) {
      return [];
    }

    const categoryAnalysis = {};
    let totalTasks = 0;

    schedules.forEach((schedule) => {
      if (!schedule.items || !Array.isArray(schedule.items)) return;

      schedule.items.forEach((item) => {
        const category = item.category || "Other";
        if (!categoryAnalysis[category]) {
          categoryAnalysis[category] = {
            name: category,
            totalTasks: 0,
            completedTasks: 0,
            highPriorityTasks: 0,
            totalHours: 0,
          };
        }

        categoryAnalysis[category].totalTasks++;
        totalTasks++;

        if (item.completed) {
          categoryAnalysis[category].completedTasks++;
        }

        if (item.priority === "High") {
          categoryAnalysis[category].highPriorityTasks++;
        }

        const startTime = new Date(`2000-01-01T${item.startTime}`);
        const endTime = new Date(`2000-01-01T${item.endTime}`);
        const duration = (endTime - startTime) / (1000 * 60 * 60);
        categoryAnalysis[category].totalHours += duration;
      });
    });

    return Object.values(categoryAnalysis)
      .map((category) => ({
        ...category,
        percentage: ((category.totalTasks / totalTasks) * 100).toFixed(1),
      }))
      .sort((a, b) => b.totalTasks - a.totalTasks);
  }, [schedules]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={`p-4 rounded-lg shadow-xl text-sm backdrop-blur-sm
            ${
              isDark
                ? "bg-black/70 text-white border border-indigo-500/30"
                : "bg-white/90 text-gray-900 border border-indigo-300/50"
            }`}
        >
          <p className="font-bold mb-2 text-indigo-400">{data.name}</p>
          <div className="space-y-1">
            <div>Total Tasks: {data.totalTasks}</div>
            <div>Completed Tasks: {data.completedTasks}</div>
            <div>High Priority Tasks: {data.highPriorityTasks}</div>
            <div>Total Hours: {data.totalHours.toFixed(1)}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          dataKey="totalTasks"
        >
          {categoryData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLOR_PALETTE[index % COLOR_PALETTE.length].fill}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          formatter={(value) => (
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={categoryData}
        margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.15)"}
        />
        <XAxis
          dataKey="name"
          tick={{
            fill: isDark ? "#818cf8" : "#6366f1",
            fontSize: 10,
          }}
          angle={-45}
          textAnchor="end"
          height={60}
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
          name="Total Tasks"
          dataKey="totalTasks"
          fill={isDark ? "#4f46e5" : "#6366f1"}
        />
        <Bar
          name="Completed Tasks"
          dataKey="completedTasks"
          fill={isDark ? "#059669" : "#10b981"}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  if (categoryData.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-64 text-center p-4 
          ${isDark ? "text-gray-400" : "text-gray-600"}`}
      >
        <ListPlus className="w-12 h-12 mb-4 opacity-50 text-indigo-500" />
        <p>No category data available to visualize</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setChartType("pie")}
            className={`p-2 rounded-lg ${
              chartType === "pie"
                ? isDark
                  ? "bg-indigo-500/20"
                  : "bg-indigo-100"
                : isDark
                ? "hover:bg-indigo-500/10"
                : "hover:bg-indigo-50"
            }`}
          >
            <PieChartIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`p-2 rounded-lg ${
              chartType === "bar"
                ? isDark
                  ? "bg-indigo-500/20"
                  : "bg-indigo-100"
                : isDark
                ? "hover:bg-indigo-500/10"
                : "hover:bg-indigo-50"
            }`}
          >
            <BarChart2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={chartType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {chartType === "pie" ? renderPieChart() : renderBarChart()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CategoryDistributionChart;
