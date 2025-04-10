import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  RefreshCw,
  AlertTriangle,
  Check,
  Tag,
  Palette,
  FileText,
  Type,
} from "lucide-react";
import LoadingSpinner from "../UI/LoadingSpinner";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { isDark } = useTheme();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          ></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`relative w-full max-w-md p-6 rounded-lg shadow-xl border ${
              isDark
                ? "bg-gray-900 border-red-500/30"
                : "bg-white border-red-300/50"
            }`}
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle
                className={`flex-shrink-0 ${
                  isDark ? "text-red-400" : "text-red-600"
                }`}
                size={24}
              />
              <div>
                <h2
                  className={`text-xl font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {title}
                </h2>
                <p
                  className={`mt-1 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {message}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${
                  isDark
                    ? "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 border border-gray-500/30"
                    : "bg-gray-100/50 text-gray-600 hover:bg-gray-200/70 border border-gray-300/50"
                }`}
              >
                <X size={16} />
                Cancel
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className={`px-4 py-2.5 rounded-lg flex items-center gap-2 ${
                  isDark
                    ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                    : "bg-red-100/50 text-red-600 hover:bg-red-200/70 border border-red-300/50"
                }`}
              >
                <Trash2 size={16} />
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
        return "Working Hours Categories";
      case "skills":
        return "Skills Categories";
      case "timetable":
        return "Timetable Categories";
      case "schedule":
        return "Schedule Categories";
      default:
        return `${type} Categories`;
    }
  };

  const inputClass = `w-full px-3 py-2.5 rounded-lg border text-sm transition-all duration-200 ${
    isDark
      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 placeholder-indigo-500/70"
      : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 placeholder-indigo-600/50"
  } focus:outline-none focus:ring-2 focus:ring-indigo-500/50`;

  const labelClass = `block mb-2 text-sm font-medium ${
    isDark ? "text-gray-300" : "text-gray-700"
  }`;

  const getIconForCategoryType = () => {
    switch (type) {
      case "working-hours":
        return (
          <Tag
            className={`mr-2 ${isDark ? "text-indigo-400" : "text-indigo-600"}`}
            size={18}
          />
        );
      case "skills":
        return (
          <Check
            className={`mr-2 ${isDark ? "text-indigo-400" : "text-indigo-600"}`}
            size={18}
          />
        );
      default:
        return (
          <Tag
            className={`mr-2 ${isDark ? "text-indigo-400" : "text-indigo-600"}`}
            size={18}
          />
        );
    }
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1 custom-scrollbar">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />

      <div className="flex justify-between items-center">
        <h2
          className={`text-xl font-semibold flex items-center ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {getIconForCategoryType()}
          {getCategoryTypeText()}
        </h2>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartAdd}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              isDark
                ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30"
                : "bg-indigo-100/50 text-indigo-600 hover:bg-indigo-200/70 border border-indigo-300/50"
            }`}
            disabled={isAdding || editingId !== null}
          >
            <Plus size={16} />
            Add Category
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            className={`flex items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
              isDark
                ? "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 border border-gray-500/30"
                : "bg-gray-100/50 text-gray-600 hover:bg-gray-200/70 border border-gray-300/50"
            }`}
            title="Refresh categories"
          >
            <RefreshCw size={16} />
          </motion.button>
        </div>
      </div>

      {/* Form for adding/editing categories */}
      <AnimatePresence>
        {(isAdding || editingId !== null) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <motion.form
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className={`p-5 rounded-lg border shadow-sm ${
                isDark
                  ? "bg-gray-900/70 border-indigo-500/30"
                  : "bg-white/90 border-indigo-300/50"
              }`}
            >
              <div className="space-y-4">
                <div className="group/input">
                  <label htmlFor="name" className={labelClass}>
                    <div className="flex items-center">
                      <Type
                        size={16}
                        className={`mr-2 ${
                          isDark ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      />
                      Category Name
                    </div>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group/input">
                    <label htmlFor="color" className={labelClass}>
                      <div className="flex items-center">
                        <Palette
                          size={16}
                          className={`mr-2 ${
                            isDark ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        />
                        Color
                      </div>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="color-picker"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="#3498db"
                      />
                    </div>
                  </div>

                  <div className="group/input">
                    <label htmlFor="icon" className={labelClass}>
                      <div className="flex items-center">
                        <Tag
                          size={16}
                          className={`mr-2 ${
                            isDark ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        />
                        Icon
                      </div>
                    </label>
                    <div className="relative">
                      <select
                        id="icon"
                        name="icon"
                        value={formData.icon}
                        onChange={handleChange}
                        className={inputClass}
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
                </div>

                <div className="group/input">
                  <label htmlFor="description" className={labelClass}>
                    <div className="flex items-center">
                      <FileText
                        size={16}
                        className={`mr-2 ${
                          isDark ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      />
                      Description (Optional)
                    </div>
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter description"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleCancel}
                    className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 ${
                      isDark
                        ? "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 border border-gray-500/30"
                        : "bg-gray-100/50 text-gray-600 hover:bg-gray-200/70 border border-gray-300/50"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isSubmitting}
                  >
                    <X size={16} />
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 group
                      ${
                        isDark
                          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                          : "bg-emerald-100/50 text-emerald-600 hover:bg-emerald-200/70 border border-emerald-300/50"
                      } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Save
                          size={16}
                          className="transition-transform duration-300 group-hover:scale-110"
                        />
                        {isAdding ? "Add" : "Update"} Category
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories list */}
      {loading ? (
        <div className="flex justify-center py-6">
          <LoadingSpinner size="md" text="Loading categories..." />
        </div>
      ) : categories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 text-center rounded-lg border ${
            isDark
              ? "bg-gray-900/70 border-indigo-500/30"
              : "bg-white/90 border-indigo-300/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className={`p-3 rounded-full ${
                isDark ? "bg-indigo-500/10" : "bg-indigo-100/50"
              }`}
            >
              <Tag
                className={isDark ? "text-indigo-400" : "text-indigo-600"}
                size={24}
              />
            </div>
            <p
              className={`text-base ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              No custom categories found.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartAdd}
              className={`mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm ${
                isDark
                  ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30"
                  : "bg-indigo-100/50 text-indigo-600 hover:bg-indigo-200/70 border border-indigo-300/50"
              }`}
            >
              <Plus size={16} />
              Add Your First Category
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((category) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-lg flex justify-between items-center border shadow-sm ${
                isDark
                  ? "bg-gray-900/70 border-indigo-500/30 hover:bg-indigo-500/5"
                  : "bg-white/90 border-indigo-300/50 hover:bg-indigo-50/50"
              } transition-all duration-200`}
            >
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full mr-3 shadow-sm flex-shrink-0"
                  style={{ backgroundColor: category.color || "#3498db" }}
                ></div>
                <div>
                  <p
                    className={`font-medium ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {category.name}
                  </p>
                  {category.description && (
                    <p
                      className={`text-xs mt-0.5 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleStartEdit(category)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-indigo-500/10 text-indigo-400"
                      : "hover:bg-indigo-100/50 text-indigo-600"
                  }`}
                  disabled={isAdding || editingId !== null}
                >
                  <Edit2 size={16} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCategoryToDelete(category._id)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-red-500/10 text-red-400"
                      : "hover:bg-red-100/50 text-red-600"
                  }`}
                  disabled={isAdding || editingId !== null}
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
