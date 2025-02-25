// src/hooks/useSchedule.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const useSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
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
  });

  const { isAuthenticated } = useAuth();

  // Fetch schedules with optional date range
  const fetchSchedules = useCallback(
    async (startDate = null, endDate = null) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);

        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await apiClient.get("/schedules", { params });

        const fetchedSchedules = Array.isArray(response.data)
          ? response.data
          : [];
        setSchedules(fetchedSchedules);

        if (response.stats) {
          setStats(response.stats);
        } else {
          calculateStats(fetchedSchedules);
        }

        return response;
      } catch (error) {
        console.error("Error fetching schedules:", error);
        setError(error.message);
        toast.error("Failed to fetch schedules");
        setSchedules([]);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Fetch schedule categories
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiClient.get("/schedules/categories");
      setCategories(response.categories || []);
      return response.categories;
    } catch (error) {
      console.error("Error fetching schedule categories:", error);
      return [];
    }
  }, [isAuthenticated]);

  // Fetch schedule templates
  const fetchTemplates = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiClient.get("/schedules/templates");
      setTemplates(response.data || []);
      return response.data;
    } catch (error) {
      console.error("Error fetching schedule templates:", error);
      return [];
    }
  }, [isAuthenticated]);

  // Create a new schedule
  const createSchedule = useCallback(
    async (scheduleData) => {
      if (!isAuthenticated) return;

      try {
        // Validate required fields
        if (!scheduleData.date) {
          throw new Error("Date is required");
        }

        if (!scheduleData.items && !scheduleData.templateId) {
          throw new Error("Items or template ID is required");
        }

        // Ensure date is in ISO format
        const formattedData = {
          ...scheduleData,
          date: new Date(scheduleData.date).toISOString(),
        };

        const response = await apiClient.post("/schedules", formattedData);

        // Refresh schedules
        await fetchSchedules();
        toast.success("Schedule created successfully");
        return response.data;
      } catch (error) {
        console.error("Error creating schedule:", error);
        setError(error.message);
        toast.error(error.message || "Failed to create schedule");
        throw error;
      }
    },
    [isAuthenticated, fetchSchedules]
  );

  // Get a single schedule by ID
  const getSchedule = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        if (!id) throw new Error("Schedule ID is required");

        const response = await apiClient.get(`/schedules/${id}`);
        return response.data;
      } catch (error) {
        console.error("Error getting schedule:", error);
        setError(error.message);
        toast.error("Failed to fetch schedule details");
        throw error;
      }
    },
    [isAuthenticated]
  );

  // Update a schedule
  const updateSchedule = useCallback(
    async (id, updates) => {
      if (!isAuthenticated) return;

      try {
        if (!id) throw new Error("Schedule ID is required");

        // Format date if provided
        const formattedUpdates = { ...updates };
        if (updates.date) {
          formattedUpdates.date = new Date(updates.date).toISOString();
        }

        const response = await apiClient.put(
          `/schedules/${id}`,
          formattedUpdates
        );

        // Refresh schedules
        await fetchSchedules();
        toast.success("Schedule updated successfully");
        return response.data;
      } catch (error) {
        console.error("Error updating schedule:", error);
        setError(error.message);
        toast.error(error.message || "Failed to update schedule");
        throw error;
      }
    },
    [isAuthenticated, fetchSchedules]
  );

  // Delete a schedule
  const deleteSchedule = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        if (!id) throw new Error("Schedule ID is required");

        await apiClient.delete(`/schedules/${id}`);

        // Refresh schedules
        await fetchSchedules();
        toast.success("Schedule deleted successfully");
      } catch (error) {
        console.error("Error deleting schedule:", error);
        setError(error.message);
        toast.error(error.message || "Failed to delete schedule");
        throw error;
      }
    },
    [isAuthenticated, fetchSchedules]
  );

  // Add an item to a schedule
  const addScheduleItem = useCallback(
    async (scheduleId, itemData) => {
      if (!isAuthenticated) return;

      try {
        if (!scheduleId) throw new Error("Schedule ID is required");

        const response = await apiClient.post(
          `/schedules/${scheduleId}/items`,
          itemData
        );

        // Refresh schedules
        await fetchSchedules();
        toast.success("Item added successfully");
        return response.data;
      } catch (error) {
        console.error("Error adding schedule item:", error);
        setError(error.message);
        toast.error(error.message || "Failed to add item");
        throw error;
      }
    },
    [isAuthenticated, fetchSchedules]
  );

  // Update a schedule item
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

        // Refresh schedules
        await fetchSchedules();
        toast.success("Item updated successfully");
        return response.data;
      } catch (error) {
        console.error("Error updating schedule item:", error);
        setError(error.message);
        toast.error(error.message || "Failed to update item");
        throw error;
      }
    },
    [isAuthenticated, fetchSchedules]
  );

  // Delete a schedule item
  const deleteScheduleItem = useCallback(
    async (scheduleId, itemId) => {
      if (!isAuthenticated) return;

      try {
        if (!scheduleId || !itemId) {
          throw new Error("Schedule ID and Item ID are required");
        }

        await apiClient.delete(`/schedules/${scheduleId}/items/${itemId}`);

        // Refresh schedules
        await fetchSchedules();
        toast.success("Item deleted successfully");
      } catch (error) {
        console.error("Error deleting schedule item:", error);
        setError(error.message);
        toast.error(error.message || "Failed to delete item");
        throw error;
      }
    },
    [isAuthenticated, fetchSchedules]
  );

  // Create a schedule template
  const createTemplate = useCallback(
    async (templateData) => {
      if (!isAuthenticated) return;

      try {
        if (
          !templateData.name ||
          !templateData.items ||
          !templateData.items.length
        ) {
          throw new Error("Name and at least one item are required");
        }

        const response = await apiClient.post(
          "/schedules/templates",
          templateData
        );

        // Refresh templates
        await fetchTemplates();
        toast.success("Template created successfully");
        return response.data;
      } catch (error) {
        console.error("Error creating template:", error);
        setError(error.message);
        toast.error(error.message || "Failed to create template");
        throw error;
      }
    },
    [isAuthenticated, fetchTemplates]
  );

  // Update a schedule template
  const updateTemplate = useCallback(
    async (id, updates) => {
      if (!isAuthenticated) return;

      try {
        if (!id) throw new Error("Template ID is required");

        const response = await apiClient.put(
          `/schedules/templates/${id}`,
          updates
        );

        // Refresh templates
        await fetchTemplates();
        toast.success("Template updated successfully");
        return response.data;
      } catch (error) {
        console.error("Error updating template:", error);
        setError(error.message);
        toast.error(error.message || "Failed to update template");
        throw error;
      }
    },
    [isAuthenticated, fetchTemplates]
  );

  // Delete a schedule template
  const deleteTemplate = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        if (!id) throw new Error("Template ID is required");

        await apiClient.delete(`/schedules/templates/${id}`);

        // Refresh templates
        await fetchTemplates();
        toast.success("Template deleted successfully");
      } catch (error) {
        console.error("Error deleting template:", error);
        setError(error.message);
        toast.error(error.message || "Failed to delete template");
        throw error;
      }
    },
    [isAuthenticated, fetchTemplates]
  );

  // Helper functions for stats calculation
  const calculateStats = (scheduleData) => {
    if (!Array.isArray(scheduleData) || !scheduleData.length) return;

    const today = new Date().toISOString().split("T")[0];
    const todaySchedules = scheduleData.filter(
      (s) => s.date.split("T")[0] === today
    );

    const stats = {
      todayItems: todaySchedules.reduce((acc, s) => acc + s.items.length, 0),
      completionRate: calculateCompletionRate(scheduleData),
      totalHours: calculateTotalHours(todaySchedules),
      highPriorityTasks: countHighPriorityTasks(scheduleData),
      weeklyTrend: calculateWeeklyTrend(scheduleData),
      completionTrend: 0, // Calculate based on requirements
      hoursChange: 0, // Calculate based on requirements
      priorityChange: 0, // Calculate based on requirements
      totalTasks: scheduleData.reduce((acc, s) => acc + s.items.length, 0),
      currentStreak: calculateCurrentStreak(scheduleData),
      topCategory: findTopCategory(scheduleData),
      categoryCount: countUniqueCategories(scheduleData),
    };

    setStats(stats);
  };

  const calculateCompletionRate = (schedules) => {
    if (!schedules.length) return 0;
    const totalItems = schedules.reduce((acc, s) => acc + s.items.length, 0);
    const completedItems = schedules.reduce(
      (acc, s) => acc + s.items.filter((item) => item.completed).length,
      0
    );
    return totalItems ? (completedItems / totalItems) * 100 : 0;
  };

  const calculateTotalHours = (schedules) => {
    return schedules.reduce((acc, schedule) => {
      return (
        acc +
        schedule.items.reduce((itemAcc, item) => {
          const start = new Date(`2000-01-01T${item.startTime}`);
          const end = new Date(`2000-01-01T${item.endTime}`);
          return itemAcc + (end - start) / (1000 * 60 * 60);
        }, 0)
      );
    }, 0);
  };

  const countHighPriorityTasks = (schedules) => {
    return schedules.reduce(
      (acc, s) =>
        acc + s.items.filter((item) => item.priority === "High").length,
      0
    );
  };

  const calculateWeeklyTrend = (schedules) => {
    // Implementation based on requirements
    return 0;
  };

  const calculateCurrentStreak = (schedules) => {
    // Implementation based on requirements
    return 0;
  };

  const findTopCategory = (schedules) => {
    const categories = {};
    schedules.forEach((s) => {
      s.items.forEach((item) => {
        categories[item.category] = (categories[item.category] || 0) + 1;
      });
    });
    return (
      Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
    );
  };

  const countUniqueCategories = (schedules) => {
    const categories = new Set();
    schedules.forEach((s) => {
      s.items.forEach((item) => categories.add(item.category));
    });
    return categories.size;
  };

  // Initialize data on auth change
  useEffect(() => {
    if (isAuthenticated) {
      fetchSchedules().catch(console.error);
      fetchCategories().catch(console.error);
      fetchTemplates().catch(console.error);
    }
  }, [isAuthenticated, fetchSchedules, fetchCategories, fetchTemplates]);

  return {
    schedules,
    categories,
    templates,
    loading,
    error,
    stats,
    fetchSchedules,
    fetchCategories,
    fetchTemplates,
    createSchedule,
    getSchedule,
    updateSchedule,
    deleteSchedule,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};

export default useSchedule;
