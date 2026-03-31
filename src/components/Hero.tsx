import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TempleScene from "./TempleScene";
import { useTheme } from "@/context/ThemeContext";

const DOOR_START  = 800;
const DOOR_END    = 2200;
const CONTENT_IN  = 2800;

export default function Hero() {
  const [phase, setPhase] = useState<"closed"|"glowing"|"opening"|"open"|"content">("closed");
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef<number | null>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("glowing"),  500);
    const t2 = setTimeout(() => setPhase("opening"),  DOOR_START);
    const t3 = setTimeout(() => setPhase("open"),     DOOR_END);
    const t4 = setTimeout(() => setPhase("content"),  CONTENT_IN);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      setScrollY(window.scrollY);
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

  const isOpen     = phase === "open" || phase === "content";
  const hasContent = phase === "content";

  /* ── Theme-specific values ── */
  const sectionBg = isLight
    ? "linear-gradient(160deg, #FF8C00 0%, #E06500 15%, #FF9A00 35%, #FFB830 55%, #FFD97A 75%, #FFF3CD 100%)"
    : "#0d0101";

  const divineBurst = isLight
    ? `radial-gradient(ellipse 55% 75% at 50% 50%, rgba(255,220,80,0.85) 0%, rgba(255,120,0,0.35) 30%, transparent 62%)`
    : `radial-gradient(ellipse 45% 70% at 50% 50%, rgba(255,220,80,0.65) 0%, rgba(212,100,10,0.22) 30%, transparent 60%),
       radial-gradient(ellipse 70% 50% at 50% 50%, rgba(212,175,55,0.12) 0%, transparent 55%)`;

  const heroTitleGradient = isLight
    ? "linear-gradient(135deg, #5C0A00 0%, #8B1A00 30%, #6B1200 60%, #3D0600 100%)"
    : "linear-gradient(135deg, #FFFFFF 0%, #FFE566 25%, #FFD700 50%, #FFF0A0 70%, #FFD700 100%)";

  const heroSubColor = isLight ? "rgba(60, 10, 0, 0.9)" : "rgba(255, 240, 180, 0.95)";
  const heroWelcomeColor = isLight ? "rgba(60, 10, 0, 0.85)" : "rgba(255, 220, 120, 0.9)";
  const heroDescColor = isLight ? "rgba(50, 10, 0, 0.8)" : "rgba(255, 240, 200, 0.8)";
  const heroDividerColor = isLight ? "#B8520A" : "#D4AF37";
  const heroButtonBorder = isLight ? "rgba(139,37,0,0.55)" : "rgba(212,175,55,0.55)";
  const heroButtonColor = isLight ? "#8B2500" : "#D4AF37";
  const heroButtonBg = isLight ? "rgba(139,37,0,0.08)" : "rgba(212,175,55,0.06)";
  const scrollCueColor = isLight ? "rgba(120,50,0,0.5)" : "rgba(212,175,55,0.5)";

  return (
    <section
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      style={{ background: sectionBg }}
    >
      {/* ── Dark mode: cosmic nebula backdrop ── */}
      {!isLight && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div style={{ position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 120% 80% at 50% 0%, #1a0303 0%, #0d0101 40%, #050008 100%)" }} />
          <div style={{ position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 60% 40% at 20% 80%, rgba(120,40,0,0.18) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 50% 35% at 80% 70%, rgba(200,80,0,0.12) 0%, transparent 55%)" }} />
        </div>
      )}

      {/* ── Light mode: sunrise glow layers ── */}
      {isLight && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div style={{ position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(255,255,200,0.5) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 100% 50% at 50% 100%, rgba(255,80,0,0.15) 0%, transparent 60%)" }} />
        </div>
      )}

      {/* ── Starfield (dark only) ── */}
      {!isLight && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {STARS.map((s, i) => (
            <div key={i} className="absolute rounded-full" style={{
              left: s.x, top: s.y, width: s.size, height: s.size,
              background: s.color, opacity: s.opacity,
              boxShadow: s.glow ? `0 0 ${s.glowSize}px ${s.color}` : "none",
              animation: `twinkle ${s.dur}s ease-in-out infinite ${s.delay}s`,
            }} />
          ))}
        </div>
      )}

      {/* ── Light mode: floating sunrise particles ── */}
      {isLight && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          {SUNRISE_PARTICLES.map((p, i) => (
            <div key={i} className="absolute rounded-full" style={{
              left: p.x, bottom: `${p.bottom}%`, width: `${p.size}px`, height: `${p.size}px`,
              background: p.color, filter: `blur(${p.blur}px)`,
              opacity: p.opacity, animation: `floatUp ${p.dur}s ease-in infinite ${p.delay}s`,
            }} />
          ))}
        </div>
      )}

      {/* ── Dark mode: aurora wisps ── */}
      {!isLight && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          {AURORA.map((a, i) => (
            <div key={i} style={{
              position: "absolute", top: `${a.top}%`, left: `${a.left}%`,
              width: `${a.w}px`, height: `${a.h}px`,
              background: a.gradient, borderRadius: "50%",
              filter: `blur(${a.blur}px)`, opacity: a.opacity,
              animation: `auroraDrift ${a.dur}s ease-in-out infinite ${a.delay}s alternate`,
            }} />
          ))}
        </div>
      )}

      {/* ── 3D Temple ── */}
      <div className="absolute inset-0" style={{
        zIndex: 1,
        opacity: isOpen ? 1 : 0,
        transition: "opacity 2.2s ease-in",
      }}>
        <TempleScene scrollY={scrollY} height="100%" cameraPosition={[0, 0.4, 6]} enableOrbit />
      </div>

      {/* ── Divine light burst ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 2,
        background: divineBurst,
        opacity: isOpen ? 1 : phase === "glowing" ? (isLight ? 0.15 : 0.08) : 0,
        transition: isOpen ? "opacity 1.4s ease-out" : "opacity 1.6s ease-in",
      }} />

      {/* ── Light rays ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
        {(isLight ? SUNRISE_RAYS : DARK_RAYS).map((r, i) => (
          <div key={i} style={{
            position: "absolute", top: 0, left: "50%",
            width: `${r.w}px`, height: "115%",
            background: r.gradient,
            transform: `translateX(-50%) rotate(${r.angle}deg)`,
            transformOrigin: "top center",
            opacity: isOpen ? r.opacity : 0,
            transition: `opacity ${1.4 + i * 0.12}s ease-out`,
            animation: isOpen ? `rayPulse ${r.dur}s ease-in-out infinite ${r.delay}s` : "none",
          }} />
        ))}
      </div>

      {/* ── Floating particles (dark mode) ── */}
      {!isLight && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
          {DARK_PARTICLES.map((p, i) => (
            <div key={i} className="absolute rounded-full" style={{
              left: p.x, bottom: "5%", width: `${p.size}px`, height: `${p.size}px`,
              background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              opacity: isOpen ? p.opacity : 0,
              transition: `opacity ${1.0 + i * 0.08}s ease-out`,
              animation: isOpen ? `floatUp ${p.dur}s ease-in infinite ${p.delay}s` : "none",
            }} />
          ))}
        </div>
      )}

      {/* ══════════════════ DOORS ══════════════════ */}
      <div className="absolute top-0 left-0 w-1/2 h-full pointer-events-none" style={{
        zIndex: 20,
        transform: `translateX(${isOpen ? "-105%" : "0%"})`,
        transition: isOpen ? `transform ${(DOOR_END - DOOR_START) / 1000}s cubic-bezier(0.16,1,0.3,1)` : "none",
      }}>
        <DoorPanel side="left" phase={phase} isLight={isLight} />
      </div>

      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none" style={{
        zIndex: 20,
        transform: `translateX(${isOpen ? "105%" : "0%"})`,
        transition: isOpen ? `transform ${(DOOR_END - DOOR_START) / 1000}s cubic-bezier(0.16,1,0.3,1)` : "none",
      }}>
        <DoorPanel side="right" phase={phase} isLight={isLight} />
      </div>

      {/* ── Center divine crack ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full pointer-events-none" style={{
        zIndex: 21, width: "4px",
        background: isLight
          ? "linear-gradient(to bottom, transparent 0%, #FF8C00 10%, #FFD700 30%, #FFF8E1 50%, #FFD700 70%, #FF8C00 90%, transparent 100%)"
          : "linear-gradient(to bottom, transparent 0%, #D4AF37 10%, #FFD700 30%, #FFF8E1 50%, #FFD700 70%, #D4AF37 90%, transparent 100%)",
        opacity: phase === "closed" ? 0 : isOpen ? 0 : 1,
        transition: phase === "glowing" ? "opacity 0.9s ease-in" : "opacity 0.35s ease-out",
        boxShadow: isLight
          ? "0 0 16px 6px rgba(255,140,0,0.85), 0 0 50px 15px rgba(255,200,0,0.3)"
          : "0 0 16px 6px rgba(212,175,55,0.9), 0 0 50px 15px rgba(212,175,55,0.35)",
      }} />

      {/* ── Top ornament ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center" style={{ zIndex: 22 }}>
        <div style={{
          width: "2px", height: "60px",
          background: isLight
            ? "linear-gradient(to bottom, rgba(180,80,0,0.8), transparent)"
            : "linear-gradient(to bottom, rgba(212,175,55,0.9), transparent)",
          opacity: isOpen ? 0 : 0.8, transition: "opacity 0.5s ease-out",
        }} />
        <div style={{
          color: isLight ? "#B8520A" : "#D4AF37", fontSize: "1.6rem",
          opacity: isOpen ? 0 : phase === "closed" ? 0 : 1,
          transition: phase === "glowing" ? "opacity 0.8s ease-in" : "opacity 0.4s ease-out",
          textShadow: isLight
            ? "0 0 16px rgba(255,140,0,1), 0 0 40px rgba(255,200,0,0.6)"
            : "0 0 16px rgba(212,175,55,1), 0 0 40px rgba(212,175,55,0.6)",
        }}>✦</div>
      </div>

      {/* ══════════════════ HERO CONTENT ══════════════════ */}
      <AnimatePresence>
        {hasContent && (
          <motion.div
            className="absolute z-30 text-center px-4 w-full max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
          >
            {/* Backdrop blur panel */}
            <div style={{
              position: "absolute",
              inset: "-24px -32px",
              background: isLight
                ? "radial-gradient(ellipse at center, rgba(255,255,255,0.25) 0%, transparent 70%)"
                : "radial-gradient(ellipse at center, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 50%, transparent 80%)",
              backdropFilter: isLight ? "none" : "blur(2px)",
              pointerEvents: "none",
              zIndex: -1,
            }} />
            {/* Om */}
            <motion.div className="text-5xl md:text-6xl mb-4"
              style={{
                color: isLight ? "#8B2500" : "#D4AF37",
                textShadow: isLight
                  ? "0 0 30px rgba(255,140,0,1), 0 0 70px rgba(255,200,0,0.4)"
                  : "0 0 30px rgba(212,175,55,1), 0 0 70px rgba(212,175,55,0.6), 0 0 100px rgba(212,175,55,0.3)",
                filter: isLight
                  ? "drop-shadow(0 0 16px rgba(255,140,0,0.7))"
                  : "drop-shadow(0 0 20px rgba(212,175,55,0.8))",
              }}
              initial={{ scale: 0.4, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}>
              ॐ
            </motion.div>

            <motion.p className="font-cinzel text-xs md:text-sm tracking-[0.55em] uppercase mb-3"
              style={{ color: heroWelcomeColor }}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9 }}>
              Welcome to
            </motion.p>

            <motion.h1 className="font-cinzel font-black text-3xl sm:text-5xl md:text-7xl leading-none mb-1"
              style={isLight ? {
                color: "#FFFFFF",
                textShadow: "0 0 20px rgba(255,140,0,0.9), 0 2px 8px rgba(0,0,0,0.5), 0 0 60px rgba(255,200,0,0.6)",
              } : {
                background: heroTitleGradient,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                filter: "drop-shadow(0 0 2px #000) drop-shadow(0 0 8px rgba(0,0,0,0.9)) drop-shadow(0 2px 4px rgba(0,0,0,1))",
              }}
              initial={{ opacity: 0, scale: 0.8, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
              SHRI RAM
            </motion.h1>

            <motion.h2 className="font-cinzel font-bold text-xl md:text-3xl tracking-[0.35em] mb-5"
              style={{ color: heroSubColor }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.9 }}>
              MANDIR
            </motion.h2>

            <motion.div className="flex items-center justify-center gap-3 mb-5"
              initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}>
              <div className="h-px flex-1 max-w-[90px]"
                style={{ background: `linear-gradient(to right, transparent, ${heroDividerColor} 60%, #D4AF37)` }} />
              <span style={{ color: "#D4AF37", fontSize: "1rem", textShadow: "0 0 10px rgba(212,175,55,0.8)" }}>❋</span>
              <div className="h-px flex-1 max-w-[90px]"
                style={{ background: `linear-gradient(to left, transparent, ${heroDividerColor} 60%, #D4AF37)` }} />
            </motion.div>

            <motion.p className="font-sans font-light text-sm md:text-base max-w-xs mx-auto mb-8 leading-relaxed tracking-wide"
              style={{ color: heroDescColor }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 1.0 }}>
              A divine abode of peace, devotion, and eternal blessings
            </motion.p>

            <motion.button
              onClick={handleExplore}
              className="font-cinzel text-xs tracking-[0.35em] uppercase px-8 py-3.5"
              style={{
                border: `1px solid ${heroButtonBorder}`,
                color: heroButtonColor,
                background: heroButtonBg,
                boxShadow: isLight
                  ? "0 0 24px rgba(180,80,0,0.15)"
                  : "0 0 24px rgba(212,175,55,0.2)",
                cursor: "pointer",
                backdropFilter: "blur(4px)",
              }}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.9 }}
              whileHover={{
                backgroundColor: isLight ? "rgba(139,37,0,0.12)" : "rgba(212,175,55,0.15)",
                boxShadow: isLight
                  ? "0 0 40px rgba(180,80,0,0.3)"
                  : "0 0 50px rgba(212,175,55,0.45)",
              }}
              whileTap={{ scale: 0.97 }}>
              Explore Temple
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll cue */}
      {hasContent && (
        <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.9 }}>
          <span className="font-cinzel text-[9px] tracking-[0.45em]" style={{ color: scrollCueColor }}>SCROLL</span>
          <motion.div className="w-px h-8"
            style={{ background: isLight
              ? "linear-gradient(to bottom, rgba(180,80,0,0.7), rgba(212,175,55,0.3), transparent)"
              : "linear-gradient(to bottom, rgba(212,175,55,0.7), rgba(212,175,55,0.3), transparent)" }}
            animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }} />
        </motion.div>
      )}
    </section>
  );
}

