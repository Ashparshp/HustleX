import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";
import { Hash, AlertCircle } from "lucide-react";

const PlatformDistribution = ({ data = {} }) => {
  const { isDark } = useTheme();
  const [chartData, setChartData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const PLATFORM_COLORS = {
    LeetCode: "#FCD34D",
    CodeChef: "#60A5FA",
    CodeForces: "#F87171",
    HackerRank: "#34D399",
    AtCoder: "#A78BFA",
    TopCoder: "#FB923C",
  };

  const DEFAULT_COLORS = [
    "#6366F1",
    "#EC4899",
    "#8B5CF6",
    "#14B8A6",
    "#F97316",
    "#06B6D4",
  ];

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      setChartData([]);
      return;
    }

    const processedData = Object.entries(data).map(
      ([platform, stats], index) => {
        const color =
          PLATFORM_COLORS[platform] ||
          DEFAULT_COLORS[index % DEFAULT_COLORS.length];

        return {
          name: platform,
          total: stats.total,
          participated: stats.participated,
          color: color,
        };
      }
    );

    processedData.sort((a, b) => b.total - a.total);

    setChartData(processedData);
  }, [data]);

  const handlePieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    const data = payload[0].payload;
    const participationRate =
      data.total > 0 ? ((data.participated / data.total) * 100).toFixed(1) : 0;

    return (
      <div
        className={`p-3 rounded-lg shadow-lg border ${
          isDark
            ? "bg-gray-800 text-white border-gray-700"
            : "bg-white text-gray-900 border-gray-200"
        }`}
      >
        <p className="font-medium">{data.name}</p>
        <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Total: {data.total} contests
        </p>
        <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Participated: {data.participated} ({participationRate}%)
        </p>
      </div>
    );
  };

  const renderSummaryTable = () => {
    return (
      <div className="mt-4">
        <h3
          className={`text-lg font-medium mb-3 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Platform Usage Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? "text-gray-400" : "text-gray-600"}>
                <th className="text-left py-2">Platform</th>
                <th className="text-center py-2">Total</th>
                <th className="text-center py-2">Participated</th>
                <th className="text-center py-2">Rate</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDark ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {chartData.map((platform, index) => {
                const participationRate =
                  platform.total > 0
                    ? ((platform.participated / platform.total) * 100).toFixed(
                        1
                      )
                    : 0;

                return (
                  <tr
                    key={platform.name}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    className={`${
                      activeIndex === index
                        ? isDark
                          ? "bg-gray-700"
                          : "bg-gray-100"
                        : ""
                    } transition-colors`}
                  >
                    <td className="py-2 flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: platform.color }}
                      ></div>
                      {platform.name}
                    </td>
                    <td className="text-center py-2">{platform.total}</td>
                    <td className="text-center py-2">
                      {platform.participated}
                    </td>
                    <td className="text-center py-2">
                      <span
                        className={getParticipationRateColor(
                          parseFloat(participationRate)
                        )}
                      >
                        {participationRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const getParticipationRateColor = (rate) => {
    if (rate >= 70) {
      return isDark ? "text-green-400" : "text-green-600";
    } else if (rate >= 40) {
      return isDark ? "text-yellow-400" : "text-yellow-600";
    } else {
      return isDark ? "text-red-400" : "text-red-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      <div
        className={`flex-1 flex flex-col relative p-4 rounded-lg border transition-all duration-300
        ${
          isDark
            ? "bg-black border-purple-500/30 group-hover:border-purple-400"
            : "bg-white border-purple-300/50 group-hover:border-purple-500"
        }`}
      >
        <h3
          className={`text-lg font-semibold flex items-center mb-4 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          <Hash
            className={`mr-2 ${isDark ? "text-purple-400" : "text-purple-600"}`}
          />
          Platform Distribution
        </h3>

        {chartData.length > 0 ? (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="total"
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    onMouseEnter={handlePieEnter}
                    onMouseLeave={() => setActiveIndex(null)}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={isDark ? "#111" : "#fff"}
                        strokeWidth={activeIndex === index ? 2 : 1}
                        opacity={
                          activeIndex === null || activeIndex === index
                            ? 1
                            : 0.6
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {renderSummaryTable()}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <AlertCircle
              className={`w-16 h-16 ${
                isDark ? "text-gray-700" : "text-gray-300"
              }`}
            />
            <p className={`mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              No platform data available
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlatformDistribution;
