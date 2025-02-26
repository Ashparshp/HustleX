// src/components/Timetable/CollapsibleTimetableButtons.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  History,
  ChartBar,
  ChevronDown,
  Sliders,
} from "lucide-react";

const CollapsibleTimetableButtons = ({
  onManage,
  onHistory,
  onStats,
  onCategories,
  isDark,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getButtonStyles = () => {
    return isDark
      ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30"
      : "bg-indigo-100 border-indigo-300 text-indigo-600 hover:bg-indigo-200";
  };

  const buttons = [
    { icon: Settings, label: "Manage", onClick: onManage },
    { icon: History, label: "History", onClick: onHistory },
    { icon: ChartBar, label: "Stats", onClick: onStats },
  ];

  // Add Categories button if handler is provided
  if (onCategories) {
    buttons.push({ icon: Sliders, label: "Categories", onClick: onCategories });
  }

  return (
    <div className="relative z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border
          backdrop-blur-sm transition-all duration-300 shadow-sm ${getButtonStyles()}`}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
        More Options
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 space-y-2 min-w-[150px]"
          >
            {buttons.map((button) => (
              <motion.button
                key={button.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  button.onClick();
                  setIsExpanded(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border
                  backdrop-blur-sm transition-all duration-300 shadow-sm ${getButtonStyles()}`}
              >
                <button.icon className="w-4 h-4" />
                {button.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleTimetableButtons;
