export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'green' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'red' },
];

export const TASK_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

export const RECURRING_OPTIONS = [
  { value: 'none', label: 'Does not repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export const RECURRING_INTERVALS = {
  daily: Array.from({ length: 30 }, (_, i) => ({
    value: i + 1,
    label: i === 0 ? 'Every day' : `Every ${i + 1} days`
  })),
  weekly: Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: i === 0 ? 'Every week' : `Every ${i + 1} weeks`
  })),
  monthly: Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: i === 0 ? 'Every month' : `Every ${i + 1} months`
  })),
  yearly: Array.from({ length: 5 }, (_, i) => ({
    value: i + 1,
    label: i === 0 ? 'Every year' : `Every ${i + 1} years`
  })),
};