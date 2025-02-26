// src/components/Timetable/TimetableHistory.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-40">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
  </div>
);

const TimetableHistory = ({ onClose, fetchHistory, currentTimetable }) => {
  const { isDark } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [historyData, setHistoryData] = useState({
    history: [],
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCategoryColor = useMemo(
    () => (category) => {
      const colors = {
        Career: isDark
          ? "text-purple-400 bg-purple-500/10"
          : "text-purple-600 bg-purple-100",
        Backend: isDark
          ? "text-blue-400 bg-blue-500/10"
          : "text-blue-600 bg-blue-100",
        Core: isDark
          ? "text-green-400 bg-green-500/10"
          : "text-green-600 bg-green-100",
        Frontend: isDark
          ? "text-yellow-400 bg-yellow-500/10"
          : "text-yellow-600 bg-yellow-100",
        Mobile: isDark
          ? "text-orange-400 bg-orange-500/10"
          : "text-orange-600 bg-orange-100",
      };
      return colors[category] || "";
    },
    [isDark]
  );

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      if (!currentTimetable) {
        setError("No timetable selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchHistory(currentPage, currentTimetable.id);
        if (isMounted) {
          setHistoryData(data);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load history");
          setLoading(false);
        }
      }
    };

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [currentPage, fetchHistory, currentTimetable]);

  const handlePageChange = useCallback(
    (page) => {
      if (page === currentPage || loading) return;
      setCurrentPage(page);
      setLoading(true);
    },
    [currentPage, loading]
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full max-w-4xl relative"
        >
          <div
            className={`rounded-xl overflow-hidden border backdrop-blur-sm max-h-[80vh] overflow-y-auto ${
              isDark
                ? "bg-black/90 border-indigo-500/30"
                : "bg-white/90 border-indigo-300/50"
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-inherit z-10">
                <h3
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {currentTimetable?.name || "Timetable"} History
                </h3>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg ${
                    isDark
                      ? "hover:bg-indigo-500/10 text-indigo-400"
                      : "hover:bg-indigo-50 text-indigo-600"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div
                  className={`p-4 rounded-lg mb-4 ${
                    isDark
                      ? "bg-red-500/10 text-red-400 border border-red-500/30"
                      : "bg-red-100 text-red-600 border border-red-200"
                  }`}
                >
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <LoadingSpinner />
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="space-y-6">
                      {historyData?.history?.length === 0 ? (
                        <div
                          className={`text-center py-8 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          No history available
                        </div>
                      ) : (
                        historyData?.history?.map((week, weekIndex) => (
                          <div
                            key={`${week.weekStartDate}-${weekIndex}`}
                            className={`rounded-lg border p-4 ${
                              isDark
                                ? "border-gray-800 bg-gray-900/50"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar
                                  className={`w-4 h-4 ${
                                    isDark
                                      ? "text-indigo-400"
                                      : "text-indigo-600"
                                  }`}
                                />
                                <span
                                  className={`font-medium text-sm ${
                                    isDark ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {new Date(
                                    week.weekStartDate
                                  ).toLocaleDateString()}{" "}
                                  -{" "}
                                  {new Date(
                                    week.weekEndDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  isDark
                                    ? "bg-indigo-500/10 text-indigo-400"
                                    : "bg-indigo-100 text-indigo-600"
                                }`}
                              >
                                {week.overallCompletionRate?.toFixed(1)}%
                                Complete
                              </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {week.activities.map(
                                (activity, activityIndex) => (
                                  <div
                                    key={`${week.weekStartDate}-${activity.activity.name}-${activityIndex}`}
                                    className={`p-3 rounded-lg ${getCategoryColor(
                                      activity.activity.category
                                    )}`}
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-medium text-xs">
                                        {activity.activity.name}
                                      </span>
                                      <span className="text-xs">
                                        {(
                                          (activity.dailyStatus.filter(Boolean)
                                            .length /
                                            7) *
                                          100
                                        ).toFixed(1)}
                                        %
                                      </span>
                                    </div>
                                    <div className="flex gap-1">
                                      {activity.dailyStatus.map(
                                        (status, dayIndex) => (
                                          <div
                                            key={`${week.weekStartDate}-${activity.activity.name}-${dayIndex}`}
                                            className={`w-2 h-2 rounded-full ${
                                              status
                                                ? "bg-green-500"
                                                : isDark
                                                ? "bg-gray-700"
                                                : "bg-gray-300"
                                            }`}
                                          />
                                        )
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {historyData?.history?.length > 0 && (
                      <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1 || loading}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark
                              ? "hover:bg-indigo-500/10 text-indigo-400 disabled:text-gray-600"
                              : "hover:bg-indigo-50 text-indigo-600 disabled:text-gray-400"
                          } disabled:cursor-not-allowed`}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span
                          className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Page {currentPage} of {historyData.totalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={
                            currentPage === historyData.totalPages || loading
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            isDark
                              ? "hover:bg-indigo-500/10 text-indigo-400 disabled:text-gray-600"
                              : "hover:bg-indigo-50 text-indigo-600 disabled:text-gray-400"
                          } disabled:cursor-not-allowed`}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TimetableHistory;
