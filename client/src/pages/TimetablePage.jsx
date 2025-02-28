// src/pages/TimetablePage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Calendar,
  Plus,
  Edit,
  Trash2,
  PlusCircle,
  Tag,
  ChevronDown,
  X,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import useTimetable from "../hooks/useTimetable";
import useCategories from "../hooks/useCategories";
import { toast } from "react-hot-toast";
import { debounce } from "lodash";

// Import all the components we'll need
import TimetableHistory from "../components/Timetable/TimetableHistory";
import TimetableStats from "../components/Timetable/TimetableStats";
import AddActivityModal from "../components/Timetable/AddActivityModal";
import SkeletonTimetable from "../components/Timetable/SkeletonTimetable";
import TimetableTable from "../components/Timetable/TimetableTable";
import TimeBlockHighlight from "../components/Timetable/TimeBlockHighlight";
import CollapsibleTimetableButtons from "../components/Timetable/CollapsibleTimetableButtons";
import CreateTimetableModal from "../components/Timetable/CreateTimetableModal";
import CategoryManagement from "../components/Categories/CategoryManagement";
import TimetableError from "../components/Timetable/TimetableError";
import ManageActivitiesModal from "../components/Timetable/ManageActivitiesModal";
import DeleteTimetableModal from "../components/Timetable/DeleteTimetableModal";

