"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";
import { useLenis } from "@/components/layout/SmoothScrollProvider";
import { SECTIONS } from "@/data/sections";

const customVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const customFragmentShader = `
  uniform float uTime;
  uniform float uScrollVelocity;
  uniform vec2 uMouse;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uBgColor;
  varying vec2 vUv;

  // GLSL 2D Simplex Noise by Ashima Arts
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx) ;
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 a0 = x - floor(x + 0.5);
    vec3 g = a0 * vec3(x0.x,x12.x,x12.z) + h * vec3(x0.y,x12.y,x12.w);
    vec3 color = 130.0 * m * g;
    return color.x + color.y + color.z;
  }

  // Fractional Brownian Motion for layered domain warping
  float fbm(vec2 p, float t) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mod(t, 2.0) > 1.0 ? mat2(0.87, 0.48, -0.48, 0.87) : mat2(0.5, 0.86, -0.86, 0.5);
    for (int i = 0; i < 4; ++i) {
      value += amplitude * snoise(p + t);
      p = rot * p * 2.0 + shift;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    
    // Domain warp stage 1 (flow-field distortion)
    vec2 q = vec2(
      fbm(uv * 1.5 + vec2(0.0, 0.0), uTime * 0.015),
      fbm(uv * 1.5 + vec2(5.2, 1.3), uTime * 0.015)
    );
    
    // Domain warp stage 2 (warped inputs influenced by scroll velocity)
    vec2 r = vec2(
      fbm(uv * 3.0 + q * 3.5 + vec2(8.3, 2.8), uTime * (0.01 + uScrollVelocity * 0.03)),
      fbm(uv * 3.0 + q * 3.5 + vec2(1.2, 5.7), uTime * (0.01 + uScrollVelocity * 0.03))
    );
    
    float noiseVal = fbm(uv * 2.5 + r * 2.5, uTime * 0.005);
    float n = (noiseVal + 1.0) * 0.5;

    // Subtle local distortion glow near mouse coordinates
    float mouseDist = distance(uv, uMouse);
    float mouseGlow = smoothstep(0.4, 0.0, mouseDist) * (0.04 + uScrollVelocity * 0.03);

    // Dynamic gradient color blend (increased perceptibility while maintaining text contrast)
    vec3 color = mix(uBgColor, uColorA, n * 0.12); // Increased A mix strength
    color = mix(color, uColorB, r.x * 0.10);        // Increased B mix strength
    color += uColorA * mouseGlow;                  // Soft hover glow addition

    gl_FragColor = vec4(color, 1.0);
  }
`;

interface ShaderPlaneProps {
  isVisible: boolean;
  activeId: string;
}

function ShaderPlane({ isVisible, activeId }: ShaderPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const shouldReduceMotion = useReducedMotion();
  const lenis = useLenis();

  // Mouse and Scroll tracking states
  const mouseCoords = useRef({ x: 0.5, y: 0.5 });
  const scrollVelocity = useRef(0);

  // Track cursor position globally on mount
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseCoords.current.x = e.clientX / window.innerWidth;
      mouseCoords.current.y = 1.0 - (e.clientY / window.innerHeight); // WebGL coordinates start Y at bottom
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Create uniforms (Initial: Teal-dominant matching Hero section)
  const uniforms = useRef({
    uTime: { value: 0 },
    uScrollVelocity: { value: 0.02 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uColorA: { value: new THREE.Color("#00E5C7") },
    uColorB: { value: new THREE.Color("#05070A") },
    uBgColor: { value: new THREE.Color("#05070A") },
  });

  useFrame((state) => {
    if (!meshRef.current || !isVisible) return;

    const time = state.clock.getElapsedTime();

    // 1. Time uniform (stops if user prefers reduced motion)
    if (!shouldReduceMotion) {
      uniforms.current.uTime.value = time;
    } else {
      uniforms.current.uTime.value = 0;
    }

    // 2. Lerp cursor coordinates
    uniforms.current.uMouse.value.lerp(
      new THREE.Vector2(mouseCoords.current.x, mouseCoords.current.y),
      0.05
    );

    // 3. Track actual scroll velocity from Lenis and decay
    let currentVelocity = 0;
    if (lenis) {
      // Normalize velocity (cap at 60 pixels per frame/ms)
      currentVelocity = Math.min(60, Math.abs(lenis.velocity)) / 60;
    }

    // Lerp scroll velocity for smooth lingering decay
    scrollVelocity.current = THREE.MathUtils.lerp(
      scrollVelocity.current,
      currentVelocity,
      0.03
    );

    uniforms.current.uScrollVelocity.value = 0.02 + scrollVelocity.current * 0.5;

    // 4. Smoothly interpolate (lerp) uniform colors toward the target section color pair
    const targetColorA = new THREE.Color();
    const targetColorB = new THREE.Color();

    if (activeId === "hero") {
      targetColorA.set("#00E5C7"); // Strong Teal-dominant
      targetColorB.set("#05070A");
    } else if (activeId === "partners") {
      targetColorA.set("#00E5C7"); // Teal with subtle dark violet
      targetColorB.set("#3D2999");
    } else if (activeId === "about") {
      targetColorA.set("#00E5C7"); // Balanced 50/50 Teal-Violet
      targetColorB.set("#7C5CFF");
    } else if (activeId === "technology") {
      targetColorA.set("#00E5C7"); // Teal-Violet shifted warmer (deep indigo)
      targetColorB.set("#4D2BDB");
    } else if (activeId === "capabilities") {
      targetColorA.set("#3A1FDB"); // Shifted towards strong violet
      targetColorB.set("#7C5CFF");
    } else if (activeId === "stats") {
      targetColorA.set("#05070A"); // Violet-dominant
      targetColorB.set("#7C5CFF");
    } else if (activeId === "contact") {
      targetColorA.set("#00E5C7"); // Maximum saturated Teal-Violet contrast
      targetColorB.set("#7C5CFF");
    } else {
      targetColorA.set("#00E5C7");
      targetColorB.set("#7C5CFF");
    }

    // A lerp factor of 0.045 at 60fps corresponds to roughly 0.6 - 0.8 seconds of transition time (snappy & reactive)
    uniforms.current.uColorA.value.lerp(targetColorA, 0.045);
    uniforms.current.uColorB.value.lerp(targetColorB, 0.045);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={customVertexShader}
        fragmentShader={customFragmentShader}
        uniforms={uniforms.current}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function ShaderBackground() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeId, setActiveId] = useState("hero");

  useEffect(() => {
    // Visibility observer to halt loop in background tabs
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleVisibilityChange();
    handleResize();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Section visibility tracking observer for section-aware color transitions
  useEffect(() => {
    if (isMobile) return;

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -25% 0px", // Trigger when occupying the center half of viewport
      threshold: 0.15,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [isMobile]);

  // Performance Fallback: Render static gradient background on mobile devices
  if (isMobile) {
    return (
      <div
        className="fixed inset-0 w-full h-full pointer-events-none z-[-1] select-none"
        style={{
          background: "linear-gradient(135deg, #05070A 0%, #030508 100%)",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] select-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: false, alpha: false, depth: false }}
        dpr={[1, 1.2]} // Capped DPR to secure framerate
      >
        <ShaderPlane isVisible={isVisible} activeId={activeId} />
      </Canvas>
    </div>
  );
}
