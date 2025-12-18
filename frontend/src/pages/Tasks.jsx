import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Plus, Loader, LogOut } from 'lucide-react';
import { useState, useEffect, useCallback  } from 'react';
import { useTask } from '../context/TaskContext';

// Components
import TaskList from '../components/tasks/TaskList';
import AddTaskModal from '../components/tasks/AddTaskModal';
import FilterBar from '../components/tasks/FilterBar';
import Pagination from '../components/common/Pagination';
import ResultsInfo from '../components/common/ResultsInfo';
import BulkActionsBar from '../components/tasks/BulkActionsBar';
import CompactTaskItem from '../components/tasks/CompactTaskItem';
import KeyboardShortcuts from '../components/tasks/KeyboardShortcuts';

// Project Imports
import { useProject } from '../context/ProjectContext';
import ProjectSidebar from '../components/projects/ProjectSidebar';
import ProjectQuickStats from '../components/projects/ProjectQuickStats';
import ProjectModal from '../components/projects/ProjectModal';

const Tasks = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
  const { projects, fetchProjects, createProject } = useProject();

  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // 1. Initial Data Fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // 2. Sync page from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(queryParams.get('page')) || 1;
    if (pageFromUrl !== filters.page) {
      updateFilters({ page: pageFromUrl });
    }
  }, [location.search]);

  // 3. Update filters when project selection changes
  useEffect(() => {
    if (activeProjectId) {
      updateFilters({ ...filters, project: activeProjectId, page: 1 });
    } else {
      const { project, ...otherFilters } = filters;
      updateFilters({ ...otherFilters, page: 1 });
    }
    clearSelection();
  }, [activeProjectId]);

  // 4. Fetch tasks on filter change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, filters]);

  // --- Handlers ---

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
    if (result.success) await fetchTasks();
    return result;
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const result = await updateTaskStatus(id, newStatus);
    if (result.success) await fetchTasks();
    return result;
  };

  // --- Bulk Handlers ---

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedTasks.length} tasks?`)) {
      await bulkDeleteTasks(selectedTasks);
    }
  };

  const handleBulkMarkComplete = () => bulkUpdateTasks(selectedTasks, { taskStatus: 'completed' });
  const handleBulkMarkIncomplete = () => bulkUpdateTasks(selectedTasks, { taskStatus: 'pending' });

  const handleBulkMoveToProject = async (projectId) => {
    const result = await bulkUpdateTasks(selectedTasks, { project: projectId });
    if (result.success) {
      await fetchTasks();
      clearSelection();
    }
  };

  const handleSelectAll = () => {
    selectedTasks.length === tasks.length ? clearSelection() : selectAllTasks();
  };

  // --- Stats Calculation ---
  const activeProject = projects.find(p => p._id === activeProjectId);
  const total = tasks.length;
  const completed = tasks.filter(t => t.taskStatus === 'completed').length;
  const projectStats = {
    total,
    completed,
    pending: total - completed,
    progress: total > 0 ? Math.round((completed / total) * 100) : 0
  };

  const handleToggleSelect = useCallback((id) => {
  toggleSelectTask(id);
}, [toggleSelectTask]);


  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:max-w-7xl lg:mx-auto">
        
        {/* Header */}
        <header className="bg-white p-6 rounded-xl shadow-lg flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <User className="w-10 h-10 text-blue-600 p-2 bg-blue-100 rounded-full" />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Welcome, {user?.name}!</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-red-50 hover:text-red-600 transition">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </header>

        <div className="lg:flex lg:space-x-6">
          <ProjectSidebar 
            projects={projects || []}
            activeProjectId={activeProjectId}
            onProjectSelect={setActiveProjectId}
            onCreateProject={() => setShowProjectModal(true)}
          />
          
          <main className="w-full lg:flex-grow">
            <ProjectQuickStats project={activeProject} stats={projectStats} />

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 border-b pb-4 gap-4">
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
                  {tasks.length > 0 && (
                    <button onClick={handleSelectAll} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      {selectedTasks.length === tasks.length ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
                  <button onClick={() => setViewMode('list')} className={`px-3 py-2 rounded-lg text-sm font-medium ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>List</button>
                  <button onClick={() => setViewMode('compact')} className={`px-3 py-2 rounded-lg text-sm font-medium ${viewMode === 'compact' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Compact</button>
                  <button onClick={handleOpenModal} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-blue-700 transition text-sm font-medium">+ Add Task</button>
                </div>
              </div>

              <FilterBar filters={filters} onFilterChange={updateFilters} onClearFilters={clearFilters} />
              
              <ResultsInfo itemsPerPage={filters.limit} totalCount={pagination.total} currentPage={pagination.page} totalPages={pagination.pages} />

              {loading ? (
                <div className="p-8 flex justify-center"><Loader className="animate-spin text-blue-500" /></div>
              ) : tasks.length === 0 ? (
                <p className="text-gray-500 p-8 text-center border rounded-lg">No tasks found.</p>
              ) : viewMode === 'list' ? (
                <TaskList tasks={tasks} onEdit={handleEditTask} onDelete={handleDeleteTask} onUpdateStatus={handleUpdateStatus} selectedTasks={selectedTasks} onSelectTask={toggleSelectTask} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tasks.map(task => (
                    <CompactTaskItem key={task._id} task={task} onToggle={handleUpdateStatus} onEdit={handleEditTask} onDelete={handleDeleteTask} isSelected={selectedTasks.includes(String(task._id))} onSelect={toggleSelectTask} />
                  ))}
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <Pagination currentPage={filters.page} totalPages={pagination.pages} onPageChange={(page) => updateFilters({ page })} />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modals & Overlays */}
      <AddTaskModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={editingTask ? handleUpdateTask : handleAddTask} initialTask={editingTask} projects={projects} defaultProjectId={activeProjectId} />
      <ProjectModal isOpen={showProjectModal} onClose={() => setShowProjectModal(false)} onSubmit={async (d) => { await createProject(d); fetchProjects(); }} />
      <BulkActionsBar 
        selectedCount={selectedTasks.length} 
        onMarkComplete={handleBulkMarkComplete} 
        onMarkIncomplete={handleBulkMarkIncomplete} 
        onDelete={handleBulkDelete} 
        onClear={clearSelection}
        projects={projects}
        onMoveToProject={handleBulkMoveToProject}
      />
      <KeyboardShortcuts />
    </div>
  );
};

export default Tasks;