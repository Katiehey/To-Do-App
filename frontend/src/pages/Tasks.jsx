import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import TaskStats from '../components/tasks/TaskStats';
import TaskList from '../components/tasks/TaskList';
import AddTaskModal from '../components/tasks/AddTaskModal';

const Tasks = () => {
  const { user, logout } = useAuth();
  const { tasks, fetchTasks, createTask, loading, updateTask, deleteTask, toggleTask } = useTask();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
      await fetchTasks(); // Refresh list
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
      await fetchTasks(); // Refresh list
      setIsModalOpen(false);
    }
    return result;
  };

  const handleDeleteTask = async (id) => {
    const result = await deleteTask(id);
    if (result.success) {
      await fetchTasks(); // Refresh list
    }
    return result;
  };

  const handleToggleTask = async (id) => {
    const result = await toggleTask(id);
    if (result.success) {
      await fetchTasks(); // Refresh list
    }
    return result;
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
          {/* Logout button (optional) */}
          {/* <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-150 text-sm font-medium"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button> */}
        </div>

        {/* Tasks Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
            {/* Add Task Button */}
            <button
              onClick={handleOpenModal}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-150 text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </button>
          </div>

          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500">No tasks found.</p>
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggle={handleToggleTask}
            />
          )}
        </div>
      </div>

      {/* Add/Edit Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        initialTask={editingTask}
      />
    </div>
  );
};

export default Tasks;
