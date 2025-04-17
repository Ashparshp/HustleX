import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  BookOpen,
  ChevronDown,
  ListOrdered,
  Bookmark,
  FileText,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import SkillCard from "./SkillCard";
import EditSkillModal from "./EditSkillModal";
import ManageSkillsModal from "./ManageSkillsModal";

const SkillsGrid = ({ skills, onAddSkill, categories, onSkillChange }) => {
  const { isDark } = useTheme();
  const [editingSkill, setEditingSkill] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [managingCategory, setManagingCategory] = useState(null);

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
  };

  const handleCloseEditModal = () => {
    setEditingSkill(null);
    if (typeof onSkillChange === "function") {
      onSkillChange();
    }
  };

  const handleSkillDeleted = () => {
    if (typeof onSkillChange === "function") {
      onSkillChange();
    }
  };

  const handleManageSkills = (category, categorySkills) => {
    setManagingCategory({
      name: category,
      skills: categorySkills,
    });
  };

  const handleCloseManageModal = () => {
    setManagingCategory(null);
    if (typeof onSkillChange === "function") {
      onSkillChange();
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const expandAllCategories = () => {
    const allExpanded = {};
    Object.keys(skills).forEach((category) => {
      allExpanded[category] = true;
    });
    setExpandedCategories(allExpanded);
  };

  const collapseAllCategories = () => {
    const allCollapsed = {};
    Object.keys(skills).forEach((category) => {
      allCollapsed[category] = false;
    });
    setExpandedCategories(allCollapsed);
  };

  const isCategoryExpanded = (category) => {
    return expandedCategories[category] !== false;
  };
  const getCategoryColor = (category) => {
    const hash = Array.from(category).reduce(
      (hash, char) => char.charCodeAt(0) + ((hash << 5) - hash),
      0
    );

    const colors = [
      isDark ? "bg-blue-500" : "bg-blue-600",
      isDark ? "bg-green-500" : "bg-green-600",
      isDark ? "bg-purple-500" : "bg-purple-600",
      isDark ? "bg-yellow-500" : "bg-yellow-600",
      isDark ? "bg-indigo-500" : "bg-red-600",
      isDark ? "bg-pink-500" : "bg-pink-600",
      isDark ? "bg-indigo-500" : "bg-indigo-600",
      isDark ? "bg-teal-500" : "bg-teal-600",
    ];

    return colors[Math.abs(hash) % colors.length];
  };

  if (!skills || Object.keys(skills).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl mx-auto"
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-blue-500/30 rounded-xl blur-xl opacity-25 
          group-hover:opacity-35 transition-all duration-300"
        ></div>

        <div
          className={`relative p-10 rounded-xl border shadow-lg transition-all duration-300
          ${
            isDark
              ? "bg-gray-900/80 border-indigo-500/30 hover:border-indigo-400/60"
              : "bg-white/90 border-indigo-300/50 hover:border-indigo-500/70"
          }`}
        >
          <div className="flex flex-col items-center space-y-8 py-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`p-6 rounded-full ${
                isDark ? "bg-indigo-500/10" : "bg-indigo-100"
              }`}
            >
              <BookOpen
                className={`w-16 h-16 ${
                  isDark ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
            </motion.div>

            <div className="text-center space-y-3 max-w-md">
              <motion.h3
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className={`text-2xl font-semibold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                No skills added yet
              </motion.h3>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className={`${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                Start tracking your skills and progress by adding your first
                skill. You can organize skills into categories and track your
                learning journey.
              </motion.p>
            </div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 w-full justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onAddSkill}
                className={`px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center shadow-md
                  ${
                    isDark
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
              >
                <Plus size={18} className="mr-2" />
                Add Your First Skill
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  // Category card styling
  const getCategoryCardStyle = (isExpanded) => {
    const baseStyle = isDark
      ? "border-indigo-500/30 bg-gray-900/70"
      : "border-indigo-300/50 bg-white";

    const expansionStyle = isExpanded ? "shadow-md" : "shadow-sm";

    return `${baseStyle} ${expansionStyle}`;
  };

  // Count total skills
  const totalSkills = Object.values(skills).reduce(
    (total, categorySkills) => total + categorySkills.length,
    0
  );

  // Count expanded categories
  const expandedCount =
    Object.values(expandedCategories).filter(Boolean).length;
  const totalCategories = Object.keys(skills).length;

  // Check if all categories are expanded/collapsed
  const allExpanded = expandedCount === totalCategories;
  const allCollapsed = expandedCount === 0;

  // Render skill cards by category
  return (
    <div className="space-y-2">
      {/* Header with summary and expand/collapse controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-4 px-4 py-3 rounded-lg border ${
          isDark
            ? "bg-gray-900/80 border-indigo-500/20"
            : "bg-white border-indigo-200/50"
        } shadow-sm flex flex-wrap justify-between items-center gap-2`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${
              isDark ? "bg-indigo-500/10" : "bg-indigo-100/70"
            }`}
          >
            <Bookmark
              className={isDark ? "text-indigo-400" : "text-indigo-600"}
              size={16}
            />
          </div>
          <div>
            <h3
              className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Skills Overview
            </h3>
            <p
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {totalSkills} {totalSkills === 1 ? "skill" : "skills"} in{" "}
              {totalCategories}{" "}
              {totalCategories === 1 ? "category" : "categories"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAllCategories}
            disabled={allExpanded}
            className={`px-3 py-1 text-xs rounded-md transition-all ${
              allExpanded
                ? isDark
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isDark
                ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                : "bg-indigo-100/50 text-indigo-600 hover:bg-indigo-100/80"
            }`}
          >
            Expand All
          </button>
          <button
            onClick={collapseAllCategories}
            disabled={allCollapsed}
            className={`px-3 py-1 text-xs rounded-md transition-all ${
              allCollapsed
                ? isDark
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isDark
                ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                : "bg-indigo-100/50 text-indigo-600 hover:bg-indigo-100/80"
            }`}
          >
            Collapse All
          </button>
        </div>
      </motion.div>

      {/* Skills by Category */}
      <div className="space-y-6">
        {Object.entries(skills).map(([category, categorySkills], index) => {
          const isExpanded = isCategoryExpanded(category);
          const categoryColor = getCategoryColor(category);

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`rounded-lg border transition-all duration-300 overflow-hidden ${getCategoryCardStyle(
                isExpanded
              )} hover:border-opacity-80`}
            >
              {/* Category Header - Improved Version */}
              <div
                className={`group relative flex items-center p-5 rounded-t-lg cursor-pointer transition-all duration-200 ${
                  isDark
                    ? isExpanded
                      ? "bg-black hover:bg-black/40"
                      : "bg-transparent hover:bg-gray-900/40"
                    : isExpanded
                    ? "bg-indigo-50 hover:bg-indigo-100/70"
                    : "bg-transparent hover:bg-gray-100/70"
                } ${!isExpanded ? "rounded-b-lg" : ""}`}
                onClick={() => toggleCategory(category)}
                role="button"
                aria-expanded={isExpanded}
                aria-controls={`category-content-${category
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`}
              >
                {/* Left side with category name and count */}
                <div className="flex items-center flex-grow mr-4">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      {/* Category indicator dot */}
                      <div
                        className={`w-2.5 h-2.5 rounded-full mr-3 ${categoryColor}`}
                      ></div>

                      {/* Category name with motion */}
                      <motion.h2
                        className={`text-xl font-bold transition-colors ${
                          isDark ? "text-white" : "text-gray-800"
                        } group-hover:${
                          isDark ? "text-indigo-300" : "text-indigo-700"
                        }`}
                        layout
                      >
                        {category}
                      </motion.h2>
                    </div>
                  </div>

                  {/* Skills count badge */}
                  <div
                    className={`ml-3 px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      isDark
                        ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                        : "bg-indigo-100/80 text-indigo-700 border border-indigo-300/50"
                    }`}
                  >
                    <span className="font-semibold">
                      {categorySkills.length}
                    </span>
                    <span className="ml-1">
                      {categorySkills.length === 1 ? "skill" : "skills"}
                    </span>
                  </div>
                </div>

                {/* Right side with action buttons */}
                <div className="flex items-center gap-2.5">
                  {/* Manage Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleManageSkills(category, categorySkills);
                    }}
                    className={`p-2 rounded-lg transition-all duration-200 shadow-sm ${
                      isDark
                        ? "bg-purple-500/10 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
                        : "bg-purple-100/70 hover:bg-purple-200/90 text-purple-600 border border-purple-300/50"
                    }`}
                    title={`Manage ${category} skills`}
                    aria-label={`Manage ${category} skills`}
                  >
                    <div className="flex items-center">
                      <ListOrdered size={16} />
                      <span className="ml-1.5 text-xs font-medium hidden sm:inline">
                        Manage
                      </span>
                    </div>
                  </motion.button>

                  {/* Add Skill Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddSkill();
                    }}
                    className={`p-2 rounded-lg transition-all duration-200 shadow-sm ${
                      isDark
                        ? "bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/30"
                        : "bg-indigo-100/70 hover:bg-indigo-200/90 text-indigo-600 border border-indigo-300/50"
                    }`}
                    title={`Add skill to ${category}`}
                    aria-label={`Add skill to ${category}`}
                  >
                    <div className="flex items-center">
                      <Plus size={16} />
                      <span className="ml-1.5 text-xs font-medium hidden sm:inline">
                        Add
                      </span>
                    </div>
                  </motion.button>

                  {/* Expand/Collapse Indicator with Animation */}
                  <motion.div
                    initial={false}
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? "bg-gray-800/40 text-gray-400 hover:bg-gray-700/70 hover:text-gray-300"
                        : "bg-gray-100/70 text-gray-600 hover:bg-gray-200/90 hover:text-gray-800"
                    }`}
                    aria-hidden="true"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </div>

                {/* Visual indicator for expanded state */}
                {isExpanded && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                      isDark ? "bg-indigo-500/40" : "bg-indigo-500/30"
                    }`}
                  ></div>
                )}
              </div>

              {/* Category Content with Animated Expansion */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    id={`category-content-${category
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {categorySkills.length > 0 ? (
                      <div
                        className={`p-6 ${
                          isDark ? "bg-black" : "bg-gray-50/70"
                        }`}
                      >
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                          {/* Sort skill cards by orderIndex with more robust handling */}
                          {[...categorySkills]
                            .sort((a, b) => {
                              // If both have orderIndex, sort by it
                              if (
                                a.orderIndex !== undefined &&
                                b.orderIndex !== undefined
                              ) {
                                return a.orderIndex - b.orderIndex;
                              }
                              // If only one has orderIndex, prioritize the one with it
                              if (a.orderIndex !== undefined) return -1;
                              if (b.orderIndex !== undefined) return 1;
                              // Default sort by name if no orderIndex
                              return a.name.localeCompare(b.name);
                            })
                            .map((skill) => (
                              <motion.div
                                key={skill.id || skill._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 24,
                                }}
                              >
                                <SkillCard
                                  skill={skill}
                                  onEdit={handleEditSkill}
                                  categories={categories}
                                  onSkillDeleted={handleSkillDeleted}
                                />
                              </motion.div>
                            ))}
                        </motion.div>
                      </div>
                    ) : (
                      <div
                        className={`p-10 text-center ${
                          isDark ? "bg-gray-900/40" : "bg-gray-50/70"
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`p-3 rounded-full ${
                              isDark ? "bg-gray-800" : "bg-gray-200"
                            } mb-3`}
                          >
                            <FileText
                              className={
                                isDark ? "text-gray-400" : "text-gray-500"
                              }
                              size={20}
                            />
                          </div>
                          <p
                            className={
                              isDark ? "text-gray-400" : "text-gray-500"
                            }
                          >
                            No skills in this category yet
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onAddSkill}
                            className={`mt-4 px-4 py-2 rounded-lg text-sm ${
                              isDark
                                ? "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300"
                                : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                            }`}
                          >
                            <Plus size={14} className="inline mr-1" />
                            Add Skill
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Edit Modal with improved animation */}
      <AnimatePresence>
        {editingSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
          >
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={handleCloseEditModal}
            ></div>
            <div className="relative z-10 w-full max-w-xl">
              <EditSkillModal
                skill={editingSkill}
                onClose={handleCloseEditModal}
                categories={categories}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manage Skills Modal */}
      <AnimatePresence>
        {managingCategory && (
          <ManageSkillsModal
            isOpen={true}
            onClose={handleCloseManageModal}
            category={managingCategory.name}
            categorySkills={managingCategory.skills}
            onEditSkill={handleEditSkill}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsGrid;
