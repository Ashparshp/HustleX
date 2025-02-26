import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  Plus,
  X,
  Edit2,
  Trash2,
  Clock,
  Tag,
  AlertTriangle,
  Info,
} from "lucide-react";

const TemplateForm = ({ initialData, onSubmit, onCancel, categories }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    dayType: "Any", // Default to Any
    description: "",
    items: [],
    isDefault: false,
  });
  const [errors, setErrors] = useState({});
  const [showItemForm, setShowItemForm] = useState(false);
  const [currentItem, setCurrentItem] = useState({
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
    notes: "",
  });
  const [editingItemIndex, setEditingItemIndex] = useState(-1);
  const [timeError, setTimeError] = useState("");

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Ensure items is always an array
        items: initialData.items || [],
      });
    }
  }, [initialData]);

  // Handle main form input changes
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
  };

  // Handle item form input changes
  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: value,
    });

    // Check for time validation
    if (name === "startTime" || name === "endTime") {
      validateTimes(
        name === "startTime" ? value : currentItem.startTime,
        name === "endTime" ? value : currentItem.endTime
      );
    }
  };

  // Validate start and end times
  const validateTimes = (startTime, endTime) => {
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);

      if (end <= start) {
        setTimeError("End time must be after start time");
      } else {
        setTimeError("");
      }
    }
  };

  // Add or update an item
  const handleAddItem = () => {
    // Validate the item
    if (!currentItem.title.trim()) {
      return;
    }

    if (timeError) {
      return;
    }

    const newItems = [...formData.items];

    if (editingItemIndex >= 0) {
      // Update existing item
      newItems[editingItemIndex] = currentItem;
    } else {
      // Add new item
      newItems.push(currentItem);
    }

    // Update form data
    setFormData({
      ...formData,
      items: newItems,
    });

    // Reset item form
    setCurrentItem({
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
      notes: "",
    });
    setEditingItemIndex(-1);
    setShowItemForm(false);
    setTimeError("");
  };

  // Edit an existing item
  const handleEditItem = (index) => {
    setCurrentItem(formData.items[index]);
    setEditingItemIndex(index);
    setShowItemForm(true);
  };

  // Delete an item
  const handleDeleteItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);

    setFormData({
      ...formData,
      items: newItems,
    });
  };

  // Format time from 24-hour format to 12-hour format
  const formatTime = (time24) => {
    if (!time24) return "";

    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;

    return `${hour12}:${minutes} ${period}`;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Template name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  // Get category color
  const getCategoryColor = (categoryName) => {
    const category = categories.find((cat) =>
      typeof cat === "object" ? cat.name === categoryName : cat === categoryName
    );

    if (category && typeof category === "object" && category.color) {
      return category.color;
    }

    // Fallback colors
    const colorMap = {
      Work: "#4a6da7",
      Study: "#8e44ad",
      "Personal Project": "#d35400",
      "Code Review": "#16a085",
      Exercise: "#27ae60",
      "Team Meeting": "#2980b9",
      Reading: "#8e44ad",
      Writing: "#2c3e50",
      Break: "#7f8c8d",
    };

    return colorMap[categoryName] || "#3498db";
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Template Name */}
        <div>
          <label
            htmlFor="name"
            className={`block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Template Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
              isDark
                ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            } ${errors.name ? "border-red-500" : ""}`}
            placeholder="e.g., Work Day, Study Session, etc."
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
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
            placeholder="Brief description of this template (optional)"
          />
        </div>

        {/* Day Type */}
        <div>
          <label
            htmlFor="dayType"
            className={`block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Day Type
          </label>
          <div className="mt-1">
            <select
              id="dayType"
              name="dayType"
              value={formData.dayType}
              onChange={handleChange}
              className={`block w-full rounded-md shadow-sm py-2 px-3 ${
                isDark
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                  : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
            >
              <option value="Any">Any Day</option>
              <option value="Weekday">Weekday Only</option>
              <option value="Weekend">Weekend Only</option>
            </select>
          </div>
          <p
            className={`mt-1 text-xs ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            This determines when this template can be used
          </p>
        </div>

        {/* Default Template */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className={`h-4 w-4 ${
              isDark
                ? "bg-gray-700 text-indigo-600 border-gray-600 focus:ring-indigo-500"
                : "bg-white text-indigo-600 border-gray-300 focus:ring-indigo-500"
            }`}
          />
          <label
            htmlFor="isDefault"
            className={`ml-2 block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Set as default template
          </label>
        </div>

        {/* Template Items Section */}
        <div
          className={`mt-6 p-4 rounded-lg ${
            isDark ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className={`font-medium ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Template Items ({formData.items.length})
            </h3>
            <button
              type="button"
              onClick={() => {
                setCurrentItem({
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
                  notes: "",
                });
                setEditingItemIndex(-1);
                setShowItemForm(true);
              }}
              className={`flex items-center text-sm px-2 py-1 rounded ${
                isDark
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              <Plus size={14} className="mr-1" />
              Add Item
            </button>
          </div>

          {/* Item Form */}
          {showItemForm && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                isDark ? "bg-gray-600" : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h4
                  className={`font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {editingItemIndex >= 0 ? "Edit Item" : "Add New Item"}
                </h4>
                <button
                  type="button"
                  onClick={() => setShowItemForm(false)}
                  className={`p-1 rounded-full ${
                    isDark
                      ? "text-gray-300 hover:bg-gray-500 hover:text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {/* Item Title */}
                <div>
                  <label
                    htmlFor="itemTitle"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Title*
                  </label>
                  <input
                    type="text"
                    id="itemTitle"
                    name="title"
                    value={currentItem.title}
                    onChange={handleItemChange}
                    required
                    className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
                      isDark
                        ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                        : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                    placeholder="e.g., Team Meeting, Study Session, etc."
                  />
                </div>

                {/* Item Description */}
                <div>
                  <label
                    htmlFor="itemDescription"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    id="itemDescription"
                    name="description"
                    value={currentItem.description || ""}
                    onChange={handleItemChange}
                    className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
                      isDark
                        ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                        : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                    placeholder="Brief description (optional)"
                  />
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="itemStartTime"
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
                        id="itemStartTime"
                        name="startTime"
                        value={currentItem.startTime}
                        onChange={handleItemChange}
                        required
                        className={`block w-full rounded-md shadow-sm py-2 pl-10 pr-3 ${
                          isDark
                            ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                            : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        } ${timeError ? "border-red-500" : ""}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="itemEndTime"
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
                        id="itemEndTime"
                        name="endTime"
                        value={currentItem.endTime}
                        onChange={handleItemChange}
                        required
                        className={`block w-full rounded-md shadow-sm py-2 pl-10 pr-3 ${
                          isDark
                            ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                            : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        } ${timeError ? "border-red-500" : ""}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Time validation error */}
                {timeError && (
                  <div
                    className={`p-2 rounded-lg flex items-start ${
                      isDark
                        ? "bg-red-900/30 text-red-300"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    <AlertTriangle
                      size={16}
                      className="mr-2 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-sm">{timeError}</p>
                  </div>
                )}

                {/* Category and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="itemCategory"
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
                        id="itemCategory"
                        name="category"
                        value={currentItem.category}
                        onChange={handleItemChange}
                        required
                        className={`block w-full rounded-md shadow-sm py-2 pl-10 pr-3 ${
                          isDark
                            ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                            : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        }`}
                      >
                        <option value="">Select Category</option>
                        {getAvailableCategories().map((category, index) => (
                          <option key={index} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="itemPriority"
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Priority
                    </label>
                    <select
                      id="itemPriority"
                      name="priority"
                      value={currentItem.priority}
                      onChange={handleItemChange}
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
                </div>

                {/* Notes */}
                <div>
                  <label
                    htmlFor="itemNotes"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Notes
                  </label>
                  <textarea
                    id="itemNotes"
                    name="notes"
                    value={currentItem.notes || ""}
                    onChange={handleItemChange}
                    rows="2"
                    className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
                      isDark
                        ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                        : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                    placeholder="Any additional notes about this item..."
                  />
                </div>

                {/* Item actions */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    disabled={!currentItem.title.trim() || timeError}
                    className={`px-3 py-1.5 rounded text-sm font-medium ${
                      !currentItem.title.trim() || timeError
                        ? "opacity-50 cursor-not-allowed bg-gray-500 text-white"
                        : isDark
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    {editingItemIndex >= 0 ? "Update Item" : "Add Item"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-2">
            {formData.items.length === 0 ? (
              <div
                className={`py-6 text-center rounded-lg ${
                  isDark ? "bg-gray-750" : "bg-white border border-gray-200"
                }`}
              >
                <Info
                  size={24}
                  className={`mx-auto mb-2 ${
                    isDark ? "text-gray-400" : "text-gray-400"
                  }`}
                />
                <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                  This template has no items. Add some to get started.
                </p>
              </div>
            ) : (
              formData.items.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex justify-between ${
                    isDark
                      ? "bg-gray-750 hover:bg-gray-700"
                      : "bg-white hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="flex items-start flex-grow">
                    <div
                      className="w-3 h-3 rounded-full mt-1.5 mr-2 flex-shrink-0"
                      style={{
                        backgroundColor: getCategoryColor(item.category),
                      }}
                    ></div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center">
                        <h5
                          className={`font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.title}
                        </h5>
                        <span
                          className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                            item.priority === "High"
                              ? isDark
                                ? "bg-red-900/40 text-red-300"
                                : "bg-red-100 text-red-800"
                              : item.priority === "Medium"
                              ? isDark
                                ? "bg-yellow-900/40 text-yellow-300"
                                : "bg-yellow-100 text-yellow-800"
                              : isDark
                              ? "bg-blue-900/40 text-blue-300"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <div
                        className={`mt-1 text-sm flex ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <span className="flex items-center mr-3">
                          <Clock size={14} className="mr-1" />
                          {formatTime(item.startTime)} -{" "}
                          {formatTime(item.endTime)}
                        </span>
                        <span className="flex items-center">
                          <Tag size={14} className="mr-1" />
                          {item.category}
                        </span>
                      </div>
                      {item.description && (
                        <p
                          className={`mt-1 text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start ml-2">
                    <button
                      type="button"
                      onClick={() => handleEditItem(index)}
                      className={`p-1 rounded ${
                        isDark
                          ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(index)}
                      className={`p-1 rounded ${
                        isDark
                          ? "text-gray-400 hover:text-red-400 hover:bg-gray-700"
                          : "text-gray-500 hover:text-red-600 hover:bg-gray-100"
                      }`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
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
            {initialData ? "Update Template" : "Create Template"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TemplateForm;
