import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Calendar, Clock, FileText, Plus } from "lucide-react";

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
  const [formData, setFormData] = useState({
    date: initialDate
      ? new Date(initialDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    dayType: "Weekday", // Default to Weekday
    status: "Planned", // Default to Planned
    items: [], // Will be populated from template or empty
    templateName: "",
  });
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
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Date */}
        <div>
          <label
            htmlFor="date"
            className={`block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Date*
          </label>
          <div className="relative mt-1">
            <div
              className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <Calendar size={16} />
            </div>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className={`block w-full rounded-md shadow-sm py-2 pl-10 pr-3 ${
                isDark
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                  : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              } ${errors.date ? "border-red-500" : ""}`}
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
          <div
            className={`p-4 rounded-lg ${
              isDark ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <div className="flex items-start">
              <input
                type="checkbox"
                id="useTemplate"
                checked={useTemplate}
                onChange={() => setUseTemplate(!useTemplate)}
                className={`mt-1 h-4 w-4 ${
                  isDark
                    ? "bg-gray-700 text-indigo-600 border-gray-600 focus:ring-indigo-500"
                    : "bg-white text-indigo-600 border-gray-300 focus:ring-indigo-500"
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
                  className={`block text-sm font-medium ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Select Template
                </label>
                <select
                  id="templateId"
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
                    isDark
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                      : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
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
            )}
          </div>
        )}

        {/* Status - only for existing schedules */}
        {initialData && (
          <div>
            <label
              htmlFor="status"
              className={`block text-sm font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
                isDark
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                  : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
            >
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        )}

        {/* Additional notes for template-based schedules */}
        {formData.templateName && (
          <div
            className={`p-3 rounded-lg ${
              isDark
                ? "bg-blue-900/20 text-blue-300"
                : "bg-blue-50 text-blue-800"
            }`}
          >
            <div className="flex items-start">
              <FileText size={18} className="mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">
                  Using template: {formData.templateName}
                </p>
                <p
                  className={`mt-1 text-sm ${
                    isDark ? "text-blue-300/80" : "text-blue-700"
                  }`}
                >
                  This schedule will be created with all items from the
                  template. You can modify items after creation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Items preview for existing schedules */}
        {initialData && initialData.items && initialData.items.length > 0 && (
          <div
            className={`p-4 rounded-lg ${
              isDark ? "bg-gray-700" : "bg-gray-100"
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
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              You can edit items after saving this schedule.
            </p>
          </div>
        )}

        {/* Form actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isDark
                ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {initialData ? "Update Schedule" : "Create Schedule"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ScheduleForm;
