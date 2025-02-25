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