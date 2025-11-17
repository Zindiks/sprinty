// Animation variants and utilities for consistent animations across the app

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

export const slideDown = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const spring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

export const smoothTransition = {
  duration: 0.2,
  ease: "easeInOut" as const,
};

// Stagger animation for lists
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

// Focus ring styles for accessibility
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

// Transition classes
export const transitions = {
  default: "transition-all duration-200 ease-in-out",
  fast: "transition-all duration-100 ease-in-out",
  slow: "transition-all duration-300 ease-in-out",
  colors: "transition-colors duration-200 ease-in-out",
  transform: "transition-transform duration-200 ease-in-out",
  opacity: "transition-opacity duration-200 ease-in-out",
};

// Hover effects
export const hoverScale = "hover:scale-105 active:scale-95";
export const hoverLift = "hover:-translate-y-0.5 hover:shadow-md";
export const hoverGlow = "hover:shadow-lg hover:shadow-primary/20";
