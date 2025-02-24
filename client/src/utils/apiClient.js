// src/utils/apiClient.js
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom fetch wrapper that handles authentication and common options
 * @param {string} endpoint - API endpoint to call (without the base URL)
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise} - Fetch promise
 */
const apiClient = async (endpoint, options = {}) => {
  const url = `${API_URL}/api${endpoint}`;
  
  // Get auth token from localStorage
  const token = localStorage.getItem('token');
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add auth token if it exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  // Request options
  const config = {
    ...options,
    headers,
    credentials: 'include',
  };
  
  // If body is provided and not a FormData, stringify it
  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }
  
  try {
    const response = await fetch(url, config);
    
    // Handle common HTTP errors
    if (response.status === 401) {
      // Clear token on authentication error
      localStorage.removeItem('token');
      throw new Error('Authentication failed. Please log in again.');
    }
    
    if (response.status === 403) {
      throw new Error('You do not have permission to access this resource.');
    }
    
    if (response.status === 404) {
      throw new Error('The requested resource was not found.');
    }
    
    if (response.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    
    // For non-204 responses, parse JSON
    const data = response.status !== 204 ? await response.json() : null;
    
    // Throw error if response is not ok
    if (!response.ok) {
      throw new Error(data?.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    // Enhance error with additional context
    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }
    
    if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
      throw new Error('Network error. Please check your connection.');
    }
    
    // Re-throw the error for the caller to handle
    throw error;
  }
};

// Helper methods for common HTTP methods
apiClient.get = (endpoint, options = {}) => 
  apiClient(endpoint, { ...options, method: 'GET' });

apiClient.post = (endpoint, body, options = {}) => 
  apiClient(endpoint, { ...options, method: 'POST', body });

apiClient.put = (endpoint, body, options = {}) => 
  apiClient(endpoint, { ...options, method: 'PUT', body });

apiClient.patch = (endpoint, body, options = {}) => 
  apiClient(endpoint, { ...options, method: 'PATCH', body });

apiClient.delete = (endpoint, options = {}) => 
  apiClient(endpoint, { ...options, method: 'DELETE' });

export default apiClient;