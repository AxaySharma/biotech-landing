"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/lib/gsap";
import { Dna, ClipboardList, FileSpreadsheet, BarChart2, Cog, Database } from "lucide-react";

const capabilitiesList = [
  {
    icon: Dna,
    title: "Genomic Sequencing & Analysis",
    description: "Next-generation sequencing protocols and sequence assembly pipelines mapping target mutations.",
    color: "var(--accent-teal)",
  },
  {
    icon: ClipboardList,
    title: "Preclinical Study Design",
    description: "In-vitro assays, toxicity screening, and animal model protocols structured for investigational new drug (IND) applications.",
    color: "var(--accent-violet)",
  },
  {
    icon: FileSpreadsheet,
    title: "Regulatory Submission Support",
    description: "Preparation of technical dossiers, chemistry manufacturing and controls (CMC) documentation, and FDA clinical protocols.",
    color: "var(--accent-teal)",
  },
  {
    icon: BarChart2,
    title: "Bioinformatics Consulting",
    description: "Custom statistical pipelines, expression pattern analysis, and machine learning models for cohort screening.",
    color: "var(--accent-violet)",
  },
  {
    icon: Cog,
    title: "Lab Process Automation",
    description: "Robotic system integration, automated microfluidics, and fluid handling protocols to increase assay throughput.",
    color: "var(--accent-teal)",
  },
  {
    icon: Database,
    title: "Clinical Trial Data Management",
    description: "FDA-compliant electronic data capture (EDC) setups and automated data verification systems.",
    color: "var(--accent-violet)",
  },
];

export default function Capabilities() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Staggered fade-up entry animation via GSAP ScrollTrigger
    let ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".capability-card");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 bg-background relative z-10 w-full" id="capabilities">
      <div className="max-w-container mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-foreground/40">
            R&D Services
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
            Scientific Capabilities
          </h2>
        </div>

        {/* Responsive Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
          {capabilitiesList.map((item, idx) => {
            const IconComp = item.icon;
            const hoverBorderClass = item.color === "var(--accent-teal)"
              ? "hover:!border-[rgba(0,229,199,0.45)] focus-visible:!border-[rgba(0,229,199,0.45)]"
              : "hover:!border-[rgba(124,92,255,0.45)] focus-visible:!border-[rgba(124,92,255,0.45)]";

            return (
              <motion.div
                key={idx}
                data-cursor="hover"
                tabIndex={0}
                whileHover="hover"
                whileFocus="hover"
                variants={{
                  hover: { y: -6 },
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`capability-card bg-white/[0.01] border rounded-2xl p-8 hover:bg-white/[0.03] focus-visible:bg-white/[0.03] outline-none transition-colors duration-300 group cursor-pointer flex flex-col justify-between ${hoverBorderClass}`}
                style={{
                  // Default subtle border color
                  borderColor: "rgba(244, 246, 245, 0.05)",
                }}
              >
                {/* Visualizer inner container wrapper */}
                <div className="flex flex-col gap-6">
                  {/* Icon with scale and rotate animations */}
                  <motion.div
                    variants={{
                      hover: { scale: 1.1, rotate: 6 },
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="w-12 h-12 rounded-xl bg-foreground/[0.03] flex items-center justify-center group-hover:bg-white/[0.02]"
                  >
                    <IconComp
                      className="w-6 h-6 transition-colors duration-300"
                      style={{ color: item.color }}
                    />
                  </motion.div>

                  {/* Text details */}
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-accent-teal transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-foreground/60 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
