"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/lib/gsap";
import { staggerContainer, fadeUp } from "@/lib/motion-variants";
import { ArrowRight } from "lucide-react";

// Magnetic Button Wrapper for Desktop viewports
function MagneticButton({
  children,
  href,
  className,
  ...props
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  [key: string]: any;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Mouse offsets
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for tracking/snap back
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || shouldReduceMotion) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Bound offset to 20px max
    const offsetX = (clientX - centerX) * 0.25;
    const offsetY = (clientY - centerY) * 0.25;

    x.set(Math.max(-20, Math.min(20, offsetX)));
    y.set(Math.max(-20, Math.min(20, offsetY)));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.98 }}
      className={className}
      {...props}
    >
      {children}
    </motion.a>
  );
}

export default function FinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Transition background color from standard navy (#05070A) to deeper richness (#020305) on scroll enter
    let ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { backgroundColor: "#05070A" },
        {
          backgroundColor: "#020305",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top 25%",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-28 md:py-36 relative overflow-hidden z-10 flex items-center justify-center border-t border-foreground/5"
      id="contact"
    >
      {/* Moving Ambient Biology Gradients (Radial glow driven by GPU animations) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes orbitGlow {
          0% { transform: translate(-15%, -15%) scale(1); }
          50% { transform: translate(15%, 15%) scale(1.15); }
          100% { transform: translate(-15%, -15%) scale(1); }
        }
        .cta-glow-element {
          background: radial-gradient(circle, rgba(0, 229, 199, 0.06) 0%, rgba(124, 92, 255, 0.05) 50%, transparent 80%);
          animation: orbitGlow 14s ease-in-out infinite;
        }
      `}} />
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="cta-glow-element absolute -top-1/2 -left-1/2 w-full h-full" />
        <div className="cta-glow-element absolute -bottom-1/2 -right-1/2 w-full h-full" style={{ animationDelay: "-7s" }} />
      </div>

      {/* Content block */}
      <div className="max-w-container mx-auto px-6 md:px-12 relative z-10 w-full text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center max-w-4xl mx-auto"
        >
          {/* Subheading */}
          <motion.div variants={fadeUp} className="mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-teal border border-accent-teal/20 px-3.5 py-1.5 rounded-full bg-accent-teal/5">
              R&D Integration
            </span>
          </motion.div>

          {/* Bold Emotive Headline */}
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-[1.05] tracking-tight mb-6"
          >
            Architecting the Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-teal to-accent-violet">
              Biological Frontier.
            </span>
          </motion.h2>

          {/* Confident, clinical support message */}
          <motion.p
            variants={fadeUp}
            className="text-sm md:text-base text-foreground/70 max-w-xl mb-12 leading-relaxed font-sans"
          >
            Partner with us to develop programmable therapeutics and molecular dynamics simulations that eliminate iteration timelines and redefine clinical translation.
          </motion.p>

          {/* Interactive CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-6 items-center"
          >
            {/* Magnetic primary button */}
            <MagneticButton
              href="#contact"
              data-cursor="hover"
              className="inline-flex items-center justify-center px-9 py-4 rounded-full text-sm font-semibold uppercase tracking-wider text-background bg-accent-teal hover:bg-accent-teal/95 transition-all shadow-[0_0_25px_rgba(0,229,199,0.15)] hover:shadow-[0_0_35px_rgba(0,229,199,0.3)] focus:outline-none"
            >
              Start a Conversation
            </MagneticButton>

            {/* Secondary chevron link */}
            <a
              href="#technology"
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground hover:text-accent-teal transition-colors py-2 focus:outline-none"
            >
              <span>View Our Research</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
