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
