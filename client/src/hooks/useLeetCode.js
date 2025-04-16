import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const useLeetCode = () => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();

  const getLeetCodeStats = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get("/leetcode/stats");

      if (response.success) {
        setStats(response.data || null);
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch LeetCode stats");
      }
    } catch (err) {
      console.error("Error fetching LeetCode stats:", err);
      setError(
        err.message || "An error occurred while fetching LeetCode stats"
      );
      toast.error("Failed to load LeetCode statistics");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const getLeetCodeHistory = useCallback(
    async (limit = 10) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get("/leetcode/history", {
          params: { limit },
        });

        if (response.success) {
          setHistory(response.data || []);
          return response.data;
        } else {
          throw new Error(
            response.message || "Failed to fetch LeetCode history"
          );
        }
      } catch (err) {
        console.error("Error fetching LeetCode history:", err);
        setError(
          err.message || "An error occurred while fetching LeetCode history"
        );
        toast.error("Failed to load LeetCode history");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  const updateLeetCodeStats = useCallback(
    async (data) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.post("/leetcode/stats", data);

        if (response.success) {
          setStats(response.data || null);
          getLeetCodeHistory();
          toast.success("LeetCode stats updated successfully");
          return response.data;
        } else {
          throw new Error(
            response.message || "Failed to update LeetCode stats"
          );
        }
      } catch (err) {
        console.error("Error updating LeetCode stats:", err);
        setError(
          err.message || "An error occurred while updating LeetCode stats"
        );
        toast.error("Failed to update LeetCode statistics");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, getLeetCodeHistory]
  );

  const deleteLeetCodeStatsEntry = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.delete(`/leetcode/stats/${id}`);

        if (response.success) {
          getLeetCodeHistory();
          getLeetCodeStats();
          toast.success("LeetCode stats entry deleted successfully");
          return true;
        } else {
          throw new Error(
            response.message || "Failed to delete LeetCode stats entry"
          );
        }
      } catch (err) {
        console.error("Error deleting LeetCode stats entry:", err);
        setError(
          err.message || "An error occurred while deleting LeetCode stats entry"
        );
        toast.error("Failed to delete LeetCode statistics entry");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, getLeetCodeHistory, getLeetCodeStats]
  );

  useEffect(() => {
    if (isAuthenticated) {
      getLeetCodeStats();
      getLeetCodeHistory();
    }
  }, [isAuthenticated, getLeetCodeStats, getLeetCodeHistory]);

  return {
    stats,
    history,
    loading,
    error,
    getLeetCodeStats,
    getLeetCodeHistory,
    updateLeetCodeStats,
    deleteLeetCodeStatsEntry,
  };
};

export default useLeetCode;
