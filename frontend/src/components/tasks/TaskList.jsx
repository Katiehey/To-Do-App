import { motion, AnimatePresence } from 'framer-motion';
import { ListTodo } from 'lucide-react';
import TaskItem from './TaskItem';
import { TaskListSkeleton } from '../common/LoadingSkeleton';
import { staggerContainer } from '../../utils/animations';

const TaskList = ({
  tasks,
  loading,
  onUpdateStatus, // Keep your original prop names
  onEdit,
  onDelete,
  selectedTasks = [],
  onSelectTask,
}) => {
  // 1. Loading State: Uses your new professional skeleton
  if (loading) {
    return <TaskListSkeleton count={5} />;
  }

  // 2. Empty State: Animated and theme-aware
  if (!tasks || tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-20 bg-gray-50/50 dark:bg-slate-900/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
          className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center shadow-inner"
        >
          <ListTodo className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </motion.div>
                
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2"
        >
          Your list is clear
        </motion.h3>
                
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 dark:text-gray-400 max-w-xs"
        >
          Get started by creating your first task and organize your day!
        </motion.p>
      </motion.div>
    );
  }

  // 3. Render List with Stagger & PopLayout
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onUpdateStatus={onUpdateStatus}
            onEdit={onEdit}
            onDelete={onDelete}
            // Ensure ID comparison is robust (handles both string and object IDs)
            isSelected={selectedTasks.includes(String(task._id))}
            onSelectTask={onSelectTask}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;