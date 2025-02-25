import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Calendar } from "lucide-react";

const GoalForm = ({ initialData, onSubmit, onCancel, platforms }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    platform: "",
    name: "",
    date: "",
    participated: false,
    rank: "",
    solved: "",
    totalProblems: "",
    duration: "",
    notes: "",
  });

  // Populate form with initial data if editing
  useEffect(() => {
    if (initialData) {
      const data = { ...initialData };
      // Format date for input field
      if (data.date) {
        const dateObj = new Date(data.date);
        data.date = dateObj.toISOString().split("T")[0];
      }
      setFormData(data);
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new object to avoid validation issues
    const formattedData = {
      ...formData,
      rank: formData.rank ? parseInt(formData.rank) : null,
      solved: formData.solved ? parseInt(formData.solved) : null,
      totalProblems: formData.totalProblems
        ? parseInt(formData.totalProblems)
        : null,
      duration: formData.duration ? parseInt(formData.duration) : null,
    };

    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Platform */}
        <div>
          <label
            htmlFor="platform"
            className={`block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Platform*
          </label>
          <select
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            required
            className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
              isDark
                ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
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

        {/* Goal Name */}
        <div>
          <label
            htmlFor="name"
            className={`block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Goal Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
              isDark
                ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
          />
        </div>

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
              }`}
            />
          </div>
        </div>

        {/* Participated */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="participated"
            name="participated"
            checked={formData.participated}
            onChange={handleChange}
            className={`h-4 w-4 ${
              isDark
                ? "bg-gray-700 text-indigo-600 border-gray-600 focus:ring-indigo-500"
                : "bg-white text-indigo-600 border-gray-300 focus:ring-indigo-500"
            }`}
          />
          <label
            htmlFor="participated"
            className={`ml-2 block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Participated
          </label>
        </div>

        {/* Conditional fields - only show if participated is checked */}
        {formData.participated && (
          <div className="space-y-4 pl-4 border-l-2 border-indigo-500 mt-2">
            <div>
              <label
                htmlFor="rank"
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Rank
              </label>
              <input
                type="number"
                id="rank"
                name="rank"
                value={formData.rank || ""}
                onChange={handleChange}
                min="1"
                className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="solved"
                  className={`block text-sm font-medium ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Problems Solved
                </label>
                <input
                  type="number"
                  id="solved"
                  name="solved"
                  value={formData.solved || ""}
                  onChange={handleChange}
                  min="0"
                  className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
                    isDark
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                      : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                />
              </div>

              <div>
                <label
                  htmlFor="totalProblems"
                  className={`block text-sm font-medium ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Total Problems
                </label>
                <input
                  type="number"
                  id="totalProblems"
                  name="totalProblems"
                  value={formData.totalProblems || ""}
                  onChange={handleChange}
                  min="0"
                  className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
                    isDark
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                      : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Duration */}
        <div>
          <label
            htmlFor="duration"
            className={`block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration || ""}
            onChange={handleChange}
            min="0"
            className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
              isDark
                ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
          />
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className={`block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={formData.notes || ""}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
              isDark
                ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
            placeholder="Add any additional notes about this goal..."
          />
        </div>

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
            {initialData ? "Update Goal" : "Add Goal"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default GoalForm;
