import { createContext, useState, useContext, useCallback } from 'react';
import taskService from '../services/taskService';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    completed: undefined,
    priority: undefined,
    status: undefined,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    count: 0,
  });

  const fetchTasks = useCallback(async (customFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const filterParams = { ...filters, ...customFilters };
      const response = await taskService.getTasks(filterParams);

      setTasks(response.data.tasks);
      setPagination({
        page: response.page,
        pages: response.pages,
        total: response.total,
        count: response.count,
      });

      return { success: true, data: response.data.tasks };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch tasks';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTask = async (taskData) => {
    try {
      setError(null);
      const response = await taskService.createTask(taskData);
      setTasks(prev => [response.data.task, ...prev]);
      return { success: true, data: response.data.task };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create task';
      setError(message);
      return { success: false, error: message };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      setError(null);
      const response = await taskService.updateTask(id, taskData);
      setTasks(prev =>
        prev.map(task => (task._id === id ? response.data.task : task))
      );
      return { success: true, data: response.data.task };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update task';
      setError(message);
      return { success: false, error: message };
    }
  };

  const deleteTask = async (id) => {
    try {
      setError(null);
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete task';
      setError(message);
      return { success: false, error: message };
    }
  };

  const toggleTask = async (id) => {
    try {
      setError(null);
      const response = await taskService.toggleTask(id);
      setTasks(prev =>
        prev.map(task => (task._id === id ? response.data.task : task))
      );
      return { success: true, data: response.data.task };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to toggle task';
      setError(message);
      return { success: false, error: message };
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      completed: undefined,
      priority: undefined,
      status: undefined,
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const value = {
    tasks,
    loading,
    error,
    filters,
    pagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    updateFilters,
    clearFilters,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
