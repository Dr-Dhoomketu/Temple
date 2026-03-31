import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function Footer() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <footer className="relative py-12" style={{ borderTop: `1px solid ${isLight ? "rgba(180,90,0,0.2)" : "rgba(212,175,55,0.15)"}` }}>
      <div className="absolute inset-0" style={{
        background: isLight
          ? "linear-gradient(to top, #FFE8CC, #FFF3E0)"
          : "linear-gradient(to top, #0d0101, transparent)",
      }} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & tagline */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              {/* Golden Om SVG */}
              <svg
                viewBox="0 0 48 48"
                width="36"
                height="36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: "drop-shadow(0 0 6px rgba(212,175,55,0.6))", flexShrink: 0 }}
                aria-label="Om symbol"
              >
                <defs>
                  <linearGradient id="omGradFooter" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F5E088" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#9A7B1C" />
                  </linearGradient>
                </defs>
                <text
                  x="50%"
                  y="78%"
                  textAnchor="middle"
                  fontSize="34"
                  fontFamily="serif"
                  fill="url(#omGradFooter)"
                  fontWeight="bold"
                >
                  ॐ
                </text>
              </svg>
              <div>
                <div className="font-cinzel font-bold text-[#D4AF37] tracking-widest">SHRI RAM MANDIR</div>
                <div className="font-sans text-xs text-[#F5F5DC]/40 tracking-wider">Divine Abode of Peace</div>
              </div>
            </div>
            <p className="font-sans text-xs text-[#F5F5DC]/40 leading-relaxed">
              A sacred space where devotion meets divinity. Come, seek blessings, and experience the eternal grace of Lord Ram.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-cinzel font-semibold text-sm text-[#D4AF37] mb-4 tracking-wider">Contact</h4>
            <div className="space-y-2">
              {[
                { icon: "📍", text: "Temple Road, Ayodhya, UP 224123" },
                { icon: "📞", text: "+91 98765 43210" },
                { icon: "✉️", text: "info@shrirammandir.org" },
                { icon: "🕐", text: "Open: 4:00 AM – 9:00 PM" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-2">
                  <span className="text-sm mt-0.5">{item.icon}</span>
                  <span className="font-sans text-xs text-[#F5F5DC]/50">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-cinzel font-semibold text-sm text-[#D4AF37] mb-4 tracking-wider">Quick Links</h4>
            <div className="space-y-2">
              {[
                { label: "About Temple", href: "#temple" },
                { label: "Pujari Team", href: "#pujaris" },
                { label: "Puja Timings", href: "#timings" },
                { label: "Donate & Seva", href: "#donate" },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    const el = document.querySelector(link.href);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="block font-cinzel text-xs text-[#F5F5DC]/50 hover:text-[#D4AF37] transition-colors tracking-wider"
                >
                  ❋ {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[#D4AF37]/15" />
          <div className="text-[#D4AF37]/40 text-sm">❋</div>
          <div className="flex-1 h-px bg-[#D4AF37]/15" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            className="font-cinzel text-xs text-[#D4AF37]/60 tracking-widest"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ॐ जय श्री राम ॐ
          </motion.p>
          <p className="font-sans text-xs text-[#F5F5DC]/30">
            © 2025 Shri Ram Mandir Trust. All rights reserved.
          </p>
          <p className="font-sans text-xs text-[#F5F5DC]/30">
            Serving Devotees Since 1975
          </p>
        </div>
      </div>
    </footer>
  );
}
