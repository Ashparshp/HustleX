// src/components/WorkingHours/WorkingHoursForm.jsx
import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Calendar, Clock, Tag, MessageSquare, ThumbsUp } from "lucide-react";

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
      {error && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
          }`}
        >
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Date Field */}
        <div>
          <label htmlFor="date" className={labelClass}>
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
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
        </div>

        {/* Hours Fields */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="targetHours" className={labelClass}>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
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

          <div className="flex-1">
            <label htmlFor="achievedHours" className={labelClass}>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
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
        <div>
          <label htmlFor="mood" className={labelClass}>
            <div className="flex items-center">
              <ThumbsUp size={16} className="mr-1" />
              Mood
            </div>
          </label>
          <select
            id="mood"
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="Productive">Productive</option>
            <option value="Normal">Normal</option>
            <option value="Distracted">Distracted</option>
          </select>
        </div>

        {/* Notes Field */}
        <div>
          <label htmlFor="notes" className={labelClass}>
            <div className="flex items-center">
              <MessageSquare size={16} className="mr-1" />
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
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className={secondaryButtonClass}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={primaryButtonClass}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : initialData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default WorkingHoursForm;
