// src/pages/WorkingHoursPage.jsx (Updated with Category Management)
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Plus,
  Filter,
  RefreshCcw,
  Calendar,
  Clock,
  BarChart2,
  Trash2,
  Edit2,
  Settings,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import useWorkingHours from "../hooks/useWorkingHours";
import useCategories from "../hooks/useCategories";
import WorkingHoursForm from "../components/WorkingHours/WorkingHoursForm";
import WorkingHoursStats from "../components/WorkingHours/WorkingHoursStats";
import WorkingHoursFilters from "../components/WorkingHours/WorkingHoursFilters";
import CategoryManagement from "../components/Categories/CategoryManagement";
import LoadingSpinner from "../components/UI/LoadingSpinner";

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

  const [showForm, setShowForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    category: "",
  });

  // Handle form submission
  const handleFormSubmit = async (data) => {
    try {
      if (editingItem) {
        await updateWorkingHours(editingItem._id, data);
      } else {
        await addWorkingHours(data);
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // Handle edit button click
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteWorkingHours(id);
      } catch (error) {
        console.error("Delete error:", error);
      }
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

  // When categories are updated, refresh the working hours categories list
  const handleCategoryChange = async () => {
    await refreshWorkingHoursCategories();
  };

  // Format date for display
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Working Hours Tracker
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
            Add Hours
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
            onClick={() => setShowStats(true)}
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
            Categories
          </button>

          <button
            onClick={() => fetchWorkingHours()}
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

      {/* Show active filters if any */}
      {(filters.startDate || filters.endDate || filters.category) && (
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
                  From: {format(new Date(filters.startDate), "MMM dd, yyyy")}
                </span>
              )}
              {filters.endDate && (
                <span className="ml-2">
                  To: {format(new Date(filters.endDate), "MMM dd, yyyy")}
                </span>
              )}
              {filters.category && (
                <span className="ml-2">Category: {filters.category}</span>
              )}
            </div>
            <button
              onClick={() => {
                setFilters({ startDate: null, endDate: null, category: "" });
                fetchWorkingHours();
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

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center my-12">
          <LoadingSpinner size="lg" text="Loading working hours data..." />
        </div>
      )}

      {/* Error message */}
      {error && !loading && (
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

      {/* Working hours data */}
      {!loading && !error && workingHours.length === 0 && (
        <div
          className={`p-8 text-center rounded-lg ${
            isDark ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <p className="mb-4">No working hours records found.</p>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingItem(null);
            }}
            className={`inline-flex items-center px-4 py-2 rounded-lg ${
              isDark
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            <Plus size={18} className="mr-1" />
            Add Your First Entry
          </button>
        </div>
      )}

      {!loading && !error && workingHours.length > 0 && (
        <div
          className={`rounded-lg overflow-hidden border ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <table
            className="min-w-full divide-y ${
            isDark ? 'divide-gray-700' : 'divide-gray-200'
          }"
          >
            <thead className={isDark ? "bg-gray-800" : "bg-gray-50"}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Achieved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Mood
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDark ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {workingHours.map((item) => (
                <tr
                  key={item._id}
                  className={
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-white hover:bg-gray-50"
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      {formatDate(item.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getCategoryColorClass(
                        item.category,
                        isDark
                      )}`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2" />
                      {item.targetHours} hrs
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.achievedHours} hrs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className={`h-2.5 rounded-full ${getProgressColorClass(
                          item.progressPercentage,
                          isDark
                        )}`}
                        style={{
                          width: `${Math.min(item.progressPercentage, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs mt-1">
                      {item.progressPercentage.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getMoodColorClass(
                        item.mood,
                        isDark
                      )}`}
                    >
                      {item.mood}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className={`p-1 rounded ${
                          isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                        }`}
                      >
                        <Edit2
                          size={16}
                          className={
                            isDark ? "text-indigo-400" : "text-indigo-600"
                          }
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className={`p-1 rounded ${
                          isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                        }`}
                      >
                        <Trash2
                          size={16}
                          className={isDark ? "text-red-400" : "text-red-600"}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingItem ? "Edit Working Hours" : "Add Working Hours"}
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
            <WorkingHoursForm
              initialData={editingItem}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              categories={workingHoursCategories}
            />
          </div>
        </div>
      )}

      {/* Stats modal */}
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

      {/* Filters modal */}
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
              type="working-hours"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions for styling
const getCategoryColorClass = (category, isDark) => {
  const categoryColors = {
    Coding: isDark
      ? "bg-blue-900/30 text-blue-300"
      : "bg-blue-100 text-blue-800",
    Learning: isDark
      ? "bg-green-900/30 text-green-300"
      : "bg-green-100 text-green-800",
    "Project Work": isDark
      ? "bg-purple-900/30 text-purple-300"
      : "bg-purple-100 text-purple-800",
    Other: isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-800",
  };

  return (
    categoryColors[category] ||
    (isDark
      ? "bg-indigo-900/30 text-indigo-300"
      : "bg-indigo-100 text-indigo-800")
  );
};

const getProgressColorClass = (percentage, isDark) => {
  if (percentage >= 100) {
    return isDark ? "bg-green-500" : "bg-green-600";
  } else if (percentage >= 75) {
    return isDark ? "bg-lime-500" : "bg-lime-600";
  } else if (percentage >= 50) {
    return isDark ? "bg-yellow-500" : "bg-yellow-600";
  } else if (percentage >= 25) {
    return isDark ? "bg-orange-500" : "bg-orange-600";
  } else {
    return isDark ? "bg-red-500" : "bg-red-600";
  }
};

const getMoodColorClass = (mood, isDark) => {
  const moodColors = {
    Productive: isDark
      ? "bg-green-900/30 text-green-300"
      : "bg-green-100 text-green-800",
    Normal: isDark
      ? "bg-blue-900/30 text-blue-300"
      : "bg-blue-100 text-blue-800",
    Distracted: isDark
      ? "bg-red-900/30 text-red-300"
      : "bg-red-100 text-red-800",
  };

  return (
    moodColors[mood] ||
    (isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-800")
  );
};

export default WorkingHoursPage;
