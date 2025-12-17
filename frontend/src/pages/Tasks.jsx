import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Plus, Loader, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
// Components
import TaskList from '../components/tasks/TaskList';
import TaskStats from '../components/tasks/TaskStats';
import AddTaskModal from '../components/tasks/AddTaskModal';
import FilterBar from '../components/tasks/FilterBar';
import Pagination from '../components/common/Pagination';
import ResultsInfo from '../components/common/ResultsInfo';
import BulkActionsBar from '../components/tasks/BulkActionsBar';
import ViewModeSwitcher from '../components/tasks/ViewModeSwitcher';
import CompactTaskItem from '../components/tasks/CompactTaskItem';
import KeyboardShortcuts from '../components/tasks/KeyboardShortcuts';
// Project Imports
import { useProject } from '../context/ProjectContext';
import ProjectSidebar from '../components/projects/ProjectSidebar';
import ProjectQuickStats from '../components/projects/ProjectQuickStats';
import ProjectModal from '../components/projects/ProjectModal'; // Ensure this is imported

const Tasks = () => {
  const { user, logout } = useAuth();
  
  // Task Context
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

  // Project Context
  const { projects, fetchProjects, createProject, updateProject } = useProject(); // Destructure project context

  const navigate = useNavigate();
  const location = useLocation();

  // Task State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // ✅ new state for view mode
  
  // Project State
  const [activeProjectId, setActiveProjectId] = useState(null); // Tracks selected project in sidebar
  const [showProjectModal, setShowProjectModal] = useState(false); // Controls ProjectModal visibility

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ✅ Sync page from URL on mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(queryParams.get('page')) || 1;
    if (pageFromUrl !== filters.page) {
      updateFilters({ page: pageFromUrl });
    }
  }, [location.search]);

  // 👇 NEW: Update filters when active project changes
  useEffect(() => {
    if (activeProjectId) {
      // Filter tasks by the selected project, reset page to 1
      updateFilters({ ...filters, project: activeProjectId, page: 1 });
    } else {
      // Viewing all tasks: remove project filter
      const { project, ...otherFilters } = filters;
      updateFilters({ ...otherFilters, page: 1 });
    }
    // Clear selection whenever the filter changes
    clearSelection();
  }, [activeProjectId]);


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
    filters.project, // NEW dependency
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
  
  // Project Handlers
  const handleProjectSelect = (projectId) => {
    setActiveProjectId(projectId);
  };
  
  const handleCreateProjectFromSidebar = () => {
    setShowProjectModal(true);
  };
  
  const handleAddProject = async (projectData) => {
    const result = await createProject(projectData);
    if (result.success) {
      await fetchProjects(); // Refresh the sidebar list
    }
    return result;
  };

  // Task Handlers
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

  // Bulk Action Handlers
  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} selected tasks?`)) {
        await bulkDeleteTasks(selectedTasks);
    }
  };

  const handleBulkMarkComplete = async () => {
    await bulkUpdateTasks(selectedTasks, { taskStatus: 'completed' });
  };

  const handleBulkMarkIncomplete = async () => {
    await bulkUpdateTasks(selectedTasks, { taskStatus: 'pending' });
  };
  
  const handleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      clearSelection();
    } else {
      selectAllTasks();
    }
  };

  // ✅ Update URL when page changes
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.pages) {
      updateFilters({ page });
      navigate(`/tasks?page=${page}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
  await handleUpdateStatus(id, newStatus);
};


  // Find the active project object
const activeProject = projects.find(p => p._id === activeProjectId);

// Calculate stats from tasks array
let projectStats;
if (activeProjectId) {
  const projectTasks = tasks.filter(t => t.project?._id === activeProjectId);
  const total = projectTasks.length;
  const completed = projectTasks.filter(t => t.taskStatus === 'completed').length;
  const pending = total - completed;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  projectStats = { total, completed, pending, progress };
} else {
  const total = tasks.length;
  const completed = tasks.filter(t => t.taskStatus === 'completed').length;
  const pending = total - completed;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  projectStats = { total, completed, pending, progress };
}


  return (
  <div className="min-h-screen bg-gray-50 relative">
    {/* Outer container: full width on mobile, centered max width on desktop */}
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:max-w-7xl lg:mx-auto">

      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-lg flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <User className="w-10 h-10 text-blue-600 p-2 bg-blue-100 rounded-full" />
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-red-100 hover:text-red-600 transition"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>

      {/* Main Content with Sidebar */}
      <div className="lg:flex lg:space-x-6">
        
        {/* Sidebar (hidden on mobile, visible on lg+) */}
        <ProjectSidebar 
          projects={projects || []}
          tasks={tasks || []}
          activeProjectId={activeProjectId}
          onProjectSelect={handleProjectSelect}
          onCreateProject={handleCreateProjectFromSidebar}
        />
        
        {/* Main Content (full width on mobile, flex-grow on desktop) */}
        <div className="w-full lg:flex-grow">
          
          {/* Project Quick Stats */}
          <ProjectQuickStats
            project={activeProject}
            stats={projectStats}
          />

          {/* Task Controls and Filter */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
           
            {/* Control Bar */}
<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 border-b pb-4 gap-4">
  {/* Left group */}
  <div className="flex items-center space-x-4">
    <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
    {tasks.length > 0 && (
      <button
        onClick={handleSelectAll}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
        aria-label={selectedTasks.length === tasks.length ? 'Deselect All' : 'Select All'}
      >
        {selectedTasks.length === tasks.length ? 'Deselect All' : 'Select All'}
      </button>
    )}
  </div>

  {/* Right group: responsive grid with equal buttons */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto sm:ml-auto">
    <button
      onClick={() => setViewMode('list')}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${
        viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
      }`}
    >
      List View
    </button>
    <button
      onClick={() => setViewMode('compact')}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${
        viewMode === 'compact' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
      }`}
    >
      Compact View
    </button>
    <button
      onClick={handleOpenModal}
      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-blue-700 transition text-sm font-medium"
    >
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

            {/* Task List Section */}
            {loading ? (
              <div className="p-8 flex justify-center items-center">
                <Loader className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Loading tasks...</span>
              </div>
            ) : tasks.length === 0 ? (
              <p className="text-gray-500 p-8 text-center border rounded-lg">
                No tasks found matching current filters.
              </p>
            ) : viewMode === 'list' ? (
              <TaskList
                tasks={tasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onUpdateStatus={handleUpdateStatus}
                selectedTasks={selectedTasks}
                onSelectTask={toggleSelectTask}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tasks.map((task) => (
                  <CompactTaskItem
  key={task._id}
  task={task}
  onToggle={handleToggleStatus}   // ✅ use the new handler
  onEdit={handleEditTask}
  onDelete={handleDeleteTask}
  isSelected={selectedTasks.includes(task._id)}
  onSelect={toggleSelectTask}
/>

                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <Pagination
                currentPage={filters.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals and Footer */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        initialTask={editingTask}
        projects={projects}
        defaultProjectId={activeProjectId}
      />
      
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSubmit={handleAddProject}
      />
      
      <BulkActionsBar
        selectedCount={selectedTasks.length}
        onMarkComplete={handleBulkMarkComplete}
        onMarkIncomplete={handleBulkMarkIncomplete}
        onDelete={handleBulkDelete}
        onClear={clearSelection}
      />

      <KeyboardShortcuts />
    </div>
  </div>
);

};


export default Tasks;