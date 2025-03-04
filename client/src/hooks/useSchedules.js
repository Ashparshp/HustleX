// src/hooks/useSchedules.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const defaultStats = {
  todayItems: 0,
  completionRate: 0,
  totalHours: 0,
  highPriorityTasks: 0,
  weeklyTrend: 0,
  completionTrend: 0,
  hoursChange: 0,
  priorityChange: 0,
  totalTasks: 0,
  currentStreak: 0,
  topCategory: "",
  categoryCount: 0,
};

const useSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(defaultStats);
  const [categories, setCategories] = useState([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);

  const { isAuthenticated } = useAuth();

  // Fetch schedules with optional date range
  const fetchSchedules = useCallback(
    async (startDate = null, endDate = null, status = null) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);

        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (status) params.status = status;

        const response = await apiClient.get("/schedules", { params });
        const fetchedSchedules = response.data || [];

        setSchedules(fetchedSchedules);
        calculateStats(fetchedSchedules);

        return fetchedSchedules;
      } catch (err) {
        console.error("Error fetching schedules:", err);
        setError(err.message || "Failed to fetch schedules");
        setSchedules([]);
        setStats(defaultStats);
        toast.error("Failed to fetch schedules");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Create a new schedule
  const createSchedule = useCallback(
    async (scheduleData) => {
      if (!isAuthenticated) return;

      try {
        // Validate required fields
        if (!scheduleData.date) {
          throw new Error("Date is required");
        }

        if (!scheduleData.items || scheduleData.items.length === 0) {
          throw new Error("At least one schedule item is required");
        }

        // Ensure date is in correct format
        const formattedData = {
          ...scheduleData,
          date: new Date(scheduleData.date).toISOString(),
        };

        const response = await apiClient.post("/schedules", formattedData);
        const newSchedule = response.data || {};

        // Update local state
        setSchedules((prev) => [...prev, newSchedule]);
        calculateStats([...schedules, newSchedule]);

        toast.success("Schedule created successfully");
        return newSchedule;
      } catch (err) {
        console.error("Create Schedule Error:", err);
        toast.error(err.message || "Failed to create schedule");
        throw err;
      }
    },
    [isAuthenticated, schedules]
  );

  // Update an existing schedule
  const updateSchedule = useCallback(
    async (id, updates) => {
      if (!isAuthenticated) return;

      try {
        if (!id) {
          throw new Error("Schedule ID is required");
        }

        // Ensure date is in correct format if present
        if (updates.date) {
          updates.date = new Date(updates.date).toISOString();
        }

        const response = await apiClient.put(`/schedules/${id}`, updates);
        const updatedSchedule = response.data || {};

        // Update local state
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule._id === id ? updatedSchedule : schedule
          )
        );
        calculateStats(
          schedules.map((schedule) =>
            schedule._id === id ? updatedSchedule : schedule
          )
        );

        toast.success("Schedule updated successfully");
        return updatedSchedule;
      } catch (err) {
        console.error("Update Schedule Error:", err);
        toast.error(err.message || "Failed to update schedule");
        throw err;
      }
    },
    [isAuthenticated, schedules]
  );

  // Delete a schedule
  const deleteSchedule = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        if (!id) {
          throw new Error("Schedule ID is required");
        }

        await apiClient.delete(`/schedules/${id}`);

        // Update local state
        const updatedSchedules = schedules.filter(
          (schedule) => schedule._id !== id
        );
        setSchedules(updatedSchedules);
        calculateStats(updatedSchedules);

        toast.success("Schedule deleted successfully");
      } catch (err) {
        console.error("Delete Schedule Error:", err);
        toast.error(err.message || "Failed to delete schedule");
        throw err;
      }
    },
    [isAuthenticated, schedules]
  );

  // Add a new item to a specific schedule
  const addScheduleItem = useCallback(
    async (scheduleId, itemData) => {
      if (!isAuthenticated) return;

      try {
        if (!scheduleId) {
          throw new Error("Schedule ID is required");
        }

        const response = await apiClient.post(
          `/schedules/${scheduleId}/items`,
          itemData
        );
        const updatedSchedule = response.data || {};

        // Update local state
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule._id === scheduleId ? updatedSchedule : schedule
          )
        );
        calculateStats(
          schedules.map((schedule) =>
            schedule._id === scheduleId ? updatedSchedule : schedule
          )
        );

        toast.success("Schedule item added successfully");
        return updatedSchedule;
      } catch (err) {
        console.error("Add Schedule Item Error:", err);
        toast.error(err.message || "Failed to add schedule item");
        throw err;
      }
    },
    [isAuthenticated, schedules]
  );

  // Update a specific item in a schedule
  const updateScheduleItem = useCallback(
    async (scheduleId, itemId, updates) => {
      if (!isAuthenticated) return;

      try {
        if (!scheduleId || !itemId) {
          throw new Error("Schedule ID and Item ID are required");
        }

        const response = await apiClient.put(
          `/schedules/${scheduleId}/items/${itemId}`,
          updates
        );
        const updatedSchedule = response.data || {};

        // Update local state
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule._id === scheduleId ? updatedSchedule : schedule
          )
        );
        calculateStats(
          schedules.map((schedule) =>
            schedule._id === scheduleId ? updatedSchedule : schedule
          )
        );

        return updatedSchedule;
      } catch (err) {
        console.error("Update Schedule Item Error:", err);
        toast.error(err.message || "Failed to update schedule item");
        throw err;
      }
    },
    [isAuthenticated, schedules]
  );

  // Delete a specific item from a schedule
  const deleteScheduleItem = useCallback(
    async (scheduleId, itemId) => {
      if (!isAuthenticated) return;

      try {
        if (!scheduleId || !itemId) {
          throw new Error("Schedule ID and Item ID are required");
        }

        const response = await apiClient.delete(
          `/schedules/${scheduleId}/items/${itemId}`
        );
        const updatedSchedule = response.data || {};

        // Update local state
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule._id === scheduleId ? updatedSchedule : schedule
          )
        );
        calculateStats(
          schedules.map((schedule) =>
            schedule._id === scheduleId ? updatedSchedule : schedule
          )
        );

        return updatedSchedule;
      } catch (err) {
        console.error("Delete Schedule Item Error:", err);
        toast.error(err.message || "Failed to delete schedule item");
        throw err;
      }
    },
    [isAuthenticated, schedules]
  );

  // Improved fetchCategories function with better error handling and state management
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) return [];

    // Prevent concurrent fetches
    if (isFetchingCategories) return categories;

    try {
      setIsFetchingCategories(true);

      // Use the general categories endpoint with type=schedule
      const response = await apiClient.get("/categories?type=schedule");

      let extractedCategories = [];

      // Handle different response structures
      if (response && Array.isArray(response)) {
        extractedCategories = response.map((cat) => cat.name);
      } else if (response && response.data && Array.isArray(response.data)) {
        extractedCategories = response.data.map((cat) => cat.name);
      } else if (
        response &&
        response.categories &&
        Array.isArray(response.categories)
      ) {
        extractedCategories = response.categories;
      } else {
        // Fallback to default categories
        extractedCategories = [
          "DSA",
          "System Design",
          "Development",
          "Learning",
          "Problem Solving",
          "Other",
        ];
      }

      setCategories(extractedCategories);
      return extractedCategories;
    } catch (err) {
      console.error("Error fetching schedule categories:", err);

      // Fallback to default categories if there's an error
      const defaultCats = [
        "DSA",
        "System Design",
        "Development",
        "Learning",
        "Problem Solving",
        "Other",
      ];

      setCategories(defaultCats);
      return defaultCats;
    } finally {
      setIsFetchingCategories(false);
    }
  }, [isAuthenticated, categories, isFetchingCategories]);

  // Stats calculation function
  const calculateStats = useCallback((scheduleData) => {
    if (!Array.isArray(scheduleData) || scheduleData.length === 0) {
      setStats(defaultStats);
      return;
    }

    // Calculate number of items due today
    const today = new Date().toISOString().split("T")[0];
    const todaySchedules = scheduleData.filter(
      (s) => s.date && new Date(s.date).toISOString().split("T")[0] === today
    );
    const todayItems = todaySchedules.reduce(
      (acc, s) => acc + (s.items ? s.items.length : 0),
      0
    );

    // Calculate completion rate across all schedules
    const totalItems = scheduleData.reduce(
      (acc, s) => acc + (s.items ? s.items.length : 0),
      0
    );
    const completedItems = scheduleData.reduce(
      (acc, s) =>
        acc + (s.items ? s.items.filter((item) => item.completed).length : 0),
      0
    );
    const completionRate =
      totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    // Calculate total hours for all schedules
    const totalHours = scheduleData.reduce((acc, schedule) => {
      if (!schedule.items) return acc;

      return (
        acc +
        schedule.items.reduce((itemAcc, item) => {
          if (!item.startTime || !item.endTime) return itemAcc;

          const start = new Date(`2000-01-01T${item.startTime}`);
          const end = new Date(`2000-01-01T${item.endTime}`);
          return itemAcc + (end - start) / (1000 * 60 * 60);
        }, 0)
      );
    }, 0);

    // Count high priority tasks
    const highPriorityTasks = scheduleData.reduce(
      (acc, s) =>
        acc +
        (s.items
          ? s.items.filter((item) => item.priority === "High").length
          : 0),
      0
    );

    // Create category distribution
    const categories = {};
    scheduleData.forEach((schedule) => {
      if (!schedule.items) return;

      schedule.items.forEach((item) => {
        if (!item.category) return;

        categories[item.category] = (categories[item.category] || 0) + 1;
      });
    });

    // Find top category
    const topCategory =
      Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

    // Set the calculated stats
    setStats({
      todayItems,
      completionRate,
      totalHours,
      highPriorityTasks,
      weeklyTrend: 0, // Calculate based on requirements
      completionTrend: 0, // Calculate based on requirements
      hoursChange: 0, // Calculate based on requirements
      priorityChange: 0, // Calculate based on requirements
      totalTasks: totalItems,
      currentStreak: 0, // Calculate based on requirements
      topCategory,
      categoryCount: Object.keys(categories).length,
    });
  }, []);

  // Load initial data - fetch only once when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchSchedules();
      // Category fetching is now controlled by the component
    }
  }, [isAuthenticated, fetchSchedules]);

  return {
    schedules,
    loading,
    error,
    stats,
    categories,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    fetchCategories,
  };
};

export default useSchedules;
