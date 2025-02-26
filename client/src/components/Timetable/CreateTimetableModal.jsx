// src/components/Timetable/CreateTimetableModal.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save, Calendar, Clipboard, AlertCircle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const CreateTimetableModal = ({ onClose, onSubmit, initialData = null }) => {
  const { isDark } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  // If editing, load initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        isActive:
          initialData.isActive !== undefined ? initialData.isActive : true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate form
    if (!formData.name.trim()) {
      setError("Timetable name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Make a copy of the data to avoid reference issues
      const dataToSubmit = { ...formData };

      // Debug log
      console.log("Submitting timetable data:", dataToSubmit);

      await onSubmit(dataToSubmit);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save timetable");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3
          className={`text-xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {initialData ? "Edit Timetable" : "Create New Timetable"}
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className={`block text-sm font-medium mb-1 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Timetable Name *
          </label>
          <div className="relative">
            <Calendar
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Work Schedule, Study Plan"
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              }`}
              required
            />
          </div>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-1 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Description (Optional)
          </label>
          <div className="relative">
            <Clipboard
              className={`absolute left-3 top-3 w-5 h-5 ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a description for your timetable"
              rows={3}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              }`}
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className={`w-4 h-4 rounded ${
              isDark
                ? "bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                : "bg-gray-100 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            }`}
          />
          <label
            htmlFor="isActive"
            className={`ml-2 text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Set as active timetable
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
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
            className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium ${
              isDark
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            } transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Save size={16} />
            {isSubmitting
              ? "Saving..."
              : initialData
              ? "Update Timetable"
              : "Create Timetable"}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default CreateTimetableModal;
