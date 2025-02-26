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

  // Get priority color
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

  // Get status color
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

  // Styling classes based on theme
  const modalBgClass = isDark
    ? "bg-black bg-gradient-to-br from-indigo-900/20 to-blue-900/10"
    : "bg-white bg-gradient-to-br from-indigo-100/50 to-blue-100/30";

  const headingClass = isDark ? "text-white" : "text-gray-900";
  const primaryTextClass = isDark ? "text-indigo-400" : "text-indigo-600";
  const secondaryTextClass = isDark ? "text-gray-400" : "text-gray-600";

  const inputClass = `w-full px-4 py-3 rounded-lg ${
    isDark
      ? "bg-indigo-500/10 border-indigo-500/30 text-white placeholder-indigo-300/50 focus:border-indigo-400"
      : "bg-indigo-100/50 border-indigo-300/50 text-gray-900 placeholder-indigo-400/50 focus:border-indigo-500"
  } border focus:outline-none focus:ring-2 focus:ring-opacity-30 ${
    isDark ? "focus:ring-indigo-500/30" : "focus:ring-indigo-500/40"
  } transition-all duration-200`;

  const selectClass = `w-full px-4 py-3 rounded-lg appearance-none ${
    isDark
      ? "bg-indigo-500/10 border-indigo-500/30 text-white focus:border-indigo-400"
      : "bg-indigo-100/50 border-indigo-300/50 text-gray-900 focus:border-indigo-500"
  } border focus:outline-none focus:ring-2 focus:ring-opacity-30 ${
    isDark ? "focus:ring-indigo-500/30" : "focus:ring-indigo-500/40"
  } transition-all duration-200`;

  const primaryButtonClass = `px-5 py-2.5 rounded-lg font-medium ${
    isDark
      ? "bg-indigo-500/30 hover:bg-indigo-500/40 text-indigo-300 focus:ring-indigo-500/30"
      : "bg-indigo-100/70 hover:bg-indigo-200/70 text-indigo-600 focus:ring-indigo-400/30"
  } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105 ${
    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
  } backdrop-blur-sm border ${
    isDark ? "border-indigo-500/20" : "border-indigo-300/30"
  }`;

  const secondaryButtonClass = `px-5 py-2.5 rounded-lg font-medium ${
    isDark
      ? "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 focus:ring-gray-500/30"
      : "bg-gray-100/70 hover:bg-gray-200/70 text-gray-700 focus:ring-gray-400/30"
  } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105 backdrop-blur-sm border ${
    isDark ? "border-gray-700/30" : "border-gray-200/50"
  }`;

  const iconButtonClass = `p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
    isDark
      ? "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 focus:ring-indigo-500/30"
      : "bg-indigo-100/50 hover:bg-indigo-200/70 text-indigo-600 focus:ring-indigo-400/30"
  } focus:outline-none focus:ring-2 focus:ring-opacity-50 backdrop-blur-sm border ${
    isDark ? "border-indigo-500/20" : "border-indigo-300/30"
  }`;

  const labelClass = `block mb-2 text-sm font-medium ${
    isDark ? "text-indigo-400" : "text-indigo-600"
  }`;

  const sliderClass = `w-full h-2 rounded-full appearance-none cursor-pointer ${
    isDark
      ? "bg-indigo-500/20 accent-indigo-500"
      : "bg-indigo-200/50 accent-indigo-600"
  }`;

  return (
    <>
      {/* Overlay with improved blur */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal with animation and improved styling */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div
          className={`w-full max-w-md p-6 rounded-xl shadow-2xl ${modalBgClass} backdrop-blur-sm border ${
            isDark ? "border-indigo-500/20" : "border-indigo-300/20"
          }`}
        >
          {/* Header with improved styling */}
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${headingClass}`}>
              Add New Skill
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className={`p-2 rounded-full ${
                isDark
                  ? "hover:bg-gray-800/50 text-gray-400"
                  : "hover:bg-gray-100/70 text-gray-500"
              } transition-all duration-200`}
              aria-label="Close"
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Error message with improved styling */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-5 p-3 rounded-lg text-sm font-medium ${
                isDark
                  ? "bg-red-900/20 text-red-400 border border-red-800/30"
                  : "bg-red-100/80 text-red-700 border border-red-200"
              }`}
            >
              {error}
            </motion.div>
          )}

          {/* Form with improved spacing and styling */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Skill Name */}
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

              {/* Category with improved styling */}
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
                      className={`p-2 rounded-lg ${
                        isDark
                          ? "bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                          : "bg-green-100/70 hover:bg-green-200/70 text-green-600 border border-green-300/50"
                      } transition-all duration-200`}
                    >
                      <Check size={20} />
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
                          className={`w-4 h-4 ${secondaryTextClass}`}
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
                      <Plus size={20} />
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Status with color indicators */}
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
                      className={`w-4 h-4 ${secondaryTextClass}`}
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

              {/* Progress with improved slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="progress" className={labelClass}>
                    Progress
                  </label>
                  <span
                    className={`text-sm font-medium ${
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
                  <span className={`text-xs ${secondaryTextClass}`}>100%</span>
                </div>
              </div>

              {/* Priority with color indicators */}
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
                      className={`w-4 h-4 ${secondaryTextClass}`}
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

              {/* Description with improved styling */}
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
                  className={`${inputClass} h-24 resize-none`}
                />
              </div>

              {/* Form Actions with improved buttons */}
              <div className="flex justify-end space-x-3 mt-6">
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
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Adding...</span>
                    </div>
                  ) : (
                    "Add Skill"
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default AddSkillModal;
