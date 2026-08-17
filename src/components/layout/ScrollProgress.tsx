"use client";

import React, { useEffect, useState } from "react";
import { SECTIONS } from "@/data/sections";
import { useLenis } from "@/components/layout/SmoothScrollProvider";
import { motion, useReducedMotion } from "framer-motion";

export default function ScrollProgress() {
  const [activeId, setActiveId] = useState("hero");
  const lenis = useLenis();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Monitor section entries via IntersectionObserver to update active state
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -25% 0px", // Trigger active section near screen center
      threshold: 0.15,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleDotClick = (id: string) => {
    if (lenis) {
      lenis.scrollTo(`#${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeIndex = SECTIONS.findIndex((s) => s.id === activeId);
  const fillRatio = SECTIONS.length > 1 ? activeIndex / (SECTIONS.length - 1) : 0;

  return (
    <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col items-center z-[45] select-none">
      {/* Background Track Line */}
      <div className="absolute w-[2px] h-[300px] bg-foreground/10 rounded-full z-0">
        {/* Active fill line ending exactly at the active section's dot */}
        <motion.div
          className="w-full bg-gradient-to-b from-accent-teal to-accent-violet rounded-full origin-top"
          style={{ height: "100%" }}
          animate={{ scaleY: fillRatio }}
          transition={
            shouldReduceMotion
              ? { duration: 0.1 }
              : { type: "spring", stiffness: 120, damping: 18 }
          }
        />
      </div>

      {/* Nodes and Tooltips */}
      <div className="relative z-10 flex flex-col justify-between h-[300px] items-center">
        {SECTIONS.map((section) => {
          const isActive = section.id === activeId;
          return (
            <div
              key={section.id}
              data-cursor="hover"
              className="relative group flex items-center justify-center w-11 h-11 cursor-pointer"
              onClick={() => handleDotClick(section.id)}
            >
              {/* Tooltip on Hover */}
              <div className="absolute right-8 bg-[#05070A]/95 backdrop-blur-md border border-foreground/10 text-[9px] font-mono uppercase tracking-widest text-foreground px-3 py-1.5 rounded-md opacity-0 pointer-events-none translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-xl whitespace-nowrap">
                {section.label}
              </div>

              {/* Indicator Dot */}
              <motion.div
                className={`rounded-full border transition-all duration-300 ${
                  isActive
                    ? "w-2.5 h-2.5 bg-accent-teal border-accent-teal shadow-[0_0_12px_rgba(0,229,199,0.6)]"
                    : "w-1.5 h-1.5 bg-foreground/20 border-transparent hover:bg-accent-teal/60"
                }`}
                animate={{
                  scale: isActive ? 1.2 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
