// src/components/Skills/SkillCard.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit2,
  Trash2,
  Calendar,
  Award,
  Book,
  Clock,
  Flag,
  MessageSquare,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import useSkills from "../../hooks/useSkills";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const SkillCard = ({ skill, onEdit }) => {
  const { isDark } = useTheme();
  const { deleteSkill } = useSkills();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get date formats
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Status color mapping - Blackish indigo with yellow/green/gray
  const getStatusColors = (status) => {
    const statusMap = {
      upcoming: isDark
        ? "text-gray-300 bg-gray-800 border-gray-700"
        : "text-gray-700 bg-gray-200 border-gray-300",
      "in-progress": isDark
        ? "text-yellow-300 bg-indigo-900/60 border-yellow-600/30"
        : "text-yellow-600 bg-indigo-50 border-yellow-400",
      completed: isDark
        ? "text-green-300 bg-indigo-900/60 border-green-600/30"
        : "text-green-600 bg-indigo-50 border-green-400",
    };
    return statusMap[status] || statusMap.upcoming;
  };

  // Priority color mapping
  const getPriorityColors = (priority) => {
    const priorityMap = {
      high: isDark
        ? "text-red-300 bg-indigo-900/60 border-red-700/30"
        : "text-red-600 bg-indigo-50 border-red-400",
      medium: isDark
        ? "text-yellow-300 bg-indigo-900/60 border-yellow-600/30"
        : "text-yellow-600 bg-indigo-50 border-yellow-400",
      low: isDark
        ? "text-gray-300 bg-indigo-900/60 border-gray-600/30"
        : "text-gray-600 bg-indigo-50 border-gray-400",
    };
    return priorityMap[priority] || priorityMap.medium;
  };

  // Progress bar color - Blackish indigo with yellow/green/gray
  const getProgressColor = (progress, status) => {
    // Base color on both progress and status
    if (status === "completed") return "bg-green-500";
    if (status === "in-progress") {
      if (progress >= 75) return "bg-yellow-400";
      if (progress >= 50) return "bg-yellow-500";
      if (progress >= 25) return "bg-yellow-600";
      return "bg-yellow-700";
    }
    if (status === "upcoming") {
      if (progress >= 50) return "bg-gray-400";
      if (progress >= 25) return "bg-gray-500";
      return "bg-gray-600";
    }
    // Fallback based on just progress
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-yellow-400";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-gray-400";
    return "bg-indigo-900";
  };

  // Get gradient colors based on status
  const getGradientColors = (status) => {
    const gradientMap = {
      upcoming: "from-indigo-900 to-gray-800",
      "in-progress": "from-indigo-900 to-yellow-800",
      completed: "from-indigo-900 to-green-800",
    };
    return gradientMap[status] || gradientMap.upcoming;
  };

  // Handle edit button click - Ensure we pass the skill data correctly
  const handleEditClick = () => {
    // Create a complete copy of the skill object to ensure all properties are passed correctly
    const skillData = {
      ...skill,
      // Ensure these critical fields exist
      id: skill.id || skill._id,
      name: skill.name || "",
      category: skill.category || "",
      status: skill.status || "upcoming",
      progress: skill.progress || 0,
      description: skill.description || "",
      priority: skill.priority || "medium",
      startDate: skill.startDate || "",
      completionDate: skill.completionDate || "",
    };
    // Pass the complete skill object to the edit handler
    console.log("Passing skill data to edit modal:", skillData);
    onEdit(skillData);
  };

  // Handle delete button click
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSkill(skill._id || skill.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting skill:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const isCompleted = skill.status === "completed";
  const statusColors = getStatusColors(skill.status);
  const priorityColors = getPriorityColors(skill.priority);
  const gradientColors = getGradientColors(skill.status);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="relative group"
      >
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r rounded-lg blur opacity-40 
                   group-hover:opacity-60 transition duration-300 ${gradientColors}`}
        />
        <div
          className={`relative p-6 rounded-lg border backdrop-blur-sm transition-all duration-300
          ${
            isDark
              ? "bg-black border-indigo-900/50 group-hover:border-indigo-700"
              : "bg-white border-indigo-300/50 group-hover:border-indigo-500"
          }`}
        >
          <div className="space-y-4">
            {/* Header with status and actions */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <Award
                      className={`w-5 h-5 ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                    />
                  )}
                  <span
                    className={`font-medium text-lg ${
                      isDark ? "text-indigo-300" : "text-indigo-800"
                    }`}
                  >
                    {skill.name}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColors}`}
                  >
                    {skill.status.replace("-", " ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full border flex items-center gap-1 ${priorityColors}`}
                  >
                    <Flag className="w-3 h-3" />
                    {skill.priority}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditClick}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-indigo-900/20 text-indigo-300"
                      : "hover:bg-indigo-50 text-indigo-700"
                  }`}
                  title="Edit skill"
                >
                  <Edit2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteClick}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-red-900/20 text-red-400"
                      : "hover:bg-red-50 text-red-600"
                  }`}
                  title="Delete skill"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <Clock
                    className={`w-4 h-4 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Progress
                  </span>
                </div>
                <span
                  className={`font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {skill.progress}%
                </span>
              </div>
              <div className="w-full bg-indigo-950 rounded-full h-2.5 dark:bg-indigo-950/70">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-2.5 rounded-full transition-colors ${getProgressColor(
                    skill.progress,
                    skill.status
                  )}`}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {skill.startDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar
                    className={`w-4 h-4 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Started: {formatDate(skill.startDate)}
                  </span>
                </div>
              )}

              {skill.completionDate && (
                <div className="flex items-center gap-1.5">
                  <Award
                    className={`w-4 h-4 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Completed: {formatDate(skill.completionDate)}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {skill.description && (
              <div
                className={`p-3 rounded-lg ${
                  isDark ? "bg-indigo-950/50" : "bg-indigo-50"
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare
                    className={`w-4 h-4 mt-0.5 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {skill.description}
                  </p>
                </div>
              </div>
            )}

            {/* Resources */}
            {skill.resources && skill.resources.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <Book
                    className={`w-4 h-4 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Resources:
                  </span>
                </div>
                <div className="pl-6 space-y-1">
                  {skill.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs block truncate transition hover:underline ${
                        isDark ? "text-indigo-300" : "text-indigo-700"
                      }`}
                    >
                      {resource.title || resource.url}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
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
