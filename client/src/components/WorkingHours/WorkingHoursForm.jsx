import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import {
  Calendar,
  Clock,
  Tag,
  MessageSquare,
  ThumbsUp,
  Save,
  X,
  AlertTriangle,
} from "lucide-react";

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

  // Updated styling for form inputs
  const inputClass = `w-full px-3 py-2.5 rounded-lg border text-sm transition-all duration-200 ${
    isDark
      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 placeholder-indigo-500/70"
      : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 placeholder-indigo-600/50"
  } focus:outline-none focus:ring-2 focus:ring-indigo-500/50`;

  const labelClass = `block mb-2 text-sm font-medium ${
    isDark ? "text-gray-300" : "text-gray-700"
  }`;

  // Get mood color class
  const getMoodColorClass = (mood) => {
    const moodColors = {
      Productive: isDark
        ? "bg-green-500/10 text-green-400 border-green-500/30"
        : "bg-green-100/50 text-green-600 border-green-300/50",
      Normal: isDark
        ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
        : "bg-blue-100/50 text-blue-600 border-blue-300/50",
      Distracted: isDark
        ? "bg-red-500/10 text-red-400 border-red-500/30"
        : "bg-red-100/50 text-red-600 border-red-300/50",
    };

    return (
      moodColors[mood] ||
      (isDark
        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
        : "bg-indigo-100/50 text-indigo-600 border-indigo-300/50")
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-3 rounded-lg text-sm flex items-start gap-2 ${
            isDark
              ? "bg-red-500/10 text-red-400 border border-red-500/30"
              : "bg-red-100/70 text-red-600 border border-red-300/50"
          }`}
        >
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="space-y-4">
        {/* Date Field */}
        <div className="group/input">
          <label htmlFor="date" className={labelClass}>
            <div className="flex items-center">
              <Calendar
                size={16}
                className={`mr-2 ${
                  isDark ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
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

        {/* Hours Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group/input">
            <label htmlFor="targetHours" className={labelClass}>
              <div className="flex items-center">
                <Clock
                  size={16}
                  className={`mr-2 ${
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  }`}
                />
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

          <div className="group/input">
            <label htmlFor="achievedHours" className={labelClass}>
              <div className="flex items-center">
                <Clock
                  size={16}
                  className={`mr-2 ${
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  }`}
                />
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
        <div className="group/input">
          <label htmlFor="mood" className={labelClass}>
            <div className="flex items-center">
              <ThumbsUp
                size={16}
                className={`mr-2 ${
                  isDark ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
              Mood
            </div>
          </label>

          <div className="grid grid-cols-3 gap-2">
            {["Productive", "Normal", "Distracted"].map((moodOption) => (
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                key={moodOption}
                className={`cursor-pointer border py-2 px-3 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  formData.mood === moodOption
                    ? getMoodColorClass(moodOption)
                    : isDark
                    ? "bg-gray-800/50 text-gray-400 border-gray-700"
                    : "bg-gray-100/50 text-gray-600 border-gray-300/50"
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, mood: moodOption }))
                }
              >
                {moodOption}
              </motion.div>
            ))}
          </div>
          <input type="hidden" name="mood" value={formData.mood} />
        </div>

        {/* Notes Field */}
        <div className="group/input">
          <label htmlFor="notes" className={labelClass}>
            <div className="flex items-center">
              <MessageSquare
                size={16}
                className={`mr-2 ${
                  isDark ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
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
        <div className="flex gap-3 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 ${
              isDark
                ? "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 border border-gray-500/30"
                : "bg-gray-100/50 text-gray-600 hover:bg-gray-200/70 border border-gray-300/50"
            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <X size={16} />
            Cancel
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 group
              ${
                isDark
                  ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                  : "bg-emerald-100/50 text-emerald-600 hover:bg-emerald-200/70 border border-emerald-300/50"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Save
              size={16}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            {isSubmitting ? "Saving..." : initialData ? "Update" : "Save"}
          </motion.button>
        </div>
      </div>
    </form>
  );
};

export default WorkingHoursForm;