/* ────────────── Door Panel ────────────── */
function DoorPanel({ side, phase, isLight }: { side: "left" | "right"; phase: string; isLight: boolean }) {
  const isLeft  = side === "left";
  const glowing = phase !== "closed";
  const opening = phase === "opening" || phase === "open" || phase === "content";

  const doorBg = isLight
    ? isLeft
      ? "linear-gradient(to right, #FFF0CC, #FFE0AA, #FFD080)"
      : "linear-gradient(to left, #FFF0CC, #FFE0AA, #FFD080)"
    : isLeft
      ? "linear-gradient(to right, #0e0101, #1a0303, #240404)"
      : "linear-gradient(to left, #0e0101, #1a0303, #240404)";

  const doorBorder = isLight ? "rgba(180,100,0,0.5)" : "rgba(212,175,55,0.45)";
  const grainColor1 = isLight ? "rgba(180,100,0,0.08)" : "rgba(212,175,55,0.07)";
  const grainColor2 = isLight ? "rgba(180,100,0,0.05)" : "rgba(212,175,55,0.04)";
  const circleBorder = glowing
    ? (isLight ? "rgba(180,100,0,0.6)" : "rgba(212,175,55,0.75)")
    : "rgba(212,175,55,0.3)";
  const circleBg = glowing
    ? (isLight ? "rgba(255,180,0,0.1)" : "rgba(212,175,55,0.08)")
    : "rgba(212,175,55,0.03)";
  const omColor = glowing
    ? (isLight ? "rgba(140,60,0,0.9)" : "rgba(255,240,180,0.95)")
    : "rgba(212,175,55,0.6)";
  const panelBorderBase = isLight ? "rgba(180,100,0,0.25)" : "rgba(212,175,55,0.12)";
  const iconColor = glowing
    ? (isLight ? "rgba(160,70,0,0.6)" : "rgba(212,175,55,0.65)")
    : "rgba(212,175,55,0.3)";
  const handleBg = isLight
    ? "linear-gradient(to bottom, #8B4500, #D4AF37, #F5E088, #D4AF37, #8B4500)"
    : "linear-gradient(to bottom, #6B2A00, #D4AF37, #F5E088, #D4AF37, #6B2A00)";

  return (
    <div className="absolute inset-0" style={{
      background: doorBg,
      borderRight: isLeft ? `2px solid ${doorBorder}` : "none",
      borderLeft:  !isLeft ? `2px solid ${doorBorder}` : "none",
      boxShadow: isLeft
        ? `inset -8px 0 40px ${isLight ? "rgba(180,100,0,0.06)" : "rgba(120,40,0,0.15)"}`
        : `inset 8px 0 40px ${isLight ? "rgba(180,100,0,0.06)" : "rgba(120,40,0,0.15)"}`,
    }}>
      {/* Grain lines */}
      {[...Array(10)].map((_, i) => (
        <div key={i} className="absolute top-0 bottom-0" style={{
          left: `${8 + i * 9}%`, width: "1px",
          background: i % 3 === 0
            ? `linear-gradient(to bottom, transparent, ${grainColor1} 30%, ${grainColor1} 70%, transparent)`
            : `linear-gradient(to bottom, transparent, ${grainColor2} 30%, ${grainColor2} 70%, transparent)`,
        }} />
      ))}

      {/* Om circle */}
      <div className="absolute flex items-center justify-center" style={{
        top: "6%", left: "50%", transform: "translateX(-50%)",
        width: "84px", height: "84px", borderRadius: "50%",
        border: `2px solid ${circleBorder}`,
        background: circleBg,
        boxShadow: glowing
          ? `0 0 24px ${isLight ? "rgba(255,140,0,0.4)" : "rgba(212,175,55,0.5)"}, 0 0 50px rgba(212,175,55,0.2)`
          : "none",
        transition: "all 1.2s ease-in",
      }}>
        <svg viewBox="0 0 48 48" width="44" height="44" fill="none">
          <text x="50%" y="78%" textAnchor="middle" fontSize="32"
            fontFamily="serif" fill={omColor} fontWeight="bold">ॐ</text>
        </svg>
      </div>

      {/* Horizontal band */}
      <div className="absolute left-0 right-0" style={{
        top: "19%", height: "2px",
        background: `linear-gradient(to right, transparent, ${glowing
          ? (isLight ? "rgba(180,100,0,0.4)" : "rgba(192,132,252,0.3)")
          : "rgba(212,175,55,0.25)"}, transparent)`,
        transition: "background 1s ease-in",
      }} />

      {/* Panel rectangles */}
      <div className="absolute flex flex-col gap-4" style={{ top: "22%", left: "8%", right: "8%", bottom: "8%" }}>
        {PANEL_ICONS.map((icon, i) => (
          <div key={i} className="flex-1 flex items-center justify-center" style={{
            border: `1px solid ${opening
              ? (i % 2 === 0
                  ? (isLight ? "rgba(180,100,0,0.3)" : "rgba(192,132,252,0.2)")
                  : "rgba(212,175,55,0.2)")
              : panelBorderBase}`,
            borderRadius: "2px",
            background: opening
              ? (isLight
                  ? (i % 2 === 0 ? "rgba(255,160,0,0.06)" : "rgba(212,175,55,0.05)")
                  : (i % 2 === 0 ? "rgba(212,175,55,0.06)" : "rgba(180,100,0,0.04)"))
              : "rgba(212,175,55,0.02)",
            position: "relative", transition: "all 0.8s ease-in",
          }}>
            {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h]) => (
              <div key={`${v}${h}`} style={{
                position: "absolute", [v]: "-1px", [h]: "-1px",
                width: "8px", height: "8px",
                borderTop: v === "top" ? `2px solid ${glowing ? (isLight ? "rgba(180,100,0,0.55)" : "rgba(212,175,55,0.65)") : "rgba(212,175,55,0.4)"}` : "none",
                borderBottom: v === "bottom" ? `2px solid ${glowing ? (isLight ? "rgba(180,100,0,0.55)" : "rgba(212,175,55,0.65)") : "rgba(212,175,55,0.4)"}` : "none",
                borderLeft: h === "left" ? `2px solid ${glowing ? (isLight ? "rgba(180,100,0,0.55)" : "rgba(212,175,55,0.65)") : "rgba(212,175,55,0.4)"}` : "none",
                borderRight: h === "right" ? `2px solid ${glowing ? (isLight ? "rgba(180,100,0,0.55)" : "rgba(212,175,55,0.65)") : "rgba(212,175,55,0.4)"}` : "none",
              }} />
            ))}
            <span style={{
              fontSize: "1.5rem", color: iconColor,
              textShadow: glowing
                ? `0 0 12px ${isLight ? "rgba(255,140,0,0.5)" : "rgba(212,175,55,0.7)"}`
                : "none",
              transition: "all 1.5s ease-in",
            }}>{icon}</span>
          </div>
        ))}
      </div>

      {/* Handle */}
      <div style={{
        position: "absolute", top: "50%", transform: "translateY(-50%)",
        [isLeft ? "right" : "left"]: "14px",
        width: "10px", height: "52px", borderRadius: "9999px",
        background: handleBg,
        boxShadow: glowing
          ? `0 0 18px ${isLight ? "rgba(255,140,0,0.7)" : "rgba(212,175,55,0.8)"}, 0 0 40px rgba(212,175,55,0.3)`
          : "0 0 6px rgba(212,175,55,0.3)",
        transition: "box-shadow 1.2s ease-in",
      }} />

      <div className="absolute left-0 right-0 bottom-8" style={{
        height: "1px",
        background: `linear-gradient(to right, transparent, ${isLight ? "rgba(180,100,0,0.3)" : "rgba(212,175,55,0.35)"}, rgba(212,175,55,0.2), ${isLight ? "rgba(180,100,0,0.3)" : "rgba(212,175,55,0.35)"}, transparent)`,
      }} />
    </div>
  );
}

