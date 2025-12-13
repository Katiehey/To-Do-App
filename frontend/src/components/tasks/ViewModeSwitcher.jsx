import { List, LayoutGrid } from 'lucide-react';

const ViewModeSwitcher = ({ currentView, onViewChange }) => {
  const views = [
    { id: 'list', label: 'List View', icon: List },
    { id: 'compact', label: 'Compact View', icon: LayoutGrid },
  ];

  return (
    <div className="flex p-1 bg-gray-100 rounded-xl space-x-1">
      {views.map(view => {
        const Icon = view.icon;
        return (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition text-sm font-medium ${
              currentView === view.id
                ? 'bg-white shadow text-blue-600' // Selected state
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200' // Unselected state
            }`}
            title={view.label}
            aria-pressed={currentView === view.id}
          >
            <Icon className="w-4 h-4" />
            <span>{view.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ViewModeSwitcher;