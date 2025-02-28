// src/components/Timetable/AddActivityModal.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Clock, Target, Layers, AlertCircle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const AddActivityModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  isLoading = false,
  isSubmitting = false,
}) => {
  const { isDark } = useTheme();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    time: "",
    category: "Core",
  });

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        time: initialData.time || "",
        category: initialData.category || "Core",
      });
    } else {
      setFormData({
        name: "",
        time: "",
        category: categories.length > 0 ? categories[0] : "Core",
      });
    }
  }, [initialData, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateTime = (time) => {
    // Check for format HH:MM-HH:MM where both times are valid
    const timePattern =
      /^([0-1][0-9]|2[0-3]):([0-5][0-9])-([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timePattern.test(time)) {
      return false;
    }

    // Further validation can be added here
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate form
    if (!formData.name.trim()) {
      setError("Activity name is required");
      return;
    }

    if (!formData.time || !validateTime(formData.time)) {
      setError("Please enter a valid time format (HH:MM-HH:MM)");
      return;
    }

    try {
      setError(null);
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || "Failed to save activity");
    }
  };

  if (!isOpen) return null;

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center py-2">
      <div
        className={`animate-spin rounded-full h-5 w-5 border-b-2 ${
          isDark ? "border-indigo-400" : "border-indigo-600"
        }`}
      ></div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3
          className={`text-xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {initialData ? "Edit Activity" : "Add Activity"}
        </h3>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg ${
            isDark
              ? "hover:bg-gray-800 text-gray-400"
              : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div
          className={`p-3 mb-4 rounded-lg flex items-start gap-2 ${
            isDark
              ? "bg-red-900/30 text-red-300 border border-red-900/50"
              : "bg-red-50 text-red-800 border border-red-100"
          }`}
        >
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Activity Name */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Activity Name
          </label>
          <div className="relative">
            <Target
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              } focus:ring-2 focus:border-transparent ${
                isDark ? "focus:ring-indigo-500/50" : "focus:ring-indigo-500/50"
              }`}
              placeholder="Enter activity name"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Time */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Time
          </label>
          <div className="relative">
            <Clock
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              } focus:ring-2 focus:border-transparent ${
                isDark ? "focus:ring-indigo-500/50" : "focus:ring-indigo-500/50"
              }`}
              placeholder="HH:MM-HH:MM"
              required
              disabled={isSubmitting}
            />
          </div>
          <p
            className={`mt-1 text-xs ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Format: 24-hour time (e.g., 09:00-11:30)
          </p>
        </div>

        {/* Category */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Category
          </label>
          <div className="relative">
            <Layers
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            />

            {isLoading ? (
              <div
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <LoadingSpinner />
              </div>
            ) : (
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border appearance-none ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:border-transparent ${
                  isDark
                    ? "focus:ring-indigo-500/50"
                    : "focus:ring-indigo-500/50"
                }`}
                required
                disabled={isSubmitting}
              >
                {categories && categories.length > 0 ? (
                  // Map through the provided categories
                  categories.map((category, index) => (
                    <option key={`${category}-${index}`} value={category}>
                      {category}
                    </option>
                  ))
                ) : (
                  // Default categories if none provided
                  <>
                    <option value="Career">Career</option>
                    <option value="Backend">Backend</option>
                    <option value="Core">Core</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Mobile">Mobile</option>
                  </>
                )}
              </select>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-lg border ${
              isDark
                ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting || isLoading}
            className={`px-4 py-2 rounded-lg ${
              isDark
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
                Saving...
              </span>
            ) : initialData ? (
              "Update Activity"
            ) : (
              "Add Activity"
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddActivityModal;
