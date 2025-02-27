// src/components/LeetCode/LeetCodeDifficultyChart.jsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { AlertCircle } from "lucide-react";

const LeetCodeDifficultyChart = ({ easy = 0, medium = 0, hard = 0 }) => {
  const { isDark } = useTheme();

  // Prepare data for the chart
  const createChartData = () => {
    const total = easy + medium + hard;
    if (total === 0) return [];

    return [
      { name: "Easy", value: easy, color: isDark ? "#34d399" : "#10b981" }, // green
      { name: "Medium", value: medium, color: isDark ? "#fbbf24" : "#d97706" }, // amber
      { name: "Hard", value: hard, color: isDark ? "#f87171" : "#ef4444" }, // red
    ].filter((item) => item.value > 0);
  };

  const chartData = createChartData();

  // Handle empty data
  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle
          size={48}
          className={isDark ? "text-gray-600" : "text-gray-400"}
        />
        <p className={`mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          No problem data available to display distribution
        </p>
      </div>
    );
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const total = easy + medium + hard;
    const percentage = ((data.value / total) * 100).toFixed(1);

    return (
      <div
        className={`p-3 rounded-lg shadow-md border ${
          isDark
            ? "bg-gray-800 text-white border-gray-700"
            : "bg-white text-gray-900 border-gray-200"
        }`}
      >
        <p className="font-medium" style={{ color: data.color }}>
          {data.name} Problems
        </p>
        <div className="mt-2 space-y-1">
          <p
            className={`text-sm flex items-center justify-between gap-4 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <span>Count:</span>
            <span className="font-semibold">{data.value}</span>
          </p>
          <p
            className={`text-sm flex items-center justify-between gap-4 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <span>Percentage:</span>
            <span className="font-semibold">{percentage}%</span>
          </p>
        </div>
      </div>
    );
  };

  // Render detailed stats alongside the chart
  const renderStats = () => {
    const total = easy + medium + hard;

    return (
      <div
        className={`p-4 rounded-lg ${
          isDark ? "bg-gray-800/70" : "bg-gray-100"
        }`}
      >
        <h3
          className={`text-lg font-medium mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Problem Distribution
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: isDark ? "#34d399" : "#10b981" }}
              ></div>
              <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                Easy
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`font-medium ${
                  isDark ? "text-green-400" : "text-green-600"
                }`}
              >
                {easy}
              </span>
              <span
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                ({total ? ((easy / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: isDark ? "#fbbf24" : "#d97706" }}
              ></div>
              <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                Medium
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`font-medium ${
                  isDark ? "text-yellow-400" : "text-yellow-600"
                }`}
              >
                {medium}
              </span>
              <span
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                ({total ? ((medium / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: isDark ? "#f87171" : "#ef4444" }}
              ></div>
              <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                Hard
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`font-medium ${
                  isDark ? "text-red-400" : "text-red-600"
                }`}
              >
                {hard}
              </span>
              <span
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                ({total ? ((hard / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <span
                className={`font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Total
              </span>
              <span
                className={`font-bold ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {total}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group h-full"
    >
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg blur opacity-30 
                   group-hover:opacity-50 transition duration-300`}
      />
      <div
        className={`relative rounded-lg border h-full backdrop-blur-sm transition-all duration-300 p-4
        ${
          isDark
            ? "bg-black/90 border-orange-500/30 group-hover:border-orange-400"
            : "bg-white/90 border-orange-300/50 group-hover:border-orange-500"
        }`}
      >
        <div className="flex flex-col h-full">
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Problem Difficulty Distribution
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            <div className="relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center">{renderStats()}</div>
          </div>

          <div className="mt-4 text-center">
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Focusing on a balance of problem difficulties can help improve
              your overall problem-solving skills.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeetCodeDifficultyChart;
