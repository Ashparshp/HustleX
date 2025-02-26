import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const FilterButton = ({ active, onClick, children, className = "", type }) => {
  const { isDark } = useTheme();

  const getColorClasses = () => {
    if (type === "add") {
      return isDark
        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400"
        : "bg-emerald-100/50 border-emerald-300/50 text-emerald-600 hover:bg-emerald-200/70 hover:border-emerald-500";
    }

    return active
      ? isDark
        ? "bg-indigo-500/20 border-indigo-400 text-indigo-300"
        : "bg-indigo-200/70 border-indigo-500 text-indigo-700"
      : isDark
      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
      : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500";
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-2 py-1.5 text-base rounded-lg flex items-center gap-1.5 transition-all duration-300 ${getColorClasses()} border ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default FilterButton;
