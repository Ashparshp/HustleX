import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Clock } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const SkeletonTimetable = () => {
  const { isDark } = useTheme();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const shimmer = {
    hidden: { x: "-100%" },
    visible: {
      x: "100%",
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      },
    },
  };

  const SkeletonRow = ({ index }) => (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative overflow-hidden ${
        isDark ? "hover:bg-gray-900/30" : "hover:bg-gray-50"
      }`}
    >
      <td className="p-3 sm:p-4">
        <div className="relative overflow-hidden">
          <div
            className={`h-4 w-32 rounded ${
              isDark ? "bg-gray-800" : "bg-gray-200"
            }`}
          >
            <motion.div
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className={`h-full w-1/2 ${
                isDark
                  ? "bg-gradient-to-r from-transparent via-gray-700/30 to-transparent"
                  : "bg-gradient-to-r from-transparent via-white/30 to-transparent"
              }`}
            />
          </div>
        </div>
      </td>
      <td className="p-3 sm:p-4">
        <div className="relative overflow-hidden">
          <div
            className={`h-4 w-24 rounded ${
              isDark ? "bg-gray-800" : "bg-gray-200"
            }`}
          >
            <motion.div
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className={`h-full w-1/2 ${
                isDark
                  ? "bg-gradient-to-r from-transparent via-gray-700/30 to-transparent"
                  : "bg-gradient-to-r from-transparent via-white/30 to-transparent"
              }`}
            />
          </div>
        </div>
      </td>
      {days.map((day) => (
        <td key={day} className="p-3 sm:p-4 text-center">
          <div className="relative overflow-hidden">
            <div
              className={`h-5 w-5 mx-auto rounded-full ${
                isDark ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              <motion.div
                variants={shimmer}
                initial="hidden"
                animate="visible"
                className={`h-full w-1/2 ${
                  isDark
                    ? "bg-gradient-to-r from-transparent via-gray-700/30 to-transparent"
                    : "bg-gradient-to-r from-transparent via-white/30 to-transparent"
                }`}
              />
            </div>
          </div>
        </td>
      ))}
    </motion.tr>
  );

  return (
    <div className="h-full">
      <div className="px-4 py-6">
        {/* Timetable Selector Skeleton */}
        <div className="mb-6">
          <div className="relative overflow-hidden">
            <div
              className={`w-48 h-10 rounded-lg ${
                isDark ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              <motion.div
                variants={shimmer}
                initial="hidden"
                animate="visible"
                className={`h-full w-1/2 ${
                  isDark
                    ? "bg-gradient-to-r from-transparent via-gray-700/30 to-transparent"
                    : "bg-gradient-to-r from-transparent via-white/30 to-transparent"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-lg font-bold flex items-center gap-2 ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}
          >
            <CheckCircle
              className={`w-5 h-5 ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <div className="relative overflow-hidden">
              <div
                className={`h-6 w-24 rounded ${
                  isDark ? "bg-gray-800" : "bg-gray-200"
                }`}
              >
                <motion.div
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  className={`h-full w-1/2 ${
                    isDark
                      ? "bg-gradient-to-r from-transparent via-gray-700/30 to-transparent"
                      : "bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  }`}
                />
              </div>
            </div>
          </motion.h2>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-2">
            {["Add", "Manage", "History", "Stats"].map((action, index) => (
              <motion.div
                key={action}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden"
              >
                <div
                  className={`
                    h-8 w-24 rounded-lg
                    ${isDark ? "bg-gray-800" : "bg-gray-200"}
                  `}
                >
                  <motion.div
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    className={`h-full w-1/2 ${
                      isDark
                        ? "bg-gradient-to-r from-transparent via-gray-700/30 to-transparent"
                        : "bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Tracker Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
            className={`relative rounded-xl p-6 backdrop-blur-sm border shadow-xl transition-all duration-500
              ${
                isDark
                  ? "bg-black/90 border-gray-800 hover:border-indigo-500/30"
                  : "bg-white border-gray-200 hover:border-indigo-300"
              }`}
          >
            {/* Week Info Header Skeleton */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-lg ${
                    isDark ? "bg-indigo-500/20" : "bg-indigo-100"
                  }`}
                >
                  <Calendar
                    className={`w-5 h-5 ${
                      isDark ? "text-indigo-300" : "text-indigo-600"
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <div className="relative overflow-hidden">
                    <div
                      className={`h-6 w-48 rounded ${
                        isDark ? "bg-gray-800" : "bg-gray-200"
                      }`}
                    >
                      <motion.div
                        variants={shimmer}
                        initial="hidden"
                        animate="visible"
                        className={`h-full w-1/2 ${
                          isDark
                            ? "bg-gradient-to-r from-transparent via-gray-700/30 to-transparent"
                            : "bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="relative overflow-hidden">
                    <div
                      className={`h-4 w-36 rounded ${
                        isDark ? "bg-gray-800" : "bg-gray-200"
                      }`}
                    >
                      <motion.div
                        variants={shimmer}
                        initial="hidden"
                        animate="visible"
                        className={`h-full w-1/2 ${
                          isDark
                            ? "bg-gradient-to-r from-transparent via-gray-700/30 to-transparent"
                            : "bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden">
                <div
                  className={`h-8 w-24 rounded-full ${
                    isDark ? "bg-indigo-500/20" : "bg-indigo-100"
                  }`}
                >
                  <motion.div
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    className={`h-full w-1/2 ${
                      isDark
                        ? "bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent"
                        : "bg-gradient-to-r from-transparent via-indigo-200/30 to-transparent"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Activities Table Skeleton */}
            <div
              className={`rounded-lg border shadow-sm overflow-hidden
              ${isDark ? "border-gray-800" : "border-gray-200"}`}
            >
              <table className="w-full min-w-[800px]">
                <thead
                  className={`
                    ${
                      isDark
                        ? "bg-gradient-to-r from-gray-900 to-gray-800"
                        : "bg-gradient-to-r from-gray-100 to-gray-50"
                    }
                    border-b ${isDark ? "border-gray-800" : "border-gray-200"}
                  `}
                >
                  <tr>
                    <th
                      className={`text-left p-3 sm:p-4 font-medium ${
                        isDark ? "text-gray-300" : "text-gray-800"
                      }`}
                    >
                      Activity
                    </th>
                    <th
                      className={`text-left p-3 sm:p-4 font-medium flex items-center ${
                        isDark ? "text-gray-300" : "text-gray-800"
                      }`}
                    >
                      <Clock
                        className={`
                        inline-block mr-2 w-4 h-4 sm:w-5 sm:h-5
                        ${isDark ? "text-indigo-400" : "text-indigo-600"}
                      `}
                      />
                      Time
                    </th>
                    {days.map((day) => (
                      <th
                        key={day}
                        className={`p-3 sm:p-4 text-center font-medium ${
                          isDark ? "text-gray-300" : "text-gray-800"
                        }`}
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, index) => (
                    <SkeletonRow key={index} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SkeletonTimetable;