import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import TaskStats from '../components/tasks/TaskStats';
import TaskList from '../components/tasks/TaskList';
import AddTaskModal from '../components/tasks/AddTaskModal';
import FilterBar from '../components/tasks/FilterBar';
import Pagination from '../components/common/Pagination';
import ResultsInfo from '../components/common/ResultsInfo';
import BulkActionsBar from '../components/tasks/BulkActionsBar';
import ViewModeSwitcher from '../components/tasks/ViewModeSwitcher';
import CompactTaskItem from '../components/tasks/CompactTaskItem';
import KeyboardShortcuts from '../components/tasks/KeyboardShortcuts';

const Tasks = () => {
  const { user, logout } = useAuth();
  const {
    tasks,
    loading,
    filters,
    pagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateFilters,
    clearFilters,
    selectedTasks,
    toggleSelectTask,
    selectAllTasks,
    clearSelection,
    bulkDeleteTasks,
    bulkUpdateTasks,
  } = useTask();

  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // ✅ new state for view mode

  // ✅ Sync page from URL on mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(queryParams.get('page')) || 1;
    if (pageFromUrl !== filters.page) {
      updateFilters({ page: pageFromUrl });
    }
  }, [location.search]);

  // Fetch tasks whenever filters change
  useEffect(() => {
    fetchTasks();
  }, [
    fetchTasks,
    filters.page,
    filters.limit,
    filters.taskStatus,
    filters.priority,
    filters.search,
    filters.sortBy,
    filters.sortOrder,
  ]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleAddTask = async (taskData) => {
    const result = await createTask(taskData);
    if (result.success) {
      await fetchTasks();
      setIsModalOpen(false);
    }
    return result;
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleUpdateTask = async (taskData) => {
    const result = await updateTask(editingTask._id, taskData);
    if (result.success) {
      await fetchTasks();
      setIsModalOpen(false);
    }
    return result;
  };

  const handleDeleteTask = async (id) => {
    const result = await deleteTask(id);
    if (result.success) {
      await fetchTasks();
    }
    return result;
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const result = await updateTaskStatus(id, newStatus);
    if (result.success) {
      await fetchTasks();
    }
    return result;
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  // ✅ Update URL when page changes
  const handlePageChange = (page) => {
  if (page >= 1 && page <= pagination.pages) {
    navigate(`/tasks?page=${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-lg flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <User className="w-10 h-10 text-blue-600 p-2 bg-blue-100 rounded-full" />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
            <div className="flex items-center space-x-3">
              <ViewModeSwitcher currentView={viewMode} onViewChange={setViewMode} />
              <button
                onClick={handleOpenModal}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-150 text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </button>
            </div>
          </div>

          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          <ResultsInfo
            itemsPerPage={filters.limit}
            totalCount={pagination.total}
            currentPage={pagination.page}
            totalPages={pagination.pages}
          />

          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500">No tasks found.</p>
          ) : viewMode === 'list' ? (
            <TaskList
              tasks={tasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onUpdateStatus={handleUpdateStatus}
              selectedTasks={selectedTasks}
              onSelect={toggleSelectTask}
            />
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <CompactTaskItem
                  key={task._id}
                  task={task}
                  onToggle={(id) =>
                    updateTaskStatus(id, task.taskStatus === 'completed' ? 'pending' : 'completed')
                  }
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  isSelected={selectedTasks.includes(task._id)}
                  onSelect={toggleSelectTask}
                />
              ))}
            </div>
          )}

          <Pagination
            currentPage={filters.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        initialTask={editingTask}
      />

      {/* ✅ Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedTasks.length}
        onMarkComplete={() => bulkUpdateTasks(selectedTasks, { taskStatus: 'completed' })}
        onMarkIncomplete={() => bulkUpdateTasks(selectedTasks, { taskStatus: 'pending' })}
        onDelete={() => bulkDeleteTasks(selectedTasks)}
        onClear={clearSelection}
        onSelectAll={() => {
          if (selectedTasks.length === tasks.length) {
            clearSelection();   // ✅ toggle: deselect all
          } else {
            selectAllTasks();   // ✅ select all
          }
        }}
      />

      {/* ✅ Keyboard Shortcuts */}
      <KeyboardShortcuts
        onNewTask={handleOpenModal}
        onFocusSearch={() => {
          const searchInput = document.querySelector('#task-search'); // give your search input an id
          searchInput?.focus();
        }}
        onSelectAll={selectAllTasks}
        onClearSelection={clearSelection}
      />

    </div>
  );
};

export default Tasks;
