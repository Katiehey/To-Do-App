// src/components/tasks/StatusBadge.jsx
import React from 'react';

// Define colors for each status
const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  archived: "bg-gray-200 text-gray-600",
};

const StatusBadge = ({ status = "pending", onClick, disabled = false }) => {
  const label = typeof status === "string" ? status.replace("-", " ") : "Unknown";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize 
        ${statusColors[status] || "bg-gray-100 text-gray-600"} 
        transition focus:outline-none disabled:opacity-50`}
      aria-label={`Change status (current: ${label})`}
    >
      {label}
    </button>
  );
};


export default StatusBadge;
