import { Link, useLocation } from 'react-router-dom';
import { Menu, X, CheckSquare, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getLinkClasses = (path, isMobile = false) => {
    const baseClasses = isMobile 
      ? 'block px-3 py-2 rounded-md font-medium' 
      : 'px-3 py-2 rounded-md font-medium flex items-center gap-1.5';
    
    if (isActive(path)) {
      return `${baseClasses} bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400`;
    }
    
    return `${baseClasses} text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors`;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-dark-bg shadow-md sticky top-0 z-50 border-b border-transparent dark:border-dark-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center text-2xl font-bold text-blue-600 dark:text-blue-400">
              <CheckSquare className="h-8 w-8 mr-2" />
              TaskMaster Pro
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <Link to="/tasks" className={getLinkClasses('/tasks')}>
                    Tasks
                  </Link>
                  <Link to="/projects" className={getLinkClasses('/projects')}>
                    Projects
                  </Link>
                  <Link to="/calendar" className={getLinkClasses('/calendar')}>
                    Calendar
                  </Link>
                  <Link to="/settings" className={getLinkClasses('/settings')}>
                    <SettingsIcon className="w-4 h-4" />
                    Settings
                  </Link>
                  
                  <div className="mx-2">
                    <ThemeToggle />
                  </div>
                  
                  <div className="h-6 w-px bg-gray-200 dark:bg-dark-border mx-2"></div>
                  
                  <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold px-2">
                    {user?.name}
                  </span>
                  
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
                  >
                    <LogOut className="inline h-4 w-4 mr-1.5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <ThemeToggle />
                  <Link to="/login" className={getLinkClasses('/login')}>
                    Login
                  </Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-all shadow-md">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 p-2 rounded-md focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-dark-bg border-t border-gray-100 dark:border-dark-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <Link to="/tasks" className={getLinkClasses('/tasks', true)} onClick={() => setIsOpen(false)}>
                  Tasks
                </Link>
                <Link to="/projects" className={getLinkClasses('/projects', true)} onClick={() => setIsOpen(false)}>
                  Projects
                </Link>
                <Link to="/calendar" className={getLinkClasses('/calendar', true)} onClick={() => setIsOpen(false)}>
                  Calendar
                </Link>
                <Link to="/settings" className={getLinkClasses('/settings', true)} onClick={() => setIsOpen(false)}>
                  Settings
                </Link>
                <div className="px-3 py-2">
                  <ThemeToggle showLabel={true} />
                </div>
                <div className="pt-4 pb-2 border-t border-gray-100 dark:border-dark-border mt-2">
                  <span className="block px-3 text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {user?.name}
                  </span>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md font-medium"
                  >
                    <LogOut className="inline h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="px-3 py-2">
                  <ThemeToggle showLabel={true} />
                </div>
                <Link to="/login" className={getLinkClasses('/login', true)} onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="block bg-blue-600 text-white px-3 py-2 rounded-md m-2 text-center font-medium" onClick={() => setIsOpen(false)}>
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