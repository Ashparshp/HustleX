import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const CategoryChart = ({ data }) => {
  const { isDark } = useTheme();

  const getCategoryColor = (category) => {
    const COLORS = {
      Coding: isDark ? "#ef4444" : "#dc2626",
      Learning: isDark ? "#f59e0b" : "#d97706",
      "Project Work": isDark ? "#10b981" : "#059669",
      Other: isDark ? "#6366f1" : "#4f46e5",
      Development: isDark ? "#8b5cf6" : "#7c3aed",
      Research: isDark ? "#3b82f6" : "#2563eb",
      Meeting: isDark ? "#ec4899" : "#db2777",
      Planning: isDark ? "#14b8a6" : "#0d9488",
    };

    return COLORS[category] || (isDark ? "#6366f1" : "#4f46e5"); // Default to Indigo
  };

  const chartData = Object.entries(data || {})
    .map(([name, value]) => ({
      name,
      value: value || 0,
      percentage: 0,
    }))
    .sort((a, b) => b.value - a.value);

  const totalHours = chartData.reduce((sum, item) => sum + item.value, 0);
  chartData.forEach((item) => {
    item.percentage = ((item.value / totalHours) * 100).toFixed(1);
  });

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
        className={`relative p-6 rounded-lg border backdrop-blur-sm transition-all duration-300
        ${
          isDark
            ? "bg-black border-indigo-500/30 group-hover:border-indigo-400"
            : "bg-white border-indigo-300/50 group-hover:border-indigo-500"
        }`}
      >
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              No category data available
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {chartData.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg transition-all duration-300 ${
                  isDark ? "hover:bg-indigo-500/10" : "hover:bg-indigo-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: getCategoryColor(category.name),
                      }}
                    />
                    <span
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {category.value.toFixed(1)}h
                    </span>
                    <span
                      className={`font-medium ${
                        isDark ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    >
                      {category.percentage}%
                    </span>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: getCategoryColor(category.name),
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryChart;
