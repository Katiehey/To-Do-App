import { X, Trash2, CheckCircle, Circle } from 'lucide-react';

const BulkActionsBar = ({
  selectedCount,
  totalCount,
  onMarkComplete,
  onMarkIncomplete,
  onDelete,
  onMoveToProject,
  onClear,
  onSelectAll,
  projects = []
}) => {
  if (selectedCount === 0) return null;

  const allSelected = selectedCount === totalCount;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-slate-900 dark:bg-slate-950 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] transition-all duration-300 animate-in slide-in-from-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
              {selectedCount} selected
            </div>
            <button
              onClick={onClear}
              className="text-gray-400 hover:text-white p-1 rounded-full transition-colors"
              aria-label="Clear selection"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onSelectAll}
              className="px-4 py-2 bg-slate-800 text-gray-200 rounded-lg hover:bg-slate-700 transition text-xs font-bold border border-slate-700"
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>

            <button
              onClick={onMarkComplete}
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition text-xs font-bold shadow-lg shadow-emerald-900/20"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete
            </button>

            <button
              onClick={onMarkIncomplete}
              className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition text-xs font-bold shadow-lg shadow-amber-900/20"
            >
              <Circle className="w-4 h-4 mr-2" />
              Reset
            </button>

            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onMoveToProject(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="pl-4 pr-10 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-white border border-slate-700 text-xs font-bold appearance-none cursor-pointer"
              >
                <option value="" disabled selected>Move to Project...</option>
                {projects.filter(p => !p.isArchived).map(project => (
                  <option key={project._id} value={project._id} className="bg-slate-900">
                    {project.icon || '📁'} {project.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onDelete}
              className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition text-xs font-bold shadow-lg shadow-rose-900/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>

          {/* Mobile Actions Dropdown */}
          <div className="md:hidden">
            <select
              onChange={(e) => {
                const action = e.target.value;
                if (action === 'selectAll') onSelectAll();
                else if (action === 'complete') onMarkComplete();
                else if (action === 'incomplete') onMarkIncomplete();
                else if (action === 'delete') onDelete();
                else if (action.startsWith('move-')) {
                  onMoveToProject(action.replace('move-', ''));
                }
                e.target.value = '';
              }}
              className="px-4 py-2 bg-blue-600 border-0 rounded-lg text-white text-xs font-bold appearance-none cursor-pointer"
            >
              <option value="" disabled selected>Actions...</option>
              <option value="selectAll">{allSelected ? 'Deselect All' : 'Select All'}</option>
              <option value="complete">Complete</option>
              <option value="incomplete">Incomplete</option>
              <option value="delete">Delete</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;