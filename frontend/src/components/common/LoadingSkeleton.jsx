import { motion } from 'framer-motion';

// A reusable shimmer effect configuration
const shimmerVariants = {
  initial: { backgroundPosition: '-200% 0' },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear",
    },
  },
};

// Base class for skeleton elements to ensure consistency
const skeletonBase = "bg-gray-200 dark:bg-slate-700 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-slate-600/20 before:to-transparent";

// Task Item Skeleton
export const TaskItemSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm mb-3"
  >
    <div className="flex items-start gap-4">
      {/* Checkbox skeleton */}
      <div className="w-5 h-5 mt-1 bg-gray-200 dark:bg-slate-700 rounded-md animate-pulse flex-shrink-0" />
            
      <div className="flex-1 space-y-3">
        {/* Title skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-3/4" />
                
        {/* Description skeleton */}
        <div className="h-3 bg-gray-100 dark:bg-slate-700/50 rounded animate-pulse w-1/2" />
                
        {/* Tags & metadata skeleton */}
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-100 dark:bg-slate-700/50 rounded-full animate-pulse" />
          <div className="h-6 w-20 bg-gray-100 dark:bg-slate-700/50 rounded-full animate-pulse" />
        </div>
      </div>
            
      {/* Actions skeleton */}
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-lg animate-pulse" />
      </div>
    </div>
  </motion.div>
);

// Task List Skeleton (multiple items)
export const TaskListSkeleton = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <TaskItemSkeleton key={i} />
    ))}
  </div>
);

// Project Card Skeleton
export const ProjectCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm"
  >
    {/* Color icon/circle skeleton */}
    <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full mb-4 animate-pulse" />
        
    {/* Title skeleton */}
    <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse w-2/3 mb-3" />
        
    {/* Description skeleton */}
    <div className="space-y-2 mb-6">
      <div className="h-3 bg-gray-100 dark:bg-slate-700/50 rounded animate-pulse w-full" />
      <div className="h-3 bg-gray-100 dark:bg-slate-700/50 rounded animate-pulse w-4/5" />
    </div>
        
    {/* Stats skeleton */}
    <div className="flex gap-4">
      <div className="h-8 flex-1 bg-gray-50 dark:bg-slate-900/50 rounded-lg animate-pulse" />
      <div className="h-8 flex-1 bg-gray-50 dark:bg-slate-900/50 rounded-lg animate-pulse" />
    </div>
  </motion.div>
);

// Project Grid Skeleton
export const ProjectGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProjectCardSkeleton key={i} />
    ))}
  </div>
);

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm"
  >
    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-1/2 mb-4" />
    <div className="h-10 bg-gray-100 dark:bg-slate-700 rounded-lg animate-pulse w-1/3" />
  </motion.div>
);

// Sidebar/Navigation Skeleton
export const SidebarSkeleton = () => (
  <div className="space-y-4 p-4">
    <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse w-full mb-8" />
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded animate-pulse w-24" />
      </div>
    ))}
  </div>
);