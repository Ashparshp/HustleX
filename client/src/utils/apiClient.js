const API_URL = import.meta.env.VITE_API_URL;

// Request deduplication cache
const pendingRequests = new Map();

const apiClient = async (endpoint, options = {}) => {
  const url = `${API_URL}/api${endpoint}`;
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: "include",
  };

  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  // Create a unique key for this request
  const requestKey = `${config.method || "GET"}:${url}:${JSON.stringify(
    config.params || {}
  )}`;

  // For GET requests, check if there's already a pending identical request
  if (!config.method || config.method === "GET") {
    if (pendingRequests.has(requestKey)) {
      // Return the existing promise
      return pendingRequests.get(requestKey);
    }
  }

  const requestPromise = (async () => {
    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Authentication failed. Please log in again.");
      }

      if (response.status === 403) {
        throw new Error("You do not have permission to access this resource.");
      }

      if (response.status === 404) {
        throw new Error("The requested resource was not found.");
      }

      if (response.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      }

      const data = response.status !== 204 ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request was cancelled");
      }

      if (
        error.name === "TypeError" &&
        error.message.includes("NetworkError")
      ) {
        throw new Error("Network error. Please check your connection.");
      }

      throw error;
    } finally {
      // Clean up the pending request
      pendingRequests.delete(requestKey);
    }
  })();

  // Store the promise for GET requests
  if (!config.method || config.method === "GET") {
    pendingRequests.set(requestKey, requestPromise);
  }

  return requestPromise;
};

apiClient.get = (endpoint, options = {}) =>
  apiClient(endpoint, { ...options, method: "GET" });

apiClient.post = (endpoint, body, options = {}) =>
  apiClient(endpoint, { ...options, method: "POST", body });

apiClient.put = (endpoint, body, options = {}) =>
  apiClient(endpoint, { ...options, method: "PUT", body });

apiClient.patch = (endpoint, body, options = {}) =>
  apiClient(endpoint, { ...options, method: "PATCH", body });

apiClient.delete = (endpoint, options = {}) =>
  apiClient(endpoint, { ...options, method: "DELETE" });

export default apiClient;
