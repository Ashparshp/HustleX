// src/components/WorkingHours/WorkingHoursFilters.jsx
import { useState, useEffect } from "react";
import { Calendar, Tag, Filter } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const WorkingHoursFilters = ({
  initialFilters,
  onApply,
  onCancel,
  categories,
}) => {
  const { isDark } = useTheme();
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
  });

  // Initialize with any existing filters
  useEffect(() => {
    if (initialFilters) {
      setFilters({
        startDate: initialFilters.startDate
          ? new Date(initialFilters.startDate).toISOString().split("T")[0]
          : "",
        endDate: initialFilters.endDate
          ? new Date(initialFilters.endDate).toISOString().split("T")[0]
          : "",
        category: initialFilters.category || "",
      });
    }
  }, [initialFilters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(filters);
  };

  const handleReset = () => {
    setFilters({
      startDate: "",
      endDate: "",
      category: "",
    });
  };

  // Base styling for form inputs
  const inputClass = `w-full px-3 py-2 rounded-lg border ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
  } focus:outline-none focus:ring-2 ${
    isDark ? "focus:ring-indigo-500/50" : "focus:ring-indigo-500/30"
  }`;

  const labelClass = `block mb-1 text-sm font-medium ${
    isDark ? "text-gray-300" : "text-gray-700"
  }`;

  const buttonClass = `w-full py-2 px-4 rounded-lg font-medium transition-colors`;
  const primaryButtonClass = `${buttonClass} ${
    isDark
      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
      : "bg-indigo-600 hover:bg-indigo-700 text-white"
  }`;
  const secondaryButtonClass = `${buttonClass} ${
    isDark
      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
  }`;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Date Range Fields */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="startDate" className={labelClass}>
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                Start Date
              </div>
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={filters.startDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex-1">
            <label htmlFor="endDate" className={labelClass}>
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                End Date
              </div>
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={filters.endDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="category" className={labelClass}>
            <div className="flex items-center">
              <Tag size={16} className="mr-1" />
              Category
            </div>
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">All Categories</option>
            {/* Use dynamic categories if available, otherwise fallback to defaults */}
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))
            ) : (
              <>
                <option value="Coding">Coding</option>
                <option value="Learning">Learning</option>
                <option value="Project Work">Project Work</option>
                <option value="Other">Other</option>
              </>
            )}
          </select>
        </div>

        {/* Quick Filter Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              const today = new Date();
              const startOfWeek = new Date();
              startOfWeek.setDate(
                today.getDate() -
                  today.getDay() +
                  (today.getDay() === 0 ? -6 : 1)
              ); // Start of week (Monday)

              setFilters((prev) => ({
                ...prev,
                startDate: startOfWeek.toISOString().split("T")[0],
                endDate: today.toISOString().split("T")[0],
              }));
            }}
            className={`text-sm p-2 rounded ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            This Week
          </button>

          <button
            type="button"
            onClick={() => {
              const today = new Date();
              const startOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
              );

              setFilters((prev) => ({
                ...prev,
                startDate: startOfMonth.toISOString().split("T")[0],
                endDate: today.toISOString().split("T")[0],
              }));
            }}
            className={`text-sm p-2 rounded ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            This Month
          </button>

          <button
            type="button"
            onClick={() => {
              const today = new Date();
              const oneWeekAgo = new Date();
              oneWeekAgo.setDate(today.getDate() - 7);

              setFilters((prev) => ({
                ...prev,
                startDate: oneWeekAgo.toISOString().split("T")[0],
                endDate: today.toISOString().split("T")[0],
              }));
            }}
            className={`text-sm p-2 rounded ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Last 7 Days
          </button>

          <button
            type="button"
            onClick={() => {
              const today = new Date();
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(today.getDate() - 30);

              setFilters((prev) => ({
                ...prev,
                startDate: thirtyDaysAgo.toISOString().split("T")[0],
                endDate: today.toISOString().split("T")[0],
              }));
            }}
            className={`text-sm p-2 rounded ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Last 30 Days
          </button>
        </div>

        {/* Form Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={handleReset}
            className={`${secondaryButtonClass} flex-1`}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={`${secondaryButtonClass} flex-1`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${primaryButtonClass} flex-1 flex items-center justify-center`}
          >
            <Filter size={16} className="mr-1" />
            Apply Filters
          </button>
        </div>
      </div>
    </form>
  );
};

export default WorkingHoursFilters;


// src/components/WorkingHours/WorkingHoursForm.jsx
import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Calendar, Clock, Tag, MessageSquare, ThumbsUp } from "lucide-react";

const WorkingHoursForm = ({ initialData, onSubmit, onCancel, categories }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "Coding",
    targetHours: 15,
    achievedHours: 0,
    mood: "Normal",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        date: new Date(initialData.date).toISOString().split("T")[0],
        category: initialData.category,
        targetHours: initialData.targetHours,
        achievedHours: initialData.achievedHours,
        mood: initialData.mood,
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const validateForm = () => {
    // Ensure date is valid
    if (!formData.date) {
      setError("Date is required");
      return false;
    }

    // Ensure target hours is positive
    if (formData.targetHours < 0) {
      setError("Target hours cannot be negative");
      return false;
    }

    // Ensure achieved hours is positive
    if (formData.achievedHours < 0) {
      setError("Achieved hours cannot be negative");
      return false;
    }

    // Ensure category is selected
    if (!formData.category) {
      setError("Category is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || "Failed to save working hours");
      setIsSubmitting(false);
    }
  };

  // Base styling for form inputs
  const inputClass = `w-full px-3 py-2 rounded-lg border ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
  } focus:outline-none focus:ring-2 ${
    isDark ? "focus:ring-indigo-500/50" : "focus:ring-indigo-500/30"
  }`;

  const labelClass = `block mb-1 text-sm font-medium ${
    isDark ? "text-gray-300" : "text-gray-700"
  }`;

  const buttonClass = `w-full py-2 px-4 rounded-lg font-medium transition-colors`;
  const primaryButtonClass = `${buttonClass} ${
    isDark
      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
      : "bg-indigo-600 hover:bg-indigo-700 text-white"
  }`;
  const secondaryButtonClass = `${buttonClass} ${
    isDark
      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
  }`;

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
          }`}
        >
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Date Field */}
        <div>
          <label htmlFor="date" className={labelClass}>
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              Date
            </div>
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="category" className={labelClass}>
            <div className="flex items-center">
              <Tag size={16} className="mr-1" />
              Category
            </div>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClass}
            required
          >
            {/* Use dynamic categories if available, otherwise fallback to defaults */}
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))
            ) : (
              <>
                <option value="Coding">Coding</option>
                <option value="Learning">Learning</option>
                <option value="Project Work">Project Work</option>
                <option value="Other">Other</option>
              </>
            )}
          </select>
        </div>

        {/* Hours Fields */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="targetHours" className={labelClass}>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                Target Hours
              </div>
            </label>
            <input
              id="targetHours"
              name="targetHours"
              type="number"
              min="0"
              step="0.5"
              value={formData.targetHours}
              onChange={handleNumberChange}
              className={inputClass}
              required
            />
          </div>

          <div className="flex-1">
            <label htmlFor="achievedHours" className={labelClass}>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                Achieved Hours
              </div>
            </label>
            <input
              id="achievedHours"
              name="achievedHours"
              type="number"
              min="0"
              step="0.5"
              value={formData.achievedHours}
              onChange={handleNumberChange}
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Mood Field */}
        <div>
          <label htmlFor="mood" className={labelClass}>
            <div className="flex items-center">
              <ThumbsUp size={16} className="mr-1" />
              Mood
            </div>
          </label>
          <select
            id="mood"
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="Productive">Productive</option>
            <option value="Normal">Normal</option>
            <option value="Distracted">Distracted</option>
          </select>
        </div>

        {/* Notes Field */}
        <div>
          <label htmlFor="notes" className={labelClass}>
            <div className="flex items-center">
              <MessageSquare size={16} className="mr-1" />
              Notes (Optional)
            </div>
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className={inputClass}
            placeholder="Add any notes or details..."
          ></textarea>
        </div>

        {/* Form Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className={secondaryButtonClass}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={primaryButtonClass}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : initialData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default WorkingHoursForm;

// src/components/WorkingHours/WorkingHoursStats.jsx
import { useTheme } from "../../context/ThemeContext";
import {
  BarChart2,
  Clock,
  Target,
  CheckCircle,
  ThumbsUp,
  Tag,
} from "lucide-react";

const WorkingHoursStats = ({ stats }) => {
  const { isDark } = useTheme();

  // Helper to get color classes based on completion percentage
  const getCompletionColorClass = (percentage) => {
    if (percentage >= 90) {
      return isDark ? "text-green-400" : "text-green-600";
    } else if (percentage >= 75) {
      return isDark ? "text-lime-400" : "text-lime-600";
    } else if (percentage >= 50) {
      return isDark ? "text-yellow-400" : "text-yellow-600";
    } else if (percentage >= 25) {
      return isDark ? "text-orange-400" : "text-orange-600";
    } else {
      return isDark ? "text-red-400" : "text-red-600";
    }
  };

  // Calculate efficiency percentage
  const efficiency =
    stats.totalTargetHours > 0
      ? (stats.totalAchievedHours / stats.totalTargetHours) * 100
      : 0;

  const statCardClass = `rounded-lg p-4 ${
    isDark ? "bg-gray-700" : "bg-gray-100"
  }`;

  const headingClass = `text-lg font-medium mb-3 flex items-center gap-2 ${
    isDark ? "text-white" : "text-gray-900"
  }`;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average Completion */}
        <div className={statCardClass}>
          <h3 className={headingClass}>
            <Target size={20} />
            Average Completion
          </h3>
          <p
            className={`text-3xl font-bold ${getCompletionColorClass(
              stats.averageCompletion
            )}`}
          >
            {stats.averageCompletion.toFixed(1)}%
          </p>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Across {stats.totalDays || 0} days
          </p>
        </div>

        {/* Total Hours */}
        <div className={statCardClass}>
          <h3 className={headingClass}>
            <Clock size={20} />
            Hours Overview
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Target
              </p>
              <p className="text-xl font-semibold">
                {stats.totalTargetHours?.toFixed(1) || 0}h
              </p>
            </div>
            <div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Achieved
              </p>
              <p className="text-xl font-semibold">
                {stats.totalAchievedHours?.toFixed(1) || 0}h
              </p>
            </div>
            <div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Efficiency
              </p>
              <p
                className={`text-xl font-semibold ${getCompletionColorClass(
                  efficiency
                )}`}
              >
                {efficiency.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className={statCardClass}>
          <h3 className={headingClass}>
            <ThumbsUp size={20} />
            Mood Distribution
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.moodDistribution || {}).map(
              ([mood, count]) => (
                <div key={mood} className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getMoodColorClass(
                      mood,
                      isDark
                    )}`}
                  >
                    {mood}
                  </span>
                  <span
                    className={`font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {count} days
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className={statCardClass}>
        <h3 className={headingClass}>
          <Tag size={20} />
          Category Breakdown
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.categoryBreakdown || {}).length > 0 ? (
            Object.entries(stats.categoryBreakdown).map(([category, hours]) => (
              <div key={category}>
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {category}
                  </span>
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {hours.toFixed(1)} hours
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className={getCategoryProgressColor(category, isDark)}
                    style={{
                      width: `${(
                        (hours / stats.totalAchievedHours) *
                        100
                      ).toFixed(1)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No category data available.
            </p>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className={`${statCardClass} text-center`}>
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {stats.totalDays || 0} total days tracked with{" "}
          {stats.totalAchievedHours?.toFixed(1) || 0} hours achieved out of{" "}
          {stats.totalTargetHours?.toFixed(1) || 0} target hours.
        </p>
      </div>
    </div>
  );
};

// Helper functions for styling
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

const getCategoryProgressColor = (category, isDark) => {
  const categoryColors = {
    Coding: isDark ? "bg-blue-500" : "bg-blue-600",
    Learning: isDark ? "bg-green-500" : "bg-green-600",
    "Project Work": isDark ? "bg-purple-500" : "bg-purple-600",
    Other: isDark ? "bg-gray-500" : "bg-gray-600",
  };

  return (
    categoryColors[category] || (isDark ? "bg-indigo-500" : "bg-indigo-600")
  );
};

export default WorkingHoursStats;
