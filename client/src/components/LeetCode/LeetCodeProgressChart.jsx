// src/components/LeetCode/LeetCodeProgressChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { AlertCircle } from "lucide-react";

const LeetCodeProgressChart = ({ data = [] }) => {
  const { isDark } = useTheme();

  // Process data for the chart
  const processChartData = () => {
    if (!data || data.length === 0) return [];

    // Sort data by date
    const sortedData = [...data].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    // Format data for the chart
    return sortedData.map((entry) => {
      const date = new Date(entry.createdAt);
      return {
        date: date.toLocaleDateString(),
        timestamp: date.getTime(),
        totalSolved: entry.totalSolved || 0,
        easySolved: entry.easySolved || 0,
        mediumSolved: entry.mediumSolved || 0,
        hardSolved: entry.hardSolved || 0,
        ranking: entry.ranking,
      };
    });
  };

  const chartData = processChartData();

  // Handle empty data
  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle
          size={48}
          className={isDark ? "text-gray-600" : "text-gray-400"}
        />
        <p className={`mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          No historical data available to display progress
        </p>
      </div>
    );
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div
        className={`p-3 rounded-lg shadow-md border ${
          isDark
            ? "bg-gray-800 text-white border-gray-700"
            : "bg-white text-gray-900 border-gray-200"
        }`}
      >
        <p className="font-medium">{label}</p>
        <div className="mt-2 space-y-1">
          <p
            className={`text-sm flex items-center justify-between gap-4 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <span>Total Problems:</span>
            <span className="font-semibold">{data.totalSolved}</span>
          </p>
          <p
            className={`text-sm flex items-center justify-between gap-4 ${
              isDark ? "text-green-400" : "text-green-600"
            }`}
          >
            <span>Easy:</span>
            <span className="font-semibold">{data.easySolved}</span>
          </p>
          <p
            className={`text-sm flex items-center justify-between gap-4 ${
              isDark ? "text-yellow-400" : "text-yellow-600"
            }`}
          >
            <span>Medium:</span>
            <span className="font-semibold">{data.mediumSolved}</span>
          </p>
          <p
            className={`text-sm flex items-center justify-between gap-4 ${
              isDark ? "text-red-400" : "text-red-600"
            }`}
          >
            <span>Hard:</span>
            <span className="font-semibold">{data.hardSolved}</span>
          </p>
          {data.ranking && (
            <p
              className={`text-sm flex items-center justify-between gap-4 ${
                isDark ? "text-amber-400" : "text-amber-600"
              }`}
            >
              <span>Ranking:</span>
              <span className="font-semibold">
                {data.ranking.toLocaleString()}
              </span>
            </p>
          )}
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
        className={`relative rounded-lg border h-full backdrop-blur-sm transition-all duration-300
        ${
          isDark
            ? "bg-black/90 border-orange-500/30 group-hover:border-orange-400"
            : "bg-white/90 border-orange-300/50 group-hover:border-orange-500"
        }`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={
                isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
              }
            />
            <XAxis
              dataKey="date"
              stroke={isDark ? "#9ca3af" : "#6b7280"}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="problems"
              stroke={isDark ? "#9ca3af" : "#6b7280"}
              tick={{ fontSize: 12 }}
              domain={[0, "auto"]}
            />
            {chartData.some((entry) => entry.ranking) && (
              <YAxis
                yAxisId="ranking"
                orientation="right"
                stroke={isDark ? "#fbbf24" : "#d97706"}
                tick={{ fontSize: 12 }}
                domain={["auto", "auto"]}
                tickFormatter={(value) => value.toLocaleString()}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="problems"
              type="monotone"
              dataKey="totalSolved"
              name="Total Problems"
              stroke={isDark ? "#60a5fa" : "#3b82f6"}
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="problems"
              type="monotone"
              dataKey="easySolved"
              name="Easy"
              stroke={isDark ? "#34d399" : "#10b981"}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              yAxisId="problems"
              type="monotone"
              dataKey="mediumSolved"
              name="Medium"
              stroke={isDark ? "#fbbf24" : "#d97706"}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              yAxisId="problems"
              type="monotone"
              dataKey="hardSolved"
              name="Hard"
              stroke={isDark ? "#f87171" : "#ef4444"}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            {chartData.some((entry) => entry.ranking) && (
              <Line
                yAxisId="ranking"
                type="monotone"
                dataKey="ranking"
                name="Ranking"
                stroke={isDark ? "#c084fc" : "#a855f7"}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default LeetCodeProgressChart;