/* ────────────── Static data ────────────── */
const DARK_RAYS = [
  { w: 3,   angle: -30, opacity: 0.65, dur: 4.2, delay: 0,   gradient: "linear-gradient(to bottom, rgba(212,175,55,0.9), rgba(212,175,55,0.2), transparent)" },
  { w: 2,   angle: -18, opacity: 0.5,  dur: 3.8, delay: 0.3, gradient: "linear-gradient(to bottom, rgba(245,224,136,0.8), transparent)" },
  { w: 180, angle: -10, opacity: 0.05, dur: 5.5, delay: 0.1, gradient: "linear-gradient(to bottom, rgba(212,175,55,0.2), transparent)" },
  { w: 5,   angle:   0, opacity: 0.9,  dur: 3.2, delay: 0,   gradient: "linear-gradient(to bottom, rgba(255,255,240,0.9), rgba(212,175,55,0.5), transparent)" },
  { w: 220, angle:   6, opacity: 0.04, dur: 6.5, delay: 0.2, gradient: "linear-gradient(to bottom, rgba(212,175,55,0.15), transparent)" },
  { w: 2,   angle:  17, opacity: 0.5,  dur: 4.1, delay: 0.5, gradient: "linear-gradient(to bottom, rgba(245,224,136,0.8), transparent)" },
  { w: 3,   angle:  29, opacity: 0.6,  dur: 4.6, delay: 0.1, gradient: "linear-gradient(to bottom, rgba(212,175,55,0.9), rgba(212,175,55,0.2), transparent)" },
  { w: 1,   angle: -44, opacity: 0.3,  dur: 5.0, delay: 0.8, gradient: "linear-gradient(to bottom, rgba(245,224,136,0.6), transparent)" },
  { w: 1,   angle:  43, opacity: 0.3,  dur: 4.8, delay: 0.6, gradient: "linear-gradient(to bottom, rgba(245,224,136,0.6), transparent)" },
];

