export const COURSE_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "web-development", label: "Web Development", icon: "💻" },
  { value: "data-science", label: "Data Science", icon: "📊" },
  { value: "design", label: "Design", icon: "🎨" },
  { value: "marketing", label: "Marketing", icon: "📢" },
  { value: "mobile-development", label: "Mobile Development", icon: "📱" },
  { value: "business", label: "Business", icon: "💼" },
  { value: "photography", label: "Photography", icon: "📸" },
  { value: "music", label: "Music", icon: "🎵" },
];

export const COURSE_LEVELS = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner", color: "green" },
  { value: "intermediate", label: "Intermediate", color: "yellow" },
  { value: "advanced", label: "Advanced", color: "red" },
];

export const PRICE_RANGES = [
  { value: "all", label: "All Prices" },
  { value: "free", label: "Free" },
  { value: "under50", label: "Under $50" },
  { value: "50-100", label: "$50 - $100" },
  { value: "over100", label: "$100+" },
];

export const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export const RATING_OPTIONS = [
  { value: "all", label: "All Ratings" },
  { value: "4.5", label: "4.5 & up" },
  { value: "4.0", label: "4.0 & up" },
  { value: "3.5", label: "3.5 & up" },
];

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
};

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export const COLORS = {
  primary: {
    50: "#eff6ff",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  },
  success: {
    500: "#10b981",
    600: "#059669",
  },
  error: {
    500: "#ef4444",
    600: "#dc2626",
  },
  warning: {
    500: "#f59e0b",
    600: "#d97706",
  },
};
