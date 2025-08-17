import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const useCategories = (type = "working-hours") => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [defaultCategories, setDefaultCategories] = useState([]);
  const isMountedRef = useRef(true);

  const { isAuthenticated } = useAuth();

  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated || !isMountedRef.current) return;

    try {
      setLoading(true);
      const response = await apiClient.get(`/categories?type=${type}`);

      if (!isMountedRef.current) return;

      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories(response.data?.data || []);
      }

      setError(null);
      return response.data?.data || response.data || [];
    } catch (err) {
      console.error("Error fetching categories:", err);
      if (isMountedRef.current) {
        setError(err.message);
        toast.error("Failed to fetch categories");
      }
      return [];
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [isAuthenticated, type]);

  const fetchDefaultCategories = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiClient.get(`/categories/defaults/${type}`);

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

  const addCategory = useCallback(
    async (categoryData) => {
      if (!isAuthenticated) return;

      try {
        const data = { ...categoryData, type };

        const response = await apiClient.post("/categories", data);

        await fetchCategories();

        toast.success("Added!");
        return response.data?.data || response.data;
      } catch (err) {
        console.error("Error adding category:", err);
        toast.error(err.message || "Failed to add category");
        throw err;
      }
    },
    [isAuthenticated, type, fetchCategories]
  );

  const updateCategory = useCallback(
    async (id, categoryData) => {
      if (!isAuthenticated) return;

      try {
        const response = await apiClient.put(`/categories/${id}`, categoryData);

        await fetchCategories();

        toast.success("Updated!");
        return response.data?.data || response.data;
      } catch (err) {
        console.error("Error updating category:", err);
        toast.error(err.message || "Failed to update category");
        throw err;
      }
    },
    [isAuthenticated, fetchCategories]
  );

  const deleteCategory = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        await apiClient.delete(`/categories/${id}`);

        await fetchCategories();

        toast.success("Deleted!");
      } catch (err) {
        console.error("Error deleting category:", err);
        toast.error(err.message || "Failed to delete category");
        throw err;
      }
    },
    [isAuthenticated, fetchCategories]
  );

  useEffect(() => {
    isMountedRef.current = true;

    if (isAuthenticated) {
      fetchCategories();
      fetchDefaultCategories();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [isAuthenticated, type]); // Remove function dependencies to prevent infinite loop

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
