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

  // If no skills, show empty state
  if (!skills || Object.keys(skills).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative group p-8 text-center rounded-lg`}
      >
        <div
          className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg blur opacity-20 
                    group-hover:opacity-30 transition duration-300"
        />
        <div
          className={`relative p-12 rounded-lg border backdrop-blur-sm transition-all duration-300
          ${
            isDark
              ? "bg-black border-indigo-500/30 group-hover:border-indigo-400"
              : "bg-white border-indigo-300/50 group-hover:border-indigo-500"
          }`}
        >
          <BookOpen
            className={`w-16 h-16 mx-auto mb-4 ${
              isDark
                ? "text-indigo-400 opacity-50"
                : "text-indigo-600 opacity-50"
            }`}
          />
          <h3
            className={`text-xl font-medium mb-2 ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            No skills added yet
          </h3>
          <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Start tracking your skills and progress by adding your first skill.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddSkill}
            className={`px-6 py-3 rounded-lg inline-flex items-center ${
              isDark
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            <Plus size={20} className="mr-2" />
            Add Your First Skill
          </motion.button>
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
