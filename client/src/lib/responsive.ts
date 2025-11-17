// Mobile responsiveness utilities and breakpoint helpers

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Mobile-first responsive classes
export const responsive = {
  // Padding
  padding: {
    sm: "p-4 md:p-6",
    md: "p-6 md:p-8",
    lg: "p-8 md:p-10",
  },
  // Spacing
  spacing: {
    sm: "space-y-3 md:space-y-4",
    md: "space-y-4 md:space-y-6",
    lg: "space-y-6 md:space-y-8",
  },
  // Text
  text: {
    xs: "text-xs md:text-sm",
    sm: "text-sm md:text-base",
    base: "text-base md:text-lg",
    lg: "text-lg md:text-xl",
  },
  // Grid
  grid: {
    cols2: "grid-cols-1 md:grid-cols-2",
    cols3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    cols4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  },
  // Flex
  flex: {
    col: "flex-col md:flex-row",
    colReverse: "flex-col-reverse md:flex-row",
  },
  // Width
  width: {
    full: "w-full md:w-auto",
    auto: "w-auto md:w-full",
  },
};

// Touch target minimum size (44x44px for WCAG compliance)
export const touchTarget = "min-h-[44px] min-w-[44px]";

// Mobile-friendly spacing
export const mobileSpacing = {
  section: "space-y-4 md:space-y-6",
  item: "space-y-2 md:space-y-3",
  compact: "space-y-1 md:space-y-2",
};

// Responsive container
export const container = "container mx-auto px-4 md:px-6 lg:px-8";

// Stack on mobile, row on desktop
export const stackToRow = "flex flex-col sm:flex-row gap-2 sm:gap-4";

// Hide on mobile
export const hideOnMobile = "hidden md:block";

// Show only on mobile
export const showOnMobile = "md:hidden";

// Responsive font sizes
export const fontSize = {
  hero: "text-3xl md:text-4xl lg:text-5xl",
  title: "text-2xl md:text-3xl lg:text-4xl",
  subtitle: "text-xl md:text-2xl",
  body: "text-sm md:text-base",
  small: "text-xs md:text-sm",
};

// Responsive gap
export const gap = {
  sm: "gap-2 md:gap-3",
  md: "gap-3 md:gap-4",
  lg: "gap-4 md:gap-6",
};

// Detect if device is mobile
export const isMobile = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
};

// Detect if device has touch support
export const hasTouch = () => {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

// Prefer reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
