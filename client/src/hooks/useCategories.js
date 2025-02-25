// src/hooks/useCategories.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const useCategories = (type) => {
  const [categories, setCategories] = useState([]);
  const [defaultCategories, setDefaultCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();

  // Validate category type
  const categoryType = type || "working-hours";
  const validTypes = [
    "working-hours",
    "skills",
    "schedule",
    "timetable",
    "goals",
  ];

  if (!validTypes.includes(categoryType)) {
    console.warn(
      `Invalid category type: ${categoryType}. Using 'working-hours' instead.`
    );
  }

  // Fetch categories for the specified type
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);

      const response = await apiClient.get("/categories", {
        params: { type: categoryType },
      });

      setCategories(response.data || []);
      setError(null);

      return response.data;
    } catch (error) {
      console.error(`Error fetching ${categoryType} categories:`, error);
      setError(error.message);
      toast.error(`Failed to fetch categories`);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, categoryType]);

  // Fetch default categories
  const fetchDefaultCategories = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiClient.get(
        `/categories/defaults/${categoryType}`
      );

      setDefaultCategories(response.data || []);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching default ${categoryType} categories:`,
        error
      );
      return [];
    }
  }, [isAuthenticated, categoryType]);

  // Create a new category
  const createCategory = useCallback(
    async (categoryData) => {
      if (!isAuthenticated) return;

      try {
        // Validate required fields
        if (!categoryData.name) {
          throw new Error("Category name is required");
        }

        const response = await apiClient.post("/categories", {
          ...categoryData,
          type: categoryType,
        });

        // Refresh categories
        await fetchCategories();

        toast.success("Category created successfully");
        return response.data;
      } catch (error) {
        console.error("Error creating category:", error);
        setError(error.message);
        toast.error(error.message || "Failed to create category");
        throw error;
      }
    },
    [isAuthenticated, categoryType, fetchCategories]
  );

  // Update a category
  const updateCategory = useCallback(
    async (id, updateData) => {
      if (!isAuthenticated) return;

      try {
        if (!id) throw new Error("Category ID is required");

        const response = await apiClient.put(`/categories/${id}`, updateData);

        // Refresh categories
        await fetchCategories();

        toast.success("Category updated successfully");
        return response.data;
      } catch (error) {
        console.error("Error updating category:", error);
        setError(error.message);
        toast.error(error.message || "Failed to update category");
        throw error;
      }
    },
    [isAuthenticated, fetchCategories]
  );

  // Delete a category
  const deleteCategory = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        if (!id) throw new Error("Category ID is required");

        await apiClient.delete(`/categories/${id}`);

        // Refresh categories
        await fetchCategories();

        toast.success("Category deleted successfully");
      } catch (error) {
        console.error("Error deleting category:", error);
        setError(error.message);
        toast.error(error.message || "Failed to delete category");
        throw error;
      }
    },
    [isAuthenticated, fetchCategories]
  );

  // Import default categories
  const importDefaultCategories = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      // Get default categories if not already loaded
      const defaults =
        defaultCategories.length > 0
          ? defaultCategories
          : await fetchDefaultCategories();

      if (!defaults || !defaults.length) {
        throw new Error("No default categories available");
      }

      // Create each default category
      for (const category of defaults) {
        await createCategory(category);
      }

      toast.success("Default categories imported successfully");
    } catch (error) {
      console.error("Error importing default categories:", error);
      setError(error.message);
      toast.error(error.message || "Failed to import default categories");
      throw error;
    }
  }, [
    isAuthenticated,
    defaultCategories,
    fetchDefaultCategories,
    createCategory,
  ]);

  // Initialize data on auth change
  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories().catch(console.error);
      fetchDefaultCategories().catch(console.error);
    }
  }, [isAuthenticated, fetchCategories, fetchDefaultCategories]);

  return {
    categories,
    defaultCategories,
    loading,
    error,
    fetchCategories,
    fetchDefaultCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    importDefaultCategories,
  };
};

export default useCategories;