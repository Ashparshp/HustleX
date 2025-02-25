// src/hooks/index.js
// Auth hook
export { useAuth } from "../context/AuthContext";

// Data management hooks
export { default as useTimetable } from "./useTimetable";
export { default as useWorkingHours } from "./useWorkingHours";
export { default as useSkills } from "./useSkills";
export { default as useGoals } from "./useGoals"; // Previously useContests
export { default as useSchedule } from "./useSchedule";
export { default as useLeetCode } from "./useLeetCode";
export { default as useCategories } from "./useCategories";
export { default as useTimeTracking } from "./useTimeTracking";

// Theme hook
export { useTheme } from "../context/ThemeContext";


// src/hooks/useCategories.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const useCategories = (type = "working-hours") => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [defaultCategories, setDefaultCategories] = useState([]);

  const { isAuthenticated } = useAuth();

  // Fetch categories for a specific type
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await apiClient.get(`/categories?type=${type}`);
      setCategories(response.data || []);
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message);
      toast.error("Failed to fetch categories");
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, type]);

  // Fetch default categories
  const fetchDefaultCategories = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiClient.get(`/categories/defaults/${type}`);
      setDefaultCategories(response.data || []);
      return response.data;
    } catch (err) {
      console.error("Error fetching default categories:", err);
      return [];
    }
  }, [isAuthenticated, type]);

  // Add a new category
  const addCategory = useCallback(
    async (categoryData) => {
      if (!isAuthenticated) return;

      try {
        // Make sure type is included
        const data = { ...categoryData, type };

        const response = await apiClient.post("/categories", data);

        // Refresh categories
        await fetchCategories();

        toast.success("Category added successfully");
        return response.data;
      } catch (err) {
        console.error("Error adding category:", err);
        toast.error(err.message || "Failed to add category");
        throw err;
      }
    },
    [isAuthenticated, type, fetchCategories]
  );

  // Update a category
  const updateCategory = useCallback(
    async (id, categoryData) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.put(`/categories/${id}`, categoryData);

        // Refresh categories
        await fetchCategories();

        toast.success("Category updated successfully");
        return response.data;
      } catch (err) {
        console.error("Error updating category:", err);
        toast.error(err.message || "Failed to update category");
        throw err;
      }
    },
    [isAuthenticated, fetchCategories]
  );

  // Delete a category
  const deleteCategory = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        await apiClient.delete(`/categories/${id}`);

        // Refresh categories
        await fetchCategories();

        toast.success("Category deleted successfully");
      } catch (err) {
        console.error("Error deleting category:", err);
        toast.error(err.message || "Failed to delete category");
        throw err;
      }
    },
    [isAuthenticated, fetchCategories]
  );

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
      fetchDefaultCategories();
    }
  }, [isAuthenticated, fetchCategories, fetchDefaultCategories]);

  return {
    categories,
    defaultCategories,
    loading,
    error,
    fetchCategories,
    fetchDefaultCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useCategories;

// src/hooks/useGoals.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

// This replaces the old useContests hook
const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [platforms, setPlatforms] = useState([]);

  const { isAuthenticated } = useAuth();

  // Fetch all goals (contests)
  const fetchGoals = useCallback(
    async (platform, participated, startDate, endDate, sort = "date") => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const params = {};

        if (platform) params.platform = platform;
        if (participated !== undefined)
          params.participated = participated.toString();
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (sort) params.sort = sort;

        const response = await apiClient.get("/contests", { params });

        setGoals(response.data || []);

        // Set stats if available
        if (response.stats) {
          setStats(response.stats);
        }

        setError(null);
        return response;
      } catch (err) {
        console.error("Error fetching goals:", err);
        setError(err.message);
        toast.error("Failed to fetch goals");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Add a new goal
  const addGoal = useCallback(
    async (goalData) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.post("/contests", goalData);

        // Refresh goals
        await fetchGoals();

        toast.success("Goal added successfully");
        return response.data;
      } catch (err) {
        console.error("Error adding goal:", err);
        toast.error(err.message || "Failed to add goal");
        throw err;
      }
    },
    [isAuthenticated, fetchGoals]
  );

  // Update a goal
  const updateGoal = useCallback(
    async (id, updateData) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.put(`/contests/${id}`, updateData);

        // Refresh goals
        await fetchGoals();

        toast.success("Goal updated successfully");
        return response.data;
      } catch (err) {
        console.error("Error updating goal:", err);
        toast.error(err.message || "Failed to update goal");
        throw err;
      }
    },
    [isAuthenticated, fetchGoals]
  );

  // Delete a goal
  const deleteGoal = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        await apiClient.delete(`/contests/${id}`);

        // Refresh goals
        await fetchGoals();

        toast.success("Goal deleted successfully");
      } catch (err) {
        console.error("Error deleting goal:", err);
        toast.error(err.message || "Failed to delete goal");
        throw err;
      }
    },
    [isAuthenticated, fetchGoals]
  );

  // Get platforms
  const fetchPlatforms = useCallback(async () => {
    if (!isAuthenticated) return [];

    try {
      const response = await apiClient.get("/contests/platforms");
      setPlatforms(response.platforms || []);
      return response.platforms;
    } catch (err) {
      console.error("Error fetching platforms:", err);
      return [];
    }
  }, [isAuthenticated]);

  // Get goal statistics
  const getGoalStats = useCallback(
    async (startDate, endDate) => {
      if (!isAuthenticated) return null;

      try {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await apiClient.get("/contests/stats", { params });
        setStats(response.stats);
        return response.stats;
      } catch (err) {
        console.error("Error fetching goal stats:", err);
        toast.error("Failed to fetch goal statistics");
        return null;
      }
    },
    [isAuthenticated]
  );

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchGoals();
      fetchPlatforms();
    }
  }, [isAuthenticated, fetchGoals, fetchPlatforms]);

  return {
    goals,
    loading,
    error,
    stats,
    platforms,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    fetchPlatforms,
    getGoalStats,
  };
};

