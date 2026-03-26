import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { useLocation } from "wouter";

const trustees = [
  { name: "Shri Mahesh Kumar Gupta", position: "Chairman, Board of Trustees", icon: "👑", tenure: "Since 1995" },
  { name: "Shrimati Kamla Devi", position: "Secretary General", icon: "🌺", tenure: "Since 2001" },
  { name: "Dr. Sunil Kumar Agrawal", position: "Treasurer", icon: "⚘", tenure: "Since 2008" },
  { name: "Shri Rajesh Sharma", position: "Head of Religious Affairs", icon: "🕉️", tenure: "Since 2010" },
  { name: "Smt. Priya Bhattacharya", position: "Community Relations", icon: "🪷", tenure: "Since 2015" },
  { name: "Prof. Arun Tripathi", position: "Educational Programs", icon: "📚", tenure: "Since 2018" },
];

const donationCategories = [
  { label: "Nityaseva", amount: "₹1,001", icon: "🪔", desc: "Daily lamp lighting" },
  { label: "Bhog Seva", amount: "₹5,001", icon: "🍯", desc: "Food offering to deity" },
  { label: "Mahotsav Seva", amount: "₹11,000", icon: "🎊", desc: "Festival sponsorship" },
  { label: "Mandir Nidhi", amount: "Any Amount", icon: "🏛️", desc: "Temple development fund" },
];

const impacts = [
  {
    icon: "🌾",
    label: "Annadaan",
    sub: "Sacred Food Offering",
    desc: "Every day, your seva feeds over 500 families — the highest dharma.",
    stat: "500+",
    statLabel: "Meals Daily",
    color: "#D4AF37",
  },
  {
    icon: "🏥",
    label: "Chikitsa Seva",
    sub: "Healing by Grace",
    desc: "Free medical camps bring divine healing to those who cannot afford care.",
    stat: "12",
    statLabel: "Camps Per Year",
    color: "#c8a84b",
  },
  {
    icon: "📖",
    label: "Shiksha Daan",
    sub: "Light of Knowledge",
    desc: "Illuminate young minds. Scholarships granted to 200 deserving children.",
    stat: "200",
    statLabel: "Scholarships",
    color: "#D4AF37",
  },
  {
    icon: "🛕",
    label: "Mandir Seva",
    sub: "House of the Divine",
    desc: "Keep the sacred flame alive — rituals, upkeep, and daily worship.",
    stat: "365",
    statLabel: "Days a Year",
    color: "#c8a84b",
  },
];

// Floating particles
const particles = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1.5 + Math.random() * 3,
  delay: Math.random() * 6,
  duration: 4 + Math.random() * 5,
}));

function AnimatedStat({ value, label, inView }: { value: string; label: string; inView: boolean }) {
  const [display, setDisplay] = useState("0");
  const numericValue = parseInt(value.replace(/\D/g, ""));

  useEffect(() => {
    if (!inView || isNaN(numericValue)) { setDisplay(value); return; }
    const controls = animate(0, numericValue, {
      duration: 2.2,
      ease: "easeOut",
      onUpdate(v) { setDisplay(Math.round(v).toLocaleString() + (value.includes("+") ? "+" : "")); },
    });
    return controls.stop;
  }, [inView]);

  return (
    <div className="text-center">
      <div className="font-cinzel font-bold text-3xl text-[#D4AF37]" style={{ textShadow: "0 0 20px rgba(212,175,55,0.6)" }}>
        {display}
      </div>
      <div className="font-cinzel text-[10px] tracking-widest text-[#D4AF37]/60 uppercase mt-1">{label}</div>
    </div>
  );
}

