import { Repeat } from 'lucide-react';

const RecurringBadge = ({ recurring, size = 'md' }) => {
  if (!recurring || !recurring.enabled) return null;

  const getDescription = () => {
    const { frequency, interval = 1 } = recurring;

    // Handle singular "Daily", "Weekly", etc.
    if (interval === 1) {
      return frequency.charAt(0).toUpperCase() + frequency.slice(1);
    }

    // Handle plural units
    const unit = frequency === 'daily' ? 'days' :
                 frequency === 'weekly' ? 'weeks' :
                 frequency === 'monthly' ? 'months' :
                 frequency === 'yearly' ? 'years' : '';

    return `Every ${interval} ${unit}`;
  };

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4'
  };

  return (
    <div className={`
      inline-flex items-center font-medium rounded-full 
      bg-indigo-50 text-indigo-700 border border-indigo-100
      ${sizeClasses[size]}
    `}>
      <Repeat className={iconSizes[size]} />
      <span>{getDescription()}</span>
    </div>
  );
};

export default RecurringBadge;