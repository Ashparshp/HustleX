import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const useTimeTracking = (
  initialTime = 0,
  categoryId = null,
  taskName = null
) => {
  const [timeSpent, setTimeSpent] = useState(initialTime);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [trackedSessions, setTrackedSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const intervalRef = useRef(null);
  const { isAuthenticated } = useAuth();

  const startTracking = useCallback(() => {
    if (isTracking) return;

    setIsTracking(true);
    setStartTime(new Date());

    intervalRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    if (isAuthenticated) {
      try {
        apiClient
          .post("/time-tracking/start", {
            startTime: new Date().toISOString(),
            category: categoryId,
            taskName,
          })
          .catch((err) => console.error("Failed to log tracking start:", err));
      } catch (error) {
        console.error("Error logging tracking start:", error);
      }
    }
  }, [isTracking, isAuthenticated, categoryId, taskName]);

  const stopTracking = useCallback(() => {
    if (!isTracking) return 0;

    const endTime = new Date();
    const duration = startTime ? (endTime - startTime) / (1000 * 60 * 60) : 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsTracking(false);

    if (isAuthenticated && startTime) {
      try {
        apiClient
          .post("/time-tracking/stop", {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            duration,
            category: categoryId,
            taskName,
          })
          .catch((err) => console.error("Failed to log tracking stop:", err));
      } catch (error) {
        console.error("Error logging tracking stop:", error);
      }
    }

    if (startTime) {
      setTrackedSessions((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          startTime,
          endTime,
          duration,
          category: categoryId,
          taskName,
        },
      ]);
    }

    return duration;
  }, [isTracking, startTime, isAuthenticated, categoryId, taskName]);

  const resetTracking = useCallback(() => {
    if (isTracking) {
      stopTracking();
    }

    setTimeSpent(0);
    setStartTime(null);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isTracking, stopTracking]);

  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const saveSession = useCallback(
    async (sessionData) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        const response = await apiClient.post(
          "/time-tracking/sessions",
          sessionData
        );

        toast.success("Session saved successfully");
        return response.data;
      } catch (error) {
        console.error("Error saving session:", error);
        setError(error.message);
        toast.error(error.message || "Failed to save session");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  const fetchSessions = useCallback(
    async (filters = {}) => {
      if (!isAuthenticated) return [];

      try {
        setLoading(true);

        const response = await apiClient.get("/time-tracking/sessions", {
          params: filters,
        });

        setTrackedSessions(response.data || []);
        return response.data;
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setError(error.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  const deleteSession = useCallback(
    async (sessionId) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        await apiClient.delete(`/time-tracking/sessions/${sessionId}`);

        setTrackedSessions((prev) =>
          prev.filter((session) => session.id !== sessionId)
        );

        toast.success("Session deleted successfully");
      } catch (error) {
        console.error("Error deleting session:", error);
        setError(error.message);
        toast.error(error.message || "Failed to delete session");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSessions().catch(console.error);
    }
  }, [isAuthenticated, fetchSessions]);

  return {
    timeSpent,
    isTracking,
    trackedSessions,
    loading,
    error,
    startTracking,
    stopTracking,
    resetTracking,
    formattedTime: formatTime(timeSpent),
    saveSession,
    fetchSessions,
    deleteSession,
  };
};

export default useTimeTracking;
