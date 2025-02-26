import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const StatsCard = ({ title, value, description, icon: Icon, trend, color }) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`relative group`}
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
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {title}
            </h3>
            <p className={`text-2xl font-bold mt-2 ${color} truncate`}>
              {value}
            </p>
            {description && (
              <p
                className={`text-sm mt-2 truncate ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {description}
              </p>
            )}
            {trend !== undefined && (
              <div className="mt-3 flex items-center gap-1.5">
                <TrendingUp
                  className={`w-4 h-4 ${
                    trend >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    trend >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {trend > 0 ? "+" : ""}
                  {trend}%
                </span>
              </div>
            )}
          </div>

          <div
            className={`p-3 rounded-lg transition-colors duration-300
            ${
              isDark
                ? "bg-indigo-500/10 group-hover:bg-indigo-500/20"
                : "bg-indigo-100/50 group-hover:bg-indigo-200/70"
            }`}
          >
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