const SUNRISE_RAYS = [
  { w: 4,   angle: -28, opacity: 0.7,  dur: 4.5, delay: 0,   gradient: "linear-gradient(to bottom, rgba(255,200,50,0.9), rgba(255,120,0,0.3), transparent)" },
  { w: 2,   angle: -15, opacity: 0.55, dur: 4.0, delay: 0.3, gradient: "linear-gradient(to bottom, rgba(255,220,80,0.8), transparent)" },
  { w: 200, angle:  -8, opacity: 0.06, dur: 5.8, delay: 0.1, gradient: "linear-gradient(to bottom, rgba(255,200,0,0.3), transparent)" },
  { w: 6,   angle:   0, opacity: 1.0,  dur: 3.5, delay: 0,   gradient: "linear-gradient(to bottom, rgba(255,255,220,1), rgba(255,220,80,0.7), transparent)" },
  { w: 240, angle:   5, opacity: 0.05, dur: 7.0, delay: 0.2, gradient: "linear-gradient(to bottom, rgba(255,180,0,0.3), transparent)" },
  { w: 2,   angle:  14, opacity: 0.55, dur: 4.2, delay: 0.5, gradient: "linear-gradient(to bottom, rgba(255,220,80,0.8), transparent)" },
  { w: 4,   angle:  27, opacity: 0.65, dur: 4.8, delay: 0.1, gradient: "linear-gradient(to bottom, rgba(255,200,50,0.9), rgba(255,120,0,0.3), transparent)" },
  { w: 1,   angle: -42, opacity: 0.35, dur: 5.2, delay: 0.8, gradient: "linear-gradient(to bottom, rgba(255,220,100,0.6), transparent)" },
  { w: 1,   angle:  41, opacity: 0.35, dur: 4.9, delay: 0.6, gradient: "linear-gradient(to bottom, rgba(255,220,100,0.6), transparent)" },
];

