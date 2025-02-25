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

  // Fetch LeetCode stats
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await apiClient.get("/leetcode/stats");

      if (response.data) {
        setStats(response.data);
      }

      setError(null);
      return response.data;
    } catch (error) {
      console.error("Error fetching LeetCode stats:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch LeetCode history
  const fetchHistory = useCallback(
    async (limit = 10) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.get("/leetcode/history", {
          params: { limit },
        });

        if (response.data) {
          setHistory(response.data);
        }

        return response.data;
      } catch (error) {
        console.error("Error fetching LeetCode history:", error);
        toast.error("Failed to fetch LeetCode history");
        throw error;
      }
    },
    [isAuthenticated]
  );

  // Update LeetCode stats
  const updateStats = useCallback(
    async (newStats) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.post("/leetcode/stats", newStats);

        if (response.data) {
          setStats(response.data);
        }

        toast.success("LeetCode stats updated successfully");
        return response.data;
      } catch (error) {
        console.error("Error updating LeetCode stats:", error);
        toast.error(error.message || "Failed to update LeetCode stats");
        throw error;
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
        await fetchStats();

        toast.success("Stats entry deleted successfully");
      } catch (error) {
        console.error("Error deleting LeetCode stats entry:", error);
        toast.error("Failed to delete stats entry");
        throw error;
      }
    },
    [isAuthenticated, fetchHistory, fetchStats]
  );

  // Calculate progress metrics
  const getProgressMetrics = useCallback(() => {
    if (!history || history.length < 2) {
      return {
        dailyAverage: 0,
        weeklyAverage: 0,
        improvementRate: 0,
      };
    }

    // Sort by date (newest first)
    const sortedHistory = [...history].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Calculate daily average (last 7 days)
    const last7Days = sortedHistory.slice(0, Math.min(7, sortedHistory.length));
    if (last7Days.length < 2)
      return { dailyAverage: 0, weeklyAverage: 0, improvementRate: 0 };

    const newest = last7Days[0];
    const oldest7Day = last7Days[last7Days.length - 1];
    const daysDiff7 = Math.max(
      1,
      Math.ceil(
        (new Date(newest.createdAt) - new Date(oldest7Day.createdAt)) /
          (1000 * 60 * 60 * 24)
      )
    );
    const problemsDiff7 = newest.totalSolved - oldest7Day.totalSolved;
    const dailyAverage = problemsDiff7 / daysDiff7;

    // Calculate weekly average (last 4 weeks)
    const last4Weeks = sortedHistory.slice(
      0,
      Math.min(28, sortedHistory.length)
    );
    if (last4Weeks.length < 2)
      return { dailyAverage, weeklyAverage: 0, improvementRate: 0 };

    const oldestWeek = last4Weeks[last4Weeks.length - 1];
    const weeksDiff = Math.max(
      1,
      Math.ceil(
        (new Date(newest.createdAt) - new Date(oldestWeek.createdAt)) /
          (1000 * 60 * 60 * 24 * 7)
      )
    );
    const problemsDiff = newest.totalSolved - oldestWeek.totalSolved;
    const weeklyAverage = problemsDiff / weeksDiff;

    // Calculate improvement rate
    let improvementRate = 0;
    if (sortedHistory.length >= 6) {
      // Need at least 6 entries to calculate improvement
      const midPoint = Math.floor(sortedHistory.length / 2);
      const olderHalf = sortedHistory.slice(midPoint);
      const newerHalf = sortedHistory.slice(0, midPoint);

      const olderAvg =
        olderHalf.reduce((sum, entry) => sum + entry.totalSolved, 0) /
        olderHalf.length;
      const newerAvg =
        newerHalf.reduce((sum, entry) => sum + entry.totalSolved, 0) /
        newerHalf.length;

      if (olderAvg > 0) {
        improvementRate = ((newerAvg - olderAvg) / olderAvg) * 100;
      }
    }

    return {
      dailyAverage,
      weeklyAverage,
      improvementRate,
    };
  }, [history]);

  // Initialize data on auth change
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats().catch(console.error);
      fetchHistory().catch(console.error);
    }
  }, [isAuthenticated, fetchStats, fetchHistory]);

  return {
    stats,
    history,
    loading,
    error,
    fetchStats,
    fetchHistory,
    updateStats,
    deleteStatsEntry,
    getProgressMetrics,
  };
};

export default useLeetCode;
