// Note: Assuming 'itemsPerPage' is passed as a prop, 
// I've renamed 'currentCount' to 'itemsPerPage' for better clarity in the logic.
const ResultsInfo = ({ itemsPerPage, totalCount, currentPage, totalPages }) => {
  
  // Guard clause for missing totalCount
  if (totalCount === 0) {
    return (
      <div className="text-sm text-gray-500">
        No tasks found.
      </div>
    );
  }

  // Calculate the index of the first item on the current page
  // Formula: (Page - 1) * ItemsPerPage + 1
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  
  // Calculate the index of the last item on the current page
  // Formula: Min(Page * ItemsPerPage, TotalCount)
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="text-sm text-gray-600 flex items-center space-x-2">
      
      {/* Primary Display: Showing X to Y of Z tasks */}
      <span>
        Showing <span className="font-semibold">{startItem}</span> to{' '}
        <span className="font-semibold">{endItem}</span> of{' '}
        <span className="font-semibold">{totalCount}</span> tasks
      </span>
      
      {/* Secondary Display: Page X of Y */}
      {totalPages > 1 && (
        <span className="text-gray-400">
          (Page {currentPage} of {totalPages})
        </span>
      )}
    </div>
  );
};

export default ResultsInfo;