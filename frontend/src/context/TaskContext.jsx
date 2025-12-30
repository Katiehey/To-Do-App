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

  // ✅ Bulk selection state
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Filters now use unified taskStatus
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    taskStatus: undefined,   // unified status filter
    priority: undefined,
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

  // Fetch tasks with filters
  const fetchTasks = useCallback(async (customFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const filterParams = { ...filters, ...customFilters };

      console.log("fetchTasks called with filters:", filterParams);
      

      const payload = await taskService.getTasks(filterParams);
      console.log("payload:", payload);
      setTasks(payload.data.tasks);
      setPagination({
        page: payload.page,
        pages: payload.pages,
        total: payload.total,
        count: payload.count,
      });

      //setSelectedTasks([]);

      console.log("Tasks fetched:", payload.data.tasks.length);  
      return { success: true, data: payload.data.tasks };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch tasks';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Create task
  const createTask = async (taskData) => {
    try {
      setError(null);
      const response = await taskService.createTask(taskData);
      const newTask = response.data.data.task;
      setTasks(prev => [newTask, ...prev]);
      return { success: true, data: newTask };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create task';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    try {
      setError(null);
      const response = await taskService.updateTask(id, taskData);
      const updatedTask = response.data.data.task;
      setTasks(prev =>
        prev.map(task => (task._id === id ? updatedTask : task))
      );
      return { success: true, data: updatedTask };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update task';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Delete task
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

  // NEW: Update task status (replaces toggleTask)
  const updateTaskStatus = async (id, newStatus) => {
  console.log("updateTaskStatus called with:", id, newStatus);
  try {
    setError(null);
    const response = await taskService.updateTask(id, { taskStatus: newStatus });
    console.log("RAW updateTaskStatus response:", response);

    const updatedTask = response.data?.task || response.data?.data?.task;
    const nextTask = response.data?.nextTask || response.data?.data?.nextTask;

    if (!updatedTask) { throw new Error("No task returned from backend"); }

    setTasks(prev => {
      let newTasks = prev.map(task => (task._id === id ? updatedTask : task));
      if (nextTask) {
        newTasks = [nextTask, ...newTasks];
      }
      return newTasks;
    });

    return { success: true, data: { task: updatedTask, nextTask } };
  } catch (err) {
    console.error("updateTaskStatus error:", err);
    const message = err.response?.data?.message || 'Failed to update task status';
    setError(message);
    return { success: false, error: message };
  }
};


  // Filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      taskStatus: undefined,
      priority: undefined,
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  // ✅ Toggle selection with normalized IDs
const toggleSelectTask = (taskId) => {
  const id = String(taskId);
  setSelectedTasks(prev =>
    prev.includes(id)
      ? prev.filter(tid => tid !== id)
      : [...prev, id]
  );
};

// ✅ Select all using normalized IDs
const selectAllTasks = () => {
  setSelectedTasks(tasks.map(task => String(task._id)));
};


  const clearSelection = () => {
    setSelectedTasks([]);
  };

  const bulkDeleteTasks = async (taskIds) => {
    try {
      setError(null);
      await Promise.all(taskIds.map(id => taskService.deleteTask(id)));
      setTasks(prev => prev.filter(task => !taskIds.includes(task._id)));
      clearSelection();
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete tasks';
      setError(message);
      return { success: false, error: message };
    }
  };

  const bulkUpdateTasks = async (taskIds, updates) => {
    try {
      setError(null);
      await Promise.all(taskIds.map(id => taskService.updateTask(id, updates)));
      await fetchTasks();
      clearSelection();
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update tasks';
      setError(message);
      return { success: false, error: message };
    }
  };

  // ✅ Updated value object
  const value = {
    tasks,
    loading,
    error,
    filters,
    pagination,
    selectedTasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateFilters,
    clearFilters,
    toggleSelectTask,
    selectAllTasks,
    clearSelection,
    bulkDeleteTasks,
    bulkUpdateTasks,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
