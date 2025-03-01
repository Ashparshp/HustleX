// src/components/Timetable/AddActivityModal.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Clock, Target, Layers, AlertCircle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const AddActivityModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  isLoading = false,
  isSubmitting = false,
}) => {
  const { isDark } = useTheme();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    time: "",
    category: "Core",
  });

  // Time input specific state
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [rawStartTime, setRawStartTime] = useState("");
  const [rawEndTime, setRawEndTime] = useState("");

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        time: initialData.time || "",
        category: initialData.category || "Core",
      });

      // If time exists, split it into start and end times
      if (initialData.time) {
        const [start, end] = initialData.time.split("-");
        setStartTime(start || "");
        setEndTime(end || "");
        setRawStartTime(start || "");
        setRawEndTime(end || "");
      }
    } else {
      setFormData({
        name: "",
        time: "",
        category: categories.length > 0 ? categories[0] : "Core",
      });
      setStartTime("");
      setEndTime("");
      setRawStartTime("");
      setRawEndTime("");
    }
  }, [initialData, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle time input changes for start time
  const handleStartTimeChange = (e) => {
    const rawValue = e.target.value;
    setRawStartTime(rawValue);

    // Allow empty input for better UX
    if (!rawValue) {
      setStartTime("");
      setFormData((prev) => ({ ...prev, time: endTime ? `-${endTime}` : "" }));
      return;
    }

    // Only store the raw value while typing - don't format yet
    setStartTime(rawValue);

    // Update the combined time value with raw input
    setFormData((prev) => ({
      ...prev,
      time: `${rawValue}${endTime ? `-${endTime}` : ""}`,
    }));
  };

  // Handle time input changes for end time
  const handleEndTimeChange = (e) => {
    const rawValue = e.target.value;
    setRawEndTime(rawValue);

    // Allow empty input for better UX
    if (!rawValue) {
      setEndTime("");
      setFormData((prev) => ({
        ...prev,
        time: startTime ? `${startTime}-` : "",
      }));
      return;
    }

    // Only store the raw value while typing - don't format yet
    setEndTime(rawValue);

    // Update the combined time value with raw input
    setFormData((prev) => ({
      ...prev,
      time: `${startTime ? startTime : ""}${rawValue ? `-${rawValue}` : ""}`,
    }));
  };

  // Format times when input loses focus
  const handleTimeBlur = (field) => {
    setTimeout(() => {
      // Format the time when the user finishes typing
      if (field === "start" && rawStartTime) {
        const formattedTime = formatTimeInput(rawStartTime);
        setStartTime(formattedTime);
        setFormData((prev) => ({
          ...prev,
          time: `${formattedTime}${endTime ? `-${endTime}` : ""}`,
        }));
      } else if (field === "end" && rawEndTime) {
        const formattedTime = formatTimeInput(rawEndTime);
        setEndTime(formattedTime);
        setFormData((prev) => ({
          ...prev,
          time: `${startTime ? startTime : ""}${
            formattedTime ? `-${formattedTime}` : ""
          }`,
        }));
      }
    }, 200);
  };

  // Format time input to HH:MM format, handling various input patterns
  const formatTimeInput = (input) => {
    // Remove all non-digit characters
    let digits = input.replace(/\D/g, "");

    // Special case: handle inputs like "930" to mean "9:30" not "93:0"
    if (digits.length === 3) {
      // Interpret as 1 digit hour, 2 digit minute
      const hours = digits.slice(0, 1).padStart(2, "0");
      const minutes = digits.slice(1).padStart(2, "0");

      // Validate hours and minutes
      const hoursInt = parseInt(hours);
      const minutesInt = parseInt(minutes);

      if (hoursInt > 23) return "23:00";
      if (minutesInt > 59) return `${hours}:59`;

      return `${hours}:${minutes}`;
    }

    // Handle other common time formats
    if (digits.length <= 1) {
      // Single digit treated as hour (e.g., "9" -> "09:00")
      const hours = digits.padStart(2, "0");
      return `${hours}:00`;
    } else if (digits.length === 2) {
      // Two digits could be hour or minutes depending on value
      const num = parseInt(digits);
      if (num <= 23) {
        // Likely an hour (e.g., "14" -> "14:00")
        return `${digits}:00`;
      } else if (num < 60) {
        // Likely minutes (e.g., "45" -> "00:45")
        return `00:${digits}`;
      } else {
        // Over 59, treat as invalid minutes
        return "00:59";
      }
    } else if (digits.length === 4) {
      // Four digits is standard HHMM format (e.g., "1430" -> "14:30")
      const hours = digits.slice(0, 2);
      const minutes = digits.slice(2, 4);

      // Validate hours and minutes
      const hoursInt = parseInt(hours);
      const minutesInt = parseInt(minutes);

      if (hoursInt > 23) return "23:00";
      if (minutesInt > 59) return `${hours}:59`;

      return `${hours}:${minutes}`;
    } else {
      // Truncate to hours and minutes if too long
      const hours = digits.slice(0, 2);
      const minutes = digits.slice(2, 4);

      // Validate hours and minutes
      const hoursInt = parseInt(hours);
      const minutesInt = parseInt(minutes);

      if (hoursInt > 23) return "23:00";
      if (minutesInt > 59) return `${hours}:59`;

      return `${hours}:${minutes}`;
    }
  };

  // Try to intelligently interpret time input for validation
  const validateTime = (timeStr) => {
    if (!timeStr) return false;

    // Check if we have both start and end times
    const parts = timeStr.split("-");
    if (parts.length !== 2) return false;

    // Empty parts are not valid
    if (!parts[0].trim() || !parts[1].trim()) return false;

    const [start, end] = parts;

    // Basic format check for each part
    const timePattern = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timePattern.test(start) || !timePattern.test(end)) return false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate form
    if (!formData.name.trim()) {
      setError("Activity name is required");
      return;
    }

    // Apply final formatting to any raw input
    let finalStartTime = startTime;
    let finalEndTime = endTime;

    if (rawStartTime) {
      finalStartTime = formatTimeInput(rawStartTime);
    }

    if (rawEndTime) {
      finalEndTime = formatTimeInput(rawEndTime);
    }

    // Construct the final time string
    const timeString = `${finalStartTime}-${finalEndTime}`;

    // Validate the final time string
    if (!validateTime(timeString)) {
      setError("Please enter valid start and end times (e.g., 09:00-11:30)");
      return;
    }

    try {
      setError(null);

      // Submit with properly formatted time
      const finalFormData = {
        ...formData,
        time: timeString,
      };

      await onSubmit(finalFormData);
    } catch (err) {
      setError(err.message || "Failed to save activity");
    }
  };

  // Time suggestions for quick selection (limited to 10 essential options)
  const timeSlots = [
    { label: "Morning (8-10)", start: "08:00", end: "10:00" },
    { label: "Mid-Morning (10-12)", start: "10:00", end: "12:00" },
    { label: "Lunch (12-1)", start: "12:00", end: "13:00" },
    { label: "Afternoon (1-5)", start: "13:00", end: "17:00" },
    { label: "Evening (5-8)", start: "17:00", end: "20:00" },
    { label: "30 min", start: "09:00", end: "09:30" },
    { label: "1 hour", start: "10:00", end: "11:00" },
    { label: "Work AM", start: "09:00", end: "12:00" },
    { label: "Work PM", start: "13:00", end: "17:00" },
    { label: "Workday", start: "09:00", end: "17:00" },
  ];

  const applyTimeSlot = (start, end) => {
    setStartTime(start);
    setEndTime(end);
    setRawStartTime(start);
    setRawEndTime(end);
    setFormData((prev) => ({
      ...prev,
      time: `${start}-${end}`,
    }));
  };

  if (!isOpen) return null;

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center py-2">
      <div
        className={`animate-spin rounded-full h-5 w-5 border-b-2 ${
          isDark ? "border-indigo-400" : "border-indigo-600"
        }`}
      ></div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3
          className={`text-xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {initialData ? "Edit Activity" : "Add Activity"}
        </h3>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg ${
            isDark
              ? "hover:bg-gray-800 text-gray-400"
              : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div
          className={`p-3 mb-4 rounded-lg flex items-start gap-2 ${
            isDark
              ? "bg-red-900/30 text-red-300 border border-red-900/50"
              : "bg-red-50 text-red-800 border border-red-100"
          }`}
        >
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Activity Name */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Activity Name
          </label>
          <div className="relative">
            <Target
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              } focus:ring-2 focus:border-transparent ${
                isDark ? "focus:ring-indigo-500/50" : "focus:ring-indigo-500/50"
              }`}
              placeholder="Enter activity name"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Time - Enhanced UI */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Time
          </label>

          {/* Time input with split start/end fields */}
          <div className="flex items-center gap-3 mb-2">
            <div className="relative flex-1">
              <Clock
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
              <input
                type="text"
                value={startTime}
                onChange={handleStartTimeChange}
                onBlur={() => handleTimeBlur("start")}
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:ring-2 focus:border-transparent ${
                  isDark
                    ? "focus:ring-indigo-500/50"
                    : "focus:ring-indigo-500/50"
                }`}
                placeholder="Start (e.g., 9 or 9:30)"
                disabled={isSubmitting}
              />
            </div>

            <span className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
              to
            </span>

            <div className="relative flex-1">
              <Clock
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
              <input
                type="text"
                value={endTime}
                onChange={handleEndTimeChange}
                onBlur={() => handleTimeBlur("end")}
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:ring-2 focus:border-transparent ${
                  isDark
                    ? "focus:ring-indigo-500/50"
                    : "focus:ring-indigo-500/50"
                }`}
                placeholder="End (e.g., 11 or 11:30)"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Time slot quick selections */}
          <div className="flex flex-wrap gap-2 mt-2 mb-1">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                type="button"
                onClick={() => applyTimeSlot(slot.start, slot.end)}
                className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                  isDark
                    ? "bg-indigo-900/40 border-indigo-700/60 text-indigo-300 hover:bg-indigo-800/60"
                    : "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                }`}
              >
                {slot.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                // Set custom time slots for current time rounded to nearest hour
                const now = new Date();
                const currentHour = now.getHours();
                const nextHour = (currentHour + 1) % 24;

                const startTime = `${String(currentHour).padStart(2, "0")}:00`;
                const endTime = `${String(nextHour).padStart(2, "0")}:00`;

                applyTimeSlot(startTime, endTime);
              }}
              className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                isDark
                  ? "bg-emerald-900/40 border-emerald-700/60 text-emerald-300 hover:bg-emerald-800/60"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              Current hour
            </button>
          </div>

          <div
            className={`mt-1 text-xs ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <p className="flex items-center gap-1 mb-1">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  isDark ? "bg-indigo-400" : "bg-indigo-500"
                }`}
              ></span>
              <span
                className={`font-medium ${
                  isDark ? "text-indigo-300" : "text-indigo-600"
                }`}
              >
                Format:
              </span>
              24-hour time (HH:MM-HH:MM)
            </p>
            <p className="pl-3">
              • Type just numbers like <span className="font-medium">9</span> →
              09:00, <span className="font-medium">14</span> → 14:00
            </p>
            <p className="pl-3">
              • Type hour & minutes together:{" "}
              <span className="font-medium">930</span> → 09:30,{" "}
              <span className="font-medium">1445</span> → 14:45
            </p>
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Category
          </label>
          <div className="relative">
            <Layers
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            />

            {isLoading ? (
              <div
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <LoadingSpinner />
              </div>
            ) : (
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border appearance-none ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:border-transparent ${
                  isDark
                    ? "focus:ring-indigo-500/50"
                    : "focus:ring-indigo-500/50"
                }`}
                required
                disabled={isSubmitting}
              >
                {categories && categories.length > 0 ? (
                  // Map through the provided categories
                  categories.map((category, index) => (
                    <option key={`${category}-${index}`} value={category}>
                      {category}
                    </option>
                  ))
                ) : (
                  // Default categories if none provided
                  <>
                    <option value="Career">Career</option>
                    <option value="Backend">Backend</option>
                    <option value="Core">Core</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Mobile">Mobile</option>
                  </>
                )}
              </select>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-lg border ${
              isDark
                ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting || isLoading}
            className={`px-4 py-2 rounded-lg ${
              isDark
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
                Saving...
              </span>
            ) : initialData ? (
              "Update Activity"
            ) : (
              "Add Activity"
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddActivityModal;
