import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Award,
  Check,
  BarChart2,
  Hash,
  AlignLeft,
  Activity,
  Save,
  X,
  Database,
  Play,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const LeetCodeForm = ({ initialData, onSubmit, onCancel }) => {
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    username: "",
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalEasy: 0,
    totalMedium: 0,
    totalHard: 0,
    ranking: "",
    solvedCategories: {},
    completionStreak: 0,
  });

  const [categories, setCategories] = useState([{ name: "", count: "" }]);

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      const preparedData = {
        ...initialData,
        ranking: initialData.ranking || "",
        username: initialData.username || "",
        completionStreak: initialData.completionStreak || 0,
      };

      setFormData(preparedData);

      if (initialData.solvedCategories) {
        const categoriesArray = Object.entries(
          initialData.solvedCategories
        ).map(([name, count]) => ({ name, count }));

        if (categoriesArray.length === 0) {
          categoriesArray.push({ name: "", count: "" });
        }

        setCategories(categoriesArray);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    let numValue = value === "" ? 0 : parseInt(value, 10);

    if (numValue < 0) numValue = 0;

    setFormData((prev) => ({
      ...prev,
      [name]: numValue,
    }));

    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }
  };

  const handleCategoryChange = (index, field, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index][field] = value;
    setCategories(updatedCategories);
  };

  const addCategory = () => {
    setCategories([...categories, { name: "", count: "" }]);
  };

  const removeCategory = (index) => {
    if (categories.length === 1) return;
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
  };

  const validateForm = () => {
    const errors = {};

    const calculatedTotal =
      formData.easySolved + formData.mediumSolved + formData.hardSolved;
    if (calculatedTotal !== formData.totalSolved) {
      errors.totalSolved = `Total solved (${formData.totalSolved}) doesn't match sum of categories (${calculatedTotal})`;
    }

    if (formData.easySolved > formData.totalEasy && formData.totalEasy > 0) {
      errors.easySolved = `Can't solve more easy problems than available (${formData.totalEasy})`;
    }

    if (
      formData.mediumSolved > formData.totalMedium &&
      formData.totalMedium > 0
    ) {
      errors.mediumSolved = `Can't solve more medium problems than available (${formData.totalMedium})`;
    }

    if (formData.hardSolved > formData.totalHard && formData.totalHard > 0) {
      errors.hardSolved = `Can't solve more hard problems than available (${formData.totalHard})`;
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const solvedCategories = {};
    categories.forEach(({ name, count }) => {
      if (name && count) {
        solvedCategories[name] = parseInt(count, 10);
      }
    });

    const submissionData = {
      ...formData,
      solvedCategories,
      ranking: formData.ranking ? parseInt(formData.ranking, 10) : null,
    };

    setIsSubmitting(true);

    try {
      await onSubmit(submissionData);
    } catch (error) {
      console.error("Error submitting LeetCode stats:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      ></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl rounded-xl shadow-lg ${
          isDark ? "bg-gray-800" : "bg-white"
        } overflow-hidden`}
      >
        <div className={`p-4 sm:p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <h2
            className={`text-xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            LeetCode Statistics
          </h2>

          <div className="max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="username"
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    LeetCode Username
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        isDark ? "text-orange-400" : "text-orange-600"
                      }`}
                    />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Your LeetCode username"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
                        ${
                          isDark
                            ? "bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:border-orange-400"
                            : "bg-orange-100/50 border-orange-300/50 text-orange-600 hover:bg-orange-200/70 hover:border-orange-500"
                        }`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="ranking"
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Current Ranking
                  </label>
                  <div className="relative">
                    <Award
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        isDark ? "text-amber-400" : "text-amber-600"
                      }`}
                    />
                    <input
                      type="number"
                      id="ranking"
                      name="ranking"
                      value={formData.ranking}
                      onChange={handleChange}
                      min="1"
                      placeholder="Your current ranking"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
                        ${
                          isDark
                            ? "bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:border-orange-400"
                            : "bg-orange-100/50 border-orange-300/50 text-orange-600 hover:bg-orange-200/70 hover:border-orange-500"
                        }`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="totalSolved"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Total Problems Solved
                  </label>
                  {validationErrors.totalSolved && (
                    <span className="text-xs text-red-500">
                      {validationErrors.totalSolved}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Check
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  />
                  <input
                    type="number"
                    id="totalSolved"
                    name="totalSolved"
                    value={formData.totalSolved}
                    onChange={handleNumericChange}
                    min="0"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
                      ${
                        isDark
                          ? "bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:border-orange-400"
                          : "bg-orange-100/50 border-orange-300/50 text-orange-600 hover:bg-orange-200/70 hover:border-orange-500"
                      } ${
                      validationErrors.totalSolved
                        ? isDark
                          ? "border-red-500"
                          : "border-red-500"
                        : ""
                    }`}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-yellow-500/10 via-red-500/10 p-4 rounded-lg border border-orange-500/20">
                <h3
                  className={`text-sm font-medium mb-3 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Problem Difficulty Breakdown
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label
                        htmlFor="easySolved"
                        className={`block text-xs font-medium ${
                          isDark ? "text-green-300" : "text-green-700"
                        }`}
                      >
                        Easy Problems
                      </label>
                      {validationErrors.easySolved && (
                        <span className="text-xs text-red-500">⚠️</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          id="easySolved"
                          name="easySolved"
                          value={formData.easySolved}
                          onChange={handleNumericChange}
                          min="0"
                          placeholder="Solved"
                          className={`w-full pl-3 pr-3 py-2 text-sm rounded-lg border transition-all duration-300
                            ${
                              isDark
                                ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-400"
                                : "bg-green-100/50 border-green-300/50 text-green-600 hover:bg-green-200/70 hover:border-green-500"
                            } ${
                            validationErrors.easySolved
                              ? isDark
                                ? "border-red-500"
                                : "border-red-500"
                              : ""
                          }`}
                        />
                        <span
                          className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                            isDark ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          solved
                        </span>
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          id="totalEasy"
                          name="totalEasy"
                          value={formData.totalEasy}
                          onChange={handleNumericChange}
                          min="0"
                          placeholder="Total"
                          className={`w-full pl-3 pr-3 py-2 text-sm rounded-lg border transition-all duration-300
                            ${
                              isDark
                                ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-400"
                                : "bg-green-100/50 border-green-300/50 text-green-600 hover:bg-green-200/70 hover:border-green-500"
                            }`}
                        />
                        <span
                          className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                            isDark ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          total
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label
                        htmlFor="mediumSolved"
                        className={`block text-xs font-medium ${
                          isDark ? "text-yellow-300" : "text-yellow-700"
                        }`}
                      >
                        Medium Problems
                      </label>
                      {validationErrors.mediumSolved && (
                        <span className="text-xs text-red-500">⚠️</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          id="mediumSolved"
                          name="mediumSolved"
                          value={formData.mediumSolved}
                          onChange={handleNumericChange}
                          min="0"
                          placeholder="Solved"
                          className={`w-full pl-3 pr-3 py-2 text-sm rounded-lg border transition-all duration-300
                            ${
                              isDark
                                ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-400"
                                : "bg-yellow-100/50 border-yellow-300/50 text-yellow-600 hover:bg-yellow-200/70 hover:border-yellow-500"
                            } ${
                            validationErrors.mediumSolved
                              ? isDark
                                ? "border-red-500"
                                : "border-red-500"
                              : ""
                          }`}
                        />
                        <span
                          className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                            isDark ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          solved
                        </span>
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          id="totalMedium"
                          name="totalMedium"
                          value={formData.totalMedium}
                          onChange={handleNumericChange}
                          min="0"
                          placeholder="Total"
                          className={`w-full pl-3 pr-3 py-2 text-sm rounded-lg border transition-all duration-300
                            ${
                              isDark
                                ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-400"
                                : "bg-yellow-100/50 border-yellow-300/50 text-yellow-600 hover:bg-yellow-200/70 hover:border-yellow-500"
                            }`}
                        />
                        <span
                          className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                            isDark ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          total
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label
                        htmlFor="hardSolved"
                        className={`block text-xs font-medium ${
                          isDark ? "text-red-300" : "text-red-700"
                        }`}
                      >
                        Hard Problems
                      </label>
                      {validationErrors.hardSolved && (
                        <span className="text-xs text-red-500">⚠️</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          id="hardSolved"
                          name="hardSolved"
                          value={formData.hardSolved}
                          onChange={handleNumericChange}
                          min="0"
                          placeholder="Solved"
                          className={`w-full pl-3 pr-3 py-2 text-sm rounded-lg border transition-all duration-300
                            ${
                              isDark
                                ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-400"
                                : "bg-red-100/50 border-red-300/50 text-red-600 hover:bg-red-200/70 hover:border-red-500"
                            } ${
                            validationErrors.hardSolved
                              ? isDark
                                ? "border-red-500"
                                : "border-red-500"
                              : ""
                          }`}
                        />
                        <span
                          className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                            isDark ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          solved
                        </span>
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          id="totalHard"
                          name="totalHard"
                          value={formData.totalHard}
                          onChange={handleNumericChange}
                          min="0"
                          placeholder="Total"
                          className={`w-full pl-3 pr-3 py-2 text-sm rounded-lg border transition-all duration-300
                            ${
                              isDark
                                ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-400"
                                : "bg-red-100/50 border-red-300/50 text-red-600 hover:bg-red-200/70 hover:border-red-500"
                            }`}
                        />
                        <span
                          className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                            isDark ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          total
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="completionStreak"
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Current Streak (days)
                </label>
                <div className="relative">
                  <Play
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <input
                    type="number"
                    id="completionStreak"
                    name="completionStreak"
                    value={formData.completionStreak}
                    onChange={handleNumericChange}
                    min="0"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-300
                      ${
                        isDark
                          ? "bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:border-orange-400"
                          : "bg-orange-100/50 border-orange-300/50 text-orange-600 hover:bg-orange-200/70 hover:border-orange-500"
                      }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Problem Categories (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={addCategory}
                    className={`text-xs px-2 py-1 rounded ${
                      isDark
                        ? "bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
                        : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                    }`}
                  >
                    + Add Category
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto p-1 pr-2">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Database
                          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                            isDark ? "text-gray-500" : "text-gray-500"
                          }`}
                        />
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) =>
                            handleCategoryChange(index, "name", e.target.value)
                          }
                          placeholder="Category name"
                          className={`w-full pl-10 pr-3 py-2 text-sm rounded-lg border ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>

                      <div className="relative w-24">
                        <input
                          type="number"
                          value={category.count}
                          onChange={(e) =>
                            handleCategoryChange(index, "count", e.target.value)
                          }
                          placeholder="Count"
                          min="0"
                          className={`w-full pl-3 pr-3 py-2 text-sm rounded-lg border ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>

                      {categories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCategory(index)}
                          className={`p-1 rounded-lg ${
                            isDark
                              ? "hover:bg-red-500/10 text-red-400"
                              : "hover:bg-red-100 text-red-600"
                          }`}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onCancel}
                  className={`px-4 sm:px-6 py-2.5 rounded-lg border transition-all duration-300
                    ${
                      isDark
                        ? "bg-transparent border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                        : "bg-transparent border-orange-300/50 text-orange-600 hover:bg-orange-50"
                    }`}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 sm:px-6 py-2.5 rounded-lg transition-all duration-300 flex items-center space-x-2
                    ${
                      isDark
                        ? "bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:border-orange-400"
                        : "bg-orange-100/50 border border-orange-300/50 text-orange-600 hover:bg-orange-200/70 hover:border-orange-500"
                    }`}
                  disabled={isSubmitting}
                >
                  <Save size={16} />
                  <span>{isSubmitting ? "Saving..." : "Update Stats"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LeetCodeForm;
