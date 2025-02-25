// src/components/UI/ConfirmModal.jsx
import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isSubmitting = false,
  isDestructive = false,
  onConfirm,
  onCancel,
  isDark,
}) => {
  // Animation variants
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

  // Button classes
  const cancelButtonClass = `px-4 py-2 rounded-lg font-medium ${
    isDark
      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
  } transition-colors duration-200 ${
    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
  }`;

  const confirmButtonClass = `px-4 py-2 rounded-lg font-medium ${
    isDestructive
      ? isDark
        ? "bg-red-600 hover:bg-red-700 text-white"
        : "bg-red-600 hover:bg-red-700 text-white"
      : isDark
      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
      : "bg-indigo-600 hover:bg-indigo-700 text-white"
  } transition-colors duration-200 ${
    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
  }`;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onCancel}
      />

      {/* Modal */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        className={`fixed inset-0 flex items-center justify-center z-50`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`w-full max-w-md p-6 rounded-xl shadow-xl ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Icon and Title */}
          <div className="flex items-start mb-4">
            <div
              className={`p-2 rounded-full ${
                isDestructive
                  ? isDark
                    ? "bg-red-900/30"
                    : "bg-red-100"
                  : isDark
                  ? "bg-indigo-900/30"
                  : "bg-indigo-100"
              } mr-3`}
            >
              <AlertTriangle
                size={24}
                className={
                  isDestructive
                    ? isDark
                      ? "text-red-400"
                      : "text-red-600"
                    : isDark
                    ? "text-indigo-400"
                    : "text-indigo-600"
                }
              />
            </div>
            <div className="flex-1">
              <h3
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {title}
              </h3>
              <p
                className={`mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                {message}
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

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className={cancelButtonClass}
              disabled={isSubmitting}
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={confirmButtonClass}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent mr-2"></div>
                  Processing...
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ConfirmModal;
