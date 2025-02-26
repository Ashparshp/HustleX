// src/components/WorkingHours/ProgressChart.jsx
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { formatDisplayDate } from "../../utils/dateUtils";

const ProgressChart = ({ data }) => {
  const { isDark } = useTheme();

  // Prepare and sort data for the chart
  const chartData = data
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => ({
      date: item.date,
      targetHours: item.targetHours,
      achievedHours: item.achievedHours,
      category: item.category,
      formattedDate: formatDisplayDate(item.date),
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div
        className={`relative group backdrop-blur-sm border rounded-lg p-4 shadow-lg
          ${
            isDark
              ? "bg-black border-indigo-500/30 text-white"
              : "bg-white border-indigo-300/50 text-gray-900"
          }`}
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg blur opacity-30" />
        <div className="relative">
          <p className="text-sm font-medium mb-2">{data.formattedDate}</p>
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 mb-1"
            >
              <span
                className={`flex items-center gap-2 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span
                className={`font-medium ${
                  entry.name === "Target"
                    ? isDark
                      ? "text-indigo-400"
                      : "text-indigo-600"
                    : isDark
                    ? "text-blue-400"
                    : "text-blue-600"
                }`}
              >
                {entry.value.toFixed(1)}h
              </span>
            </div>
          ))}
          {data.category && (
            <div className="mt-1 pt-1 border-t border-gray-700">
              <span
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Category: {data.category}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <div
        className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg blur opacity-30 
                      group-hover:opacity-50 transition duration-300"
      />
      <div
        className={`relative h-96 p-6 rounded-lg border backdrop-blur-sm transition-all duration-300
          ${
            isDark
              ? "bg-black border-indigo-500/30 group-hover:border-indigo-400"
              : "bg-white border-indigo-300/50 group-hover:border-indigo-500"
          }`}
      >
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              No data available for chart visualization
            </p>
          </div>
        ) : (
          <ResponsiveContainer>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isDark ? "#818cf8" : "#6366f1"}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor={isDark ? "#818cf8" : "#6366f1"}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="achievedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={isDark ? "#60a5fa" : "#3b82f6"}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor={isDark ? "#60a5fa" : "#3b82f6"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={
                  isDark ? "rgba(75, 85, 99, 0.2)" : "rgba(229, 231, 235, 0.8)"
                }
              />
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
                stroke={isDark ? "#9ca3af" : "#6b7280"}
                tickFormatter={(value) => {
                  // Show abbreviated date for better fit
                  const date = new Date(value);
                  return date.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                stroke={isDark ? "#9ca3af" : "#6b7280"}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}h`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="targetHours"
                name="Target"
                stroke={isDark ? "#818cf8" : "#6366f1"}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#targetGradient)"
                activeDot={{
                  r: 6,
                  stroke: isDark ? "#818cf8" : "#6366f1",
                  strokeWidth: 2,
                  fill: isDark ? "#000" : "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="achievedHours"
                name="Achieved"
                stroke={isDark ? "#60a5fa" : "#3b82f6"}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#achievedGradient)"
                activeDot={{
                  r: 6,
                  stroke: isDark ? "#60a5fa" : "#3b82f6",
                  strokeWidth: 2,
                  fill: isDark ? "#000" : "#fff",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default ProgressChart;
