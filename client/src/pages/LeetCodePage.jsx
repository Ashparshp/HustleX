// src/pages/LeetCodePage.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Award,
  RefreshCw,
  BarChart2,
  PieChart,
  Clock,
  Check,
  AlertCircle,
  Database,
  Play,
  Zap,
  Hash,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import useLeetCode from "../hooks/useLeetCode";
// import LeetCodeStats from "../components/LeetCode/LeetCodeStats";
import LeetCodeForm from "../components/LeetCode/LeetCodeForm";
import LeetCodeProgressChart from "../components/LeetCode/LeetCodeProgressChart";
import LeetCodeDifficultyChart from "../components/LeetCode/LeetCodeDifficultyChart";
import StatsCard from "../components/common/StatsCard";
import FilterButton from "../components/common/FilterButton";

const LeetCodePage = () => {
  const { isDark } = useTheme();
  const {
    stats,
    history,
    loading,
    error,
    updateLeetCodeStats,
    getLeetCodeHistory,
  } = useLeetCode();

  // State hooks
  const [showForm, setShowForm] = useState(false);
  const [activeVisualization, setActiveVisualization] = useState("progress");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Set last updated time from stats
  useEffect(() => {
    if (stats?.lastUpdated) {
      setLastUpdated(new Date(stats.lastUpdated));
    }
  }, [stats]);

  // Format date for display
  const formatLastUpdated = () => {
    if (!lastUpdated) return "Never";

    // Show time if today, otherwise show date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const statsDate = new Date(
      lastUpdated.getFullYear(),
      lastUpdated.getMonth(),
      lastUpdated.getDate()
    );

    if (statsDate.getTime() === today.getTime()) {
      return `Today at ${lastUpdated.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return lastUpdated.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate progress percentages
  const calculateProgress = () => {
    if (!stats)
      return {
        easy: 0,
        medium: 0,
        hard: 0,
        total: 0,
      };

    const easy = stats.totalEasy
      ? Math.round((stats.easySolved / stats.totalEasy) * 100)
      : 0;
    const medium = stats.totalMedium
      ? Math.round((stats.mediumSolved / stats.totalMedium) * 100)
      : 0;
    const hard = stats.totalHard
      ? Math.round((stats.hardSolved / stats.totalHard) * 100)
      : 0;
    const total =
      stats.totalEasy + stats.totalMedium + stats.totalHard
        ? Math.round(
            (stats.totalSolved /
              (stats.totalEasy + stats.totalMedium + stats.totalHard)) *
              100
          )
        : 0;

    return { easy, medium, hard, total };
  };

  // Handle form submission
  const handleUpdateStats = async (data) => {
    try {
      await updateLeetCodeStats(data);
      setShowForm(false);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error updating LeetCode stats:", error);
    }
  };

  // Loading state
  if (loading) {
    return <LeetCodeSkeletonLoader />;
  }

  const progress = calculateProgress();

  return (
    <section className={`py-20 relative ${isDark ? "bg-black" : "bg-white"}`}>
      {/* Background gradients */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          isDark
            ? "from-orange-900/10 via-black to-black"
            : "from-orange-100/50 via-white to-white"
        }`}
      />
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.1),transparent_50%)]"
            : "bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.15),transparent_50%)]"
        }`}
      />

      <div className="mx-auto px-4 relative z-10">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2
              className={`text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              LeetCode Progress Tracker
            </h2>
            <div
              className={`w-24 h-1 bg-gradient-to-r ${
                isDark
                  ? "from-white to-gray-500"
                  : "from-orange-600 to-orange-300"
              } mt-4 rounded-full`}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-3 items-center"
          >
            <FilterButton
              onClick={() => setShowForm(true)}
              colorClass={
                isDark
                  ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                  : "bg-orange-100/50 border-orange-300/50 text-orange-600"
              }
              hoverClass={
                isDark
                  ? "hover:bg-orange-500/20 hover:border-orange-400"
                  : "hover:bg-orange-200/70 hover:border-orange-500"
              }
            >
              <RefreshCw className="w-4 h-4" />
              Update Stats
            </FilterButton>

            <button
              onClick={() => getLeetCodeHistory()}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
              aria-label="Refresh"
            >
              <RefreshCw size={18} />
            </button>
          </motion.div>
        </div>

        {/* Error message */}
        {error && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
            }`}
          >
            <p>Error: {error}</p>
            <button
              onClick={() => getLeetCodeHistory()}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Solved"
            value={stats?.totalSolved || 0}
            icon={Check}
            color={isDark ? "text-orange-400" : "text-orange-600"}
          />
          <StatsCard
            title="Completion"
            value={`${progress.total}%`}
            icon={Zap}
            color={isDark ? "text-green-400" : "text-green-600"}
          />
          {stats?.ranking && (
            <StatsCard
              title="Current Rank"
              value={stats.ranking.toLocaleString()}
              icon={Award}
              color={isDark ? "text-amber-400" : "text-amber-600"}
            />
          )}
          {stats?.completionStreak > 0 && (
            <StatsCard
              title="Streak"
              value={`${stats.completionStreak} days`}
              icon={Play}
              color={isDark ? "text-blue-400" : "text-blue-600"}
            />
          )}
        </div>

        {/* LeetCode Stats Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Difficulty Breakdown */}
          <div
            className={`lg:col-span-2 p-6 rounded-lg border ${
              isDark
                ? "bg-black border-orange-500/30"
                : "bg-white border-orange-300/50"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-6 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Problem Difficulty Breakdown
            </h3>

            <div className="space-y-6">
              {/* Easy Problems */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isDark ? "bg-green-500" : "bg-green-500"
                      }`}
                    ></div>
                    <span
                      className={`font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Easy
                    </span>
                  </div>
                  <div
                    className={`font-medium ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {stats?.easySolved || 0} / {stats?.totalEasy || 0}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.easy}%` }}
                    transition={{ duration: 0.6 }}
                    className={`h-2 rounded-full ${
                      isDark ? "bg-green-500" : "bg-green-600"
                    }`}
                  />
                </div>
              </div>

              {/* Medium Problems */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isDark ? "bg-yellow-500" : "bg-yellow-500"
                      }`}
                    ></div>
                    <span
                      className={`font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Medium
                    </span>
                  </div>
                  <div
                    className={`font-medium ${
                      isDark ? "text-yellow-400" : "text-yellow-600"
                    }`}
                  >
                    {stats?.mediumSolved || 0} / {stats?.totalMedium || 0}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.medium}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={`h-2 rounded-full ${
                      isDark ? "bg-yellow-500" : "bg-yellow-600"
                    }`}
                  />
                </div>
              </div>

              {/* Hard Problems */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isDark ? "bg-red-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span
                      className={`font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Hard
                    </span>
                  </div>
                  <div
                    className={`font-medium ${
                      isDark ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    {stats?.hardSolved || 0} / {stats?.totalHard || 0}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.hard}%` }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`h-2 rounded-full ${
                      isDark ? "bg-red-500" : "bg-red-600"
                    }`}
                  />
                </div>
              </div>

              {/* Total Completion */}
              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isDark ? "bg-blue-500" : "bg-blue-500"
                      }`}
                    ></div>
                    <span
                      className={`font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Total Completion
                    </span>
                  </div>
                  <div
                    className={`font-medium ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {stats?.totalSolved || 0} /{" "}
                    {(stats?.totalEasy || 0) +
                      (stats?.totalMedium || 0) +
                      (stats?.totalHard || 0)}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.total}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={`h-3 rounded-full ${
                      isDark ? "bg-blue-500" : "bg-blue-600"
                    }`}
                  />
                </div>
                <div className="text-right text-sm mt-1">
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    {progress.total}% Complete
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Info and Other Stats */}
          <div
            className={`p-6 rounded-lg border ${
              isDark
                ? "bg-black border-orange-500/30"
                : "bg-white border-orange-300/50"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-6 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              User Information
            </h3>

            <div className="space-y-6">
              {stats?.username ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-lg ${
                        isDark ? "bg-gray-800" : "bg-gray-100"
                      }`}
                    >
                      <Code
                        className={
                          isDark ? "text-orange-400" : "text-orange-600"
                        }
                      />
                    </div>
                    <div>
                      <h4
                        className={`font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Username
                      </h4>
                      <p
                        className={`text-lg font-semibold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {stats.username}
                      </p>
                    </div>
                  </div>

                  {stats?.ranking && (
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-lg ${
                          isDark ? "bg-gray-800" : "bg-gray-100"
                        }`}
                      >
                        <Award
                          className={
                            isDark ? "text-amber-400" : "text-amber-600"
                          }
                        />
                      </div>
                      <div>
                        <h4
                          className={`font-medium ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Ranking
                        </h4>
                        <p
                          className={`text-lg font-semibold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {stats.ranking.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {stats?.completionStreak > 0 && (
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-lg ${
                          isDark ? "bg-gray-800" : "bg-gray-100"
                        }`}
                      >
                        <Play
                          className={isDark ? "text-blue-400" : "text-blue-600"}
                        />
                      </div>
                      <div>
                        <h4
                          className={`font-medium ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Current Streak
                        </h4>
                        <p
                          className={`text-lg font-semibold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {stats.completionStreak} days
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle
                    className={`w-12 h-12 mx-auto mb-4 ${
                      isDark ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                    No LeetCode username set
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className={`mt-4 px-4 py-2 rounded-lg ${
                      isDark
                        ? "bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
                        : "bg-orange-100/50 text-orange-600 hover:bg-orange-200/70"
                    }`}
                  >
                    Add Your Details
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div
          className={`p-6 rounded-lg border mb-8 ${
            isDark
              ? "bg-black border-orange-500/30"
              : "bg-white border-orange-300/50"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className={`text-xl font-semibold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              LeetCode Progress Visualization
            </h3>
            <div
              className={`inline-flex rounded-lg p-1 ${
                isDark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-gray-100 border border-gray-200"
              }`}
            >
              {[
                {
                  key: "progress",
                  icon: BarChart2,
                  label: "Progress Chart",
                },
                {
                  key: "difficulty",
                  icon: PieChart,
                  label: "Difficulty Distribution",
                },
              ].map((viz) => (
                <button
                  key={viz.key}
                  onClick={() => setActiveVisualization(viz.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeVisualization === viz.key
                      ? isDark
                        ? "bg-orange-500/20 text-white"
                        : "bg-orange-100 text-orange-600"
                      : isDark
                      ? "text-gray-400 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <viz.icon className="w-5 h-5" />
                  <span className="hidden md:inline">{viz.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="h-96">
            {activeVisualization === "progress" ? (
              <LeetCodeProgressChart data={history} />
            ) : (
              <LeetCodeDifficultyChart
                easy={stats?.easySolved || 0}
                medium={stats?.mediumSolved || 0}
                hard={stats?.hardSolved || 0}
              />
            )}
          </div>
        </div>

        {/* Categories Section */}
        {stats?.solvedCategories &&
          Object.keys(stats.solvedCategories).length > 0 && (
            <div
              className={`p-6 rounded-lg border mb-8 ${
                isDark
                  ? "bg-black border-orange-500/30"
                  : "bg-white border-orange-300/50"
              }`}
            >
              <h3
                className={`text-xl font-semibold mb-6 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Problem Categories
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(stats.solvedCategories).map(
                  ([category, count]) => (
                    <div
                      key={category}
                      className={`p-4 rounded-lg ${
                        isDark ? "bg-gray-900" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isDark ? "bg-gray-800" : "bg-gray-200"
                          }`}
                        >
                          <Database
                            className={`w-4 h-4 ${
                              isDark ? "text-orange-400" : "text-orange-600"
                            }`}
                          />
                        </div>
                        <div>
                          <h4
                            className={`font-medium text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {category}
                          </h4>
                          <p
                            className={`font-semibold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {count} {count === 1 ? "problem" : "problems"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {/* Update Stats Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Update LeetCode Statistics
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className={`p-1 rounded-full ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`}
                >
                  ✕
                </button>
              </div>
              <LeetCodeForm
                initialData={stats}
                onSubmit={handleUpdateStats}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Skeleton Loader
const LeetCodeSkeletonLoader = () => {
  const { isDark } = useTheme();

  return (
    <section className={`py-20 relative ${isDark ? "bg-black" : "bg-white"}`}>
      {/* Background Gradients */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          isDark
            ? "from-orange-900/10 via-black to-black"
            : "from-orange-100/50 via-white to-white"
        }`}
      />
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.1),transparent_50%)]"
            : "bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.15),transparent_50%)]"
        }`}
      />

      <div className="mx-auto px-4 max-w-6xl relative z-10">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="space-y-4">
            <div
              className={`h-8 w-64 rounded-lg ${
                isDark ? "bg-gray-800" : "bg-gray-200"
              } animate-pulse`}
            ></div>
            <div
              className={`h-4 w-36 rounded ${
                isDark ? "bg-gray-800" : "bg-gray-200"
              } animate-pulse`}
            ></div>
          </div>
          <div
            className={`h-10 w-32 rounded-lg ${
              isDark ? "bg-gray-800" : "bg-gray-200"
            } animate-pulse`}
          ></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`p-6 rounded-lg border animate-pulse ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <div
                    className={`h-4 w-20 rounded ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-8 w-16 rounded mt-2 ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <div
                  className={`h-10 w-10 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div
            className={`lg:col-span-2 p-6 rounded-lg border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`h-6 w-48 rounded mb-6 ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } animate-pulse`}
            ></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <div
                    className={`h-4 w-24 rounded ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    } animate-pulse`}
                  ></div>
                  <div
                    className={`h-4 w-16 rounded ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    } animate-pulse`}
                  ></div>
                </div>
                <div
                  className={`h-2 w-full rounded-full ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  } animate-pulse`}
                ></div>
              </div>
            ))}
          </div>

          <div
            className={`p-6 rounded-lg border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`h-6 w-48 rounded mb-6 ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } animate-pulse`}
            ></div>
            <div className="flex flex-col items-center justify-center h-40">
              <div
                className={`h-16 w-16 rounded-full mb-4 ${
                  isDark ? "bg-gray-700" : "bg-gray-200"
                } animate-pulse`}
              ></div>
              <div
                className={`h-4 w-32 rounded mb-2 ${
                  isDark ? "bg-gray-700" : "bg-gray-200"
                } animate-pulse`}
              ></div>
              <div
                className={`h-4 w-48 rounded ${
                  isDark ? "bg-gray-700" : "bg-gray-200"
                } animate-pulse`}
              ></div>
            </div>
          </div>
        </div>

        {/* Chart Section Skeleton */}
        <div
          className={`p-6 rounded-lg border mb-8 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <div
              className={`h-6 w-48 rounded ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } animate-pulse`}
            ></div>
            <div
              className={`h-10 w-48 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } animate-pulse`}
            ></div>
          </div>
          <div
            className={`h-80 w-full rounded ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            } animate-pulse`}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default LeetCodePage;
