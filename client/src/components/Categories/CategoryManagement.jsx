import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Plus, Edit2, Trash2, Save, X, RefreshCw } from "lucide-react";
import LoadingSpinner from "../UI/LoadingSpinner";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDark,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-xl ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {message}
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryManagement = ({
  categories,
  defaultCategories,
  loading,
  onAdd,
  onUpdate,
  onDelete,
  onRefresh,
  type,
}) => {
  const { isDark } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#3498db",
    icon: "circle",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      name: "",
      color: "#3498db",
      icon: "circle",
      description: "",
    });
  };

  const handleStartEdit = (category) => {
    setIsAdding(false);
    setEditingId(category._id);
    setFormData({
      name: category.name,
      color: category.color || "#3498db",
      icon: category.icon || "circle",
      description: category.description || "",
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: "",
      color: "#3498db",
      icon: "circle",
      description: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.name.trim()) {
      return; // Don't submit if name is empty
    }

    setIsSubmitting(true);

    try {
      if (isAdding) {
        await onAdd(formData);
      } else if (editingId) {
        await onUpdate(editingId, formData);
      }

      setIsAdding(false);
      setEditingId(null);
      setFormData({
        name: "",
        color: "#3498db",
        icon: "circle",
        description: "",
      });
    } catch (error) {
      console.error("Error submitting category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await onDelete(categoryToDelete);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Get text for category type
  const getCategoryTypeText = () => {
    switch (type) {
      case "working-hours":
        return "Working Hours";
      case "skills":
        return "Skills";
      case "timetable":
        return "Timetable";
      case "schedule":
        return "Schedule";
      case "goals":
        return "Platforms";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-4">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Platform"
        message="Are you sure you want to delete this platform? This action cannot be undone."
        isDark={isDark}
      />

      <div className="flex justify-between items-center">
        <h2
          className={`text-xl font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {getCategoryTypeText()}
        </h2>

        <div className="flex space-x-2">
          <button
            onClick={handleStartAdd}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
              isDark
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
            disabled={isAdding || editingId !== null}
          >
            <Plus size={16} />
            Add Category
          </button>

          <button
            onClick={onRefresh}
            className={`flex items-center gap-1 p-1.5 rounded-lg ${
              isDark
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Refresh platforms"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Form for adding/editing categories */}
      {(isAdding || editingId !== null) && (
        <form
          onSubmit={handleSubmit}
          className={`p-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
        >
          <div className="space-y-3">
            <div>
              <label
                className={`block mb-1 text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Platform Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Enter platform name (e.g., LeetCode, CodeForces)"
                required
              />
            </div>

            <div className="flex space-x-3">
              <div className="flex-1">
                <label
                  className={`block mb-1 text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-10 h-10 rounded border-0 p-0"
                  />
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className={`ml-2 w-full px-3 py-2 rounded-lg border ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="#3498db"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label
                  className={`block mb-1 text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Icon
                </label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="circle">Circle</option>
                  <option value="square">Square</option>
                  <option value="triangle">Triangle</option>
                  <option value="star">Star</option>
                  <option value="heart">Heart</option>
                  <option value="code">Code</option>
                  <option value="book">Book</option>
                  <option value="briefcase">Briefcase</option>
                  <option value="calendar">Calendar</option>
                  <option value="clock">Clock</option>
                </select>
              </div>
            </div>

            <div>
              <label
                className={`block mb-1 text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Description (Optional)
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Enter description (e.g., Competitive coding platform)"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className={`px-3 py-2 rounded-lg ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
                disabled={isSubmitting}
              >
                <X size={16} className="inline mr-1" />
                Cancel
              </button>

              <button
                type="submit"
                className={`px-3 py-2 rounded-lg ${
                  isDark
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Save size={16} className="inline mr-1" />
                    {isAdding ? "Add" : "Update"} Platform
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Categories list */}
      {loading ? (
        <div className="flex justify-center py-6">
          <LoadingSpinner size="md" text="Loading platforms..." />
        </div>
      ) : categories.length === 0 ? (
        <div
          className={`p-6 text-center rounded-lg ${
            isDark ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <p className="mb-2">No custom platforms found.</p>
          <button
            onClick={handleStartAdd}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
              isDark
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            <Plus size={16} />
            Add Your First Platform
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((category) => (
            <div
              key={category._id}
              className={`p-3 rounded-lg flex justify-between items-center ${
                isDark ? "bg-gray-800" : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className="w-6 h-6 rounded-full mr-2"
                  style={{ backgroundColor: category.color || "#3498db" }}
                ></div>
                <div>
                  <p className="font-medium">{category.name}</p>
                  {category.description && (
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-1">
                <button
                  onClick={() => handleStartEdit(category)}
                  className={`p-1.5 rounded-lg ${
                    isDark
                      ? "hover:bg-gray-700 text-indigo-400"
                      : "hover:bg-gray-100 text-indigo-600"
                  }`}
                  disabled={isAdding || editingId !== null}
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={() => setCategoryToDelete(category._id)}
                  className={`p-1.5 rounded-lg ${
                    isDark
                      ? "hover:bg-gray-700 text-red-400"
                      : "hover:bg-gray-100 text-red-600"
                  }`}
                  disabled={isAdding || editingId !== null}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Default categories */}
      {defaultCategories && defaultCategories.length > 0 && (
        <div className="mt-6">
          <h3
            className={`text-lg font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Default Platforms
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {defaultCategories.map((category, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg flex items-center ${
                  isDark ? "bg-gray-800" : "bg-white border border-gray-200"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full mr-2"
                  style={{ backgroundColor: category.color || "#3498db" }}
                ></div>
                <div>
                  <p className="font-medium">{category.name}</p>
                  {category.description && (
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips section */}
      <div
        className={`mt-6 p-4 rounded-lg text-sm ${
          isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
        }`}
      >
        <h4 className="font-medium mb-2">Tips:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Add platforms for different coding competition sites like LeetCode,
            CodeForces, etc.
          </li>
          <li>
            You can also add other goal sources like "Personal Projects" or
            "Learning".
          </li>
          <li>
            Customize colors to help visually distinguish between different
            platforms.
          </li>
          <li>
            Add descriptions to provide context about what each platform is for.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CategoryManagement;
