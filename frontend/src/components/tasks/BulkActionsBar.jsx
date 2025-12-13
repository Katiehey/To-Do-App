import { X, Trash2, CheckCircle, Circle } from 'lucide-react';

const BulkActionsBar = ({
  selectedCount,
  totalCount,          // ✅ new prop: total number of tasks
  onMarkComplete,
  onMarkIncomplete,
  onDelete,
  onClear,
  onSelectAll,         // ✅ toggles select/deselect all
}) => {
  if (selectedCount === 0) return null;

  const allSelected = selectedCount === totalCount;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-800 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          
          {/* 1. Selection Info and Clear Button */}
          <div className="flex items-center space-x-4">
            <span className="text-white text-base font-semibold">
              {selectedCount} task{selectedCount !== 1 ? 's' : ''} selected
            </span>
            
            <button
              onClick={onClear}
              className="text-gray-400 hover:text-white p-1 rounded-full transition"
              aria-label="Clear selection"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* Select/Deselect All */}
            <button
              onClick={onSelectAll}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>

            {/* Mark Complete */}
            <button
              onClick={onMarkComplete}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Complete
            </button>

            {/* Mark Incomplete */}
            <button
              onClick={onMarkIncomplete}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm font-medium"
            >
              <Circle className="w-4 h-4 mr-2" />
              Mark Incomplete
            </button>

            {/* Delete */}
            <button
              onClick={onDelete}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>

          {/* 3. Mobile Dropdown Menu */}
          <div className="sm:hidden">
            <select
              onChange={(e) => {
                const action = e.target.value;
                if (action === 'selectAll') onSelectAll();
                else if (action === 'complete') onMarkComplete();
                else if (action === 'incomplete') onMarkIncomplete();
                else if (action === 'delete') onDelete();
                e.target.value = '';
              }}
              className="px-3 py-2 bg-white/20 border-0 rounded-lg text-white appearance-none cursor-pointer focus:ring-0 focus:border-0"
            >
              <option value="" disabled className="text-gray-800 bg-white">Choose Action...</option>
              <option value="selectAll" className="text-gray-800 bg-white">
                {allSelected ? 'Deselect All' : 'Select All'}
              </option>
              <option value="complete" className="text-gray-800 bg-white">Mark Complete</option>
              <option value="incomplete" className="text-gray-800 bg-white">Mark Incomplete</option>
              <option value="delete" className="text-gray-800 bg-white">Delete</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;
