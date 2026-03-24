/* Lightweight CSS/SVG temple illustration used in all non-hero sections
   to avoid spawning multiple WebGL contexts */

export default function TempleSVG({ glow = true }: { glow?: boolean }) {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{ minHeight: "260px" }}
    >
      {/* Radial glow behind SVG */}
      {glow && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(212,175,55,0.13) 0%, transparent 70%)",
          }}
        />
      )}

      <svg
        viewBox="0 0 320 340"
        className="w-full h-full"
        style={{
          maxWidth: "340px",
          maxHeight: "340px",
          filter: glow ? "drop-shadow(0 0 18px rgba(212,175,55,0.45))" : "none",
          animation: "float 5s ease-in-out infinite",
        }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a0808" />
            <stop offset="100%" stopColor="#2d0404" />
          </linearGradient>
          <linearGradient id="goldG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5E088" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9A7B1C" />
          </linearGradient>
          <radialGradient id="glowG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Glow circle */}
        <ellipse cx="160" cy="200" rx="110" ry="90" fill="url(#glowG)" />

        {/* Base steps */}
        <rect x="20"  y="315" width="280" height="10" rx="2" fill="url(#goldG)" opacity="0.9" />
        <rect x="35"  y="303" width="250" height="14" rx="2" fill="url(#goldG)" opacity="0.75" />
        <rect x="50"  y="292" width="220" height="13" rx="2" fill="#D4AF37"      opacity="0.6"  />

        {/* Main hall */}
        <rect x="70"  y="190" width="180" height="104" fill="url(#wallG)" />
        {/* Hall decorative band */}
        <rect x="70"  y="200" width="180" height="6"   fill="#D4AF37" opacity="0.35" />
        <rect x="70"  y="278" width="180" height="5"   fill="#D4AF37" opacity="0.3"  />
        {/* Pillar lines */}
        {[90,115,140,165,190,210].map(x => (
          <rect key={x} x={x} y="204" width="3" height="74" fill="#D4AF37" opacity="0.15" rx="1" />
        ))}

        {/* Arch door */}
        <path d="M140 294 L140 245 Q140 228 160 228 Q180 228 180 245 L180 294 Z"
              fill="#0d0101" />
        <path d="M143 294 L143 247 Q143 232 160 232 Q177 232 177 247 L177 294 Z"
              fill="#D4AF37" opacity="0.12" />
        {/* Door handles */}
        <circle cx="152" cy="268" r="3" fill="#D4AF37" opacity="0.7" />
        <circle cx="168" cy="268" r="3" fill="#D4AF37" opacity="0.7" />

        {/* Shikhara (main spire) */}
        <polygon points="160,18 125,130 195,130" fill="url(#goldG)" opacity="0.95" />
        <polygon points="160,40 133,130 187,130" fill="#D4AF37" opacity="0.5"  />
        {/* Shikhara rings */}
        {[60,80,100,115].map((y,i) => {
          const w = 20 + i * 12;
          return <rect key={y} x={160-w/2} y={y} width={w} height="4" rx="2" fill="#D4AF37" opacity="0.5" />;
        })}
        {/* Kalash */}
        <ellipse cx="160" cy="22" rx="8"  ry="5"  fill="url(#goldG)" />
        <rect    x="156"  y="10" width="8" height="14" fill="url(#goldG)" />
        <ellipse cx="160" cy="10" rx="5"  ry="4"  fill="#FFD700" />
        {/* Flag */}
        <line x1="160" y1="6"  x2="160" y2="14" stroke="#D4AF37" strokeWidth="1.5" />
        <polygon points="160,6 175,9 160,12" fill="#D4AF37" />

        {/* Side spires */}
        <polygon points="95,75  72,155 118,155" fill="#D4AF37" opacity="0.75" />
        <polygon points="225,75 202,155 248,155" fill="#D4AF37" opacity="0.75" />
        {/* Side spire rings */}
        {[95,110,130].map((y,i) => (
          <rect key={y} x={95-6-i*2} y={y} width={12+i*4} height="3" rx="1" fill="#D4AF37" opacity="0.4" />
        ))}
        {[95,110,130].map((y,i) => (
          <rect key={`r${y}`} x={225-6-i*2} y={y} width={12+i*4} height="3" rx="1" fill="#D4AF37" opacity="0.4" />
        ))}

        {/* Flat roof between spires */}
        <rect x="68"  y="154" width="184" height="10" rx="2" fill="#D4AF37" opacity="0.7"  />
        <rect x="68"  y="162" width="184" height="30" rx="1" fill="url(#wallG)"              />
        <rect x="68"  y="162" width="184" height="6"  rx="1" fill="#D4AF37" opacity="0.25" />

        {/* Diya glow */}
        <ellipse cx="160" cy="295" rx="18" ry="6" fill="#FFD700" opacity="0.18" style={{ animation: "divaFlicker 1.8s ease-in-out infinite" }} />
        <circle  cx="160" cy="291" r="3"   fill="#FFD700" opacity="0.7"        style={{ animation: "divaFlicker 1.8s ease-in-out infinite" }} />
      </svg>

      {/* Ground glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "4%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "55%",
          height: "20px",
          background: "radial-gradient(ellipse, rgba(212,175,55,0.35) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </div>
  );
}
