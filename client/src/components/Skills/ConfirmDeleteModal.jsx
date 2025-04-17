import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../UI/LoadingSpinner";

const ConfirmDeleteModal = ({
  title,
  message,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  const { isDark } = useTheme();

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const cancelButtonClass = `px-4 py-2 rounded-lg font-medium ${
    isDark
      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
  } transition-colors duration-200`;

  const deleteButtonClass = `px-4 py-2 rounded-lg font-medium ${
    isDark
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-red-600 hover:bg-red-700 text-white"
  } transition-colors duration-200 ${
    isDeleting ? "opacity-70 cursor-not-allowed" : ""
  }`;

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onCancel}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        className={`fixed inset-0 flex items-center justify-center z-50`}
      >
        <div
          className={`w-full max-w-sm p-6 rounded-xl shadow-xl ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start mb-4">
            <div
              className={`p-2 rounded-full ${
                isDark ? "bg-red-900/30" : "bg-red-100"
              } mr-3`}
            >
              <AlertTriangle
                size={24}
                className={isDark ? "text-red-400" : "text-red-600"}
              />
            </div>
            <div className="flex-1">
              <h3
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {title || "Confirm Delete"}
              </h3>
              <p
                className={`mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                {message ||
                  "Are you sure you want to delete this item? This action cannot be undone."}
              </p>
            </div>
            <button
              onClick={onCancel}
              className={`p-1 rounded-full ${
                isDark
                  ? "hover:bg-gray-700 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className={cancelButtonClass}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={deleteButtonClass}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Deleting...</span>
                </div>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ConfirmDeleteModal;
