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
}) => {
  const { isDark } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || "Failed to save activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border appearance-none ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:border-transparent ${
                isDark ? "focus:ring-indigo-500/50" : "focus:ring-indigo-500/50"
              }`}
              required
            >
              {categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category} value={category}>
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
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-lg ${
              isDark
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting
              ? "Saving..."
              : initialData
              ? "Update Activity"
              : "Add Activity"}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddActivityModal;
