import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Calendar, Filter } from "lucide-react";

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

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Platform filter */}
        <div>
          <label
            htmlFor="platform"
            className={`block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Platform
          </label>
          <select
            id="platform"
            name="platform"
            value={filters.platform}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
              isDark
                ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
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

        {/* Participation status */}
        <div>
          <label
            htmlFor="participated"
            className={`block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Participation Status
          </label>
          <select
            id="participated"
            name="participated"
            value={filters.participated}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
              isDark
                ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
          >
            <option value="">All</option>
            <option value="true">Participated</option>
            <option value="false">Not Participated</option>
          </select>
        </div>

        {/* Date range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startDate"
              className={`block text-sm font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Start Date
            </label>
            <div className="relative mt-1">
              <div
                className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <Calendar size={16} />
              </div>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm py-2 pl-10 pr-3 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="endDate"
              className={`block text-sm font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              End Date
            </label>
            <div className="relative mt-1">
              <div
                className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <Calendar size={16} />
              </div>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm py-2 pl-10 pr-3 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Quick date selectors */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Quick Select
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const lastMonth = new Date();
                lastMonth.setMonth(today.getMonth() - 1);

                setFilters({
                  ...filters,
                  startDate: lastMonth.toISOString().split("T")[0],
                  endDate: today.toISOString().split("T")[0],
                });
              }}
              className={`py-1 px-2 text-xs rounded-md ${
                isDark
                  ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Last Month
            </button>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const lastThreeMonths = new Date();
                lastThreeMonths.setMonth(today.getMonth() - 3);

                setFilters({
                  ...filters,
                  startDate: lastThreeMonths.toISOString().split("T")[0],
                  endDate: today.toISOString().split("T")[0],
                });
              }}
              className={`py-1 px-2 text-xs rounded-md ${
                isDark
                  ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Last 3 Months
            </button>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const lastSixMonths = new Date();
                lastSixMonths.setMonth(today.getMonth() - 6);

                setFilters({
                  ...filters,
                  startDate: lastSixMonths.toISOString().split("T")[0],
                  endDate: today.toISOString().split("T")[0],
                });
              }}
              className={`py-1 px-2 text-xs rounded-md ${
                isDark
                  ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Last 6 Months
            </button>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const lastYear = new Date();
                lastYear.setFullYear(today.getFullYear() - 1);

                setFilters({
                  ...filters,
                  startDate: lastYear.toISOString().split("T")[0],
                  endDate: today.toISOString().split("T")[0],
                });
              }}
              className={`py-1 px-2 text-xs rounded-md ${
                isDark
                  ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Last Year
            </button>
          </div>
        </div>

        {/* Clear filters */}
        <div className="text-right">
          <button
            type="button"
            onClick={() => {
              setFilters({
                platform: "",
                participated: "",
                startDate: "",
                endDate: "",
              });
            }}
            className={`text-sm ${
              isDark
                ? "text-red-400 hover:text-red-300"
                : "text-red-600 hover:text-red-700"
            }`}
          >
            Clear All Filters
          </button>
        </div>

        {/* Form actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isDark
                ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 flex items-center"
          >
            <Filter size={16} className="mr-1" />
            Apply Filters
          </button>
        </div>
      </div>
    </form>
  );
};

export default GoalFilters;
