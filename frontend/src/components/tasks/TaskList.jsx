import { useState, useRef } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { GripVertical, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import TaskItem from './TaskItem';
import { TaskListSkeleton } from '../common/LoadingSkeleton';
import { staggerContainer } from '../../utils/animations';
import { NoTasksState, AllTasksCompletedState, NoSearchResultsState } from '../common/EmptyState';


// A single draggable row. The grip handle does double duty:
//   - press and drag  -> reorder within the page (dragListener={false})
//   - click (no drag) -> open a menu with "Move to top / bottom"
// The card itself never moves, so checkboxes/buttons/expand still work.
const DraggableTaskRow = ({ task, itemProps, onMoveToTop, onMoveToBottom }) => {
  const controls = useDragControls();
  const [menuOpen, setMenuOpen] = useState(false);
  // Set once a real drag starts, so the trailing click doesn't open the menu.
  const draggedRef = useRef(false);

  const menuItemClass =
    'flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors';

  return (
    <Reorder.Item
      as="div"
      value={task}
      dragListener={false}
      dragControls={controls}
      onDragStart={() => { draggedRef.current = true; }}
      className="flex items-start gap-1"
    >
      <div className="relative mt-4 flex-shrink-0">
        <button
          type="button"
          aria-label={`Reorder ${task.title}`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onPointerDown={(e) => { draggedRef.current = false; controls.start(e); }}
          onClick={() => { if (!draggedRef.current) setMenuOpen((o) => !o); }}
          className="cursor-grab active:cursor-grabbing touch-none text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 transition-colors"
        >
          <GripVertical size={18} />
        </button>

        {menuOpen && (
          <>
            {/* Click-away backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <div
              role="menu"
              className="absolute left-0 top-full mt-1 z-50 w-40 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden py-1"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => { setMenuOpen(false); onMoveToTop(task); }}
                className={menuItemClass}
              >
                <ArrowUpToLine size={14} /> Move to top
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => { setMenuOpen(false); onMoveToBottom(task); }}
                className={menuItemClass}
              >
                <ArrowDownToLine size={14} /> Move to bottom
              </button>
            </div>
          </>
        )}
      </div>
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
  onMoveToTop,
  onMoveToBottom,
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
              onMoveToTop={onMoveToTop}
              onMoveToBottom={onMoveToBottom}
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
