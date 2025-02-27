// src/components/Contests/ContestFilters.jsx
import { useState, useEffect } from "react";
import { Calendar, Tag, Filter, Check } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ContestFilters = ({
  initialFilters,
  onApply,
  onCancel,
  platforms = [],
}) => {
  const { isDark } = useTheme();
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    platform: "",
    participated: null,
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
        platform: initialFilters.platform || "",
        participated: initialFilters.participated,
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

  const handleParticipationChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      participated: value,
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
      platform: "",
      participated: null,
    });
  };

  // Base styling for form inputs
  const inputClass = `w-full px-3 py-2 rounded-lg border ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
  } focus:outline-none focus:ring-2 ${
    isDark ? "focus:ring-purple-500/50" : "focus:ring-purple-500/30"
  }`;

  const labelClass = `block mb-1 text-sm font-medium ${
    isDark ? "text-gray-300" : "text-gray-700"
  }`;

  const buttonClass = `w-full py-2 px-4 rounded-lg font-medium transition-colors`;
  const primaryButtonClass = `${buttonClass} ${
    isDark
      ? "bg-purple-600 hover:bg-purple-700 text-white"
      : "bg-purple-600 hover:bg-purple-700 text-white"
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

        {/* Platform Field */}
        <div>
          <label htmlFor="platform" className={labelClass}>
            <div className="flex items-center">
              <Tag size={16} className="mr-1" />
              Platform
            </div>
          </label>
          <select
            id="platform"
            name="platform"
            value={filters.platform}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">All Platforms</option>
            {platforms.map((platform, index) => (
              <option
                key={index}
                value={typeof platform === "string" ? platform : platform.name}
              >
                {typeof platform === "string" ? platform : platform.name}
              </option>
            ))}
          </select>
        </div>

        {/* Participation Filter */}
        <div>
          <label className={labelClass}>
            <div className="flex items-center">
              <Check size={16} className="mr-1" />
              Participation
            </div>
          </label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <button
              type="button"
              onClick={() => handleParticipationChange(null)}
              className={`py-2 px-3 text-sm rounded-lg transition-colors ${
                filters.participated === null
                  ? isDark
                    ? "bg-purple-500/30 text-purple-200 border border-purple-500"
                    : "bg-purple-100 text-purple-800 border border-purple-500"
                  : isDark
                  ? "bg-gray-700 text-gray-300 border border-gray-600"
                  : "bg-gray-100 text-gray-700 border border-gray-300"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => handleParticipationChange(true)}
              className={`py-2 px-3 text-sm rounded-lg transition-colors ${
                filters.participated === true
                  ? isDark
                    ? "bg-green-500/30 text-green-200 border border-green-500"
                    : "bg-green-100 text-green-800 border border-green-500"
                  : isDark
                  ? "bg-gray-700 text-gray-300 border border-gray-600"
                  : "bg-gray-100 text-gray-700 border border-gray-300"
              }`}
            >
              Participated
            </button>
            <button
              type="button"
              onClick={() => handleParticipationChange(false)}
              className={`py-2 px-3 text-sm rounded-lg transition-colors ${
                filters.participated === false
                  ? isDark
                    ? "bg-red-500/30 text-red-200 border border-red-500"
                    : "bg-red-100 text-red-800 border border-red-500"
                  : isDark
                  ? "bg-gray-700 text-gray-300 border border-gray-600"
                  : "bg-gray-100 text-gray-700 border border-gray-300"
              }`}
            >
              Not Participated
            </button>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
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
            Current Month
          </button>

          <button
            type="button"
            onClick={() => {
              const today = new Date();
              const sixMonthsAgo = new Date();
              sixMonthsAgo.setMonth(today.getMonth() - 6);

              setFilters((prev) => ({
                ...prev,
                startDate: sixMonthsAgo.toISOString().split("T")[0],
                endDate: today.toISOString().split("T")[0],
              }));
            }}
            className={`text-sm p-2 rounded ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Last 6 Months
          </button>

          <button
            type="button"
            onClick={() => {
              const today = new Date();
              const threeMonthsAgo = new Date();
              threeMonthsAgo.setMonth(today.getMonth() - 3);

              setFilters((prev) => ({
                ...prev,
                startDate: threeMonthsAgo.toISOString().split("T")[0],
                endDate: today.toISOString().split("T")[0],
              }));
            }}
            className={`text-sm p-2 rounded ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Last 3 Months
          </button>

          <button
            type="button"
            onClick={() => {
              const today = new Date();
              const startOfYear = new Date(today.getFullYear(), 0, 1);

              setFilters((prev) => ({
                ...prev,
                startDate: startOfYear.toISOString().split("T")[0],
                endDate: today.toISOString().split("T")[0],
              }));
            }}
            className={`text-sm p-2 rounded ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            This Year
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

export default ContestFilters;
