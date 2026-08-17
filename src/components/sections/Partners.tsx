"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion-variants";

const partners = [
  {
    name: "BioCore Labs",
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    name: "Vertex Systems",
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
      </svg>
    ),
  },
  {
    name: "Helix Research",
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="4.5" cy="12" r="2.5" />
        <circle cx="19.5" cy="12" r="2.5" />
        <path d="M12 2v20M7 5l10 14M17 5L7 19" />
      </svg>
    ),
  },
  {
    name: "Synthetica Tech",
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 6v12M6 12h12" />
      </svg>
    ),
  },
  {
    name: "Aether Therapeutics",
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 22h20L12 2z" />
        <path d="M12 18V8" />
      </svg>
    ),
  },
  {
    name: "Novum Genomics",
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <path d="M9 17V7l6 10V7" />
      </svg>
    ),
  },
];

export default function Partners() {
  return (
    <section className="w-full bg-background py-16 border-t border-foreground/5 relative z-10">
      <div className="max-w-container mx-auto px-6 md:px-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center gap-10"
        >
          {/* Section Header - Calm & Understated */}
          <div className="flex items-center gap-4 w-full">
            <div className="h-px flex-grow bg-foreground/5" />
            <h2 className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-foreground/40 whitespace-nowrap">
              Collaborative Research & Clinical Partners
            </h2>
            <div className="h-px flex-grow bg-foreground/5" />
          </div>

          {/* Partner Logos Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-8 w-full justify-items-center items-center">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 text-foreground/30 hover:text-foreground/50 transition-colors duration-300 select-none group"
              >
                <div className="opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  {partner.logo}
                </div>
                <span className="font-display font-medium text-xs tracking-wider uppercase">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
