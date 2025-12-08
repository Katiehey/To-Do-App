import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const Tasks = () => {
  // Assuming useAuth provides the logged-in user object and a logout function
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* 👤 Header and User Info */}
        <div className="bg-white p-6 rounded-xl shadow-lg flex justify-between items-center mb-8">
          
          {/* User Details */}
          <div className="flex items-center space-x-4">
            <User className="w-10 h-10 text-blue-600 p-2 bg-blue-100 rounded-full" />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-sm text-gray-500">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          {/*<button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-150 text-sm font-medium"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>*/}
        </div>

        {/* 📝 Task Management Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Tasks
          </h2>
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-md">
            <p className="font-semibold mb-1">
              Task management will be implemented in the next sessions.
            </p>
            <p className="text-sm">
              Sessions 8-12 will add full task CRUD functionality.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Tasks;