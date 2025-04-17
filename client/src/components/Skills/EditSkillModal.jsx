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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "progress") {
      const progress = Math.min(100, Math.max(0, parseInt(value) || 0));
      setFormData({ ...formData, progress });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "status" && value === "completed") {
      setFormData((prev) => ({
        ...prev,
        progress: 100,
        completionDate:
          prev.completionDate || new Date().toISOString().split("T")[0],
      }));
    }

    if (name === "status" && value === "in-progress" && !formData.startDate) {
      setFormData((prev) => ({
        ...prev,
        startDate: new Date().toISOString().split("T")[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

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
      await updateSkill(skill.id || skill._id, formData);
      onClose();
    } catch (error) {
      setError(error.message || "Failed to update skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSkill(skill.id || skill._id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      setError(error.message || "Failed to delete skill");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

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

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return isDark ? "text-red-400" : "text-red-600";
      case "medium":
        return isDark ? "text-yellow-400" : "text-yellow-600";
      case "low":
        return isDark ? "text-green-400" : "text-green-600";
      default:
        return isDark ? "text-gray-400" : "text-gray-600";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return isDark ? "text-green-400" : "text-green-600";
      case "in-progress":
        return isDark ? "text-blue-400" : "text-blue-600";
      case "upcoming":
        return isDark ? "text-purple-400" : "text-purple-600";
      default:
        return isDark ? "text-gray-400" : "text-gray-600";
    }
  };

  const modalBgClass = isDark
    ? "bg-black bg-gradient-to-br from-indigo-900/20 to-blue-900/10"
    : "bg-white bg-gradient-to-br from-indigo-100/50 to-blue-100/30";

  const headingClass = isDark ? "text-white" : "text-gray-900";
  const primaryTextClass = isDark ? "text-indigo-400" : "text-indigo-600";
  const secondaryTextClass = isDark ? "text-gray-400" : "text-gray-600";

  const inputClass = `w-full px-2 py-1.5 text-sm rounded-md ${
    isDark
      ? "bg-indigo-500/10 border-indigo-500/30 text-white placeholder-indigo-300/50 focus:border-indigo-400"
      : "bg-indigo-100/50 border-indigo-300/50 text-gray-900 placeholder-indigo-400/50 focus:border-indigo-500"
  } border focus:outline-none focus:ring-1 focus:ring-opacity-30 ${
    isDark ? "focus:ring-indigo-500/30" : "focus:ring-indigo-500/40"
  } transition-all duration-200`;

  const selectClass = `w-full px-2 py-1.5 text-sm rounded-md appearance-none ${
    isDark
      ? "bg-indigo-500/10 border-indigo-500/30 text-white focus:border-indigo-400"
      : "bg-indigo-100/50 border-indigo-300/50 text-gray-900 focus:border-indigo-500"
  } border focus:outline-none focus:ring-1 focus:ring-opacity-30 ${
    isDark ? "focus:ring-indigo-500/30" : "focus:ring-indigo-500/40"
  } transition-all duration-200`;

  const primaryButtonClass = `px-3 py-1.5 text-xs rounded-md font-medium ${
    isDark
      ? "bg-indigo-500/30 hover:bg-indigo-500/40 text-indigo-300 focus:ring-indigo-500/30"
      : "bg-indigo-100/70 hover:bg-indigo-200/70 text-indigo-600 focus:ring-indigo-400/30"
  } focus:outline-none focus:ring-1 focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105 ${
    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
  } backdrop-blur-sm border ${
    isDark ? "border-indigo-500/20" : "border-indigo-300/30"
  }`;

  const secondaryButtonClass = `px-3 py-1.5 text-xs rounded-md font-medium ${
    isDark
      ? "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 focus:ring-gray-500/30"
      : "bg-gray-100/70 hover:bg-gray-200/70 text-gray-700 focus:ring-gray-400/30"
  } focus:outline-none focus:ring-1 focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105 backdrop-blur-sm border ${
    isDark ? "border-gray-700/30" : "border-gray-200/50"
  }`;

  const dangerButtonClass = `px-3 py-1.5 text-xs rounded-md font-medium ${
    isDark
      ? "bg-red-500/30 hover:bg-red-500/40 text-red-300 focus:ring-red-500/30"
      : "bg-red-100/70 hover:bg-red-200/70 text-red-600 focus:ring-red-400/30"
  } focus:outline-none focus:ring-1 focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105 backdrop-blur-sm border ${
    isDark ? "border-red-500/20" : "border-red-300/30"
  }`;

  const iconButtonClass = `p-1 rounded-md transition-all duration-200 transform hover:scale-105 ${
    isDark
      ? "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 focus:ring-indigo-500/30"
      : "bg-indigo-100/50 hover:bg-indigo-200/70 text-indigo-600 focus:ring-indigo-400/30"
  } focus:outline-none focus:ring-1 focus:ring-opacity-50 backdrop-blur-sm border ${
    isDark ? "border-indigo-500/20" : "border-indigo-300/30"
  }`;

  const labelClass = `block mb-1 text-xs font-medium ${
    isDark ? "text-indigo-400" : "text-indigo-600"
  }`;

  const sliderClass = `w-full h-1.5 rounded-full appearance-none cursor-pointer ${
    isDark
      ? "bg-indigo-500/20 accent-indigo-500"
      : "bg-indigo-200/50 accent-indigo-600"
  }`;

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-auto"
      >
        <div
          className={`w-full max-w-3xl p-3 rounded-lg shadow-2xl ${modalBgClass} backdrop-blur-sm border ${
            isDark ? "border-indigo-500/20" : "border-indigo-300/20"
          } max-h-[90vh] overflow-y-auto my-2`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-3 sticky top-0 z-10 backdrop-blur-md bg-opacity-90 pb-1 -mx-3 px-3 pt-1">
            <h2 className={`text-lg font-bold ${headingClass} truncate`}>
              Edit Skill: {skill?.name}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className={`p-1 rounded-full ${
                isDark
                  ? "hover:bg-gray-800/50 text-gray-400"
                  : "hover:bg-gray-100/70 text-gray-500"
              } transition-all duration-200`}
              aria-label="Close"
            >
              <X size={16} />
            </motion.button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-3 p-2 rounded-md text-xs font-medium ${
                isDark
                  ? "bg-red-900/20 text-red-400 border border-red-800/30"
                  : "bg-red-100/80 text-red-700 border border-red-200"
              }`}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div>
                <label htmlFor="name" className={labelClass}>
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

              <div>
                <label htmlFor="category" className={labelClass}>
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
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleAddCategory}
                      className={`p-1 rounded-md ${
                        isDark
                          ? "bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                          : "bg-green-100/70 hover:bg-green-200/70 text-green-600 border border-green-300/50"
                      } transition-all duration-200`}
                    >
                      <Check size={16} />
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`${selectClass} flex-1`}
                        required
                      >
                        <option value="" disabled>
                          Select Category
                        </option>
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
                          <option value="">No categories available</option>
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className={`w-3 h-3 ${secondaryTextClass}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowNewCategory(true)}
                      className={iconButtonClass}
                      title="Add New Category"
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="status" className={labelClass}>
                    Status
                  </label>
                  <div className="relative">
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={`${selectClass} ${getStatusColor(
                        formData.status
                      )}`}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className={`w-3 h-3 ${secondaryTextClass}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="priority" className={labelClass}>
                    Priority
                  </label>
                  <div className="relative">
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className={`${selectClass} ${getPriorityColor(
                        formData.priority
                      )}`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className={`w-3 h-3 ${secondaryTextClass}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="progress" className={labelClass}>
                      Progress
                    </label>
                    <span
                      className={`text-xs font-medium ${
                        isDark ? "text-indigo-300" : "text-indigo-600"
                      }`}
                    >
                      {formData.progress}%
                    </span>
                  </div>
                  <input
                    id="progress"
                    name="progress"
                    type="range"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={handleChange}
                    className={sliderClass}
                  />
                  <div className="w-full flex justify-between mt-1">
                    <span className={`text-xs ${secondaryTextClass}`}>0%</span>
                    <span className={`text-xs ${secondaryTextClass}`}>
                      100%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="startDate" className={labelClass}>
                    <div className="flex items-center gap-1">
                      <Calendar
                        size={12}
                        className={`${
                          isDark ? "text-indigo-300" : "text-indigo-500"
                        }`}
                      />
                      <span>Start Date</span>
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
                  <label htmlFor="completionDate" className={labelClass}>
                    <div className="flex items-center gap-1">
                      <Calendar
                        size={12}
                        className={`${
                          isDark ? "text-indigo-300" : "text-indigo-500"
                        }`}
                      />
                      <span>Completion Date</span>
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

              <div>
                <label htmlFor="description" className={labelClass}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the skill"
                  className={`${inputClass} h-16 resize-none`}
                />
              </div>

              <div className="flex justify-between gap-2 mt-3 sticky bottom-0 pb-2 pt-2 -mx-3 px-3 backdrop-blur-md bg-opacity-90">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleDeleteClick}
                  className={dangerButtonClass}
                >
                  <div className="flex items-center justify-center">
                    <Trash2 size={14} className="mr-1" />
                    <span className="text-xs">Delete</span>
                  </div>
                </motion.button>

                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className={secondaryButtonClass}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={isSubmitting ? {} : { scale: 1.03 }}
                    whileTap={isSubmitting ? {} : { scale: 0.98 }}
                    type="submit"
                    className={primaryButtonClass}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="xs" />
                        <span className="ml-1 text-xs">Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Save size={14} className="mr-1" />
                        <span className="text-xs">Save</span>
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </motion.div>

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          title="Delete Skill"
          message={`Are you sure you want to delete "${skill?.name}"? This action cannot be undone.`}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default EditSkillModal;