const DARK_PARTICLES = [
  { x:"8%",  size:5,  color:"#D4AF37",  opacity:0.8, dur:6.5, delay:0   },
  { x:"18%", size:3,  color:"#F5E088",  opacity:0.6, dur:8.5, delay:1.2 },
  { x:"28%", size:7,  color:"#D4AF37",  opacity:0.65,dur:7.2, delay:0.5 },
  { x:"38%", size:4,  color:"#FFF0C0",  opacity:0.9, dur:5.8, delay:0.9 },
  { x:"48%", size:6,  color:"#C8A030",  opacity:0.55,dur:9.0, delay:0.2 },
  { x:"58%", size:4,  color:"#FFD700",  opacity:0.7, dur:6.8, delay:1.4 },
  { x:"67%", size:8,  color:"#D4AF37",  opacity:0.6, dur:7.5, delay:0.7 },
  { x:"76%", size:3,  color:"#F5E088",  opacity:0.55,dur:8.0, delay:0.3 },
  { x:"85%", size:5,  color:"#FFE8A0",  opacity:0.75,dur:6.2, delay:1.0 },
  { x:"93%", size:4,  color:"#C8A030",  opacity:0.5, dur:7.8, delay:0.6 },
];

const SUNRISE_PARTICLES = [
  { x:"8%",  bottom:5, size:10, color:"#FF6B00", blur:3, opacity:0.5, dur:7.0, delay:0.0 },
  { x:"18%", bottom:8, size:7,  color:"#FFB300", blur:2, opacity:0.6, dur:8.0, delay:1.0 },
  { x:"28%", bottom:3, size:12, color:"#FF8C00", blur:4, opacity:0.45,dur:6.5, delay:0.5 },
  { x:"38%", bottom:6, size:6,  color:"#FFD700", blur:2, opacity:0.7, dur:5.8, delay:0.8 },
  { x:"50%", bottom:4, size:9,  color:"#FF6B00", blur:3, opacity:0.5, dur:9.0, delay:0.2 },
  { x:"62%", bottom:7, size:8,  color:"#FFB300", blur:2, opacity:0.55,dur:7.2, delay:1.2 },
  { x:"72%", bottom:5, size:11, color:"#FF8C00", blur:4, opacity:0.45,dur:6.8, delay:0.6 },
  { x:"82%", bottom:3, size:6,  color:"#FFD700", blur:2, opacity:0.65,dur:8.5, delay:0.9 },
  { x:"91%", bottom:6, size:8,  color:"#FF6B00", blur:3, opacity:0.5, dur:7.5, delay:0.3 },
];

