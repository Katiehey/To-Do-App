// Common dark mode class combinations synced with tailwind.config.js custom colors
export const cardClasses = "bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border shadow-sm";

export const textClasses = "text-gray-900 dark:text-gray-100";
export const subtextClasses = "text-gray-600 dark:text-gray-400";

export const inputClasses = "bg-white dark:bg-slate-800 border-gray-300 dark:border-dark-border text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500";

export const buttonPrimaryClasses = "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white transition-all";

export const buttonSecondaryClasses = "bg-gray-100 dark:bg-dark-border hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-gray-100 transition-all";

export const hoverClasses = "hover:bg-gray-50 dark:hover:bg-slate-700/50";
export const borderClasses = "border-gray-200 dark:border-dark-border";

// Helper function to combine classes conditionally (better than simple join)
export const darkClass = (...classes) => classes.filter(Boolean).join(' ');