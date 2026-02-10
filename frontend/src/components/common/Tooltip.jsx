import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top', // 'top' | 'bottom' | 'left' | 'right'
  delay = 200,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  let timeoutId;

  const showTooltip = () => {
    if (disabled) return;
    timeoutId = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-700',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-700',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-700',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-700'
  };

  const tooltipVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: position === 'top' ? 5 : position === 'bottom' ? -5 : 0,
      x: position === 'left' ? 5 : position === 'right' ? -5 : 0
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      x: 0,
      transition: { 
        duration: 0.15,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  if (!content) return children;

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              absolute z-50 px-3 py-2 text-xs font-medium text-white
              bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg
              whitespace-nowrap pointer-events-none
              ${positionClasses[position]}
            `}
          >
            {content}
            {/* Arrow */}
            <div 
              className={`
                absolute w-0 h-0 border-4 border-transparent
                ${arrowClasses[position]}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Icon button with tooltip wrapper
// Icon button with tooltip wrapper
export const TooltipIconButton = ({ 
  icon: Icon, 
  tooltip, 
  onClick, 
  className = '',
  variant = 'default', // 'default' | 'danger' | 'success' | 'warning'
  ...props            // 1. Capture all other props (like data-testid)
}) => {
  const variantClasses = {
    default: 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400',
    danger: 'text-gray-400 hover:text-red-600 dark:hover:text-red-400',
    success: 'text-gray-400 hover:text-green-600 dark:hover:text-green-400',
    warning: 'text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'
  };

  return (
    <Tooltip content={tooltip}>
      <motion.button
        {...props}       // 2. Spread those props onto the motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`
          p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
          transition-colors ${variantClasses[variant]} ${className}
        `}
      >
        <Icon size={16} />
      </motion.button>
    </Tooltip>
  );
};

export default Tooltip;
