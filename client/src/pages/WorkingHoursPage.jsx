// src/pages/WorkingHoursPage.jsx
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Target,
  Activity,
  Plus,
  Calendar,
  Filter,
  RefreshCcw,
  Search,
  BarChart2,
  PieChart,
  ArrowUpDown,
  Settings,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import useWorkingHours from "../hooks/useWorkingHours";
import useCategories from "../hooks/useCategories";
import WorkingHoursForm from "../components/WorkingHours/WorkingHoursForm";
import WorkingHoursStats from "../components/WorkingHours/WorkingHoursStats";
import WorkingHoursFilters from "../components/WorkingHours/WorkingHoursFilters";
import CategoryManagement from "../components/Categories/CategoryManagement";
import WorkingHoursCard from "../components/WorkingHours/WorkingHoursCard";
import ProgressChart from "../components/WorkingHours/ProgressChart";
import CategoryChart from "../components/WorkingHours/CategoryChart";
import StatsCard from "../components/common/StatsCard";
import FilterButton from "../components/common/FilterButton";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { formatDisplayDate } from "../utils/dateUtils";

const WorkingHoursPage = () => {
  const { isDark } = useTheme();
  const {
    workingHours,
    stats,
    loading,
    error,
    categories: workingHoursCategories,
    fetchWorkingHours,
    addWorkingHours,
    updateWorkingHours,
    deleteWorkingHours,
    fetchCategories: refreshWorkingHoursCategories,
  } = useWorkingHours();

  const {
    categories,
    defaultCategories,
    loading: categoriesLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
  } = useCategories("working-hours");

  // State hooks
  const [showForm, setShowForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVisualization, setActiveVisualization] = useState("progress");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    category: "",
  });

  // Filter and sort working hours
  const filteredWorkingHours = useMemo(() => {
    if (!workingHours.length) return [];

    const filtered = workingHours.filter((entry) => {
      const matchesSearch =
        searchQuery === "" ||
        (entry.notes &&
          entry.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const entryDate = new Date(entry.date);
      const matchesDateRange =
        (!filters.startDate || entryDate >= new Date(filters.startDate)) &&
        (!filters.endDate || entryDate <= new Date(filters.endDate));

      const matchesCategory =
        !filters.category || entry.category === filters.category;

      return matchesSearch && matchesDateRange && matchesCategory;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [workingHours, searchQuery, filters, sortOrder]);

  // Handle form submission
  const handleFormSubmit = async (data) => {
    try {
      if (selectedEntry) {
        await updateWorkingHours(selectedEntry._id, data);
      } else {
        await addWorkingHours(data);
      }
      setShowForm(false);
      setSelectedEntry(null);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedEntry(null);
  };

  // Handle edit button click
  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    setShowForm(true);
  };

  // Handle delete button click
  const handleDelete = (entry) => {
    setEntryToDelete(entry);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!entryToDelete) return;

    try {
      await deleteWorkingHours(entryToDelete._id);
      setEntryToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Handle filter apply
  const handleFilterApply = (filterData) => {
    setFilters(filterData);
    setShowFilters(false);
    fetchWorkingHours(
      filterData.startDate,
      filterData.endDate,
      filterData.category
    );
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      category: "",
    });
    setSearchQuery("");
    fetchWorkingHours();
  };

  // When categories are updated, refresh the working hours categories list
  const handleCategoryChange = async () => {
    await refreshWorkingHoursCategories();
  };

  // Loading state
  if (loading) {
    return <LoadingWorkingHoursSkeleton />;
  }

  return (
    <section className={`py-20 relative ${isDark ? "bg-black" : "bg-white"}`}>
      {/* Background gradients */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          isDark
            ? "from-indigo-900/10 via-black to-black"
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

      <div className="mx-auto px-4 max-w-6xl relative z-10">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Working Hours Tracker
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
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  className={`w-5 h-5 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </div>
              <input
                type="text"
                placeholder="Search entries"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm border ${
                  isDark
                    ? "bg-gray-800 text-gray-200 border-gray-700 focus:border-indigo-500"
                    : "bg-white text-gray-800 border-gray-300 focus:border-indigo-500"
                }`}
              />
            </div>

            {/* Filters Button */}
            <FilterButton
              active={showFilters}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </FilterButton>

            {/* Stats Button */}
            <FilterButton active={showStats} onClick={() => setShowStats(true)}>
              <BarChart2 className="w-4 h-4" />
              Stats
            </FilterButton>

            {/* Categories Button */}
            <FilterButton
              active={showCategoryManagement}
              onClick={() => setShowCategoryManagement(true)}
            >
              <Settings className="w-4 h-4" />
              Categories
            </FilterButton>

            {/* Add Hours Button */}
            <FilterButton
              type="add"
              onClick={() => {
                setSelectedEntry(null);
                setShowForm(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Add Hours
            </FilterButton>

            {/* Refresh Button */}
            <button
              onClick={() => fetchWorkingHours()}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
              aria-label="Refresh"
            >
              <RefreshCcw size={18} />
            </button>
          </motion.div>
        </div>

        {/* Show active filters if any */}
        {(filters.startDate || filters.endDate || filters.category) && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              isDark ? "bg-gray-800/80" : "bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span
                  className={`font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Active Filters:
                </span>
                {filters.startDate && (
                  <span
                    className={`ml-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    From: {formatDisplayDate(filters.startDate)}
                  </span>
                )}
                {filters.endDate && (
                  <span
                    className={`ml-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    To: {formatDisplayDate(filters.endDate)}
                  </span>
                )}
                {filters.category && (
                  <span
                    className={`ml-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Category: {filters.category}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className={`text-sm ${
                  isDark
                    ? "text-red-400 hover:text-red-300"
                    : "text-red-600 hover:text-red-700"
                }`}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
            }`}
          >
            <p>Error: {error}</p>
            <button
              onClick={() => fetchWorkingHours()}
              className={`mt-2 text-sm underline ${
                isDark
                  ? "text-red-300 hover:text-red-200"
                  : "text-red-700 hover:text-red-800"
              }`}
            >
              Try again
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Days"
            value={stats.totalDays}
            icon={Calendar}
            color={isDark ? "text-indigo-400" : "text-indigo-600"}
          />
          <StatsCard
            title="Target Hours"
            value={stats.totalTargetHours?.toFixed(1)}
            icon={Target}
            color={isDark ? "text-emerald-400" : "text-emerald-600"}
          />
          <StatsCard
            title="Achieved Hours"
            value={stats.totalAchievedHours?.toFixed(1)}
            icon={Clock}
            color={isDark ? "text-blue-400" : "text-blue-600"}
          />
          <StatsCard
            title="Completion Rate"
            value={`${stats.averageCompletion?.toFixed(1)}%`}
            icon={Activity}
            color={isDark ? "text-purple-400" : "text-purple-600"}
          />
        </div>

        {/* Chart Section */}
        <div
          className={`p-6 rounded-lg border mb-8 ${
            isDark
              ? "bg-black border-indigo-500/30"
              : "bg-white border-indigo-300/50"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className={`text-xl font-semibold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Working Hours Visualization
            </h3>
            <div
              className={`inline-flex rounded-lg p-1 ${
                isDark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-gray-100 border border-gray-200"
              }`}
            >
              {[
                {
                  key: "progress",
                  icon: BarChart2,
                  label: "Progress Chart",
                },
                {
                  key: "category",
                  icon: PieChart,
                  label: "Category Distribution",
                },
              ].map((viz) => (
                <button
                  key={viz.key}
                  onClick={() => setActiveVisualization(viz.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeVisualization === viz.key
                      ? isDark
                        ? "bg-indigo-500/20 text-white"
                        : "bg-indigo-100 text-indigo-600"
                      : isDark
                      ? "text-gray-400 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <viz.icon className="w-5 h-5" />
                  <span className="hidden md:inline">{viz.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="h-96">
            {activeVisualization === "progress" ? (
              <ProgressChart data={workingHours} />
            ) : (
              <CategoryChart data={stats.categoryBreakdown} />
            )}
          </div>
        </div>

        {/* Working Hours Cards Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-8">
            <h2
              className={`text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Recent Entries
              <div
                className={`w-24 h-1 bg-gradient-to-r ${
                  isDark
                    ? "from-white to-gray-500"
                    : "from-indigo-600 to-indigo-300"
                } mt-4 rounded-full`}
              />
            </h2>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <ArrowUpDown
                className={`w-4 h-4 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <select
                className={`px-3 py-2 rounded-lg text-sm border ${
                  isDark
                    ? "bg-gray-800 text-gray-200 border-gray-700 focus:border-indigo-500"
                    : "bg-white text-gray-800 border-gray-300 focus:border-indigo-500"
                }`}
                onChange={(e) => setSortOrder(e.target.value)}
                value={sortOrder}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {filteredWorkingHours.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-center py-12 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-base">No working hours entries found</p>
              <button
                onClick={() => {
                  setShowForm(true);
                  setSelectedEntry(null);
                }}
                className={`mt-4 inline-flex items-center px-4 py-2 rounded-lg ${
                  isDark
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                <Plus size={18} className="mr-1" />
                Add Your First Entry
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredWorkingHours.map((entry) => (
                  <WorkingHoursCard
                    key={entry._id}
                    entry={entry}
                    onEdit={() => handleEdit(entry)}
                    onDelete={() => handleDelete(entry)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {selectedEntry ? "Edit Working Hours" : "Add Working Hours"}
                </h2>
                <button
                  onClick={handleFormCancel}
                  className={`p-1 rounded-full ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`}
                >
                  ✕
                </button>
              </div>
              <WorkingHoursForm
                initialData={selectedEntry}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                categories={workingHoursCategories}
              />
            </div>
          </div>
        )}

        {/* Stats Modal */}
        {showStats && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`w-full max-w-4xl p-6 rounded-lg shadow-lg ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Working Hours Statistics</h2>
                <button
                  onClick={() => setShowStats(false)}
                  className={`p-1 rounded-full ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`}
                >
                  ✕
                </button>
              </div>
              <WorkingHoursStats stats={stats} />
            </div>
          </div>
        )}

        {/* Filters Modal */}
        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Filter Working Hours</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className={`p-1 rounded-full ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`}
                >
                  ✕
                </button>
              </div>
              <WorkingHoursFilters
                initialFilters={filters}
                onApply={handleFilterApply}
                onCancel={() => setShowFilters(false)}
                categories={workingHoursCategories}
              />
            </div>
          </div>
        )}

        {/* Category Management Modal */}
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
                type="working-hours"
              />
            </div>
          </div>
        )}

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          isOpen={entryToDelete !== null}
          onClose={() => setEntryToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete Entry"
          message="Are you sure you want to delete this working hours entry? This action cannot be undone."
          confirmText="Delete Entry"
          type="danger"
        />
      </div>
    </section>
  );
};

// LoadingWorkingHoursSkeleton Component
const LoadingWorkingHoursSkeleton = () => {
  const { isDark } = useTheme();

  return (
    <section className={`py-20 relative ${isDark ? "bg-black" : "bg-white"}`}>
      {/* Background Gradients */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          isDark
            ? "from-indigo-900/10 via-black to-black"
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

      <div className="mx-auto px-4 max-w-6xl relative z-10">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div
            className={`h-8 w-64 rounded-lg ${
              isDark ? "bg-gray-800" : "bg-gray-200"
            } animate-pulse`}
          ></div>
          <div className="flex gap-2">
            <div
              className={`h-10 w-32 rounded-lg ${
                isDark ? "bg-gray-800" : "bg-gray-200"
              } animate-pulse`}
            ></div>
            <div
              className={`h-10 w-32 rounded-lg ${
                isDark ? "bg-gray-800" : "bg-gray-200"
              } animate-pulse`}
            ></div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`p-6 rounded-lg border animate-pulse ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <div
                    className={`h-4 w-20 rounded ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-8 w-16 rounded mt-2 ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <div
                  className={`h-10 w-10 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div
          className={`p-6 rounded-lg border mb-8 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <div
              className={`h-6 w-48 rounded ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } animate-pulse`}
            ></div>
            <div
              className={`h-10 w-48 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } animate-pulse`}
            ></div>
          </div>
          <div
            className={`h-80 w-full rounded ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            } animate-pulse`}
          ></div>
        </div>

        {/* Entries Section Skeleton */}
        <div className="mt-8">
          <div
            className={`h-8 w-48 rounded mb-8 ${
              isDark ? "bg-gray-800" : "bg-gray-200"
            } animate-pulse`}
          ></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`p-6 rounded-lg border h-64 animate-pulse ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-100 border-gray-200"
                }`}
              >
                <div className="flex justify-between mb-4">
                  <div
                    className={`h-6 w-32 rounded ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-6 w-20 rounded ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <div
                  className={`h-4 w-full rounded mb-4 ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-4 w-3/4 rounded mb-4 ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-2 w-full rounded-full mb-6 ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-20 w-full rounded ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkingHoursPage;
