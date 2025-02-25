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