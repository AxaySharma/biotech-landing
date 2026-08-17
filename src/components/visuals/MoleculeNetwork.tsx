"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface MoleculeNetworkProps {
  activeIndex: number;
}

interface Node {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  phaseX: number;
  phaseY: number;
  radius: number;
}

export default function MoleculeNetwork({ activeIndex }: MoleculeNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const requestRef = useRef<number | null>(null);

  // Layout Generator Helper functions
  const generateLayout = (index: number, count: number, width: number, height: number): { x: number; y: number }[] => {
    const points: { x: number; y: number }[] = [];
    const cx = width / 2;
    const cy = height / 2;

    switch (index) {
      case 0: // Clustered Center (Target Discovery binding pocket)
        for (let i = 0; i < count; i++) {
          const r = (Math.random() * 0.4 + 0.1) * Math.min(width, height);
          const theta = (i / count) * Math.PI * 2;
          points.push({
            x: cx + Math.cos(theta) * r,
            y: cy + Math.sin(theta) * r,
          });
        }
        break;

      case 1: // Parallel Grid/Lattice (Gene Sequencing columns)
        const cols = 5;
        const rows = Math.ceil(count / cols);
        const colWidth = width / (cols + 1);
        const rowHeight = height / (rows + 1);
        for (let i = 0; i < count; i++) {
          const c = i % cols;
          const r = Math.floor(i / cols);
          points.push({
            x: colWidth * (c + 1) + (Math.random() - 0.5) * 15,
            y: rowHeight * (r + 1) + (Math.random() - 0.5) * 15,
          });
        }
        break;

      case 2: // Flow Pipeline (Molecular dynamics pathway)
        for (let i = 0; i < count; i++) {
          const fraction = (i / (count - 1));
          const wave = Math.sin(fraction * Math.PI * 3.5) * 45;
          points.push({
            x: width * 0.1 + fraction * (width * 0.8),
            y: cy + wave,
          });
        }
        break;

      case 3: // Concentric Rings (Clinical trial cohorts)
        for (let i = 0; i < count; i++) {
          const isOuter = i % 2 === 0;
          const r = isOuter ? Math.min(width, height) * 0.38 : Math.min(width, height) * 0.18;
          const theta = ((i / (count / 2)) * Math.PI) + (isOuter ? 0 : Math.PI / 4);
          points.push({
            x: cx + Math.cos(theta) * r,
            y: cy + Math.sin(theta) * r,
          });
        }
        break;

      default:
        for (let i = 0; i < count; i++) {
          points.push({
            x: Math.random() * width,
            y: Math.random() * height,
          });
        }
    }
    return points;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check device sizes
    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 18 : 32;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || 500;
      canvas.height = rect?.height || 400;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const w = canvas.width;
    const h = canvas.height;

    // Initialize node parameters
    const initialPoints = generateLayout(activeIndex, nodeCount, w, h);
    nodesRef.current = initialPoints.map((pt) => ({
      baseX: pt.x,
      baseY: pt.y,
      x: pt.x,
      y: pt.y,
      driftX: 0,
      driftY: 0,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      radius: Math.random() * 2 + 2,
    }));

    // Animation Loop
    let lastTime = 0;
    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      const nodes = nodesRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // Update positions with slow drift
      nodes.forEach((node) => {
        node.phaseX += delta * 0.45;
        node.phaseY += delta * 0.35;
        node.driftX = Math.sin(node.phaseX) * 15;
        node.driftY = Math.cos(node.phaseY) * 15;

        // Dynamic position interpolation
        node.x = node.baseX + node.driftX;
        node.y = node.baseY + node.driftY;
      });

      // Draw connection lines
      ctx.strokeStyle = "rgba(244, 246, 245, 0.06)";
      ctx.lineWidth = 1;
      const connectionDist = isMobile ? 75 : 95;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            // Muted fading connection paths
            ctx.strokeStyle = `rgba(244, 246, 245, ${0.08 * (1 - dist / connectionDist)})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        ctx.fillStyle = "rgba(244, 246, 245, 0.4)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Handle index transitions via GSAP tween mapping coordinates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodesRef.current.length === 0) return;

    const w = canvas.width;
    const h = canvas.height;
    const targetPoints = generateLayout(activeIndex, nodesRef.current.length, w, h);

    // Smoothly animate the target coordinates in ~500ms
    nodesRef.current.forEach((node, index) => {
      const target = targetPoints[index];
      if (target) {
        gsap.to(node, {
          baseX: target.x,
          baseY: target.y,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });
  }, [activeIndex]);

  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[400px] relative rounded-2xl bg-white/[0.01] border border-foreground/5 overflow-hidden flex items-center justify-center">
      {/* Absolute canvas container */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
