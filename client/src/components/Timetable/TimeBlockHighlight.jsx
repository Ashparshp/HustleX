// src/components/Timetable/TimeBlockHighlight.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle } from "lucide-react";

const TimeBlockHighlight = ({
  isDark,
  toggleActivityStatus,
  getCategoryStyle,
  formatTimeRange,
  currentWeek,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDayIndex = useMemo(() => {
    const day = currentTime.getDay();
    return day === 0 ? 6 : day - 1;
  }, [currentTime]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const activeTimeBlock = useMemo(() => {
    if (!currentWeek?.activities) return null;

    const now = currentTime;
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      const time = new Date(now);
      time.setHours(hours, minutes, 0, 0);
      return time;
    };

    return currentWeek.activities.find((activity) => {
      const [startTime, endTime] = activity.activity.time.split("-");
      let start = parseTime(startTime);
      let end = parseTime(endTime);

      // Handle time ranges that cross midnight
      if (end < start) end.setDate(end.getDate() + 1);

      return now >= start && now <= end;
    });
  }, [currentTime, currentWeek]);

  if (!activeTimeBlock) return null;

  const style = getCategoryStyle();
  const isCompleted = activeTimeBlock.dailyStatus[currentDayIndex];

  return (
    <div
      className={`max-w-3xl mx-auto rounded-lg border shadow-sm overflow-hidden mb-4 ${
        isDark ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      <table className="w-full table-fixed">
        <thead
          className={
            isDark
              ? "bg-gray-950 border-b border-gray-800"
              : "bg-gray-100 border-b border-gray-200"
          }
        >
          <tr>
            <th className="w-1/2">
              <div
                className={`py-2 px-1 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Current Activity
              </div>
            </th>
            <th className="w-1/4">
              <div
                className={`py-2 px-1 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <div className="flex items-center gap-1 justify-center">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  Time
                </div>
              </div>
            </th>
            <th className="w-1/4">
              <div
                className={`py-2 px-1 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {days[currentDayIndex]}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <motion.tr
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`transition-all duration-200 group ${style.bg}`}
          >
            <td className="py-3 px-2">
              <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`mx-auto max-w-xs text-center px-3 py-1.5 text-[10px] sm:text-xs rounded-md font-medium border ${
                  style.border
                } 
                  group-hover:scale-[1.02] transition-transform
                  ${
                    isDark
                      ? "bg-gray-950 text-gray-300"
                      : "bg-white text-gray-700"
                  }`}
              >
                {activeTimeBlock.activity.name}
              </motion.div>
            </td>
            <td className="py-3 px-2">
              <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`mx-auto max-w-xs text-center px-2 py-1.5 text-[10px] sm:text-xs rounded-md border
                  ${
                    isDark
                      ? "bg-gray-950 text-gray-400 border-gray-900"
                      : "bg-white text-gray-600 border-gray-200"
                  }`}
              >
                {formatTimeRange(activeTimeBlock.activity.time)}
              </motion.div>
            </td>
            <td className="py-3 px-2">
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    toggleActivityStatus(activeTimeBlock._id, currentDayIndex)
                  }
                  className={`p-1.5 rounded-md transition-all duration-200 ${
                    isDark
                      ? isCompleted
                        ? "bg-green-950 hover:bg-green-900"
                        : "bg-red-950 hover:bg-red-900"
                      : isCompleted
                      ? "bg-green-50 hover:bg-green-100"
                      : "bg-red-50 hover:bg-red-100"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        isDark ? "text-green-500" : "text-green-600"
                      }`}
                    />
                  ) : (
                    <XCircle
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        isDark ? "text-red-500" : "text-red-600"
                      }`}
                    />
                  )}
                </motion.button>
              </div>
            </td>
          </motion.tr>
        </tbody>
      </table>
    </div>
  );
};

export default TimeBlockHighlight;
