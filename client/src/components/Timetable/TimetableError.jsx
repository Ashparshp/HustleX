// src/components/Timetable/TimetableError.jsx
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const TimetableError = ({
  error,
  onRetry,
  retryText = "Retry",
  customMessage,
}) => {
  const { isDark } = useTheme();

  // Enhanced color palette with more nuanced theme-aware colors
  const colors = {
    light: {
      bg: "bg-red-50/80 border-red-100/50",
      text: "text-red-900",
      icon: "text-red-600",
      heading: "text-red-950",
      subtext: "text-red-800",
      button: {
        bg: "bg-red-100 hover:bg-red-200",
        text: "text-red-700 hover:text-red-900",
        border: "border-red-200 hover:border-red-300",
      },
    },
    dark: {
      bg: "bg-gray-900/80 border-red-900/30",
      text: "text-red-200",
      icon: "text-red-500",
      heading: "text-red-100",
      subtext: "text-red-300",
      button: {
        bg: "bg-red-900/30 hover:bg-red-900/50",
        text: "text-red-300 hover:text-red-200",
        border: "border-red-800/40 hover:border-red-800/60",
      },
    },
  };

  const theme = isDark ? colors.dark : colors.light;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`
        container mx-auto px-4 py-6
        ${isDark ? "bg-black/90 text-gray-100" : "bg-gray-50 text-gray-900"}
      `}
    >
      <div
        className={`
          max-w-md mx-auto p-6 rounded-2xl text-center
          border shadow-lg backdrop-blur-sm
          ${theme.bg} ${theme.text}
          transition-all duration-300
        `}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{
            rotate: [0, -10, 10, -10, 0],
            transition: { duration: 0.5 },
          }}
          className="mb-4 flex justify-center"
        >
          <AlertTriangle
            className={`
              w-14 h-14 drop-shadow-md
              ${theme.icon}
            `}
          />
        </motion.div>

        <h2
          className={`
            text-2xl font-bold mb-3 tracking-tight
            ${theme.heading}
          `}
        >
          Timetable Error
        </h2>

        <p
          className={`
            mb-5 text-sm leading-relaxed
            ${theme.subtext}
          `}
        >
          {customMessage ||
            error ||
            "Unable to load timetable data. Please check your connection or try again."}
        </p>

        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className={`
              flex items-center justify-center gap-2
              w-full py-3 rounded-xl
              text-base font-semibold
              transition-all duration-300
              ${theme.button.bg}
              ${theme.button.text}
              ${theme.button.border}
              border
              focus:outline-none focus:ring-2 focus:ring-red-500/50
            `}
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            {retryText}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default TimetableError;