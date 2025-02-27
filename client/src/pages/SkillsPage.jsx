// src/pages/SkillsPage.jsx
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Filter,
  BarChart2,
  Settings,
  RefreshCcw,
  Search,
} from "lucide-react";
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

  // Check if any modal is open to apply blur effect
  const isAnyModalOpen = showAddModal || showCategoryManagement;

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
  }, [fetchSkills]);

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
    <section className={`py-16 relative ${isDark ? "bg-black" : "bg-white"}`}>
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

      <div
        className={`w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-300 ${
          isAnyModalOpen ? "blur-sm" : ""
        }`}
      >
        {/* Page Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Skills Management
          </motion.h1>
          <div
            className={`w-32 h-1 bg-gradient-to-r ${
              isDark
                ? "from-indigo-500 to-indigo-300/70"
                : "from-indigo-600 to-indigo-300"
            } rounded-full`}
          />
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Search Input */}
          <div className="relative w-full sm:w-auto sm:min-w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                className={`w-5 h-5 ${
                  isDark ? "text-indigo-400" : "text-indigo-500"
                }`}
              />
            </div>
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border transition-colors ${
                isDark
                  ? "bg-gray-900/70 text-gray-200 border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                  : "bg-white text-gray-800 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              }`}
            />
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-2 justify-end"
          >
            <FilterButton active={showFilters} onClick={handleToggleFilters}>
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </FilterButton>

            <FilterButton active={showStats} onClick={handleToggleStats}>
              <BarChart2 className="w-4 h-4" />
              <span className="hidden sm:inline">Stats</span>
            </FilterButton>

            <FilterButton
              active={showCategoryManagement}
              onClick={() => setShowCategoryManagement(true)}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Categories</span>
            </FilterButton>

            <FilterButton type="add" onClick={handleAddSkill}>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Skill</span>
            </FilterButton>

            <button
              onClick={() => fetchSkills()}
              className={`p-2 rounded-lg transition-colors shadow-sm ${
                isDark
                  ? "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "bg-indigo-100/50 hover:bg-indigo-100/70 text-indigo-600 border border-indigo-300/50"
              }`}
              aria-label="Refresh"
            >
              <RefreshCcw size={18} />
            </button>
          </motion.div>
        </div>

        {/* Active filters */}
        {(selectedCategory || selectedStatus || searchQuery) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg border ${
              isDark
                ? "bg-gray-900/70 border-indigo-500/30"
                : "bg-white/90 border-indigo-300/50"
            } shadow-md`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 items-center">
                <span
                  className={`font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Active Filters:
                </span>
                {selectedCategory && (
                  <span
                    className={`px-2 py-1 rounded-md ${
                      isDark
                        ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
                        : "bg-indigo-100/60 text-indigo-700 border border-indigo-300/50"
                    }`}
                  >
                    Category: {selectedCategory}
                  </span>
                )}
                {selectedStatus && (
                  <span
                    className={`px-2 py-1 rounded-md ${
                      isDark
                        ? "bg-green-500/10 text-green-300 border border-green-500/30"
                        : "bg-green-100/60 text-green-700 border border-green-300/50"
                    }`}
                  >
                    Status: {selectedStatus.replace("-", " ")}
                  </span>
                )}
                {searchQuery && (
                  <span
                    className={`px-2 py-1 rounded-md ${
                      isDark
                        ? "bg-purple-500/10 text-purple-300 border border-purple-500/30"
                        : "bg-purple-100/60 text-purple-700 border border-purple-300/50"
                    }`}
                  >
                    Search: {searchQuery}
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearFilters}
                className={`text-sm px-3 py-1 rounded-lg whitespace-nowrap ${
                  isDark
                    ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                    : "bg-red-100/50 text-red-600 hover:bg-red-200/70 border border-red-300/50"
                }`}
              >
                Clear Filters
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 mb-6 rounded-lg border ${
              isDark
                ? "bg-red-900/30 text-red-300 border-red-500/30"
                : "bg-red-100/70 text-red-700 border-red-300/50"
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
          </motion.div>
        )}

        {/* Stats Panel */}
        <AnimatePresence>
          {showStats && stats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div
                className={`p-6 rounded-lg border shadow-md ${
                  isDark
                    ? "bg-gray-900/70 border-indigo-500/30"
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
              className="mb-8 overflow-hidden"
            >
              <div
                className={`p-6 rounded-lg border shadow-md ${
                  isDark
                    ? "bg-gray-900/70 border-indigo-500/30"
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
      </div>

      {/* Add Skill Modal with improved backdrop */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
          >
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={handleCloseAddModal}
            ></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-xl"
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Management Modal with improved backdrop */}
      <AnimatePresence>
        {showCategoryManagement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
          >
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowCategoryManagement(false)}
            ></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative w-full max-w-4xl p-6 rounded-lg shadow-xl border ${
                isDark
                  ? "bg-gray-900 border-indigo-500/30"
                  : "bg-white border-indigo-300/50"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Manage Categories
                </h2>
                <button
                  onClick={() => setShowCategoryManagement(false)}
                  className={`p-2 rounded-full transition-colors ${
                    isDark
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-200 text-gray-500"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SkillsPage;
