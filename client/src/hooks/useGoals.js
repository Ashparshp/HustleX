// src/hooks/useGoals.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

// This replaces the old useContests hook
const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [platforms, setPlatforms] = useState([]);

  const { isAuthenticated } = useAuth();

  // Fetch all goals (contests)
  const fetchGoals = useCallback(
    async (platform, participated, startDate, endDate, sort = "date") => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const params = {};

        if (platform) params.platform = platform;
        if (participated !== undefined)
          params.participated = participated.toString();
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (sort) params.sort = sort;

        const response = await apiClient.get("/contests", { params });

        setGoals(response.data || []);

        // Set stats if available
        if (response.stats) {
          setStats(response.stats);
        }

        setError(null);
        return response;
      } catch (err) {
        console.error("Error fetching goals:", err);
        setError(err.message);
        toast.error("Failed to fetch goals");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Add a new goal
  const addGoal = useCallback(
    async (goalData) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.post("/contests", goalData);

        // Refresh goals
        await fetchGoals();

        toast.success("Goal added successfully");
        return response.data;
      } catch (err) {
        console.error("Error adding goal:", err);
        toast.error(err.message || "Failed to add goal");
        throw err;
      }
    },
    [isAuthenticated, fetchGoals]
  );

  // Update a goal
  const updateGoal = useCallback(
    async (id, updateData) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.put(`/contests/${id}`, updateData);

        // Refresh goals
        await fetchGoals();

        toast.success("Goal updated successfully");
        return response.data;
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

        // Refresh goals
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

  // Get platforms
  const fetchPlatforms = useCallback(async () => {
    if (!isAuthenticated) return [];

    try {
      const response = await apiClient.get("/contests/platforms");
      setPlatforms(response.platforms || []);
      return response.platforms;
    } catch (err) {
      console.error("Error fetching platforms:", err);
      return [];
    }
  }, [isAuthenticated]);

  // Get goal statistics
  const getGoalStats = useCallback(
    async (startDate, endDate) => {
      if (!isAuthenticated) return null;

      try {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await apiClient.get("/contests/stats", { params });
        setStats(response.stats);
        return response.stats;
      } catch (err) {
        console.error("Error fetching goal stats:", err);
        toast.error("Failed to fetch goal statistics");
        return null;
      }
    },
    [isAuthenticated]
  );

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchGoals();
      fetchPlatforms();
    }
  }, [isAuthenticated, fetchGoals, fetchPlatforms]);

  return {
    goals,
    loading,
    error,
    stats,
    platforms,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    fetchPlatforms,
    getGoalStats,
  };
};

export default useGoals;
