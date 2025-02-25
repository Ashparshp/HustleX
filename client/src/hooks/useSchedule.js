// src/hooks/useSchedule.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const useSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);

  const { isAuthenticated } = useAuth();

  // Fetch schedules with optional date range
  const fetchSchedules = useCallback(
    async (startDate, endDate, status) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const params = {};

        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (status) params.status = status;

        const response = await apiClient.get("/schedules", { params });

        setSchedules(response.data || []);

        // Set stats if available
        if (response.stats) {
          setStats(response.stats);
        }

        setError(null);
        return response;
      } catch (err) {
        console.error("Error fetching schedules:", err);
        setError(err.message);
        toast.error("Failed to fetch schedules");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Get a single schedule by ID
  const getSchedule = useCallback(
    async (id) => {
      if (!isAuthenticated || !id) return null;

      try {
        const response = await apiClient.get(`/schedules/${id}`);
        return response.data;
      } catch (err) {
        console.error("Error fetching schedule:", err);
        toast.error("Failed to fetch schedule details");
        return null;
      }
    },
    [isAuthenticated]
  );

  // Create a new schedule
  const createSchedule = useCallback(
    async (scheduleData) => {
      if (!isAuthenticated) return;

      try {
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
      } catch (err) {
        console.error("Error creating schedule:", err);
        toast.error(err.message || "Failed to create schedule");
        throw err;
      }
    },
    [isAuthenticated, fetchSchedules]
  );

  // Create schedule from template
  const createScheduleFromTemplate = useCallback(
    async (date, templateId) => {
      if (!isAuthenticated) return;

      try {
        const data = {
          date: new Date(date).toISOString(),
          templateId,
        };

        const response = await apiClient.post("/schedules", data);

        // Refresh schedules
        await fetchSchedules();

        toast.success("Schedule created from template successfully");
        return response.data;
      } catch (err) {
        console.error("Error creating schedule from template:", err);
        toast.error(err.message || "Failed to create schedule from template");
        throw err;
      }
    },
    [isAuthenticated, fetchSchedules]
  );

  // Update a schedule
  const updateSchedule = useCallback(
    async (id, updateData) => {
      if (!isAuthenticated) return;

      try {
        // Format date if provided
        const formattedData = { ...updateData };
        if (formattedData.date) {
          formattedData.date = new Date(formattedData.date).toISOString();
        }

        const response = await apiClient.put(`/schedules/${id}`, formattedData);

        // Refresh schedules
        await fetchSchedules();

        toast.success("Schedule updated successfully");
        return response.data;
      } catch (err) {
        console.error("Error updating schedule:", err);
        toast.error(err.message || "Failed to update schedule");
        throw err;
      }
    },
    [isAuthenticated, fetchSchedules]
  );

  // Delete a schedule
  const deleteSchedule = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        await apiClient.delete(`/schedules/${id}`);

        // Refresh schedules
        await fetchSchedules();

        toast.success("Schedule deleted successfully");
      } catch (err) {
        console.error("Error deleting schedule:", err);
        toast.error(err.message || "Failed to delete schedule");
        throw err;
      }
    },
    [isAuthenticated, fetchSchedules]
  );

  // Add item to schedule
  const addScheduleItem = useCallback(
    async (scheduleId, itemData) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.post(
          `/schedules/${scheduleId}/items`,
          itemData
        );

        // Refresh specific schedule or all schedules
        fetchSchedules();

        toast.success("Item added to schedule successfully");
        return response.data;
      } catch (err) {
        console.error("Error adding schedule item:", err);
        toast.error(err.message || "Failed to add item to schedule");
        throw err;
      }
    },
    [isAuthenticated, fetchSchedules]
  );

  // Update schedule item
  const updateScheduleItem = useCallback(
    async (scheduleId, itemId, updateData) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.put(
          `/schedules/${scheduleId}/items/${itemId}`,
          updateData
        );

        // Refresh schedules
        fetchSchedules();

        toast.success("Schedule item updated successfully");
        return response.data;
      } catch (err) {
        console.error("Error updating schedule item:", err);
        toast.error(err.message || "Failed to update schedule item");
        throw err;
      }
    },
    [isAuthenticated, fetchSchedules]
  );

  // Delete schedule item
  const deleteScheduleItem = useCallback(
    async (scheduleId, itemId) => {
      if (!isAuthenticated) return;

      try {
        await apiClient.delete(`/schedules/${scheduleId}/items/${itemId}`);

        // Refresh schedules
        fetchSchedules();

        toast.success("Schedule item deleted successfully");
      } catch (err) {
        console.error("Error deleting schedule item:", err);
        toast.error(err.message || "Failed to delete schedule item");
        throw err;
      }
    },
    [isAuthenticated, fetchSchedules]
  );

  // Fetch categories for schedules
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) return [];

    try {
      const response = await apiClient.get("/schedules/categories");
      setCategories(response.categories || []);
      return response.categories;
    } catch (err) {
      console.error("Error fetching schedule categories:", err);
      return [];
    }
  }, [isAuthenticated]);

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    if (!isAuthenticated) return [];

    try {
      const response = await apiClient.get("/schedules/templates");
      setTemplates(response.data || []);
      return response.data;
    } catch (err) {
      console.error("Error fetching schedule templates:", err);
      return [];
    }
  }, [isAuthenticated]);

  // Create a template
  const createTemplate = useCallback(
    async (templateData) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.post(
          "/schedules/templates",
          templateData
        );

        // Refresh templates
        await fetchTemplates();

        toast.success("Template created successfully");
        return response.data;
      } catch (err) {
        console.error("Error creating template:", err);
        toast.error(err.message || "Failed to create template");
        throw err;
      }
    },
    [isAuthenticated, fetchTemplates]
  );

  // Update a template
  const updateTemplate = useCallback(
    async (id, updateData) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.put(
          `/schedules/templates/${id}`,
          updateData
        );

        // Refresh templates
        await fetchTemplates();

        toast.success("Template updated successfully");
        return response.data;
      } catch (err) {
        console.error("Error updating template:", err);
        toast.error(err.message || "Failed to update template");
        throw err;
      }
    },
    [isAuthenticated, fetchTemplates]
  );

  // Delete a template
  const deleteTemplate = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        await apiClient.delete(`/schedules/templates/${id}`);

        // Refresh templates
        await fetchTemplates();

        toast.success("Template deleted successfully");
      } catch (err) {
        console.error("Error deleting template:", err);
        toast.error(err.message || "Failed to delete template");
        throw err;
      }
    },
    [isAuthenticated, fetchTemplates]
  );

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchSchedules();
      fetchCategories();
      fetchTemplates();
    }
  }, [isAuthenticated, fetchSchedules, fetchCategories, fetchTemplates]);

  return {
    schedules,
    loading,
    error,
    stats,
    categories,
    templates,
    fetchSchedules,
    getSchedule,
    createSchedule,
    createScheduleFromTemplate,
    updateSchedule,
    deleteSchedule,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    fetchCategories,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};

export default useSchedule;
