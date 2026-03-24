import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ── Shared mouse state lives outside React so refs stay stable ── */
function makePointer() {
  return { x: 0, y: 0 };
}

/* ── Attach pointer/touch listeners directly to the WebGL canvas ── */
function PointerTracker({ ptr }: { ptr: ReturnType<typeof makePointer> }) {
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.x =  ((e.clientX - r.left)  / r.width  - 0.5) * 2;  // -1 to 1
      ptr.y = -((e.clientY - r.top)   / r.height - 0.5) * 2;
    };
    const onLeave = () => { ptr.x = 0; ptr.y = 0; };

    // Touch
    let lastTX = 0, lastTY = 0;
    const onTS = (e: TouchEvent) => { lastTX = e.touches[0].clientX; lastTY = e.touches[0].clientY; };
    const onTM = (e: TouchEvent) => {
      const dx = (e.touches[0].clientX - lastTX) / el.clientWidth  * 3;
      const dy = (e.touches[0].clientY - lastTY) / el.clientHeight * 3;
      ptr.x = THREE.MathUtils.clamp(ptr.x + dx, -1, 1);
      ptr.y = THREE.MathUtils.clamp(ptr.y - dy, -1, 1);
      lastTX = e.touches[0].clientX;
      lastTY = e.touches[0].clientY;
    };
    const onTE = () => { ptr.x = 0; ptr.y = 0; };

    el.addEventListener("pointermove",  onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("touchstart",   onTS,  { passive: true });
    el.addEventListener("touchmove",    onTM,  { passive: true });
    el.addEventListener("touchend",     onTE);

    return () => {
      el.removeEventListener("pointermove",  onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("touchstart",   onTS);
      el.removeEventListener("touchmove",    onTM);
      el.removeEventListener("touchend",     onTE);
    };
  }, [gl, ptr]);

  return null;
}

/* ── Camera auto-fit ── */
function CameraRig({ target }: { target: THREE.Box3 }) {
  const { camera } = useThree();
  useEffect(() => {
    if (target.isEmpty()) return;
    const size   = new THREE.Vector3();
    const center = new THREE.Vector3();
    target.getSize(size);
    target.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov    = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const dist   = (maxDim / 2 / Math.tan(fov / 2)) * 0.62;
    camera.position.set(center.x, center.y + size.y * 0.12, center.z + dist);
    camera.lookAt(center.x, center.y - size.y * 0.08, center.z);
    camera.updateProjectionMatrix();
  }, [camera, target]);
  return null;
}

/* ── Model with smooth pointer-driven rotation ── */
function Model({
  baseRotY,
  ptr,
  onReady,
}: {
  baseRotY: number;
  ptr: ReturnType<typeof makePointer>;
  onReady: (b: THREE.Box3) => void;
}) {
  const { scene } = useGLTF("/models/temple.glb");
  const groupRef  = useRef<THREE.Group>(null);
  const reported  = useRef(false);
  const rotY      = useRef(baseRotY);
  const rotX      = useRef(0);

  const cloned = useRef<THREE.Object3D | null>(null);
  if (!cloned.current) cloned.current = scene.clone(true);

  useEffect(() => {
    if (reported.current || !groupRef.current) return;
    reported.current = true;
    onReady(new THREE.Box3().setFromObject(groupRef.current));
  });

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // idle sway + strong pointer influence
    const tY = baseRotY + Math.sin(t * 0.22) * 0.05 + ptr.x * 1.4;
    const tX = ptr.y * 0.3;
    rotY.current += (tY - rotY.current) * 0.12;
    rotX.current += (tX - rotX.current) * 0.12;
    groupRef.current.rotation.y = rotY.current;
    groupRef.current.rotation.x = THREE.MathUtils.clamp(rotX.current, -0.28, 0.28);
  });

  return (
    <group ref={groupRef}>
      <primitive object={cloned.current!} />
    </group>
  );
}

function Spinner() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 2; });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.35, 0]} />
      <meshStandardMaterial color="#D4AF37" wireframe />
    </mesh>
  );
}

function Scene({ baseRotY, ptr }: { baseRotY: number; ptr: ReturnType<typeof makePointer> }) {
  const [box, setBox] = useState<THREE.Box3>(new THREE.Box3());
  return (
    <>
      <PointerTracker ptr={ptr} />
      <CameraRig target={box} />

      {/* Bright warm golden lighting */}
      <ambientLight intensity={4.5} color="#FFF8E7" />
      <directionalLight position={[8, 14, 10]}  intensity={6.5} color="#FFE8A0" />
      <directionalLight position={[-6, 8, -6]}  intensity={3.5} color="#FFB347" />
      <directionalLight position={[0, -4, 8]}   intensity={2.5} color="#FFF0C0" />
      <pointLight position={[0, 12, 0]}  intensity={5.0} color="#FFD700" distance={80} />
      <pointLight position={[6, 4, 10]}  intensity={3.5} color="#FFF0A0" distance={50} />
      <pointLight position={[-6, 4, 10]} intensity={3.5} color="#FFF0A0" distance={50} />
      <directionalLight position={[0, 6, -14]} intensity={2.0} color="#FF9A50" />

      <Suspense fallback={<Spinner />}>
        <Model baseRotY={baseRotY} ptr={ptr} onReady={setBox} />
      </Suspense>
    </>
  );
}

