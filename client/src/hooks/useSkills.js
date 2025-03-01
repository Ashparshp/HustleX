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

  // Update multiple skills at once (for reordering)
  const updateMultipleSkills = useCallback(
    async (skillsData) => {
      if (!isAuthenticated) return;

      try {
        // Use individual update calls instead of a batch endpoint
        const updatePromises = skillsData.map(skill => 
          updateSkill(skill.id || skill._id, skill)
        );
        
        // Wait for all updates to complete
        await Promise.all(updatePromises);
        
        // Refresh skills
        await fetchSkills();
        
        toast.success("Skills updated successfully");
        return { success: true };
      } catch (err) {
        console.error("Error updating multiple skills:", err);
        toast.error(err.message || "Failed to update skills");
        throw err;
      }
    },
    [isAuthenticated, fetchSkills, updateSkill]
  );

  // Update skill ordering - use individual updates if reorder endpoint doesn't exist
  const updateSkillOrder = useCallback(
    async (category, orderedSkills) => {
      if (!isAuthenticated) return;
      
      try {
        // Try to use the reorder endpoint first
        try {
          // Create a skills array with only id and orderIndex
          const skillsData = orderedSkills.map((skill, index) => ({
            id: skill.id || skill._id,
            orderIndex: index
          }));
          
          // Call the reorder endpoint
          await apiClient.post('/skills/reorder', { skills: skillsData });
        } catch (err) {
          // If the reorder endpoint fails, fall back to individual updates
          console.log("Reorder endpoint failed, using individual updates instead");
          
          // Update each skill individually
          for (let i = 0; i < orderedSkills.length; i++) {
            const skill = orderedSkills[i];
            await updateSkill(skill.id || skill._id, {
              orderIndex: i,
              name: skill.name,
              category: skill.category
            });
          }
        }
        
        // Refresh skills to get the updated order
        await fetchSkills();
        
        toast.success("Skills reordered successfully");
      } catch (err) {
        console.error("Error updating skill order:", err);
        toast.error(err.message || "Failed to update skill order");
        throw err;
      }
    },
    [isAuthenticated, fetchSkills, updateSkill, apiClient]
  );

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
    updateMultipleSkills,
    deleteSkill,
    getSkillCategories,
    getSkillStats,
    updateSkillOrder
  };
};

export default useSkills;