import React from 'react';

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  archived: "bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-gray-400",
};

const StatusBadge = ({ status = "pending", onClick, disabled = false }) => {
  const label = typeof status === "string" ? status.replace("-", " ") : "Unknown";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all duration-200
        ${statusColors[status] || "bg-gray-100 text-gray-600 dark:bg-slate-800"} 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900
        disabled:opacity-50 active:scale-95`}
      aria-label={`Change status (current: ${label})`}
    >
      {label}
    </button>
  );
};

export default StatusBadge;