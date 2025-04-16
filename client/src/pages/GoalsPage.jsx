import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Filter,
  BarChart2,
  RefreshCcw,
  Settings,
  Calendar,
  Trophy,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import useGoals from "../hooks/useGoals";
import useCategories from "../hooks/useCategories";
import GoalForm from "../components/Goals/GoalForm.jsx";
import GoalList from "../components/Goals/GoalList";
import GoalStats from "../components/Goals/GoalStats";
import GoalFilters from "../components/Goals/GoalFilters";
import CategoryManagement from "../components/Categories/CategoryManagement";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const GoalsPage = () => {
  const { isDark } = useTheme();
  const {
    goals,
    stats,
    loading,
    error,
    platforms,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalStats,
    getPlatforms,
  } = useGoals();

  const {
    categories,
    defaultCategories,
    loading: categoriesLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
  } = useCategories("goals");

  const [showForm, setShowForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    platform: "",
    participated: "",
  });

  const handleFormSubmit = async (data) => {
    try {
      if (editingItem) {
        await updateGoal(editingItem._id, data);
      } else {
        await addGoal(data);
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteGoal(id);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleFilterApply = (filterData) => {
    setFilters(filterData);
    setShowFilters(false);
    fetchGoals(
      filterData.platform,
      filterData.participated,
      filterData.startDate,
      filterData.endDate
    );
  };

  const handleCategoryChange = async () => {
    await getPlatforms();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Trophy className="inline-block mr-2" size={24} />
          Coding Contest
        </h1>

        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingItem(null);
            }}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isDark
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            <Plus size={18} className="mr-1" />
            Add Goal
          </button>

          <button
            onClick={() => setShowFilters(true)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            <Filter size={18} className="mr-1" />
            Filter
          </button>

          <button
            onClick={() => {
              setShowStats(true);
              getGoalStats();
            }}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            <BarChart2 size={18} className="mr-1" />
            Stats
          </button>

          <button
            onClick={() => setShowCategoryManagement(true)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            <Settings size={18} className="mr-1" />
            Platforms
          </button>

          <button
            onClick={() => fetchGoals()}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
            aria-label="Refresh"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {(filters.startDate ||
        filters.endDate ||
        filters.platform ||
        filters.participated) && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            isDark ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Active Filters:</span>
              {filters.startDate && (
                <span className="ml-2">
                  From: {formatDate(filters.startDate)}
                </span>
              )}
              {filters.endDate && (
                <span className="ml-2">To: {formatDate(filters.endDate)}</span>
              )}
              {filters.platform && (
                <span className="ml-2">Platform: {filters.platform}</span>
              )}
              {filters.participated !== "" && (
                <span className="ml-2">
                  Status:{" "}
                  {filters.participated === "true"
                    ? "Participated"
                    : "Not Participated"}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setFilters({
                  startDate: null,
                  endDate: null,
                  platform: "",
                  participated: "",
                });
                fetchGoals();
              }}
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

      {loading && (
        <div className="flex justify-center my-12">
          <LoadingSpinner size="lg" text="Loading goals data..." />
        </div>
      )}

      {error && !loading && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
          }`}
        >
          <p>Error: {error}</p>
          <button
            onClick={() => fetchGoals()}
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

      {!loading && !error && (
        <GoalList
          goals={goals}
          onEdit={handleEdit}
          onDelete={handleDelete}
          platforms={platforms.length > 0 ? platforms : categories}
        />
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingItem ? "Edit Goal" : "Add New Goal"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className={`p-1 rounded-full ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                ✕
              </button>
            </div>
            <GoalForm
              initialData={editingItem}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              platforms={platforms.length > 0 ? platforms : categories}
            />
          </div>
        </div>
      )}

      {showStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-4xl p-6 rounded-lg shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Goals & Achievements Analytics
              </h2>
              <button
                onClick={() => setShowStats(false)}
                className={`p-1 rounded-full ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                ✕
              </button>
            </div>
            <GoalStats stats={stats} />
          </div>
        </div>
      )}

      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filter Goals</h2>
              <button
                onClick={() => setShowFilters(false)}
                className={`p-1 rounded-full ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                ✕
              </button>
            </div>
            <GoalFilters
              initialFilters={filters}
              onApply={handleFilterApply}
              onCancel={() => setShowFilters(false)}
              platforms={platforms.length > 0 ? platforms : categories}
            />
          </div>
        </div>
      )}

      {showCategoryManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-4xl p-6 rounded-lg shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Manage Platforms</h2>
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
              type="goals"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
