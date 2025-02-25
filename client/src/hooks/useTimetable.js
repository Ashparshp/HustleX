// src/hooks/useTimetable.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const useTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyMeta, setHistoryMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalWeeks: 0,
  });
  const [stats, setStats] = useState(null);

  const { isAuthenticated } = useAuth();

  // Fetch all timetables
  const fetchTimetables = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await apiClient.get("/timetables");
      setTimetables(response.data || []);
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error fetching timetables:", err);
      setError(err.message || "Failed to fetch timetables");
      toast.error("Failed to fetch timetables");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch current week for active timetable
  const fetchCurrentWeek = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await apiClient.get("/timetables/current-week");
      setCurrentWeek(response.data || null);
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error fetching current week:", err);
      setError(err.message || "Failed to fetch current week");
      toast.error("Failed to fetch current week");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch specific timetable
  const fetchTimetable = useCallback(
    async (id) => {
      if (!isAuthenticated || !id) return;

      try {
        setLoading(true);
        const response = await apiClient.get(`/timetables/${id}`);
        setError(null);
        return response.data;
      } catch (err) {
        console.error("Error fetching timetable:", err);
        setError(err.message || "Failed to fetch timetable");
        toast.error("Failed to fetch timetable");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Create new timetable
  const createTimetable = useCallback(
    async (data) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.post("/timetables", data);
        await fetchTimetables();
        toast.success("Timetable created successfully");
        return response.data;
      } catch (err) {
        console.error("Error creating timetable:", err);
        toast.error(err.message || "Failed to create timetable");
        throw err;
      }
    },
    [isAuthenticated, fetchTimetables]
  );

  // Update timetable
  const updateTimetable = useCallback(
    async (id, data) => {
      if (!isAuthenticated || !id) return;

      try {
        const response = await apiClient.put(`/timetables/${id}`, data);
        await fetchTimetables();
        toast.success("Timetable updated successfully");
        return response.data;
      } catch (err) {
        console.error("Error updating timetable:", err);
        toast.error(err.message || "Failed to update timetable");
        throw err;
      }
    },
    [isAuthenticated, fetchTimetables]
  );

  // Delete timetable
  const deleteTimetable = useCallback(
    async (id) => {
      if (!isAuthenticated || !id) return;

      try {
        await apiClient.delete(`/timetables/${id}`);
        await fetchTimetables();
        toast.success("Timetable deleted successfully");
      } catch (err) {
        console.error("Error deleting timetable:", err);
        toast.error(err.message || "Failed to delete timetable");
        throw err;
      }
    },
    [isAuthenticated, fetchTimetables]
  );

  // Toggle activity status
  const toggleActivityStatus = useCallback(
    async (timetableId, activityId, dayIndex) => {
      if (!isAuthenticated || !timetableId || !activityId) return;

      try {
        const response = await apiClient.post(
          `/timetables/${timetableId}/toggle`,
          {
            activityId,
            dayIndex,
          }
        );
        setCurrentWeek(response.data || null);
        return response.data;
      } catch (err) {
        console.error("Error toggling activity status:", err);
        toast.error("Failed to update activity status");
        throw err;
      }
    },
    [isAuthenticated]
  );

  // Update default activities
  const updateDefaultActivities = useCallback(
    async (timetableId, activities) => {
      if (!isAuthenticated || !timetableId) return;

      try {
        const response = await apiClient.put(
          `/timetables/${timetableId}/activities`,
          {
            activities,
          }
        );
        setCurrentWeek(response.data.currentWeek || null);
        toast.success("Activities updated successfully");
        return response.data;
      } catch (err) {
        console.error("Error updating activities:", err);
        toast.error("Failed to update activities");
        throw err;
      }
    },
    [isAuthenticated]
  );

  // Start a new week
  const startNewWeek = useCallback(
    async (timetableId) => {
      if (!isAuthenticated || !timetableId) return;

      try {
        const response = await apiClient.post(
          `/timetables/${timetableId}/new-week`
        );
        setCurrentWeek(response.data.data || null);
        toast.success("New week started successfully");
        return response.data;
      } catch (err) {
        console.error("Error starting new week:", err);
        toast.error("Failed to start new week");
        throw err;
      }
    },
    [isAuthenticated]
  );

  // Fetch timetable history
  const fetchHistory = useCallback(
    async (timetableId, page = 1, limit = 10) => {
      if (!isAuthenticated || !timetableId) return;

      try {
        setHistoryLoading(true);
        const response = await apiClient.get(
          `/timetables/${timetableId}/history`,
          {
            params: { page, limit },
          }
        );

        setHistory(response.data.history || []);
        setHistoryMeta({
          currentPage: response.data.currentPage || 1,
          totalPages: response.data.totalPages || 1,
          totalWeeks: response.data.totalWeeks || 0,
        });

        return response.data;
      } catch (err) {
        console.error("Error fetching history:", err);
        toast.error("Failed to fetch history");
        throw err;
      } finally {
        setHistoryLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Get timetable statistics
  const getStats = useCallback(
    async (timetableId) => {
      if (!isAuthenticated || !timetableId) return;

      try {
        const response = await apiClient.get(
          `/timetables/${timetableId}/stats`
        );
        setStats(response.data.data || null);
        return response.data.data;
      } catch (err) {
        console.error("Error fetching stats:", err);
        toast.error("Failed to fetch statistics");
        throw err;
      }
    },
    [isAuthenticated]
  );

  // Fetch timetable categories
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiClient.get("/timetables/categories");
      setCategories(response.data.categories || []);
      return response.data.categories;
    } catch (err) {
      console.error("Error fetching categories:", err);
      return [];
    }
  }, [isAuthenticated]);

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchTimetables();
      fetchCurrentWeek();
      fetchCategories();
    }
  }, [isAuthenticated, fetchTimetables, fetchCurrentWeek, fetchCategories]);

  return {
    timetables,
    currentWeek,
    loading,
    error,
    categories,
    history,
    historyLoading,
    historyMeta,
    stats,
    fetchTimetables,
    fetchCurrentWeek,
    fetchTimetable,
    createTimetable,
    updateTimetable,
    deleteTimetable,
    toggleActivityStatus,
    updateDefaultActivities,
    startNewWeek,
    fetchHistory,
    getStats,
    fetchCategories,
  };
};

export default useTimetable;
