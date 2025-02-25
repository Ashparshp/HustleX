// src/components/Skills/SkillFilters.jsx
import { useState } from "react";
import { Tag, Activity, Search, Clock, Award, BookOpen } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const SkillFilters = ({
  categories,
  selectedCategory,
  selectedStatus,
  onSelectCategory,
  onSelectStatus,
}) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter statuses
  const statuses = [
    { value: "completed", label: "Completed", icon: Award },
    { value: "in-progress", label: "In Progress", icon: Clock },
    { value: "upcoming", label: "Upcoming", icon: BookOpen },
  ];

  // Base styling classes
  const cardClass = `p-4 rounded-lg ${
    isDark ? "bg-gray-800" : "bg-white"
  } border ${isDark ? "border-gray-700" : "border-gray-200"}`;

  const sectionHeadingClass = `text-lg font-medium mb-4 ${
    isDark ? "text-gray-200" : "text-gray-800"
  } flex items-center gap-2`;

  const badgeClass = `px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer`;

  // Styling for selected badges
  const selectedCategoryClass = `${badgeClass} ${
    isDark ? "bg-indigo-600 text-white" : "bg-indigo-600 text-white"
  }`;

  const unselectedCategoryClass = `${badgeClass} ${
    isDark
      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`;

  const selectedStatusClass = `${badgeClass} ${
    isDark ? "bg-green-600 text-white" : "bg-green-600 text-white"
  }`;

  const unselectedStatusClass = `${badgeClass} ${
    isDark
      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`;

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // TODO: Implement search functionality - this would need to be passed up to the parent
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className={cardClass}>
        <div className={sectionHeadingClass}>
          <Search size={20} />
          Search Skills
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by skill name or description..."
            className={`w-full py-2 pl-10 pr-4 rounded-lg border ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            } focus:outline-none focus:ring-2 ${
              isDark ? "focus:ring-indigo-500/30" : "focus:ring-indigo-500/30"
            }`}
          />
          <Search
            size={18}
            className={`absolute left-3 top-2.5 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
        </div>
      </div>

      {/* Filter by Category */}
      <div className={cardClass}>
        <div className={sectionHeadingClass}>
          <Tag size={20} />
          Filter by Category
        </div>
        <div className="flex flex-wrap gap-2">
          {categories && categories.length > 0 ? (
            categories.map((category, index) => {
              const categoryName =
                typeof category === "string" ? category : category.name;
              return (
                <button
                  key={index}
                  onClick={() => onSelectCategory(categoryName)}
                  className={
                    categoryName === selectedCategory
                      ? selectedCategoryClass
                      : unselectedCategoryClass
                  }
                >
                  {categoryName}
                </button>
              );
            })
          ) : (
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No categories available
            </p>
          )}
        </div>
      </div>

      {/* Filter by Status */}
      <div className={cardClass}>
        <div className={sectionHeadingClass}>
          <Activity size={20} />
          Filter by Status
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => {
            const StatusIcon = status.icon;
            return (
              <button
                key={status.value}
                onClick={() => onSelectStatus(status.value)}
                className={
                  status.value === selectedStatus
                    ? selectedStatusClass
                    : unselectedStatusClass
                }
              >
                <div className="flex items-center gap-1.5">
                  <StatusIcon size={16} />
                  {status.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillFilters;
