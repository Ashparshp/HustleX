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

  const addGoal = useCallback(
    async (data) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.post("/contests", data);

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

  const updateGoal = useCallback(
    async (id, data) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.put(`/contests/${id}`, data);

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

  const deleteGoal = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        await apiClient.delete(`/contests/${id}`);

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
