// src/hooks/useTimeTracking.js
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

  // Start time tracking
  const startTracking = useCallback(() => {
    if (isTracking) return;

    setIsTracking(true);
    setStartTime(new Date());

    // Start interval to update time spent
    intervalRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    // Log tracking start if authenticated
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

  // Stop time tracking
  const stopTracking = useCallback(() => {
    if (!isTracking) return 0;

    const endTime = new Date();
    const duration = startTime ? (endTime - startTime) / (1000 * 60 * 60) : 0;

    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsTracking(false);

    // Log tracking stop if authenticated
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

    // Add to tracked sessions
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

  // Reset tracking
  const resetTracking = useCallback(() => {
    // Stop if currently tracking
    if (isTracking) {
      stopTracking();
    }

    setTimeSpent(0);
    setStartTime(null);

    // Clear interval just in case
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isTracking, stopTracking]);

  // Format time as HH:MM:SS
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  // Save tracked session to the server
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

  // Fetch tracking sessions
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

  // Delete a tracked session
  const deleteSession = useCallback(
    async (sessionId) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        await apiClient.delete(`/time-tracking/sessions/${sessionId}`);

        // Update local state
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Load sessions on authentication change
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
