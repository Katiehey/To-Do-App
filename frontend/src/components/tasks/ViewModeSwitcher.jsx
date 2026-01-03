import { List, LayoutGrid } from 'lucide-react';
import { darkClass } from '../utils/darkMode';

const ViewModeSwitcher = ({ currentView, onViewChange }) => {
  const views = [
    { id: 'list', label: 'List View', icon: List },
    { id: 'compact', label: 'Compact View', icon: LayoutGrid },
  ];

  return (
    <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-xl space-x-1 transition-colors">
      {views.map(view => {
        const Icon = view.icon;
        const isActive = currentView === view.id;
        return (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm font-bold ${
              isActive
                ? 'bg-white dark:bg-dark-card shadow-sm text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-slate-700'
            }`}
            title={view.label}
            aria-pressed={isActive}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{view.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ViewModeSwitcher;