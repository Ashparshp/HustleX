// src/components/Skills/EditSkillModal.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save, Calendar, Trash2, Plus, Check } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import useSkills from "../../hooks/useSkills";
import useCategories from "../../hooks/useCategories";
import LoadingSpinner from "../UI/LoadingSpinner";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const EditSkillModal = ({ skill, onClose, categories = [] }) => {
  const { isDark } = useTheme();
  const { updateSkill, deleteSkill } = useSkills();
  const { addCategory } = useCategories("skills");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    status: "upcoming",
    progress: 0,
    description: "",
    priority: "medium",
    startDate: "",
    completionDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Initialize form with skill data
  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || "",
        category: skill.category || "",
        status: skill.status || "upcoming",
        progress: skill.progress || 0,
        description: skill.description || "",
        priority: skill.priority || "medium",
        startDate: skill.startDate
          ? new Date(skill.startDate).toISOString().split("T")[0]
          : "",
        completionDate: skill.completionDate
          ? new Date(skill.completionDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [skill]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "progress") {
      // Ensure progress is between 0 and 100
      const progress = Math.min(100, Math.max(0, parseInt(value) || 0));
      setFormData({ ...formData, progress });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // If status changes to completed, set progress to 100
    if (name === "status" && value === "completed") {
      setFormData((prev) => ({
        ...prev,
        progress: 100,
        completionDate:
          prev.completionDate || new Date().toISOString().split("T")[0],
      }));
    }

    // If status changes to in-progress, set start date if not set
    if (name === "status" && value === "in-progress" && !formData.startDate) {
      setFormData((prev) => ({
        ...prev,
        startDate: new Date().toISOString().split("T")[0],
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validation
    if (!formData.name.trim()) {
      setError("Skill name is required");
      return;
    }

    if (!formData.category) {
      setError("Category is required");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await updateSkill(skill._id, formData);
      onClose();
    } catch (error) {
      setError(error.message || "Failed to update skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete button click
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSkill(skill._id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      setError(error.message || "Failed to delete skill");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Handle adding a new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      await addCategory({ name: newCategory.trim() });
      setFormData((prev) => ({ ...prev, category: newCategory.trim() }));
      setNewCategory("");
      setShowNewCategory(false);
    } catch (error) {
      setError(error.message || "Failed to add category");
    }
  };

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  // Input styling
  const inputClass = `w-full px-3 py-2 rounded-lg border ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-600"
  } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
    isDark ? "focus:ring-indigo-500/30" : "focus:ring-indigo-600/30"
  }`;

  const selectClass = `w-full px-3 py-2 rounded-lg border ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white focus:border-indigo-500"
      : "bg-white border-gray-300 text-gray-900 focus:border-indigo-600"
  } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
    isDark ? "focus:ring-indigo-500/30" : "focus:ring-indigo-600/30"
  }`;

  // Button styling
  const primaryButtonClass = `px-4 py-2 rounded-lg font-medium ${
    isDark
      ? "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500/50"
      : "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-600/50"
  } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200 ${
    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
  }`;

  const secondaryButtonClass = `px-4 py-2 rounded-lg font-medium ${
    isDark
      ? "bg-gray-700 hover:bg-gray-600 text-gray-300 focus:ring-gray-500/50"
      : "bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-400/50"
  } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200`;

  const dangerButtonClass = `px-4 py-2 rounded-lg font-medium ${
    isDark
      ? "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/50"
      : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-600/50"
  } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200`;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        className={`fixed inset-0 flex items-center justify-center z-50`}
      >
        <div
          className={`w-full max-w-md p-6 rounded-xl shadow-xl ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Edit Skill
            </h2>
            <button
              onClick={onClose}
              className={`p-1 rounded-full ${
                isDark
                  ? "hover:bg-gray-700 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                isDark
                  ? "bg-red-900/30 text-red-300"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Skill Name */}
              <div>
                <label
                  htmlFor="name"
                  className={`block mb-1 text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Skill Name*
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. React.js, Machine Learning, Spring Boot"
                  className={inputClass}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className={`block mb-1 text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Category*
                </label>
                {showNewCategory ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter new category name"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className={`p-2 rounded-lg ${
                        isDark
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      <Check size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`${selectClass} flex-1`}
                      required
                    >
                      {categories.length > 0 ? (
                        categories.map((category, index) => (
                          <option
                            key={index}
                            value={
                              typeof category === "string"
                                ? category
                                : category.name
                            }
                          >
                            {typeof category === "string"
                              ? category
                              : category.name}
                          </option>
                        ))
                      ) : (
                        <option value="">Select Category</option>
                      )}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewCategory(true)}
                      className={`p-2 rounded-lg ${
                        isDark
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                      title="Add New Category"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className={`block mb-1 text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Progress */}
              <div>
                <label
                  htmlFor="progress"
                  className={`block mb-1 text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Progress ({formData.progress}%)
                </label>
                <input
                  id="progress"
                  name="progress"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={handleChange}
                  className={`w-full ${
                    isDark ? "accent-indigo-500" : "accent-indigo-600"
                  }`}
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="startDate"
                    className={`block mb-1 text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      Start Date
                    </div>
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="completionDate"
                    className={`block mb-1 text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      Completion Date
                    </div>
                  </label>
                  <input
                    id="completionDate"
                    name="completionDate"
                    type="date"
                    value={formData.completionDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor="priority"
                  className={`block mb-1 text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className={`block mb-1 text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the skill"
                  className={`${inputClass} h-24 resize-none`}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-between space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className={dangerButtonClass}
                >
                  <Trash2 size={18} className="inline mr-1" />
                  Delete
                </button>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className={secondaryButtonClass}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={primaryButtonClass}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Save size={18} className="inline mr-1" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <ConfirmDeleteModal
          title="Delete Skill"
          message={`Are you sure you want to delete "${skill.name}"? This action cannot be undone.`}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default EditSkillModal;
