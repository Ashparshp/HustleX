import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import mockDataService from "../utils/mockDataService";
import { useAuth } from "../context/AuthContext";

// Flag to use mock data instead of real API
const USE_MOCK_DATA = true; // Set to false when API is working

const useSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();

  // Fetch schedules for a date range
  const fetchSchedules = useCallback(
    async (startDate, endDate, status) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        if (USE_MOCK_DATA) {
          // Use mock data service
          const mockResponse = await mockDataService.getSchedules({
            startDate,
            endDate,
            status,
          });
          const mockStats = await mockDataService.getStats();

          setSchedules(mockResponse);
          setStats(mockStats);
          setError(null);
          return { data: mockResponse, stats: mockStats };
        } else {
          // Use real API
          const params = {};
          if (startDate) params.startDate = startDate;
          if (endDate) params.endDate = endDate;
          if (status) params.status = status;

          const response = await apiClient.get("/schedules", { params });

          setSchedules(response.data || []);
          setStats(response.stats || null);
          setError(null);
          return response;
        }
      } catch (err) {
        console.error("Error fetching schedules:", err);
        setError(err.message);
        toast.error("Failed to fetch schedules");
        return { data: [], stats: null };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Fetch a single schedule by ID
  const fetchScheduleById = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        let scheduleData;
        if (USE_MOCK_DATA) {
          scheduleData = await mockDataService.getScheduleById(id);
        } else {
          const response = await apiClient.get(`/schedules/${id}`);
          scheduleData = response.data;
        }

        setCurrentSchedule(scheduleData || null);
        setError(null);
        return scheduleData;
      } catch (err) {
        console.error("Error fetching schedule:", err);
        setError(err.message);
        toast.error("Failed to fetch schedule");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Create a new schedule
  const createSchedule = useCallback(
    async (data) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        let response;
        if (USE_MOCK_DATA) {
          response = await mockDataService.createSchedule(data);
        } else {
          response = await apiClient.post("/schedules", data);
        }

        // Refresh schedules
        await fetchSchedules();

        toast.success("Schedule created successfully");
        return response;
      } catch (err) {
        console.error("Error creating schedule:", err);
        toast.error(err.message || "Failed to create schedule");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchSchedules]
  );

  // Update an existing schedule
  const updateSchedule = useCallback(
    async (id, data) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        let updatedSchedule;
        if (USE_MOCK_DATA) {
          updatedSchedule = await mockDataService.updateSchedule(id, data);
        } else {
          const response = await apiClient.put(`/schedules/${id}`, data);
          updatedSchedule = response.data;
        }

        // Refresh current schedule
        if (currentSchedule && currentSchedule._id === id) {
          setCurrentSchedule(updatedSchedule);
        }

        // Refresh schedules list
        await fetchSchedules();

        toast.success("Schedule updated successfully");
        return updatedSchedule;
      } catch (err) {
        console.error("Error updating schedule:", err);
        toast.error(err.message || "Failed to update schedule");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, currentSchedule, fetchSchedules]
  );

  // Delete a schedule
  const deleteSchedule = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        if (USE_MOCK_DATA) {
          await mockDataService.deleteSchedule(id);
        } else {
          await apiClient.delete(`/schedules/${id}`);
        }

        // Reset current schedule if it was deleted
        if (currentSchedule && currentSchedule._id === id) {
          setCurrentSchedule(null);
        }

        // Refresh schedules list
        await fetchSchedules();

        toast.success("Schedule deleted successfully");
      } catch (err) {
        console.error("Error deleting schedule:", err);
        toast.error(err.message || "Failed to delete schedule");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, currentSchedule, fetchSchedules]
  );

  // Add a schedule item
  const addScheduleItem = useCallback(
    async (scheduleId, itemData) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        let updatedSchedule;
        if (USE_MOCK_DATA) {
          updatedSchedule = await mockDataService.addScheduleItem(
            scheduleId,
            itemData
          );
        } else {
          const response = await apiClient.post(
            `/schedules/${scheduleId}/items`,
            itemData
          );
          updatedSchedule = response.data;
        }

        // Update current schedule
        if (currentSchedule && currentSchedule._id === scheduleId) {
          setCurrentSchedule(updatedSchedule);
        }

        // Refresh schedules list
        await fetchSchedules();

        toast.success("Schedule item added successfully");
        return updatedSchedule;
      } catch (err) {
        console.error("Error adding schedule item:", err);
        toast.error(err.message || "Failed to add schedule item");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, currentSchedule, fetchSchedules]
  );

  // Update a schedule item
  const updateScheduleItem = useCallback(
    async (scheduleId, itemId, itemData) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        let updatedSchedule;
        if (USE_MOCK_DATA) {
          updatedSchedule = await mockDataService.updateScheduleItem(
            scheduleId,
            itemId,
            itemData
          );
        } else {
          const response = await apiClient.put(
            `/schedules/${scheduleId}/items/${itemId}`,
            itemData
          );
          updatedSchedule = response.data;
        }

        // Update current schedule
        if (currentSchedule && currentSchedule._id === scheduleId) {
          setCurrentSchedule(updatedSchedule);
        }

        // Refresh schedules list
        await fetchSchedules();

        toast.success("Schedule item updated successfully");
        return updatedSchedule;
      } catch (err) {
        console.error("Error updating schedule item:", err);
        toast.error(err.message || "Failed to update schedule item");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, currentSchedule, fetchSchedules]
  );

  // Delete a schedule item
  const deleteScheduleItem = useCallback(
    async (scheduleId, itemId) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        let updatedSchedule;
        if (USE_MOCK_DATA) {
          updatedSchedule = await mockDataService.deleteScheduleItem(
            scheduleId,
            itemId
          );
        } else {
          const response = await apiClient.delete(
            `/schedules/${scheduleId}/items/${itemId}`
          );
          updatedSchedule = response.data;
        }

        // Update current schedule
        if (currentSchedule && currentSchedule._id === scheduleId) {
          setCurrentSchedule(updatedSchedule);
        }

        // Refresh schedules list
        await fetchSchedules();

        toast.success("Schedule item deleted successfully");
        return updatedSchedule;
      } catch (err) {
        console.error("Error deleting schedule item:", err);
        toast.error(err.message || "Failed to delete schedule item");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, currentSchedule, fetchSchedules]
  );

  // Fetch available categories
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      let categoriesData;
      if (USE_MOCK_DATA) {
        categoriesData = await mockDataService.getCategories("schedule");
      } else {
        // Try the categories endpoint with type parameter
        const response = await apiClient.get("/categories", {
          params: {
            type: "schedule",
          },
        });
        categoriesData = response.data || [];
      }

      setCategories(categoriesData);
      return categoriesData;
    } catch (err) {
      console.error("Error fetching categories:", err);
      if (USE_MOCK_DATA) {
        const mockCategories = await mockDataService.getCategories("schedule");
        setCategories(mockCategories);
        return mockCategories;
      }
      setCategories([]);
      return [];
    }
  }, [isAuthenticated]);

  // Fetch all templates with a more robust approach
  const fetchTemplates = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);

      // We're going to try a different endpoint structure since the current one is failing
      // Let's check if the templates might be accessed directly
      let response;
      try {
        // First try the direct schedule templates route
        response = await apiClient.get("/schedule-templates");
      } catch (directError) {
        console.warn(
          "Direct template route failed, trying alternative:",
          directError
        );
        try {
          // Next try the nested route under schedules
          response = await apiClient.get("/schedules/templates");
        } catch (nestedError) {
          console.warn("Nested template route failed too:", nestedError);
          // Provide a fallback empty result
          return [];
        }
      }

      // Process response data
      const templatesData = response.data || [];
      setTemplates(templatesData);
      setError(null);
      return templatesData;
    } catch (err) {
      console.error("Error fetching templates:", err);
      setError(err.message);
      toast.error("Failed to fetch templates");
      // Return empty array on error
      setTemplates([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch a single template
  const fetchTemplateById = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        // Using the correct API endpoint as defined in routes
        const response = await apiClient.get(`/schedules/templates/${id}`);
        setCurrentTemplate(response.data || null);
        setError(null);
        return response.data;
      } catch (err) {
        console.error("Error fetching template:", err);
        setError(err.message);
        toast.error("Failed to fetch template");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Helper function to determine the correct template endpoint
  const getTemplateEndpoint = useCallback(async () => {
    // Try both endpoints and return the one that works
    try {
      await apiClient.get("/schedule-templates");
      return "/schedule-templates";
    } catch (err) {
      try {
        await apiClient.get("/schedules/templates");
        return "/schedules/templates";
      } catch (err2) {
        console.error("Both template endpoints failed:", err, err2);
        return "/schedule-templates"; // Default fallback
      }
    }
  }, []);

  // Create a template
  const createTemplate = useCallback(
    async (data) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        // Try to determine the correct endpoint
        const endpoint = await getTemplateEndpoint();
        const response = await apiClient.post(endpoint, data);

        // Refresh templates
        await fetchTemplates();

        toast.success("Template created successfully");
        return response.data;
      } catch (err) {
        console.error("Error creating template:", err);
        toast.error(err.message || "Failed to create template");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchTemplates, getTemplateEndpoint]
  );

  // Update a template
  const updateTemplate = useCallback(
    async (id, data) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        // Using the correct API endpoint as defined in routes
        const response = await apiClient.put(
          `/schedules/templates/${id}`,
          data
        );

        // Refresh current template
        if (currentTemplate && currentTemplate._id === id) {
          setCurrentTemplate(response.data);
        }

        // Refresh templates list
        await fetchTemplates();

        toast.success("Template updated successfully");
        return response.data;
      } catch (err) {
        console.error("Error updating template:", err);
        toast.error(err.message || "Failed to update template");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, currentTemplate, fetchTemplates]
  );

  // Delete a template
  const deleteTemplate = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        // Using the correct API endpoint as defined in routes
        await apiClient.delete(`/schedules/templates/${id}`);

        // Reset current template if it was deleted
        if (currentTemplate && currentTemplate._id === id) {
          setCurrentTemplate(null);
        }

        // Refresh templates list
        await fetchTemplates();

        toast.success("Template deleted successfully");
      } catch (err) {
        console.error("Error deleting template:", err);
        toast.error(err.message || "Failed to delete template");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, currentTemplate, fetchTemplates]
  );

  // Initialize with a modified version of the `apiClient.get` function that can handle API errors gracefully
  const safeApiGet = async (url, options) => {
    try {
      return await apiClient.get(url, options);
    } catch (err) {
      console.warn(`API call to ${url} failed:`, err);
      return { data: [] }; // Return empty data instead of throwing
    }
  };

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      // Create a function to load all initial data with error handling for each call
      const loadInitialData = async () => {
        if (USE_MOCK_DATA) {
          try {
            // Use mock data for everything
            const mockSchedulesData = await mockDataService.getSchedules();
            const mockCategoriesData = await mockDataService.getCategories(
              "schedule"
            );
            const mockTemplatesData = await mockDataService.getTemplates();
            const mockStatsData = await mockDataService.getStats();

            setSchedules(mockSchedulesData);
            setCategories(mockCategoriesData);
            setTemplates(mockTemplatesData);
            setStats(mockStatsData);
            setError(null);
          } catch (err) {
            console.error("Failed to load mock data:", err);
            setError("Error loading data. Using mock data as fallback.");
          } finally {
            setLoading(false);
          }
        } else {
          // Try to use real API
          try {
            await fetchSchedules();
          } catch (err) {
            console.error("Failed to load schedules:", err);
          }

          try {
            await fetchCategories();
          } catch (err) {
            console.error("Failed to load categories:", err);
          }

          try {
            await fetchTemplates();
          } catch (err) {
            console.error("Failed to load templates:", err);
          }
        }
      };

      loadInitialData();
    }
  }, [isAuthenticated, fetchSchedules, fetchCategories, fetchTemplates]);

  return {
    // Schedule data
    schedules,
    currentSchedule,
    stats,
    loading,
    error,

    // Schedule operations
    fetchSchedules,
    fetchScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,

    // Schedule item operations
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,

    // Categories
    categories,
    fetchCategories,

    // Templates
    templates,
    currentTemplate,
    fetchTemplates,
    fetchTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};

export default useSchedules;
