// src/hooks/useTimetable.js
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

// This hook replaces the old useActivityTracker hook
const useTimetable = (timetableId = null) => {
  const [currentWeek, setCurrentWeek] = useState(null);
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTimetable, setActiveTimetable] = useState(null);
  const [stats, setStats] = useState(null);

  const weekCheckIntervalRef = useRef(null);
  const updateInProgress = useRef(false);

  const { isAuthenticated } = useAuth();

  // Check if we need to transition to a new week
  const checkWeekTransition = useCallback(() => {
    if (!currentWeek?.weekEndDate) return false;

    const now = new Date();
    const weekEndDate = new Date(currentWeek.weekEndDate);
    return now > weekEndDate;
  }, [currentWeek?.weekEndDate]);

  // Fetch all timetables
  const fetchTimetables = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await apiClient.get("/timetables");
      setTimetables(response.data || []);

      // Find active timetable
      const active = response.data.find((t) => t.isActive);
      if (active) {
        setActiveTimetable(active);
      }

      return response.data;
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch timetables");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch history for a specific timetable
  const fetchHistory = useCallback(
    async (id, page = 1, limit = 10) => {
      if (!isAuthenticated) return;

      try {
        const timetableIdToUse = id || timetableId || activeTimetable?.id;
        if (!timetableIdToUse) {
          throw new Error("No timetable ID specified");
        }

        const response = await apiClient.get(
          `/timetables/${timetableIdToUse}/history`,
          {
            params: { page, limit },
          }
        );
        return response;
      } catch (error) {
        console.error("Fetch history error:", error);
        toast.error("Failed to fetch timetable history");
        throw error;
      }
    },
    [isAuthenticated, timetableId, activeTimetable?.id]
  );

  // Fetch current week data
  const fetchCurrentWeek = useCallback(async () => {
    if (!isAuthenticated) return;
    if (updateInProgress.current) {
      console.log("Update already in progress, skipping fetch...");
      return;
    }

    try {
      setLoading(true);
      updateInProgress.current = true;

      // If a specific timetable ID is provided, use it
      const endpoint = timetableId
        ? `/timetables/${timetableId}`
        : "/timetables/current-week";

      const response = await apiClient.get(endpoint);

      // If a specific timetable was fetched, extract the current week
      const weekData = timetableId ? response.data.currentWeek : response.data;

      setCurrentWeek(weekData);
      setError(null);
      return weekData;
    } catch (error) {
      console.error("Error fetching current week:", error);
      setError(error.message);
      toast.error("Failed to fetch current week data");
      throw error;
    } finally {
      setLoading(false);
      updateInProgress.current = false;
    }
  }, [isAuthenticated, timetableId]);

  // Toggle activity status
  const toggleActivityStatus = useCallback(
    async (activityId, dayIndex) => {
      if (!isAuthenticated) return;
      if (updateInProgress.current) {
        console.log("Update already in progress, skipping toggle...");
        return;
      }

      const previousWeek = currentWeek;
      updateInProgress.current = true;

      try {
        // Optimistic update
        setCurrentWeek((prevWeek) => {
          if (!prevWeek) return prevWeek;
          return {
            ...prevWeek,
            activities: prevWeek.activities.map((activity) =>
              activity._id === activityId
                ? {
                    ...activity,
                    dailyStatus: activity.dailyStatus.map((status, i) =>
                      i === dayIndex ? !status : status
                    ),
                  }
                : activity
            ),
          };
        });

        // Determine which timetable ID to use
        const id = timetableId || activeTimetable?.id;
        if (!id) {
          throw new Error("No active timetable found");
        }

        const response = await apiClient.post(`/timetables/${id}/toggle`, {
          activityId,
          dayIndex,
        });

        setCurrentWeek(response.data);
        setError(null);
        return response.data;
      } catch (error) {
        // Rollback on error
        setCurrentWeek(previousWeek);
        setError(error.message);
        toast.error("Failed to update activity status");
        throw error;
      } finally {
        updateInProgress.current = false;
      }
    },
    [isAuthenticated, currentWeek, timetableId, activeTimetable?.id]
  );

  // Get statistics for a timetable
  const getStats = useCallback(
    async (id) => {
      if (!isAuthenticated) return;
      if (updateInProgress.current) {
        console.log("Update in progress, skipping stats fetch...");
        return;
      }

      try {
        updateInProgress.current = true;

        // Determine which timetable ID to use
        const timetableIdToUse = id || timetableId || activeTimetable?.id;
        if (!timetableIdToUse) {
          throw new Error("No timetable ID specified");
        }

        const response = await apiClient.get(
          `/timetables/${timetableIdToUse}/stats`
        );
        setStats(response.data);
        setError(null);
        return response.data;
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError(error.message);
        toast.error("Failed to fetch timetable statistics");
        throw error;
      } finally {
        updateInProgress.current = false;
      }
    },
    [isAuthenticated, timetableId, activeTimetable?.id]
  );

  // Create a new timetable
  const createTimetable = useCallback(
    async (timetableData) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const response = await apiClient.post("/timetables", timetableData);

        // Refresh timetables list
        await fetchTimetables();

        toast.success("Timetable created successfully");
        return response.data;
      } catch (error) {
        setError(error.message);
        toast.error(error.message || "Failed to create timetable");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchTimetables]
  );

  // Update a timetable
  const updateTimetable = useCallback(
    async (id, updates) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const response = await apiClient.put(`/timetables/${id}`, updates);

        // Refresh timetables list
        await fetchTimetables();

        // If this is the active timetable or we're updating the currently viewed timetable
        if (
          (activeTimetable && id === activeTimetable.id) ||
          id === timetableId
        ) {
          await fetchCurrentWeek();
        }

        toast.success("Timetable updated successfully");
        return response.data;
      } catch (error) {
        setError(error.message);
        toast.error(error.message || "Failed to update timetable");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [
      isAuthenticated,
      fetchTimetables,
      fetchCurrentWeek,
      activeTimetable,
      timetableId,
    ]
  );

  // Delete a timetable
  const deleteTimetable = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        await apiClient.delete(`/timetables/${id}`);

        // Refresh timetables list
        await fetchTimetables();

        // If we deleted the active timetable, fetch the new active one
        if (activeTimetable && id === activeTimetable.id) {
          await fetchCurrentWeek();
        }

        toast.success("Timetable deleted successfully");
      } catch (error) {
        setError(error.message);
        toast.error(error.message || "Failed to delete timetable");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchTimetables, fetchCurrentWeek, activeTimetable]
  );

  // Update default activities
  const updateDefaultActivities = useCallback(
    async (id, activities) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        const timetableIdToUse = id || timetableId || activeTimetable?.id;
        if (!timetableIdToUse) {
          throw new Error("No timetable ID specified");
        }

        const response = await apiClient.put(
          `/timetables/${timetableIdToUse}/activities`,
          {
            activities,
          }
        );

        // Refresh current week
        await fetchCurrentWeek();

        toast.success("Activities updated successfully");
        return response.data;
      } catch (error) {
        setError(error.message);
        toast.error(error.message || "Failed to update activities");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchCurrentWeek, timetableId, activeTimetable?.id]
  );

  // Force start a new week
  const startNewWeek = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        const timetableIdToUse = id || timetableId || activeTimetable?.id;
        if (!timetableIdToUse) {
          throw new Error("No timetable ID specified");
        }

        const response = await apiClient.post(
          `/timetables/${timetableIdToUse}/new-week`
        );

        // Refresh current week
        await fetchCurrentWeek();

        toast.success("New week started successfully");
        return response.data;
      } catch (error) {
        setError(error.message);
        toast.error(error.message || "Failed to start new week");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchCurrentWeek, timetableId, activeTimetable?.id]
  );

  // Get categories for timetables
  const getCategories = useCallback(async () => {
    if (!isAuthenticated) return [];

    try {
      const response = await apiClient.get("/timetables/categories");
      return response.categories || [];
    } catch (error) {
      console.error("Error fetching timetable categories:", error);
      return [];
    }
  }, [isAuthenticated]);

  // Set up auto-check for week transition and initial data load
  useEffect(() => {
    if (isAuthenticated) {
      // Initial data load
      fetchTimetables()
        .then(() => fetchCurrentWeek())
        .catch(console.error);

      // Set up weekly check
      const checkAndUpdateWeek = async () => {
        if (checkWeekTransition()) {
          console.log("Week transition detected, refreshing data");
          try {
            await fetchCurrentWeek();
            toast.success("New week started!");
          } catch (err) {
            console.error("Failed to update week:", err);
          }
        }
      };

      // Check immediately
      checkAndUpdateWeek();

      // Set up periodic check (every hour)
      weekCheckIntervalRef.current = setInterval(checkAndUpdateWeek, 3600000);

      return () => {
        if (weekCheckIntervalRef.current) {
          clearInterval(weekCheckIntervalRef.current);
        }
      };
    }
  }, [isAuthenticated, fetchTimetables, fetchCurrentWeek, checkWeekTransition]);

  return {
    currentWeek,
    timetables,
    activeTimetable,
    loading,
    error,
    stats,
    fetchTimetables,
    fetchHistory,
    fetchCurrentWeek,
    toggleActivityStatus,
    getStats,
    createTimetable,
    updateTimetable,
    deleteTimetable,
    updateDefaultActivities,
    startNewWeek,
    getCategories,
  };
};

export default useTimetable;