export default useGoals;

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

  // Fetch current LeetCode stats
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await apiClient.get("/leetcode/stats");

      if (response && response.data) {
        setStats(response.data);
      }

      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error fetching LeetCode stats:", err);
      setError(err.message);
      toast.error("Failed to fetch LeetCode stats");
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Update LeetCode stats
  const updateStats = useCallback(
    async (newStats) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const response = await apiClient.post("/leetcode/stats", newStats);

        if (response && response.data) {
          setStats(response.data);
          toast.success("LeetCode stats updated successfully");
        }

        return response.data;
      } catch (err) {
        console.error("Error updating LeetCode stats:", err);
        toast.error(err.message || "Failed to update LeetCode stats");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Fetch LeetCode history
  const fetchHistory = useCallback(
    async (limit = 10) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.get("/leetcode/history", {
          params: { limit },
        });

        if (response && response.data) {
          setHistory(response.data);
        }

        return response.data;
      } catch (err) {
        console.error("Error fetching LeetCode history:", err);
        toast.error("Failed to fetch LeetCode history");
        return [];
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

        toast.success("Stats entry deleted successfully");
      } catch (err) {
        console.error("Error deleting stats entry:", err);
        toast.error(err.message || "Failed to delete stats entry");
        throw err;
      }
    },
    [isAuthenticated, fetchHistory]
  );

  // Calculate progress metrics from stats
  const getProgressMetrics = useCallback(() => {
    // Calculate solve percentages
    const easyPercentage =
      stats.totalEasy > 0 ? (stats.easySolved / stats.totalEasy) * 100 : 0;

    const mediumPercentage =
      stats.totalMedium > 0
        ? (stats.mediumSolved / stats.totalMedium) * 100
        : 0;

    const hardPercentage =
      stats.totalHard > 0 ? (stats.hardSolved / stats.totalHard) * 100 : 0;

    const totalPercentage =
      stats.totalEasy + stats.totalMedium + stats.totalHard > 0
        ? (stats.totalSolved /
            (stats.totalEasy + stats.totalMedium + stats.totalHard)) *
          100
        : 0;

    // Calculate distribution
    const distribution = {
      easy: stats.easySolved,
      medium: stats.mediumSolved,
      hard: stats.hardSolved,
    };

    return {
      easyPercentage,
      mediumPercentage,
      hardPercentage,
      totalPercentage,
      distribution,
    };
  }, [stats]);

  // Initial data load
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchHistory();
    }
  }, [isAuthenticated, fetchStats, fetchHistory]);

  return {
    stats,
    history,
    loading,
    error,
    fetchStats,
    updateStats,
    fetchHistory,
    deleteStatsEntry,
    getProgressMetrics,
  };
};

