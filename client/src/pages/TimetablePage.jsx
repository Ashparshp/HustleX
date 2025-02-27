// src/pages/TimetablePage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Calendar,
  Plus,
  Edit,
  Trash2,
  PlusCircle,
  Tag,
  X,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import useTimetable from "../hooks/useTimetable";
import useCategories from "../hooks/useCategories";
import { toast } from "react-hot-toast";

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

  // Local state
  const [activeModal, setActiveModal] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [timetableCategories, setTimetableCategories] = useState([]);
  const [showTimetableSelector, setShowTimetableSelector] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Added for forcing re-renders
  const [localCurrentTimetable, setLocalCurrentTimetable] = useState(null); // Local state for immediate UI updates
  const [timetableToDelete, setTimetableToDelete] = useState(null);

  // Log state for debugging
  useEffect(() => {
    console.log("Current timetables:", timetables);
    console.log("Current timetable:", currentTimetable);
    console.log("Current week:", currentWeek);
  }, [timetables, currentTimetable, currentWeek]);

  // Sync local current timetable with the hook's current timetable
  useEffect(() => {
    if (currentTimetable) {
      setLocalCurrentTimetable(currentTimetable);
    }
  }, [currentTimetable]);

  // Effect to specifically watch for changes to current timetable
  useEffect(() => {
    if (localCurrentTimetable) {
      console.log("Current timetable updated:", localCurrentTimetable.name);
      // Force component re-render when current timetable changes
      setRefreshKey((prev) => prev + 1);
    }
  }, [localCurrentTimetable?.id, localCurrentTimetable?.name]);

  // Fetch activities and categories when timetable changes
  useEffect(() => {
    if (currentWeek && currentWeek.activities) {
      // Extract default activities from current week
      const extractedActivities = currentWeek.activities.map((item) => ({
        name: item.activity.name,
        time: item.activity.time,
        category: item.activity.category,
      }));

      setActivities(extractedActivities);
    }

    // Fetch timetable-specific categories
    const loadCategories = async () => {
      try {
        const cats = await getTimetableCategories();
        setTimetableCategories(cats || []);
      } catch (err) {
        console.error("Failed to load timetable categories:", err);
      }
    };

    loadCategories();
  }, [currentWeek, getTimetableCategories]);

  // Modal handlers
  const closeAllModals = () => {
    setActiveModal(null);
    setEditingActivity(null);
  };

  const openAddActivityModal = async () => {
    try {
      // Force a fresh fetch of categories right before opening the modal
      const freshCategories = await getTimetableCategories();
      console.log("Fresh categories before opening modal:", freshCategories);

      // Make sure we're setting the state with the fresh data
      setTimetableCategories(freshCategories || []);

      // Wait a tiny bit to ensure state is updated before opening modal
      setTimeout(() => {
        setActiveModal("add");
        setEditingActivity(null);
      }, 50);
    } catch (err) {
      console.error("Failed to refresh categories:", err);
      setActiveModal("add");
      setEditingActivity(null);
    }
  };

  const refreshTimetableCategories = async () => {
    try {
      const cats = await getTimetableCategories();
      // Force clear and update the categories array with spread operator
      // to ensure React recognizes the state change
      setTimetableCategories([...(cats || [])]);
    } catch (err) {
      console.error("Failed to refresh timetable categories:", err);
    }
  };

  const openManageActivitiesModal = async () => {
    try {
      // Force a fresh fetch of categories right before opening the modal
      const freshCategories = await getTimetableCategories();
      console.log(
        "Fresh categories before opening manage modal:",
        freshCategories
      );

      // Make sure we're setting the state with the fresh data
      setTimetableCategories(freshCategories || []);

      // Wait a tiny bit to ensure state is updated before opening modal
      setTimeout(() => {
        setActiveModal("manage");
      }, 50);
    } catch (err) {
      console.error("Failed to refresh categories for manage modal:", err);
      // Still open the modal even if category refresh fails
      setActiveModal("manage");
    }
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

  // Activity handlers
  const handleAddActivity = async (activityData) => {
    try {
      const updatedActivities = [...activities, activityData];
      await updateDefaultActivities(updatedActivities);
      await fetchCurrentWeek();
      closeAllModals();
      toast.success("Activity added successfully");
    } catch (error) {
      console.error("Error adding activity:", error);
      toast.error("Failed to add activity");
    }
  };

  const handleManageActivities = async (updatedActivities) => {
    try {
      await updateDefaultActivities(updatedActivities);
      setActivities(updatedActivities);
      closeAllModals();
      toast.success("Activities updated successfully");
    } catch (error) {
      console.error("Error managing activities:", error);
      toast.error("Failed to update activities");
    }
  };

  const handleDeleteActivity = async (index) => {
    try {
      const updatedActivities = [...activities];
      updatedActivities.splice(index, 1);
      await updateDefaultActivities(updatedActivities);
      setActivities(updatedActivities);
      toast.success("Activity deleted successfully");
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Failed to delete activity");
    }
  };

  // Timetable management
  const handleCreateTimetable = async (data) => {
    try {
      console.log("Creating new timetable with data:", data);
      const createdTimetable = await createTimetable(data);
      console.log("Timetable created successfully:", createdTimetable);

      // Force refresh to update the dropdown
      const fetchedTimetables = await fetchTimetables();
      console.log("Fetched timetables after creation:", fetchedTimetables);

      closeAllModals();
      toast.success("Timetable created successfully");

      // Find the newly created timetable in the updated list and set it as current
      const newTimetable = fetchedTimetables.find(
        (t) =>
          t.name === data.name ||
          t.id === createdTimetable?.id ||
          t.id === createdTimetable?._id
      );

      if (newTimetable) {
        console.log(
          "Setting newly created timetable as current:",
          newTimetable
        );
        // Update both hook state and local state
        setLocalCurrentTimetable(newTimetable);

        // If this timetable is set to active, fetch its data
        if (data.isActive) {
          await fetchCurrentWeek(newTimetable.id);
        }
      }

      // Force re-render the component
      setRefreshKey((prevKey) => prevKey + 1);

      return createdTimetable;
    } catch (error) {
      console.error("Error creating timetable:", error);
      toast.error("Failed to create timetable");
      throw error;
    }
  };

  const handleUpdateTimetable = async (id, data) => {
    try {
      await updateTimetable(id, data);
      const updatedTimetables = await fetchTimetables();

      // If updating the current timetable, update the local state
      if (localCurrentTimetable && localCurrentTimetable.id === id) {
        const updatedTimetable = updatedTimetables.find((t) => t.id === id);
        if (updatedTimetable) {
          setLocalCurrentTimetable(updatedTimetable);
        }
      }

      closeAllModals();
      toast.success("Timetable updated successfully");
    } catch (error) {
      console.error("Error updating timetable:", error);
      toast.error("Failed to update timetable");
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
      if (!timetableToDelete) return;

      await deleteTimetable(timetableToDelete.id);
      await fetchTimetables();
      closeAllModals();
      toast.success("Timetable deleted successfully");
    } catch (error) {
      console.error("Error deleting timetable:", error);
      toast.error("Failed to delete timetable");
    }
  };

  const handleTimetableChange = async (id) => {
    try {
      console.log("Changing to timetable ID:", id);

      // Find the timetable in our list
      const selected = timetables.find((t) => t.id === id);
      console.log("Selected timetable:", selected);

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
      >
        <Icon className="w-4 h-4" />
        {children}
      </motion.button>
    );
  };

  // Modal wrapper component
  const ModalWrapper = ({ isOpen, onClose, children }) => {
    const modalVariants = {
      hidden: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: {
          duration: 0.2,
          ease: "easeInOut",
        },
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 15,
          stiffness: 300,
          duration: 0.3,
        },
      },
    };

    return (
      <>
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
      </>
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
      className={`py-6 relative ${isDark ? "bg-black" : "bg-white"}`}
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
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div className="relative">
              <button
                onClick={() => {
                  console.log(
                    "Showing timetable selector, current timetables:",
                    timetables
                  );
                  console.log(
                    "Local current timetable:",
                    localCurrentTimetable
                  );
                  setShowTimetableSelector(!showTimetableSelector);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border
                  ${
                    isDark
                      ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30"
                      : "bg-indigo-100 border-indigo-300 text-indigo-600 hover:bg-indigo-200"
                  }`}
              >
                <Calendar className="w-4 h-4" />
                {localCurrentTimetable
                  ? localCurrentTimetable.name
                  : "Select Timetable"}
              </button>

              {showTimetableSelector && (
                <div
                  className={`absolute mt-2 py-2 w-64 rounded-lg shadow-lg border z-50
                  ${
                    isDark
                      ? "bg-gray-900 border-gray-800"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="max-h-60 overflow-y-auto">
                    {timetables && timetables.length > 0 ? (
                      timetables.map((timetable) => (
                        <button
                          key={timetable.id}
                          onClick={() => handleTimetableChange(timetable.id)}
                          className={`w-full px-4 py-2 text-left hover:${
                            isDark ? "bg-gray-800" : "bg-gray-100"
                          } flex justify-between items-center ${
                            timetable.isActive
                              ? isDark
                                ? "bg-indigo-900/30"
                                : "bg-indigo-50"
                              : ""
                          }`}
                        >
                          <span>{timetable.name}</span>
                          {timetable.isActive && (
                            <CheckCircle
                              className={`w-4 h-4 ${
                                isDark ? "text-indigo-400" : "text-indigo-600"
                              }`}
                            />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-center text-gray-500">
                        No timetables found
                      </div>
                    )}
                  </div>

                  <div
                    className={`border-t mt-2 pt-2 px-2 ${
                      isDark ? "border-gray-800" : "border-gray-200"
                    }`}
                  >
                    <button
                      onClick={openCreateTimetableModal}
                      className={`w-full px-3 py-2 rounded-lg text-center text-sm ${
                        isDark
                          ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                          : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                      }`}
                    >
                      <PlusCircle className="w-4 h-4 inline mr-2" />
                      Create New Timetable
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {localCurrentTimetable && (
                <>
                  <button
                    onClick={() => openCreateTimetableModal("edit")}
                    className={`p-2 rounded-lg ${
                      isDark
                        ? "hover:bg-gray-900 text-gray-300"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    title="Edit Timetable"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteTimetable(localCurrentTimetable.id)
                    }
                    className={`p-2 rounded-lg ${
                      isDark
                        ? "hover:bg-gray-900 text-red-400"
                        : "hover:bg-gray-100 text-red-600"
                    }`}
                    title="Delete Timetable"
                  >
                    <Trash2 className="w-4 h-4" />
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
          >
            <div
              className={`p-3 rounded-xl ${
                isDark ? "bg-indigo-500/20" : "bg-indigo-100"
              }`}
            >
              <CheckCircle
                className={`w-6 h-6 ${
                  isDark ? "text-indigo-300" : "text-indigo-600"
                }`}
              />
            </div>
            <div className="space-y-2">
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Weekly
              </h2>
              <div
                className={`w-24 h-1 bg-gradient-to-r ${
                  isDark
                    ? "from-white to-gray-500"
                    : "from-indigo-600 to-indigo-300"
                } rounded-full`}
              />
            </div>
          </motion.div>

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
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add First Activity
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Modals */}
        {/* Add Modal */}
        <ModalWrapper isOpen={activeModal === "add"} onClose={closeAllModals}>
          <AddActivityModal
            isOpen={activeModal === "add"}
            onClose={closeAllModals}
            onSubmit={handleAddActivity}
            initialData={editingActivity}
            categories={timetableCategories}
          />
        </ModalWrapper>

        {/* Manage Modal */}
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
              activeModal === "edit" && localCurrentTimetable
                ? (data) =>
                    handleUpdateTimetable(localCurrentTimetable.id, data)
                : handleCreateTimetable
            }
            initialData={
              activeModal === "edit" && localCurrentTimetable
                ? localCurrentTimetable
                : null
            }
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
                        // Wait for backend to process
                        await new Promise((resolve) =>
                          setTimeout(resolve, 100)
                        );
                        // Force a fresh fetch
                        const freshCategories = await getTimetableCategories();
                        setTimetableCategories(freshCategories || []);
                        // Force component to re-render
                        setActiveModal((prev) => null);
                        setTimeout(
                          () => setActiveModal("categoryManagement"),
                          10
                        );
                      } catch (err) {
                        console.error("Error adding category:", err);
                      }
                    }}
                    onUpdate={async (id, data) => {
                      try {
                        await updateCategory(id, data);
                        // Wait for backend to process
                        await new Promise((resolve) =>
                          setTimeout(resolve, 100)
                        );
                        // Force a fresh fetch
                        const freshCategories = await getTimetableCategories();
                        setTimetableCategories(freshCategories || []);
                      } catch (err) {
                        console.error("Error updating category:", err);
                      }
                    }}
                    onDelete={async (id) => {
                      try {
                        await deleteCategory(id);
                        // Wait for backend to process
                        await new Promise((resolve) =>
                          setTimeout(resolve, 100)
                        );
                        // Force a fresh fetch
                        const freshCategories = await getTimetableCategories();
                        setTimetableCategories(freshCategories || []);
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
        />
      </ModalWrapper>
    </section>
  );
};

export default TimetablePage;
