import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Calendar,
  List,
  Clock,
  Filter,
  BarChart2,
  Settings,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import useSchedules from "../hooks/useSchedules";
import useCategories from "../hooks/useCategories";
import ScheduleList from "../components/Schedule/ScheduleList";
import ScheduleForm from "../components/Schedule/ScheduleForm";
import ScheduleItemForm from "../components/Schedule/ScheduleItemForm";
import ScheduleStats from "../components/Schedule/ScheduleStats";
import ScheduleFilters from "../components/Schedule/ScheduleFilters";
import TemplateList from "../components/Schedule/TemplateList";
import TemplateForm from "../components/Schedule/TemplateForm";
import CategoryManagement from "../components/Categories/CategoryManagement";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const SchedulePage = () => {
  const { isDark } = useTheme();
  const {
    schedules,
    currentSchedule,
    templates,
    stats,
    loading,
    error,
    categories,
    fetchSchedules,
    fetchScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  } = useSchedules();

  const {
    categories: categoryObjects,
    defaultCategories,
    loading: categoriesLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
  } = useCategories("schedule");

  // UI state
  const [viewMode, setViewMode] = useState("list"); // list, calendar, templates
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);

  // Editing state
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filters state
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    status: "",
  });

  // Handle schedule form submission
  const handleScheduleSubmit = async (data) => {
    try {
      if (selectedSchedule) {
        await updateSchedule(selectedSchedule._id, data);
      } else {
        await createSchedule(data);
      }
      setShowScheduleForm(false);
      setSelectedSchedule(null);
    } catch (error) {
      console.error("Schedule submission error:", error);
    }
  };

  // Handle schedule item form submission
  const handleItemSubmit = async (data) => {
    try {
      if (selectedItem) {
        await updateScheduleItem(selectedSchedule._id, selectedItem._id, data);
      } else if (selectedSchedule) {
        await addScheduleItem(selectedSchedule._id, data);
      }
      setShowItemForm(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Item submission error:", error);
    }
  };

  // Handle template form submission
  const handleTemplateSubmit = async (data) => {
    try {
      if (selectedTemplate) {
        await updateTemplate(selectedTemplate._id, data);
      } else {
        await createTemplate(data);
      }
      setShowTemplateForm(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Template submission error:", error);
    }
  };

  // Handle filter apply
  const handleFilterApply = (filterData) => {
    setFilters(filterData);
    setShowFilters(false);
    fetchSchedules(filterData.startDate, filterData.endDate, filterData.status);
  };

  // When categories are updated, refresh categories list
  const handleCategoryChange = async () => {
    await fetchCategories();
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Schedule actions
  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setShowScheduleForm(true);
  };

  const handleDeleteSchedule = async (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await deleteSchedule(id);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  // Item actions
  const handleAddItem = (schedule) => {
    setSelectedSchedule(schedule);
    setSelectedItem(null);
    setShowItemForm(true);
  };

  const handleEditItem = (schedule, item) => {
    setSelectedSchedule(schedule);
    setSelectedItem(item);
    setShowItemForm(true);
  };

  const handleDeleteItem = async (scheduleId, itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteScheduleItem(scheduleId, itemId);
      } catch (error) {
        console.error("Delete item error:", error);
      }
    }
  };

  // Template actions
  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setShowTemplateForm(true);
  };

  const handleDeleteTemplate = async (id) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await deleteTemplate(id);
      } catch (error) {
        console.error("Delete template error:", error);
      }
    }
  };

  // Create schedule from template
  const handleCreateFromTemplate = (template) => {
    setSelectedTemplate(template);
    setShowScheduleForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Calendar className="inline-block mr-2" size={24} />
          Schedule Planner
        </h1>

        <div className="flex space-x-2">
          {/* View mode toggles */}
          <div
            className={`flex rounded-lg overflow-hidden ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            } mr-4`}
          >
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center px-3 py-2 ${
                viewMode === "list"
                  ? isDark
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-600 text-white"
                  : isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              <List size={18} className="mr-1" />
              List
            </button>

            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center px-3 py-2 ${
                viewMode === "calendar"
                  ? isDark
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-600 text-white"
                  : isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              <Calendar size={18} className="mr-1" />
              Calendar
            </button>

            <button
              onClick={() => setViewMode("templates")}
              className={`flex items-center px-3 py-2 ${
                viewMode === "templates"
                  ? isDark
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-600 text-white"
                  : isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              <Clock size={18} className="mr-1" />
              Templates
            </button>
          </div>

          {/* Action buttons */}
          {viewMode !== "templates" ? (
            <button
              onClick={() => {
                setSelectedSchedule(null);
                setShowScheduleForm(true);
              }}
              className={`flex items-center px-4 py-2 rounded-lg ${
                isDark
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              <Plus size={18} className="mr-1" />
              Add Schedule
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedTemplate(null);
                setShowTemplateForm(true);
              }}
              className={`flex items-center px-4 py-2 rounded-lg ${
                isDark
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              <Plus size={18} className="mr-1" />
              Add Template
            </button>
          )}

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
            Categories
          </button>

          <button
            onClick={() => {
              if (viewMode === "templates") {
                fetchTemplates();
              } else {
                fetchSchedules();
              }
            }}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
            aria-label="Refresh"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Show active filters if any */}
      {(filters.startDate || filters.endDate || filters.status) && (
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
              {filters.status && (
                <span className="ml-2">Status: {filters.status}</span>
              )}
            </div>
            <button
              onClick={() => {
                setFilters({
                  startDate: null,
                  endDate: null,
                  status: "",
                });
                fetchSchedules();
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
          <LoadingSpinner size="lg" text="Loading schedule data..." />
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
            onClick={() =>
              viewMode === "templates" ? fetchTemplates() : fetchSchedules()
            }
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

      {/* Content based on view mode */}
      {!loading && (
        <>
          {viewMode === "list" && (
            <ScheduleList
              schedules={schedules || []}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onEditSchedule={handleEditSchedule}
              onDeleteSchedule={handleDeleteSchedule}
              categories={categories || []}
            />
          )}

          {viewMode === "templates" && (
            <TemplateList
              templates={templates || []}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
              onCreateSchedule={handleCreateFromTemplate}
              categories={categories || []}
            />
          )}

          {/* Calendar view would go here */}
          {viewMode === "calendar" && (
            <div className="text-center p-8">
              <h2
                className={`text-xl ${isDark ? "text-white" : "text-gray-800"}`}
              >
                Calendar view coming soon!
              </h2>
              <p
                className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                This feature is under development.
              </p>
            </div>
          )}
        </>
      )}

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-2xl p-6 rounded-lg shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedSchedule ? "Edit Schedule" : "Create New Schedule"}
              </h2>
              <button
                onClick={() => {
                  setShowScheduleForm(false);
                  setSelectedSchedule(null);
                  setSelectedTemplate(null);
                }}
                className={`p-1 rounded-full ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                ✕
              </button>
            </div>
            <ScheduleForm
              initialData={selectedSchedule}
              templateData={selectedTemplate}
              onSubmit={handleScheduleSubmit}
              onCancel={() => {
                setShowScheduleForm(false);
                setSelectedSchedule(null);
                setSelectedTemplate(null);
              }}
              templates={templates}
              categories={categories}
              initialDate={selectedDate}
            />
          </div>
        </div>
      )}

      {/* Schedule Item Form Modal */}
      {showItemForm && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedItem ? "Edit Item" : "Add Schedule Item"}
              </h2>
              <button
                onClick={() => {
                  setShowItemForm(false);
                  setSelectedItem(null);
                }}
                className={`p-1 rounded-full ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                ✕
              </button>
            </div>
            <ScheduleItemForm
              initialData={selectedItem}
              onSubmit={handleItemSubmit}
              onCancel={() => {
                setShowItemForm(false);
                setSelectedItem(null);
              }}
              categories={categories}
              scheduleDate={selectedSchedule.date}
            />
          </div>
        </div>
      )}

      {/* Template Form Modal */}
      {showTemplateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-2xl p-6 rounded-lg shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedTemplate ? "Edit Template" : "Create New Template"}
              </h2>
              <button
                onClick={() => {
                  setShowTemplateForm(false);
                  setSelectedTemplate(null);
                }}
                className={`p-1 rounded-full ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                ✕
              </button>
            </div>
            <TemplateForm
              initialData={selectedTemplate}
              onSubmit={handleTemplateSubmit}
              onCancel={() => {
                setShowTemplateForm(false);
                setSelectedTemplate(null);
              }}
              categories={categories}
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
              <h2 className="text-xl font-bold">Schedule Analytics</h2>
              <button
                onClick={() => setShowStats(false)}
                className={`p-1 rounded-full ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                ✕
              </button>
            </div>
            <ScheduleStats stats={stats} />
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
              <h2 className="text-xl font-bold">Filter Schedules</h2>
              <button
                onClick={() => setShowFilters(false)}
                className={`p-1 rounded-full ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                ✕
              </button>
            </div>
            <ScheduleFilters
              initialFilters={filters}
              onApply={handleFilterApply}
              onCancel={() => setShowFilters(false)}
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
              categories={categoryObjects}
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
    </div>
  );
};

export default SchedulePage;
