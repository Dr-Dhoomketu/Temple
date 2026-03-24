import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function DiyaToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  // Dark mode: deep golden fire  |  Light mode: bright yellow-white flame
  const flameOuter = isDark ? "#D4AF37" : "#FFD700";
  const flameInner = isDark ? "#FF8C00" : "#FFF176";
  const flameCore  = isDark ? "#FF4500" : "#FFEB3B";
  const glowColor  = isDark ? "rgba(212,175,55,0.6)" : "rgba(255,235,59,0.7)";
  const bowlColor  = isDark ? "#B8962F" : "#D4AF37";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={isDark ? "Light mode" : "Dark mode"}
      className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
      style={{
        background: isDark ? "rgba(212,175,55,0.08)" : "rgba(255,235,59,0.12)",
        border: `1px solid ${isDark ? "rgba(212,175,55,0.3)" : "rgba(255,200,0,0.4)"}`,
      }}
    >
      <svg
        viewBox="0 0 32 40"
        width="22"
        height="28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
      >
        {/* Diya bowl */}
        <ellipse cx="16" cy="30" rx="10" ry="4" fill={bowlColor} opacity="0.9" />
        <path d="M6 30 Q6 36 16 36 Q26 36 26 30" fill={bowlColor} opacity="0.7" />
        {/* Oil pool */}
        <ellipse cx="16" cy="30" rx="7" ry="2.5" fill="#9A7B1C" opacity="0.5" />
        {/* Wick */}
        <line x1="16" y1="27" x2="16" y2="22" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" />

        {/* Outer flame */}
        <AnimatePresence mode="wait">
          <motion.path
            key={`outer-${theme}`}
            d="M16 22 C13 18 11 14 14 10 C15 8 16 6 16 4 C16 6 17 8 18 10 C21 14 19 18 16 22Z"
            fill={flameOuter}
            initial={{ scaleY: 0.8, opacity: 0 }}
            animate={{
              scaleY: [1, 1.08, 0.95, 1.05, 1],
              scaleX: [1, 0.95, 1.05, 0.98, 1],
              opacity: 1,
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "16px 22px" }}
          />
        </AnimatePresence>

        {/* Inner flame */}
        <AnimatePresence mode="wait">
          <motion.path
            key={`inner-${theme}`}
            d="M16 21 C14.5 18 13.5 15 15 12 C15.5 10.5 16 9 16 7 C16 9 16.5 10.5 17 12 C18.5 15 17.5 18 16 21Z"
            fill={flameInner}
            animate={{
              scaleY: [1, 1.1, 0.92, 1.06, 1],
              opacity: [0.9, 1, 0.85, 1, 0.9],
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
            style={{ transformOrigin: "16px 21px" }}
          />
        </AnimatePresence>

        {/* Core flame */}
        <motion.path
          d="M16 20 C15 18 14.5 16 15.5 14 C15.8 13 16 12 16 11 C16 12 16.2 13 16.5 14 C17.5 16 17 18 16 20Z"
          fill={flameCore}
          animate={{
            scaleY: [1, 1.12, 0.9, 1.08, 1],
            opacity: [1, 0.9, 1, 0.95, 1],
          }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          style={{ transformOrigin: "16px 20px" }}
        />

        {/* Glow dot at base of flame */}
        <motion.circle
          cx="16" cy="22" r="1.5"
          fill={flameOuter}
          animate={{ opacity: [0.6, 1, 0.6], r: [1.5, 2, 1.5] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      </svg>

      {/* Mode label tooltip on hover — tiny text below */}
      <span className="sr-only">{isDark ? "Switch to light mode" : "Switch to dark mode"}</span>
    </button>
  );
}
