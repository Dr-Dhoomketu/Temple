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
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.12 + scrollY * 0.0005;
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.05 - scrollY * 0.0008;
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
      meshRef.current.rotation.y = state.clock.getElapsedTime();
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
      gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false }}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={<Loader3D />}>
        <ambientLight intensity={0.4} color="#FFF8E1" />
        <directionalLight
          position={[5, 8, 5]}
          intensity={2.5}
          color="#D4AF37"
          castShadow
        />
        <directionalLight position={[-5, 3, -5]} intensity={0.8} color="#FF6B35" />
        <pointLight position={[0, 5, 0]} intensity={1.2} color="#FFD700" distance={12} />
        <pointLight position={[0, -2, 2]} intensity={0.6} color="#D4AF37" distance={8} />

        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
          <TempleModel scrollY={scrollY} />
        </Float>

        {enableOrbit && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
          />
        )}

        <fog attach="fog" args={["#1a0303", 10, 30]} />
      </Suspense>
    </Canvas>
  );
}

function TempleFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div
        className="relative flex flex-col items-center"
        style={{ animation: "float 4s ease-in-out infinite" }}
      >
        {/* SVG Temple illustration */}
        <svg viewBox="0 0 200 220" className="w-48 h-48 md:w-64 md:h-64" fill="none">
          {/* Base platform */}
          <rect x="20" y="195" width="160" height="8" fill="#D4AF37" opacity="0.8" />
          <rect x="30" y="185" width="140" height="12" fill="#D4AF37" opacity="0.6" />

          {/* Main temple body */}
          <rect x="50" y="130" width="100" height="58" fill="url(#templeGrad)" opacity="0.9" />

          {/* Door */}
          <rect x="85" y="155" width="30" height="33" fill="#1a0303" rx="15" />
          <rect x="89" y="157" width="22" height="24" fill="#D4AF37" opacity="0.2" rx="11" />

          {/* Temple spires */}
          <polygon points="100,10 80,80 120,80" fill="#D4AF37" opacity="0.9" />
          <polygon points="100,30 88,80 112,80" fill="#B8962F" opacity="0.7" />

          {/* Side spires */}
          <polygon points="65,50 52,100 78,100" fill="#D4AF37" opacity="0.7" />
          <polygon points="135,50 122,100 148,100" fill="#D4AF37" opacity="0.7" />

          {/* Kalash (pot) on top */}
          <ellipse cx="100" cy="12" rx="6" ry="4" fill="#D4AF37" />
          <rect x="97" y="5" width="6" height="8" fill="#D4AF37" />
          <ellipse cx="100" cy="5" rx="4" ry="3" fill="#FFD700" />

          {/* Decorative lines */}
          <line x1="50" y1="140" x2="150" y2="140" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
          <line x1="50" y1="155" x2="85" y2="155" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
          <line x1="115" y1="155" x2="150" y2="155" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />

          {/* Flag */}
          <line x1="100" y1="0" x2="100" y2="10" stroke="#D4AF37" strokeWidth="1" />
          <polygon points="100,0 115,4 100,8" fill="#D4AF37" opacity="0.8" />

          <defs>
            <linearGradient id="templeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A0404" />
              <stop offset="100%" stopColor="#2d0505" />
            </linearGradient>
          </defs>
        </svg>

        {/* Glow effect beneath */}
        <div
          className="absolute bottom-0 w-32 h-6 rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(212,175,55,0.4) 0%, transparent 70%)",
            filter: "blur(6px)",
            bottom: "-8px",
          }}
        />
      </div>
    </div>
  );
}

function checkWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    // On mobile, limit canvas size to avoid OOM
    canvas.width = 1;
    canvas.height = 1;
    const ctx =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!ctx) return false;
    // Extra check: some mobile browsers return a context but it's broken
    const gl = ctx as WebGLRenderingContext;
    return gl.getParameter(gl.VERSION) !== null;
  } catch {
    return false;
  }
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
        <TempleCanvas
          scrollY={scrollY}
          cameraPosition={cameraPosition}
          enableOrbit={enableOrbit}
        />
      ) : (
        <TempleFallback />
      )}
    </div>
  );
}

useGLTF.preload("/models/temple.glb");