function LotusBloom({ inView }: { inView: boolean }) {
  const outerPetals = Array.from({ length: 8 }, (_, i) => i * 45);
  const innerPetals = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5);
  const tinyPetals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const rays = Array.from({ length: 16 }, (_, i) => i * 22.5);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 360, height: 360 }}>

      {/* Multi-layer aura */}
      {[1, 1.25, 1.55].map((scale, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 280, height: 280,
            background: "radial-gradient(ellipse, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.04) 55%, transparent 75%)",
          }}
          animate={{ scale: [scale, scale * 1.1, scale], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 3.5 + i * 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
        />
      ))}

      {/* Ripple rings from center */}
      {[0, 1.2, 2.4].map((delay, i) => (
        <motion.div
          key={`ripple-${i}`}
          className="absolute rounded-full pointer-events-none border border-[#D4AF37]"
          style={{ width: 60, height: 60 }}
          animate={{
            scale: [1, 4.2],
            opacity: [0.55, 0],
          }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeOut", delay }}
        />
      ))}

      {/* Mandala rings */}
      <svg className="absolute" width="360" height="360" viewBox="0 0 360 360">
        <motion.circle
          cx="180" cy="180" r="168"
          stroke="#D4AF37" strokeWidth="0.6" fill="none" strokeOpacity="0.18"
          strokeDasharray="5 9"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "180px 180px" }}
        />
        <motion.circle
          cx="180" cy="180" r="145"
          stroke="#D4AF37" strokeWidth="0.5" fill="none" strokeOpacity="0.12"
          strokeDasharray="2 14"
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "180px 180px" }}
        />
        <motion.circle
          cx="180" cy="180" r="108"
          stroke="#F5E088" strokeWidth="0.4" fill="none" strokeOpacity="0.1"
          strokeDasharray="8 5"
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "180px 180px" }}
        />
        {outerPetals.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <motion.line
              key={i}
              x1={180 + Math.cos(rad) * 95}
              y1={180 + Math.sin(rad) * 95}
              x2={180 + Math.cos(rad) * 168}
              y2={180 + Math.sin(rad) * 168}
              stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.15"
              animate={{ strokeOpacity: [0.05, 0.3, 0.05] }}
              transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.22 }}
            />
          );
        })}
      </svg>

      {/* SVG Lotus */}
      <svg width="300" height="300" viewBox="0 0 300 300" className="absolute">
        <defs>
          <radialGradient id="petalGrad" cx="50%" cy="80%" r="70%">
            <stop offset="0%" stopColor="#FFF5CC" stopOpacity="0.98" />
            <stop offset="40%" stopColor="#F5E088" stopOpacity="0.92" />
            <stop offset="75%" stopColor="#D4AF37" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#8B6220" stopOpacity="0.55" />
          </radialGradient>
          <radialGradient id="innerPetalGrad" cx="50%" cy="65%" r="70%">
            <stop offset="0%" stopColor="#FFFDE0" stopOpacity="1" />
            <stop offset="55%" stopColor="#F0D060" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#C8A020" stopOpacity="0.65" />
          </radialGradient>
          <radialGradient id="centerGrad" cx="40%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#FFFDE0" />
            <stop offset="65%" stopColor="#F5E088" />
            <stop offset="100%" stopColor="#D4AF37" />
          </radialGradient>
          <filter id="petalGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="centerGlow">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="rayGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Light rays from center (behind everything) */}
        <motion.g
          style={{ transformOrigin: "150px 150px" }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {rays.map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <motion.line
                key={`ray-${i}`}
                x1={150 + Math.cos(rad) * 18}
                y1={150 + Math.sin(rad) * 18}
                x2={150 + Math.cos(rad) * (i % 2 === 0 ? 95 : 72)}
                y2={150 + Math.sin(rad) * (i % 2 === 0 ? 95 : 72)}
                stroke="#F5E088"
                strokeWidth={i % 2 === 0 ? 1.2 : 0.6}
                filter="url(#rayGlow)"
                animate={{ strokeOpacity: [0.08, 0.28, 0.08] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
              />
            );
          })}
        </motion.g>

        {/* Outer petals — slow clockwise rotation */}
        <motion.g
          style={{ transformOrigin: "150px 150px" }}
          animate={inView ? { rotate: [0, 360] } : {}}
          transition={{ duration: 70, repeat: Infinity, ease: "linear", delay: 1.5 }}
        >
          {outerPetals.map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 150 + Math.cos(rad) * 72;
            const cy = 150 + Math.sin(rad) * 72;
            return (
              <motion.ellipse
                key={`outer-${i}`}
                cx={cx} cy={cy}
                rx="28" ry="52"
                fill="url(#petalGrad)"
                style={{ transformOrigin: `${cx}px ${cy}px`, rotate: angle + 90 }}
                filter="url(#petalGlow)"
                initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
                animate={inView ? {
                  scaleX: [0, 1, 1],
                  scaleY: [0, 1, 1],
                  opacity: [0, 1, 1],
                } : {}}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.08, ease: [0.34, 1.56, 0.64, 1], times: [0, 0.7, 1] }}
              />
            );
          })}
        </motion.g>

        {/* Inner petals — slow counter-rotation */}
        <motion.g
          style={{ transformOrigin: "150px 150px" }}
          animate={inView ? { rotate: [0, -360] } : {}}
          transition={{ duration: 55, repeat: Infinity, ease: "linear", delay: 1.8 }}
        >
          {innerPetals.map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 150 + Math.cos(rad) * 48;
            const cy = 150 + Math.sin(rad) * 48;
            return (
              <motion.ellipse
                key={`inner-${i}`}
                cx={cx} cy={cy}
                rx="18" ry="38"
                fill="url(#innerPetalGrad)"
                style={{ transformOrigin: `${cx}px ${cy}px`, rotate: angle + 90 }}
                filter="url(#petalGlow)"
                initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
                animate={inView ? { scaleX: 1, scaleY: 1, opacity: 1 } : {}}
                transition={{ duration: 1.0, delay: 0.8 + i * 0.07, ease: [0.34, 1.56, 0.64, 1] }}
              />
            );
          })}
        </motion.g>

        {/* Tiny center petals — gentle breathing rotation */}
        <motion.g
          style={{ transformOrigin: "150px 150px" }}
          animate={inView ? { rotate: [0, 360] } : {}}
          transition={{ duration: 38, repeat: Infinity, ease: "linear", delay: 2 }}
        >
          {tinyPetals.map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 150 + Math.cos(rad) * 26;
            const cy = 150 + Math.sin(rad) * 26;
            return (
              <motion.ellipse
                key={`tiny-${i}`}
                cx={cx} cy={cy}
                rx="8" ry="20"
                fill="#FFF5CC"
                style={{ transformOrigin: `${cx}px ${cy}px`, rotate: angle + 90 }}
                initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
                animate={inView ? { scaleX: 1, scaleY: 1, opacity: [0, 0.9, 0.75, 0.9] } : {}}
                transition={{
                  duration: 0.8,
                  delay: 1.3 + i * 0.04,
                  ease: [0.34, 1.56, 0.64, 1],
                  opacity: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 + i * 0.1 },
                }}
              />
            );
          })}
        </motion.g>

        {/* Center glow base */}
        <motion.circle
          cx="150" cy="150" r="26"
          fill="url(#centerGrad)"
          filter="url(#centerGlow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? {
            scale: [0, 1, 1],
            opacity: [0, 1, 1],
            r: [26, 26, 30, 26],
          } : {}}
          transition={{
            scale: { duration: 0.8, delay: 1.7, ease: [0.34, 1.56, 0.64, 1] },
            opacity: { duration: 0.8, delay: 1.7 },
            r: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2.5 },
          }}
          style={{ transformOrigin: "150px 150px" }}
        />

        {/* Center burst flash */}
        <motion.circle
          cx="150" cy="150" r="10"
          fill="white"
          animate={{ r: [10, 22, 10], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 2 }}
          style={{ transformOrigin: "150px 150px" }}
        />

        {/* OM */}
        <motion.text
          x="150" y="157"
          textAnchor="middle"
          fontSize="17"
          fill="#3a1e06"
          fontFamily="serif"
          fontWeight="bold"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 2.1, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ transformOrigin: "150px 150px" }}
        >
          ॐ
        </motion.text>
      </svg>

      {/* Dual orbit rings of sparkles */}
      {[
        { r: 148, count: 6, size: 6, duration: 10, color: "#F5E088" },
        { r: 118, count: 4, size: 4, duration: 16, color: "#D4AF37", reverse: true },
      ].map((orbit, oi) =>
        Array.from({ length: orbit.count }, (_, i) => {
          const startAngle = (360 / orbit.count) * i;
          const rad = (startAngle * Math.PI) / 180;
          return (
            <motion.div
              key={`orbit-${oi}-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: orbit.size, height: orbit.size,
                background: orbit.color,
                boxShadow: `0 0 ${orbit.size * 2}px ${orbit.color}`,
                top: "50%",
                left: "50%",
                marginTop: -orbit.size / 2,
                marginLeft: -orbit.size / 2,
              }}
              animate={{
                x: [
                  Math.cos(rad) * orbit.r,
                  Math.cos(rad + Math.PI) * orbit.r,
                  Math.cos(rad + Math.PI * 2) * orbit.r,
                ],
                y: [
                  Math.sin(rad) * orbit.r,
                  Math.sin(rad + Math.PI) * orbit.r,
                  Math.sin(rad + Math.PI * 2) * orbit.r,
                ],
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.4, 0.8],
              }}
              transition={{
                duration: orbit.duration + i * 1.2,
                repeat: Infinity,
                ease: "linear",
                delay: i * (orbit.duration / orbit.count),
              }}
            />
          );
        })
      )}

      {/* Rising light motes from lotus */}
      {Array.from({ length: 7 }, (_, i) => (
        <motion.div
          key={`mote-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 3 + (i % 3),
            height: 3 + (i % 3),
            background: "#F5E088",
            boxShadow: "0 0 8px #D4AF37",
            left: `${38 + i * 4}%`,
            bottom: "30%",
          }}
          animate={{ y: [0, -120 - i * 15], opacity: [0, 0.9, 0], scale: [0.5, 1, 0.2] }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.9,
          }}
        />
      ))}
    </div>
  );
}

