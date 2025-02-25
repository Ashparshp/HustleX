// src/hooks/useGoals.js (previously useContests.js)
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const { isAuthenticated } = useAuth();

  // Fetch all goals/contests
  const fetchGoals = useCallback(
    async (filters = {}) => {
      if (!isAuthenticated) return;

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get("/contests", { params: filters });

        setGoals(response.data || []);

        if (response.stats) {
          setStats(response.stats);
        }

        return response;
      } catch (error) {
        console.error("Error fetching goals:", error);
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Fetch platforms
  const fetchPlatforms = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiClient.get("/contests/platforms");
      setPlatforms(response.platforms || []);
      return response.platforms;
    } catch (error) {
      console.error("Error fetching platforms:", error);
      return [];
    }
  }, [isAuthenticated]);

  // Add a new goal/contest
  const addGoal = useCallback(
    async (goalData) => {
      if (!isAuthenticated) return;

      try {
        if (!goalData.platform || !goalData.name || !goalData.date) {
          throw new Error("Platform, name, and date are required");
        }

        // Ensure date is in ISO format
        const formattedData = {
          ...goalData,
          date: new Date(goalData.date).toISOString(),
        };

        const response = await apiClient.post("/contests", formattedData);

        // Refresh goals list
        await fetchGoals();
        toast.success("Goal added successfully");
        return response;
      } catch (error) {
        console.error("Error adding goal:", error);
        setError(error.message);
        toast.error(error.message || "Failed to add goal");
        throw error;
      }
    },
    [isAuthenticated, fetchGoals]
  );

  // Update a goal/contest
  const updateGoal = useCallback(
    async (id, updateData) => {
      if (!isAuthenticated) return;

      try {
        if (!id) throw new Error("Goal ID is required");

        // Format date if provided
        const formattedData = { ...updateData };
        if (updateData.date) {
          formattedData.date = new Date(updateData.date).toISOString();
        }

        const response = await apiClient.put(`/contests/${id}`, formattedData);

        // Refresh goals list
        await fetchGoals();
        toast.success("Goal updated successfully");
        return response;
      } catch (error) {
        console.error("Error updating goal:", error);
        setError(error.message);
        toast.error(error.message || "Failed to update goal");
        throw error;
      }
    },
    [isAuthenticated, fetchGoals]
  );

  // Delete a goal/contest
  const deleteGoal = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        if (!id) throw new Error("Goal ID is required");

        await apiClient.delete(`/contests/${id}`);

        // Refresh goals list
        await fetchGoals();
        toast.success("Goal deleted successfully");
      } catch (error) {
        console.error("Error deleting goal:", error);
        setError(error.message);
        toast.error(error.message || "Failed to delete goal");
        throw error;
      }
    },
    [isAuthenticated, fetchGoals]
  );

  // Get goal/contest statistics
  const getStats = useCallback(
    async (filters = {}) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.get("/contests/stats", {
          params: filters,
        });
        setStats(response.stats);
        return response.stats;
      } catch (error) {
        console.error("Error fetching goal stats:", error);
        toast.error("Failed to fetch goal statistics");
        throw error;
      }
    },
    [isAuthenticated]
  );

  // Initialize data on auth change
  useEffect(() => {
    if (isAuthenticated) {
      fetchGoals().catch(console.error);
      fetchPlatforms().catch(console.error);
    }
  }, [isAuthenticated, fetchGoals, fetchPlatforms]);

  return {
    goals,
    platforms,
    loading,
    error,
    stats,
    fetchGoals,
    fetchPlatforms,
    addGoal,
    updateGoal,
    deleteGoal,
    getStats,
  };
};

export default useGoals;
