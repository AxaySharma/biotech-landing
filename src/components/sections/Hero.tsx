"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motion-variants";

// Lazy-load the R3F DNA Helix Canvas component to optimize bundle and initial load
const DnaHelix = dynamic(() => import("../visuals/DnaHelix"), {
  ssr: false,
  loading: () => <HelixPlaceholder />,
});

// Lightweight static gradient placeholder visible during client-side hydration
function HelixPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="absolute w-[280px] h-[280px] md:w-[450px] md:h-[450px] rounded-full bg-gradient-to-tr from-accent-teal/15 to-accent-violet/15 blur-[60px] animate-pulse" />
      <div className="text-xs font-mono uppercase tracking-widest text-foreground/30 animate-pulse">
        Initializing 3D Visualizer...
      </div>
    </div>
  );
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  // Scroll indicator opacity goes from 1 to 0 after scrolling 100px
  const indicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Background ambient glow accents */}
      <div className="absolute top-1/4 left-10 w-[300px] h-[300px] rounded-full bg-accent-teal/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[350px] h-[350px] rounded-full bg-accent-violet/5 blur-[140px] pointer-events-none" />

      <div className="w-full max-w-container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10 py-12">
        
        {/* Left Side Content Column */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="col-span-1 md:col-span-7 flex flex-col justify-center order-2 md:order-1 relative z-20"
        >
          {/* Tagline */}
          <motion.div variants={fadeUp} className="mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-teal border border-accent-teal/30 px-3.5 py-1.5 rounded-full bg-accent-teal/5">
              Molecular Design System
            </span>
          </motion.div>

          {/* Premium Biotech Headlines (Selected option: Architecting Molecular Intelligence) */}
          <motion.h1
            variants={fadeUp}
            className="text-hero font-display font-bold text-foreground mb-6 leading-[0.95] tracking-tight"
          >
            Architecting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-teal via-accent-teal to-accent-violet">
              Molecular Intelligence.
            </span>
          </motion.h1>

          {/* Supporting paragraph (max 2 sentences) */}
          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg text-foreground/80 max-w-xl mb-10 leading-relaxed font-sans"
          >
            Developing programmable therapeutics at the intersection of genetic engineering and artificial intelligence. 
            We rewrite biological code to eliminate disease at its source.
          </motion.p>

          {/* Call to Actions (CTAs) */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-4 items-center"
          >
            <a
              href="#research"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider text-background bg-accent-teal hover:bg-accent-teal/90 transition-all shadow-[0_0_25px_rgba(0,229,199,0.2)] hover:shadow-[0_0_35px_rgba(0,229,199,0.35)] hover:scale-[1.02] active:scale-[0.98] duration-250 focus:outline-none"
            >
              Explore Our Research
            </a>
            
            <a
              href="#overview"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider text-foreground hover:text-accent-teal border border-foreground/10 hover:border-accent-teal/30 bg-white/5 hover:bg-accent-teal/5 transition-all duration-250 focus:outline-none"
            >
              Watch Overview
            </a>
          </motion.div>
        </motion.div>

        {/* Right Side 3D Visualizer Column */}
        <div className="col-span-1 md:col-span-5 h-[40vh] md:h-[70vh] flex items-center justify-center order-1 md:order-2 relative">
          <div className="absolute inset-0 z-0">
            {/* 3D double-helix element */}
            <DnaHelix isMobile={isMobile} />
          </div>
        </div>

      </div>

      {/* Gentle bouncing scroll indicator at bottom center */}
      <motion.div
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">
          Scroll to explore
        </span>
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
          transition={
            shouldReduceMotion
              ? {}
              : {
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="w-5 h-8 rounded-full border border-foreground/20 flex justify-center p-1.5"
        >
          <div className="w-1 h-1.5 bg-accent-teal rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
