// src/components/Timetable/TimetableTable.jsx
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, XCircle, Info, Undo } from "lucide-react";

// Toast Component
const Toast = ({ message, type, onClose, onUndo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg flex items-center space-x-3
        ${
          type === "success"
            ? "bg-green-500 text-white"
            : type === "error"
            ? "bg-red-500 text-white"
            : "bg-blue-500 text-white"
        }`}
    >
      <Info className="w-5 h-5" />
      <span className="text-sm flex-grow">{message}</span>
      {onUndo && (
        <button
          onClick={onUndo}
          className="ml-2 flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-all"
        >
          <Undo className="w-4 h-4" />
          Undo
        </button>
      )}
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-75 transition-opacity"
      >
        ✕
      </button>
    </motion.div>
  );
};

// Toast Manager Hook
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const [lastAction, setLastAction] = useState(null);

  const addToast = (message, type = "info", undoAction = null) => {
    const id = Date.now();
    const newToast = { id, message, type, undoAction };
    setToasts((current) => [...current, newToast]);
    setLastAction(newToast);

    // Automatically remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const undoLastAction = () => {
    if (lastAction && lastAction.undoAction) {
      lastAction.undoAction();
      removeToast(lastAction.id);
      setLastAction(null);
    }
  };

  return { toasts, addToast, removeToast, undoLastAction };
};

const TimetableTable = ({
  currentWeek,
  isDark,
  toggleActivityStatus,
  getCategoryStyle,
  formatTimeRange,
}) => {
  const { toasts, addToast, removeToast, undoLastAction } = useToast();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Memoized variants to prevent unnecessary re-renders
  const containerVariants = React.useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
          delayChildren: 0.1,
        },
      },
    }),
    []
  );

  const rowVariants = React.useMemo(
    () => ({
      hidden: {
        opacity: 0,
        x: -20,
        scale: 0.98,
      },
      show: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
          type: "tween",
          duration: 0.3,
        },
      },
      exit: {
        opacity: 0,
        x: 20,
        scale: 0.98,
        transition: {
          duration: 0.2,
        },
      },
    }),
    []
  );

  const statusButtonVariants = React.useMemo(
    () => ({
      initial: { scale: 1 },
      hover: {
        scale: 1.05,
        transition: { duration: 0.2 },
      },
      tap: {
        scale: 0.95,
        transition: { duration: 0.1 },
      },
    }),
    []
  );

  // Enhanced toggle activity status with undo functionality
  const handleToggleActivityStatus = useCallback(
    (activityId, dayIndex) => {
      // Find the current activity
      const activity = currentWeek.activities.find((a) => a._id === activityId);

      // Get the current status for this day
      const currentStatus = activity.dailyStatus[dayIndex];

      // Prepare undo action
      const undoAction = () => {
        toggleActivityStatus(activityId, dayIndex);
      };

      // Call toggle with the OPPOSITE of current status
      toggleActivityStatus(activityId, dayIndex);

      // Add toast with the NEW status and undo option
      addToast(
        `${activity.activity.name} marked as ${
          !currentStatus ? "completed" : "not completed"
        } for ${days[dayIndex]}`,
        !currentStatus ? "success" : "error",
        undoAction
      );
    },
    [currentWeek, toggleActivityStatus, addToast, days]
  );

  // Keyboard accessibility for status toggle
  const handleKeyboardToggle = useCallback(
    (e, activityId, dayIndex) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleToggleActivityStatus(activityId, dayIndex);
      }
    },
    [handleToggleActivityStatus]
  );

  return (
    <div className="relative overflow-x-auto">
      {/* Toast Container with Undo Functionality */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
            onUndo={toast.undoAction ? undoLastAction : undefined}
          />
        ))}
      </AnimatePresence>

      <motion.table
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full min-w-[800px] shadow-sm rounded-lg overflow-hidden"
      >
        <thead>
          <tr
            className={
              isDark
                ? "bg-gray-950 border-b border-gray-900"
                : "bg-gray-100 border-b border-gray-200"
            }
          >
            <th
              className={`p-3 text-center text-xs font-semibold uppercase tracking-wider ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Activity
            </th>
            <th
              className={`p-3 text-left text-xs font-semibold uppercase tracking-wider ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Clock
                  className={`w-4 h-4 ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                />
                Time
              </div>
            </th>
            {days.map((day) => (
              <th
                key={day}
                className={`p-3 text-center text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <motion.tbody
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={`${
            isDark ? "bg-black" : "bg-white"
          } divide-y divide-dashed`}
        >
          <AnimatePresence mode="popLayout">
            {currentWeek?.activities.map((activityItem) => {
              const style = getCategoryStyle();
              return (
                <motion.tr
                  key={activityItem._id}
                  variants={rowVariants}
                  layout
                  className={`transition-all duration-200 group ${style.bg} 
                      ${isDark ? "border-gray-900" : "border-gray-100"}`}
                >
                  <td className="p-3 text-center">
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`px-3 py-1.5 text-xs rounded-md font-medium border ${
                        style.border
                      } group-hover:scale-[1.02] transition-transform
                      ${
                        isDark
                          ? "bg-gray-950 text-gray-300"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      {activityItem.activity.name}
                    </motion.div>
                  </td>
                  <td className="p-3">
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className={`px-3 py-1.5 text-xs rounded-md text-center border
                          ${
                            isDark
                              ? "bg-gray-950 text-gray-400 border-gray-900"
                              : "bg-white text-gray-600 border-gray-200"
                          }`}
                    >
                      {formatTimeRange(activityItem.activity.time)}
                    </motion.div>
                  </td>
                  {activityItem.dailyStatus.map((status, dayIndex) => (
                    <td key={dayIndex} className="p-3 text-center">
                      <motion.button
                        variants={statusButtonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() =>
                          handleToggleActivityStatus(activityItem._id, dayIndex)
                        }
                        onKeyDown={(e) =>
                          handleKeyboardToggle(e, activityItem._id, dayIndex)
                        }
                        tabIndex={0}
                        aria-label={`Toggle ${activityItem.activity.name} status for ${days[dayIndex]}`}
                        className={`p-1.5 rounded-md transition-all duration-200 focus:outline-none 
                            ${
                              isDark
                                ? status
                                  ? "bg-green-950 hover:bg-green-900 focus:ring-green-700"
                                  : "bg-red-950 hover:bg-red-900 focus:ring-red-700"
                                : status
                                ? "bg-green-50 hover:bg-green-100 focus:ring-green-200"
                                : "bg-red-50 hover:bg-red-100 focus:ring-red-200"
                            }`}
                      >
                        {status ? (
                          <CheckCircle
                            className={`w-5 h-5 ${
                              isDark ? "text-green-500" : "text-green-600"
                            }`}
                          />
                        ) : (
                          <XCircle
                            className={`w-5 h-5 ${
                              isDark ? "text-red-500" : "text-red-600"
                            }`}
                          />
                        )}
                      </motion.button>
                    </td>
                  ))}
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </motion.tbody>
      </motion.table>
    </div>
  );
};

export default TimetableTable;
