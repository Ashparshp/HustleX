import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const useContests = () => {
  const [contests, setContests] = useState([]);
  const [stats, setStats] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();

  const fetchContests = useCallback(
    async (startDate, endDate, platform, participated) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);

        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (platform) params.platform = platform;
        if (participated !== null) params.participated = participated;

        const response = await apiClient.get("/contests", { params });

        if (response.success) {
          setContests(response.data || []);
          setStats(response.stats || null);
        } else {
          throw new Error(response.message || "Failed to fetch contests");
        }
      } catch (err) {
        console.error("Error fetching contests:", err);
        setError(err.message || "An error occurred while fetching contests");
        toast.error("Failed to load contests");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  const fetchPlatforms = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiClient.get("/contests/platforms");

      if (response.success) {
        setPlatforms(response.platforms || []);
      } else {
        throw new Error(response.message || "Failed to fetch platforms");
      }
    } catch (err) {
      console.error("Error fetching platforms:", err);
    }
  }, [isAuthenticated]);

  const fetchStats = useCallback(
    async (startDate, endDate) => {
      if (!isAuthenticated) return;

      try {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await apiClient.get("/contests/stats", { params });

        if (response.success) {
          setStats(response.stats || null);
          return response.stats;
        } else {
          throw new Error(response.message || "Failed to fetch contest stats");
        }
      } catch (err) {
        console.error("Error fetching contest stats:", err);
        toast.error("Failed to load contest statistics");
        throw err;
      }
    },
    [isAuthenticated]
  );

  const addContest = useCallback(
    async (data) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.post("/contests", data);

        if (response.success) {
          await fetchContests();
          toast.success("Contest added successfully");
          return response.data;
        } else {
          throw new Error(response.message || "Failed to add contest");
        }
      } catch (err) {
        console.error("Error adding contest:", err);
        toast.error(err.message || "Failed to add contest");
        throw err;
      }
    },
    [isAuthenticated, fetchContests]
  );

  const updateContest = useCallback(
    async (id, data) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.put(`/contests/${id}`, data);

        if (response.success) {
          await fetchContests();
          toast.success("Contest updated successfully");
          return response.data;
        } else {
          throw new Error(response.message || "Failed to update contest");
        }
      } catch (err) {
        console.error("Error updating contest:", err);
        toast.error(err.message || "Failed to update contest");
        throw err;
      }
    },
    [isAuthenticated, fetchContests]
  );

  const deleteContest = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.delete(`/contests/${id}`);

        if (response.success) {
          await fetchContests();
          toast.success("Contest deleted successfully");
          return true;
        } else {
          throw new Error(response.message || "Failed to delete contest");
        }
      } catch (err) {
        console.error("Error deleting contest:", err);
        toast.error(err.message || "Failed to delete contest");
        throw err;
      }
    },
    [isAuthenticated, fetchContests]
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchContests();
      fetchPlatforms();
    }
  }, [isAuthenticated, fetchContests, fetchPlatforms]);

  return {
    contests,
    stats,
    platforms,
    loading,
    error,
    fetchContests,
    fetchPlatforms,
    fetchStats,
    addContest,
    updateContest,
    deleteContest,
  };
};

export default useContests;