export default function DonationSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [, navigate] = useLocation();

  return (
    <section id="donate" className="relative py-24 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080101] via-[#120202] to-[#060101]" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: "#D4AF37",
              boxShadow: `0 0 ${p.size * 3}px rgba(212,175,55,0.8)`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 0.7, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
        >
          <p className="font-cinzel text-[10px] tracking-[0.6em] text-[#D4AF37]/60 uppercase mb-4">
            ✦ &nbsp; Your Offering, Their Miracle &nbsp; ✦
          </p>
          <h2
            className="font-cinzel font-bold text-4xl md:text-6xl text-[#D4AF37] mb-6"
            style={{ textShadow: "0 0 60px rgba(212,175,55,0.4), 0 0 120px rgba(212,175,55,0.15)" }}
          >
            Seva & Donations
          </h2>
          <p className="font-sans font-light text-[#F5F5DC]/45 max-w-lg mx-auto text-sm leading-loose tracking-wide">
            A single offering from your heart sets a thousand divine acts in motion.
          </p>
          <div className="flex items-center justify-center gap-5 mt-8">
            <div className="h-px flex-1 max-w-[120px]" style={{ background: "linear-gradient(to right, transparent, #D4AF37)" }} />
            <motion.div
              className="text-[#D4AF37] text-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              🪷
            </motion.div>
            <div className="h-px flex-1 max-w-[120px]" style={{ background: "linear-gradient(to left, transparent, #D4AF37)" }} />
          </div>
        </motion.div>

        {/* MAIN GRID: Impact | Lotus | Donate */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center mb-24">

          {/* Left: Impact pillars */}
          <div className="flex flex-col gap-5">
            {impacts.slice(0, 2).map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -60 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4 + i * 0.2 }}
                className="group relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.07) 0%, rgba(212,175,55,0.02) 100%)",
                  border: "1px solid rgba(212,175,55,0.2)",
                }}
              >
                {/* Left glow bar */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-0.5"
                  style={{ background: "linear-gradient(to bottom, transparent, #D4AF37, transparent)" }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8 }}
                />
                <div className="px-6 py-5">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="text-3xl mt-0.5 shrink-0"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div className="flex-1">
                      <p className="font-cinzel font-bold text-sm text-[#D4AF37] mb-0.5">{item.label}</p>
                      <p className="font-cinzel text-[9px] tracking-widest text-[#D4AF37]/50 uppercase mb-2">{item.sub}</p>
                      <p className="font-sans text-[11px] text-[#F5F5DC]/50 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#D4AF37]/10 flex justify-between items-center">
                    <AnimatedStat value={item.stat} label={item.statLabel} inView={inView} />
                    <motion.div
                      className="text-[#D4AF37]/30 text-3xl font-cinzel"
                      animate={{ opacity: [0.2, 0.6, 0.2] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      ❋
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center: Lotus */}
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.34, 1.2, 0.64, 1] }}
          >
            <LotusBloom inView={inView} />

            {/* Below lotus: tagline */}
            <motion.div
              className="text-center mt-4"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 2.2, duration: 1 }}
            >
              <p
                className="font-cinzel text-xs tracking-[0.4em] text-[#D4AF37]/70 uppercase"
                style={{ textShadow: "0 0 20px rgba(212,175,55,0.4)" }}
              >
                Punya Kamal
              </p>
              <p className="font-sans text-[10px] text-[#F5F5DC]/30 mt-1">Sacred Lotus of Merit</p>
            </motion.div>
          </motion.div>

          {/* Right: Impact pillars */}
          <div className="flex flex-col gap-5">
            {impacts.slice(2, 4).map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 60 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4 + i * 0.2 }}
                className="group relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.07) 0%, rgba(212,175,55,0.02) 100%)",
                  border: "1px solid rgba(212,175,55,0.2)",
                }}
              >
                <motion.div
                  className="absolute right-0 top-0 bottom-0 w-0.5"
                  style={{ background: "linear-gradient(to bottom, transparent, #D4AF37, transparent)" }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8 + 0.4 }}
                />
                <div className="px-6 py-5">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="text-3xl mt-0.5 shrink-0"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 + 1 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div className="flex-1">
                      <p className="font-cinzel font-bold text-sm text-[#D4AF37] mb-0.5">{item.label}</p>
                      <p className="font-cinzel text-[9px] tracking-widest text-[#D4AF37]/50 uppercase mb-2">{item.sub}</p>
                      <p className="font-sans text-[11px] text-[#F5F5DC]/50 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#D4AF37]/10 flex justify-between items-center">
                    <AnimatedStat value={item.stat} label={item.statLabel} inView={inView} />
                    <motion.div
                      className="text-[#D4AF37]/30 text-3xl font-cinzel"
                      animate={{ opacity: [0.2, 0.6, 0.2] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    >
                      ❋
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Donation Options */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mb-20"
        >
          {/* Divider */}
          <div className="flex items-center gap-6 mb-12">
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.4))" }} />
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-[#D4AF37]/60 uppercase whitespace-nowrap">
              ✦ Choose Your Seva ✦
            </p>
            <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(212,175,55,0.4))" }} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {donationCategories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group cursor-pointer relative overflow-hidden text-center"
                style={{
                  background: "linear-gradient(160deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 100%)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  padding: "24px 16px",
                }}
              >
                {/* Hover shine */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, transparent 60%)" }}
                />
                {/* Top glow line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(to right, transparent, #D4AF37, transparent)" }}
                />
                <motion.div
                  className="text-3xl mb-3"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                >
                  {cat.icon}
                </motion.div>
                <p className="font-cinzel font-semibold text-xs text-[#D4AF37] tracking-wide mb-2">{cat.label}</p>
                <p
                  className="font-cinzel font-bold text-lg text-[#F5F5DC] mb-2"
                  style={{ textShadow: "0 0 15px rgba(212,175,55,0.3)" }}
                >
                  {cat.amount}
                </p>
                <p className="font-sans text-[10px] text-[#F5F5DC]/35">{cat.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(212,175,55,0.5)" }}
              whileTap={{ scale: 0.97 }}
              className="px-12 py-4 font-cinzel font-bold text-sm tracking-[0.4em] uppercase text-[#1a0303]"
              onClick={() => navigate("/donate")}
              style={{
                background: "linear-gradient(135deg, #F5E088, #D4AF37, #c8a84b)",
                minWidth: 260,
              }}
            >
              🙏 &nbsp; Offer Your Seva
            </motion.button>
            <div className="text-center">
              <p className="font-cinzel text-xs text-[#D4AF37]/70">UPI: templerams@upi</p>
              <p className="font-sans text-[10px] text-[#F5F5DC]/30 mt-1">Tax exempt under Section 80G</p>
            </div>
          </div>
        </motion.div>

        {/* Trustees */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-6 mb-12">
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.4))" }} />
            <div className="text-center">
              <p className="font-cinzel text-[10px] tracking-[0.5em] text-[#D4AF37]/60 uppercase">❋ Guardians of Dharma ❋</p>
              <h2 className="font-cinzel font-bold text-2xl text-[#D4AF37] mt-1" style={{ textShadow: "0 0 30px rgba(212,175,55,0.3)" }}>
                Board of Trustees
              </h2>
            </div>
            <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(212,175,55,0.4))" }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trustees.map((trustee, i) => (
              <motion.div
                key={trustee.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(26,3,3,0.6) 100%)",
                  border: "1px solid rgba(212,175,55,0.15)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 60%)" }}
                />
                <div className="relative p-5 flex gap-4 items-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border border-[#D4AF37]/25 flex items-center justify-center text-xl bg-[#D4AF37]/08 group-hover:border-[#D4AF37]/50 transition-colors">
                    {trustee.icon}
                  </div>
                  <div>
                    <h3 className="font-cinzel font-semibold text-xs text-[#D4AF37] leading-snug mb-1">{trustee.name}</h3>
                    <p className="font-sans text-[10px] text-[#F5F5DC]/55 mb-1">{trustee.position}</p>
                    <p className="font-sans text-[10px] text-[#D4AF37]/40">{trustee.tenure}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
