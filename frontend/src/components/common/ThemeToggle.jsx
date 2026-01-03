import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ showLabel = false }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-3 p-2 rounded-xl transition-all duration-300 
                 hover:bg-gray-100 dark:hover:bg-dark-border group"
      aria-label="Toggle Theme"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-400 transition-transform duration-500 rotate-0 scale-100" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700 transition-transform duration-500 rotate-12 scale-100" />
        )}
      </div>

      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;