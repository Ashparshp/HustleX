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
