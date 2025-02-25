// src/hooks/useWorkingHours.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const defaultStats = {
  averageCompletion: 0,
  totalAchievedHours: 0,
  totalTargetHours: 0,
  moodDistribution: { Productive: 0, Normal: 0, Distracted: 0 },
  categoryBreakdown: {},
};

const useWorkingHours = () => {
  const [workingHours, setWorkingHours] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const { isAuthenticated } = useAuth();

  // Fetch working hours with optional filters
  const fetchWorkingHours = useCallback(
    async (startDate, endDate, category) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (category) params.category = category;

        const response = await apiClient.get("/working-hours", { params });

        setWorkingHours(response.workingHours || []);
        setStats(response.stats || defaultStats);
        setError(null);

        return response;
      } catch (err) {
        console.error("Error fetching working hours:", err);
        setError(err.message);
        setStats(defaultStats);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Add new working hours
  const addWorkingHours = useCallback(
    async (data) => {
      if (!isAuthenticated) return;

      try {
        // Format date to ISO string
        const formattedData = {
          ...data,
          date: new Date(data.date).toISOString(),
        };

        const response = await apiClient.post("/working-hours", formattedData);

        // Refresh data
        await fetchWorkingHours();

        toast.success("Working hours added successfully");
        return response.data;
      } catch (err) {
        console.error("Error adding working hours:", err);
        toast.error(err.message || "Failed to add working hours");
        throw err;
      }
    },
    [isAuthenticated, fetchWorkingHours]
  );

  // Update working hours
  const updateWorkingHours = useCallback(
    async (id, data) => {
      if (!isAuthenticated) return;

      try {
        // Format date to ISO string if provided
        const formattedData = {
          ...data,
        };

        if (data.date) {
          formattedData.date = new Date(data.date).toISOString();
        }

        const response = await apiClient.put(
          `/working-hours/${id}`,
          formattedData
        );

        // Refresh data
        await fetchWorkingHours();

        toast.success("Working hours updated successfully");
        return response.data;
      } catch (err) {
        console.error("Error updating working hours:", err);
        toast.error(err.message || "Failed to update working hours");
        throw err;
      }
    },
    [isAuthenticated, fetchWorkingHours]
  );

  // Delete working hours
  const deleteWorkingHours = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        await apiClient.delete(`/working-hours/${id}`);

        // Refresh data
        await fetchWorkingHours();

        toast.success("Working hours deleted successfully");
      } catch (err) {
        console.error("Error deleting working hours:", err);
        toast.error(err.message || "Failed to delete working hours");
        throw err;
      }
    },
    [isAuthenticated, fetchWorkingHours]
  );

  // Get working hours statistics
  const getStats = useCallback(
    async (startDate, endDate) => {
      if (!isAuthenticated) return defaultStats;

      try {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await apiClient.get("/working-hours/stats", {
          params,
        });
        return response.stats;
      } catch (err) {
        console.error("Error fetching stats:", err);
        toast.error("Failed to fetch statistics");
        return defaultStats;
      }
    },
    [isAuthenticated]
  );

  // Get categories
  const getCategories = useCallback(async () => {
    if (!isAuthenticated) return [];

    try {
      const response = await apiClient.get("/working-hours/categories");
      setCategories(response.categories || []);
      return response.categories;
    } catch (err) {
      console.error("Error fetching categories:", err);
      return [];
    }
  }, [isAuthenticated]);

  // Initial data loading
  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkingHours().catch(console.error);
      getCategories().catch(console.error);
    }
  }, [isAuthenticated, fetchWorkingHours, getCategories]);

  return {
    workingHours,
    stats,
    loading,
    error,
    categories,
    fetchWorkingHours,
    addWorkingHours,
    updateWorkingHours,
    deleteWorkingHours,
    getStats,
    getCategories,
  };
};

export default useWorkingHours;
