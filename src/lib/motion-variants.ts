import { Variants } from "framer-motion";

// Custom premium cubic-bezier easing: highly precise, smooth decelerating curve
// Fits a clinical, high-tech, biotechnology aesthetic.
export const EASE_PRECISE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Static motion variants (ready to use directly)
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: EASE_PRECISE,
    },
  },
};

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE_PRECISE,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

/**
 * Dynamic motion variants (functions to customize duration, delay, and offsets)
 */
export const getFadeIn = (duration = 0.8, delay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration,
      delay,
      ease: EASE_PRECISE,
    },
  },
});

export const getFadeUp = (duration = 0.8, delay = 0, yOffset = 30): Variants => ({
  hidden: {
    opacity: 0,
    y: yOffset,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: EASE_PRECISE,
    },
  },
});

export const getStaggerContainer = (staggerChildren = 0.15, delayChildren = 0): Variants => ({
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});
