import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    // Decreased maxVisible slightly for cleaner display logic with ellipses
    const maxVisible = 7; 
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      // Near start: 1, 2, 3, 4, ..., totalPages
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) { // Show up to 5 pages
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } 
      // Near end: 1, ..., totalPages-3, totalPages-2, totalPages-1, totalPages
      else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) { // Show last 5 pages
          pages.push(i);
        }
      } 
      // Middle: 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
      else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center space-x-2">
      
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-2">
        {getPageNumbers().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-4 py-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === page
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                aria-current={currentPage === page ? 'page' : undefined}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        aria-label="Go to next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;