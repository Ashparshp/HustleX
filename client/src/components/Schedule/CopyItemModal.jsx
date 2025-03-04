import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Calendar, Copy } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { createPortal } from "react-dom";

const CopyItemModal = ({ isOpen, onClose, onSubmit, item }) => {
  const { isDark } = useTheme();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(item, selectedDate);
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`relative w-full max-w-md p-6 rounded-lg shadow-xl backdrop-blur-sm
          ${
            isDark
              ? "bg-gray-900 border border-indigo-500/30"
              : "bg-white border border-indigo-300/50"
          }`}
        onClick={handleModalClick}
      >
        <div className="flex justify-between items-center mb-6">
          <h3
            className={`text-xl font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <Copy size={20} />
            Copy Schedule Item
          </h3>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-all duration-300
              ${
                isDark
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              }`}
          >
            <X size={18} />
          </motion.button>
        </div>

        <div
          className={`mb-4 p-3 rounded-lg ${
            isDark ? "bg-gray-800/50" : "bg-gray-100"
          }`}
        >
          <h4
            className={`font-medium mb-1 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {item?.title}
          </h4>
          <div
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {item?.startTime} - {item?.endTime} | {item?.category}
          </div>
          {item?.description && (
            <div
              className={`mt-1 text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {item.description}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="copyDate"
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Select Destination Date
            </label>
            <div className="relative">
              <Calendar
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
              <input
                type="date"
                id="copyDate"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border
                  ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-indigo-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500"
                  }`}
                required
              />
            </div>
          </div>

          <div
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            <p>
              This will copy the item to the selected date. If no schedule
              exists for that date, a new one will be created.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-lg text-sm
                ${
                  isDark
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-lg text-sm flex items-center
                ${
                  isDark
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
            >
              <Copy size={16} className="mr-2" />
              Copy Item
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default CopyItemModal;
