"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { EASE_PRECISE } from "@/lib/motion-variants";

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const svgHelixRef = useRef<SVGSVGElement>(null);
  const progressObj = useRef({ value: 0 });
  const shouldReduceMotion = useReducedMotion();

  // Enforce session check on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasLoaded = sessionStorage.getItem("nexusbio-loaded");
      if (hasLoaded) {
        setIsVisible(false);
        return;
      }
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Prevent body scrolling
    document.body.style.overflow = "hidden";

    let fontsLoaded = false;
    let r3fLoaded = false;
    const startTime = Date.now();
    const minDuration = 1400; // Force 1.4s minimum duration

    const updateMilestone = () => {
      let targetProgress = 10; // Baseline init
      if (fontsLoaded) targetProgress += 30; // Weight: 40% fonts
      if (r3fLoaded) targetProgress += 60;   // Weight: 60% R3F bundle

      // Animate progress smoothly toward target progress
      gsap.to(progressObj.current, {
        value: targetProgress,
        duration: shouldReduceMotion ? 0.3 : 0.8,
        ease: "power2.out",
        onUpdate: () => {
          const currentProgress = Math.min(100, Math.floor(progressObj.current.value));

          // 1. Direct percentage text update to avoid React re-render lags
          if (percentRef.current) {
            percentRef.current.innerText = `${currentProgress}%`;
          }

          // 2. Animate SVG paths via stroke-dashoffset
          const paths = svgHelixRef.current?.querySelectorAll(".helix-path");
          if (paths && !shouldReduceMotion) {
            paths.forEach((path: any) => {
              const length = path.getTotalLength();
              path.style.strokeDasharray = length;
              path.style.strokeDashoffset = length - (length * (currentProgress / 100));
            });
          }
        },
        onComplete: () => {
          if (progressObj.current.value >= 100) {
            const timeElapsed = Date.now() - startTime;
            const remainingDelay = Math.max(0, minDuration - timeElapsed);

            // Hold 200ms past completion
            setTimeout(() => {
              setIsWiping(true);
            }, remainingDelay + 200);
          }
        },
      });
    };

    // 1. Check fonts loading state
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready
        .then(() => {
          fontsLoaded = true;
          updateMilestone();
        })
        .catch(() => {
          fontsLoaded = true;
          updateMilestone();
        });
    } else {
      fontsLoaded = true;
      updateMilestone();
    }

    // 2. Pre-trigger the R3F Canvas component import
    import("../visuals/DnaHelix")
      .then(() => {
        r3fLoaded = true;
        updateMilestone();
      })
      .catch(() => {
        r3fLoaded = true;
        updateMilestone();
      });

    // Fallback safety trigger (don't exceed real load time by > 800ms)
    const fallbackTimer = setTimeout(() => {
      if (progressObj.current.value < 100) {
        fontsLoaded = true;
        r3fLoaded = true;
        updateMilestone();
      }
    }, 2200);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [isVisible, shouldReduceMotion]);

  // Restore scroll and finish loading
  const handleWipeComplete = () => {
    setIsVisible(false);
    document.body.style.overflow = "";
    sessionStorage.setItem("nexusbio-loaded", "true");
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={containerRef}
        initial={{ clipPath: "circle(150% at 50% 50%)", opacity: 1 }}
        animate={
          isWiping
            ? shouldReduceMotion
              ? { opacity: 0 }
              : { clipPath: "circle(0% at 50% 50%)" }
            : {}
        }
        transition={{
          duration: shouldReduceMotion ? 0.6 : 0.8,
          ease: shouldReduceMotion ? "easeInOut" : EASE_PRECISE,
        }}
        onAnimationComplete={() => {
          if (isWiping) handleWipeComplete();
        }}
        className="fixed inset-0 bg-[#05070A] flex flex-col items-center justify-center z-[9999]"
        role="dialog"
        aria-modal="true"
        aria-label="Loading website contents"
      >
        <div className="flex flex-col items-center gap-8 select-none">
          {/* Centered SVG double-helix drawing */}
          <motion.svg
            ref={svgHelixRef}
            width="80"
            height="180"
            viewBox="0 0 80 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-20 h-44"
            animate={isWiping ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          >
            {/* Horizontal Rungs (connectors) */}
            <g stroke="white" strokeOpacity="0.08" strokeWidth="1">
              <line x1="20" y1="30" x2="60" y2="30" />
              <line x1="12" y1="60" x2="68" y2="60" />
              <line x1="20" y1="90" x2="60" y2="90" />
              <line x1="12" y1="120" x2="68" y2="120" />
              <line x1="20" y1="150" x2="60" y2="150" />
            </g>

            {/* Helix Strand 1 - Teal Accent */}
            <path
              className="helix-path"
              d="M40 10 C 80 40, 80 70, 40 100 C 0 130, 0 160, 40 190"
              stroke="var(--accent-teal)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Helix Strand 2 - Violet Accent */}
            <path
              className="helix-path"
              d="M40 10 C 0 40, 0 70, 40 100 C 80 130, 80 160, 40 190"
              stroke="var(--accent-violet)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </motion.svg>

          {/* Percentage Counter text */}
          <div className="flex flex-col items-center gap-1.5">
            <span
              ref={percentRef}
              className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight"
            >
              0%
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/30">
              NexusBio Synthesizing
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
