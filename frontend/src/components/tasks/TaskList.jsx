import { motion, AnimatePresence } from 'framer-motion';
import TaskItem from './TaskItem';
import { TaskListSkeleton } from '../common/LoadingSkeleton';
import { staggerContainer } from '../../utils/animations';
import { NoTasksState, AllTasksCompletedState, NoSearchResultsState } from '../common/EmptyState';



const TaskList = ({
  tasks,
  loading,
  onUpdateStatus,
  onEdit,
  onDelete,
  selectedTasks = [],
  onSelectTask,
  // new props for empty states
  searchQuery,
  showOnlyCompleted,
  onOpenAddModal,
}) => {
  // 1. Loading State
  if (loading) {
    return <TaskListSkeleton count={5} />;
  }

  // 2. Empty States
  if (!tasks || tasks.length === 0) {
    if (searchQuery) {
      return <NoSearchResultsState searchQuery={searchQuery} />;
    }
    if (showOnlyCompleted) {
      return <AllTasksCompletedState />;
    }
    return <NoTasksState onAddTask={onOpenAddModal} />;
  }

  // 3. Render List with Stagger & PopLayout
  // 3. Render List with Stagger & PopLayout
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => {
          // INSERT GUARD HERE
          if (!task) return null;

          return (
            <TaskItem
              key={task._id}
              task={task}
              onUpdateStatus={onUpdateStatus}
              onEdit={onEdit}
              onDelete={onDelete}
              isSelected={selectedTasks.includes(String(task._id))}
              onSelectTask={onSelectTask}
            />
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;
