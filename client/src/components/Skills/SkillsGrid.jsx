// src/components/Skills/SkillsGrid.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import SkillCard from "./SkillCard";
import EditSkillModal from "./EditSkillModal";

const SkillsGrid = ({ skills, onAddSkill, categories }) => {
  const { isDark } = useTheme();
  const [editingSkill, setEditingSkill] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
  };

  const handleCloseEditModal = () => {
    setEditingSkill(null);
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Check if any category is expanded - default to true if not set
  const isCategoryExpanded = (category) => {
    return expandedCategories[category] !== false; // Default to expanded (true)
  };

  // Empty state when no skills are available
  if (!skills || Object.keys(skills).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl mx-auto"
      >
        {/* Subtle gradient background with improved blur */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-blue-500/30 rounded-xl blur-xl opacity-25 
          group-hover:opacity-35 transition-all duration-300"
        />

        {/* Main content card with refined border styling */}
        <div
          className={`relative p-8 rounded-xl border shadow-lg transition-all duration-300
            ${
              isDark
                ? "bg-gray-900/80 border-indigo-500/30 hover:border-indigo-400/60"
                : "bg-white/90 border-indigo-300/50 hover:border-indigo-500/70"
            }`}
        >
          {/* Inner content with improved spacing */}
          <div className="flex flex-col items-center space-y-6 py-4">
            <div
              className={`p-4 rounded-full ${
                isDark ? "bg-indigo-500/10" : "bg-indigo-100"
              }`}
            >
              <BookOpen
                className={`w-12 h-12 ${
                  isDark ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
            </div>

            <div className="text-center space-y-3">
              <h3
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                No skills added yet
              </h3>

              <p
                className={`max-w-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Start tracking your skills and progress by adding your first
                skill.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddSkill}
              className={`px-6 py-3 rounded-lg font-medium inline-flex items-center shadow-md
                ${
                  isDark
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
            >
              <Plus size={18} className="mr-2" />
              Add Your First Skill
            </motion.button>
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

  // Render skill cards by category
  return (
    <div className="space-y-6">
      {Object.entries(skills).map(([category, categorySkills]) => {
        const isExpanded = isCategoryExpanded(category);

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg border transition-all duration-300 overflow-hidden ${getCategoryCardStyle(
              isExpanded
            )}`}
          >
            <div
              className={`flex items-center p-4 cursor-pointer transition-colors ${
                isDark
                  ? isExpanded
                    ? "bg-indigo-500/10"
                    : "bg-transparent"
                  : isExpanded
                  ? "bg-indigo-50"
                  : "bg-transparent"
              }`}
              onClick={() => toggleCategory(category)}
            >
              <motion.h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
                layout
              >
                {category}
              </motion.h2>

              <div
                className={`ml-3 px-2.5 py-0.5 text-xs font-medium rounded-full ${
                  isDark
                    ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
                    : "bg-indigo-100/60 text-indigo-700 border border-indigo-300/50"
                }`}
              >
                {categorySkills.length}
              </div>

              <div className="ml-auto flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSkill();
                  }}
                  className={`p-2 rounded-lg transition-colors shadow-sm ${
                    isDark
                      ? "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                      : "bg-indigo-100/50 hover:bg-indigo-100/70 text-indigo-600 border border-indigo-300/50"
                  }`}
                  title={`Add skill to ${category}`}
                >
                  <Plus size={16} />
                </motion.button>

                <div
                  className={`p-1 rounded-full transition-colors ${
                    isDark
                      ? "text-gray-400 bg-transparent hover:bg-gray-800"
                      : "text-gray-600 bg-transparent hover:bg-gray-100"
                  }`}
                >
                  {isExpanded ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div
                    className={`p-4 ${
                      isDark ? "bg-gray-900/40" : "bg-gray-50/50"
                    }`}
                  >
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                      {categorySkills.map((skill) => (
                        <motion.div
                          key={skill.id || skill._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <SkillCard
                            skill={skill}
                            onEdit={handleEditSkill}
                            categories={categories}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Edit Modal with improved backdrop */}
      <AnimatePresence>
        {editingSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
          >
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={handleCloseEditModal}
            ></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-xl"
            >
              <EditSkillModal
                skill={editingSkill}
                onClose={handleCloseEditModal}
                categories={categories}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsGrid;
