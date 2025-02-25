import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Edit2,
  Trash2,
  Plus,
  Calendar,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
  Play,
  CheckSquare,
  Square,
} from "lucide-react";

const ScheduleList = ({
  schedules,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onEditSchedule,
  onDeleteSchedule,
  categories,
}) => {
  const { isDark } = useTheme();
  const [expandedSchedules, setExpandedSchedules] = useState({});

  // Toggle expanded state for a schedule
  const toggleExpand = (id) => {
    setExpandedSchedules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return isDark
          ? "bg-green-800 text-green-200"
          : "bg-green-100 text-green-800";
      case "In Progress":
        return isDark
          ? "bg-blue-800 text-blue-200"
          : "bg-blue-100 text-blue-800";
      case "Planned":
      default:
        return isDark
          ? "bg-gray-700 text-gray-200"
          : "bg-gray-100 text-gray-800";
    }
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

  // Handle item completion toggle
  const handleToggleComplete = (scheduleId, item) => {
    onEditItem({ _id: scheduleId }, { ...item, completed: !item.completed });
  };

  // If no schedules, show empty state
  if (!schedules || schedules.length === 0) {
    return (
      <div
        className={`text-center py-12 rounded-lg border-2 border-dashed ${
          isDark
            ? "border-gray-700 text-gray-400"
            : "border-gray-300 text-gray-500"
        }`}
      >
        <h3 className="text-lg font-medium mb-2">No schedules found</h3>
        <p className="max-w-sm mx-auto mb-6">
          You haven't created any schedules yet. Start by adding your first
          daily schedule.
        </p>
        <button
          className={`px-4 py-2 rounded-lg ${
            isDark
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          <Plus size={16} className="inline-block mr-1" />
          Create Your First Schedule
        </button>
      </div>
    );
  }

  // Group schedules by month
  const groupedSchedules = schedules.reduce((groups, schedule) => {
    const date = new Date(schedule.date);
    const monthYear = `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;

    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }

    groups[monthYear].push(schedule);
    return groups;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(groupedSchedules).map(([monthYear, monthSchedules]) => (
        <div key={monthYear} className="space-y-4">
          <h2
            className={`text-xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {monthYear}
          </h2>

          <div className="space-y-4">
            {monthSchedules.map((schedule) => (
              <motion.div
                key={schedule._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`rounded-lg shadow-md overflow-hidden ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                {/* Schedule Header */}
                <div
                  className={`p-4 border-b ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <Calendar
                          size={18}
                          className={`mr-2 ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        />
                        <h3
                          className={`font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {formatDate(schedule.date)}
                        </h3>
                        <span
                          className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusColor(
                            schedule.status
                          )}`}
                        >
                          {schedule.status}
                        </span>
                        <span
                          className={`ml-2 text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {schedule.dayType}
                        </span>
                      </div>
                      {schedule.templateName && (
                        <div
                          className={`mt-1 text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <FileText size={14} className="inline-block mr-1" />
                          Template: {schedule.templateName}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditSchedule(schedule)}
                        className={`p-1.5 rounded-md ${
                          isDark
                            ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                        title="Edit Schedule"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteSchedule(schedule._id)}
                        className={`p-1.5 rounded-md ${
                          isDark
                            ? "text-gray-300 hover:bg-gray-700 hover:text-red-400"
                            : "text-gray-600 hover:bg-gray-100 hover:text-red-600"
                        }`}
                        title="Delete Schedule"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock
                        size={16}
                        className={`mr-1 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {schedule.totalHours.toFixed(1)} hours planned
                      </span>
                      <span
                        className={`ml-3 text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <CheckCircle size={16} className="inline-block mr-1" />
                        {schedule.overallCompletion.toFixed(0)}% completed
                      </span>
                    </div>

                    <button
                      onClick={() => toggleExpand(schedule._id)}
                      className={`flex items-center ${
                        isDark
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <span className="mr-1 text-sm font-medium">
                        {schedule.items.length} items
                      </span>
                      {expandedSchedules[schedule._id] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Schedule Items */}
                {expandedSchedules[schedule._id] && (
                  <>
                    <div
                      className={`p-4 ${isDark ? "bg-gray-850" : "bg-gray-50"}`}
                    >
                      <div className="flex justify-between mb-2">
                        <h4
                          className={`font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Schedule Items
                        </h4>
                        <button
                          onClick={() => onAddItem(schedule)}
                          className={`flex items-center text-sm px-2 py-1 rounded ${
                            isDark
                              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          <Plus size={14} className="mr-1" />
                          Add Item
                        </button>
                      </div>

                      {schedule.items.length === 0 ? (
                        <div
                          className={`py-3 text-center rounded ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <AlertTriangle
                            size={18}
                            className="inline-block mb-1"
                          />
                          <p>No items in this schedule yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {schedule.items.map((item) => (
                            <div
                              key={item._id}
                              className={`p-3 rounded-lg ${
                                isDark
                                  ? "bg-gray-800 hover:bg-gray-750"
                                  : "bg-white hover:bg-gray-50"
                              } border ${
                                isDark ? "border-gray-700" : "border-gray-200"
                              } flex justify-between`}
                            >
                              <div className="flex items-start flex-grow">
                                <button
                                  onClick={() =>
                                    handleToggleComplete(schedule._id, item)
                                  }
                                  className={`mt-0.5 mr-2 flex-shrink-0 ${
                                    item.completed
                                      ? isDark
                                        ? "text-green-400 hover:text-green-300"
                                        : "text-green-600 hover:text-green-700"
                                      : isDark
                                      ? "text-gray-400 hover:text-gray-300"
                                      : "text-gray-400 hover:text-gray-600"
                                  }`}
                                >
                                  {item.completed ? (
                                    <CheckSquare size={18} />
                                  ) : (
                                    <Square size={18} />
                                  )}
                                </button>
                                <div className="flex-grow min-w-0">
                                  <div className="flex items-center">
                                    <div
                                      className="w-3 h-3 rounded-full mr-2"
                                      style={{
                                        backgroundColor: getCategoryColor(
                                          item.category
                                        ),
                                      }}
                                    ></div>
                                    <h5
                                      className={`font-medium truncate ${
                                        item.completed
                                          ? isDark
                                            ? "line-through text-gray-500"
                                            : "line-through text-gray-400"
                                          : isDark
                                          ? "text-white"
                                          : "text-gray-900"
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
                                    <span className="truncate">
                                      {item.category}
                                    </span>
                                  </div>
                                  {item.description && (
                                    <p
                                      className={`mt-1 text-sm truncate ${
                                        isDark
                                          ? "text-gray-400"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-start ml-2">
                                <button
                                  onClick={() => onEditItem(schedule, item)}
                                  className={`p-1 rounded ${
                                    isDark
                                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() =>
                                    onDeleteItem(schedule._id, item._id)
                                  }
                                  className={`p-1 rounded ${
                                    isDark
                                      ? "text-gray-400 hover:text-red-400 hover:bg-gray-700"
                                      : "text-gray-500 hover:text-red-600 hover:bg-gray-100"
                                  }`}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleList;
