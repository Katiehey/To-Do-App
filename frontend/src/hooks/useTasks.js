import { useEffect } from 'react';
import { useTask } from '../context/TaskContext';

/**
 * Custom hook to fetch tasks on mount and when filters change
 */
export const useTasks = (autoFetch = true) => {
  const { fetchTasks, tasks, loading, error, filters, pagination } = useTask();

  useEffect(() => {
    if (autoFetch) {
      fetchTasks();
    }
  }, [autoFetch, filters.page, filters.completed, filters.priority, filters.status]);

  return {
    tasks,
    loading,
    error,
    pagination,
    refetch: fetchTasks,
  };
};