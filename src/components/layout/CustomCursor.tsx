"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export default function CustomCursor() {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Primary pointer coordinates (follows mouse with zero lag)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring settings - shorten delay (make stiffer/faster) if user prefers reduced motion
  const springConfig = {
    damping: shouldReduceMotion ? 12 : 30,
    stiffness: shouldReduceMotion ? 250 : 150,
    mass: shouldReduceMotion ? 0.1 : 0.5,
  };

  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only mount on desktop pointer types (pointer: fine)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mediaQuery.matches);

    const checkPointer = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    mediaQuery.addEventListener("change", checkPointer);
    return () => mediaQuery.removeEventListener("change", checkPointer);
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    // Hide native cursor only after the custom cursor has successfully mounted
    document.documentElement.classList.add("custom-cursor-active");

    const updateCoordinates = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const detectHover = (e: MouseEvent) => {
      const element = e.target as HTMLElement;
      if (!element) return;

      const hasHoverTrigger = 
        element.tagName === "A" ||
        element.tagName === "BUTTON" ||
        element.closest("a") ||
        element.closest("button") ||
        element.closest('[data-cursor="hover"]');

      setIsHovered(!!hasHoverTrigger);
    };

    window.addEventListener("mousemove", updateCoordinates);
    window.addEventListener("mouseover", detectHover);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", updateCoordinates);
      window.removeEventListener("mouseover", detectHover);
    };
  }, [isFinePointer, mouseX, mouseY]);

  if (!isFinePointer) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-cursor-active,
        .custom-cursor-active * {
          cursor: none !important;
        }
      `}} />
      
      {/* Central Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-accent-teal rounded-full pointer-events-none z-[9999]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 0.6 : 1,
        }}
        transition={{ duration: 0.15 }}
        aria-hidden="true"
      />

      {/* Spring-delayed Orbiting Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-accent-teal rounded-full pointer-events-none z-[9999]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 1.8 : 1,
          backgroundColor: isHovered ? "rgba(0, 229, 199, 0.05)" : "rgba(0, 229, 199, 0)",
        }}
        transition={{ duration: 0.2 }}
        aria-hidden="true"
      />
    </>
  );
}
