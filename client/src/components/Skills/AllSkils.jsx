// src/components/Skills/AddSkillModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Check } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import useSkills from "../../hooks/useSkills";
import useCategories from "../../hooks/useCategories";
import LoadingSpinner from "../UI/LoadingSpinner";

const AddSkillModal = ({ onClose, categories = [] }) => {
  const { isDark } = useTheme();
  const { addSkill } = useSkills();
  const { addCategory } = useCategories("skills");

  const [formData, setFormData] = useState({
    name: "",
    category:
      categories.length > 0
        ? typeof categories[0] === "string"
          ? categories[0]
          : categories[0].name
        : "",
    status: "upcoming",
    progress: 0,
    description: "",
    priority: "medium",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

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
      setFormData((prev) => ({ ...prev, progress: 100 }));
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
      await addSkill(formData);
      onClose();
    } catch (error) {
      setError(error.message || "Failed to add skill");
    } finally {
      setIsSubmitting(false);
    }
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
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div
          className={`w-full max-w-md p-6 rounded-xl shadow-xl ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Add New Skill
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
              <div className="flex justify-end space-x-3 mt-6">
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
                  {isSubmitting ? <LoadingSpinner size="sm" /> : "Add Skill"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default AddSkillModal;

// src/components/Skills/ConfirmDeleteModal.jsx
import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../UI/LoadingSpinner";

const ConfirmDeleteModal = ({
  title,
  message,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  const { isDark } = useTheme();

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  // Button classes
  const cancelButtonClass = `px-4 py-2 rounded-lg font-medium ${
    isDark
      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
  } transition-colors duration-200`;

  const deleteButtonClass = `px-4 py-2 rounded-lg font-medium ${
    isDark
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-red-600 hover:bg-red-700 text-white"
  } transition-colors duration-200 ${
    isDeleting ? "opacity-70 cursor-not-allowed" : ""
  }`;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onCancel}
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
          className={`w-full max-w-sm p-6 rounded-xl shadow-xl ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon and Title */}
          <div className="flex items-start mb-4">
            <div
              className={`p-2 rounded-full ${
                isDark ? "bg-red-900/30" : "bg-red-100"
              } mr-3`}
            >
              <AlertTriangle
                size={24}
                className={isDark ? "text-red-400" : "text-red-600"}
              />
            </div>
            <div className="flex-1">
              <h3
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {title || "Confirm Delete"}
              </h3>
              <p
                className={`mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                {message ||
                  "Are you sure you want to delete this item? This action cannot be undone."}
              </p>
            </div>
            <button
              onClick={onCancel}
              className={`p-1 rounded-full ${
                isDark
                  ? "hover:bg-gray-700 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className={cancelButtonClass}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={deleteButtonClass}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Deleting...</span>
                </div>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ConfirmDeleteModal;

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

// src/components/Skills/SkillCard.jsx
import { motion } from 'framer-motion';
import { Edit2, Trash2, Calendar, Award, Book } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import useSkills from '../../hooks/useSkills';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const SkillCard = ({ skill, onEdit }) => {
  const { isDark } = useTheme();
  const { deleteSkill } = useSkills();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get date formats
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Status color mapping
  const statusColors = {
    upcoming: isDark 
      ? 'bg-blue-900/30 text-blue-300 border-blue-800/50' 
      : 'bg-blue-100 text-blue-700 border-blue-200',
    'in-progress': isDark 
      ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800/50' 
      : 'bg-yellow-100 text-yellow-700 border-yellow-200',
    completed: isDark 
      ? 'bg-green-900/30 text-green-300 border-green-800/50' 
      : 'bg-green-100 text-green-700 border-green-200'
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
    } catch (error) {
      console.error('Error deleting skill:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <>
      <motion.div 
        variants={cardVariants}
        className={`rounded-lg border p-4 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } hover:shadow-md transition-shadow duration-200`}
      >
        {/* Header with status and actions */}
        <div className="flex justify-between items-start mb-3">
          <div className={`px-2 py-1 text-xs rounded-full border ${statusColors[skill.status]}`}>
            {skill.status.replace('-', ' ')}
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={onEdit}
              className={`p-1.5 rounded-full ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
              title="Edit skill"
            >
              <Edit2 size={14} />
            </button>
            
            <button
              onClick={handleDeleteClick}
              className={`p-1.5 rounded-full ${
                isDark 
                  ? 'hover:bg-red-900/30 text-gray-400 hover:text-red-300' 
                  : 'hover:bg-red-100 text-gray-500 hover:text-red-600'
              }`}
              title="Delete skill"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        
        {/* Skill name and category */}
        <h3 className={`font-medium text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {skill.name}
        </h3>
        
        {/* Progress bar */}
        <div className="mt-2 mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              Progress
            </span>
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              {skill.progress}%
            </span>
          </div>
          <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className={`h-2 rounded-full ${
                isDark ? 'bg-indigo-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${skill.progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Dates */}
        <div className="mt-4 text-sm space-y-1.5">
          {skill.startDate && (
            <div className="flex items-center">
              <Calendar size={14} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
              <span className={`ml-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Started: {formatDate(skill.startDate)}
              </span>
            </div>
          )}
          
          {skill.completionDate && (
            <div className="flex items-center">
              <Award size={14} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
              <span className={`ml-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Completed: {formatDate(skill.completionDate)}
              </span>
            </div>
          )}
          
          {skill.description && (
            <div className="flex items-start mt-2">
              <Book size={14} className={`mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <p className={`ml-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {skill.description}
              </p>
            </div>
          )}
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

export default SkillCard;

// src/components/Skills/SkillFilters.jsx
import { useState } from "react";
import { Tag, Activity, Search, Clock, Award, BookOpen } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const SkillFilters = ({
  categories,
  selectedCategory,
  selectedStatus,
  onSelectCategory,
  onSelectStatus,
}) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter statuses
  const statuses = [
    { value: "completed", label: "Completed", icon: Award },
    { value: "in-progress", label: "In Progress", icon: Clock },
    { value: "upcoming", label: "Upcoming", icon: BookOpen },
  ];

  // Base styling classes
  const cardClass = `p-4 rounded-lg ${
    isDark ? "bg-gray-800" : "bg-white"
  } border ${isDark ? "border-gray-700" : "border-gray-200"}`;

  const sectionHeadingClass = `text-lg font-medium mb-4 ${
    isDark ? "text-gray-200" : "text-gray-800"
  } flex items-center gap-2`;

  const badgeClass = `px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer`;

  // Styling for selected badges
  const selectedCategoryClass = `${badgeClass} ${
    isDark ? "bg-indigo-600 text-white" : "bg-indigo-600 text-white"
  }`;

  const unselectedCategoryClass = `${badgeClass} ${
    isDark
      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`;

  const selectedStatusClass = `${badgeClass} ${
    isDark ? "bg-green-600 text-white" : "bg-green-600 text-white"
  }`;

  const unselectedStatusClass = `${badgeClass} ${
    isDark
      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`;

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // TODO: Implement search functionality - this would need to be passed up to the parent
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className={cardClass}>
        <div className={sectionHeadingClass}>
          <Search size={20} />
          Search Skills
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by skill name or description..."
            className={`w-full py-2 pl-10 pr-4 rounded-lg border ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            } focus:outline-none focus:ring-2 ${
              isDark ? "focus:ring-indigo-500/30" : "focus:ring-indigo-500/30"
            }`}
          />
          <Search
            size={18}
            className={`absolute left-3 top-2.5 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
        </div>
      </div>

      {/* Filter by Category */}
      <div className={cardClass}>
        <div className={sectionHeadingClass}>
          <Tag size={20} />
          Filter by Category
        </div>
        <div className="flex flex-wrap gap-2">
          {categories && categories.length > 0 ? (
            categories.map((category, index) => {
              const categoryName =
                typeof category === "string" ? category : category.name;
              return (
                <button
                  key={index}
                  onClick={() => onSelectCategory(categoryName)}
                  className={
                    categoryName === selectedCategory
                      ? selectedCategoryClass
                      : unselectedCategoryClass
                  }
                >
                  {categoryName}
                </button>
              );
            })
          ) : (
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No categories available
            </p>
          )}
        </div>
      </div>

      {/* Filter by Status */}
      <div className={cardClass}>
        <div className={sectionHeadingClass}>
          <Activity size={20} />
          Filter by Status
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => {
            const StatusIcon = status.icon;
            return (
              <button
                key={status.value}
                onClick={() => onSelectStatus(status.value)}
                className={
                  status.value === selectedStatus
                    ? selectedStatusClass
                    : unselectedStatusClass
                }
              >
                <div className="flex items-center gap-1.5">
                  <StatusIcon size={16} />
                  {status.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillFilters;

// src/components/Skills/SkillsGrid.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import SkillCard from './SkillCard';
import EditSkillModal from './EditSkillModal';

const SkillsGrid = ({ skills, onAddSkill, categories }) => {
  const { isDark } = useTheme();
  const [editingSkill, setEditingSkill] = useState(null);
  
  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
  };
  
  const handleCloseEditModal = () => {
    setEditingSkill(null);
  };
  
  // If no skills, show empty state
  if (!skills || Object.keys(skills).length === 0) {
    return (
      <div className={`p-8 text-center rounded-lg border ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          No skills added yet
        </h3>
        <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Start tracking your skills and progress by adding your first skill.
        </p>
        <button
          onClick={onAddSkill}
          className={`px-4 py-2 rounded-lg inline-flex items-center ${
            isDark 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <Plus size={18} className="mr-1" />
          Add Your First Skill
        </button>
      </div>
    );
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  // Render skill cards by category
  return (
    <div>
      {Object.entries(skills).map(([category, categorySkills]) => (
        <div key={category} className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {category}
            </h2>
            <div className={`ml-3 px-2 py-1 text-xs rounded-full ${
              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}>
              {categorySkills.length}
            </div>
            <button
              onClick={onAddSkill}
              className={`ml-auto p-1 rounded-full ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title={`Add skill to ${category}`}
            >
              <Plus size={16} />
            </button>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {categorySkills.map(skill => (
              <SkillCard
                key={skill._id}
                skill={skill}
                onEdit={() => handleEditSkill(skill)}
              />
            ))}
          </motion.div>
        </div>
      ))}
      
      {/* Edit Modal */}
      {editingSkill && (
        <EditSkillModal 
          skill={editingSkill} 
          onClose={handleCloseEditModal} 
          categories={categories}
        />
      )}
    </div>
  );
};

export default SkillsGrid;

// src/components/Skills/SkillStats.jsx
import React from "react";
import {
  BarChart,
  CheckCircle,
  Clock,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";

const SkillStats = ({ stats, isDark }) => {
  if (!stats) return null;

  // Helper to get color classes based on completion percentage
  const getCompletionColorClass = (percentage) => {
    if (percentage >= 75) {
      return isDark ? "text-green-400" : "text-green-600";
    } else if (percentage >= 50) {
      return isDark ? "text-yellow-400" : "text-yellow-600";
    } else if (percentage >= 25) {
      return isDark ? "text-orange-400" : "text-orange-600";
    } else {
      return isDark ? "text-red-400" : "text-red-600";
    }
  };

  const statCardClass = `rounded-lg p-4 ${
    isDark ? "bg-gray-700" : "bg-gray-100"
  }`;

  const headingClass = `text-lg font-medium mb-3 flex items-center gap-2 ${
    isDark ? "text-white" : "text-gray-900"
  }`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Skills */}
        <div className={statCardClass}>
          <h3 className={headingClass}>
            <BarChart size={20} />
            Total Skills
          </h3>
          <p className="text-3xl font-bold">{stats.total || 0}</p>
        </div>

        {/* Completion Status */}
        <div className={statCardClass}>
          <h3 className={headingClass}>
            <CheckCircle size={20} />
            Completed
          </h3>
          <p
            className={`text-3xl font-bold ${getCompletionColorClass(
              stats.completionRate
            )}`}
          >
            {stats.completed || 0}
          </p>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {stats.completionRate?.toFixed(1) || 0}% completion rate
          </p>
        </div>

        {/* In Progress */}
        <div className={statCardClass}>
          <h3 className={headingClass}>
            <Clock size={20} />
            In Progress
          </h3>
          <p className="text-3xl font-bold">{stats.inProgress || 0}</p>
        </div>

        {/* Upcoming */}
        <div className={statCardClass}>
          <h3 className={headingClass}>
            <ArrowUpRight size={20} />
            Upcoming
          </h3>
          <p className="text-3xl font-bold">{stats.upcoming || 0}</p>
        </div>
      </div>

      {/* Average Progress */}
      <div className={statCardClass}>
        <h3 className={headingClass}>
          <AlertTriangle size={20} />
          Average Progress
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mb-2">
          <div
            className={`h-4 rounded-full ${
              isDark ? "bg-indigo-500" : "bg-indigo-600"
            }`}
            style={{
              width: `${stats.averageProgress?.toFixed(1) || 0}%`,
            }}
          ></div>
        </div>
        <p
          className={`text-right ${isDark ? "text-gray-300" : "text-gray-700"}`}
        >
          {stats.averageProgress?.toFixed(1) || 0}%
        </p>
      </div>

      {/* Category Distribution */}
      {stats.categoryCounts && Object.keys(stats.categoryCounts).length > 0 && (
        <div className={statCardClass}>
          <h3 className={headingClass}>Category Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryCounts).map(([category, count]) => (
              <div key={category}>
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {category}
                  </span>
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {count} skill{count !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className={getCategoryProgressColor(category, isDark)}
                    style={{
                      width: `${((count / stats.total) * 100).toFixed(1)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Distribution */}
      <div className={`${statCardClass} text-center`}>
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {stats.total || 0} total skills with {stats.completed || 0} completed,{" "}
          {stats.inProgress || 0} in progress, and {stats.upcoming || 0}{" "}
          upcoming
        </p>
      </div>
    </div>
  );
};

// Helper function for category progress color
const getCategoryProgressColor = (category, isDark) => {
  // Generate a somewhat consistent color based on the category name
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const colorOptions = [
    isDark ? "bg-blue-500" : "bg-blue-600",
    isDark ? "bg-green-500" : "bg-green-600",
    isDark ? "bg-purple-500" : "bg-purple-600",
    isDark ? "bg-red-500" : "bg-red-600",
    isDark ? "bg-yellow-500" : "bg-yellow-600",
    isDark ? "bg-pink-500" : "bg-pink-600",
    isDark ? "bg-indigo-500" : "bg-indigo-600",
    isDark ? "bg-teal-500" : "bg-teal-600",
  ];

  const index = Math.abs(hashCode(category)) % colorOptions.length;
  return colorOptions[index];
};

export default SkillStats;
