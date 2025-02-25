// src/hooks/useLeetCode.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const useLeetCode = () => {
  const [stats, setStats] = useState({
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalEasy: 0,
    totalMedium: 0,
    totalHard: 0,
    ranking: null,
    username: null,
    lastUpdated: null,
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();

  // Fetch current LeetCode stats
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await apiClient.get("/leetcode/stats");

      if (response && response.data) {
        setStats(response.data);
      }

      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error fetching LeetCode stats:", err);
      setError(err.message);
      toast.error("Failed to fetch LeetCode stats");
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Update LeetCode stats
  const updateStats = useCallback(
    async (newStats) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const response = await apiClient.post("/leetcode/stats", newStats);

        if (response && response.data) {
          setStats(response.data);
          toast.success("LeetCode stats updated successfully");
        }

        return response.data;
      } catch (err) {
        console.error("Error updating LeetCode stats:", err);
        toast.error(err.message || "Failed to update LeetCode stats");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Fetch LeetCode history
  const fetchHistory = useCallback(
    async (limit = 10) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.get("/leetcode/history", {
          params: { limit },
        });

        if (response && response.data) {
          setHistory(response.data);
        }

        return response.data;
      } catch (err) {
        console.error("Error fetching LeetCode history:", err);
        toast.error("Failed to fetch LeetCode history");
        return [];
      }
    },
    [isAuthenticated]
  );

  // Delete a LeetCode stats entry
  const deleteStatsEntry = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        await apiClient.delete(`/leetcode/stats/${id}`);

        // Refresh history
        await fetchHistory();

        toast.success("Stats entry deleted successfully");
      } catch (err) {
        console.error("Error deleting stats entry:", err);
        toast.error(err.message || "Failed to delete stats entry");
        throw err;
      }
    },
    [isAuthenticated, fetchHistory]
  );

  // Calculate progress metrics from stats
  const getProgressMetrics = useCallback(() => {
    // Calculate solve percentages
    const easyPercentage =
      stats.totalEasy > 0 ? (stats.easySolved / stats.totalEasy) * 100 : 0;

    const mediumPercentage =
      stats.totalMedium > 0
        ? (stats.mediumSolved / stats.totalMedium) * 100
        : 0;

    const hardPercentage =
      stats.totalHard > 0 ? (stats.hardSolved / stats.totalHard) * 100 : 0;

    const totalPercentage =
      stats.totalEasy + stats.totalMedium + stats.totalHard > 0
        ? (stats.totalSolved /
            (stats.totalEasy + stats.totalMedium + stats.totalHard)) *
          100
        : 0;

    // Calculate distribution
    const distribution = {
      easy: stats.easySolved,
      medium: stats.mediumSolved,
      hard: stats.hardSolved,
    };

    return {
      easyPercentage,
      mediumPercentage,
      hardPercentage,
      totalPercentage,
      distribution,
    };
  }, [stats]);

  // Initial data load
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchHistory();
    }
  }, [isAuthenticated, fetchStats, fetchHistory]);

  return {
    stats,
    history,
    loading,
    error,
    fetchStats,
    updateStats,
    fetchHistory,
    deleteStatsEntry,
    getProgressMetrics,
  };
};

export default useLeetCode;
