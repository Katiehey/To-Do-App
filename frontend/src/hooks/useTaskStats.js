import { useState, useEffect } from 'react';
import taskService from '../services/taskService';

/**
 * Custom hook to fetch task statistics
 * Normalizes stats into unified taskStatus categories
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

      // Normalize backend stats into unified structure
      const rawStats = response.data.stats || {};
      const overall = {
        total: rawStats.total || 0,
        pending: rawStats.pending || 0,
        "in-progress": rawStats["in-progress"] || 0,
        completed: rawStats.completed || 0,
        archived: rawStats.archived || 0,
      };

      setStats({ overall: [overall] });
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