const TimetablePage = () => {
  const { isDark } = useTheme();
  const {
    timetables,
    currentTimetable,
    currentWeek,
    loading,
    error,
    fetchTimetables,
    createTimetable,
    updateTimetable,
    deleteTimetable,
    fetchCurrentWeek,
    toggleActivityStatus,
    fetchHistory,
    getStats,
    getCategories: getTimetableCategories,
    updateDefaultActivities,
  } = useTimetable();

  const {
    categories,
    defaultCategories,
    loading: categoriesLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
  } = useCategories("timetable");

  const [activeModal, setActiveModal] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [timetableCategories, setTimetableCategories] = useState([]);
  const [showTimetableSelector, setShowTimetableSelector] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [localCurrentTimetable, setLocalCurrentTimetable] = useState(null);
  const [timetableToDelete, setTimetableToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);

  // Debounced refresh function to prevent multiple refreshes
  const debouncedRefresh = useCallback(
    debounce(() => {
      setRefreshKey((prev) => prev + 1);
    }, 300),
    []
  );

  useEffect(() => {
    if (currentTimetable) {
      setLocalCurrentTimetable(currentTimetable);
    }
  }, [currentTimetable]);

  // Optimized to only update on ID changes
  useEffect(() => {
    if (localCurrentTimetable) {
      debouncedRefresh();
    }
  }, [localCurrentTimetable?.id, debouncedRefresh]);

  useEffect(() => {
    if (currentWeek && currentWeek.activities) {
      const extractedActivities = currentWeek.activities.map((item) => ({
        name: item.activity.name,
        time: item.activity.time,
        category: item.activity.category,
      }));

      setActivities(extractedActivities);
    }
  }, [currentWeek]);

  // Pre-fetch categories when component mounts or timetable changes
  useEffect(() => {
    if (currentTimetable) {
      // Set initial empty array to prevent undefined errors
      setTimetableCategories([]);
      setIsCategoryLoading(true);

      getTimetableCategories()
        .then((categories) => {
          setTimetableCategories(categories || []);
          setIsCategoryLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load categories:", err);
          setIsCategoryLoading(false);
        });
    }
  }, [currentTimetable, getTimetableCategories]);

  // Optional: Periodically refresh categories in the background
  useEffect(() => {
    // Create a function to periodically refresh categories in the background
    const refreshCategoriesInBackground = async () => {
      if (!activeModal) {
        // Only refresh when no modal is open
        try {
          const categories = await getTimetableCategories();
          if (categories && categories.length > 0) {
            setTimetableCategories(categories);
          }
        } catch (err) {
          console.error("Background category refresh failed:", err);
        }
      }
    };

    // Set up interval (every 5 minutes)
    const intervalId = setInterval(refreshCategoriesInBackground, 300000);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [getTimetableCategories, activeModal]);

  const closeAllModals = () => {
    setActiveModal(null);
    setEditingActivity(null);
  };

  // Optimized modal opening function - no longer fetches on click
  const openAddActivityModal = () => {
    // Just open modal immediately without fetching
    setActiveModal("add");
    setEditingActivity(null);
  };

  // Optimized categories refresh function
  const refreshTimetableCategories = async () => {
    try {
      setIsCategoryLoading(true);
      const cats = await getTimetableCategories();
      setTimetableCategories((prevCats) => [...(cats || [])]);
      setIsCategoryLoading(false);
    } catch (err) {
      console.error("Failed to refresh timetable categories:", err);
      setIsCategoryLoading(false);
    }
  };

  // Optimized manage activities modal opening - no longer fetches on click
  const openManageActivitiesModal = () => {
    // Open modal immediately
    setActiveModal("manage");
  };

  const openHistoryModal = () => {
    setActiveModal("history");
  };

  const openStatsModal = async () => {
    try {
      const statsData = await getStats();
      setStats(statsData);
      setActiveModal("stats");
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const openCreateTimetableModal = (mode) => {
    setActiveModal(mode === "edit" ? "editTimetable" : "createTimetable");
  };

  const openCategoryManagementModal = () => {
    setActiveModal("categoryManagement");
  };

  // UPDATED: Fixed handleAddActivity to prevent blinking
  const handleAddActivity = async (activityData) => {
    try {
      setIsSubmitting(true);

      // 1. Close the modal first for a smoother user experience
      closeAllModals();

      // 2. Process the update in the background after modal is closed
      const updatedActivities = [...activities, activityData];
      await updateDefaultActivities(updatedActivities, { silent: true });

      // 3. Show success toast after both modal is closed and update is complete
      toast.success("Activity added successfully");

      // 4. Refresh the data in the background - no need to await this
      fetchCurrentWeek().catch((err) => {
        console.error("Error refreshing week data:", err);
      });
    } catch (error) {
      console.error("Error adding activity:", error);
      toast.error("Failed to add activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  // UPDATED: Fixed handleManageActivities to prevent blinking
  const handleManageActivities = async (updatedActivities) => {
    try {
      setIsSubmitting(true);

      // Close modal first
      closeAllModals();

      // Then do data updates
      await updateDefaultActivities(updatedActivities, { silent: true });
      setActivities(updatedActivities);

      // Show toast after everything is done
      toast.success("Activities updated successfully");

      // Refresh data in background
      fetchCurrentWeek().catch((err) => {
        console.error("Error refreshing week data:", err);
      });
    } catch (error) {
      console.error("Error managing activities:", error);
      toast.error("Failed to update activities");
    } finally {
      setIsSubmitting(false);
    }
  };

  // UPDATED: Fixed handleDeleteActivity to follow the same pattern
  const handleDeleteActivity = async (index) => {
    try {
      setIsSubmitting(true);

      const updatedActivities = [...activities];
      updatedActivities.splice(index, 1);

      // Use silent:true to prevent the default toast notification
      await updateDefaultActivities(updatedActivities, { silent: true });
      setActivities(updatedActivities);

      toast.success("Activity deleted successfully");

      // Refresh data in background
      fetchCurrentWeek().catch((err) => {
        console.error("Error refreshing week data:", err);
      });
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Failed to delete activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Optimized timetable management functions
  const handleCreateTimetable = async (data) => {
    try {
      setIsSubmitting(true);

      // Close modal first
      closeAllModals();

      const createdTimetable = await createTimetable(data);

      // Fetch updated timetables list
      const fetchedTimetables = await fetchTimetables();

      // Find the newly created timetable
      const newTimetable = fetchedTimetables.find(
        (t) => t.id === createdTimetable?.id || t.id === createdTimetable?._id
      );

      if (newTimetable) {
        // Update local state only once
        setLocalCurrentTimetable(newTimetable);

        // If this timetable is set to active, fetch its data
        if (data.isActive) {
          fetchCurrentWeek(newTimetable.id).catch((err) => {
            console.error("Error loading new timetable week:", err);
          });
        }
      }

      // Show success notification
      toast.success("Timetable created successfully");

      return createdTimetable;
    } catch (error) {
      console.error("Error creating timetable:", error);
      toast.error("Failed to create timetable");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTimetable = async (id, data) => {
    try {
      setIsSubmitting(true);

      // Close modal first
      closeAllModals();

      await updateTimetable(id, data);
      const updatedTimetables = await fetchTimetables();

      // If updating the current timetable, update the local state
      if (localCurrentTimetable && localCurrentTimetable.id === id) {
        const updatedTimetable = updatedTimetables.find((t) => t.id === id);
        if (updatedTimetable) {
          setLocalCurrentTimetable(updatedTimetable);
        }
      }

      toast.success("Timetable updated successfully");
    } catch (error) {
      console.error("Error updating timetable:", error);
      toast.error("Failed to update timetable");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTimetable = async (id) => {
    // Find the timetable to delete
    const timetableToDelete = timetables.find((t) => t.id === id);
    if (timetableToDelete) {
      setTimetableToDelete(timetableToDelete);
      setActiveModal("deleteTimetable");
    }
  };

  const confirmDeleteTimetable = async () => {
    try {
      setIsSubmitting(true);

      // Close modal first
      closeAllModals();

      if (!timetableToDelete) return;

      await deleteTimetable(timetableToDelete.id);
      await fetchTimetables();

      toast.success("Timetable deleted successfully");
    } catch (error) {
      console.error("Error deleting timetable:", error);
      toast.error("Failed to delete timetable");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimetableChange = async (id) => {
    try {
      setIsSubmitting(true);

      // Find the timetable in our list
      const selected = timetables.find((t) => t.id === id);

      if (selected) {
        // Immediately update the local current timetable for UI
        setLocalCurrentTimetable(selected);

        // If not active, make it active
        if (!selected.isActive) {
          await updateTimetable(id, { isActive: true });
        }
        // Load the current week for this timetable
        await fetchCurrentWeek(id);
        setShowTimetableSelector(false);
      }
    } catch (error) {
      console.error("Error changing timetable:", error);
      toast.error("Failed to change timetable");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Format time range for display
  const formatTimeRange = (timeRange) => {
    if (!timeRange) return "N/A";
    const times = timeRange.split("-");
    if (times.length !== 2) return "Invalid Time";
    const format = (timeStr) => {
      const [hour, minute] = timeStr.split(":").map(Number);
      if (isNaN(hour) || isNaN(minute)) return "Invalid Time";
      return new Date(1970, 0, 1, hour, minute).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };
    return `${format(times[0])} - ${format(times[1])}`;
  };

  // Style helper for categories
  const getCategoryStyle = () => {
    return isDark
      ? {
          bg: "bg-black hover:bg-gray-950",
          text: "text-gray-300",
          border: "border-gray-900",
        }
      : {
          bg: "bg-gray-50 hover:bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-200",
        };
  };

  // Activity button component
  const ActivityButton = ({ onClick, icon: Icon, children, type }) => {
    const getColorClasses = () => {
      if (type === "add") {
        return isDark
          ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border-emerald-500/40"
          : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 border-emerald-300";
      }
      return isDark
        ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30"
        : "bg-indigo-100 border-indigo-300 text-indigo-600 hover:bg-indigo-200";
    };

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border
          backdrop-blur-sm transition-all duration-300 shadow-sm ${getColorClasses()}`}
        disabled={isSubmitting}
      >
        <Icon className="w-4 h-4" />
        {children}
      </motion.button>
    );
  };

  // UPDATED: Improved modal wrapper component with better exit animations
  const ModalWrapper = ({ isOpen, onClose, children }) => {
    const modalVariants = {
      hidden: {
        opacity: 0,
        scale: 0.98,
        transition: {
          duration: 0.1, // Fast exit
        },
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          type: "tween", // Simpler animation type
          duration: 0.15,
        },
      },
    };

    // Using AnimatePresence for cleaner enter/exit animations
    return (
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm bg-black/50"
          >
            <div
              className={`relative w-full max-w-lg rounded-xl shadow-2xl border 
                ${
                  isDark
                    ? "bg-black/90 border-gray-800"
                    : "bg-white/90 border-gray-200"
                }`}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Show loading skeleton
  if (loading && !currentWeek) {
    return <SkeletonTimetable />;
  }

  // Show error state
  if (error && !loading && !currentWeek) {
    return (
      <TimetableError
        error={error}
        onRetry={() => fetchCurrentWeek()}
        retryText="Retry"
      />
    );
  }

  return (
    <section
      className={`py-6 lg:px-3 relative ${isDark ? "bg-black" : "bg-white"}`}
      key={refreshKey}
    >
      {/* Background Gradients */}
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

      <div className="mx-auto px-4 relative z-10 sm:py-8">
        {/* Timetable Selector */}
        <div className="mb-8">
          <div className="flex md:flex-row md:justify-between md:items-center gap-4">
            {/* Left Section - Title and Selector */}
            <div className="relative">
              <div className="flex items-center gap-4">
                {/* Header with Gradient Underline */}
                <div className="space-y-2">
                  <h2
                    className={`text-2xl font-bold ${
                      isDark ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Timetable
                  </h2>
                  <div
                    className={`w-24 h-1 bg-gradient-to-r ${
                      isDark
                        ? "from-white to-gray-500"
                        : "from-indigo-600 to-indigo-300"
                    } rounded-full`}
                  />
                </div>

                {/* Timetable Selector Button */}
                <button
                  onClick={() =>
                    setShowTimetableSelector(!showTimetableSelector)
                  }
                  aria-expanded={showTimetableSelector}
                  aria-controls="timetable-dropdown"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isDark
                      ? "bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 shadow-md shadow-indigo-900/20"
                      : "bg-indigo-50 border border-indigo-300/70 text-indigo-700 hover:bg-indigo-100 shadow-sm"
                  }`}
                  disabled={isSubmitting}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="truncate max-w-[120px]">
                    {localCurrentTimetable
                      ? localCurrentTimetable.name
                      : "Select Timetable"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 ml-1 transition-transform ${
                      showTimetableSelector ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Dropdown Menu */}
              {showTimetableSelector && (
                <div
                  id="timetable-dropdown"
                  className={`absolute mt-2 py-2 w-72 rounded-lg shadow-xl border z-50 ${
                    isDark
                      ? "bg-gray-900 border-gray-700 shadow-black/50"
                      : "bg-white border-gray-200 shadow-gray-200/70"
                  }`}
                >
                  {/* Dropdown Header */}
                  <div
                    className={`px-4 py-2 mb-1 border-b ${
                      isDark ? "border-gray-800" : "border-gray-100"
                    }`}
                  >
                    <h3
                      className={`font-medium ${
                        isDark ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Your Timetables
                    </h3>
                  </div>

                  {/* Timetable List */}
                  <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin">
                    {timetables && timetables.length > 0 ? (
                      timetables.map((timetable) => (
                        <button
                          key={timetable.id}
                          onClick={() => {
                            handleTimetableChange(timetable.id);
                          }}
                          className={`w-full px-4 py-2.5 text-left transition-colors ${
                            isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                          } flex justify-between items-center ${
                            timetable.isActive
                              ? isDark
                                ? "bg-indigo-900/30 text-indigo-200"
                                : "bg-indigo-50 text-indigo-700"
                              : isDark
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                          disabled={isSubmitting}
                        >
                          <span className="truncate">{timetable.name}</span>
                          {timetable.isActive && (
                            <CheckCircle
                              className={`w-4 h-4 flex-shrink-0 ml-2 ${
                                isDark ? "text-indigo-400" : "text-indigo-600"
                              }`}
                            />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center text-gray-500 italic text-sm">
                        No timetables found
                      </div>
                    )}
                  </div>

                  {/* Create New Button */}
                  <div
                    className={`border-t mt-1 pt-3 px-3 ${
                      isDark ? "border-gray-800" : "border-gray-200"
                    }`}
                  >
                    <button
                      onClick={() => {
                        openCreateTimetableModal();
                        setShowTimetableSelector(false);
                      }}
                      className={`w-full px-3 py-2.5 rounded-lg text-center text-sm font-medium transition-colors flex items-center justify-center ${
                        isDark
                          ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30"
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                      }`}
                      disabled={isSubmitting}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create New Timetable
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex items-center gap-3">
              {localCurrentTimetable && (
                <>
                  <button
                    onClick={() => openCreateTimetableModal("edit")}
                    className={`p-2.5 rounded-lg inline-flex items-center transition-colors ${
                      isDark
                        ? "bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/30"
                        : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200"
                    }`}
                    title="Edit Timetable"
                    aria-label="Edit Timetable"
                    disabled={isSubmitting}
                  >
                    <Edit className="w-4 h-4 mr-1.5" />
                    <span className="font-medium">Edit</span>
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteTimetable(localCurrentTimetable.id)
                    }
                    className={`p-2.5 rounded-lg inline-flex items-center transition-colors ${
                      isDark
                        ? "bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30"
                        : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                    }`}
                    title="Delete Timetable"
                    aria-label="Delete Timetable"
                    disabled={isSubmitting}
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    <span className="font-medium">Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {currentWeek && (
          <TimeBlockHighlight
            isDark={isDark}
            toggleActivityStatus={toggleActivityStatus}
            getCategoryStyle={getCategoryStyle}
            formatTimeRange={formatTimeRange}
            currentWeek={currentWeek}
          />
        )}

        {/* Enhanced Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2 flex-wrap justify-end"
          >
            <ActivityButton
              type="add"
              onClick={openAddActivityModal}
              icon={Plus}
            >
              Add Activity
            </ActivityButton>
            <motion.button
              onClick={openCreateTimetableModal}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium ${
                isDark
                  ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                  : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
              }`}
              disabled={isSubmitting}
            >
              <PlusCircle className="w-4 h-4" />
              New Timetable
            </motion.button>
            <CollapsibleTimetableButtons
              isDark={isDark}
              onManage={openManageActivitiesModal}
              onHistory={openHistoryModal}
              onStats={openStatsModal}
              onCategories={openCategoryManagementModal}
            />
          </motion.div>
        </div>

        {/* Main Tracker Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <div
            className={`relative rounded-xl p-6 backdrop-blur-sm border shadow-xl 
            ${
              isDark
                ? "bg-indigo-950/20 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Week Info Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    isDark ? "bg-indigo-500/20" : "bg-indigo-100"
                  }`}
                >
                  <Calendar
                    className={`w-6 h-6 ${
                      isDark ? "text-indigo-300" : "text-indigo-600"
                    }`}
                  />
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold ${
                      isDark ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Weekly Progress
                  </h3>
                  {currentWeek && (
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {formatDate(currentWeek.weekStartDate)} -{" "}
                      {formatDate(currentWeek.weekEndDate)}
                    </p>
                  )}
                </div>
              </div>
              {currentWeek && (
                <div
                  className={`px-4 py-2 rounded-xl text-sm font-medium
                  ${
                    isDark
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : "bg-indigo-100 text-indigo-600 border border-indigo-200"
                  }`}
                >
                  {currentWeek.overallCompletionRate?.toFixed(1)}% Complete
                </div>
              )}
            </div>

            {/* Activity Table */}
            {currentWeek ? (
              <TimetableTable
                currentWeek={currentWeek}
                isDark={isDark}
                toggleActivityStatus={toggleActivityStatus}
                getCategoryStyle={getCategoryStyle}
                formatTimeRange={formatTimeRange}
              />
            ) : (
              <div className="text-center py-10">
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                  No activities found. Add some activities to get started.
                </p>
                <button
                  onClick={openAddActivityModal}
                  className={`mt-4 px-4 py-2 rounded-lg ${
                    isDark
                      ? "bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
                      : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                  }`}
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add First Activity
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Modals */}
        {/* Add Activity Modal */}
        <ModalWrapper isOpen={activeModal === "add"} onClose={closeAllModals}>
          <AddActivityModal
            isOpen={activeModal === "add"}
            onClose={closeAllModals}
            onSubmit={handleAddActivity}
            initialData={editingActivity}
            categories={timetableCategories}
            isLoading={isCategoryLoading}
            isSubmitting={isSubmitting}
          />
        </ModalWrapper>

        {/* Manage Activities Modal */}
        <ModalWrapper
          isOpen={activeModal === "manage"}
          onClose={closeAllModals}
        >
          <ManageActivitiesModal
            isOpen={activeModal === "manage"}
            onClose={closeAllModals}
            activities={activities}
            onSubmit={handleManageActivities}
            onDelete={handleDeleteActivity}
            categories={timetableCategories}
            isLoading={isCategoryLoading}
            isSubmitting={isSubmitting}
          />
        </ModalWrapper>

        {/* History Modal */}
        <ModalWrapper
          isOpen={activeModal === "history"}
          onClose={closeAllModals}
        >
          <TimetableHistory
            onClose={closeAllModals}
            fetchHistory={fetchHistory}
            currentTimetable={localCurrentTimetable || currentTimetable}
          />
        </ModalWrapper>

        {/* Stats Modal */}
        <ModalWrapper isOpen={activeModal === "stats"} onClose={closeAllModals}>
          {stats && <TimetableStats stats={stats} onClose={closeAllModals} />}
        </ModalWrapper>

        {/* Create Timetable Modal */}
        <ModalWrapper
          isOpen={
            activeModal === "createTimetable" || activeModal === "editTimetable"
          }
          onClose={closeAllModals}
        >
          <CreateTimetableModal
            onClose={closeAllModals}
            onSubmit={
              activeModal === "editTimetable" && localCurrentTimetable
                ? (data) =>
                    handleUpdateTimetable(localCurrentTimetable.id, data)
                : handleCreateTimetable
            }
            initialData={
              activeModal === "editTimetable" && localCurrentTimetable
                ? localCurrentTimetable
                : null
            }
            isSubmitting={isSubmitting}
          />
        </ModalWrapper>

        {/* Category Management Modal */}
        <AnimatePresence>
          {activeModal === "categoryManagement" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
            >
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                onClick={closeAllModals}
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
                    className={`text-xl font-bold flex items-center gap-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <Tag
                      size={20}
                      className={isDark ? "text-indigo-400" : "text-indigo-600"}
                    />
                    Manage Categories
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllModals}
                    className={`p-2 rounded-full transition-colors ${
                      isDark
                        ? "hover:bg-gray-700 text-gray-400"
                        : "hover:bg-gray-200 text-gray-500"
                    }`}
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
                  <CategoryManagement
                    categories={categories}
                    defaultCategories={defaultCategories}
                    loading={categoriesLoading}
                    onAdd={async (data) => {
                      try {
                        await addCategory(data);
                        // Force a fresh fetch
                        await refreshTimetableCategories();
                      } catch (err) {
                        console.error("Error adding category:", err);
                      }
                    }}
                    onUpdate={async (id, data) => {
                      try {
                        await updateCategory(id, data);
                        // Force a fresh fetch
                        await refreshTimetableCategories();
                      } catch (err) {
                        console.error("Error updating category:", err);
                      }
                    }}
                    onDelete={async (id) => {
                      try {
                        await deleteCategory(id);
                        // Force a fresh fetch
                        await refreshTimetableCategories();
                      } catch (err) {
                        console.error("Error deleting category:", err);
                      }
                    }}
                    onRefresh={async () => {
                      await fetchCategories();
                      await refreshTimetableCategories();
                    }}
                    type="timetable"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ModalWrapper
        isOpen={activeModal === "deleteTimetable"}
        onClose={closeAllModals}
      >
        <DeleteTimetableModal
          isOpen={activeModal === "deleteTimetable"}
          onClose={closeAllModals}
          onConfirm={confirmDeleteTimetable}
          timetableName={timetableToDelete?.name || ""}
          isSubmitting={isSubmitting}
        />
      </ModalWrapper>
    </section>
  );
};

export default TimetablePage;
