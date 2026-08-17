"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/lib/gsap";

const statsData = [
  {
    targetNum: 1240,
    prefix: "",
    suffix: "+",
    label: "Compounds Screened Annually",
    percent: 78,
    decimals: 0,
  },
  {
    targetNum: 42,
    prefix: "",
    suffix: "",
    label: "Research Partners In 14 Countries",
    percent: 48,
    decimals: 0,
  },
  {
    targetNum: 98.74,
    prefix: "",
    suffix: "%",
    label: "Assay Reproducibility Rate",
    percent: 98.74,
    decimals: 2,
  },
  {
    targetNum: 6.4,
    prefix: "",
    suffix: " Yrs",
    label: "Mean Trial-to-Market Reduction",
    percent: 82,
    decimals: 1,
  },
];

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressVal = useRef({ value: 0 });

  useEffect(() => {
    // Sync numerical counting with bar width animations in a single GSAP tween
    let ctx = gsap.context(() => {
      const bars = sectionRef.current?.querySelectorAll(".stat-bar-fill");
      const numbers = sectionRef.current?.querySelectorAll(".stat-number");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.to(progressVal.current, {
        value: 1,
        duration: 2.0,
        ease: "power2.out",
        onUpdate: () => {
          const progress = progressVal.current.value;

          // 1. Animate bar widths
          bars?.forEach((bar: any, idx) => {
            const targetWidth = statsData[idx].percent;
            bar.style.width = `${progress * targetWidth}%`;
          });

          // 2. Animate counter values
          numbers?.forEach((num: any, idx) => {
            const item = statsData[idx];
            const currentVal = progress * item.targetNum;
            num.innerText = `${item.prefix}${currentVal.toFixed(item.decimals)}${item.suffix}`;
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#030508] py-20 border-t border-b border-foreground/5 relative overflow-hidden z-10"
      id="stats"
    >
      {/* Dynamic Grid Background overlay */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes panGrid {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        .stats-grid-bg {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(244, 246, 245, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(244, 246, 245, 0.015) 1px, transparent 1px);
          animation: panGrid 24s linear infinite;
        }
      `}} />
      <div className="stats-grid-bg absolute inset-0 pointer-events-none opacity-80" />

      {/* Content wrapper */}
      <div className="max-w-container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {statsData.map((stat, idx) => (
            <div key={idx} className="flex flex-col select-none">
              
              {/* Progress Bar visualization container */}
              <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden mb-5 relative">
                <div
                  className="stat-bar-fill h-full bg-gradient-to-r from-accent-teal to-accent-violet rounded-full"
                  style={{ width: "0%" }}
                />
              </div>

              {/* Number readout text */}
              <span className="stat-number font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                0
              </span>

              {/* Muted science labels */}
              <span className="text-[10px] md:text-xs text-foreground/50 uppercase tracking-widest font-mono mt-2 leading-relaxed">
                {stat.label}
              </span>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
