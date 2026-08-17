"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DnaMeshProps {
  isMobile: boolean;
}

function HelixVisuals({ isMobile }: DnaMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Track scroll position to rotate the helix on scroll
  const scrollRotation = useRef(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      scrollRotation.current = scrolled * 0.0025;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Configuration based on viewport
  const count = isMobile ? 25 : 55;
  const radius = 2.4;
  const height = 11;
  const speed = 0.4;

  // Pre-calculate colors and positions to build the instance color array
  const { spheresData, rungsData } = useMemo(() => {
    const spheres = [];
    const rungs = [];
    
    const colorTeal = new THREE.Color("#00E5C7");
    const colorViolet = new THREE.Color("#7C5CFF");

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 4.5; // Number of turns
      const y = (t - 0.5) * height;

      // Color interpolation along the height gradient
      const color = new THREE.Color().lerpColors(colorTeal, colorViolet, t);

      // Strand 1
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      spheres.push({ x: x1, y, z: z1, color });

      // Strand 2 (Offset by Pi)
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      spheres.push({ x: x2, y, z: z2, color });

      // Rungs (placed at every alternate index for spacing)
      if (i % 2 === 0) {
        rungs.push({
          p1: new THREE.Vector3(x1, y, z1),
          p2: new THREE.Vector3(x2, y, z2),
          color,
        });
      }
    }

    return { spheresData: spheres, rungsData: rungs };
  }, [count, radius, height]);

  // Ref references for instanced meshes
  const sphereMeshRef = useRef<THREE.InstancedMesh>(null);
  const rungMeshRef = useRef<THREE.InstancedMesh>(null);

  // Set initial transformation matrices and colors
  useEffect(() => {
    if (!sphereMeshRef.current || !rungMeshRef.current) return;

    const tempObject = new THREE.Object3D();

    // 1. Setup Spheres
    spheresData.forEach((data, index) => {
      tempObject.position.set(data.x, data.y, data.z);
      tempObject.scale.setScalar(isMobile ? 0.2 : 0.28);
      tempObject.updateMatrix();
      sphereMeshRef.current!.setMatrixAt(index, tempObject.matrix);
      sphereMeshRef.current!.setColorAt(index, data.color);
    });
    sphereMeshRef.current.instanceMatrix.needsUpdate = true;
    if (sphereMeshRef.current.instanceColor) {
      sphereMeshRef.current.instanceColor.needsUpdate = true;
    }

    // 2. Setup Rungs
    rungsData.forEach((data, index) => {
      const direction = new THREE.Vector3().subVectors(data.p2, data.p1);
      const length = direction.length();
      const midpoint = new THREE.Vector3().addVectors(data.p1, data.p2).multiplyScalar(0.5);

      tempObject.position.copy(midpoint);
      tempObject.scale.set(isMobile ? 0.04 : 0.06, length, isMobile ? 0.04 : 0.06);

      // Rotate cylinder to align with the connection vector
      const alignAxis = new THREE.Vector3(0, 1, 0); // Default Cylinder geometry alignment
      const quaternion = new THREE.Quaternion().setFromUnitVectors(alignAxis, direction.clone().normalize());
      tempObject.quaternion.copy(quaternion);

      tempObject.updateMatrix();
      rungMeshRef.current!.setMatrixAt(index, tempObject.matrix);
      rungMeshRef.current!.setColorAt(index, data.color);
    });
    rungMeshRef.current.instanceMatrix.needsUpdate = true;
    if (rungMeshRef.current.instanceColor) {
      rungMeshRef.current.instanceColor.needsUpdate = true;
    }
  }, [spheresData, rungsData, isMobile]);

  // Frame animation loop
  useFrame((state) => {
    if (!groupRef.current) return;

    const elapsedTime = state.clock.getElapsedTime();

    // 1. Slow continuous rotation
    const baseRotationY = elapsedTime * speed;
    
    // 2. Scroll interaction
    const targetScrollRot = scrollRotation.current;

    // 3. Mouse Parallax (Tilt group toward pointer with smooth interpolation/lerp)
    const targetMouseX = state.pointer.x * 0.35;
    const targetMouseY = state.pointer.y * 0.25;

    // Apply lerped rotations
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      baseRotationY + targetScrollRot,
      0.08
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetMouseY,
      0.08
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetMouseX,
      0.08
    );
  });

  return (
    <group ref={groupRef}>
      {/* Bioluminescent glowing spheres */}
      <instancedMesh
        ref={sphereMeshRef}
        args={[null as any, null as any, spheresData.length]}
        castShadow
      >
        <sphereGeometry args={[1, 24, 24]} />
        <meshPhysicalMaterial
          roughness={0.1}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transmission={0.3}
          thickness={0.5}
          emissive="#FFFFFF"
          emissiveIntensity={0.15}
        />
      </instancedMesh>

      {/* Connection rungs */}
      <instancedMesh
        ref={rungMeshRef}
        args={[null as any, null as any, rungsData.length]}
      >
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshPhysicalMaterial
          roughness={0.3}
          metalness={0.2}
          transmission={0.6}
          emissive="#FFFFFF"
          emissiveIntensity={0.08}
        />
      </instancedMesh>
    </group>
  );
}

export default function DnaHelix({ isMobile }: DnaMeshProps) {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 65 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.8} />
        {/* Colorful directional lighting */}
        <pointLight position={[10, 10, 10]} color="#00E5C7" intensity={2.5} />
        <pointLight position={[-10, -10, -10]} color="#7C5CFF" intensity={2.0} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1.5}
          castShadow
        />
        <HelixVisuals isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
