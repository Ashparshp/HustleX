// src/components/Skills/SkillsGrid.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
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

  if (!skills || Object.keys(skills).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md mx-auto"
      >
        {/* Subtle gradient background with improved blur */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-blue-500/30 rounded-xl blur-xl opacity-25 
          group-hover:opacity-35 transition-all duration-300"
        />

        {/* Main content card with refined border styling */}
        <div
          className={`relative p-8 rounded-xl border-2 backdrop-blur-sm transition-all duration-300 shadow-lg
            ${
              isDark
                ? "bg-gray-900/80 border-indigo-500/40 hover:border-indigo-400/60"
                : "bg-white/90 border-indigo-300/60 hover:border-indigo-500/70"
            }`}
        >
          {/* Inner content with improved spacing */}
          <div className="flex flex-col items-center space-y-6 py-4">
            <div
              className={`p-4 rounded-full ${
                isDark ? "bg-indigo-900/30" : "bg-indigo-100"
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
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddSkill}
              className={`px-6 py-3 rounded-lg font-medium inline-flex items-center shadow-md transition-all
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

  // Consistent background style for all categories
  const categoryBgClass = isDark
    ? "from-indigo-800/10 to-indigo-900/10 border-indigo-500/40"
    : "from-indigo-100 to-indigo-50 border-indigo-300/30";

  // Consistent text color for all categories
  const categoryTextClass = isDark ? "text-indigo-400" : "text-indigo-600";

  // Render skill cards by category
  return (
    <div className="space-y-8">
      {Object.entries(skills).map(([category, categorySkills]) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-lg border bg-gradient-to-br ${categoryBgClass}`}
        >
          <div
            className="flex items-center mb-4 cursor-pointer"
            onClick={() => toggleCategory(category)}
          >
            <h2 className={`text-2xl font-bold ${categoryTextClass}`}>
              {category}
            </h2>
            <div
              className={`ml-3 px-2 py-1 text-xs rounded-full ${
                isDark
                  ? "bg-gray-800 text-gray-300"
                  : "bg-white/80 text-gray-700"
              }`}
            >
              {categorySkills.length}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSkill();
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-gray-800/50 hover:bg-gray-800 text-gray-300"
                    : "bg-white/80 hover:bg-white text-gray-700"
                }`}
                title={`Add skill to ${category}`}
              >
                <Plus size={16} />
              </button>
              {isCategoryExpanded(category) ? (
                <ChevronUp
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              ) : (
                <ChevronDown
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              )}
            </div>
          </div>

          <AnimatePresence>
            {isCategoryExpanded(category) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2"
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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
