import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, FileText, Target, Tag } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ScheduleForm = ({
  initialData,
  templateData,
  onSubmit,
  onCancel,
  templates,
  categories,
  initialDate,
}) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState(
    initialData || {
      date: initialDate
        ? new Date(initialDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      dayType: "Weekday", // Default to Weekday
      status: "Planned", // Default to Planned
      items: [], // Will be populated from template or empty
      templateName: "",
    }
  );
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [useTemplate, setUseTemplate] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with data if editing or from template
  useEffect(() => {
    if (initialData) {
      const data = { ...initialData };
      // Format date for input field
      if (data.date) {
        const dateObj = new Date(data.date);
        data.date = dateObj.toISOString().split("T")[0];
      }
      setFormData(data);
    } else if (templateData) {
      // We're creating from a template
      setUseTemplate(true);
      setSelectedTemplate(templateData._id);
      setFormData((prev) => ({
        ...prev,
        templateName: templateData.name,
        dayType:
          templateData.dayType === "Any" ? prev.dayType : templateData.dayType,
      }));
    }
  }, [initialData, templateData]);

  // Determine if a date is a weekday or weekend
  useEffect(() => {
    if (formData.date) {
      const date = new Date(formData.date);
      const day = date.getDay();
      // 0 is Sunday, 6 is Saturday
      const isWeekend = day === 0 || day === 6;
      setFormData((prev) => ({
        ...prev,
        dayType: isWeekend ? "Weekend" : "Weekday",
      }));
    }
  }, [formData.date]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear any errors for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Handle template selection
  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);

    if (templateId) {
      const template = templates.find((t) => t._id === templateId);
      if (template) {
        setFormData((prev) => ({
          ...prev,
          templateName: template.name,
          dayType: template.dayType === "Any" ? prev.dayType : template.dayType,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        templateName: "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {};
    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create payload
    const payload = {
      ...formData,
    };

    // If using template, add templateId to payload
    if (useTemplate && selectedTemplate) {
      payload.templateId = selectedTemplate;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Input */}
      <div>
        <label
          htmlFor="date"
          className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Date*
        </label>
        <div className="relative">
          <Calendar
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}
          />
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
              ${
                isDark
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                  : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
              } ${errors.date ? "border-red-500" : ""}`}
            required
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-500">{errors.date}</p>
          )}
        </div>
        <p
          className={`mt-1 text-sm ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Day Type: {formData.dayType}
        </p>
      </div>

      {/* Use template option - only for new schedules */}
      {!initialData && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className={`p-4 rounded-lg border border-dashed transition-all duration-300 ${
            isDark
              ? "bg-indigo-500/10 border-indigo-500/30"
              : "bg-indigo-100/50 border-indigo-300/50"
          }`}
        >
          <div className="flex items-start">
            <input
              type="checkbox"
              id="useTemplate"
              checked={useTemplate}
              onChange={() => setUseTemplate(!useTemplate)}
              className={`mt-1 h-4 w-4 rounded ${
                isDark
                  ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                  : "bg-indigo-100/50 text-indigo-600 border-indigo-300/50"
              }`}
            />
            <div className="ml-3">
              <label
                htmlFor="useTemplate"
                className={`font-medium ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Use a schedule template
              </label>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Create this schedule based on a saved template
              </p>
            </div>
          </div>

          {useTemplate && (
            <div className="mt-3">
              <label
                htmlFor="templateId"
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Select Template
              </label>
              <div className="relative">
                <Target
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  }`}
                />
                <select
                  id="templateId"
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border appearance-none transition-all duration-300
                    ${
                      isDark
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                        : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
                    }`}
                >
                  <option value="">Select a template</option>
                  {templates.map((template) => (
                    <option
                      key={template._id}
                      value={template._id}
                      disabled={
                        template.dayType !== "Any" &&
                        template.dayType !== formData.dayType
                      }
                    >
                      {template.name}
                      {template.dayType !== "Any"
                        ? ` (${template.dayType} only)`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Status - only for existing schedules */}
      {initialData && (
        <div>
          <label
            htmlFor="status"
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Status
          </label>
          <div className="relative">
            <Tag
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border appearance-none transition-all duration-300
                ${
                  isDark
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
                    : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70 hover:border-indigo-500"
                }`}
            >
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      )}

      {/* Additional notes for template-based schedules */}
      {formData.templateName && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg border border-dashed ${
            isDark
              ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
              : "bg-blue-50 border-blue-300/50 text-blue-800"
          }`}
        >
          <div className="flex items-start">
            <FileText
              size={18}
              className={`mr-2 mt-0.5 flex-shrink-0 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <div>
              <p className="font-medium">
                Using template: {formData.templateName}
              </p>
              <p
                className={`mt-1 text-sm ${
                  isDark ? "text-blue-300/80" : "text-blue-700"
                }`}
              >
                This schedule will be created with all items from the template.
                You can modify items after creation.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Items preview for existing schedules */}
      {initialData && initialData.items && initialData.items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border border-dashed ${
            isDark
              ? "bg-indigo-500/10 border-indigo-500/30"
              : "bg-indigo-100/50 border-indigo-300/50"
          }`}
        >
          <h3
            className={`font-medium mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Schedule Items ({initialData.items.length})
          </h3>
          <p
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            You can edit items after saving this schedule.
          </p>
        </motion.div>
      )}

      {/* Form actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <motion.button
          type="button"
          onClick={onCancel}
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
          {initialData ? "Update Schedule" : "Create Schedule"}
        </motion.button>
      </div>
    </form>
  );
};

export default ScheduleForm;
