import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Calendar, Filter } from "lucide-react";

const ScheduleFilters = ({ initialFilters, onApply, onCancel }) => {
  const { isDark } = useTheme();
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });

  // Initialize filters with initial values
  useEffect(() => {
    if (initialFilters) {
      const formattedFilters = {
        startDate: initialFilters.startDate
          ? new Date(initialFilters.startDate).toISOString().split("T")[0]
          : "",
        endDate: initialFilters.endDate
          ? new Date(initialFilters.endDate).toISOString().split("T")[0]
          : "",
        status: initialFilters.status || "",
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

        {/* Status filter */}
        <div>
          <label
            htmlFor="status"
            className={`block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
              isDark
                ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
          >
            <option value="">All Statuses</option>
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
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
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

                setFilters({
                  ...filters,
                  startDate: startOfWeek.toISOString().split("T")[0],
                  endDate: today.toISOString().split("T")[0],
                });
              }}
              className={`py-1 px-2 text-xs rounded-md ${
                isDark
                  ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const lastWeek = new Date();
                lastWeek.setDate(today.getDate() - 7);

                setFilters({
                  ...filters,
                  startDate: lastWeek.toISOString().split("T")[0],
                  endDate: today.toISOString().split("T")[0],
                });
              }}
              className={`py-1 px-2 text-xs rounded-md ${
                isDark
                  ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Last 7 Days
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

                setFilters({
                  ...filters,
                  startDate: startOfMonth.toISOString().split("T")[0],
                  endDate: today.toISOString().split("T")[0],
                });
              }}
              className={`py-1 px-2 text-xs rounded-md ${
                isDark
                  ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              This Month
            </button>
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
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Status quick filters */}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => {
              setFilters({
                ...filters,
                status: "Completed",
              });
            }}
            className={`py-1 px-3 text-xs rounded-md ${
              filters.status === "Completed"
                ? "bg-green-600 text-white"
                : isDark
                ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Completed Only
          </button>
          <button
            type="button"
            onClick={() => {
              setFilters({
                ...filters,
                status: "In Progress",
              });
            }}
            className={`py-1 px-3 text-xs rounded-md ${
              filters.status === "In Progress"
                ? "bg-blue-600 text-white"
                : isDark
                ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            In Progress Only
          </button>
          <button
            type="button"
            onClick={() => {
              setFilters({
                ...filters,
                status: "Planned",
              });
            }}
            className={`py-1 px-3 text-xs rounded-md ${
              filters.status === "Planned"
                ? "bg-gray-800 text-white"
                : isDark
                ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Planned Only
          </button>
        </div>

        {/* Clear filters */}
        <div className="text-right">
          <button
            type="button"
            onClick={() => {
              setFilters({
                startDate: "",
                endDate: "",
                status: "",
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

export default ScheduleFilters;
