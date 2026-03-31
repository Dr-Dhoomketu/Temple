import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import DiyaToggle from "./DiyaToggle";
import { useTheme } from "@/context/ThemeContext";

const navLinks = [
  { label: "Temple", href: "#temple" },
  { label: "Pujaris", href: "#pujaris" },
  { label: "Timings", href: "#timings" },
  { label: "Donations", href: "#donate" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navBg = isLight
    ? scrolled ? "rgba(255,248,235,0.98)" : "rgba(255,248,235,0.92)"
    : scrolled ? "rgba(8,0,18,0.96)" : "transparent";

  const navBorder = scrolled
    ? isLight
      ? "1px solid rgba(180,100,0,0.18)"
      : "1px solid rgba(192,132,252,0.15)"
    : "none";

  const linkColor = isLight ? "#7A3800" : "rgba(224,210,255,0.78)";
  const linkHover = "#D4AF37";
  const logoTitle = isLight ? "#B8520A" : "#D4AF37";
  const logoSub   = isLight ? "rgba(100,40,0,0.7)" : "rgba(224,210,255,0.5)";

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: navBg,
        borderBottom: navBorder,
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.12)" : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg viewBox="0 0 48 48" width="36" height="36" fill="none"
            style={{ filter: `drop-shadow(0 0 6px rgba(212,175,55,0.7))`, flexShrink: 0 }}
            aria-label="Om symbol">
            <defs>
              <linearGradient id="omGradNav" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5E088" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#9A7B1C" />
              </linearGradient>
            </defs>
            <text x="50%" y="78%" textAnchor="middle" fontSize="34" fontFamily="serif"
              fill="url(#omGradNav)" fontWeight="bold">ॐ</text>
          </svg>
          <div>
            <div className="font-cinzel font-bold text-sm md:text-base leading-tight tracking-widest"
              style={{ color: logoTitle }}>
              SHRI RAM
            </div>
            <div className="font-cinzel text-xs tracking-[0.3em] uppercase"
              style={{ color: logoSub }}>
              Temple
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleLinkClick(link.href)}
              className="font-cinzel text-xs tracking-[0.2em] uppercase transition-colors duration-300"
              style={{ color: linkColor, background: "none", border: "none", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.color = linkHover)}
              onMouseLeave={e => (e.currentTarget.style.color = linkColor)}
            >
              {link.label}
            </button>
          ))}
          <DiyaToggle />
          <button
            onClick={() => navigate("/donate")}
            className="font-cinzel text-xs font-semibold tracking-widest transition-all duration-300"
            style={{
              padding: "8px 20px",
              background: isLight
                ? "linear-gradient(135deg, #8B2500, #B8520A)"
                : "linear-gradient(135deg, #F5E088, #D4AF37)",
              color: isLight ? "#FFF8E7" : "#0a0515",
              border: "none",
              cursor: "pointer",
              borderRadius: 2,
              boxShadow: isLight
                ? "0 2px 16px rgba(180,80,0,0.3)"
                : "0 2px 16px rgba(212,175,55,0.3)",
            }}
          >
            Donate Now
          </button>
        </div>

        {/* Mobile: diya + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <DiyaToggle />
          <button
            style={{ color: "#D4AF37", fontSize: 22, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: isLight ? "rgba(255,248,235,0.98)" : "rgba(8,0,18,0.98)",
            borderBottom: isLight ? "1px solid rgba(180,100,0,0.15)" : "1px solid rgba(192,132,252,0.15)",
            padding: "0 16px 16px",
            backdropFilter: "blur(12px)",
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleLinkClick(link.href)}
              className="font-cinzel text-sm tracking-widest transition-colors"
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "12px 0", color: linkColor, background: "none", border: "none",
                borderBottom: isLight ? "1px solid rgba(180,100,0,0.12)" : "1px solid rgba(192,132,252,0.1)",
                cursor: "pointer",
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => navigate("/donate")}
            className="font-cinzel text-xs font-semibold tracking-widest"
            style={{
              marginTop: 12, width: "100%", padding: "12px 0",
              background: isLight
                ? "linear-gradient(135deg, #8B2500, #B8520A)"
                : "linear-gradient(135deg, #F5E088, #D4AF37)",
              color: isLight ? "#FFF8E7" : "#0a0515",
              border: "none", cursor: "pointer", borderRadius: 2,
            }}
          >
            Donate Now
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
}
