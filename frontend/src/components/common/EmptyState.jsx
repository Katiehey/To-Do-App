import { motion } from 'framer-motion';
import { 
  ListTodo, 
  FolderOpen, 
  Calendar, 
  Search,
  Archive,
  CheckCircle,
  TrendingUp,
  Bell
} from 'lucide-react';

const iconMap = {
  tasks: ListTodo,
  projects: FolderOpen,
  calendar: Calendar,
  search: Search,
  archive: Archive,
  completed: CheckCircle,
  analytics: TrendingUp,
  notifications: Bell
};

const EmptyState = ({ 
  type = 'tasks',
  title,
  description,
  actionText,
  onAction,
  children
}) => {
  const Icon = iconMap[type] || ListTodo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Animated Icon Circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 200, 
          damping: 15,
          delay: 0.2 
        }}
        className="relative mb-6"
      >
        {/* Outer Circle with Gradient */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-purple-900/30 flex items-center justify-center relative overflow-hidden">
          {/* Animated Background Shapes */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="absolute inset-0 opacity-20"
          >
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-blue-400" />
            <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-purple-400" />
            <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-pink-400" />
          </motion.div>

          {/* Icon */}
          <motion.div
            animate={{ 
              y: [0, -8, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Icon className="w-16 h-16 text-blue-600 dark:text-blue-400 relative z-10" strokeWidth={1.5} />
          </motion.div>
        </div>

        {/* Floating Dots */}
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3
          }}
          className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-blue-400 dark:bg-blue-500"
        />
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5
          }}
          className="absolute -bottom-1 -left-2 w-2 h-2 rounded-full bg-purple-400 dark:bg-purple-500"
        />
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-600 dark:text-gray-400 max-w-md mb-6"
      >
        {description}
      </motion.p>

      {/* Action Button or Custom Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {children || (actionText && onAction && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAction}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {actionText}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

// Preset Empty States
export const NoTasksState = ({ onAddTask }) => (
  <EmptyState
    type="tasks"
    title="No tasks yet"
    description="Get started by creating your first task. Stay organized and boost your productivity!"
    actionText="Create Your First Task"
    onAction={onAddTask}
  />
);

export const NoProjectsState = ({ onAddProject }) => (
  <EmptyState
    type="projects"
    title="No projects yet"
    description="Organize your tasks into projects. Create your first project to get started!"
    actionText="Create Your First Project"
    onAction={onAddProject}
  />
);

export const NoSearchResultsState = ({ searchQuery }) => (
  <EmptyState
    type="search"
    title="No results found"
    description={`We couldn't find any tasks matching "${searchQuery}". Try a different search term.`}
  />
);

export const NoCalendarEventsState = () => (
  <EmptyState
    type="calendar"
    title="No events scheduled"
    description="Your calendar is clear for this period. Add tasks with due dates to see them here."
  />
);

export const AllTasksCompletedState = () => (
  <EmptyState
    type="completed"
    title="All caught up! 🎉"
    description="You've completed all your tasks. Take a break or create new ones to keep the momentum going!"
  />
);

export const NoArchivedProjectsState = () => (
  <EmptyState
    type="archive"
    title="No archived projects"
    description="Projects you archive will appear here. Keep your workspace clean by archiving completed projects."
  />
);

export const NoNotificationsState = () => (
  <EmptyState
    type="notifications"
    title="No notifications"
    description="You're all caught up! Notifications about task reminders and updates will appear here."
  />
);

export default EmptyState;
