import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Clock, Tag, AlertTriangle } from "lucide-react";

const ScheduleItemForm = ({
  initialData,
  onSubmit,
  onCancel,
  categories,
  scheduleDate,
}) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "09:00",
    endTime: "10:00",
    category:
      categories && categories.length > 0
        ? typeof categories[0] === "string"
          ? categories[0]
          : categories[0].name
        : "",
    priority: "Medium",
    completed: false,
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [isOverlap, setIsOverlap] = useState(false);

  // Populate form with initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        category:
          initialData.category ||
          (categories && categories.length > 0
            ? typeof categories[0] === "string"
              ? categories[0]
              : categories[0].name
            : ""),
      });
    }
  }, [initialData, categories]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear any errors for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Check for time overlap
    if (name === "startTime" || name === "endTime") {
      const start = name === "startTime" ? value : formData.startTime;
      const end = name === "endTime" ? value : formData.endTime;

      if (start && end) {
        const startTime = new Date(`2000-01-01T${start}`);
        const endTime = new Date(`2000-01-01T${end}`);

        if (endTime <= startTime) {
          setIsOverlap(true);
        } else {
          setIsOverlap(false);
        }
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }
    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    // Check for time overlap
    if (formData.startTime && formData.endTime) {
      const startTime = new Date(`2000-01-01T${formData.startTime}`);
      const endTime = new Date(`2000-01-01T${formData.endTime}`);

      if (endTime <= startTime) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  // Get available categories
  const getAvailableCategories = () => {
    if (!categories || categories.length === 0) {
      return [{ name: "Work", color: "#3498db" }];
    }

    return categories.map((cat) => {
      if (typeof cat === "string") {
        return { name: cat };
      }
      return cat;
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Schedule date info */}
        {scheduleDate && (
          <div
            className={`p-3 rounded-lg ${
              isDark ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Adding to schedule for: {formatDate(scheduleDate)}
            </p>
          </div>
        )}

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className={`block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Title*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
              isDark
                ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            } ${errors.title ? "border-red-500" : ""}`}
            placeholder="e.g., Team Meeting, Study Session, etc."
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className={`block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows="2"
            className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
              isDark
                ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
            placeholder="Brief description of this activity (optional)"
          />
        </div>

        {/* Time range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startTime"
              className={`block text-sm font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Start Time*
            </label>
            <div className="relative mt-1">
              <div
                className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <Clock size={16} />
              </div>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className={`block w-full rounded-md shadow-sm py-2 pl-10 pr-3 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                } ${errors.startTime ? "border-red-500" : ""}`}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="endTime"
              className={`block text-sm font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              End Time*
            </label>
            <div className="relative mt-1">
              <div
                className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <Clock size={16} />
              </div>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className={`block w-full rounded-md shadow-sm py-2 pl-10 pr-3 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                } ${errors.endTime || isOverlap ? "border-red-500" : ""}`}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
              )}
            </div>
          </div>
        </div>

        {/* Time overlap warning */}
        {isOverlap && (
          <div
            className={`p-3 rounded-lg flex items-start ${
              isDark ? "bg-red-900/30 text-red-300" : "bg-red-50 text-red-800"
            }`}
          >
            <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              End time must be after start time. Please adjust the times.
            </p>
          </div>
        )}

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className={`block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Category*
          </label>
          <div className="relative mt-1">
            <div
              className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <Tag size={16} />
            </div>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={`block w-full rounded-md shadow-sm py-2 pl-10 pr-3 ${
                isDark
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                  : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              } ${errors.category ? "border-red-500" : ""}`}
            >
              <option value="">Select Category</option>
              {getAvailableCategories().map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label
            htmlFor="priority"
            className={`block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
              isDark
                ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Completion status - only for editing */}
        {initialData && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              className={`h-4 w-4 ${
                isDark
                  ? "bg-gray-700 text-indigo-600 border-gray-600 focus:ring-indigo-500"
                  : "bg-white text-indigo-600 border-gray-300 focus:ring-indigo-500"
              }`}
            />
            <label
              htmlFor="completed"
              className={`ml-2 block text-sm font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Mark as completed
            </label>
          </div>
        )}

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className={`block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            rows="3"
            className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
              isDark
                ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
            placeholder="Any additional notes about this item..."
          />
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
            className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {initialData ? "Update Item" : "Add Item"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ScheduleItemForm;
