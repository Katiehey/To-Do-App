import { Link } from 'react-router-dom';
import { Menu, X, CheckSquare } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      {/* Main Navigation Bar */}
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
              <Link to="/tasks" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                Tasks
              </Link>
              <Link to="/projects" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                Projects
              </Link>
              <Link to="/calendar" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                Calendar
              </Link>
              <Link to="/login" className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Login
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Shown when isOpen is true */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
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
            <Link
              to="/login"
              className="block bg-blue-600 text-white px-3 py-2 rounded-md font-medium hover:bg-blue-700 mt-2"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;