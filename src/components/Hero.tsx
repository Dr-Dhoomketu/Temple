import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TempleScene from "./TempleScene";

/* ──────────────────────────────────────────────
   Phase timeline (ms from page-load)
   0        : doors closed, dark
   600      : golden crack glow begins
   1800     : divine-light pulse
   2800     : doors start sliding open
   5200     : doors fully open, light floods in
   6200     : content text fades in
────────────────────────────────────────────── */

const DOOR_START   = 2800;
const DOOR_END     = 5200;
const CONTENT_IN   = 6200;

export default function Hero() {
  const [phase, setPhase] = useState<"closed"|"glowing"|"opening"|"open"|"content">("closed");
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  // Phase timer
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("glowing"),  600);
    const t2 = setTimeout(() => setPhase("opening"),  DOOR_START);
    const t3 = setTimeout(() => setPhase("open"),     DOOR_END);
    const t4 = setTimeout(() => setPhase("content"),  CONTENT_IN);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  // Throttled scroll via rAF
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      setScrollY(window.scrollY);
      lastScrollY.current = window.scrollY;
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  const handleExplore = () => {
    document.querySelector("#temple")?.scrollIntoView({ behavior: "smooth" });
  };

  const isOpen    = phase === "open" || phase === "content";
  const hasContent = phase === "content";

  // Door slide amount — 52% so they fully disappear off-screen
  const doorSlide = isOpen ? "-52%" : "0%";

  return (
    <section
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      style={{ background: "#0a0101" }}
    >
      {/* ── Starfield layer ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {STARS.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#D4AF37]"
            style={{
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              animation: `twinkle ${s.dur}s ease-in-out infinite ${s.delay}s`,
              willChange: "opacity",
            }}
          />
        ))}
      </div>

      {/* ── 3D Temple (behind everything, z-index 1) ── */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          opacity: isOpen ? 1 : 0,
          transition: "opacity 1.8s ease-in",
          willChange: "opacity",
        }}
      >
        <TempleScene scrollY={scrollY} height="100%" cameraPosition={[0, 0.4, 6]} enableOrbit />
      </div>

      {/* ── Divine light burst (behind doors, z 2) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(212,175,55,0.55) 0%, rgba(212,100,10,0.18) 35%, transparent 70%)",
          opacity: isOpen ? 1 : phase === "glowing" ? 0.15 : 0,
          transition: isOpen ? "opacity 1.2s ease-out" : "opacity 1.4s ease-in",
          willChange: "opacity",
        }}
      />

      {/* ── Light rays (z 2) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
        {RAYS.map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: `${r.w}px`,
              height: "110%",
              background: "linear-gradient(to bottom, rgba(212,175,55,0.28), transparent)",
              transform: `translateX(-50%) rotate(${r.angle}deg)`,
              transformOrigin: "top center",
              opacity: isOpen ? r.opacity : 0,
              transition: `opacity ${1.2 + i * 0.1}s ease-out`,
              animation: isOpen ? `rayPulse ${r.dur}s ease-in-out infinite ${r.delay}s` : "none",
              willChange: "opacity",
            }}
          />
        ))}
      </div>

      {/* ── Floating particles (z 3) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.x,
              bottom: "10%",
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
              opacity: isOpen ? p.opacity : 0,
              transition: `opacity ${0.8 + i * 0.08}s ease-out`,
              animation: isOpen ? `floatUp ${p.dur}s ease-in infinite ${p.delay}s` : "none",
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>

      {/* ══════════════════ DOORS ══════════════════ */}

      {/* Left door */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full pointer-events-none"
        style={{
          zIndex: 20,
          transform: `translateX(${isOpen ? "-105%" : "0%"})`,
          transition: isOpen
            ? `transform ${(DOOR_END - DOOR_START) / 1000}s cubic-bezier(0.22,1,0.36,1)`
            : "none",
          willChange: "transform",
        }}
      >
        <DoorPanel side="left" phase={phase} />
      </div>

      {/* Right door */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
        style={{
          zIndex: 20,
          transform: `translateX(${isOpen ? "105%" : "0%"})`,
          transition: isOpen
            ? `transform ${(DOOR_END - DOOR_START) / 1000}s cubic-bezier(0.22,1,0.36,1)`
            : "none",
          willChange: "transform",
        }}
      >
        <DoorPanel side="right" phase={phase} />
      </div>

      {/* Center golden crack glow (visible before doors open) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-full pointer-events-none"
        style={{
          zIndex: 21,
          width: "3px",
          background: "linear-gradient(to bottom, transparent 0%, #D4AF37 20%, #FFD700 50%, #D4AF37 80%, transparent 100%)",
          opacity: phase === "closed" ? 0 : isOpen ? 0 : 1,
          transition: phase === "glowing" ? "opacity 1s ease-in" : "opacity 0.4s ease-out",
          boxShadow: "0 0 12px 4px rgba(212,175,55,0.7), 0 0 40px 10px rgba(212,175,55,0.3)",
          willChange: "opacity",
        }}
      />

      {/* Top arch ornament */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center"
        style={{ zIndex: 22 }}
      >
        <div
          style={{
            width: "2px",
            height: "60px",
            background: "linear-gradient(to bottom, #D4AF37, transparent)",
            opacity: isOpen ? 0 : 0.8,
            transition: "opacity 0.5s ease-out",
          }}
        />
        <div
          style={{
            color: "#D4AF37",
            fontSize: "1.5rem",
            opacity: isOpen ? 0 : phase === "closed" ? 0 : 1,
            transition: phase === "glowing" ? "opacity 0.8s ease-in" : "opacity 0.4s ease-out",
            textShadow: "0 0 12px rgba(212,175,55,0.9)",
          }}
        >
          ✦
        </div>
      </div>

      {/* ══════════════════ HERO CONTENT ══════════════════ */}
      <AnimatePresence>
        {hasContent && (
          <motion.div
            className="absolute z-30 text-center px-4 w-full max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            {/* Om */}
            <motion.div
              className="text-5xl md:text-6xl mb-4"
              style={{ color: "#D4AF37", textShadow: "0 0 30px rgba(212,175,55,0.9), 0 0 60px rgba(212,175,55,0.4)" }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.34,1.56,0.64,1] }}
            >
              ॐ
            </motion.div>

            <motion.p
              className="font-cinzel text-xs md:text-sm tracking-[0.5em] uppercase mb-3"
              style={{ color: "rgba(212,175,55,0.8)" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
            >
              Welcome to
            </motion.p>

            <motion.h1
              className="font-cinzel font-black text-3xl sm:text-5xl md:text-7xl leading-none mb-1"
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #FFF0A0 40%, #D4AF37 70%, #B8962F 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 24px rgba(212,175,55,0.6))",
              }}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.22,1,0.36,1] }}
            >
              SHRI RAM
            </motion.h1>

            <motion.h2
              className="font-cinzel font-bold text-xl md:text-3xl tracking-[0.3em] mb-4"
              style={{ color: "rgba(245,245,220,0.75)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              MANDIR
            </motion.h2>

            <motion.div
              className="flex items-center justify-center gap-3 mb-5"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.7 }}
            >
              <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to right, transparent, #D4AF37)" }} />
              <span style={{ color: "#D4AF37", fontSize: "0.9rem" }}>❋</span>
              <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to left, transparent, #D4AF37)" }} />
            </motion.div>

            <motion.p
              className="font-sans font-light text-sm md:text-base max-w-xs mx-auto mb-8 leading-relaxed tracking-wide"
              style={{ color: "rgba(245,245,220,0.55)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.9 }}
            >
              A divine abode of peace, devotion, and eternal blessings
            </motion.p>

            <motion.button
              onClick={handleExplore}
              className="font-cinzel text-xs tracking-[0.35em] uppercase px-8 py-3"
              style={{
                border: "1px solid #D4AF37",
                color: "#D4AF37",
                background: "transparent",
                boxShadow: "0 0 20px rgba(212,175,55,0.25)",
                cursor: "pointer",
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              whileHover={{ backgroundColor: "#D4AF37", color: "#1a0303", boxShadow: "0 0 40px rgba(212,175,55,0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Temple
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll cue */}
      {hasContent && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <span className="font-cinzel text-[10px] tracking-[0.4em]" style={{ color: "rgba(212,175,55,0.45)" }}>
            SCROLL
          </span>
          <motion.div
            className="w-px h-8"
            style={{ background: "linear-gradient(to bottom, rgba(212,175,55,0.5), transparent)" }}
            animate={{ scaleY: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </motion.div>
      )}
    </section>
  );
}

/* ────────────── Door Panel ────────────── */
function DoorPanel({ side, phase }: { side: "left" | "right"; phase: string }) {
  const isLeft = side === "left";
  const glowing = phase !== "closed";

  return (
    <div
      className="absolute inset-0"
      style={{
        background: isLeft
          ? "linear-gradient(to right, #0e0202, #1e0404, #2a0606)"
          : "linear-gradient(to left, #0e0202, #1e0404, #2a0606)",
        borderRight: isLeft ? "3px solid rgba(212,175,55,0.5)" : "none",
        borderLeft: !isLeft ? "3px solid rgba(212,175,55,0.5)" : "none",
        boxShadow: isLeft
          ? "inset -6px 0 30px rgba(212,175,55,0.08)"
          : "inset 6px 0 30px rgba(212,175,55,0.08)",
      }}
    >
      {/* Vertical grain lines */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0"
          style={{
            left: `${10 + i * 11}%`,
            width: "1px",
            background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.06) 20%, rgba(212,175,55,0.1) 50%, rgba(212,175,55,0.06) 80%, transparent)",
          }}
        />
      ))}

      {/* Top circle with Om */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: "6%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: "2px solid rgba(212,175,55,0.5)",
          background: "rgba(212,175,55,0.05)",
          boxShadow: glowing ? "0 0 20px rgba(212,175,55,0.3)" : "none",
          transition: "box-shadow 1s ease-in",
        }}
      >
        <svg viewBox="0 0 48 48" width="44" height="44" fill="none" aria-label="Om">
          <text
            x="50%"
            y="78%"
            textAnchor="middle"
            fontSize="32"
            fontFamily="serif"
            fill="rgba(212,175,55,0.75)"
            fontWeight="bold"
            style={{ textShadow: glowing ? "0 0 8px rgba(212,175,55,0.6)" : "none" }}
          >
            ॐ
          </text>
        </svg>
      </div>

      {/* Horizontal band at top of panels */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "18%",
          height: "2px",
          background: "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)",
        }}
      />

      {/* Panel rectangles — ornate */}
      <div
        className="absolute flex flex-col gap-4"
        style={{ top: "20%", left: "8%", right: "8%", bottom: "8%" }}
      >
        {PANEL_ICONS.map((icon, i) => (
          <div
            key={i}
            className="flex-1 flex items-center justify-center"
            style={{
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: "2px",
              background: "rgba(212,175,55,0.025)",
              position: "relative",
            }}
          >
            {/* Corner chips */}
            {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h]) => (
              <div
                key={`${v}${h}`}
                style={{
                  position: "absolute",
                  [v]: "-1px",
                  [h]: "-1px",
                  width: "8px",
                  height: "8px",
                  borderTop: v === "top" ? "2px solid rgba(212,175,55,0.5)" : "none",
                  borderBottom: v === "bottom" ? "2px solid rgba(212,175,55,0.5)" : "none",
                  borderLeft: h === "left" ? "2px solid rgba(212,175,55,0.5)" : "none",
                  borderRight: h === "right" ? "2px solid rgba(212,175,55,0.5)" : "none",
                }}
              />
            ))}
            <span
              style={{
                fontSize: "1.4rem",
                color: "rgba(212,175,55,0.35)",
                textShadow: glowing ? "0 0 8px rgba(212,175,55,0.4)" : "none",
                transition: "text-shadow 1.5s ease-in",
              }}
            >
              {icon}
            </span>
          </div>
        ))}
      </div>

      {/* Handle bar */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          [isLeft ? "right" : "left"]: "12px",
          width: "10px",
          height: "48px",
          borderRadius: "9999px",
          background: "linear-gradient(to bottom, #B8962F, #D4AF37, #F5E088, #D4AF37, #B8962F)",
          boxShadow: glowing ? "0 0 14px rgba(212,175,55,0.7)" : "0 0 4px rgba(212,175,55,0.3)",
          transition: "box-shadow 1s ease-in",
        }}
      />

      {/* Bottom band */}
      <div
        className="absolute left-0 right-0 bottom-8"
        style={{
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)",
        }}
      />
    </div>
  );
}

