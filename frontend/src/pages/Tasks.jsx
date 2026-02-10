import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import { useProject } from '../context/ProjectContext';
import { useNotification } from '../context/NotificationContext';
import { User, Plus, Loader, LogOut, BarChart3 } from 'lucide-react';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../utils/darkMode';
import { announceToScreenReader } from '../utils/accessibility'; // ✅ Added accessibility import

import { TasksPageSEO } from '../components/common/SEO';
import PageTransition from '../components/common/PageTransition';
import TaskList from '../components/tasks/TaskList';
import AddTaskModal from '../components/tasks/AddTaskModal';
import FilterBar from '../components/tasks/FilterBar';
import Pagination from '../components/common/Pagination';
import BulkActionsBar from '../components/tasks/BulkActionsBar';
import KeyboardShortcuts from '../components/tasks/KeyboardShortcuts';
import ProjectSidebar from '../components/projects/ProjectSidebar';
import ProjectQuickStats from '../components/projects/ProjectQuickStats';
import ProjectModal from '../components/projects/ProjectModal';
import ProjectAnalytics from '../components/projects/ProjectAnalytics';
import Modal from '../components/common/Modal';

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
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Diagnostics & Scroll Lock
  useEffect(() => {
    console.log("Analytics Modal State:", showAnalytics);
    console.log("Active Project ID:", activeProjectId);
  }, [showAnalytics, activeProjectId]);

  useEffect(() => {
    document.body.style.overflow = showAnalytics ? 'hidden' : 'unset';
  }, [showAnalytics]);

  useEffect(() => { if (tasks.length > 0) checkAndNotify(tasks); }, [tasks, checkAndNotify]);
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

  // ✅ Wrapped existing handlers with Accessibility Announcements
  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) {
      await bulkDeleteTasks(selectedTasks);
      announceToScreenReader(`${selectedTasks.length} tasks deleted successfully`);
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    await bulkUpdateTasks(selectedTasks, { taskStatus: status });
    announceToScreenReader(`Updated ${selectedTasks.length} tasks to ${status}`);
  };

  const handleBulkMove = async (projectId) => {
    await bulkUpdateTasks(selectedTasks, { project: projectId });
    announceToScreenReader(`Moved ${selectedTasks.length} tasks to new project`);
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  const handleOpenModal = () => { setEditingTask(null); setIsModalOpen(true); };
  const handleEditTask = (t) => { setEditingTask(t); setIsModalOpen(true); };
  
  const handleUpdateStatus = async (id, s) => {
    await updateTaskStatus(id, s);
    announceToScreenReader(`Task status updated to ${s}`);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    announceToScreenReader('Task deleted successfully');
  };
  
  const handleAddTask = async (d) => { 
    const r = await createTask(d); 
    if (r.success) { 
      await fetchTasks(); 
      setIsModalOpen(false); 
      announceToScreenReader('New task created successfully'); // ✅ Announcement
    } 
    return r; 
  };

  const handleUpdateTask = async (id, d) => {
    const r = await updateTask(id, d);
    if (r.success) {
      announceToScreenReader('Task updated successfully'); // ✅ Announcement
    }
    return r;
  };

  const activeProject = projects?.find(p => p._id === activeProjectId);

  const safeTasks = tasks || []; 
const comp = safeTasks.filter(t => t && t.taskStatus === 'completed').length;
  const projectStats = { 
    total: safeTasks.length, 
    completed: comp, 
    pending: safeTasks.length - comp, 
    progress: safeTasks.length > 0 ? Math.round((comp / safeTasks.length) * 100) : 0 
  };

  return (
    <>
      <TasksPageSEO />
      <PageTransition>
        <div className="min-h-screen bg-transparent relative py-8 px-4 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto">
          
          <header className={darkClass(cardClasses, "p-6 rounded-xl shadow-lg flex justify-between items-center mb-6")}>
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

            <main className="w-full lg:flex-grow relative">
              <div 
                onClick={() => {
                  if (activeProjectId) {
                    setShowAnalytics(true);
                  }
                }}
                className={`relative mb-6 z-20 group transition-all duration-200 ${
                  activeProjectId ? "cursor-pointer active:scale-[0.98]" : "pointer-events-none"
                }`}
              >
                {activeProjectId && <div className="absolute inset-0 z-30 rounded-xl" />}
                <ProjectQuickStats project={activeProject} stats={projectStats} />
              </div>
              
              <div className={darkClass(cardClasses, "p-6 rounded-xl shadow-lg relative z-10")}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 border-b border-gray-100 dark:border-dark-border pb-4 gap-4">
                  <h2 className={darkClass("text-2xl font-bold", textClasses)}>Your Tasks</h2>
                  <button onClick={handleOpenModal} className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs font-bold shadow-md shadow-blue-500/20">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                </div>

                <FilterBar filters={filters} onFilterChange={updateFilters} onClearFilters={clearFilters} />
                
                {loading ? (
                  <div className="p-8 flex justify-center"><Loader className="animate-spin text-blue-500" /></div>
                ) : (
                  <TaskList 
                    tasks={tasks} 
                    onEdit={handleEditTask} 
                    onDelete={handleDeleteTask} // ✅ Uses updated handler with announcement
                    onUpdateStatus={handleUpdateStatus} // ✅ Uses updated handler with announcement
                    selectedTasks={selectedTasks} 
                    onSelectTask={toggleSelectTask} 
                  />
                )}
                
                <Pagination 
                  currentPage={filters.page} 
                  totalPages={pagination.pages} 
                  onPageChange={(p) => updateFilters({ page: p })} 
                />
              </div>
            </main>
          </div>

          <BulkActionsBar 
  selectedCount={selectedTasks?.length || 0}
  totalCount={tasks?.length || 0}
  onMarkComplete={() => handleBulkStatusUpdate('completed')}
  onMarkIncomplete={() => handleBulkStatusUpdate('pending')}
  onDelete={handleBulkDelete}
  onMoveToProject={handleBulkMove}
  onClear={clearSelection}
  onSelectAll={() => {
    const currentTasks = tasks || [];
    const currentSelected = selectedTasks || [];
    if (currentSelected.length === currentTasks.length && currentTasks.length > 0) {
      clearSelection();
    } else {
      selectAllTasks();
    }
  }}
  projects={projects || []}
/>

          {/* MODALS */}
          <AddTaskModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={editingTask ? handleUpdateTask : handleAddTask} // ✅ Uses handlers with announcements
            initialTask={editingTask} 
          />
          
          <ProjectModal 
            isOpen={showProjectModal} 
            onClose={() => setShowProjectModal(false)} 
            onSubmit={async (d) => {
              const r = await createProject(d);
              announceToScreenReader(`Project ${d.name} created`);
              return r;
            }} 
          />

          {showAnalytics && activeProject && (
            <Modal 
              isOpen={showAnalytics} 
              onClose={() => setShowAnalytics(false)}
              title={`${activeProject.name} Analytics`}
              size="xl"
            >
              <div className="min-h-[400px]">
                <ProjectAnalytics projectId={activeProjectId} />
              </div>
            </Modal>
          )}
          
          <KeyboardShortcuts 
           onNewTask={handleOpenModal} 
  onFocusSearch={() => {
    // This finds the search input in FilterBar.jsx and focuses it
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    if (searchInput) searchInput.focus();
  }} 
  onSelectAll={selectAllTasks} 
  onClearSelection={clearSelection}
          />
        </div>
      </PageTransition>
    </>
  );
};

export default Tasks;