const STARS = Array.from({ length: 80 }, (_, i) => {
  const type = i % 5;
  const colors = ["#D4AF37", "#F5E088", "#FFF8E1", "#FFD700", "#C8A030"];
  const color = colors[type];
  const isLarge = Math.random() > 0.85;
  return {
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: isLarge ? `${1.5 + Math.random() * 2}px` : `${0.5 + Math.random() * 1.2}px`,
    color,
    glow: isLarge,
    glowSize: Math.random() * 4 + 2,
    opacity: 0.15 + Math.random() * 0.7,
    dur: 2.5 + Math.random() * 5,
    delay: Math.random() * 4,
  };
});

const AURORA = [
  { top: 10, left: -10, w: 500, h: 200, gradient: "radial-gradient(ellipse, rgba(180,100,0,0.15) 0%, transparent 70%)", blur: 60, opacity: 0.8, dur: 12, delay: 0 },
  { top: 5,  left: 60,  w: 400, h: 160, gradient: "radial-gradient(ellipse, rgba(140,70,0,0.1) 0%, transparent 70%)", blur: 50, opacity: 0.7, dur: 15, delay: 2 },
  { top: 60, left: 10,  w: 350, h: 180, gradient: "radial-gradient(ellipse, rgba(160,60,10,0.12) 0%, transparent 70%)", blur: 55, opacity: 0.6, dur: 18, delay: 5 },
  { top: 70, left: 55,  w: 450, h: 200, gradient: "radial-gradient(ellipse, rgba(120,50,0,0.08) 0%, transparent 70%)", blur: 65, opacity: 0.5, dur: 14, delay: 3 },
];

const PANEL_ICONS = ["❋", "✦", "⚘", "❃"];
