import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check authentication status
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data.user);
      setError(null);
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      const { user, token } = response.data.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      //setError(message);
      return { success: false, error: message };
    }
  };

  // Login user
const login = async (email, password) => {
  try {
    setError(null);
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const { user, token } = response.data.data;
    localStorage.setItem('token', token);
    setUser(user);
    return { success: true };
  } catch (err) {
    // Determine the error message based on the type of error received
    let message = 'Login failed';

    if (err.response) {
      // This is an API error (e.g., 401 Invalid credentials)
      message = err.response.data?.message || 'Login failed';
    } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        // Handle specific Axios timeout error
        message = 'Connection timed out. Please check your network or try again later.';
    } else {
        // Generic network error (server offline, CORS issue)
        message = 'A network error occurred. Is the server running?';
    }

    // Return the structured error object to Login.jsx
    return { success: false, error: message };
  }
};

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setError(null);
      const response = await api.put('/auth/profile', updates);
      setUser(response.data.data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);
};