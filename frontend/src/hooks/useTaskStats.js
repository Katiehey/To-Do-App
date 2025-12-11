import { useState, useEffect } from 'react';
import taskService from '../services/taskService';

/**
 * Custom hook to fetch task statistics
 */
export const useTaskStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getStats();
      setStats(response.data.stats);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch statistics';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};