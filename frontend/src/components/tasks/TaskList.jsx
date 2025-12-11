import { Loader, Inbox } from 'lucide-react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, loading, onToggle, onEdit, onDelete }) => {
  
  // 1. Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[200px] text-lg text-blue-600">
        <Loader className="animate-spin w-8 h-8 mr-3" />
        Loading tasks...
      </div>
    );
  }

  // 2. Empty State
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-100 rounded-xl border border-dashed border-gray-300 min-h-[250px] text-center">
        <Inbox className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No tasks found
        </h3>
        <p className="text-gray-500">
          Get started by creating your first task!
        </p>
      </div>
    );
  }

  // 3. Render List
  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;