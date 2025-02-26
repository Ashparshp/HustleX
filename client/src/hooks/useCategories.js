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
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await apiClient.get(
        `/categories?type=${type}&t=${timestamp}`
      );

      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories(response.data?.data || []);
      }

      setError(null);
      return response.data?.data || response.data || [];
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
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await apiClient.get(
        `/categories/defaults/${type}?t=${timestamp}`
      );

      if (response.data && Array.isArray(response.data)) {
        setDefaultCategories(response.data);
      } else {
        setDefaultCategories(response.data?.data || []);
      }

      return response.data?.data || response.data || [];
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

        // Refresh categories immediately
        await fetchCategories();

        toast.success("Category added successfully");
        return response.data?.data || response.data;
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

        // Refresh categories immediately
        await fetchCategories();

        toast.success("Category updated successfully");
        return response.data?.data || response.data;
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

        // Refresh categories immediately
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
