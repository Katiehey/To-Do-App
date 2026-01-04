import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const SuccessAnimation = ({ show, onComplete }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-[200] pointer-events-none bg-white/10 dark:bg-black/20 backdrop-blur-[2px]"
      onAnimationComplete={() => {
        // Automatically trigger completion after a short delay
        setTimeout(onComplete, 1500);
      }}
    >
      <div className="relative">
        {/* Main Check Circle */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: [0, 1.2, 1], rotate: 0 }}
          transition={{ 
            duration: 0.5, 
            times: [0, 0.6, 1],
            type: 'spring',
            stiffness: 300,
            damping: 20
          }}
          className="bg-green-500 dark:bg-green-600 rounded-full p-6 shadow-[0_0_40px_rgba(34,197,94,0.4)] relative z-10"
        >
          <motion.div
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Check className="w-16 h-16 text-white" strokeWidth={4} />
          </motion.div>
        </motion.div>

        {/* Ripple Effects */}
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: i * 0.1,
              ease: "easeOut" 
            }}
            className="absolute inset-0 bg-green-500/50 rounded-full"
          />
        ))}

        {/* Floating Particles (Confetti Burst) */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0 }}
            animate={{ 
              x: Math.cos(i * 45) * 80, 
              y: Math.sin(i * 45) * 80, 
              scale: [0, 1, 0] 
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-400 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
};

// Inline check for individual tasks
export const InlineSuccessCheck = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className="bg-green-100 dark:bg-green-900/30 p-0.5 rounded-full"
  >
    <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" strokeWidth={3} />
  </motion.div>
);

// Improved Progress Ring
export const ProgressRing = ({ progress, size = 120, colorClass = "text-blue-500" }) => {
  const strokeWidth = 10; // Slightly thicker for better visibility
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-100 dark:text-slate-800 transition-colors"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={colorClass}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black text-slate-800 dark:text-slate-100"
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
    </div>
  );
};

export default SuccessAnimation;