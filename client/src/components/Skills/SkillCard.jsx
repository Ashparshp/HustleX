import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit2,
  Trash2,
  Calendar,
  Award,
  Book,
  Clock,
  Flag,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Target,
  Eye,
  ThumbsUp,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import useSkills from "../../hooks/useSkills";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const SkillCard = ({ skill, onEdit, listView = false, onSkillDeleted }) => {
  const { isDark } = useTheme();
  const { deleteSkill } = useSkills();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Time ago formatter
  const timeAgo = useMemo(() => {
    if (!skill.createdAt) return "";

    const now = new Date();
    const createdAt = new Date(skill.createdAt);
    const diffInSeconds = Math.floor((now - createdAt) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  }, [skill.createdAt]);

  // Calculate time left if skill has completion date
  const timeLeft = useMemo(() => {
    if (!skill.completionDate || skill.status === "completed") return null;

    const now = new Date();
    const completionDate = new Date(skill.completionDate);

    if (completionDate <= now) return "Overdue";

    const diffInDays = Math.ceil(
      (completionDate - now) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 1) return "1 day left";
    if (diffInDays < 30) return `${diffInDays} days left`;
    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} ${months === 1 ? "month" : "months"} left`;
    }
    const years = Math.floor(diffInDays / 365);
    return `${years} ${years === 1 ? "year" : "years"} left`;
  }, [skill.completionDate, skill.status]);

  // Status color mapping with better contrast
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

  // Priority color mapping with better contrast
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

  // Progress bar color based on status and progress
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

  // Progress segment colors for the milestone markers
  const getProgressSegmentColor = (threshold, currentProgress, status) => {
    if (currentProgress >= threshold) {
      if (status === "completed")
        return isDark ? "bg-green-400" : "bg-green-500";
      if (status === "in-progress")
        return isDark ? "bg-yellow-400" : "bg-yellow-500";
      return isDark ? "bg-blue-400" : "bg-blue-500";
    }
    return isDark ? "bg-gray-700" : "bg-gray-300";
  };

  // Get status icon
  const StatusIcon = ({ status }) => {
    switch (status) {
      case "completed":
        return (
          <CheckCircle
            className={`w-4 h-4 ${
              isDark ? "text-green-400" : "text-green-600"
            }`}
          />
        );
      case "in-progress":
        return (
          <Clock
            className={`w-4 h-4 ${
              isDark ? "text-yellow-400" : "text-yellow-600"
            }`}
          />
        );
      case "upcoming":
        return (
          <Target
            className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`}
          />
        );
      default:
        return (
          <AlertCircle
            className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          />
        );
    }
  };

  // Handle edit button click
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

      // Call the onSkillDeleted callback if provided
      if (typeof onSkillDeleted === "function") {
        onSkillDeleted();
      }

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

  // Toggle description expansion
  const toggleDescription = (e) => {
    e.stopPropagation();
    setIsDescExpanded(!isDescExpanded);
  };

  const isCompleted = skill.status === "completed";
  const statusColors = getStatusColors(skill.status);
  const priorityColors = getPriorityColors(skill.priority);

  // List view renders a more compact horizontal card
  if (listView) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="relative group"
        >
          <div
            className={`absolute -inset-0.5 bg-gradient-to-r rounded-lg blur opacity-40 
                     group-hover:opacity-60 transition duration-300 ${getGradientColors(
                       skill.status
                     )}`}
          />
          <div
            className={`relative p-4 rounded-lg border backdrop-blur-sm transition-all duration-300
            ${
              isDark
                ? "bg-black border-indigo-900/50 group-hover:border-indigo-700"
                : "bg-white border-indigo-300/50 group-hover:border-indigo-500"
            } flex flex-col sm:flex-row items-start sm:items-center gap-4`}
          >
            {/* Status Icon */}
            <div
              className={`p-2 rounded-full ${
                skill.status === "completed"
                  ? isDark
                    ? "bg-green-900/30"
                    : "bg-green-100"
                  : skill.status === "in-progress"
                  ? isDark
                    ? "bg-yellow-900/30"
                    : "bg-yellow-100"
                  : isDark
                  ? "bg-blue-900/30"
                  : "bg-blue-100"
              } hidden sm:flex`}
            >
              <StatusIcon status={skill.status} />
            </div>

            {/* Left section - name and tags */}
            <div className="flex-grow min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {isCompleted && (
                  <Award
                    className={`w-5 h-5 flex-shrink-0 ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  />
                )}
                <h3
                  className={`font-medium text-lg truncate ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {skill.name}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-md border ${statusColors} inline-flex items-center gap-1`}
                >
                  <StatusIcon status={skill.status} />
                  <span>{skill.status.replace("-", " ")}</span>
                </span>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-md border flex items-center gap-1 ${priorityColors}`}
                >
                  <Flag className="w-3 h-3" />
                  {skill.priority}
                </span>
                {skill.description && (
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                      isDark
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    } cursor-pointer hover:opacity-80`}
                    onClick={toggleDescription}
                  >
                    <MessageSquare className="w-3 h-3 inline mr-1" />
                    {isDescExpanded ? "Hide notes" : "View notes"}
                  </span>
                )}
                {skill.createdAt && (
                  <span
                    className={`text-xs ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Added {timeAgo}
                  </span>
                )}
                {timeLeft && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md ${
                      timeLeft === "Overdue"
                        ? isDark
                          ? "bg-red-900/30 text-red-400"
                          : "bg-red-100 text-red-600"
                        : isDark
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {timeLeft === "Overdue" ? (
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                    ) : (
                      <Calendar className="w-3 h-3 inline mr-1" />
                    )}
                    {timeLeft}
                  </span>
                )}
              </div>

              {/* Expandable description */}
              <AnimatePresence>
                {isDescExpanded && skill.description && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 mb-2 rounded-lg ${
                      isDark ? "bg-indigo-950/50" : "bg-indigo-50"
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {skill.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Middle section - progress bar */}
            <div className="w-full sm:w-52 flex-shrink-0">
              <div className="flex justify-between items-center text-sm mb-1">
                <span
                  className={`${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } text-xs`}
                >
                  {skill.progress === 100 ? "Completed" : "Progress"}
                </span>
                <span
                  className={`font-medium text-xs ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {skill.progress}%
                </span>
              </div>

              {/* Enhanced progress bar with milestone markers */}
              <div className="relative w-full">
                <div className="w-full bg-indigo-950/30 rounded-full h-2 dark:bg-indigo-950/70 mb-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-2 rounded-full ${getProgressColor(
                      skill.progress,
                      skill.status
                    )}`}
                  />
                </div>

                {/* Milestone markers */}
                <div className="flex justify-between px-0.5 -mt-0.5 mb-1">
                  {[0, 25, 50, 75, 100].map((milestone) => (
                    <div
                      key={milestone}
                      className={`w-1.5 h-3 rounded-full ${getProgressSegmentColor(
                        milestone,
                        skill.progress,
                        skill.status
                      )} ${
                        milestone === 0
                          ? "ml-0.5"
                          : milestone === 100
                          ? "mr-0.5"
                          : ""
                      }`}
                      title={`${milestone}% milestone`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right section - actions */}
            <div className="flex gap-1 sm:flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditClick}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                    : "bg-indigo-100/50 hover:bg-indigo-100/70 text-indigo-600 border border-indigo-300/50"
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
                    ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-red-100/50 hover:bg-red-100/70 text-red-600 border border-red-300/50"
                }`}
                title="Delete skill"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditClick}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200"
                }`}
                title="View details"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
            >
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                onClick={handleCancelDelete}
              ></div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative z-10 w-full max-w-md"
              >
                <ConfirmDeleteModal
                  title="Delete Skill"
                  message={`Are you sure you want to delete "${skill.name}"? This action cannot be undone.`}
                  isDeleting={isDeleting}
                  onConfirm={handleConfirmDelete}
                  onCancel={handleCancelDelete}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Grid view (default)
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="h-full relative group"
      >
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r rounded-lg blur opacity-40 
                   group-hover:opacity-60 transition duration-300 ${getGradientColors(
                     skill.status
                   )}`}
        />
        <div
          className={`relative h-full p-5 rounded-lg border backdrop-blur-sm transition-all duration-300
          ${
            isDark
              ? "bg-black border-indigo-900/50 group-hover:border-indigo-700"
              : "bg-white border-indigo-300/50 group-hover:border-indigo-500"
          }`}
        >
          {/* Colored banner based on status */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-lg ${
              skill.status === "completed"
                ? isDark
                  ? "bg-green-600"
                  : "bg-green-500"
                : skill.status === "in-progress"
                ? isDark
                  ? "bg-yellow-600"
                  : "bg-yellow-500"
                : isDark
                ? "bg-blue-600"
                : "bg-blue-500"
            }`}
          ></div>

          <div className="space-y-4 pt-2">
            {/* Header with status and actions */}
            <div className="flex justify-between items-start">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {isCompleted && (
                    <div
                      className={`p-1 rounded-full ${
                        isDark ? "bg-green-900/30" : "bg-green-100"
                      }`}
                    >
                      <Award
                        className={`w-3.5 h-3.5 ${
                          isDark ? "text-green-400" : "text-green-600"
                        }`}
                      />
                    </div>
                  )}
                  <h3
                    className={`font-medium text-lg ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {skill.name}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-md border ${statusColors} inline-flex items-center gap-1`}
                  >
                    <StatusIcon status={skill.status} />
                    <span>{skill.status.replace("-", " ")}</span>
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-md border flex items-center gap-1 ${priorityColors}`}
                  >
                    <Flag className="w-3 h-3" />
                    {skill.priority}
                  </span>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex gap-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditClick}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                      : "bg-indigo-100/50 hover:bg-indigo-100/70 text-indigo-600 border border-indigo-300/50"
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
                      ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-red-100/50 hover:bg-red-100/70 text-red-600 border border-red-300/50"
                  }`}
                  title="Delete skill"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Circular progress indicator */}
            <div className="flex items-center justify-between">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  {/* Background circle */}
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className={`stroke-current ${
                      isDark ? "text-gray-800" : "text-gray-200"
                    }`}
                    strokeWidth="2"
                  ></circle>

                  {/* Progress circle */}
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className={`stroke-current ${
                      skill.status === "completed"
                        ? isDark
                          ? "text-green-500"
                          : "text-green-600"
                        : skill.status === "in-progress"
                        ? isDark
                          ? "text-yellow-500"
                          : "text-yellow-600"
                        : isDark
                        ? "text-blue-500"
                        : "text-blue-600"
                    }`}
                    strokeWidth="2"
                    strokeDasharray="100"
                    strokeDashoffset={100 - skill.progress}
                    strokeLinecap="round"
                    style={{
                      transformOrigin: "center",
                      transform: "rotate(-90deg)",
                      transition: "stroke-dashoffset 0.5s ease-in-out",
                    }}
                  ></circle>

                  {/* Percentage text */}
                  <text
                    x="18"
                    y="18.5"
                    className={`text-center text-3xl font-bold ${
                      isDark ? "fill-white" : "fill-gray-900"
                    }`}
                    dominantBaseline="middle"
                    textAnchor="middle"
                    style={{ fontSize: "9px" }}
                  >
                    {skill.progress}%
                  </text>
                </svg>
              </div>

              {/* Milestones and indicators */}
              <div className="flex-grow pl-3">
                <div className="grid grid-cols-4 gap-1 mb-2">
                  {[25, 50, 75, 100].map((milestone) => (
                    <div
                      key={milestone}
                      className="flex flex-col items-center"
                      title={`${milestone}% milestone`}
                    >
                      <div
                        className={`w-4 h-4 mb-1 rounded-full flex items-center justify-center ${
                          skill.progress >= milestone
                            ? skill.status === "completed"
                              ? isDark
                                ? "bg-green-900/30 text-green-400"
                                : "bg-green-100 text-green-600"
                              : skill.status === "in-progress"
                              ? isDark
                                ? "bg-yellow-900/30 text-yellow-400"
                                : "bg-yellow-100 text-yellow-600"
                              : isDark
                              ? "bg-blue-900/30 text-blue-400"
                              : "bg-blue-100 text-blue-600"
                            : isDark
                            ? "bg-gray-800 text-gray-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {skill.progress >= milestone && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          skill.progress >= milestone
                            ? isDark
                              ? "text-gray-300"
                              : "text-gray-700"
                            : isDark
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        {milestone}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Time info */}
                <div className="flex items-center justify-between text-xs">
                  {skill.startDate && (
                    <span
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      Started: {formatDate(skill.startDate).split(",")[0]}
                    </span>
                  )}
                  {timeLeft && (
                    <span
                      className={
                        timeLeft === "Overdue"
                          ? isDark
                            ? "text-red-400"
                            : "text-red-600"
                          : isDark
                          ? "text-blue-400"
                          : "text-blue-600"
                      }
                    >
                      {timeLeft}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description with toggle */}
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
                  <div className="flex-grow">
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      } ${isDescExpanded ? "" : "line-clamp-2"}`}
                    >
                      {skill.description}
                    </p>
                    {skill.description.length > 120 && (
                      <button
                        onClick={toggleDescription}
                        className={`text-xs mt-1 flex items-center ${
                          isDark
                            ? "text-indigo-400 hover:text-indigo-300"
                            : "text-indigo-600 hover:text-indigo-700"
                        }`}
                      >
                        {isDescExpanded ? (
                          <>
                            <ChevronUp className="w-3 h-3 mr-1" />
                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3 mr-1" />
                            Show more
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom section with dates or resources */}
            <div className="mt-auto pt-2">
              {/* Status completion dates */}
              {(skill.completionDate || skill.createdAt) && (
                <div className="grid grid-cols-1 gap-1 text-xs">
                  {skill.completionDate && (
                    <div className="flex items-center gap-1.5">
                      <Award
                        className={`w-3.5 h-3.5 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {skill.status === "completed" ? "Completed" : "Due"}:{" "}
                        {formatDate(skill.completionDate)}
                      </span>
                    </div>
                  )}

                  {skill.createdAt && (
                    <div className="flex items-center gap-1.5">
                      <Clock
                        className={`w-3.5 h-3.5 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Added: {timeAgo}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Resources with better styling */}
              {skill.resources && skill.resources.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Book
                      className={`w-3.5 h-3.5 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Resources:
                    </span>
                  </div>
                  <div className="pl-5 space-y-1">
                    {skill.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs flex items-center gap-1 truncate transition hover:underline ${
                          isDark
                            ? "text-indigo-300 hover:text-indigo-200"
                            : "text-indigo-600 hover:text-indigo-700"
                        }`}
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        {resource.title || resource.url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
          >
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={handleCancelDelete}
            ></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md"
            >
              <ConfirmDeleteModal
                title="Delete Skill"
                message={`Are you sure you want to delete "${skill.name}"? This action cannot be undone.`}
                isDeleting={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SkillCard;
