import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Settings as SettingsIcon, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react'; // ✅ Added useEffect to imports
import { useAuth } from '../../context/AuthContext';
import Tooltip from '../common/Tooltip';
import { throttle } from '../../utils/performance'; // ✅ Added throttle import

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // ✅ Local state for scroll depth
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Integrated Throttled Scroll Logic
  useEffect(() => {
    const handleScroll = throttle(() => {
      // Check if user has scrolled more than 10px
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // theme state
  const [theme, setTheme] = useState(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  
  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  };

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
    // ✅ Updated className to use isScrolled for a more dynamic look
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-dark-border' 
        : 'bg-white dark:bg-dark-bg shadow-md border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center text-2xl font-bold text-blue-600 dark:text-blue-400">
              <img 
                src="/icons/Appimages/windows11/Square44x44Logo.targetsize-44.png" 
                alt="App Logo" 
                className="h-8 w-8 mr-2 object-contain"
              />
              TaskMaster Pro
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <Link to="/tasks" className={getLinkClasses('/tasks')}>Tasks</Link>
                  <Link to="/projects" className={getLinkClasses('/projects')}>Projects</Link>
                  <Link to="/calendar" className={getLinkClasses('/calendar')}>Calendar</Link>
                  <Link to="/settings" className={getLinkClasses('/settings')}>
                    <SettingsIcon className="w-4 h-4" /> Settings
                  </Link>

                  <Tooltip content="Toggle dark mode">
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                    >
                      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                  </Tooltip>

                  <div className="h-6 w-px bg-gray-200 dark:bg-dark-border mx-2"></div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold px-2">
                    {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
                  >
                    <LogOut className="inline h-4 w-4 mr-1.5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Tooltip content="Toggle dark mode">
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                    >
                      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                  </Tooltip>
                  <Link to="/login" className={getLinkClasses('/login')}>Login</Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-all shadow-md">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile nav toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Tooltip content="Toggle dark mode">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </Tooltip>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 p-2 rounded-md focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-dark-bg border-t border-gray-100 dark:border-dark-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <Link to="/tasks" className={getLinkClasses('/tasks', true)} onClick={() => setIsOpen(false)}>Tasks</Link>
                <Link to="/projects" className={getLinkClasses('/projects', true)} onClick={() => setIsOpen(false)}>Projects</Link>
                <Link to="/calendar" className={getLinkClasses('/calendar', true)} onClick={() => setIsOpen(false)}>Calendar</Link>
                <Link to="/settings" className={getLinkClasses('/settings', true)} onClick={() => setIsOpen(false)}>Settings</Link>
                <div className="pt-4 pb-2 border-t border-gray-100 dark:border-dark-border mt-2">
                  <span className="block px-3 text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {user?.name}
                  </span>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md font-medium"
                  >
                    <LogOut className="inline h-4 w-4 mr-2" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={getLinkClasses('/login', true)} onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="block bg-blue-600 text-white px-3 py-2 rounded-md m-2 text-center font-medium" onClick={() => setIsOpen(false)}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;