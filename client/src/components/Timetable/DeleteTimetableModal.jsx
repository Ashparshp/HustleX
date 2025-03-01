import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Shield, Lock } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const DeleteTimetableModal = ({
  isOpen,
  onClose,
  onConfirm,
  timetableName,
  isSubmitting,
}) => {
  const { isDark } = useTheme();
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [deleteAttempted, setDeleteAttempted] = useState(false);

  const handleDeleteClick = () => {
    if (!confirmChecked) {
      setDeleteAttempted(true);
      // Add slight vibration animation to the checkbox area
      const checkbox = document.getElementById("confirm-delete-checkbox");
      if (checkbox) {
        checkbox.classList.add("animate-pulse");
        setTimeout(() => checkbox.classList.remove("animate-pulse"), 500);
      }
      return;
    }

    onConfirm();
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`p-2.5 rounded-lg ${
            isDark ? "bg-red-900/70" : "bg-red-100"
          }`}
        >
          <AlertTriangle
            className={`w-6 h-6 ${isDark ? "text-red-300" : "text-red-600"}`}
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

      <div className="mt-3 mb-6">
        <div
          className={`p-4 rounded-lg border-l-4 ${
            isDark
              ? "bg-red-900/20 border-red-500 text-red-300"
              : "bg-red-50 border-red-500 text-red-800"
          } mb-5`}
        >
          <p className="text-lg font-medium mb-1">
            Are you sure you want to delete{" "}
            <span className="font-bold">"{timetableName}"</span>?
          </p>
          <p
            className={`text-sm ${
              isDark ? "text-red-200/80" : "text-red-700/80"
            }`}
          >
            This action{" "}
            <span className="font-bold underline">cannot be undone</span>. All
            activities and progress for this timetable will be permanently
            removed.
          </p>
        </div>

        <div
          className={`flex items-start gap-3 mt-6 p-4 rounded-lg ${
            isDark ? "bg-gray-800/70" : "bg-gray-50"
          } ${
            deleteAttempted && !confirmChecked
              ? "border-2 border-red-500/50"
              : ""
          }`}
          id="confirm-delete-checkbox"
        >
          <div className="flex-shrink-0 pt-0.5">
            <input
              type="checkbox"
              id="confirm-delete"
              checked={confirmChecked}
              onChange={() => setConfirmChecked(!confirmChecked)}
              className={`w-5 h-5 rounded ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-red-600 focus:ring-red-500"
                  : "bg-gray-100 border-gray-300 text-red-600 focus:ring-red-500"
              }`}
            />
          </div>
          <div>
            <label
              htmlFor="confirm-delete"
              className={`text-sm font-medium cursor-pointer ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              I understand that this action cannot be reversed and all timetable
              data will be permanently deleted.
            </label>
            {deleteAttempted && !confirmChecked && (
              <p
                className={`mt-2 text-sm ${
                  isDark ? "text-red-400" : "text-red-600"
                }`}
              >
                Please confirm by checking this box before deleting.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium
            ${
              isDark
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          disabled={isSubmitting}
        >
          Cancel
        </motion.button>

        <motion.button
          whileHover={confirmChecked ? { scale: 1.02 } : {}}
          whileTap={confirmChecked ? { scale: 0.98 } : {}}
          onClick={handleDeleteClick}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium min-w-[150px] flex items-center justify-center gap-2
            ${
              confirmChecked
                ? isDark
                  ? "bg-red-600/90 text-white hover:bg-red-500"
                  : "bg-red-600 text-white hover:bg-red-700"
                : isDark
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            } transition-all duration-300`}
          disabled={isSubmitting || !confirmChecked}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Deleting...
            </span>
          ) : (
            <>
              {!confirmChecked && <Lock size={16} />}
              Delete Timetable
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default DeleteTimetableModal;
