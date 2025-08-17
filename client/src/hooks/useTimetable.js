import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const useTimetable = (timetableId = null) => {
  const [timetables, setTimetables] = useState([]);
  const [currentTimetable, setCurrentTimetable] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const weekCheckIntervalRef = useRef(null);
  const updateInProgress = useRef(false);
  const retryCount = useRef(0);
  const initialLoadComplete = useRef(false);
  const { token } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  const getAuthHeaders = useCallback(() => {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    };
  }, [token]);

  const checkWeekTransition = useCallback(() => {
    if (!currentWeek?.weekEndDate) return false;

    const now = new Date();
    const weekEndDate = new Date(currentWeek.weekEndDate);
    return now > weekEndDate;
  }, [currentWeek?.weekEndDate]);

  const fetchTimetables = useCallback(async () => {
    if (!token) return;

    try {
      if (timetables.length === 0) {
        setLoading(true);
      }

      const timestamp = new Date().getTime();
      const response = await fetch(`${API_URL}/api/timetables?t=${timestamp}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch timetables");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch timetables");
      }

      setTimetables(data.data);

      if (!currentTimetable || timetableId) {
        let selectedTimetable = null;

        if (timetableId) {
          selectedTimetable = data.data.find((t) => t.id === timetableId);
        }

        if (!selectedTimetable) {
          selectedTimetable =
            data.data.find((t) => t.isActive) ||
            (data.data.length > 0 ? data.data[0] : null);
        }

        if (selectedTimetable) {
          setCurrentTimetable(selectedTimetable);
        }
      }

      setError(null);
      return data.data;
    } catch (err) {
      console.error("Error fetching timetables:", err);
      setError(err.message);
      toast.error("Failed to fetch timetables");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [
    API_URL,
    getAuthHeaders,
    timetableId,
    token,
    currentTimetable,
    timetables.length,
  ]);

  const createTimetable = useCallback(
    async (timetableData) => {
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/api/timetables`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(timetableData),
        });

        if (!response.ok) {
          throw new Error("Failed to create timetable");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to create timetable");
        }

        return data.data;
      } catch (err) {
        console.error("Error creating timetable:", err);
        toast.error(err.message || "Failed to create timetable");
        throw err;
      }
    },
    [API_URL, getAuthHeaders, token]
  );

  const updateTimetable = useCallback(
    async (id, timetableData) => {
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/api/timetables/${id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(timetableData),
        });

        if (!response.ok) {
          throw new Error("Failed to update timetable");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to update timetable");
        }

        if (timetableData.isActive !== undefined && timetableData.isActive) {
          toast.success("Switched!");
        }

        await fetchTimetables();
        return data.data;
      } catch (err) {
        console.error("Error updating timetable:", err);
        toast.error(err.message || "Failed to update timetable");
        throw err;
      }
    },
    [API_URL, fetchTimetables, getAuthHeaders, token]
  );

  const deleteTimetable = useCallback(
    async (id, options = {}) => {
      const { silent = false } = options;

      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/api/timetables/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error("Failed to delete timetable");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to delete timetable");
        }

        if (!silent) {
          toast.success("Timetable deleted successfully");
        }

        await fetchTimetables();
        return true;
      } catch (err) {
        console.error("Error deleting timetable:", err);

        if (!silent) {
          toast.error(err.message || "Failed to delete timetable");
        }

        throw err;
      }
    },
    [API_URL, fetchTimetables, getAuthHeaders, token]
  );

  const fetchCurrentWeek = useCallback(
    async (id = null) => {
      if (updateInProgress.current || !token) {
        return;
      }

      try {
        updateInProgress.current = true;

        if (!currentWeek) {
          setLoading(true);
        }

        const timetableIdToUse =
          id || (currentTimetable ? currentTimetable.id : null);

        if (!timetableIdToUse) {
          setError("No timetable selected");
          setLoading(false);
          updateInProgress.current = false;
          return null;
        }

        const timestamp = new Date().getTime();
        const response = await fetch(
          `${API_URL}/api/timetables/${timetableIdToUse}/current-week?t=${timestamp}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch current week");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch current week");
        }

        setCurrentWeek(data.data);
        setError(null);
        retryCount.current = 0;
        return data.data;
      } catch (err) {
        console.error("Error fetching current week:", err);
        setError(err.message);

        if (retryCount.current === 0) {
          toast.error("Failed to fetch current week data");
        }

        throw err;
      } finally {
        setLoading(false);
        updateInProgress.current = false;
      }
    },
    [API_URL, currentTimetable, getAuthHeaders, token, currentWeek]
  );

  const toggleActivityStatus = useCallback(
    async (activityId, dayIndex) => {
      if (updateInProgress.current || !token || !currentTimetable) {
        return;
      }

      const previousWeek = currentWeek;
      updateInProgress.current = true;

      try {
        setCurrentWeek((prevWeek) => {
          if (!prevWeek) return prevWeek;
          return {
            ...prevWeek,
            activities: prevWeek.activities.map((activity) =>
              activity._id === activityId
                ? {
                    ...activity,
                    dailyStatus: activity.dailyStatus.map((status, i) =>
                      i === dayIndex ? !status : status
                    ),
                  }
                : activity
            ),
          };
        });

        const timestamp = new Date().getTime();
        const response = await fetch(
          `${API_URL}/api/timetables/${currentTimetable.id}/toggle?t=${timestamp}`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ activityId, dayIndex }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update activity status");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to update activity status");
        }

        setCurrentWeek(data.data);
        setError(null);
        return data.data;
      } catch (err) {
        setCurrentWeek(previousWeek);
        setError(err.message);
        toast.error("Failed to update activity status");
        throw err;
      } finally {
        updateInProgress.current = false;
      }
    },
    [API_URL, currentTimetable, currentWeek, getAuthHeaders, token]
  );

  const fetchHistory = useCallback(
    async (page = 1, id = null) => {
      if (!token) return;

      try {
        const timetableIdToUse =
          id || (currentTimetable ? currentTimetable.id : null);

        if (!timetableIdToUse) {
          throw new Error("No timetable selected");
        }

        const timestamp = new Date().getTime();
        const response = await fetch(
          `${API_URL}/api/timetables/${timetableIdToUse}/history?page=${page}&t=${timestamp}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch history");
        }

        return data;
      } catch (err) {
        console.error("Fetch history error:", err);
        toast.error("Failed to fetch timetable history");
        throw err;
      }
    },
    [API_URL, currentTimetable, getAuthHeaders, token]
  );

  const getStats = useCallback(
    async (id = null) => {
      if (updateInProgress.current || !token) {
        return;
      }

      try {
        updateInProgress.current = true;

        const timetableIdToUse =
          id || (currentTimetable ? currentTimetable.id : null);

        if (!timetableIdToUse) {
          throw new Error("No timetable selected");
        }

        const timestamp = new Date().getTime();
        const response = await fetch(
          `${API_URL}/api/timetables/${timetableIdToUse}/stats?t=${timestamp}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch stats");
        }

        setError(null);
        return data.data;
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message);
        toast.error("Failed to fetch timetable statistics");
        throw err;
      } finally {
        updateInProgress.current = false;
      }
    },
    [API_URL, currentTimetable, getAuthHeaders, token]
  );

  const getCategories = useCallback(async () => {
    if (!token) return [];

    try {
      const timestamp = new Date().getTime();
      const response = await fetch(
        `${API_URL}/api/timetables/categories?t=${timestamp}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      return Array.isArray(data.categories) ? data.categories : [];
    } catch (err) {
      console.error("Error fetching categories:", err);
      return [];
    }
  }, [API_URL, getAuthHeaders, token]);

  const updateDefaultActivities = useCallback(
    async (activities, options = {}) => {
      const { silent = false } = options;

      if (!token) return;

      try {
        const timetableIdToUse =
          options.id || (currentTimetable ? currentTimetable.id : null);

        if (!timetableIdToUse) {
          throw new Error("No timetable selected");
        }

        const response = await fetch(
          `${API_URL}/api/timetables/${timetableIdToUse}/activities`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ activities }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update activities");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to update activities");
        }

        if (!silent) {
          toast.success("Activities updated successfully");
        }

        return data.data;
      } catch (err) {
        console.error("Error updating activities:", err);

        if (!silent) {
          toast.error(err.message || "Failed to update activities");
        }

        throw err;
      }
    },
    [API_URL, currentTimetable, getAuthHeaders, token]
  );

  const startNewWeek = useCallback(
    async (id = null) => {
      if (!token) return;

      try {
        const timetableIdToUse =
          id || (currentTimetable ? currentTimetable.id : null);

        if (!timetableIdToUse) {
          throw new Error("No timetable selected");
        }

        const response = await fetch(
          `${API_URL}/api/timetables/${timetableIdToUse}/new-week`,
          {
            method: "POST",
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to start new week");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to start new week");
        }

        toast.success("New week started successfully");
        setCurrentWeek(data.data);
        return data.data;
      } catch (err) {
        console.error("Error starting new week:", err);
        toast.error(err.message || "Failed to start new week");
        throw err;
      }
    },
    [API_URL, currentTimetable, getAuthHeaders, token]
  );

  useEffect(() => {
    const checkAndUpdateWeek = async () => {
      if (checkWeekTransition() && currentTimetable) {
        try {
          await fetchCurrentWeek(currentTimetable.id);
          toast.success("New week started!");
        } catch (err) {
          console.error("Failed to update week:", err);
        }
      }
    };

    if (token && currentTimetable) {
      checkAndUpdateWeek();
    }

    weekCheckIntervalRef.current = setInterval(checkAndUpdateWeek, 60000);

    return () => {
      if (weekCheckIntervalRef.current) {
        clearInterval(weekCheckIntervalRef.current);
      }
    };
  }, [currentTimetable, token]); // Remove function dependencies to prevent infinite loop

  useEffect(() => {
    const loadInitialData = async () => {
      if (!token || initialLoadComplete.current) return;

      try {
        setLoading(true);
        initialLoadComplete.current = true;

        const timetablesData = await fetchTimetables();

        if (currentTimetable || (timetablesData && timetablesData.length > 0)) {
          try {
            const timetableToUse =
              currentTimetable ||
              timetablesData.find((t) => t.isActive) ||
              timetablesData[0];

            if (timetableToUse) {
              await fetchCurrentWeek(timetableToUse.id);
            }
          } catch (err) {
            console.error("Failed to load current week:", err);
          }
        }
      } catch (err) {
        console.error("Failed to load initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [token]); // Remove function dependencies to prevent infinite loop

  useEffect(() => {
    if (
      token &&
      currentTimetable &&
      initialLoadComplete.current &&
      !currentWeek
    ) {
      fetchCurrentWeek(currentTimetable.id).catch((err) => {
        console.error("Failed to load data for new timetable:", err);
      });
    }
  }, [currentTimetable?.id, token, currentWeek]); // Remove fetchCurrentWeek to prevent infinite loop

  useEffect(() => {
    if (
      token &&
      currentTimetable &&
      initialLoadComplete.current &&
      !currentWeek
    ) {
      fetchCurrentWeek(currentTimetable.id).catch((err) => {
        console.error("Failed to load data for new timetable:", err);
      });
    }
  }, [token, currentTimetable, currentWeek]); // Remove fetchCurrentWeek to prevent infinite loop

  return {
    timetables,
    currentTimetable,
    currentWeek,
    loading,
    error,
    fetchTimetables,
    createTimetable,
    updateTimetable,
    deleteTimetable,
    fetchCurrentWeek,
    toggleActivityStatus,
    fetchHistory,
    getStats,
    getCategories,
    updateDefaultActivities,
    startNewWeek,
  };
};

export default useTimetable;
