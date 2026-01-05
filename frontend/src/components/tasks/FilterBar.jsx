import { useState, useCallback, useEffect } from 'react';
import { Search, X, SlidersHorizontal, Trash2 } from 'lucide-react';
import { PRIORITY_LEVELS } from '../../utils/constants';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../../utils/darkMode';
import { debounce } from '../../utils/performance'; // ✅ Added performance import

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // 1. Setup the debounced search function
  // We use useCallback so the function isn't recreated on every render
  const debouncedSearch = useCallback(
    debounce((query) => {
      onFilterChange({ search: query, page: 1 });
    }, 300),
    [onFilterChange]
  );

  // 2. Sync local input with filter state (e.g., if filters are cleared externally)
  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value); // Update UI immediately for responsiveness
    debouncedSearch(value); // Trigger debounced filter logic
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Manual submit still works if user hits Enter
    onFilterChange({ search: searchInput, page: 1 });
  };

  const handleFilterChange = (key, value) => onFilterChange({ [key]: value, page: 1 });

  const handleClearAll = () => {
    setSearchInput('');
    onClearFilters();
  };

  const hasActiveFilters = filters.search || filters.priority || filters.taskStatus || filters.project;

  const inputBase = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm transition-all";

  return (
    <div className={darkClass(cardClasses, "p-4 rounded-xl shadow-md mb-6 border border-gray-100 dark:border-slate-700 transition-colors duration-300")}>
      
      {/* 1. Main Search Bar */}
      <div className="flex items-center space-x-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={handleInputChange} // ✅ Now uses the debounced handler
            className={`pl-10 ${inputBase}`}
          />
        </form>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-2 flex items-center border rounded-lg font-bold transition-all text-sm shadow-sm ${
            showAdvanced
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {/* 2. Advanced Filters Section */}
      {showAdvanced && (
        <div className="pt-4 border-t border-gray-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
          {['Status', 'Priority', 'Sort By'].map((label, idx) => (
            <div key={label}>
              <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 px-1 ${subtextClasses}`}>{label}</label>
              <select
                className={inputBase}
                value={idx === 0 ? (filters.taskStatus || '') : idx === 1 ? (filters.priority || '') : `${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
                onChange={(e) => {
                  if (idx === 0) handleFilterChange('taskStatus', e.target.value || undefined);
                  if (idx === 1) handleFilterChange('priority', e.target.value || undefined);
                  if (idx === 2) {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    onFilterChange({ sortBy, sortOrder });
                  }
                }}
              >
                {/* Status Options */}
                {idx === 0 && (
                  <>
                    <option value="" className="dark:bg-slate-800">All Status</option>
                    <option value="pending" className="dark:bg-slate-800">Pending</option>
                    <option value="in-progress" className="dark:bg-slate-800">In Progress</option>
                    <option value="completed" className="dark:bg-slate-800">Completed</option>
                    <option value="archived" className="dark:bg-slate-800">Archived</option>
                  </>
                )}
                {/* Priority Options */}
                {idx === 1 && (
                  <>
                    <option value="" className="dark:bg-slate-800">All Priorities</option>
                    {PRIORITY_LEVELS.map(l => <option key={l.value} value={l.value} className="dark:bg-slate-800">{l.label}</option>)}
                  </>
                )}
                {/* Sort Options */}
                {idx === 2 && (
                  <>
                    <option value="createdAt-desc" className="dark:bg-slate-800">Newest First</option>
                    <option value="dueDate-asc" className="dark:bg-slate-800">Due Date (Earliest)</option>
                    <option value="priority-desc" className="dark:bg-slate-800">Priority (High to Low)</option>
                  </>
                )}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* 3. Active Filter Tags */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex flex-wrap items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-widest mr-2 ${subtextClasses}`}>Active:</span>
          {filters.search && <FilterTag label={`"${filters.search}"`} onClear={() => { setSearchInput(''); handleFilterChange('search', undefined); }} color="blue" />}
          {filters.priority && <FilterTag label={filters.priority} onClear={() => handleFilterChange('priority', undefined)} color="purple" />}
          {filters.taskStatus && <FilterTag label={filters.taskStatus} onClear={() => handleFilterChange('taskStatus', undefined)} color="orange" />}
          
          <button onClick={handleClearAll} className="flex items-center text-red-500 hover:text-red-600 text-xs font-bold ml-auto px-3 py-1 rounded-lg border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
            <Trash2 className="w-3 h-3 mr-1" /> Clear All
          </button>
        </div>
      )}
    </div>
  );
};

const FilterTag = ({ label, onClear, color }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    orange: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300"
  };
  return (
    <span className={`flex items-center px-3 py-1 rounded-full text-xs font-bold transition-colors ${colors[color]}`}>
      {label}
      <button onClick={onClear} className="ml-2 hover:opacity-70"><X className="w-3 h-3" /></button>
    </span>
  );
};

export default FilterBar;