/**
 * Animation Variants for Framer Motion
 * * Easing Guide:
 * [0.4, 0, 0.2, 1] - Standard "Expressive" easing
 * [0.175, 0.885, 0.32, 1.1] - Slight overshoot (springy but professional)
 */

// 1. Basic Transitions
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: { duration: 0.2 }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.15 }
  }
};

// 2. Container Stagger (Great for Task Lists)
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Faster stagger feels more responsive
      delayChildren: 0.05
    }
  }
};

// 3. Modals & Overlays
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      damping: 25, 
      stiffness: 300 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    transition: { duration: 0.2 }
  }
};

// 4. Task Specific Micro-interactions
export const taskItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    x: 20, 
    transition: { duration: 0.2 } 
  },
  // Layout property allows smooth "sliding up" when an item above is deleted
  layout: {
    transition: { duration: 0.3 }
  }
};

// 5. Buttons & Taps
export const buttonPress = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.96 },
  transition: { type: "spring", stiffness: 400, damping: 17 }
};

// 6. Notifications (Springy slide-in)
export const notificationVariants = {
  hidden: { opacity: 0, x: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    }
  },
  exit: { 
    opacity: 0, 
    x: 20, 
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

// 7. Success Checkmark (Path tracing)
export const checkmarkVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1, 
    opacity: 1,
    transition: { 
      duration: 0.4, 
      ease: "easeInOut" 
    }
  }
};

// Add these to your existing animations.js file
export const hoverScale = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  rest: { scale: 1 }
};

export const shakeVariants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  }
};