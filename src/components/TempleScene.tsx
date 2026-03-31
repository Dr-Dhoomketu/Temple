import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

function TempleModel({ scrollY }: { scrollY: number }) {
  const { scene } = useGLTF("/models/temple.glb");
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.18) * 0.08 + scrollY * 0.0003;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.04 - scrollY * 0.0006;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={2.2} position={[0, -1.2, 0]} />
    </group>
  );
}

function Loader3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 2.5;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 1.2;
    }
  });
  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial color="#D4AF37" wireframe />
    </mesh>
  );
}

function TempleCanvas({
  scrollY,
  cameraPosition,
  enableOrbit,
}: {
  scrollY: number;
  cameraPosition: [number, number, number];
  enableOrbit: boolean;
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  return (
    <Canvas
      camera={{ position: cameraPosition, fov: 45 }}
      gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false, toneMappingExposure: 1.4 }}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={<Loader3D />}>
        {/* Royal golden temple lighting */}
        <ambientLight intensity={1.2} color="#FFE8C0" />
        <directionalLight position={[5, 10, 6]} intensity={4.5} color="#FFE8A0" castShadow />
        <directionalLight position={[-5, 4, -5]} intensity={2.0} color="#FFC060" />
        <directionalLight position={[0, -3, 6]} intensity={1.5} color="#FFF0C0" />
        <pointLight position={[0, 6, 0]} intensity={4.0} color="#FFD700" distance={18} />
        <pointLight position={[4, 2, 8]} intensity={2.5} color="#FFF0A0" distance={14} />
        <pointLight position={[-4, 2, 8]} intensity={2.5} color="#FFF0A0" distance={14} />
        <pointLight position={[0, 4, -8]} intensity={1.5} color="#D4AF37" distance={12} />

        <Float speed={1.8} rotationIntensity={0.06} floatIntensity={0.5}>
          <TempleModel scrollY={scrollY} />
        </Float>

        {enableOrbit && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 5}
            maxPolarAngle={Math.PI / 1.6}
            rotateSpeed={0.8}
            dampingFactor={0.08}
            enableDamping
          />
        )}

        <fog attach="fog" args={["#0d0101", 14, 36]} />
      </Suspense>
    </Canvas>
  );
}

function TempleFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center" style={{ animation: "float 4s ease-in-out infinite" }}>
        <svg viewBox="0 0 200 220" className="w-48 h-48 md:w-64 md:h-64" fill="none">
          <rect x="20" y="195" width="160" height="8" fill="#D4AF37" opacity="0.8" />
          <rect x="30" y="185" width="140" height="12" fill="#D4AF37" opacity="0.6" />
          <rect x="50" y="130" width="100" height="58" fill="url(#templeGrad)" opacity="0.9" />
          <rect x="85" y="155" width="30" height="33" fill="#1a0303" rx="15" />
          <polygon points="100,10 80,80 120,80" fill="#D4AF37" opacity="0.9" />
          <polygon points="65,50 52,100 78,100" fill="#D4AF37" opacity="0.7" />
          <polygon points="135,50 122,100 148,100" fill="#D4AF37" opacity="0.7" />
          <ellipse cx="100" cy="12" rx="6" ry="4" fill="#D4AF37" />
          <rect x="97" y="5" width="6" height="8" fill="#D4AF37" />
          <ellipse cx="100" cy="5" rx="4" ry="3" fill="#FFD700" />
          <defs>
            <linearGradient id="templeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A0404" />
              <stop offset="100%" stopColor="#2d0505" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute bottom-0 w-32 h-6 rounded-full" style={{
          background: "radial-gradient(ellipse, rgba(212,175,55,0.4) 0%, transparent 70%)",
          filter: "blur(6px)", bottom: "-8px",
        }} />
      </div>
    </div>
  );
}

function checkWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1; canvas.height = 1;
    const ctx = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!ctx) return false;
    const gl = ctx as WebGLRenderingContext;
    return gl.getParameter(gl.VERSION) !== null;
  } catch { return false; }
}

interface TempleSceneProps {
  scrollY?: number;
  height?: string;
  cameraPosition?: [number, number, number];
  enableOrbit?: boolean;
}

export default function TempleScene({
  scrollY = 0,
  height = "100%",
  cameraPosition = [0, 1, 5],
  enableOrbit = false,
}: TempleSceneProps) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglSupported(checkWebGL());
  }, []);

  return (
    <div style={{ height, width: "100%", position: "relative" }}>
      {webglSupported === null ? null : webglSupported ? (
        <TempleCanvas scrollY={scrollY} cameraPosition={cameraPosition} enableOrbit={enableOrbit} />
      ) : (
        <TempleFallback />
      )}
    </div>
  );
}

useGLTF.preload("/models/temple.glb");
