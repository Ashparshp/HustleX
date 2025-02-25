// src/pages/SkillsPage.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Filter, BarChart, Settings } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import useSkills from "../hooks/useSkills";
import useCategories from "../hooks/useCategories";
import SkillsGrid from "../components/Skills/SkillsGrid";
import AddSkillModal from "../components/Skills/AddSkillModal";
import SkillStats from "../components/Skills/SkillStats";
import SkillFilters from "../components/Skills/SkillFilters";
import CategoryManagement from "../components/Categories/CategoryManagement";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const SkillsPage = () => {
  const { isDark } = useTheme();
  const {
    skills,
    loading,
    error,
    fetchSkills,
    getSkillStats,
    stats,
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

  const [showAddModal, setShowAddModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Fetch statistics when showing stats panel
  useEffect(() => {
    if (showStats) {
      getSkillStats();
    }
  }, [showStats, getSkillStats]);

  // Apply filters when they change
  useEffect(() => {
    fetchSkills(selectedCategory, selectedStatus);
  }, [selectedCategory, selectedStatus, fetchSkills]);

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

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status === selectedStatus ? null : status);
  };

  // Handler for when categories are updated
  const handleCategoryChange = async () => {
    await getSkillCategories();
    await fetchCategories();
  };

  if (loading && !skills) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading skills..." />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-4 rounded-lg ${
          isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
        }`}
      >
        <h3 className="font-bold">Error loading skills</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Skills Management
        </h1>

        <div className="flex space-x-2 mt-2 sm:mt-0">
          <button
            onClick={handleToggleFilters}
            className={`px-3 py-2 rounded-lg flex items-center space-x-1 ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <Filter size={18} />
            <span>Filter</span>
          </button>

          <button
            onClick={handleToggleStats}
            className={`px-3 py-2 rounded-lg flex items-center space-x-1 ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <BarChart size={18} />
            <span>Stats</span>
          </button>

          <button
            onClick={() => setShowCategoryManagement(true)}
            className={`px-3 py-2 rounded-lg flex items-center space-x-1 ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <Settings size={18} />
            <span>Categories</span>
          </button>

          <button
            onClick={handleAddSkill}
            className={`px-3 py-2 rounded-lg flex items-center space-x-1 ${
              isDark
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            <Plus size={18} />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <SkillFilters
            categories={categories}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            onSelectCategory={handleCategoryFilter}
            onSelectStatus={handleStatusFilter}
          />
        </motion.div>
      )}

      {/* Stats Panel */}
      {showStats && stats && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <SkillStats stats={stats} isDark={isDark} />
        </motion.div>
      )}

      {/* Skills Grid */}
      <SkillsGrid
        skills={skills}
        onAddSkill={handleAddSkill}
        categories={
          categories.length > 0
            ? categories
            : defaultCategories && defaultCategories.length > 0
            ? defaultCategories.map((c) => (typeof c === "string" ? c : c.name))
            : []
        }
      />

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
  );
};

export default SkillsPage;
