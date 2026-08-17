"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/motion-variants";
import MoleculeNetwork from "../visuals/MoleculeNetwork";

const techPillars = [
  {
    name: "Machine Learning Target Mapping",
    tagline: "ML-driven screening models locating binding pockets.",
    description: "Our proprietary deep learning models analyze large genetic cohorts to identify novel protein cavities. By running massive virtual screenings, we predict binding affinities of small molecules before committing to chemical synthesis.",
  },
  {
    name: "Parallel In-Silico Synthesis",
    tagline: "High-throughput molecular dynamics simulation.",
    description: "We simulate structural modifications and binding dynamics at sub-nanosecond resolutions across multiple high-performance cloud clusters. This provides atomic-level insights into ligand stability and structural changes.",
  },
  {
    name: "Automated Assay Pipelines",
    tagline: "Robotic screeners validating molecular efficacy.",
    description: "Our biological testing utilizes robotic assay stations that measure in-vitro binding kinetics, toxicity levels, and metabolic stability. This high-volume feedback loop validates in-silico models in real-time.",
  },
  {
    name: "Clinical Data Registry",
    tagline: "Compliant clinical-grade trial registries.",
    description: "Data architectures aggregate patient logs, blood panel histories, and biomarker reactions. This secure platform is constructed to satisfy clinical trial standards, facilitating rapid data compilation.",
  },
];

export default function Technology() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 bg-background relative z-10 w-full" id="technology">
      <div className="max-w-container mx-auto px-6 md:px-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left Column - Header + Navigation */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-foreground/40">
                R&D Architecture
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2 mb-4 lg:mb-6">
                Discovery Platforms
              </h2>
            </div>

            {/* Mobile Tab Selector: Horizontal, scrollable pills (Mobile/Tablet only) */}
            <div role="tablist" aria-label="Mobile platform selectors" className="flex lg:hidden items-center gap-2 overflow-x-auto pb-3 w-full -mx-6 px-6 md:-mx-12 md:px-12 scrollbar-none">
              {techPillars.map((pillar, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={idx}
                    id={`mobile-tab-${idx}`}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="pillar-tabpanel"
                    onClick={() => setActiveIndex(idx)}
                    className={`whitespace-nowrap px-5 py-3 rounded-full text-xs font-medium border transition-all duration-300 focus:outline-none focus-visible:outline-2 focus-visible:outline-accent-teal focus-visible:outline-offset-2 ${
                      isActive
                        ? "bg-accent-teal/10 border-accent-teal text-accent-teal"
                        : "bg-white/[0.02] border-foreground/5 text-foreground/60 hover:border-foreground/10"
                    }`}
                  >
                    {pillar.name}
                  </button>
                );
              })}
            </div>

            {/* Desktop Vertical Tab buttons (Desktop only) */}
            <div role="tablist" aria-label="Desktop platform selectors" className="hidden lg:flex flex-col gap-3">
              {techPillars.map((pillar, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={idx}
                    id={`desktop-tab-${idx}`}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="pillar-tabpanel"
                    onClick={() => setActiveIndex(idx)}
                    className={`text-left p-5 rounded-xl border transition-all duration-300 focus:outline-none focus-visible:outline-2 focus-visible:outline-accent-teal focus-visible:outline-offset-2 ${
                      isActive
                        ? "bg-white/[0.03] border-accent-teal/30 shadow-[0_0_15px_rgba(0,229,199,0.02)]"
                        : "bg-transparent border-foreground/5 hover:border-foreground/10 hover:bg-white/[0.01]"
                    }`}
                  >
                    <span
                      className={`block font-display text-sm font-semibold tracking-tight transition-colors duration-300 ${
                        isActive ? "text-accent-teal" : "text-foreground"
                      }`}
                    >
                      {pillar.name}
                    </span>
                    <span className="block text-xs text-foreground/50 font-sans mt-1 leading-relaxed">
                      {pillar.tagline}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column - Visualizer Canvas + Description Display */}
          <div className="lg:col-span-7 flex flex-col gap-6 w-full">
            {/* Visualizer network */}
            <div className="w-full aspect-[4/3] max-h-[380px] md:max-h-[420px] relative" aria-hidden="true">
              <MoleculeNetwork activeIndex={activeIndex} />
            </div>

            {/* Detailed Active Tab Info: Title, Tagline, and Description with key-bound transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                id="pillar-tabpanel"
                role="tabpanel"
                aria-labelledby={`desktop-tab-${activeIndex}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="p-6 rounded-2xl bg-white/[0.01] border border-foreground/5 min-h-[160px] flex flex-col justify-center"
              >
                <h3 className="font-display font-semibold text-base text-accent-teal mb-1">
                  {techPillars[activeIndex].name}
                </h3>
                <p className="text-[10px] text-foreground/40 font-mono uppercase tracking-widest mb-3">
                  {techPillars[activeIndex].tagline}
                </p>
                <p className="text-xs md:text-sm text-foreground/80 leading-relaxed font-sans">
                  {techPillars[activeIndex].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