export default useLeetCode;

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

// src/hooks/useSkills.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const useSkills = () => {
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const { isAuthenticated } = useAuth();

  // Fetch all skills
  const fetchSkills = useCallback(
    async (category, status) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const params = {};
        if (category) params.category = category;
        if (status) params.status = status;

        const response = await apiClient.get("/skills", { params });

        if (response.groupedSkills) {
          setSkills(response.groupedSkills);
        } else {
          // Group skills by category if not already grouped
          const groupedData = (response.data || []).reduce((acc, skill) => {
            if (!acc[skill.category]) {
              acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
          }, {});
          setSkills(groupedData);
        }

        // Set stats if available
        if (response.stats) {
          setStats(response.stats);
        }

        setError(null);
        return response;
      } catch (err) {
        console.error("Error fetching skills:", err);
        setError(err.message);
        toast.error("Failed to fetch skills");
        return {};
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Add a new skill
  const addSkill = useCallback(
    async (skillData) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.post("/skills", skillData);

        // Refresh skills
        await fetchSkills();

        toast.success("Skill added successfully");
        return response.data;
      } catch (err) {
        console.error("Error adding skill:", err);
        toast.error(err.message || "Failed to add skill");
        throw err;
      }
    },
    [isAuthenticated, fetchSkills]
  );

  // Update a skill
  const updateSkill = useCallback(
    async (id, updateData) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.put(`/skills/${id}`, updateData);

        // Refresh skills
        await fetchSkills();

        toast.success("Skill updated successfully");
        return response.data;
      } catch (err) {
        console.error("Error updating skill:", err);
        toast.error(err.message || "Failed to update skill");
        throw err;
      }
    },
    [isAuthenticated, fetchSkills]
  );

  // Delete a skill
  const deleteSkill = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        await apiClient.delete(`/skills/${id}`);

        // Refresh skills
        await fetchSkills();

        toast.success("Skill deleted successfully");
      } catch (err) {
        console.error("Error deleting skill:", err);
        toast.error(err.message || "Failed to delete skill");
        throw err;
      }
    },
    [isAuthenticated, fetchSkills]
  );

  // Get skills categories
  const getSkillCategories = useCallback(async () => {
    if (!isAuthenticated) return [];

    try {
      const response = await apiClient.get("/skills/categories");
      return response.categories || [];
    } catch (err) {
      console.error("Error fetching skill categories:", err);
      return [];
    }
  }, [isAuthenticated]);

  // Get skill statistics
  const getSkillStats = useCallback(async () => {
    if (!isAuthenticated) return null;

    try {
      const response = await apiClient.get("/skills/stats");
      setStats(response.stats);
      return response.stats;
    } catch (err) {
      console.error("Error fetching skill stats:", err);
      toast.error("Failed to fetch skill statistics");
      return null;
    }
  }, [isAuthenticated]);

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchSkills();
    }
  }, [isAuthenticated, fetchSkills]);

  return {
    skills,
    loading,
    error,
    stats,
    fetchSkills,
    addSkill,
    updateSkill,
    deleteSkill,
    getSkillCategories,
    getSkillStats,
  };
};

export default useSkills;

// src/hooks/useTimetable.js
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

