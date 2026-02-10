import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config.url.endsWith('/auth/login');

    // Check for 401 AND ensure it's NOT the login endpoint
    if (error.response?.status === 401 && !isLoginEndpoint) {
      // This logic only runs when a user is on a protected page
      // and their token has expired (401 on /tasks, /projects, etc.)
      
      localStorage.removeItem('token');
      
      // Use window.location.replace to maintain history, but the reload is still necessary
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
    
    // ⚠️ IMPORTANT: Always reject the promise so Login.jsx can catch the error
    return Promise.reject(error);
  }
);

// API methods
export const apiClient = {
  // Health check
  healthCheck: () => api.get('/health'),
  
  // Test endpoint
  testPing: () => api.get('/test/ping'),
};

export default api;