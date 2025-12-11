const TaskSkeleton = () => {
  return (
    // Mimics the outer structure of TaskItem
    <div className="flex items-start p-4 bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
      
      {/* 1. Checkbox Placeholder */}
      <div className="flex-shrink-0 mr-3 mt-1 h-6 w-6 rounded-full bg-gray-200"></div>

      {/* 2. Task Content Placeholder */}
      <div className="flex-grow min-w-0">
        
        {/* Title Placeholder */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        
        {/* Description Placeholder */}
        <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
        
        {/* Meta Info Placeholders */}
        <div className="mt-2 flex flex-wrap items-center space-x-4">
          {/* Priority Placeholder */}
          <div className="h-3 w-16 bg-gray-200 rounded-full"></div>
          {/* Due Date Placeholder */}
          <div className="h-3 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* 3. Actions Placeholders */}
      <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
        {/* Edit Placeholder */}
        <div className="p-2 h-5 w-5 bg-gray-200 rounded"></div>
        {/* Delete Placeholder */}
        <div className="p-2 h-5 w-5 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default TaskSkeleton;