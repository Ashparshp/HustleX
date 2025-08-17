import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  X,
  Save,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Tag,
  Clock,
  Flag,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../UI/LoadingSpinner";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import EditSkillModal from "./EditSkillModal";

const DragHandle = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 4h6M9 8h6M9 12h6M9 16h6" />
  </svg>
);

const ManageSkillsModal = ({
  isOpen,
  onClose,
  category,
  categorySkills,
  onEditSkill,
  updateSkill,
  deleteSkill,
  updateSkillOrder,
}) => {
  const { isDark } = useTheme();
  const [managedSkills, setManagedSkills] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  useEffect(() => {
    if (categorySkills && categorySkills.length > 0) {
      const orderedSkills = [...categorySkills].map((skill, index) => ({
        ...skill,
        orderIndex:
          typeof skill.orderIndex === "number" ? skill.orderIndex : index,
      }));

      orderedSkills.sort((a, b) => {
        if (
          typeof a.orderIndex === "number" &&
          typeof b.orderIndex === "number"
        ) {
          return a.orderIndex - b.orderIndex;
        }
        if (typeof a.orderIndex === "number") return -1;
        if (typeof b.orderIndex === "number") return 1;
        return 0;
      });

      console.log(
        "Initial ordered skills:",
        orderedSkills.map((s) => ({ name: s.name, orderIndex: s.orderIndex }))
      );
      setManagedSkills(orderedSkills);
    } else {
      setManagedSkills([]);
    }
  }, [categorySkills]);

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

  const handleMoveSkill = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === managedSkills.length - 1)
    ) {
      return;
    }

    const updatedSkills = [...managedSkills];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    [updatedSkills[index], updatedSkills[newIndex]] = [
      updatedSkills[newIndex],
      updatedSkills[index],
    ];

    updatedSkills.forEach((skill, idx) => {
      skill.orderIndex = Number(idx);
    });

    console.log(
      "Updated order after move:",
      updatedSkills.map((s) => ({ name: s.name, orderIndex: s.orderIndex }))
    );
    setManagedSkills(updatedSkills);
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
  };

  const handleCloseEditModal = () => {
    setEditingSkill(null);
  };

  const handleDeleteSkill = (skill) => {
    setSkillToDelete(skill);
  };

  const confirmDeleteSkill = async () => {
    if (!skillToDelete) return;

    setIsDeleting(true);
    try {
      await deleteSkill(skillToDelete.id || skillToDelete._id);

      const updatedSkills = managedSkills.filter(
        (s) => (s.id || s._id) !== (skillToDelete.id || skillToDelete._id)
      );

      updatedSkills.forEach((skill, idx) => {
        skill.orderIndex = idx;
      });

      setManagedSkills(updatedSkills);
      setSkillToDelete(null);
    } catch (error) {
      console.error("Error deleting skill:", error);
      setError("Failed to delete skill. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await updateSkillOrder(category, managedSkills);
      onClose();
    } catch (error) {
      console.error("Error saving skill order:", error);
      setError("Failed to save skill order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-auto"
      >
        <div
          className={`w-full max-w-3xl p-6 rounded-xl shadow-2xl ${
            isDark
              ? "bg-black/90 border-indigo-500/30"
              : "bg-white/90 border-indigo-300/50"
          } border max-h-[90vh] overflow-y-auto my-4`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6 sticky top-0 z-10 backdrop-blur-md bg-opacity-90 pb-2 -mx-6 px-6 pt-2">
            <h2
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Manage {category} Skills
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
            >
              <X size={20} />
            </motion.button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-5 p-3 rounded-lg flex items-start gap-2 ${
                isDark
                  ? "bg-red-900/30 text-red-400 border border-red-800/30"
                  : "bg-red-100/80 text-red-700 border border-red-200"
              }`}
            >
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <AnimatePresence mode="popLayout">
              {managedSkills.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`text-center py-6 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  No skills found in this category.
                </motion.div>
              ) : (
                <Reorder.Group
                  values={managedSkills}
                  onReorder={(newOrder) => {
                    const updatedSkills = newOrder.map((skill, idx) => ({
                      ...skill,
                      orderIndex: Number(idx),
                    }));
                    console.log(
                      "Reordered skills:",
                      updatedSkills.map((s) => ({
                        name: s.name,
                        orderIndex: s.orderIndex,
                      }))
                    );
                    setManagedSkills(updatedSkills);
                  }}
                  className="space-y-3"
                >
                  {managedSkills.map((skill, index) => (
                    <Reorder.Item
                      key={skill.id || skill._id || index}
                      value={skill}
                      as="div"
                    >
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`border rounded-lg overflow-hidden ${
                          isDark ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <div
                          className={`p-4 flex justify-between items-center ${
                            isDark ? "bg-gray-800" : "bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-grow">
                            <div className="touch-none cursor-grab active:cursor-grabbing">
                              <DragHandle
                                className={`w-5 h-5 ${
                                  isDark ? "text-gray-500" : "text-gray-400"
                                }`}
                              />
                            </div>
                            <div className="flex-grow">
                              <h4
                                className={`font-medium ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {skill.name}
                              </h4>
                              <div className="flex items-center gap-4 mt-1 flex-wrap">
                                <div className="flex items-center">
                                  <Tag
                                    className={`w-3.5 h-3.5 mr-1 ${
                                      isDark ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  />
                                  <span
                                    className={`text-xs ${
                                      isDark ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  >
                                    {skill.category}
                                  </span>
                                </div>
                                <div
                                  className={`text-xs px-2 py-0.5 rounded-md ${
                                    isDark ? "bg-gray-700" : "bg-gray-100"
                                  } ${getStatusColor(skill.status)}`}
                                >
                                  {skill.status.replace("-", " ")}
                                </div>
                                <div className="flex items-center">
                                  <Flag
                                    className={`w-3.5 h-3.5 mr-1 ${getPriorityColor(
                                      skill.priority
                                    )}`}
                                  />
                                  <span
                                    className={`text-xs ${getPriorityColor(
                                      skill.priority
                                    )}`}
                                  >
                                    {skill.priority}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Clock
                                    className={`w-3.5 h-3.5 mr-1 ${
                                      isDark ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  />
                                  <span
                                    className={`text-xs ${
                                      isDark ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  >
                                    {skill.progress}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <button
                              type="button"
                              onClick={() => handleMoveSkill(index, "up")}
                              disabled={index === 0}
                              className={`p-1.5 rounded-lg ${
                                isDark
                                  ? "hover:bg-gray-700 text-gray-400 disabled:text-gray-700"
                                  : "hover:bg-gray-100 text-gray-600 disabled:text-gray-300"
                              } disabled:cursor-not-allowed`}
                              title="Move up"
                            >
                              <ArrowUp size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveSkill(index, "down")}
                              disabled={index === managedSkills.length - 1}
                              className={`p-1.5 rounded-lg ${
                                isDark
                                  ? "hover:bg-gray-700 text-gray-400 disabled:text-gray-700"
                                  : "hover:bg-gray-100 text-gray-600 disabled:text-gray-300"
                              } disabled:cursor-not-allowed`}
                              title="Move down"
                            >
                              <ArrowDown size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditSkill(skill)}
                              className={`p-1.5 rounded-lg ${
                                isDark
                                  ? "hover:bg-gray-700 text-indigo-400"
                                  : "hover:bg-gray-100 text-indigo-600"
                              }`}
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSkill(skill)}
                              disabled={isDeleting}
                              className={`p-1.5 rounded-lg ${
                                isDark
                                  ? "hover:bg-gray-700 text-red-400 disabled:opacity-50"
                                  : "hover:bg-gray-100 text-red-600 disabled:opacity-50"
                              }`}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border ${
                isDark
                  ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSubmitting || managedSkills.length === 0}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isDark
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px] justify-center`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Saving...</span>
                </span>
              ) : (
                <>
                  <Save size={16} />
                  Save Order
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {skillToDelete && (
        <ConfirmDeleteModal
          title="Delete Skill"
          message={`Are you sure you want to delete "${skillToDelete.name}"? This action cannot be undone.`}
          isDeleting={isDeleting}
          onConfirm={confirmDeleteSkill}
          onCancel={() => setSkillToDelete(null)}
        />
      )}

      <AnimatePresence>
        {editingSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto"
          >
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={handleCloseEditModal}
            ></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-[60] w-full max-w-xl"
            >
              <EditSkillModal
                skill={editingSkill}
                onClose={handleCloseEditModal}
                categories={[category]}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ManageSkillsModal;
