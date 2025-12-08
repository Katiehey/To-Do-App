import { Link } from 'react-router-dom';
import { Menu, X, CheckSquare, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Destructuring all necessary values from the context
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center text-2xl font-bold text-blue-600">
              <CheckSquare className="h-8 w-8 mr-2 text-blue-600" />
              TaskMaster Pro
            </Link>
          </div>

          {/* Desktop Menu - Hidden on small screens */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAuthenticated ? (
                // User is LOGGED IN: Dashboard Links + User Info/Logout
                <>
                  <Link to="/tasks" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                    Tasks
                  </Link>
                  <Link to="/projects" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                    Projects
                  </Link>
                  <Link to="/calendar" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                    Calendar
                  </Link>
                  {/* User Name */}
                  <span className="text-gray-700 font-medium px-3 py-2 rounded-md">
                    {user?.name}
                  </span>
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // User is LOGGED OUT: Login + Sign up Links
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {/* Conditional Icon Rendering */}
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Shown when isOpen is true */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              // Mobile - User LOGGED IN
              <>
                <Link
                  to="/tasks"
                  className="block text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Tasks
                </Link>
                <Link
                  to="/projects"
                  className="block text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Projects
                </Link>
                <Link
                  to="/calendar"
                  className="block text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Calendar
                </Link>
                {/* User Name and Logout are grouped */}
                <div className="pt-2 border-t border-gray-100">
                  <span className="block text-sm text-gray-700 px-3 py-2">
                    Welcome, **{user?.name}**
                  </span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md block font-medium"
                  >
                    <LogOut className="inline h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              // Mobile - User LOGGED OUT
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;