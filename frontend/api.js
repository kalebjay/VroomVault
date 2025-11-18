// Read the API base URL from the environment variables.
// Vite exposes this as import.meta.env.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * A generic API client to handle requests to the backend.
 * @param {string} endpoint - The API endpoint to call (e.g., '/api/vehicles').
 * @param {object} options - Configuration for the fetch call (method, body, etc.).
 */
const apiClient = async (endpoint, { body, ...customConfig } = {}) => {
  const headers = { 'Content-Type': 'application/json' };

  const config = {
    method: body ? 'POST' : 'GET', // Default to GET if no body, POST if body
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      return Promise.reject(new Error(errorData.detail || `HTTP error! status: ${response.status}`));
    }
    return response.json();
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Fetches a list of vehicles from the backend.
 */
export const getVehicles = () => apiClient('/api/vehicles');