// This hook replaces the old useActivityTracker hook
const useTimetable = (timetableId = null) => {
  const [currentWeek, setCurrentWeek] = useState(null);
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTimetable, setActiveTimetable] = useState(null);
  const [stats, setStats] = useState(null);

  const weekCheckIntervalRef = useRef(null);
  const updateInProgress = useRef(false);

  const { isAuthenticated } = useAuth();

  // Check if we need to transition to a new week
  const checkWeekTransition = useCallback(() => {
    if (!currentWeek?.weekEndDate) return false;

    const now = new Date();
    const weekEndDate = new Date(currentWeek.weekEndDate);
    return now > weekEndDate;
  }, [currentWeek?.weekEndDate]);

  // Fetch all timetables
  const fetchTimetables = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await apiClient.get("/timetables");
      setTimetables(response.data || []);

      // Find active timetable
      const active = response.data.find((t) => t.isActive);
      if (active) {
        setActiveTimetable(active);
      }

      return response.data;
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch timetables");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch history for a specific timetable
  const fetchHistory = useCallback(
    async (id, page = 1, limit = 10) => {
      if (!isAuthenticated) return;

      try {
        const timetableIdToUse = id || timetableId || activeTimetable?.id;
        if (!timetableIdToUse) {
          throw new Error("No timetable ID specified");
        }

        const response = await apiClient.get(
          `/timetables/${timetableIdToUse}/history`,
          {
            params: { page, limit },
          }
        );
        return response;
      } catch (error) {
        console.error("Fetch history error:", error);
        toast.error("Failed to fetch timetable history");
        throw error;
      }
    },
    [isAuthenticated, timetableId, activeTimetable?.id]
  );

  // Fetch current week data
  const fetchCurrentWeek = useCallback(async () => {
    if (!isAuthenticated) return;
    if (updateInProgress.current) {
      console.log("Update already in progress, skipping fetch...");
      return;
    }

    try {
      setLoading(true);
      updateInProgress.current = true;

      // If a specific timetable ID is provided, use it
      const endpoint = timetableId
        ? `/timetables/${timetableId}`
        : "/timetables/current-week";

      const response = await apiClient.get(endpoint);

      // If a specific timetable was fetched, extract the current week
      const weekData = timetableId ? response.data.currentWeek : response.data;

      setCurrentWeek(weekData);
      setError(null);
      return weekData;
    } catch (error) {
      console.error("Error fetching current week:", error);
      setError(error.message);
      toast.error("Failed to fetch current week data");
      throw error;
    } finally {
      setLoading(false);
      updateInProgress.current = false;
    }
  }, [isAuthenticated, timetableId]);

  // Toggle activity status
  const toggleActivityStatus = useCallback(
    async (activityId, dayIndex) => {
      if (!isAuthenticated) return;
      if (updateInProgress.current) {
        console.log("Update already in progress, skipping toggle...");
        return;
      }

      const previousWeek = currentWeek;
      updateInProgress.current = true;

      try {
        // Optimistic update
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

        // Determine which timetable ID to use
        const id = timetableId || activeTimetable?.id;
        if (!id) {
          throw new Error("No active timetable found");
        }

        const response = await apiClient.post(`/timetables/${id}/toggle`, {
          activityId,
          dayIndex,
        });

        setCurrentWeek(response.data);
        setError(null);
        return response.data;
      } catch (error) {
        // Rollback on error
        setCurrentWeek(previousWeek);
        setError(error.message);
        toast.error("Failed to update activity status");
        throw error;
      } finally {
        updateInProgress.current = false;
      }
    },
    [isAuthenticated, currentWeek, timetableId, activeTimetable?.id]
  );

  // Get statistics for a timetable
  const getStats = useCallback(
    async (id) => {
      if (!isAuthenticated) return;
      if (updateInProgress.current) {
        console.log("Update in progress, skipping stats fetch...");
        return;
      }

      try {
        updateInProgress.current = true;

        // Determine which timetable ID to use
        const timetableIdToUse = id || timetableId || activeTimetable?.id;
        if (!timetableIdToUse) {
          throw new Error("No timetable ID specified");
        }

        const response = await apiClient.get(
          `/timetables/${timetableIdToUse}/stats`
        );
        setStats(response.data);
        setError(null);
        return response.data;
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError(error.message);
        toast.error("Failed to fetch timetable statistics");
        throw error;
      } finally {
        updateInProgress.current = false;
      }
    },
    [isAuthenticated, timetableId, activeTimetable?.id]
  );

  // Create a new timetable
  const createTimetable = useCallback(
    async (timetableData) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const response = await apiClient.post("/timetables", timetableData);

        // Refresh timetables list
        await fetchTimetables();

        toast.success("Timetable created successfully");
        return response.data;
      } catch (error) {
        setError(error.message);
        toast.error(error.message || "Failed to create timetable");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchTimetables]
  );

  // Update a timetable
  const updateTimetable = useCallback(
    async (id, updates) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const response = await apiClient.put(`/timetables/${id}`, updates);

        // Refresh timetables list
        await fetchTimetables();

        // If this is the active timetable or we're updating the currently viewed timetable
        if (
          (activeTimetable && id === activeTimetable.id) ||
          id === timetableId
        ) {
          await fetchCurrentWeek();
        }

        toast.success("Timetable updated successfully");
        return response.data;
      } catch (error) {
        setError(error.message);
        toast.error(error.message || "Failed to update timetable");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [
      isAuthenticated,
      fetchTimetables,
      fetchCurrentWeek,
      activeTimetable,
      timetableId,
    ]
  );

  // Delete a timetable
  const deleteTimetable = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        await apiClient.delete(`/timetables/${id}`);

        // Refresh timetables list
        await fetchTimetables();

        // If we deleted the active timetable, fetch the new active one
        if (activeTimetable && id === activeTimetable.id) {
          await fetchCurrentWeek();
        }

        toast.success("Timetable deleted successfully");
      } catch (error) {
        setError(error.message);
        toast.error(error.message || "Failed to delete timetable");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchTimetables, fetchCurrentWeek, activeTimetable]
  );

  // Update default activities
  const updateDefaultActivities = useCallback(
    async (id, activities) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        const timetableIdToUse = id || timetableId || activeTimetable?.id;
        if (!timetableIdToUse) {
          throw new Error("No timetable ID specified");
        }

        const response = await apiClient.put(
          `/timetables/${timetableIdToUse}/activities`,
          {
            activities,
          }
        );

        // Refresh current week
        await fetchCurrentWeek();

        toast.success("Activities updated successfully");
        return response.data;
      } catch (error) {
        setError(error.message);
        toast.error(error.message || "Failed to update activities");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchCurrentWeek, timetableId, activeTimetable?.id]
  );

  // Force start a new week
  const startNewWeek = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        const timetableIdToUse = id || timetableId || activeTimetable?.id;
        if (!timetableIdToUse) {
          throw new Error("No timetable ID specified");
        }

        const response = await apiClient.post(
          `/timetables/${timetableIdToUse}/new-week`
        );

        // Refresh current week
        await fetchCurrentWeek();

        toast.success("New week started successfully");
        return response.data;
      } catch (error) {
        setError(error.message);
        toast.error(error.message || "Failed to start new week");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchCurrentWeek, timetableId, activeTimetable?.id]
  );

  // Get categories for timetables
  const getCategories = useCallback(async () => {
    if (!isAuthenticated) return [];

    try {
      const response = await apiClient.get("/timetables/categories");
      return response.categories || [];
    } catch (error) {
      console.error("Error fetching timetable categories:", error);
      return [];
    }
  }, [isAuthenticated]);

  // Set up auto-check for week transition and initial data load
  useEffect(() => {
    if (isAuthenticated) {
      // Initial data load
      fetchTimetables()
        .then(() => fetchCurrentWeek())
        .catch(console.error);

      // Set up weekly check
      const checkAndUpdateWeek = async () => {
        if (checkWeekTransition()) {
          console.log("Week transition detected, refreshing data");
          try {
            await fetchCurrentWeek();
            toast.success("New week started!");
          } catch (err) {
            console.error("Failed to update week:", err);
          }
        }
      };

      // Check immediately
      checkAndUpdateWeek();

      // Set up periodic check (every hour)
      weekCheckIntervalRef.current = setInterval(checkAndUpdateWeek, 3600000);

      return () => {
        if (weekCheckIntervalRef.current) {
          clearInterval(weekCheckIntervalRef.current);
        }
      };
    }
  }, [isAuthenticated, fetchTimetables, fetchCurrentWeek, checkWeekTransition]);

  return {
    currentWeek,
    timetables,
    activeTimetable,
    loading,
    error,
    stats,
    fetchTimetables,
    fetchHistory,
    fetchCurrentWeek,
    toggleActivityStatus,
    getStats,
    createTimetable,
    updateTimetable,
    deleteTimetable,
    updateDefaultActivities,
    startNewWeek,
    getCategories,
  };
};

