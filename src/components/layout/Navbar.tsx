"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { fadeIn, staggerContainer, EASE_PRECISE } from "@/lib/motion-variants";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Technology", href: "#technology" },
  { name: "Capabilities", href: "#capabilities" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  // Transitions for background and border based on scroll position
  // Starts transparent, transitions to glassmorphism past 80px scroll
  const duration = shouldReduceMotion ? 0.1 : 0.3;
  const background = useTransform(
    scrollY,
    [0, 80],
    ["rgba(5, 7, 10, 0)", "rgba(5, 7, 10, 0.75)"]
  );
  const backdropBlur = useTransform(
    scrollY,
    [0, 80],
    ["blur(0px)", "blur(12px)"]
  );
  const borderBottom = useTransform(
    scrollY,
    [0, 80],
    ["rgba(244, 246, 245, 0)", "rgba(244, 246, 245, 0.08)"]
  );

  // Close mobile drawer on resize to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Control scrolling lock when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const slideInVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: {
        type: "tween" as const,
        duration: shouldReduceMotion ? 0.15 : 0.4,
        ease: EASE_PRECISE,
      },
    },
    exit: {
      x: "100%",
      transition: {
        type: "tween" as const,
        duration: shouldReduceMotion ? 0.1 : 0.3,
        ease: EASE_PRECISE,
      },
    },
  };

  return (
    <motion.header
      style={{
        background: isOpen ? "rgba(5, 7, 10, 0.75)" : background,
        backdropFilter: isOpen ? "blur(12px)" : backdropBlur,
        WebkitBackdropFilter: isOpen ? "blur(12px)" : backdropBlur,
        borderBottom: isOpen ? "rgba(244, 246, 245, 0.08)" : borderBottom,
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
    >
      <div className="mx-auto max-w-container px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Geometric Abstract SVG Logo Mark */}
        <a href="#" className="flex items-center gap-3 group focus:outline-none focus-visible:outline-2 focus-visible:outline-accent-teal focus-visible:outline-offset-4 rounded-md">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00E5C7" />
                <stop offset="100%" stopColor="#7C5CFF" />
              </linearGradient>
            </defs>
            {/* Hexagonal outer shell with gaps */}
            <path
              d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
              stroke="url(#logo-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:rotate-90 transition-transform duration-700 ease-out origin-center"
            />
            {/* Inner crystalline nucleus */}
            <path
              d="M16 8L23 12V20L16 24L9 20V12L16 8Z"
              fill="url(#logo-grad)"
              fillOpacity="0.15"
              stroke="url(#logo-grad)"
              strokeWidth="1"
            />
            <circle cx="16" cy="16" r="3" fill="var(--accent-teal)" />
          </svg>
          <span className="font-display font-bold tracking-tight text-lg text-foreground bg-clip-text">
            NEXUS<span className="text-accent-teal">BIO</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-accent-teal transition-colors relative py-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-accent-teal focus-visible:outline-offset-4 rounded-md focus:text-accent-teal"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-background bg-accent-teal hover:bg-accent-teal/90 transition-all shadow-[0_0_20px_rgba(0,229,199,0.15)] hover:shadow-[0_0_30px_rgba(0,229,199,0.3)] hover:scale-[1.02] active:scale-[0.98] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070A]"
          >
            Initiate Discovery
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-foreground/80 hover:text-accent-teal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070A] rounded-md"
          aria-expanded={isOpen}
          aria-controls="mobile-drawer"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#05070A]/40 backdrop-blur-sm z-30 md:hidden"
              aria-hidden="true"
            />

            {/* Slide-out side drawer */}
            <motion.div
              id="mobile-drawer"
              variants={slideInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-20 right-0 bottom-0 w-80 bg-[#05070A]/95 backdrop-blur-xl border-l border-white/10 shadow-[-10px_0_30px_rgba(5,7,10,0.5)] z-40 md:hidden flex flex-col p-8 justify-between"
            >
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-6"
              >
                {navLinks.map((link) => (
                  <motion.div
                    key={link.name}
                    variants={fadeIn}
                    className="overflow-hidden"
                  >
                    <a
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block text-2xl font-display font-medium text-foreground hover:text-accent-teal transition-colors py-3 focus:outline-none focus-visible:outline-2 focus-visible:outline-accent-teal focus-visible:outline-offset-2 rounded-md"
                    >
                      {link.name}
                    </a>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0.05 : 0.3, duration }}
                className="flex flex-col gap-4"
              >
                <div className="h-px bg-foreground/10 my-4" aria-hidden="true" />
                <a
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wider text-background bg-accent-teal hover:bg-accent-teal/95 transition-all shadow-[0_0_20px_rgba(0,229,199,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070A]"
                >
                  Initiate Discovery
                </a>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
