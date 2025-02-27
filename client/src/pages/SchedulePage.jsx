// src/pages/SchedulePage.jsx
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Target,
  Clock,
  Activity,
  ArrowUpDown,
  Filter,
  Settings,
  RefreshCcw,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import useSchedules from "../hooks/useSchedules";
import useCategories from "../hooks/useCategories";
import ScheduleCard from "../components/Schedule/ScheduleCard";
import ScheduleModal from "../components/Schedule/ScheduleModal";
import ScheduleTimelineChart from "../components/Schedule/ScheduleTimelineChart";
import CategoryDistributionChart from "../components/Schedule/CategoryDistributionChart";
import CategoryManagement from "../components/Categories/CategoryManagement";
import StatsCard from "../components/common/StatsCard";
import LoadingScheduleSkeleton from "../components/Schedule/LoadingScheduleSkeleton.jsx";
import FilterButton from "../components/common/FilterButton";

const SchedulePage = () => {
  const { isDark } = useTheme();
  const addButtonRef = useRef(null);

  // Use the updated hooks with authentication
  const {
    schedules,
    loading,
    error,
    stats,
    categories: scheduleCategories,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    fetchCategories: refreshScheduleCategories,
  } = useSchedules();

  // Category management
  const {
    categories,
    defaultCategories,
    loading: categoriesLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
  } = useCategories("schedule");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);

  const filteredSchedules = useMemo(() => {
    let processed = schedules.filter((schedule) => {
      if (filter === "Completed") return schedule.status === "Completed";
      if (filter === "Progress") return schedule.status === "In Progress";
      if (filter === "Planned") return schedule.status === "Planned";
      return true;
    });

    return processed.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      switch (sortBy) {
        case "date-asc":
          return dateA - dateB;
        case "date-desc":
          return dateB - dateA;
        default:
          return 0;
      }
    });
  }, [schedules, filter, sortBy]);

  const handleAddSchedule = async (data) => {
    try {
      await createSchedule(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding schedule:", error);
    }
  };

  const handleEditSchedule = async (data) => {
    try {
      await updateSchedule(editingSchedule._id, data);
      setIsModalOpen(false);
      setEditingSchedule(null);
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  // When categories are updated, refresh the schedule categories list
  const handleCategoryChange = async () => {
    await refreshScheduleCategories();
  };

  useEffect(() => {
    if (scheduleCategories.length === 0) {
      refreshScheduleCategories();
    }

    // Debug log to check what categories are available
    console.log("Schedule categories:", scheduleCategories);
  }, [scheduleCategories, refreshScheduleCategories]);

  if (loading) return <LoadingScheduleSkeleton />;

  return (
    <section className={`py-20 relative ${isDark ? "bg-black" : "bg-white"}`}>
      {/* Background gradients */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          isDark
            ? "from-indigo-900/1 via-black to-black"
            : "from-indigo-100/50 via-white to-white"
        }`}
      />
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]"
            : "bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]"
        }`}
      />

      <div className="mx-auto px-4 relative z-10">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Schedule
            <div
              className={`w-24 h-1 bg-gradient-to-r ${
                isDark
                  ? "from-white to-gray-500"
                  : "from-indigo-600 to-indigo-300"
              } mt-4 rounded-full`}
            />
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-3 items-center"
          >
            <div className="flex items-center gap-2">
              <Filter
                className={`w-5 h-5 ${
                  isDark ? "text-indigo-300" : "text-indigo-600"
                }`}
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm border appearance-none cursor-pointer focus:outline-none focus:ring-2 transition-all duration-200 ${
                  isDark
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 focus:ring-indigo-400/50 hover:bg-indigo-500/20"
                    : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 focus:ring-indigo-500/50 hover:bg-indigo-200/70"
                }`}
              >
                <option value="all">All</option>
                <option value="Planned">Planned</option>
                <option value="Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown
                className={`w-5 h-5 ${
                  isDark ? "text-indigo-300" : "text-indigo-600"
                }`}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm border appearance-none cursor-pointer focus:outline-none focus:ring-2 transition-all duration-200 ${
                  isDark
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 focus:ring-indigo-400/50 hover:bg-indigo-500/20"
                    : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 focus:ring-indigo-500/50 hover:bg-indigo-200/70"
                }`}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
              </select>
            </div>

            <FilterButton
              type="add"
              onClick={() => {
                setEditingSchedule(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Add Schedule
            </FilterButton>
            <button
              onClick={() => setShowCategoryManagement(true)}
              className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-200 ${
                isDark
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                  : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
              }`}
            >
              <Settings size={18} className="mr-1" />
              Categories
            </button>

            <button
              onClick={() => fetchSchedules()}
              className={`p-2 rounded-lg transition-colors shadow-sm ${
                isDark
                  ? "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "bg-indigo-100/50 hover:bg-indigo-100/70 text-indigo-600 border border-indigo-300/50"
              }`}
              aria-label="Refresh"
            >
              <RefreshCcw
                size={18}
                className={`w-5 h-5 ${
                  isDark ? "text-indigo-300" : "text-indigo-600"
                }`}
              />
            </button>
          </motion.div>
        </div>

        {error ? (
          <div
            className={`p-4 rounded-lg ${
              isDark
                ? "bg-red-500/10 text-red-400 border border-red-500/30"
                : "bg-red-100 text-red-600 border border-red-200"
            }`}
          >
            Error: {error}
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatsCard
                title="Today's Schedule"
                value={`${stats?.todayItems || 0} Tasks`}
                icon={Calendar}
                color={isDark ? "text-indigo-400" : "text-indigo-600"}
              />
              <StatsCard
                title="Completion Rate"
                value={`${(stats?.completionRate || 0).toFixed(1)}%`}
                icon={Target}
                color={isDark ? "text-green-400" : "text-green-600"}
              />
              <StatsCard
                title="Total Hours"
                value={(stats?.totalHours || 0).toFixed(1)}
                icon={Clock}
                color={isDark ? "text-blue-400" : "text-blue-600"}
              />
              <StatsCard
                title="Priority Tasks"
                value={stats?.highPriorityTasks || 0}
                icon={Activity}
                color={isDark ? "text-red-400" : "text-red-600"}
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Timeline Chart */}
              <div
                className={`p-6 rounded-lg border ${
                  isDark
                    ? "bg-black border-indigo-500/30"
                    : "bg-white border-indigo-300/50"
                }`}
              >
                <h3
                  className={`text-xl font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Schedule Timeline
                </h3>
                <div className="h-96">
                  <ScheduleTimelineChart
                    schedules={schedules}
                    isDark={isDark}
                  />
                </div>
              </div>

              {/* Category Distribution */}
              <div
                className={`p-6 rounded-lg border ${
                  isDark
                    ? "bg-black border-indigo-500/30"
                    : "bg-white border-indigo-300/50"
                }`}
              >
                <h3
                  className={`text-xl font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Category Distribution
                </h3>
                <div className="h-96">
                  <CategoryDistributionChart
                    schedules={schedules}
                    isDark={isDark}
                  />
                </div>
              </div>
            </div>

            {/* Schedules List */}
            <div className="mt-8">
              <h2
                className={`text-3xl font-bold mb-8 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Your Schedules
                <div
                  className={`w-24 h-1 bg-gradient-to-r ${
                    isDark
                      ? "from-white to-gray-500"
                      : "from-indigo-600 to-indigo-300"
                  } mt-4 rounded-full`}
                />
              </h2>

              <AnimatePresence mode="wait">
                {filteredSchedules.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`text-center py-12 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-base">No schedules found</p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSchedules.map((schedule) => (
                      <ScheduleCard
                        key={schedule._id}
                        schedule={schedule}
                        onEdit={(schedule) => {
                          setEditingSchedule(schedule);
                          setIsModalOpen(true);
                        }}
                        onDelete={deleteSchedule}
                        onUpdateItem={updateScheduleItem}
                        onDeleteItem={deleteScheduleItem}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSchedule(null);
        }}
        onSubmit={editingSchedule ? handleEditSchedule : handleAddSchedule}
        initialData={editingSchedule}
        triggerRef={addButtonRef}
        categories={
          scheduleCategories.length > 0 ? scheduleCategories : defaultCategories
        } // Fall back to default categories if none returned from API
      />

      {/* Category Management modal */}
      {showCategoryManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-4xl p-6 rounded-lg shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Manage Categories</h2>
              <button
                onClick={() => setShowCategoryManagement(false)}
                className={`p-1 rounded-full ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                ✕
              </button>
            </div>
            <CategoryManagement
              categories={categories}
              defaultCategories={defaultCategories}
              loading={categoriesLoading}
              onAdd={async (data) => {
                await addCategory(data);
                handleCategoryChange();
              }}
              onUpdate={async (id, data) => {
                await updateCategory(id, data);
                handleCategoryChange();
              }}
              onDelete={async (id) => {
                await deleteCategory(id);
                handleCategoryChange();
              }}
              onRefresh={async () => {
                await fetchCategories();
                handleCategoryChange();
              }}
              type="schedule"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default SchedulePage;
