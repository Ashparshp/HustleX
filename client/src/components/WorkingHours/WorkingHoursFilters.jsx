import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag, Filter, X, Clock } from "lucide-react";
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
  const inputClass = `w-full px-3 py-2.5 rounded-lg border text-sm transition-all duration-200 ${
    isDark
      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 placeholder-indigo-500/70"
      : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 placeholder-indigo-600/50"
  } focus:outline-none focus:ring-2 focus:ring-indigo-500/50`;

  const labelClass = `block mb-2 text-sm font-medium ${
    isDark ? "text-gray-300" : "text-gray-700"
  }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-lg border shadow-lg ${
        isDark
          ? "bg-black/80 border-indigo-500/30"
          : "bg-white/90 border-indigo-300/50"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-lg font-semibold flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Filter size={18} />
          Filter Working Hours
        </h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className={`p-1.5 rounded-full transition-colors ${
            isDark
              ? "hover:bg-gray-700 text-gray-400 hover:text-white"
              : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
          }`}
        >
          <X size={16} />
        </motion.button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Date Range Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group/input">
              <label htmlFor="startDate" className={labelClass}>
                <div className="flex items-center">
                  <Calendar
                    size={16}
                    className={`mr-2 ${
                      isDark ? "text-indigo-400" : "text-indigo-600"
                    }`}
                  />
                  Start Date
                </div>
              </label>
              <div className="relative">
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="group/input">
              <label htmlFor="endDate" className={labelClass}>
                <div className="flex items-center">
                  <Calendar
                    size={16}
                    className={`mr-2 ${
                      isDark ? "text-indigo-400" : "text-indigo-600"
                    }`}
                  />
                  End Date
                </div>
              </label>
              <div className="relative">
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
          </div>

          {/* Category Field */}
          <div className="group/input">
            <label htmlFor="category" className={labelClass}>
              <div className="flex items-center">
                <Tag
                  size={16}
                  className={`mr-2 ${
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  }`}
                />
                Category
              </div>
            </label>
            <div className="relative">
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="pt-2">
            <h4
              className={`text-sm font-medium mb-2 flex items-center ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <Clock size={14} className="mr-2" />
              Quick Filters
            </h4>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {[
                { label: "This Week", days: 7, type: "week" },
                { label: "This Month", days: 30, type: "month" },
                { label: "Last 7 Days", days: 7, type: "days" },
                { label: "Last 30 Days", days: 30, type: "days" },
              ].map((quickFilter) => (
                <motion.button
                  key={quickFilter.label}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    const today = new Date();
                    let startDate;

                    if (quickFilter.type === "week") {
                      startDate = new Date();
                      startDate.setDate(
                        today.getDate() -
                          today.getDay() +
                          (today.getDay() === 0 ? -6 : 1)
                      );
                    } else if (quickFilter.type === "month") {
                      startDate = new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        1
                      );
                    } else {
                      startDate = new Date();
                      startDate.setDate(today.getDate() - quickFilter.days);
                    }

                    setFilters((prev) => ({
                      ...prev,
                      startDate: startDate.toISOString().split("T")[0],
                      endDate: today.toISOString().split("T")[0],
                    }));
                  }}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isDark
                      ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30"
                      : "bg-indigo-100/50 text-indigo-600 hover:bg-indigo-200/70 border border-indigo-300/50"
                  }`}
                >
                  {quickFilter.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Form Buttons */}
          <div className="flex gap-3 pt-5">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                isDark
                  ? "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 border border-gray-500/30"
                  : "bg-gray-100/50 text-gray-600 hover:bg-gray-200/70 border border-gray-300/50"
              }`}
            >
              Reset
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                isDark
                  ? "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 border border-gray-500/30"
                  : "bg-gray-100/50 text-gray-600 hover:bg-gray-200/70 border border-gray-300/50"
              }`}
            >
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 group
                ${
                  isDark
                    ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                    : "bg-emerald-100/50 text-emerald-600 hover:bg-emerald-200/70 border border-emerald-300/50"
                }
              `}
            >
              <Filter
                size={16}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              Apply Filters
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default WorkingHoursFilters;
