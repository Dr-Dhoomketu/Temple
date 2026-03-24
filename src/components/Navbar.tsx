import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DiyaToggle from "./DiyaToggle";

const navLinks = [
  { label: "Temple", href: "#temple" },
  { label: "Pujaris", href: "#pujaris" },
  { label: "Timings", href: "#timings" },
  { label: "Donate", href: "#donate" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#1a0303]/95 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          {/* Golden Om SVG */}
          <svg
            viewBox="0 0 48 48"
            width="36"
            height="36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: "drop-shadow(0 0 6px rgba(212,175,55,0.7))", flexShrink: 0 }}
            aria-label="Om symbol"
          >
            <defs>
              <linearGradient id="omGradNav" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5E088" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#9A7B1C" />
              </linearGradient>
            </defs>
            {/* Om (ॐ) path — drawn as a clean SVG glyph */}
            <text
              x="50%"
              y="78%"
              textAnchor="middle"
              fontSize="34"
              fontFamily="serif"
              fill="url(#omGradNav)"
              fontWeight="bold"
            >
              ॐ
            </text>
          </svg>
          <div>
            <div className="font-cinzel font-bold text-[#D4AF37] text-sm md:text-base leading-tight tracking-widest">
              SHRI RAM
            </div>
            <div className="font-cinzel text-[#F5F5DC]/60 text-xs tracking-[0.3em] uppercase">
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
              className="font-cinzel text-xs tracking-[0.2em] uppercase text-[#F5F5DC]/70 hover:text-[#D4AF37] transition-colors duration-300"
            >
              {link.label}
            </button>
          ))}
          <DiyaToggle />
          <button
            onClick={() => handleLinkClick("#donate")}
            className="px-5 py-2 bg-[#D4AF37] text-[#1a0303] font-cinzel text-xs font-semibold tracking-widest rounded-sm hover:bg-[#F5E088] transition-colors duration-300"
          >
            Donate Now
          </button>
        </div>

        {/* Mobile: diya + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <DiyaToggle />
          <button
            className="text-[#D4AF37] text-2xl w-10 h-10 flex items-center justify-center"
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#1a0303]/98 border-b border-[#D4AF37]/20 px-4 pb-4"
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleLinkClick(link.href)}
              className="block w-full text-left py-3 font-cinzel text-sm tracking-widest text-[#F5F5DC]/80 hover:text-[#D4AF37] transition-colors border-b border-[#D4AF37]/10"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleLinkClick("#donate")}
            className="mt-3 w-full py-3 bg-[#D4AF37] text-[#1a0303] font-cinzel text-xs font-semibold tracking-widest rounded-sm hover:bg-[#F5E088] transition-colors duration-300"
          >
            Donate Now
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
}
