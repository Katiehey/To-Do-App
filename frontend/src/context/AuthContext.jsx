import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; // axios instance

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token')); // NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.data.user);
      setError(null);
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
  try {
    console.log('🔧 [DEBUG] AuthContext.register called');
    console.log('🔧 [DEBUG] API URL base:', api.defaults.baseURL);
    
    setError(null);
    const response = await api.post('/auth/register', { name, email, password });
    
    console.log('✅ [DEBUG] Response received:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    
    console.log('📊 [DEBUG] Expected path: response.data.data');
    console.log('📊 [DEBUG] Actual response.data:', response.data);
    console.log('📊 [DEBUG] response.data.data:', response.data?.data);
    console.log('📊 [DEBUG] response.data.data?.user:', response.data?.data?.user);
    console.log('📊 [DEBUG] response.data.data?.token:', response.data?.data?.token);
    
    // DEBUG: Try different response structures
    const user = response.data?.data?.user || response.data?.user;
    const token = response.data?.data?.token || response.data?.token;
    
    console.log('🔍 [DEBUG] Extracted user:', user);
    console.log('🔍 [DEBUG] Extracted token:', token);
    
    if (user && token) {
      localStorage.setItem('token', token);
      setUser(user);
      setToken(token);
      return { success: true };
    } else {
      console.error('❌ [DEBUG] Could not extract user/token from response');
      return { 
        success: false, 
        error: 'Invalid response from server' 
      };
    }
    
  } catch (err) {
    console.error('❌ [DEBUG] Registration error caught:', err);
    console.error('❌ [DEBUG] Error response:', err.response?.data);
    console.error('❌ [DEBUG] Error message:', err.message);
    
    const message = err.response?.data?.message || err.message || 'Registration failed';
    return { success: false, error: message };
  }
};

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      localStorage.setItem('token', token);
      setUser(user);
      setToken(token);
      return { success: true };
    } catch (err) {
      let message = err.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setError(null);
  };

  const value = {
    user,
    token, // expose token
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
