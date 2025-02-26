// src/components/common/ConfirmDialog.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger",
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const getTypeStyles = () => {
    if (type === "danger") {
      return isDark
        ? "bg-red-600 text-white hover:bg-red-700"
        : "bg-red-500 text-white hover:bg-red-600";
    }
    return isDark
      ? "bg-indigo-600 text-white hover:bg-indigo-700"
      : "bg-indigo-500 text-white hover:bg-indigo-600";
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`relative z-50 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${
            isDark
              ? "bg-gray-900 border border-gray-800"
              : "bg-white border border-gray-200"
          }`}
        >
          <h3
            className={`text-xl font-semibold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>

          <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {message}
          </p>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cancelText}
            </button>

            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg transition-colors ${getTypeStyles()}`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;