function checkWebGL() {
  try {
    const c = document.createElement("canvas");
    c.width = 1; c.height = 1;
    const ctx = c.getContext("webgl2") || c.getContext("webgl");
    if (!ctx) return false;
    return (ctx as WebGLRenderingContext).getParameter((ctx as WebGLRenderingContext).VERSION) !== null;
  } catch { return false; }
}

interface Props {
  rotationY?: number;
  height?: string;
}

export default function TempleModel3D({ rotationY = 0, height = "100%" }: Props) {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  // Stable pointer object — never recreated
  const ptr = useRef(makePointer()).current;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    setWebgl(checkWebGL());
  }, []);

  if (webgl === null) return null;
  if (!webgl) {
    return (
      <div style={{ height, width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
        background: "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(212,175,55,0.12) 0%, transparent 70%)" }}>
        <div style={{ animation: "float 4s ease-in-out infinite", filter: "drop-shadow(0 0 18px rgba(212,175,55,0.5))" }}>
          <svg viewBox="0 0 320 340" width="260" height="260" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="wG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a0808"/><stop offset="100%" stopColor="#2d0404"/></linearGradient>
              <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F5E088"/><stop offset="50%" stopColor="#D4AF37"/><stop offset="100%" stopColor="#9A7B1C"/></linearGradient>
              <radialGradient id="glG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFD700" stopOpacity="0.3"/><stop offset="100%" stopColor="#FFD700" stopOpacity="0"/></radialGradient>
            </defs>
            <ellipse cx="160" cy="200" rx="110" ry="90" fill="url(#glG)"/>
            <rect x="20" y="315" width="280" height="10" rx="2" fill="url(#gG)" opacity="0.9"/>
            <rect x="35" y="303" width="250" height="14" rx="2" fill="url(#gG)" opacity="0.75"/>
            <rect x="50" y="292" width="220" height="13" rx="2" fill="#D4AF37" opacity="0.6"/>
            <rect x="70" y="190" width="180" height="104" fill="url(#wG)"/>
            <rect x="70" y="200" width="180" height="6" fill="#D4AF37" opacity="0.35"/>
            <rect x="70" y="278" width="180" height="5" fill="#D4AF37" opacity="0.3"/>
            <path d="M140 294 L140 245 Q140 228 160 228 Q180 228 180 245 L180 294 Z" fill="#0d0101"/>
            <path d="M143 294 L143 247 Q143 232 160 232 Q177 232 177 247 L177 294 Z" fill="#D4AF37" opacity="0.12"/>
            <polygon points="160,18 125,130 195,130" fill="url(#gG)" opacity="0.95"/>
            <polygon points="160,40 133,130 187,130" fill="#D4AF37" opacity="0.5"/>
            <rect x="148" y="60" width="24" height="4" rx="2" fill="#D4AF37" opacity="0.5"/>
            <rect x="142" y="80" width="36" height="4" rx="2" fill="#D4AF37" opacity="0.5"/>
            <rect x="136" y="100" width="48" height="4" rx="2" fill="#D4AF37" opacity="0.5"/>
            <ellipse cx="160" cy="22" rx="8" ry="5" fill="url(#gG)"/>
            <rect x="156" y="10" width="8" height="14" fill="url(#gG)"/>
            <ellipse cx="160" cy="10" rx="5" ry="4" fill="#FFD700"/>
            <polygon points="95,75 72,155 118,155" fill="#D4AF37" opacity="0.75"/>
            <polygon points="225,75 202,155 248,155" fill="#D4AF37" opacity="0.75"/>
            <rect x="68" y="154" width="184" height="10" rx="2" fill="#D4AF37" opacity="0.7"/>
            <rect x="68" y="162" width="184" height="30" rx="1" fill="url(#wG)"/>
            <ellipse cx="160" cy="295" rx="18" ry="6" fill="#FFD700" opacity="0.18"/>
            <circle cx="160" cy="291" r="3" fill="#FFD700" opacity="0.7"/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height, width: "100%", position: "relative", cursor: "grab" }}>
      {/* Golden glow backdrop */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 90% 70% at 50% 65%, rgba(212,175,55,0.35) 0%, rgba(180,80,0,0.12) 55%, transparent 75%)",
      }} />
      <Canvas
        camera={{ fov: 45, near: 0.1, far: 2000 }}
        gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false, toneMappingExposure: 1.8 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        style={{ background: "transparent", position: "relative", zIndex: 1 }}
      >
        <Scene baseRotY={rotationY} ptr={ptr} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/temple.glb");
