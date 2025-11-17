import axios from 'axios';

// Get environment variables
const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost';
const API_PORT = import.meta.env.VITE_API_PORT || '4000';
const API_VERSION = import.meta.env.VITE_API_VERSION || '/api/v1';

// Create base URL
const baseURL = `${API_HOST}:${API_PORT}${API_VERSION}`;

// Create axios instance
const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error handling
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);

      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized access
        console.error('Unauthorized access - please login');
      } else if (error.response.status === 403) {
        // Handle forbidden access
        console.error('Forbidden - insufficient permissions');
      } else if (error.response.status === 404) {
        // Handle not found
        console.error('Resource not found');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
