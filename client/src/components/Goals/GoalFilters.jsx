import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Filter, Target, X, Clock } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const GoalFilters = ({ initialFilters, onApply, onCancel, platforms }) => {
  const { isDark } = useTheme();
  const [filters, setFilters] = useState({
    platform: "",
    participated: "",
    startDate: "",
    endDate: "",
  });

  // Initialize filters with initial values
  useEffect(() => {
    if (initialFilters) {
      const formattedFilters = {
        platform: initialFilters.platform || "",
        participated:
          initialFilters.participated !== undefined
            ? initialFilters.participated.toString()
            : "",
        startDate: initialFilters.startDate
          ? new Date(initialFilters.startDate).toISOString().split("T")[0]
          : "",
        endDate: initialFilters.endDate
          ? new Date(initialFilters.endDate).toISOString().split("T")[0]
          : "",
      };
      setFilters(formattedFilters);
    }
  }, [initialFilters]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert string dates to Date objects for API
    const formattedFilters = {
      ...filters,
      startDate: filters.startDate ? new Date(filters.startDate) : null,
      endDate: filters.endDate ? new Date(filters.endDate) : null,
    };

    onApply(formattedFilters);
  };

  // Quick date selectors
  const quickDateSelectors = [
    {
      label: "Last Month",
      action: () => {
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(today.getMonth() - 1);

        setFilters((prev) => ({
          ...prev,
          startDate: lastMonth.toISOString().split("T")[0],
          endDate: today.toISOString().split("T")[0],
        }));
      },
    },
    {
      label: "Last 3 Months",
      action: () => {
        const today = new Date();
        const lastThreeMonths = new Date();
        lastThreeMonths.setMonth(today.getMonth() - 3);

        setFilters((prev) => ({
          ...prev,
          startDate: lastThreeMonths.toISOString().split("T")[0],
          endDate: today.toISOString().split("T")[0],
        }));
      },
    },
    {
      label: "Last 6 Months",
      action: () => {
        const today = new Date();
        const lastSixMonths = new Date();
        lastSixMonths.setMonth(today.getMonth() - 6);

        setFilters((prev) => ({
          ...prev,
          startDate: lastSixMonths.toISOString().split("T")[0],
          endDate: today.toISOString().split("T")[0],
        }));
      },
    },
    {
      label: "Last Year",
      action: () => {
        const today = new Date();
        const lastYear = new Date();
        lastYear.setFullYear(today.getFullYear() - 1);

        setFilters((prev) => ({
          ...prev,
          startDate: lastYear.toISOString().split("T")[0],
          endDate: today.toISOString().split("T")[0],
        }));
      },
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Platform filter */}
      <div>
        <label
          htmlFor="platform"
          className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Platform
        </label>
        <div className="relative">
          <Target
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}
          />
          <select
            id="platform"
            name="platform"
            value={filters.platform}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border appearance-none transition-all duration-300
              ${
                isDark
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                  : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
              }`}
          >
            <option value="">All Platforms</option>
            {platforms.map((platform, index) => {
              const platformName =
                typeof platform === "string" ? platform : platform.name;
              return (
                <option key={index} value={platformName}>
                  {platformName}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Participation status */}
      <div>
        <label
          htmlFor="participated"
          className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Participation Status
        </label>
        <div className="relative">
          <Clock
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}
          />
          <select
            id="participated"
            name="participated"
            value={filters.participated}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border appearance-none transition-all duration-300
              ${
                isDark
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                  : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
              }`}
          >
            <option value="">All</option>
            <option value="true">Participated</option>
            <option value="false">Not Participated</option>
          </select>
        </div>
      </div>

      {/* Date range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="startDate"
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Start Date
          </label>
          <div className="relative">
            <Calendar
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
                ${
                  isDark
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                    : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
                }`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="endDate"
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            End Date
          </label>
          <div className="relative">
            <Calendar
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
                ${
                  isDark
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                    : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
                }`}
            />
          </div>
        </div>
      </div>

      {/* Quick date selectors */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Quick Select
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {quickDateSelectors.map((selector, index) => (
            <motion.button
              key={index}
              type="button"
              onClick={selector.action}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`py-2 px-3 text-xs rounded-lg transition-all duration-300 ${
                isDark
                  ? "bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                  : "bg-indigo-100/50 border border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
              }`}
            >
              {selector.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      <div className="text-right">
        <motion.button
          type="button"
          onClick={() => {
            setFilters({
              platform: "",
              participated: "",
              startDate: "",
              endDate: "",
            });
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`text-sm flex items-center ${
            isDark
              ? "text-red-400 hover:text-red-300"
              : "text-red-600 hover:text-red-700"
          }`}
        >
          <X className="mr-1 w-4 h-4" />
          Clear All Filters
        </motion.button>
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-6 py-2.5 rounded-lg border transition-all duration-300
            ${
              isDark
                ? "bg-transparent border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                : "bg-transparent border-indigo-300/50 text-indigo-600 hover:bg-indigo-50"
            }`}
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-6 py-2.5 rounded-lg flex items-center transition-all duration-300
            ${
              isDark
                ? "bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                : "bg-indigo-100/50 border border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
            }`}
        >
          <Filter size={16} className="mr-2" />
          Apply Filters
        </motion.button>
      </div>
    </form>
  );
};

export default GoalFilters;
