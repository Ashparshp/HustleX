// src/hooks/useSkills.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const useSkills = () => {
  const [skills, setSkills] = useState({});
  const [allSkills, setAllSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const { isAuthenticated } = useAuth();

  // Fetch all skills for the authenticated user
  const fetchSkills = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/skills");

      // Store all skills in a flat array
      setAllSkills(response.data || []);

      // Group skills by category
      const groupedSkills = (response.data || []).reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {});

      setSkills(groupedSkills);
      return response;
    } catch (error) {
      console.error("Error fetching skills:", error);
      setError(error.message);
      toast.error("Failed to fetch skills");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch skill categories
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiClient.get("/skills/categories");
      setCategories(response.categories || []);
      return response.categories;
    } catch (error) {
      console.error("Error fetching skill categories:", error);
      toast.error("Failed to fetch skill categories");
      return [];
    }
  }, [isAuthenticated]);

  // Add a new skill
  const addSkill = useCallback(
    async (skillData) => {
      if (!isAuthenticated) return;

      try {
        if (!skillData.name || !skillData.category) {
          throw new Error("Name and category are required");
        }

        const response = await apiClient.post("/skills", skillData);

        // Refresh skills list
        await fetchSkills();
        toast.success("Skill added successfully");
        return response.data;
      } catch (error) {
        console.error("Error adding skill:", error);
        setError(error.message);
        toast.error(error.message || "Failed to add skill");
        throw error;
      }
    },
    [isAuthenticated, fetchSkills]
  );

  // Update a skill
  const updateSkill = useCallback(
    async (id, updateData) => {
      if (!isAuthenticated) return;

      try {
        if (!id) throw new Error("Skill ID is required");

        const response = await apiClient.put(`/skills/${id}`, updateData);

        // Refresh skills list
        await fetchSkills();
        toast.success("Skill updated successfully");
        return response.data;
      } catch (error) {
        console.error("Error updating skill:", error);
        setError(error.message);
        toast.error(error.message || "Failed to update skill");
        throw error;
      }
    },
    [isAuthenticated, fetchSkills]
  );

  // Delete a skill
  const deleteSkill = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        if (!id) throw new Error("Skill ID is required");

        await apiClient.delete(`/skills/${id}`);

        // Refresh skills list
        await fetchSkills();
        toast.success("Skill deleted successfully");
      } catch (error) {
        console.error("Error deleting skill:", error);
        setError(error.message);
        toast.error(error.message || "Failed to delete skill");
        throw error;
      }
    },
    [isAuthenticated, fetchSkills]
  );

  // Get skill statistics
  const getStats = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiClient.get("/skills/stats");
      setStats(response.stats);
      return response.stats;
    } catch (error) {
      console.error("Error fetching skill stats:", error);
      toast.error("Failed to fetch skill statistics");
      throw error;
    }
  }, [isAuthenticated]);

  // Initialize skills and categories on auth change
  useEffect(() => {
    if (isAuthenticated) {
      fetchSkills().catch(console.error);
      fetchCategories().catch(console.error);
      getStats().catch(console.error);
    }
  }, [isAuthenticated, fetchSkills, fetchCategories, getStats]);

  return {
    skills,
    allSkills,
    categories,
    loading,
    error,
    stats,
    fetchSkills,
    fetchCategories,
    addSkill,
    updateSkill,
    deleteSkill,
    getStats,
  };
};

export default useSkills;
