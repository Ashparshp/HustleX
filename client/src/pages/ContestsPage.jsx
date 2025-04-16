import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Filter,
  Plus,
  RefreshCw,
  Search,
  BarChart2,
  ArrowUpDown,
  Settings,
  Award,
  Code,
  Eye,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import useContests from "../hooks/useContests";
import useCategories from "../hooks/useCategories";
import ContestCard from "../components/Contests/ContestCard";
import ContestForm from "../components/Contests/ContestForm";
import ContestStats from "../components/Contests/ContestStats";
import ContestFilters from "../components/Contests/ContestFilters";
import CategoryManagement from "../components/Categories/CategoryManagement";
import VisualizeModal from "../components/Contests/VisualizeModal";
import StatsCard from "../components/common/StatsCard";
import FilterButton from "../components/common/FilterButton";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { formatDisplayDate } from "../utils/dateUtils";

const ContestsPage = () => {
  const { isDark } = useTheme();
  const {
    contests,
    stats,
    loading,
    error,
    platforms,
    fetchContests,
    addContest,
    updateContest,
    deleteContest,
    fetchPlatforms,
  } = useContests();

  const {
    categories,
    defaultCategories,
    loading: categoriesLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
  } = useCategories("goals");

  const [showForm, setShowForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [contestToDelete, setContestToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVisualization, setActiveVisualization] = useState("heatmap");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    platform: "",
    participated: null,
  });

  const filteredContests = useMemo(() => {
    if (!contests.length) return [];

    const filtered = contests.filter((contest) => {
      const matchesSearch =
        searchQuery === "" ||
        contest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contest.notes &&
          contest.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPlatform =
        !filters.platform || contest.platform === filters.platform;

      const matchesParticipation =
        filters.participated === null ||
        contest.participated === filters.participated;

      const contestDate = new Date(contest.date);
      const matchesDateRange =
        (!filters.startDate || contestDate >= new Date(filters.startDate)) &&
        (!filters.endDate || contestDate <= new Date(filters.endDate));

      return (
        matchesSearch &&
        matchesPlatform &&
        matchesParticipation &&
        matchesDateRange
      );
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [contests, searchQuery, filters, sortOrder]);

  const handleFormSubmit = async (data) => {
    try {
      if (selectedContest) {
        await updateContest(selectedContest._id, data);
      } else {
        await addContest(data);
      }
      setShowForm(false);
      setSelectedContest(null);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedContest(null);
  };

  const handleEdit = (contest) => {
    setSelectedContest(contest);
    setShowForm(true);
  };

  const handleDelete = (contest) => {
    setContestToDelete(contest);
  };

  const confirmDelete = async () => {
    if (!contestToDelete) return;

    try {
      await deleteContest(contestToDelete._id);
      setContestToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleFilterApply = (filterData) => {
    setFilters(filterData);
    setShowFilters(false);
    fetchContests(
      filterData.startDate,
      filterData.endDate,
      filterData.platform,
      filterData.participated
    );
  };

  const clearFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      platform: "",
      participated: null,
    });
    setSearchQuery("");
    fetchContests();
  };

  const handleCategoryChange = async () => {
    await fetchPlatforms();
  };

  const getParticipationStats = () => {
    if (!stats || !stats.total) return { rate: 0, participated: 0, total: 0 };

    const participated = stats.participated || 0;
    const total = stats.total || 0;
    const rate = total > 0 ? Math.round((participated / total) * 100) : 0;

    return { rate, participated, total };
  };

  if (loading) {
    return <ContestsLoadingSkeleton />;
  }

  const participationStats = getParticipationStats();

  return (
    <section
      className={`py-10 md:py-16 lg:py-20 relative ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          isDark
            ? "from-purple-900/10 via-black to-black"
            : "from-purple-100/50 via-white to-white"
        }`}
      />
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.1),transparent_50%)]"
            : "bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_50%)]"
        }`}
      />

      <div className="mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-2xl md:text-3xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Coding Contests
            <div
              className={`w-16 md:w-24 h-1 bg-gradient-to-r ${
                isDark
                  ? "from-white to-gray-500"
                  : "from-purple-600 to-purple-300"
              } mt-2 md:mt-4 rounded-full`}
            />
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-2 md:gap-3 items-center"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  className={`w-4 h-4 md:w-5 md:h-5 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </div>
              <input
                type="text"
                placeholder="Search contests"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-40 sm:w-full pl-8 md:pl-10 pr-2 md:pr-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm border ${
                  isDark
                    ? "bg-gray-800 text-gray-200 border-gray-700 focus:border-purple-500"
                    : "bg-white text-gray-800 border-gray-300 focus:border-purple-500"
                }`}
              />
            </div>

            <FilterButton
              active={showFilters}
              onClick={() => setShowFilters(!showFilters)}
              colorClass={
                isDark
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                  : "bg-purple-100/50 border-purple-300/50 text-purple-600"
              }
              hoverClass={
                isDark
                  ? "hover:bg-purple-500/20 hover:border-purple-400"
                  : "hover:bg-purple-200/70 hover:border-purple-500"
              }
            >
              <Filter className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">Filters</span>
            </FilterButton>

            <FilterButton
              active={showStats}
              onClick={() => setShowStats(true)}
              colorClass={
                isDark
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                  : "bg-purple-100/50 border-purple-300/50 text-purple-600"
              }
              hoverClass={
                isDark
                  ? "hover:bg-purple-500/20 hover:border-purple-400"
                  : "hover:bg-purple-200/70 hover:border-purple-500"
              }
            >
              <BarChart2 className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">Stats</span>
            </FilterButton>

            <FilterButton
              active={showCategoryManagement}
              onClick={() => setShowCategoryManagement(true)}
              colorClass={
                isDark
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                  : "bg-purple-100/50 border-purple-300/50 text-purple-600"
              }
              hoverClass={
                isDark
                  ? "hover:bg-purple-500/20 hover:border-purple-400"
                  : "hover:bg-purple-200/70 hover:border-purple-500"
              }
            >
              <Settings className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">Platforms</span>
            </FilterButton>

            <FilterButton
              type="add"
              onClick={() => {
                setSelectedContest(null);
                setShowForm(true);
              }}
              colorClass={
                isDark
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                  : "bg-purple-100/50 border-purple-300/50 text-purple-600"
              }
              hoverClass={
                isDark
                  ? "hover:bg-purple-500/20 hover:border-purple-400"
                  : "hover:bg-purple-200/70 hover:border-purple-500"
              }
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">Add</span>
            </FilterButton>

            <button
              onClick={() => setShowVisualization(true)}
              className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400 flex items-center gap-1"
            >
              <Eye className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline text-xs md:text-sm">
                Visualize
              </span>
            </button>

            <button
              onClick={() => fetchContests()}
              className={`p-2 rounded-lg transition-colors shadow-sm ${
                isDark
                  ? "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "bg-indigo-100/50 hover:bg-indigo-100/70 text-indigo-600 border border-indigo-300/50"
              }`}
              aria-label="Refresh"
            >
              <RefreshCw size={14} />
            </button>
          </motion.div>
        </div>

        {(filters.startDate ||
          filters.endDate ||
          filters.platform ||
          filters.participated !== null) && (
          <div
            className={`mb-4 p-2 md:p-3 rounded-lg text-xs md:text-sm ${
              isDark ? "bg-gray-800/80" : "bg-gray-100"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <span
                  className={`font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Active Filters:
                </span>
                {filters.startDate && (
                  <span
                    className={`ml-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    From: {formatDisplayDate(filters.startDate)}
                  </span>
                )}
                {filters.endDate && (
                  <span
                    className={`ml-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    To: {formatDisplayDate(filters.endDate)}
                  </span>
                )}
                {filters.platform && (
                  <span
                    className={`ml-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Platform: {filters.platform}
                  </span>
                )}
                {filters.participated !== null && (
                  <span
                    className={`ml-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {filters.participated ? "Participated" : "Not Participated"}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className={`text-xs md:text-sm ${
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

        {error && (
          <div
            className={`p-3 md:p-4 mb-4 md:mb-6 rounded-lg text-xs md:text-sm ${
              isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
            }`}
          >
            <p>Error: {error}</p>
            <button
              onClick={() => fetchContests()}
              className={`mt-2 text-xs md:text-sm underline ${
                isDark
                  ? "text-red-300 hover:text-red-200"
                  : "text-red-700 hover:text-red-800"
              }`}
            >
              Try again
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
          <StatsCard
            title="Total Contests"
            value={participationStats.total}
            icon={Trophy}
            color={isDark ? "text-purple-400" : "text-purple-600"}
          />
          <StatsCard
            title="Participated"
            value={`${participationStats.participated} (${participationStats.rate}%)`}
            icon={Award}
            color={isDark ? "text-emerald-400" : "text-emerald-600"}
          />
          {stats && stats.best_rank && (
            <StatsCard
              title="Best Rank"
              value={stats.best_rank}
              icon={Award}
              color={isDark ? "text-blue-400" : "text-blue-600"}
            />
          )}
          {stats && stats.average_rank && (
            <StatsCard
              title="Average Rank"
              value={stats.average_rank}
              icon={Code}
              color={isDark ? "text-amber-400" : "text-amber-600"}
            />
          )}
        </div>

        <div className="mt-4 md:mt-8">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <h2
              className={`text-xl md:text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Contest Entries
              <div
                className={`w-16 md:w-24 h-1 bg-gradient-to-r ${
                  isDark
                    ? "from-white to-gray-500"
                    : "from-purple-600 to-purple-300"
                } mt-2 md:mt-4 rounded-full`}
              />
            </h2>

            <div className="flex items-center gap-1 md:gap-2">
              <ArrowUpDown
                className={`w-3 h-3 md:w-4 md:h-4 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <select
                className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-xs md:text-sm border ${
                  isDark
                    ? "bg-gray-800 text-gray-200 border-gray-700 focus:border-purple-500"
                    : "bg-white text-gray-800 border-gray-300 focus:border-purple-500"
                }`}
                onChange={(e) => setSortOrder(e.target.value)}
                value={sortOrder}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {filteredContests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-center py-8 md:py-12 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <Trophy className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 opacity-50" />
              <p className="text-sm md:text-base">No contest entries found</p>
              <button
                onClick={() => {
                  setShowForm(true);
                  setSelectedContest(null);
                }}
                className={`mt-3 md:mt-4 inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm ${
                  isDark
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                <Plus size={16} className="mr-1" />
                Add Your First Contest
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
              <AnimatePresence>
                {filteredContests.map((contest) => (
                  <ContestCard
                    key={contest._id}
                    contest={contest}
                    onEdit={() => handleEdit(contest)}
                    onDelete={() => handleDelete(contest)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className={`w-full max-w-md p-4 md:p-6 rounded-lg shadow-lg ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2
                  className={`text-lg md:text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {selectedContest ? "Edit Contest" : "Add Contest"}
                </h2>
                <button
                  onClick={handleFormCancel}
                  className={`p-1 rounded-full ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`}
                >
                  ✕
                </button>
              </div>
              <ContestForm
                initialData={selectedContest}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                platforms={platforms}
              />
            </div>
          </div>
        )}

        {showStats && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className={`w-full max-w-2xl lg:max-w-4xl p-4 md:p-6 rounded-lg shadow-lg ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold">
                  Contest Statistics
                </h2>
                <button
                  onClick={() => setShowStats(false)}
                  className={`p-1 rounded-full ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`}
                >
                  ✕
                </button>
              </div>
              <ContestStats stats={stats} />
            </div>
          </div>
        )}

        <VisualizeModal
          isOpen={showVisualization}
          onClose={() => setShowVisualization(false)}
          contests={contests}
          stats={stats}
        />

        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className={`w-full max-w-xs sm:max-w-md p-4 md:p-6 rounded-lg shadow-lg ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold">
                  Filter Contests
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className={`p-1 rounded-full ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`}
                >
                  ✕
                </button>
              </div>
              <ContestFilters
                initialFilters={filters}
                onApply={handleFilterApply}
                onCancel={() => setShowFilters(false)}
                platforms={platforms}
              />
            </div>
          </div>
        )}

        {showCategoryManagement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className={`w-full max-w-2xl lg:max-w-4xl p-4 md:p-6 rounded-lg shadow-lg ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold">
                  Manage Platforms
                </h2>
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
                type="Contest Platforms"
              />
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={contestToDelete !== null}
          onClose={() => setContestToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete Contest"
          message="Are you sure you want to delete this contest entry? This action cannot be undone."
          confirmText="Delete Entry"
          type="danger"
        />
      </div>
    </section>
  );
};

const ContestsLoadingSkeleton = () => {
  const { isDark } = useTheme();

  return (
    <section
      className={`py-10 md:py-16 lg:py-20 relative ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          isDark
            ? "from-purple-900/10 via-black to-black"
            : "from-purple-100/50 via-white to-white"
        }`}
      />
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.1),transparent_50%)]"
            : "bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_50%)]"
        }`}
      />

      <div className="px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-8">
          <div
            className={`h-6 md:h-8 w-48 md:w-64 rounded-lg ${
              isDark ? "bg-gray-800" : "bg-gray-200"
            } animate-pulse`}
          ></div>
          <div className="flex gap-2">
            <div
              className={`h-8 md:h-10 w-24 md:w-32 rounded-lg ${
                isDark ? "bg-gray-800" : "bg-gray-200"
              } animate-pulse`}
            ></div>
            <div
              className={`h-8 md:h-10 w-24 md:w-32 rounded-lg ${
                isDark ? "bg-gray-800" : "bg-gray-200"
              } animate-pulse`}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`p-3 md:p-6 rounded-lg border animate-pulse ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <div
                    className={`h-3 md:h-4 w-16 md:w-20 rounded ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-5 md:h-8 w-12 md:w-16 rounded mt-2 ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <div
                  className={`h-8 md:h-10 w-8 md:w-10 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`p-3 md:p-6 rounded-lg border mb-4 md:mb-8 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <div
              className={`h-5 md:h-6 w-32 md:w-48 rounded ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } animate-pulse`}
            ></div>
            <div
              className={`h-8 md:h-10 w-32 md:w-48 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } animate-pulse`}
            ></div>
          </div>
          <div
            className={`h-56 sm:h-64 md:h-72 lg:h-80 w-full rounded ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            } animate-pulse`}
          ></div>
        </div>

        <div className="mt-4 md:mt-8">
          <div
            className={`h-6 md:h-8 w-32 md:w-48 rounded mb-4 md:mb-8 ${
              isDark ? "bg-gray-800" : "bg-gray-200"
            } animate-pulse`}
          ></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`p-3 md:p-6 rounded-lg border h-48 md:h-64 animate-pulse ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-100 border-gray-200"
                }`}
              >
                <div className="flex justify-between mb-3 md:mb-4">
                  <div
                    className={`h-4 md:h-6 w-24 md:w-32 rounded ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-4 md:h-6 w-16 md:w-20 rounded ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <div
                  className={`h-3 md:h-4 w-full rounded mb-3 md:mb-4 ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-3 md:h-4 w-3/4 rounded mb-3 md:mb-4 ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-2 w-full rounded-full mb-4 md:mb-6 ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-16 md:h-20 w-full rounded ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContestsPage;
