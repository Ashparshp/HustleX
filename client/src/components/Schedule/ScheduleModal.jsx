import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  MessageSquare,
  Tag,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Target,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ScheduleModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  triggerRef,
  categories = [],
}) => {
  const { isDark } = useTheme();
  const modalRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const [formData, setFormData] = useState(
    initialData || {
      date: new Date().toISOString().split("T")[0],
      dayType: new Date().getDay() % 6 === 0 ? "Weekend" : "Weekday",
      items: [],
      status: "Planned",
    }
  );

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    category: "",
    priority: "Medium",
    completed: false,
    notes: "",
  });

  const [showItemForm, setShowItemForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [itemValidationErrors, setItemValidationErrors] = useState({});

  // Default categories if none provided
  const defaultCategories = [
    "DSA",
    "System Design",
    "Development",
    "Learning",
    "Problem Solving",
    "Other",
  ];

  // Use provided categories or fall back to defaults
  const availableCategories =
    categories.length > 0 ? categories : defaultCategories;

  useEffect(() => {
    // Set default category when categories change
    if (
      availableCategories.length > 0 &&
      (!newItem.category || !availableCategories.includes(newItem.category))
    ) {
      setNewItem((prev) => ({
        ...prev,
        category: availableCategories[0],
      }));
    }
  }, [availableCategories, newItem.category]);

  useEffect(() => {
    if (isOpen) {
      const setDefaultPosition = () => {
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const modalHeight = modalRef.current?.offsetHeight || 400;
        const modalWidth = modalRef.current?.offsetWidth || 600;

        let top = Math.max(20, (windowHeight - modalHeight) / 2);
        let left = Math.max(20, (windowWidth - modalWidth) / 2);

        setModalPosition({ top, left });
      };

      if (triggerRef?.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const modalRect = modalRef.current?.getBoundingClientRect();

        let top = triggerRect.bottom + window.scrollY + 10;
        let left = triggerRect.left + window.scrollX;

        if (modalRect) {
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;

          if (left + modalRect.width > windowWidth) {
            left = windowWidth - modalRect.width - 10;
          }

          if (top + modalRect.height > windowHeight + window.scrollY) {
            top = triggerRect.top + window.scrollY - modalRect.height - 10;
          }
        }

        setModalPosition({ top, left });
      } else {
        setDefaultPosition();
      }
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,
          date: new Date(initialData.date).toISOString().split("T")[0],
        });
      } else {
        const today = new Date();
        setFormData({
          date: today.toISOString().split("T")[0],
          dayType: today.getDay() % 6 === 0 ? "Weekend" : "Weekday",
          items: [],
          status: "Planned",
        });
      }
    }
  }, [isOpen, initialData]);

  const validateSchedule = () => {
    const errors = {};
    if (!formData.date) errors.date = "Date is required";
    if (formData.items.length === 0)
      errors.items = "At least one item is required";
    return errors;
  };

  const validateItem = () => {
    const errors = {};
    if (!newItem.title.trim()) errors.title = "Title is required";
    if (!newItem.startTime) errors.startTime = "Start time is required";
    if (!newItem.endTime) errors.endTime = "End time is required";
    if (!newItem.category) errors.category = "Category is required";
    if (
      newItem.startTime &&
      newItem.endTime &&
      newItem.startTime >= newItem.endTime
    ) {
      errors.time = "End time must be after start time";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateSchedule();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleAddItem = () => {
    const errors = validateItem();
    if (Object.keys(errors).length > 0) {
      setItemValidationErrors(errors);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...newItem }],
    }));

    setNewItem({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      category: availableCategories[0],
      priority: "Medium",
      completed: false,
      notes: "",
    });

    setItemValidationErrors({});
    setShowItemForm(false);
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setFormData({
      ...formData,
      date: e.target.value,
      dayType: date.getDay() % 6 === 0 ? "Weekend" : "Weekday",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto pointer-events-none">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "absolute",
          top: modalPosition.top,
          left: modalPosition.left,
          pointerEvents: "auto",
          width: "calc(100% - 40px)",
          maxWidth: "42rem",
        }}
        className={`rounded-lg shadow-xl overflow-hidden group`}
      >
        <div
          className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg blur opacity-30 
                     group-hover:opacity-50 transition duration-300"
        />

        <div
          className={`relative p-6 rounded-lg border backdrop-blur-sm transition-all duration-300
            ${
              isDark
                ? "bg-black border-indigo-500/30 group-hover:border-indigo-400"
                : "bg-white border-indigo-300/50 group-hover:border-indigo-500"
            }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {initialData ? "Edit Schedule" : "Create Schedule"}
            </h3>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-all duration-300 group/close ${
                isDark
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                  : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
              }`}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Input */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Date
              </label>
              <div className="relative">
                <Calendar
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  }`}
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={handleDateChange}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
                    ${
                      isDark
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                        : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
                    }`}
                  required
                />
              </div>
              {validationErrors.date && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.date}
                </p>
              )}
            </div>

            {/* Schedule Items Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Schedule Items
                </h4>
                <motion.button
                  type="button"
                  onClick={() => setShowItemForm(!showItemForm)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-300 ${
                    isDark
                      ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                      : "bg-indigo-100/50 text-indigo-600 hover:bg-indigo-200/70"
                  }`}
                >
                  {showItemForm ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  <span className="text-sm">
                    {showItemForm ? "Hide Form" : "Add Item"}
                  </span>
                </motion.button>
              </div>

              <AnimatePresence>
                {showItemForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 p-4 rounded-lg border border-dashed"
                  >
                    {/* Title & Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="relative">
                          <Target
                            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                              isDark ? "text-indigo-400" : "text-indigo-600"
                            }`}
                          />
                          <input
                            type="text"
                            placeholder="Title"
                            value={newItem.title}
                            onChange={(e) =>
                              setNewItem({ ...newItem, title: e.target.value })
                            }
                            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
                              ${
                                isDark
                                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                                  : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
                              }`}
                          />
                        </div>
                        {itemValidationErrors.title && (
                          <p className="mt-1 text-sm text-red-500">
                            {itemValidationErrors.title}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <MessageSquare
                          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                            isDark ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={newItem.description}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              description: e.target.value,
                            })
                          }
                          className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
                            ${
                              isDark
                                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                                : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
                            }`}
                        />
                      </div>
                    </div>

                    {/* Time Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="relative">
                          <Clock
                            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                              isDark ? "text-indigo-400" : "text-indigo-600"
                            }`}
                          />
                          <input
                            type="time"
                            value={newItem.startTime}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                startTime: e.target.value,
                              })
                            }
                            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
                              ${
                                isDark
                                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                                  : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
                              }`}
                          />
                        </div>
                        {itemValidationErrors.startTime && (
                          <p className="mt-1 text-sm text-red-500">
                            {itemValidationErrors.startTime}
                          </p>
                        )}
                      </div>
                      <div>
                        <div className="relative">
                          <Clock
                            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                              isDark ? "text-indigo-400" : "text-indigo-600"
                            }`}
                          />
                          <input
                            type="time"
                            value={newItem.endTime}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                endTime: e.target.value,
                              })
                            }
                            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
                              ${
                                isDark
                                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                                  : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
                              }`}
                          />
                        </div>
                        {itemValidationErrors.endTime && (
                          <p className="mt-1 text-sm text-red-500">
                            {itemValidationErrors.endTime}
                          </p>
                        )}
                      </div>
                    </div>
                    {itemValidationErrors.time && (
                      <p className="text-sm text-red-500">
                        {itemValidationErrors.time}
                      </p>
                    )}

                    {/* Category & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <Tag
                          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                            isDark ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        />
                        <select
                          value={newItem.category}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              category: e.target.value,
                            })
                          }
                          className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border appearance-none transition-all duration-300
      ${
        isDark
          ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
          : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
      }`}
                        >
                          {availableCategories.map((category, index) => (
                            <option
                              key={index}
                              value={
                                typeof category === "string"
                                  ? category
                                  : category.name
                              }
                            >
                              {typeof category === "string"
                                ? category
                                : category.name}
                            </option>
                          ))}
                        </select>
                        {itemValidationErrors.category && (
                          <p className="mt-1 text-sm text-red-500">
                            {itemValidationErrors.category}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <AlertTriangle
                          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                            isDark ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        />
                        <select
                          value={newItem.priority}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              priority: e.target.value,
                            })
                          }
                          className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border appearance-none transition-all duration-300
                            ${
                              isDark
                                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                                : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
                            }`}
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="relative">
                      <MessageSquare
                        className={`absolute left-3 top-3 w-4 h-4 ${
                          isDark ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      />
                      <textarea
                        placeholder="Additional Notes"
                        value={newItem.notes}
                        onChange={(e) =>
                          setNewItem({ ...newItem, notes: e.target.value })
                        }
                        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
                          ${
                            isDark
                              ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                              : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
                          }`}
                        rows={3}
                      />
                    </div>

                    {/* Add Item Button */}
                    <motion.button
                      type="button"
                      onClick={handleAddItem}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-4 py-2.5 rounded-lg transition-all duration-300
                        ${
                          isDark
                            ? "bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                            : "bg-indigo-100/50 border border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
                        }`}
                    >
                      Add Item
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Items List */}
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      isDark
                        ? "bg-gray-800/50 border-gray-700/50"
                        : "bg-gray-50 border-gray-200/50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h5
                            className={`font-medium ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.title}
                          </h5>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              item.priority === "High"
                                ? isDark
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-red-100 text-red-600"
                                : item.priority === "Medium"
                                ? isDark
                                  ? "bg-yellow-500/10 text-yellow-400"
                                  : "bg-yellow-100 text-yellow-600"
                                : isDark
                                ? "bg-green-500/10 text-green-400"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {item.priority}
                          </span>
                        </div>
                        {item.description && (
                          <p
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <Clock
                            className={`w-4 h-4 ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={
                              isDark ? "text-gray-400" : "text-gray-600"
                            }
                          >
                            {item.startTime} - {item.endTime}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              isDark
                                ? "bg-indigo-500/10 text-indigo-400"
                                : "bg-indigo-100 text-indigo-600"
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>
                        {item.notes && (
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {item.notes}
                          </p>
                        )}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemoveItem(index)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "hover:bg-red-500/10 text-red-400"
                            : "hover:bg-red-50 text-red-600"
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}

                {validationErrors.items && formData.items.length === 0 && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{validationErrors.items}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Status
              </label>
              <div className="relative">
                <Target
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  }`}
                />
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border appearance-none transition-all duration-300
                    ${
                      isDark
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                        : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
                    }`}
                >
                  {["Planned", "In Progress", "Completed"].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-2.5 rounded-lg border transition-all duration-300
                  ${
                    isDark
                      ? "bg-transparent border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                      : "bg-transparent border-indigo-300/50 text-indigo-600 hover:bg-indigo-50"
                  }`}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-2.5 rounded-lg transition-all duration-300
                  ${
                    isDark
                      ? "bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                      : "bg-indigo-100/50 border border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
                  }`}
              >
                {initialData ? "Update" : "Create"} Schedule
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ScheduleModal;