export default useTimetable;

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

// src/hooks/useWorkingHours.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const defaultStats = {
  averageCompletion: 0,
  totalAchievedHours: 0,
  totalTargetHours: 0,
  moodDistribution: { Productive: 0, Normal: 0, Distracted: 0 },
  categoryBreakdown: {},
};

const useWorkingHours = () => {
  const [workingHours, setWorkingHours] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const { isAuthenticated } = useAuth();

  // Fetch working hours with optional filters
  const fetchWorkingHours = useCallback(
    async (startDate, endDate, category) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const params = {};

        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (category) params.category = category;

        const data = await apiClient.get("/working-hours", { params });

        setWorkingHours(data.workingHours || []);
        setStats(data.stats || defaultStats);
        setError(null);
        return data;
      } catch (err) {
        console.error("Error fetching working hours:", err);
        setError(err.message);
        setStats(defaultStats);
        toast.error("Failed to fetch working hours data");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Add new working hours
  const addWorkingHours = useCallback(
    async (data) => {
      if (!isAuthenticated) return;

      try {
        // Ensure date is in ISO format
        const formattedData = {
          ...data,
          date: new Date(data.date).toISOString(),
        };

        const response = await apiClient.post("/working-hours", formattedData);

        // Refresh data
        await fetchWorkingHours();

        toast.success("Working hours added successfully");
        return response.data;
      } catch (err) {
        console.error("Error adding working hours:", err);
        toast.error(err.message || "Failed to add working hours");
        throw err;
      }
    },
    [isAuthenticated, fetchWorkingHours]
  );

  // Update existing working hours
  const updateWorkingHours = useCallback(
    async (id, data) => {
      if (!isAuthenticated) return;

      try {
        // Ensure date is in ISO format if present
        const formattedData = { ...data };
        if (formattedData.date) {
          formattedData.date = new Date(formattedData.date).toISOString();
        }

        const response = await apiClient.put(
          `/working-hours/${id}`,
          formattedData
        );

        // Refresh data
        await fetchWorkingHours();

        toast.success("Working hours updated successfully");
        return response.data;
      } catch (err) {
        console.error("Error updating working hours:", err);
        toast.error(err.message || "Failed to update working hours");
        throw err;
      }
    },
    [isAuthenticated, fetchWorkingHours]
  );

  // Delete working hours
  const deleteWorkingHours = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        await apiClient.delete(`/working-hours/${id}`);

        // Refresh data
        await fetchWorkingHours();

        toast.success("Working hours deleted successfully");
      } catch (err) {
        console.error("Error deleting working hours:", err);
        toast.error(err.message || "Failed to delete working hours");
        throw err;
      }
    },
    [isAuthenticated, fetchWorkingHours]
  );

  // Get statistics
  const getStats = useCallback(
    async (startDate, endDate) => {
      if (!isAuthenticated) return;

      try {
        const params = {};

        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await apiClient.get("/working-hours/stats", {
          params,
        });
        return response;
      } catch (err) {
        console.error("Error fetching stats:", err);
        toast.error("Failed to fetch working hours statistics");
        throw err;
      }
    },
    [isAuthenticated]
  );

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiClient.get("/working-hours/categories");
      setCategories(response.categories || []);
      return response.categories;
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to fetch categories");
      return [];
    }
  }, [isAuthenticated]);

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkingHours();
      fetchCategories();
    }
  }, [isAuthenticated, fetchWorkingHours, fetchCategories]);

  return {
    workingHours,
    stats,
    loading,
    error,
    categories,
    fetchWorkingHours,
    addWorkingHours,
    updateWorkingHours,
    deleteWorkingHours,
    getStats,
    fetchCategories,
  };
};

export default useWorkingHours;
