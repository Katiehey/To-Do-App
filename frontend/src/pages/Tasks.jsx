import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import { useProject } from '../context/ProjectContext';
import { useNotification } from '../context/NotificationContext';
import { User, Plus, Loader, LogOut, Repeat } from 'lucide-react';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../utils/darkMode';

// Component Imports
import TaskList from '../components/tasks/TaskList';
import AddTaskModal from '../components/tasks/AddTaskModal';
import FilterBar from '../components/tasks/FilterBar';
import Pagination from '../components/common/Pagination';
import ResultsInfo from '../components/common/ResultsInfo';
import BulkActionsBar from '../components/tasks/BulkActionsBar';
import CompactTaskItem from '../components/tasks/CompactTaskItem';
import KeyboardShortcuts from '../components/tasks/KeyboardShortcuts';
import RecurringTasksList from '../components/tasks/RecurringTasksList';
import ProjectSidebar from '../components/projects/ProjectSidebar';
import ProjectQuickStats from '../components/projects/ProjectQuickStats';
import ProjectModal from '../components/projects/ProjectModal';

const Tasks = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    tasks, loading, filters, pagination, fetchTasks, createTask, 
    updateTask, deleteTask, updateTaskStatus, updateFilters, 
    clearFilters, selectedTasks, toggleSelectTask, selectAllTasks, 
    clearSelection, bulkDeleteTasks, bulkUpdateTasks 
  } = useTask();
  const { projects, fetchProjects, createProject } = useProject();
  const { checkAndNotify } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showRecurringOnly, setShowRecurringOnly] = useState(false);

  useEffect(() => {
    if (tasks.length > 0) checkAndNotify(tasks);
  }, [tasks, checkAndNotify]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (tasks.length > 0) checkAndNotify(tasks);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks, checkAndNotify]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);
  
  useEffect(() => {
    const p = parseInt(new URLSearchParams(location.search).get('page')) || 1;
    if (p !== filters.page) updateFilters({ page: p });
  }, [location.search, filters.page, updateFilters]);

  useEffect(() => {
    if (activeProjectId) {
      updateFilters({ ...filters, project: activeProjectId, page: 1 });
    } else {
      const { project, ...otherFilters } = filters;
      updateFilters({ ...otherFilters, page: 1 });
    }
    clearSelection();
  }, [activeProjectId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks, filters]);

  const handleLogout = () => { logout(); navigate('/login'); };
  const handleOpenModal = () => { setEditingTask(null); setIsModalOpen(true); };
  const handleCloseModal = () => { setEditingTask(null); setIsModalOpen(false); };
  const handleEditTask = (t) => { setEditingTask(t); setIsModalOpen(true); };
  const handleUpdateStatus = async (id, s) => await updateTaskStatus(id, s);
  
  const handleAddTask = async (d) => { 
    const r = await createTask(d); 
    if (r.success) { await fetchTasks(); setIsModalOpen(false); } 
    return r; 
  };

  const handleUpdateTask = async (d) => { 
    const r = await updateTask(editingTask._id, d); 
    if (r.success) { await fetchTasks(); setIsModalOpen(false); } 
    return r; 
  };

  const handleDeleteTask = async (id) => { 
    const r = await deleteTask(id); 
    if (r.success) await fetchTasks(); 
    return r; 
  };

  const activeProject = projects.find(p => p._id === activeProjectId);
  const comp = tasks.filter(t => t.taskStatus === 'completed').length;
  const projectStats = { 
    total: tasks.length, 
    completed: comp, 
    pending: tasks.length - comp, 
    progress: tasks.length > 0 ? Math.round((comp / tasks.length) * 100) : 0 
  };

  return (
    <div className="min-h-screen bg-transparent relative transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:max-w-7xl lg:mx-auto">
        
        {/* User Header Section */}
        <header className={darkClass(cardClasses, "p-6 rounded-xl shadow-lg flex justify-between items-center mb-6 transition-colors")}>
          <div className="flex items-center space-x-4">
            <User className="w-10 h-10 text-blue-600 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full" />
            <div>
              <h1 className={darkClass("text-xl font-semibold", textClasses)}>Welcome, {user?.name}!</h1>
              <p className={subtextClasses}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition">
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
            
            {/* Main Task Container */}
            <div className={darkClass(cardClasses, "p-6 rounded-xl shadow-lg transition-colors")}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 border-b border-gray-100 dark:border-dark-border pb-4 gap-4">
                <div className="flex items-center space-x-4">
                  <h2 className={darkClass("text-2xl font-bold", textClasses)}>Your Tasks</h2>
                  {!showRecurringOnly && tasks.length > 0 && (
                    <button onClick={() => selectedTasks.length === tasks.length ? clearSelection() : selectAllTasks()} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 text-sm font-medium">
                      {selectedTasks.length === tasks.length ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button 
                      onClick={() => { setViewMode('list'); setShowRecurringOnly(false); }} 
                      className={`px-4 py-1.5 rounded-md text-xs font-bold transition ${viewMode === 'list' && !showRecurringOnly ? 'bg-white dark:bg-dark-card text-blue-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      List
                    </button>
                    <button 
                      onClick={() => { setViewMode('compact'); setShowRecurringOnly(false); }} 
                      className={`px-4 py-1.5 rounded-md text-xs font-bold transition ${viewMode === 'compact' && !showRecurringOnly ? 'bg-white dark:bg-dark-card text-blue-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      Compact
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setShowRecurringOnly(!showRecurringOnly)} 
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition ${showRecurringOnly ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300' : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Recurring</span>
                  </button>
                  
                  <button 
                    onClick={handleOpenModal} 
                    className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs font-bold shadow-md shadow-blue-500/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                </div>
              </div>

              {!showRecurringOnly && (
                <FilterBar filters={filters} onFilterChange={updateFilters} onClearFilters={clearFilters} />
              )}
              
              <ResultsInfo itemsPerPage={filters.limit} totalCount={pagination.total} currentPage={pagination.page} totalPages={pagination.pages} />

              {loading ? (
                <div className="p-8 flex justify-center"><Loader className="animate-spin text-blue-500" /></div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl border-gray-100 dark:border-dark-border">
                  <p className="text-gray-400">No tasks found.</p>
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  {showRecurringOnly ? (
                    <RecurringTasksList tasks={tasks} onEdit={handleEditTask} onToggle={handleUpdateStatus} />
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
                      {tasks.map(t => (
                        <CompactTaskItem 
                          key={t._id} 
                          task={t} 
                          onToggle={handleUpdateStatus} 
                          onEdit={handleEditTask} 
                          onDelete={handleDeleteTask} 
                          isSelected={selectedTasks.includes(String(t._id))} 
                          onSelect={toggleSelectTask} 
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!showRecurringOnly && (
                <div className="mt-6 flex justify-end">
                  <Pagination 
                    currentPage={filters.page} 
                    totalPages={pagination.pages} 
                    onPageChange={(p) => updateFilters({ page: p })} 
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={editingTask ? handleUpdateTask : handleAddTask} 
        initialTask={editingTask} 
      />
      
      <ProjectModal 
        isOpen={showProjectModal} 
        onClose={() => setShowProjectModal(false)} 
        onSubmit={async (d) => { 
          const r = await createProject(d); 
          if(r.success) fetchProjects(); 
          return r; 
        }} 
      />
      
      <BulkActionsBar 
        selectedCount={selectedTasks.length} 
        onMarkComplete={() => bulkUpdateTasks(selectedTasks, { taskStatus: 'completed' })} 
        onMarkIncomplete={() => bulkUpdateTasks(selectedTasks, { taskStatus: 'pending' })} 
        onDelete={() => { if(window.confirm(`Delete ${selectedTasks.length} tasks?`)) bulkDeleteTasks(selectedTasks); }} 
        onClear={clearSelection} 
        projects={projects} 
        onMoveToProject={async (id) => { const r = await bulkUpdateTasks(selectedTasks, { project: id }); if(r.success) { fetchTasks(); clearSelection(); }}} 
      />
      
      <KeyboardShortcuts />
    </div>
  );
};

export default Tasks;