import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Target,
  Clock,
  Activity,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import useSchedules from "../../hooks/useSchedules";
import ScheduleCard from "./ScheduleCard";
import ScheduleModal from "./ScheduleModal";
import ScheduleTimelineChart from "./ScheduleTimelineChart";
import CategoryDistributionChart from "./CategoryDistributionChart";
import StatsCard from "../common/StatsCard";
import LoadingScheduleSkeleton from "./LoadingScheduleSkeleton.jsx";
import FilterButton from "../common/FilterButton";

const Schedule = () => {
  const { isDark } = useTheme();
  const addButtonRef = useRef(null);

  const {
    schedules,
    loading,
    error,
    stats,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
  } = useSchedules();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

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
              <Filter className="w-5 h-5 opacity-50" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  isDark
                    ? "bg-gray-800 text-gray-200 border-gray-700"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
              >
                {["All", "Planned", "Progress", "Completed"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 opacity-50" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  isDark
                    ? "bg-gray-800 text-gray-200 border-gray-700"
                    : "bg-white text-gray-800 border-gray-300"
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
      />
    </section>
  );
};

export default Schedule;
