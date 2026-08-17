"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/lib/gsap";
import { Target, ShieldCheck, Cpu } from "lucide-react";

const statement = "We don't wait for biology to reveal itself. We engineer the questions that make it answer faster.";

const pillars = [
  {
    icon: Target,
    title: "Precision Research",
    description: "Targeted genomic analysis defining custom molecular interventions.",
    color: "var(--accent-teal)",
  },
  {
    icon: ShieldCheck,
    title: "Ethical Innovation",
    description: "Rigorous standards ensuring biosafety and long-term societal balance.",
    color: "var(--accent-violet)",
  },
  {
    icon: Cpu,
    title: "Scalable Discovery",
    description: "Automated synthesis platform reducing iteration cycle times.",
    color: "var(--accent-teal)",
  },
];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check screen resolution (Desktop vs Mobile)
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    
    // Create GSAP Context to automatically collect and clean up animations/triggers
    let ctx = gsap.context(() => {
      const words = textRef.current?.querySelectorAll(".kinetic-word");
      const cards = cardsRef.current?.querySelectorAll(".pillar-card");

      if (isDesktop) {
        // Desktop Pinning and Scrubbing Reveal Effect
        if (words && words.length > 0) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "+=120%", // Keep pinned for 120% of viewport height
              scrub: 1,
              pin: pinRef.current,
              anticipatePin: 1,
            },
          });

          // 1. Reveal words one by one as we scroll
          tl.to(words, {
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.1,
            ease: "none",
          });

          // 2. Stagger cards in from below toward the end of the scroll scrub
          if (cards && cards.length > 0) {
            tl.fromTo(
              cards,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.2,
                duration: 0.6,
                ease: "power2.out",
              },
              "+=0.1" // Small delay after text is fully visible
            );
          }
        }
      } else {
        // Mobile Viewports: Simple trigger-on-enter fade animations (No Pin/Scrub)
        if (words && words.length > 0) {
          gsap.fromTo(
            words,
            { opacity: 0.15, filter: "blur(4px)" },
            {
              opacity: 1,
              filter: "blur(0px)",
              stagger: 0.03,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: textRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }

        if (cards && cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.15,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }
    }, containerRef);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert(); // Reverts DOM states and safely destroys created ScrollTriggers
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const wordsList = statement.split(" ");

  return (
    <section
      ref={containerRef}
      className="relative min-h-[140vh] lg:min-h-[220vh] bg-background w-full"
      id="about"
    >
      {/* Pinned main content viewport */}
      <div
        ref={pinRef}
        className="w-full lg:h-screen flex flex-col justify-center items-center py-20 lg:py-0"
      >
        <div className="max-w-container mx-auto px-6 md:px-12 flex flex-col items-center justify-between w-full h-full lg:justify-center">
          
          {/* Kinetic Headline Statement */}
          <div
            ref={textRef}
            className="font-display text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-center max-w-5xl leading-[1.1] mb-16 lg:mb-20 text-foreground"
          >
            {wordsList.map((word, idx) => (
              <span
                key={idx}
                className="kinetic-word inline-block mr-[0.25em] transition-all"
                style={{ opacity: 0.15, filter: "blur(4px)" }}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Cards Layout container */}
          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
          >
            {pillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="pillar-card bg-white/[0.02] border border-foreground/5 hover:border-accent-teal/20 rounded-2xl p-8 hover:bg-white/[0.04] transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-foreground/[0.03] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                    <IconComp
                      className="w-6 h-6"
                      style={{ color: pillar.color }}
                    />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-foreground/60 leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
