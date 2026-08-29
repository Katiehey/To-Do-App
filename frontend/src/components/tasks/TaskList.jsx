import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import TaskItem from './TaskItem';
import { TaskListSkeleton } from '../common/LoadingSkeleton';
import { staggerContainer } from '../../utils/animations';
import { NoTasksState, AllTasksCompletedState, NoSearchResultsState } from '../common/EmptyState';


// A single draggable row: the card only moves when the user grabs the grip
// handle (dragListener={false}), so checkboxes/buttons/expand still work.
const DraggableTaskRow = ({ task, itemProps }) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      as="div"
      value={task}
      dragListener={false}
      dragControls={controls}
      className="flex items-start gap-1"
    >
      <button
        type="button"
        aria-label={`Drag to reorder: ${task.title}`}
        onPointerDown={(e) => controls.start(e)}
        className="mt-4 flex-shrink-0 cursor-grab active:cursor-grabbing touch-none text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 transition-colors"
      >
        <GripVertical size={18} />
      </button>
      <div className="flex-1 min-w-0">
        <TaskItem task={task} {...itemProps} />
      </div>
    </Reorder.Item>
  );
};


const TaskList = ({
  tasks,
  loading,
  onUpdateStatus,
  onEdit,
  onDelete,
  selectedTasks = [],
  onSelectTask,
  highlightedTaskId,
  // new props for empty states
  searchQuery,
  showOnlyCompleted,
  onOpenAddModal,
  // drag-and-drop reordering
  reorderEnabled = false,
  onReorder,
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

  const itemPropsFor = (task) => ({
    onUpdateStatus,
    onEdit,
    onDelete,
    isHighlighted: String(task._id) === String(highlightedTaskId),
    isSelected: selectedTasks.includes(String(task._id)),
    onSelectTask,
  });

  // 3a. Draggable list (manual "My Order" sort)
  if (reorderEnabled) {
    return (
      <Reorder.Group
        as="div"
        axis="y"
        values={tasks}
        onReorder={onReorder}
        className="space-y-3"
      >
        {tasks.map((task) =>
          task ? (
            <DraggableTaskRow
              key={task._id}
              task={task}
              itemProps={itemPropsFor(task)}
            />
          ) : null
        )}
      </Reorder.Group>
    );
  }

  // 3b. Static list (any other sort)
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
              {...itemPropsFor(task)}
            />
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;
