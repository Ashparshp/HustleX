// src/components/Timetable/DeleteTimetableModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const DeleteTimetableModal = ({
  isOpen,
  onClose,
  onConfirm,
  timetableName,
}) => {
  const { isDark } = useTheme();

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`p-2 rounded-lg ${
            isDark ? "bg-red-900/50" : "bg-red-100"
          }`}
        >
          <AlertTriangle
            className={`w-5 h-5 ${isDark ? "text-red-300" : "text-red-600"}`}
          />
        </div>
        <h2
          className={`text-xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Delete Timetable
        </h2>
      </div>

      <div className="mt-2 mb-6">
        <p className={`${isDark ? "text-gray-300" : "text-gray-700"} mb-4`}>
          Are you sure you want to delete{" "}
          <span className="font-semibold">{timetableName}</span>?
        </p>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          This action cannot be undone. All activities and progress for this
          timetable will be permanently removed.
        </p>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className={`px-4 py-2 rounded-lg text-sm font-medium
            ${
              isDark
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          Cancel
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfirm}
          className={`px-4 py-2 rounded-lg text-sm font-medium
            ${
              isDark
                ? "bg-red-600/80 text-white hover:bg-red-500"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
        >
          Delete Timetable
        </motion.button>
      </div>
    </div>
  );
};

export default DeleteTimetableModal;
