import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ── Drag state: accumulated rotation + active drag tracking ── */
interface DragState {
  isDragging: boolean;
  lastX: number;
  lastY: number;
  accumRotY: number;
  accumRotX: number;
  velX: number;
  velY: number;
}

function makeDragState(): DragState {
  return { isDragging: false, lastX: 0, lastY: 0, accumRotY: 0, accumRotX: 0, velX: 0, velY: 0 };
}

/* ── Attach pointer & touch listeners for full 360° drag ── */
function DragTracker({ drag }: { drag: DragState }) {
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      drag.isDragging = true;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      drag.velX = 0;
      drag.velY = 0;
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!drag.isDragging) return;
      const dx = e.clientX - drag.lastX;
      const dy = e.clientY - drag.lastY;
      drag.velX = dx;
      drag.velY = dy;
      drag.accumRotY += dx * 0.012;
      drag.accumRotX += dy * 0.008;
      drag.accumRotX = THREE.MathUtils.clamp(drag.accumRotX, -0.55, 0.55);
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
    };

    const onPointerUp = () => {
      drag.isDragging = false;
      drag.velX = 0;
      drag.velY = 0;
    };

    const onTouchStart = (e: TouchEvent) => {
      drag.isDragging = true;
      drag.lastX = e.touches[0].clientX;
      drag.lastY = e.touches[0].clientY;
      drag.velX = 0;
      drag.velY = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!drag.isDragging) return;
      const dx = e.touches[0].clientX - drag.lastX;
      const dy = e.touches[0].clientY - drag.lastY;
      drag.velX = dx;
      drag.velY = dy;
      drag.accumRotY += dx * 0.012;
      drag.accumRotX += dy * 0.008;
      drag.accumRotX = THREE.MathUtils.clamp(drag.accumRotX, -0.55, 0.55);
      drag.lastX = e.touches[0].clientX;
      drag.lastY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      drag.isDragging = false;
      drag.velX = 0;
      drag.velY = 0;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [gl, drag]);

  return null;
}

/* ── Camera auto-fit ── */
function CameraRig({ target }: { target: THREE.Box3 }) {
  const { camera } = useThree();
  useEffect(() => {
    if (target.isEmpty()) return;
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    target.getSize(size);
    target.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const dist = (maxDim / 2 / Math.tan(fov / 2)) * 0.62;
    camera.position.set(center.x, center.y + size.y * 0.12, center.z + dist);
    camera.lookAt(center.x, center.y - size.y * 0.08, center.z);
    camera.updateProjectionMatrix();
  }, [camera, target]);
  return null;
}

/* ── Model with full 360° drag rotation + momentum ── */
function Model({
  baseRotY,
  drag,
  onReady,
}: {
  baseRotY: number;
  drag: DragState;
  onReady: (b: THREE.Box3) => void;
}) {
  const { scene } = useGLTF("/models/temple.glb");
  const groupRef = useRef<THREE.Group>(null);
  const reported = useRef(false);
  const currentRotY = useRef(baseRotY);
  const currentRotX = useRef(0);

  const cloned = useRef<THREE.Object3D | null>(null);
  if (!cloned.current) cloned.current = scene.clone(true);

  useEffect(() => {
    if (reported.current || !groupRef.current) return;
    reported.current = true;
    onReady(new THREE.Box3().setFromObject(groupRef.current));
  });

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    if (!drag.isDragging) {
      /* Momentum decay + gentle auto-rotate when idle */
      drag.velX *= 0.92;
      drag.velY *= 0.92;
      drag.accumRotY += drag.velX * 0.006;
      const autoSpin = t * 0.18;
      const targetY = baseRotY + autoSpin + drag.accumRotY + Math.sin(t * 0.3) * 0.04;
      currentRotY.current += (targetY - currentRotY.current) * Math.min(delta * 4, 0.15);
    } else {
      currentRotY.current += (baseRotY + drag.accumRotY - currentRotY.current) * Math.min(delta * 10, 0.4);
    }

    const targetX = drag.accumRotX;
    currentRotX.current += (targetX - currentRotX.current) * Math.min(delta * 8, 0.3);

    groupRef.current.rotation.y = currentRotY.current;
    groupRef.current.rotation.x = currentRotX.current;
  });

  return (
    <group ref={groupRef}>
      <primitive object={cloned.current!} />
    </group>
  );
}

function Spinner() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 2.5;
      ref.current.rotation.x = clock.getElapsedTime() * 1.3;
    }
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.35, 0]} />
      <meshStandardMaterial color="#D4AF37" wireframe />
    </mesh>
  );
}

function Scene({ baseRotY, drag }: { baseRotY: number; drag: DragState }) {
  const [box, setBox] = useState<THREE.Box3>(new THREE.Box3());
  return (
    <>
      <DragTracker drag={drag} />
      <CameraRig target={box} />

      {/* Magical golden + purple lighting */}
      <ambientLight intensity={3.5} color="#EED9FF" />
      <directionalLight position={[8, 14, 10]} intensity={6.0} color="#FFE8A0" />
      <directionalLight position={[-6, 8, -6]} intensity={3.0} color="#C084FC" />
      <directionalLight position={[0, -4, 8]} intensity={2.0} color="#FFF0C0" />
      <pointLight position={[0, 12, 0]} intensity={5.5} color="#FFD700" distance={80} />
      <pointLight position={[6, 4, 10]} intensity={3.0} color="#FFF0A0" distance={50} />
      <pointLight position={[-6, 4, 10]} intensity={3.0} color="#FFF0A0" distance={50} />
      <pointLight position={[0, 6, -14]} intensity={2.0} color="#A855F7" distance={40} />

      <Suspense fallback={<Spinner />}>
        <Model baseRotY={baseRotY} drag={drag} onReady={setBox} />
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
  const drag = useRef(makeDragState()).current;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => { setWebgl(checkWebGL()); }, []);

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
            </defs>
            <rect x="20" y="315" width="280" height="10" rx="2" fill="url(#gG)" opacity="0.9"/>
            <rect x="35" y="303" width="250" height="14" rx="2" fill="url(#gG)" opacity="0.75"/>
            <rect x="70" y="190" width="180" height="104" fill="url(#wG)"/>
            <path d="M140 294 L140 245 Q140 228 160 228 Q180 228 180 245 L180 294 Z" fill="#0d0101"/>
            <polygon points="160,18 125,130 195,130" fill="url(#gG)" opacity="0.95"/>
            <ellipse cx="160" cy="22" rx="8" ry="5" fill="url(#gG)"/>
            <ellipse cx="160" cy="10" rx="5" ry="4" fill="#FFD700"/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height, width: "100%", position: "relative", cursor: "grab" }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 90% 70% at 50% 65%, rgba(212,175,55,0.3) 0%, rgba(160,80,220,0.1) 45%, transparent 70%)",
      }} />
      <Canvas
        camera={{ fov: 45, near: 0.1, far: 2000 }}
        gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false, toneMappingExposure: 1.6 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        style={{ background: "transparent", position: "relative", zIndex: 1, cursor: "grab" }}
      >
        <Scene baseRotY={rotationY} drag={drag} />
      </Canvas>
      <div style={{
        position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
        fontFamily: "Cinzel, serif", fontSize: "9px", letterSpacing: "0.3em",
        color: "rgba(212,175,55,0.4)", pointerEvents: "none", zIndex: 2,
        textTransform: "uppercase",
      }}>
        Drag to rotate 360°
      </div>
    </div>
  );
}

useGLTF.preload("/models/temple.glb");
