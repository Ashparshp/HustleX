import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Target,
  Tag,
  AlertTriangle,
  X,
  CheckCircle,
  MoreVertical,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ScheduleCard = ({
  schedule,
  onEdit,
  onDelete,
  onUpdateItem,
  onDeleteItem,
}) => {
  const { isDark } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const getStatusVariants = {
    Completed: {
      color: isDark
        ? "text-green-300 bg-green-500/20"
        : "text-green-600 bg-green-100",
      icon: Target,
    },
    "In Progress": {
      color: isDark
        ? "text-yellow-300 bg-yellow-500/20"
        : "text-yellow-600 bg-yellow-100",
      icon: AlertTriangle,
    },
    Planned: {
      color: isDark
        ? "text-blue-300 bg-blue-500/20"
        : "text-blue-600 bg-blue-100",
      icon: Calendar,
    },
  };

  const getPriorityVariants = {
    High: {
      color: isDark ? "text-red-300 bg-red-500/20" : "text-red-600 bg-red-100",
    },
    Medium: {
      color: isDark
        ? "text-yellow-300 bg-yellow-500/20"
        : "text-yellow-600 bg-yellow-100",
    },
    Low: {
      color: isDark
        ? "text-green-300 bg-green-500/20"
        : "text-green-600 bg-green-100",
    },
  };

  const calculateProgress = () => {
    if (!schedule.items.length) return 0;
    const completed = schedule.items.filter((item) => item.completed).length;
    return Math.round((completed / schedule.items.length) * 100);
  };

  const calculateTotalHours = () => {
    return schedule.items
      .reduce((total, item) => {
        const start = new Date(`2000-01-01T${item.startTime}`);
        const end = new Date(`2000-01-01T${item.endTime}`);
        return total + (end - start) / (1000 * 60 * 60);
      }, 0)
      .toFixed(1);
  };

  const { color: statusColor, icon: StatusIcon } =
    getStatusVariants[schedule.status] || getStatusVariants.Planned;

  const handleConfirmDelete = async () => {
    try {
      await onDelete(schedule._id);
    } catch (error) {
      console.error("Deletion error:", error);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      {/* Enhanced Glossy Effect */}
      <div
        className={`absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-700 blur-lg
        ${
          isDark
            ? "bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-purple-600/20"
            : "bg-gradient-to-r from-blue-200/30 via-violet-200/30 to-purple-200/30"
        }`}
      />

      {/* Ring Effect */}
      <div
        className={`absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-700
        ${
          isDark
            ? "bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-purple-500/10"
            : "bg-gradient-to-r from-blue-200/20 via-violet-200/20 to-purple-200/20"
        }`}
      />

      <div
        className={`relative p-6 rounded-xl border shadow-xl backdrop-blur-sm transition-all duration-500
          ${
            isDark
              ? "bg-black/90 border-gray-800 hover:border-indigo-500/30 hover:shadow-indigo-500/10"
              : "bg-white border-gray-200 hover:border-indigo-300"
          }`}
      >
        {isDeleting ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-4"
          >
            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-red-500/20 text-red-300" : "bg-red-50 text-red-700"
              }`}
            >
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-70" />
              <p className="mb-4">
                Are you sure you want to delete this schedule?
              </p>
              <div className="flex justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirmDelete}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isDark
                      ? "bg-red-500/30 text-red-300 hover:bg-red-500/40"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
                >
                  Confirm Delete
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDeleting(false)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isDark
                      ? "bg-gray-900 text-gray-300 hover:bg-gray-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Header Section */}
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2 flex-grow">
                <div className="flex items-center gap-3">
                  <StatusIcon className={`w-6 h-6 ${statusColor}`} />
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <span
                        className={`font-semibold text-lg ${
                          isDark ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {new Date(schedule.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full font-medium ${statusColor}`}
                      >
                        {schedule.status}
                      </span>
                    </div>
                    <div
                      className={`text-sm mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {schedule.dayType}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setActiveMenu(activeMenu === "actions" ? null : "actions")
                  }
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-gray-800 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <MoreVertical className="w-5 h-5" />
                </motion.button>

                <AnimatePresence>
                  {activeMenu === "actions" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className={`absolute top-full right-0 mt-2 w-48 rounded-lg shadow-xl z-10 backdrop-blur-sm
                        ${
                          isDark
                            ? "bg-black/90 border border-gray-800"
                            : "bg-white border border-gray-200"
                        }`}
                    >
                      <div className="py-1">
                        <motion.button
                          whileHover={{
                            backgroundColor: isDark
                              ? "rgba(31, 41, 55, 0.5)"
                              : "rgba(243, 244, 246, 0.5)",
                          }}
                          onClick={() => {
                            onEdit(schedule);
                            setActiveMenu(null);
                          }}
                          className={`w-full flex items-center px-4 py-2 text-sm
                            ${
                              isDark
                                ? "text-gray-300 hover:bg-gray-800"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Schedule
                        </motion.button>
                        <motion.button
                          whileHover={{
                            backgroundColor: isDark
                              ? "rgba(220, 38, 38, 0.1)"
                              : "rgba(254, 226, 226, 0.5)",
                          }}
                          onClick={() => {
                            setIsDeleting(true);
                            setActiveMenu(null);
                          }}
                          className={`w-full flex items-center px-4 py-2 text-sm
                            ${
                              isDark
                                ? "text-red-400 hover:bg-red-500/10"
                                : "text-red-600 hover:bg-red-50"
                            }`}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Schedule
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Progress Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-3 mt-4"
            >
              <div className="flex justify-between items-center text-sm">
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Progress
                </span>
                <span className={`font-medium ${statusColor}`}>
                  {calculateProgress()}%
                </span>
              </div>
              <div
                className={`w-full rounded-full h-2 overflow-hidden ${
                  isDark ? "bg-gray-800" : "bg-gray-200"
                }`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateProgress()}%` }}
                  transition={{ duration: 1, type: "spring", stiffness: 50 }}
                  className={`h-full rounded-full ${
                    schedule.status === "Completed"
                      ? "bg-green-400"
                      : schedule.status === "In Progress"
                      ? "bg-yellow-400"
                      : "bg-indigo-400"
                  }`}
                />
              </div>
            </motion.div>

            {/* Stats Section */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded-lg transition-colors ${
                  isDark ? "bg-gray-900/50 hover:bg-gray-900" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Clock
                    className={`w-4 h-4 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium uppercase tracking-wider ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Total Hours
                  </span>
                </div>
                <span
                  className={`text-base font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {calculateTotalHours()}h
                </span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded-lg transition-colors ${
                  isDark ? "bg-gray-900/50 hover:bg-gray-900" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Tag
                    className={`w-4 h-4 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium uppercase tracking-wider ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Total Tasks
                  </span>
                </div>
                <span
                  className={`text-base font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {schedule.items.length}
                </span>
              </motion.div>
            </div>

            {/* Show/Hide Tasks Button */}
            <motion.button
              onClick={() => setShowItems(!showItems)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`mt-4 w-full flex items-center justify-center p-2 rounded-lg transition-colors ${
                isDark
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {showItems ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
              <span className="ml-2 text-sm">
                {showItems ? "Hide Tasks" : "Show Tasks"}
              </span>
            </motion.button>

            {/* Tasks Section */}
            <AnimatePresence>
              {showItems && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`mt-4 space-y-4 border-t pt-4 ${
                    isDark ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  {schedule.items.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border backdrop-blur-sm transition-all duration-300
                        ${
                          isDark
                            ? "bg-gray-900/50 border-gray-800 hover:bg-gray-900/80"
                            : "bg-gray-50 border-gray-200"
                        }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-grow">
                          <div className="flex items-center gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                onUpdateItem(schedule._id, item._id, {
                                  completed: !item.completed,
                                })
                              }
                              className={`p-1.5 rounded-full transition-colors ${
                                item.completed
                                  ? isDark
                                    ? "text-green-300 bg-green-500/20"
                                    : "text-green-600 bg-green-100"
                                  : isDark
                                  ? "text-gray-500 hover:bg-gray-800"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              <CheckCircle
                                className={`w-5 h-5 ${
                                  item.completed
                                    ? "fill-current"
                                    : "stroke-current"
                                }`}
                              />
                            </motion.button>
                            <div className="flex-grow">
                              <div className="flex items-center gap-3">
                                <h5
                                  className={`font-medium text-base ${
                                    item.completed
                                      ? isDark
                                        ? "text-gray-500 line-through"
                                        : "text-gray-400 line-through"
                                      : isDark
                                      ? "text-white"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {item.title}
                                </h5>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    getPriorityVariants[item.priority]?.color ||
                                    getPriorityVariants.Medium.color
                                  }`}
                                >
                                  {item.priority}
                                </span>
                              </div>
                              {item.description && (
                                <p
                                  className={`text-sm mt-1 ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm mt-2">
                            <div className="flex items-center gap-2">
                              <Clock
                                className={`w-4 h-4 ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                }`}
                              />
                              <span
                                className={
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }
                              >
                                {item.startTime} - {item.endTime}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                isDark
                                  ? "bg-indigo-500/20 text-indigo-300"
                                  : "bg-indigo-100 text-indigo-600"
                              }`}
                            >
                              {item.category}
                            </span>
                          </div>
                          {item.notes && (
                            <p
                              className={`text-xs mt-1 ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {item.notes}
                            </p>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDeleteItem(schedule._id, item._id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark
                              ? "hover:bg-red-500/20 text-red-400"
                              : "hover:bg-red-50 text-red-600"
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ScheduleCard;
