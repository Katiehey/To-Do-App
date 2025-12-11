import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useEffect } from 'react';
import { useTask } from '../context/TaskContext';

const Tasks = () => {
  const { user, logout } = useAuth();
  const { tasks, fetchTasks, createTask, loading } = useTask();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Temporary test function
  const testCreate = async () => {
    const result = await createTask({
      title: 'Test from Frontend',
      priority: 'high',
      description: 'Created via React context',
    });
    console.log('Created:', result);
    await fetchTasks(); // refresh list
  };

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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

        {/* Tasks */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Tasks</h2>

          {/* Temporary test button */}
          <button
            onClick={testCreate}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Test Create Task
          </button>

          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500">No tasks found.</p>
          ) : (
            <ul className="space-y-2 mt-4">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="p-3 border rounded-md flex flex-col"
          >
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {task.title} – {task.priority}
                    </span>
                    <span>{task.completed ? '✅ Completed' : '❌ Pending'}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {task.description || 'No description provided'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
