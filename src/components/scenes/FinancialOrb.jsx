import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

// Native mathematical random sphere point generator (removes external library dependency)
function generateRandomPointsInSphere(numPoints, radius) {
  const points = new Float32Array(numPoints * 3);
  for (let i = 0; i < numPoints; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = radius * Math.cbrt(Math.random()); // Uniform distribution inside the sphere volume
    
    points[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    points[i * 3 + 2] = r * Math.cos(phi);
  }
  return points;
}

function ParticleSphere({ mousePos }) {
  const ref = useRef();
  
  // Generate 1200 points for a lightweight rendering footprint
  const [sphere] = useState(() => generateRandomPointsInSphere(1200, 1.2));

  useFrame((state, delta) => {
    // Rotation animation
    ref.current.rotation.x -= delta / 12;
    ref.current.rotation.y -= delta / 20;

    // React to mouse coordinates
    const targetX = mousePos.current.x * 0.15;
    const targetY = mousePos.current.y * 0.15;
    ref.current.rotation.x += (targetY - ref.current.rotation.x) * 0.05;
    ref.current.rotation.y += (targetX - ref.current.rotation.y) * 0.05;

    // Subtle breathing pulse
    const time = state.clock.getElapsedTime();
    const scale = 1 + Math.sin(time * 1.5) * 0.025;
    ref.current.scale.set(scale, scale, scale);
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={true}>
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={0.014}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.7}
        />
      </Points>
    </group>
  );
}

export default function FinancialOrb() {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(true);
  const mousePos = useRef({ x: 0, y: 0 });
  const [webglSupported, setWebglSupported] = useState(true);

  // IntersectionObserver to unmount WebGL Canvas when scrolled off-screen
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 } // Trigger immediately when even slightly visible
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const support = !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
      setWebglSupported(support);
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = -(clientY / window.innerHeight) * 2 + 1;
    mousePos.current = { x, y };
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full absolute inset-0 z-0">
      {!webglSupported || !isInView ? (
        // Premium CSS fallback shown when off-screen or WebGL is unsupported
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-80 h-80 rounded-full bg-gradient-to-r from-violet-600/15 to-indigo-600/15 blur-[60px] animate-pulse-slow">
            <div className="absolute inset-10 rounded-full border border-violet-500/5 animate-spin" style={{ animationDuration: '24s' }} />
            <div className="absolute inset-20 rounded-full border border-indigo-500/3 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
          </div>
        </div>
      ) : (
        <Canvas 
          camera={{ position: [0, 0, 1.5] }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} intensity={1.5} />
          <ParticleSphere mousePos={mousePos} />
        </Canvas>
      )}
    </div>
  );
}
