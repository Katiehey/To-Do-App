import { useState } from 'react';
import { Search, X, SlidersHorizontal, Trash2 } from 'lucide-react';
import { PRIORITY_LEVELS } from '../../utils/constants';

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput !== filters.search) {
      onFilterChange({ search: searchInput, page: 1 });
    }
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value, page: 1 });
  };

  const handleClearAll = () => {
    setSearchInput('');
    onClearFilters();
  };

  const hasActiveFilters =
    filters.search ||
    filters.priority ||
    filters.taskStatus ||
    filters.project; // 👇 UPDATED: Check for project filter

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6 border border-gray-100">
      
      {/* 1. Main Search Bar and Toggle Button */}
      <div className="flex items-center space-x-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="task-search"
            type="text"
            placeholder="Search tasks, descriptions, or tags..."
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
          />
        </form>

        {/* Advanced Toggle Button */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-2 flex items-center border rounded-lg text-gray-800 font-semibold transition text-sm bg-gray-100 hover:bg-gray-200 shadow-sm ${
            showAdvanced
              ? 'bg-blue-50 border-blue-600 text-blue-600'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Advanced Filters
        </button>
      </div>

      {/* 2. Advanced Filters Dropdowns */}
      {showAdvanced && (
        <div className="pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Task Status (Unified) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.taskStatus || ''}
              onChange={(e) => handleFilterChange('taskStatus', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Priorities</option>
              {PRIORITY_LEVELS.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                onFilterChange({ sortBy, sortOrder });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="dueDate-asc">Due Date (Earliest)</option>
              <option value="dueDate-desc">Due Date (Latest)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="priority-asc">Priority (Low to High)</option>
              <option value="title-asc">Title (A to Z)</option>
              <option value="title-desc">Title (Z to A)</option>
            </select>
          </div>
        </div>
      )}

      {/* 3. Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium text-gray-600 mr-2">Active Filters:</span>

          {/* Search Filter Tag */}
          {filters.search && (
            <span className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Search: "{filters.search}"
              <button
                onClick={() => {
                  setSearchInput('');
                  handleFilterChange('search', undefined);
                }}
                className="ml-2 text-blue-600 hover:text-blue-900"
                aria-label="Remove search filter"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}

          {/* Priority Filter Tag */}
          {filters.priority && (
            <span className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
              Priority: {filters.priority}
              <button
                onClick={() => handleFilterChange('priority', undefined)}
                className="ml-2 text-purple-600 hover:text-purple-900"
                aria-label="Remove priority filter"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}

          {/* Task Status Filter Tag */}
          {filters.taskStatus && (
            <span className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
              Status: {filters.taskStatus}
              <button
                onClick={() => handleFilterChange('taskStatus', undefined)}
                className="ml-2 text-orange-600 hover:text-orange-900"
                aria-label="Remove status filter"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
          
          {/* 👇 NEW: Project Filter Tag */}
          {filters.project && (
            <span className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
              Project Filter Active
              <button
                onClick={() => handleFilterChange('project', undefined)}
                className="ml-2 text-indigo-600 hover:text-indigo-900"
                aria-label="Remove project filter"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}

          {/* Clear All Button */}
          <button
            onClick={handleClearAll}
            className="flex items-center text-red-600 hover:text-red-800 ml-4 px-3 py-1 rounded-lg border border-red-300 hover:bg-red-50 transition"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;