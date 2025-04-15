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

        const data = await apiClient.get("/working-hours", { params });

        setWorkingHours(data.workingHours || []);
        setStats(data.stats || defaultStats);
        setError(null);
        return data;
      } catch (err) {
        console.error("Error fetching working hours:", err);
        setError(err.message);
        setStats(defaultStats);
        toast.error("Failed to fetch working hours data");
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
        // Ensure date is in ISO format
        const formattedData = {
          ...data,
          date: new Date(data.date).toISOString(),
        };

        const response = await apiClient.post("/working-hours", formattedData);

        // Refresh data
        await fetchWorkingHours();

        toast.success("Added");
        return response.data;
      } catch (err) {
        console.error("Error adding working hours:", err);
        toast.error(err.message || "Failed to add working hours");
        throw err;
      }
    },
    [isAuthenticated, fetchWorkingHours]
  );

  // Update existing working hours
  const updateWorkingHours = useCallback(
    async (id, data) => {
      if (!isAuthenticated) return;

      try {
        // Ensure date is in ISO format if present
        const formattedData = { ...data };
        if (formattedData.date) {
          formattedData.date = new Date(formattedData.date).toISOString();
        }

        const response = await apiClient.put(
          `/working-hours/${id}`,
          formattedData
        );

        // Refresh data
        await fetchWorkingHours();

        toast.success("Updated");
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

        toast.success("Deleted");
      } catch (err) {
        console.error("Error deleting working hours:", err);
        toast.error(err.message || "Failed to delete working hours");
        throw err;
      }
    },
    [isAuthenticated, fetchWorkingHours]
  );

  // Get statistics
  const getStats = useCallback(
    async (startDate, endDate) => {
      if (!isAuthenticated) return;

      try {
        const params = {};

        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await apiClient.get("/working-hours/stats", {
          params,
        });
        return response;
      } catch (err) {
        console.error("Error fetching stats:", err);
        toast.error("Failed to fetch working hours statistics");
        throw err;
      }
    },
    [isAuthenticated]
  );

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiClient.get("/working-hours/categories");
      setCategories(response.categories || []);
      return response.categories;
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to fetch categories");
      return [];
    }
  }, [isAuthenticated]);

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkingHours();
      fetchCategories();
    }
  }, [isAuthenticated, fetchWorkingHours, fetchCategories]);

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
    fetchCategories,
  };
};

export default useWorkingHours;