/* ────────────── Static data (outside component to avoid re-creation) ────────── */
const RAYS = [
  { w: 3,   angle: -25, opacity: 0.55, dur: 4.2, delay: 0   },
  { w: 2,   angle: -15, opacity: 0.4,  dur: 3.8, delay: 0.3 },
  { w: 120, angle:  -8, opacity: 0.06, dur: 5,   delay: 0.1 },
  { w: 4,   angle:   0, opacity: 0.7,  dur: 3.5, delay: 0   },
  { w: 200, angle:   5, opacity: 0.05, dur: 6,   delay: 0.2 },
  { w: 2,   angle:  14, opacity: 0.4,  dur: 4,   delay: 0.4 },
  { w: 3,   angle:  24, opacity: 0.5,  dur: 4.5, delay: 0.1 },
];

const PARTICLES = [
  { x:"15%", size:6,  color:"#D4AF37", opacity:0.7, dur:6,   delay:0   },
  { x:"25%", size:4,  color:"#FFD700", opacity:0.5, dur:8,   delay:1.2 },
  { x:"38%", size:8,  color:"#D4AF37", opacity:0.6, dur:7,   delay:0.5 },
  { x:"50%", size:5,  color:"#FFF0A0", opacity:0.8, dur:5.5, delay:0.8 },
  { x:"62%", size:7,  color:"#D4AF37", opacity:0.55,dur:9,   delay:0.2 },
  { x:"75%", size:4,  color:"#FFD700", opacity:0.5, dur:7.5, delay:1.5 },
  { x:"85%", size:6,  color:"#D4AF37", opacity:0.65,dur:6.5, delay:0.6 },
];

const STARS = Array.from({ length: 40 }, (_, i) => ({
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 100}%`,
  size: `${0.5 + Math.random() * 1.5}px`,
  opacity: 0.1 + Math.random() * 0.5,
  dur: 2 + Math.random() * 4,
  delay: Math.random() * 3,
}));

const PANEL_ICONS = ["❋", "✦", "⚘", "❃"];
