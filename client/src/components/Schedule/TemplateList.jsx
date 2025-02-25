import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import {
  Edit2,
  Trash2,
  Plus,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Copy,
  Tag,
  AlertTriangle,
} from "lucide-react";

const TemplateList = ({
  templates,
  onEdit,
  onDelete,
  onCreateSchedule,
  categories,
}) => {
  const { isDark } = useTheme();
  const [expandedTemplates, setExpandedTemplates] = useState({});

  // Toggle expanded state for a template
  const toggleExpand = (id) => {
    setExpandedTemplates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Format time from 24-hour format to 12-hour format
  const formatTime = (time24) => {
    if (!time24) return "";

    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;

    return `${hour12}:${minutes} ${period}`;
  };

  // Get category color
  const getCategoryColor = (categoryName) => {
    const category = categories.find((cat) =>
      typeof cat === "object" ? cat.name === categoryName : cat === categoryName
    );

    if (category && typeof category === "object" && category.color) {
      return category.color;
    }

    // Fallback colors
    const colorMap = {
      Work: "#4a6da7",
      Study: "#8e44ad",
      "Personal Project": "#d35400",
      "Code Review": "#16a085",
      Exercise: "#27ae60",
      "Team Meeting": "#2980b9",
      Reading: "#8e44ad",
      Writing: "#2c3e50",
      Break: "#7f8c8d",
    };

    return colorMap[categoryName] || "#3498db";
  };

  // If no templates, show empty state
  if (!templates || templates.length === 0) {
    return (
      <div
        className={`text-center py-12 rounded-lg border-2 border-dashed ${
          isDark
            ? "border-gray-700 text-gray-400"
            : "border-gray-300 text-gray-500"
        }`}
      >
        <h3 className="text-lg font-medium mb-2">No templates found</h3>
        <p className="max-w-sm mx-auto mb-6">
          You haven't created any schedule templates yet. Templates help you
          quickly create new schedules with predefined items.
        </p>
        <button
          className={`px-4 py-2 rounded-lg ${
            isDark
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          <Plus size={16} className="inline-block mr-1" />
          Create Your First Template
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {templates.map((template) => (
        <motion.div
          key={template._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`rounded-lg shadow-md overflow-hidden ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Template Header */}
          <div
            className={`p-4 ${
              template.isDefault
                ? isDark
                  ? "bg-blue-900/20"
                  : "bg-blue-50"
                : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className={`font-medium flex items-center ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <FileText size={18} className="mr-2" />
                  {template.name}
                  {template.isDefault && (
                    <span
                      className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        isDark
                          ? "bg-blue-800 text-blue-200"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      Default
                    </span>
                  )}
                </h3>
                <div
                  className={`mt-1 flex items-center text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <Calendar size={14} className="mr-1" />
                  <span className="mr-3">
                    {template.dayType === "Any"
                      ? "For any day"
                      : `For ${template.dayType.toLowerCase()} only`}
                  </span>
                  <Clock size={14} className="mr-1" />
                  <span>{template.totalHours.toFixed(1)} hours</span>
                </div>
                {template.description && (
                  <p
                    className={`mt-1 text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {template.description}
                  </p>
                )}
              </div>

              <div className="flex space-x-1">
                <button
                  onClick={() => onCreateSchedule(template)}
                  className={`p-1.5 rounded-md ${
                    isDark
                      ? "text-green-400 hover:bg-gray-700 hover:text-green-300"
                      : "text-green-600 hover:bg-gray-100 hover:text-green-700"
                  }`}
                  title="Create Schedule from Template"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => onEdit(template)}
                  className={`p-1.5 rounded-md ${
                    isDark
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  title="Edit Template"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(template._id)}
                  className={`p-1.5 rounded-md ${
                    isDark
                      ? "text-gray-300 hover:bg-gray-700 hover:text-red-400"
                      : "text-gray-600 hover:bg-gray-100 hover:text-red-600"
                  }`}
                  title="Delete Template"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mt-2 flex justify-between items-center">
              <button
                onClick={() => toggleExpand(template._id)}
                className={`flex items-center ${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="mr-1 text-sm font-medium">
                  {template.items.length} items
                </span>
                {expandedTemplates[template._id] ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              <button
                onClick={() => onCreateSchedule(template)}
                className={`text-sm flex items-center px-2 py-1 rounded ${
                  isDark
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                <Plus size={14} className="mr-1" />
                Use Template
              </button>
            </div>
          </div>

          {/* Template Items */}
          {expandedTemplates[template._id] && (
            <div className={`p-4 ${isDark ? "bg-gray-800" : "bg-white"}`}>
              {template.items.length === 0 ? (
                <div
                  className={`py-3 text-center rounded ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <AlertTriangle size={18} className="inline-block mb-1" />
                  <p>No items in this template.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {template.items.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        isDark
                          ? "bg-gray-750 hover:bg-gray-700"
                          : "bg-gray-50 hover:bg-gray-100"
                      } border ${
                        isDark ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start">
                        <div
                          className="w-3 h-3 rounded-full mt-1.5 mr-2 flex-shrink-0"
                          style={{
                            backgroundColor: getCategoryColor(item.category),
                          }}
                        ></div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center">
                            <h5
                              className={`font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {item.title}
                            </h5>
                            <span
                              className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                                item.priority === "High"
                                  ? isDark
                                    ? "bg-red-900/40 text-red-300"
                                    : "bg-red-100 text-red-800"
                                  : item.priority === "Medium"
                                  ? isDark
                                    ? "bg-yellow-900/40 text-yellow-300"
                                    : "bg-yellow-100 text-yellow-800"
                                  : isDark
                                  ? "bg-blue-900/40 text-blue-300"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {item.priority}
                            </span>
                          </div>

                          <div
                            className={`mt-1 text-sm flex ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            <span className="flex items-center mr-3">
                              <Clock size={14} className="mr-1" />
                              {formatTime(item.startTime)} -{" "}
                              {formatTime(item.endTime)}
                            </span>
                            <span className="flex items-center">
                              <Tag size={14} className="mr-1" />
                              {item.category}
                            </span>
                          </div>

                          {item.description && (
                            <p
                              className={`mt-1 text-sm ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TemplateList;
