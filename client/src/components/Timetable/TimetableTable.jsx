import React, { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, XCircle, Undo } from "lucide-react";

const Toast = ({ toast, isDark, onClose, onUndo }) => {
  if (!toast) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-md flex items-center space-x-3 
        ${
          toast.type === "success"
            ? isDark
              ? "bg-green-950 text-green-300 border border-green-900"
              : "bg-green-50 text-green-700 border border-green-200"
            : toast.type === "error"
            ? isDark
              ? "bg-red-950 text-red-300 border border-red-900"
              : "bg-red-50 text-red-700 border border-red-200"
            : isDark
            ? "bg-blue-950 text-blue-300 border border-blue-900"
            : "bg-blue-50 text-blue-700 border border-blue-200"
        }`}
    >
      {toast.type === "success" ? (
        <CheckCircle className="w-5 h-5" />
      ) : toast.type === "error" ? (
        <XCircle className="w-5 h-5" />
      ) : null}

      <span className="text-sm flex-grow ml-2">{toast.message}</span>

      {toast.undoAction && (
        <button
          onClick={onUndo}
          className={`flex items-center gap-1 px-2 py-1 rounded transition-all
            ${
              isDark
                ? "hover:bg-white/10 text-gray-300"
                : "hover:bg-black/5 text-gray-600"
            }`}
        >
          <Undo className="w-4 h-4" />
          Undo
        </button>
      )}

      <button
        onClick={onClose}
        className={`ml-2 rounded-full p-1 transition-all hover:bg-black/10
          ${
            isDark
              ? "hover:bg-white/10 text-gray-300"
              : "hover:bg-black/5 text-gray-600"
          }`}
      >
        ✕
      </button>
    </motion.div>
  );
};

const useToast = () => {
  const [toast, setToast] = useState(null);

  const addToast = (message, type = "info", undoAction = null) => {
    const id = Date.now();
    const newToast = { id, message, type, undoAction };

    setToast(newToast);

    const timeoutId = setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
      setToast(null);
    };
  };

  const removeToast = () => {
    setToast(null);
  };

  const undoLastAction = () => {
    if (toast && toast.undoAction) {
      toast.undoAction();
      removeToast();
    }
  };

  return { toast, addToast, removeToast, undoLastAction };
};

const TimetableTableBase = ({
  currentWeek,
  isDark,
  toggleActivityStatus,
  getCategoryStyle,
  formatTimeRange,
}) => {
  const { toast, addToast, removeToast, undoLastAction } = useToast();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
  const handleToggleActivityStatus = useCallback(
    (activityId, dayIndex) => {
      const activity = currentWeek.activities.find((a) => a._id === activityId);
      const currentStatus = activity.dailyStatus[dayIndex];
      
      const undoAction = () => {
        toggleActivityStatus(activityId, dayIndex);
      };
      
      toggleActivityStatus(activityId, dayIndex);
      
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

  const handleKeyboardToggle = useCallback(
    (e, activityId, dayIndex) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleToggleActivityStatus(activityId, dayIndex);
      }
    },
    [handleToggleActivityStatus]
  );

  const tableKey = currentWeek?.weekStartDate || "timetable";

  return (
    <div className="relative overflow-x-auto">
      <AnimatePresence>
        {toast && (
          <Toast
            toast={toast}
            isDark={isDark}
            onClose={removeToast}
            onUndo={toast.undoAction ? undoLastAction : undefined}
          />
        )}
      </AnimatePresence>

      <motion.table
        key={tableKey}
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

const TimetableTable = memo(TimetableTableBase);

export default TimetableTable;
