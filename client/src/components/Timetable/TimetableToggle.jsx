import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Circle,
  Clock,
  Calendar,
  TrendingUp,
  Play,
  Pause,
  Square,
  Timer,
} from "lucide-react";
import { toast } from "react-hot-toast";

const TimetableToggle = ({
  activity,
  dayIndex,
  dayName,
  onToggle,
  isDark,
  showTimer = false,
  onStartTimer,
  onStopTimer,
  isTimerActive = false,
  timeSpent = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isCompleted = activity.dailyStatus[dayIndex];

  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handleToggle = useCallback(() => {
    onToggle(activity._id, dayIndex);

    // Haptic feedback simulation
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    // Toast notification
    const status = !isCompleted ? "completed" : "not completed";
    toast.success(
      `${activity.activity.name} marked as ${status} for ${dayName}`,
      {
        duration: 2000,
        style: {
          background: isDark ? "#374151" : "#f3f4f6",
          color: isDark ? "#f9fafb" : "#111827",
        },
      }
    );
  }, [activity, dayIndex, dayName, onToggle, isCompleted, isDark]);

  const handleTimerToggle = useCallback(() => {
    if (isTimerActive) {
      onStopTimer?.(activity._id, dayIndex);
    } else {
      onStartTimer?.(activity._id, dayIndex);
    }
  }, [isTimerActive, onStartTimer, onStopTimer, activity._id, dayIndex]);

  const toggleVariants = useMemo(
    () => ({
      initial: {
        scale: 1,
        rotate: 0,
      },
      hover: {
        scale: 1.1,
        transition: { duration: 0.2 },
      },
      tap: {
        scale: 0.9,
        transition: { duration: 0.1 },
      },
      completed: {
        scale: [1, 1.2, 1],
        rotate: [0, 10, -10, 0],
        transition: { duration: 0.6 },
      },
    }),
    []
  );

  const timerVariants = useMemo(
    () => ({
      initial: { scale: 1 },
      hover: { scale: 1.05 },
      tap: { scale: 0.95 },
      active: {
        scale: [1, 1.1, 1],
        transition: {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        },
      },
    }),
    []
  );

  const getToggleColors = useCallback(() => {
    if (isCompleted) {
      return {
        bg: isDark
          ? "bg-emerald-500/20 border-emerald-400/50"
          : "bg-emerald-50 border-emerald-300",
        icon: isDark ? "text-emerald-400" : "text-emerald-600",
        hover: isDark
          ? "hover:bg-emerald-500/30 hover:border-emerald-400/70"
          : "hover:bg-emerald-100 hover:border-emerald-400",
      };
    }

    return {
      bg: isDark
        ? "bg-gray-700/50 border-gray-600/50"
        : "bg-gray-50 border-gray-300",
      icon: isDark ? "text-gray-400" : "text-gray-500",
      hover: isDark
        ? "hover:bg-gray-600/50 hover:border-gray-500/70"
        : "hover:bg-gray-100 hover:border-gray-400",
    };
  }, [isCompleted, isDark]);

  const colors = getToggleColors();

  return (
    <div className="flex items-center gap-2">
      {/* Main Toggle Button */}
      <motion.button
        variants={toggleVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        animate={isPressed ? "completed" : "initial"}
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative p-2.5 rounded-xl border-2 transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${colors.bg} ${colors.hover}
          ${
            isDark
              ? "focus:ring-indigo-400 focus:ring-offset-gray-900"
              : "focus:ring-indigo-500 focus:ring-offset-white"
          }
          ${isPressed ? "shadow-lg" : "shadow-sm"}
        `}
        aria-label={`Toggle ${activity.activity.name} for ${dayName}`}
        role="checkbox"
        aria-checked={isCompleted}
      >
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <motion.div
              key="completed"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle className={`w-5 h-5 ${colors.icon}`} />
            </motion.div>
          ) : (
            <motion.div
              key="incomplete"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ duration: 0.3 }}
            >
              <Circle className={`w-5 h-5 ${colors.icon}`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ripple Effect */}
        <AnimatePresence>
          {isPressed && (
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className={`
                absolute inset-0 rounded-xl
                ${isCompleted ? "bg-emerald-400/30" : "bg-gray-400/30"}
              `}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Timer Button (Optional) */}
      {showTimer && (
        <motion.button
          variants={timerVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          animate={isTimerActive ? "active" : "initial"}
          onClick={handleTimerToggle}
          className={`
            p-2 rounded-lg border transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              isTimerActive
                ? isDark
                  ? "bg-blue-500/20 border-blue-400/50 text-blue-400"
                  : "bg-blue-50 border-blue-300 text-blue-600"
                : isDark
                ? "bg-gray-700/50 border-gray-600/50 text-gray-400 hover:bg-gray-600/50"
                : "bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100"
            }
            ${
              isDark
                ? "focus:ring-blue-400 focus:ring-offset-gray-900"
                : "focus:ring-blue-500 focus:ring-offset-white"
            }
          `}
          aria-label={`${isTimerActive ? "Stop" : "Start"} timer for ${
            activity.activity.name
          }`}
        >
          {isTimerActive ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </motion.button>
      )}

      {/* Timer Display */}
      {showTimer && timeSpent > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`
            px-2 py-1 rounded-md text-xs font-mono
            ${
              isDark
                ? "bg-gray-800/50 text-gray-300 border border-gray-700/50"
                : "bg-gray-100 text-gray-600 border border-gray-200"
            }
          `}
        >
          <Timer className="w-3 h-3 inline mr-1" />
          {formatTime(timeSpent)}
        </motion.div>
      )}

      {/* Hover Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10
              px-3 py-2 rounded-lg shadow-lg border text-xs font-medium whitespace-nowrap
              ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "bg-white border-gray-200 text-gray-700"
              }
            `}
          >
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {dayName}
            </div>
            <div
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {isCompleted ? "Completed" : "Not completed"}
            </div>

            {/* Tooltip Arrow */}
            <div
              className={`
                absolute bottom-full left-1/2 transform -translate-x-1/2
                w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent
                ${isDark ? "border-b-gray-800" : "border-b-white"}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimetableToggle;
