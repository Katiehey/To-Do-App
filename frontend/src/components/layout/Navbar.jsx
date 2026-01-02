import { Link, useLocation } from 'react-router-dom';
import { Menu, X, CheckSquare, LogOut, Settings as SettingsIcon } from 'lucide-react'; // ✅ Added SettingsIcon
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getLinkClasses = (path, isMobile = false) => {
    const baseClasses = isMobile ? 'block px-3 py-2 rounded-md font-medium' : 'px-3 py-2 rounded-md font-medium flex items-center gap-1.5';
    
    if (isActive(path)) {
      return `${baseClasses} bg-blue-100 text-blue-700`; // Active style
    }
    if (isMobile) {
      return `${baseClasses} text-gray-700 hover:bg-gray-100`; // Mobile hover style
    }
    return `${baseClasses} text-gray-700 hover:text-blue-600 transition-colors`; // Desktop hover style
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center text-2xl font-bold text-blue-600">
              <CheckSquare className="h-8 w-8 mr-2 text-blue-600" />
              TaskMaster Pro
            </Link>
          </div>

          {/* Desktop Menu */}
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
                  
                  {/* ✅ Settings Link Added (Desktop) */}
                  <Link to="/settings" className={getLinkClasses('/settings')}>
                    <SettingsIcon className="w-4 h-4" />
                    Settings
                  </Link>
                  
                  <div className="h-6 w-px bg-gray-200 mx-2"></div>
                  
                  <span className="text-gray-700 text-sm font-semibold px-2">
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-md focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
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
                {/* ✅ Settings Link Added (Mobile) */}
                <Link to="/settings" className={getLinkClasses('/settings', true)} onClick={() => setIsOpen(false)}>
                  Settings
                </Link>
                
                <div className="pt-4 pb-2 border-t border-gray-100 mt-2">
                  <div className="flex items-center px-3 mb-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3 text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {user?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md block font-medium"
                  >
                    <LogOut className="inline h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
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