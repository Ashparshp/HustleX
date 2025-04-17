import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Target,
  Tag,
  MessageSquare,
  Trophy,
  Code,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ContestForm = ({ initialData, onSubmit, onCancel, platforms = [] }) => {
  const { isDark } = useTheme();

  const [formData, setFormData] = useState(
    initialData || {
      platform: "",
      name: "",
      date: new Date().toISOString().split("T")[0],
      participated: false,
      rank: "",
      solved: "",
      totalProblems: "",
      duration: "",
      notes: "",
    }
  );

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const data = { ...initialData };
      if (data.date) {
        const dateObj = new Date(data.date);
        data.date = dateObj.toISOString().split("T")[0];
      }
      setFormData(data);
    }
  }, [initialData]);

  const validateContest = () => {
    const errors = {};
    if (!formData.platform) errors.platform = "Platform is required";
    if (!formData.name) errors.name = "Contest name is required";
    if (!formData.date) errors.date = "Date is required";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateContest();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const submissionData = {
      ...formData,
      rank: formData.rank ? parseInt(formData.rank) : null,
      solved: formData.solved ? parseInt(formData.solved) : null,
      totalProblems: formData.totalProblems
        ? parseInt(formData.totalProblems)
        : null,
      duration: formData.duration ? parseInt(formData.duration) : null,
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Platform Input */}
      <div>
        <label
          htmlFor="platform"
          className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Platform*
        </label>
        <div className="relative">
          <Target
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-purple-400" : "text-purple-600"
            }`}
          />
          <select
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border appearance-none transition-all duration-300
              ${
                isDark
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400"
                  : "bg-purple-100/50 border-purple-300/50 text-purple-600 hover:bg-purple-200/70 hover:border-purple-500"
              }`}
            required
          >
            <option value="">Select Platform</option>
            {platforms.map((platform, index) => {
              const platformName =
                typeof platform === "string" ? platform : platform.name;
              return (
                <option key={index} value={platformName}>
                  {platformName}
                </option>
              );
            })}
          </select>
        </div>
        {validationErrors.platform && (
          <p className="mt-1 text-sm text-red-500">
            {validationErrors.platform}
          </p>
        )}
      </div>

      {/* Contest Name Input */}
      <div>
        <label
          htmlFor="name"
          className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Contest Name*
        </label>
        <div className="relative">
          <Tag
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-purple-400" : "text-purple-600"
            }`}
          />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter contest name"
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
              ${
                isDark
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400"
                  : "bg-purple-100/50 border-purple-300/50 text-purple-600 hover:bg-purple-200/70 hover:border-purple-500"
              }`}
            required
          />
        </div>
        {validationErrors.name && (
          <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
        )}
      </div>

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
              isDark ? "text-purple-400" : "text-purple-600"
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
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400"
                  : "bg-purple-100/50 border-purple-300/50 text-purple-600 hover:bg-purple-200/70 hover:border-purple-500"
              }`}
            required
          />
        </div>
        {validationErrors.date && (
          <p className="mt-1 text-sm text-red-500">{validationErrors.date}</p>
        )}
      </div>

      {/* Participated Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="participated"
          name="participated"
          checked={formData.participated}
          onChange={handleChange}
          className={`h-4 w-4 rounded ${
            isDark
              ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
              : "bg-purple-100/50 text-purple-600 border-purple-300/50"
          }`}
        />
        <label
          htmlFor="participated"
          className={`ml-2 block text-sm font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Participated
        </label>
      </div>

      {/* Conditional Fields for Participation */}
      <AnimatePresence>
        {formData.participated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pl-4 border-l-2 border-purple-500 mt-2"
          >
            {/* Rank Input */}
            <div>
              <label
                htmlFor="rank"
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Rank
              </label>
              <div className="relative">
                <Trophy
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? "text-amber-400" : "text-amber-600"
                  }`}
                />
                <input
                  type="number"
                  id="rank"
                  name="rank"
                  value={formData.rank || ""}
                  onChange={handleChange}
                  min="1"
                  placeholder="Enter rank"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
                    ${
                      isDark
                        ? "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400"
                        : "bg-purple-100/50 border-purple-300/50 text-purple-600 hover:bg-purple-200/70 hover:border-purple-500"
                    }`}
                />
              </div>
            </div>

            {/* Problems Solved & Total Problems */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="solved"
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Problems Solved
                </label>
                <div className="relative">
                  <Code
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <input
                    type="number"
                    id="solved"
                    name="solved"
                    value={formData.solved || ""}
                    onChange={handleChange}
                    min="0"
                    placeholder="Solved problems"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
                      ${
                        isDark
                          ? "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400"
                          : "bg-purple-100/50 border-purple-300/50 text-purple-600 hover:bg-purple-200/70 hover:border-purple-500"
                      }`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="totalProblems"
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Total Problems
                </label>
                <div className="relative">
                  <Target
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? "text-indigo-400" : "text-indigo-600"
                    }`}
                  />
                  <input
                    type="number"
                    id="totalProblems"
                    name="totalProblems"
                    value={formData.totalProblems || ""}
                    onChange={handleChange}
                    min="0"
                    placeholder="Total problems"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
                      ${
                        isDark
                          ? "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400"
                          : "bg-purple-100/50 border-purple-300/50 text-purple-600 hover:bg-purple-200/70 hover:border-purple-500"
                      }`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duration Input */}
      <div>
        <label
          htmlFor="duration"
          className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Duration (minutes)
        </label>
        <div className="relative">
          <Clock
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-purple-400" : "text-purple-600"
            }`}
          />
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration || ""}
            onChange={handleChange}
            min="0"
            placeholder="Duration in minutes"
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
              ${
                isDark
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400"
                  : "bg-purple-100/50 border-purple-300/50 text-purple-600 hover:bg-purple-200/70 hover:border-purple-500"
              }`}
          />
        </div>
      </div>

      {/* Notes Input */}
      <div>
        <label
          htmlFor="notes"
          className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Notes
        </label>
        <div className="relative">
          <MessageSquare
            className={`absolute left-3 top-3 w-4 h-4 ${
              isDark ? "text-purple-400" : "text-purple-600"
            }`}
          />
          <textarea
            id="notes"
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            rows="3"
            placeholder="Add any additional notes about this contest..."
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
              ${
                isDark
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400"
                  : "bg-purple-100/50 border-purple-300/50 text-purple-600 hover:bg-purple-200/70 hover:border-purple-500"
              }`}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className={`px-6 py-2.5 rounded-lg border transition-all duration-300
            ${
              isDark
                ? "bg-transparent border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                : "bg-transparent border-purple-300/50 text-purple-600 hover:bg-purple-50"
            }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-6 py-2.5 rounded-lg transition-all duration-300
            ${
              isDark
                ? "bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400"
                : "bg-purple-100/50 border border-purple-300/50 text-purple-600 hover:bg-purple-200/70 hover:border-purple-500"
            }`}
        >
          {initialData ? "Update" : "Create"} Contest
        </button>
      </div>
    </form>
  );
};

export default ContestForm;
