// src/hooks/useGoals.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [platforms, setPlatforms] = useState([]);

  const { isAuthenticated } = useAuth();

  // Fetch goals (previously contests) with optional filters
  const fetchGoals = useCallback(
    async (platform, participated, startDate, endDate, sort = "-date") => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const params = {};

        if (platform) params.platform = platform;
        if (participated !== undefined) params.participated = participated;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (sort) params.sort = sort;

        const response = await apiClient.get("/contests", { params });

        setGoals(response.data || []);
        setStats(response.stats || null);
        setError(null);
        return response;
      } catch (err) {
        console.error("Error fetching goals:", err);
        setError(err.message);
        toast.error("Failed to fetch goals data");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Add a new goal
  const addGoal = useCallback(
    async (data) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.post("/contests", data);

        // Refresh data
        await fetchGoals();

        toast.success("Goal added successfully");
        return response;
      } catch (err) {
        console.error("Error adding goal:", err);
        toast.error(err.message || "Failed to add goal");
        throw err;
      }
    },
    [isAuthenticated, fetchGoals]
  );

  // Update an existing goal
  const updateGoal = useCallback(
    async (id, data) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.put(`/contests/${id}`, data);

        // Refresh data
        await fetchGoals();

        toast.success("Goal updated successfully");
        return response;
      } catch (err) {
        console.error("Error updating goal:", err);
        toast.error(err.message || "Failed to update goal");
        throw err;
      }
    },
    [isAuthenticated, fetchGoals]
  );

  // Delete a goal
  const deleteGoal = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        await apiClient.delete(`/contests/${id}`);

        // Refresh data
        await fetchGoals();

        toast.success("Goal deleted successfully");
      } catch (err) {
        console.error("Error deleting goal:", err);
        toast.error(err.message || "Failed to delete goal");
        throw err;
      }
    },
    [isAuthenticated, fetchGoals]
  );

  // Get goal statistics
  const getGoalStats = useCallback(
    async (startDate, endDate) => {
      if (!isAuthenticated) return;

      try {
        const params = {};

        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await apiClient.get("/contests/stats", { params });
        setStats(response.stats || null);
        return response;
      } catch (err) {
        console.error("Error fetching goal stats:", err);
        toast.error("Failed to fetch goal statistics");
        throw err;
      }
    },
    [isAuthenticated]
  );

  // Get available platforms
  const getPlatforms = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiClient.get("/contests/platforms");
      setPlatforms(response.platforms || []);
      return response.platforms;
    } catch (err) {
      console.error("Error fetching platforms:", err);
      return [];
    }
  }, [isAuthenticated]);

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchGoals();
      getPlatforms();
    }
  }, [isAuthenticated, fetchGoals, getPlatforms]);

  return {
    goals,
    stats,
    loading,
    error,
    platforms,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalStats,
    getPlatforms,
  };
};

export default useGoals;
