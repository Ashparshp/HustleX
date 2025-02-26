// src/pages/SkillsPage.jsx
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Filter, BarChart2, Settings, RefreshCcw } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import useSkills from "../hooks/useSkills";
import useCategories from "../hooks/useCategories";
import SkillsGrid from "../components/Skills/SkillsGrid";
import AddSkillModal from "../components/Skills/AddSkillModal";
import SkillStats from "../components/Skills/SkillStats";
import SkillFilters from "../components/Skills/SkillFilters";
import CategoryManagement from "../components/Categories/CategoryManagement";
import FilterButton from "../components/common/FilterButton";
import LoadingSkillsSkeleton from "../components/Skills/LoadingSkillsSkeleton";

const SkillsPage = () => {
  const { isDark } = useTheme();
  const {
    skills,
    loading,
    error,
    stats,
    fetchSkills,
    getSkillStats,
    getSkillCategories,
  } = useSkills();

  const {
    categories,
    defaultCategories,
    loading: categoriesLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
  } = useCategories("skills");

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Modal and panel states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);

  // Filter skills based on category, status, and search query
  const filteredSkills = useMemo(() => {
    if (!skills) return {};

    return Object.entries(skills).reduce(
      (filteredCategories, [category, categorySkills]) => {
        // Filter by category if selected
        if (selectedCategory && category !== selectedCategory) {
          return filteredCategories;
        }

        // Filter skills within the category
        const filteredSkillsInCategory = categorySkills.filter((skill) => {
          // Filter by status
          const statusMatch =
            !selectedStatus || skill.status === selectedStatus;

          // Filter by search query
          const searchMatch =
            !searchQuery ||
            skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (skill.description &&
              skill.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()));

          return statusMatch && searchMatch;
        });

        // Only add category if it has skills after filtering
        if (filteredSkillsInCategory.length > 0) {
          filteredCategories[category] = filteredSkillsInCategory;
        }

        return filteredCategories;
      },
      {}
    );
  }, [skills, selectedCategory, selectedStatus, searchQuery]);

  // Fetch statistics when showing stats panel
  useEffect(() => {
    if (showStats) {
      getSkillStats();
    }
  }, [showStats, getSkillStats]);

  // Fetch skills when filters change
  useEffect(() => {
    fetchSkills();
  }, []);

  // Handlers for various actions
  const handleAddSkill = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleToggleStats = () => {
    setShowStats(!showStats);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Category and status filter handlers
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status === selectedStatus ? null : status);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedStatus(null);
    setSearchQuery("");
  };

  // Handler for when categories are updated
  const handleCategoryChange = async () => {
    await getSkillCategories();
    await fetchCategories();
  };

  // Loading Skeleton
  if (loading && !skills) {
    return <LoadingSkillsSkeleton />;
  }

  return (
    <section className={`py-20 relative ${isDark ? "bg-black" : "bg-white"}`}>
      {/* Background gradients */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          isDark
            ? "from-indigo-900/10 via-black to-black"
            : "from-indigo-100/50 via-white to-white"
        }`}
      />
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]"
            : "bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]"
        }`}
      />

      <div className="mx-auto px-4 max-w-6xl relative z-10">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Skills Management
            <div
              className={`w-24 h-1 bg-gradient-to-r ${
                isDark
                  ? "from-white to-gray-500"
                  : "from-indigo-600 to-indigo-300"
              } mt-4 rounded-full`}
            />
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-3 items-center"
          >
            {/* Filters Button */}
            <FilterButton active={showFilters} onClick={handleToggleFilters}>
              <Filter className="w-4 h-4" />
              Filter
            </FilterButton>

            {/* Stats Button */}
            <FilterButton active={showStats} onClick={handleToggleStats}>
              <BarChart2 className="w-4 h-4" />
              Stats
            </FilterButton>

            {/* Categories Button */}
            <FilterButton
              active={showCategoryManagement}
              onClick={() => setShowCategoryManagement(true)}
            >
              <Settings className="w-4 h-4" />
              Categories
            </FilterButton>

            {/* Add Skill Button */}
            <FilterButton type="add" onClick={handleAddSkill}>
              <Plus className="w-4 h-4" />
              Add Skill
            </FilterButton>

            {/* Refresh Button */}
            <button
              onClick={() => fetchSkills()}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
              aria-label="Refresh"
            >
              <RefreshCcw size={18} />
            </button>
          </motion.div>
        </div>

        {/* Active filters */}
        {(selectedCategory || selectedStatus || searchQuery) && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              isDark ? "bg-gray-800/80" : "bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span
                  className={`font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Active Filters:
                </span>
                {selectedCategory && (
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      isDark
                        ? "bg-indigo-500/20 text-indigo-300"
                        : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    Category: {selectedCategory}
                  </span>
                )}
                {selectedStatus && (
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      isDark
                        ? "bg-green-500/20 text-green-300"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    Status: {selectedStatus.replace("-", " ")}
                  </span>
                )}
                {searchQuery && (
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      isDark
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    Search: {searchQuery}
                  </span>
                )}
              </div>
              <button
                onClick={handleClearFilters}
                className={`text-sm ${
                  isDark
                    ? "text-red-400 hover:text-red-300"
                    : "text-red-600 hover:text-red-700"
                }`}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
            }`}
          >
            <p>Error: {error}</p>
            <button
              onClick={() => fetchSkills()}
              className={`mt-2 text-sm underline ${
                isDark
                  ? "text-red-300 hover:text-red-200"
                  : "text-red-700 hover:text-red-800"
              }`}
            >
              Try again
            </button>
          </div>
        )}

        {/* Stats Panel */}
        <AnimatePresence>
          {showStats && stats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div
                className={`p-6 rounded-lg border ${
                  isDark
                    ? "bg-black border-indigo-500/30"
                    : "bg-white border-indigo-300/50"
                }`}
              >
                <h3
                  className={`text-xl font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Skills Statistics
                </h3>
                <SkillStats stats={stats} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div
                className={`p-6 rounded-lg border ${
                  isDark
                    ? "bg-black border-indigo-500/30"
                    : "bg-white border-indigo-300/50"
                }`}
              >
                <h3
                  className={`text-xl font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Filter Skills
                </h3>
                <SkillFilters
                  categories={
                    categories.length > 0
                      ? categories
                      : defaultCategories && defaultCategories.length > 0
                      ? defaultCategories.map((c) =>
                          typeof c === "string" ? c : c.name
                        )
                      : []
                  }
                  skills={skills}
                  selectedCategory={selectedCategory}
                  selectedStatus={selectedStatus}
                  searchQuery={searchQuery}
                  onSelectCategory={handleCategoryFilter}
                  onSelectStatus={handleStatusFilter}
                  onSearchChange={setSearchQuery}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SkillsGrid
            skills={filteredSkills}
            onAddSkill={handleAddSkill}
            categories={
              categories.length > 0
                ? categories
                : defaultCategories && defaultCategories.length > 0
                ? defaultCategories.map((c) =>
                    typeof c === "string" ? c : c.name
                  )
                : []
            }
          />
        </motion.div>

        {/* Add Skill Modal */}
        {showAddModal && (
          <AddSkillModal
            categories={
              categories.length > 0
                ? categories
                : defaultCategories && defaultCategories.length > 0
                ? defaultCategories.map((c) =>
                    typeof c === "string" ? c : c.name
                  )
                : []
            }
            onClose={handleCloseAddModal}
          />
        )}

        {/* Category Management Modal */}
        {showCategoryManagement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`w-full max-w-4xl p-6 rounded-lg shadow-lg ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manage Categories</h2>
                <button
                  onClick={() => setShowCategoryManagement(false)}
                  className={`p-1 rounded-full ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`}
                >
                  ✕
                </button>
              </div>
              <CategoryManagement
                categories={categories}
                defaultCategories={defaultCategories}
                loading={categoriesLoading}
                onAdd={async (data) => {
                  await addCategory(data);
                  handleCategoryChange();
                }}
                onUpdate={async (id, data) => {
                  await updateCategory(id, data);
                  handleCategoryChange();
                }}
                onDelete={async (id) => {
                  await deleteCategory(id);
                  handleCategoryChange();
                }}
                onRefresh={async () => {
                  await fetchCategories();
                  handleCategoryChange();
                }}
                type="skills"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsPage;
