import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import TempleModel3D from "./TempleModel3D";
import { useTheme } from "@/context/ThemeContext";

const morningTimings = [
  { name: "Mangala Aarti",  time: "4:30 AM",  icon: "🌙", sub: "PRATAH PUJA",   description: "Dawn awakening of the deity" },
  { name: "Shringar Aarti", time: "6:00 AM",  icon: "🌸", sub: "ABHUSHAN SEVA", description: "Divine adornment ceremony" },
  { name: "Rajbhog Aarti",  time: "11:30 AM", icon: "🍯", sub: "BHOG SEVA",      description: "Mid-day royal offering" },
];

const eveningTimings = [
  { name: "Sandhya Aarti",  time: "5:30 PM",  icon: "🌅", sub: "SANDHYA PUJA",  description: "Evening twilight prayer" },
  { name: "Shayan Aarti",   time: "7:00 PM",  icon: "🪔", sub: "DEEP SEVA",      description: "Special lamp ceremony" },
  { name: "Shayan Bhog",    time: "8:30 PM",  icon: "✨", sub: "RATRI SEVA",     description: "Night rest ceremony" },
];

/* ─── Dark mode TimingCard ─── */
function TimingCard({ name, time, icon, description, delay }: { name: string; time: string; icon: string; description: string; delay: number; sub?: string }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay }}
      className="relative flex items-center gap-4 p-4 group"
      style={{ borderBottom: "1px solid rgba(212, 175, 55, 0.15)" }}>
      <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-lg diya-flicker">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-cinzel font-semibold text-sm text-[#D4AF37]">{name}</div>
        <div className="font-sans text-xs text-[#F5F5DC]/50">{description}</div>
      </div>
      <div className="text-right">
        <div className="font-cinzel font-bold text-base text-[#F5F5DC]">{time}</div>
      </div>
    </motion.div>
  );
}

/* ─── Light Mode: Temple Calendar ─── */
function LightTimingsSection({ inView }: { inView: boolean }) {
  return (
    <section id="timings" className="relative py-20 overflow-hidden" style={{
      background: "linear-gradient(160deg, #FFFBF2 0%, #FFF5E0 60%, #FFF8EE 100%)",
    }}>
      {/* Decorative top border */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: "linear-gradient(to right, transparent, #D46A30 20%, #E07B39 50%, #D46A30 80%, transparent)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <p className="font-cinzel text-xs tracking-[0.55em] uppercase mb-3" style={{ color: "#D46A30" }}>
            ❋ Daily Schedule ❋
          </p>
          <h2 className="font-cinzel font-black text-4xl md:text-6xl mb-5" style={{ color: "#7B1E14" }}>
            Puja Timings
          </h2>
          <div className="flex items-center justify-center gap-4 mb-5">
            <div style={{ height: 2, width: 80, background: "linear-gradient(to right, transparent, #D46A30)" }} />
            <span style={{ fontSize: "1.6rem" }}>🪔</span>
            <div style={{ height: 2, width: 80, background: "linear-gradient(to left, transparent, #D46A30)" }} />
          </div>
          <p className="font-sans text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: "#5C2A0E" }}>
            Come experience the divine energy of our daily aartis. Each ceremony is a sacred offering,
            performed with unwavering devotion.
          </p>
        </motion.div>

        {/* Morning + Evening cards side by side — fresh layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Morning Card */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ background: "#FFFFFF", boxShadow: "0 4px 32px rgba(180,80,0,0.1)", overflow: "hidden" }}>
            {/* Amber sunrise header */}
            <div style={{ background: "linear-gradient(135deg, #FF8C00, #E07B39, #C25B2F)", padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "2.2rem" }}>🌅</span>
                <div>
                  <div className="font-cinzel font-black text-xl" style={{ color: "#FFFBF2" }}>Morning Aarti</div>
                  <div className="font-cinzel text-xs tracking-[0.4em]" style={{ color: "rgba(255,251,242,0.7)" }}>PRABHAT PUJA</div>
                </div>
              </div>
            </div>
            {/* Timing rows */}
            <div style={{ padding: "8px 0" }}>
              {morningTimings.map((t, i) => (
                <motion.div key={t.name}
                  initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 16, padding: "14px 24px",
                    borderBottom: i < morningTimings.length - 1 ? "1px solid rgba(224,123,57,0.12)" : "none",
                  }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #FFF0D8, #FFE0BC)",
                    border: "1px solid rgba(224,123,57,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem",
                  }}>{t.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div className="font-cinzel font-bold text-sm" style={{ color: "#7B1E14" }}>{t.name}</div>
                    <div className="font-cinzel text-xs tracking-widest" style={{ color: "#D46A30", opacity: 0.8 }}>{t.sub}</div>
                    <div className="font-sans text-xs" style={{ color: "#8B4513" }}>{t.description}</div>
                  </div>
                  <div className="font-cinzel font-black text-lg" style={{ color: "#C25B2F", flexShrink: 0 }}>{t.time}</div>
                </motion.div>
              ))}
            </div>
            <div style={{ padding: "10px 24px 16px", borderTop: "1px solid rgba(224,123,57,0.1)" }}>
              <p className="font-sans text-xs italic" style={{ color: "#C25B2F" }}>* Temple opens at 4:00 AM</p>
            </div>
          </motion.div>

          {/* Evening Card */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35 }}
            style={{ background: "#FFFFFF", boxShadow: "0 4px 32px rgba(180,80,0,0.1)", overflow: "hidden" }}>
            {/* Deep saffron-crimson header */}
            <div style={{ background: "linear-gradient(135deg, #8B1A0A, #C25B2F, #D46A30)", padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "2.2rem" }}>🌙</span>
                <div>
                  <div className="font-cinzel font-black text-xl" style={{ color: "#FFFBF2" }}>Evening Aarti</div>
                  <div className="font-cinzel text-xs tracking-[0.4em]" style={{ color: "rgba(255,251,242,0.7)" }}>SANDHYA PUJA</div>
                </div>
              </div>
            </div>
            {/* Timing rows */}
            <div style={{ padding: "8px 0" }}>
              {eveningTimings.map((t, i) => (
                <motion.div key={t.name}
                  initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 16, padding: "14px 24px",
                    borderBottom: i < eveningTimings.length - 1 ? "1px solid rgba(194,91,47,0.12)" : "none",
                  }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #FFE8D8, #FFD0B8)",
                    border: "1px solid rgba(194,91,47,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem",
                  }}>{t.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div className="font-cinzel font-bold text-sm" style={{ color: "#7B1E14" }}>{t.name}</div>
                    <div className="font-cinzel text-xs tracking-widest" style={{ color: "#8B1A0A", opacity: 0.8 }}>{t.sub}</div>
                    <div className="font-sans text-xs" style={{ color: "#8B4513" }}>{t.description}</div>
                  </div>
                  <div className="font-cinzel font-black text-lg" style={{ color: "#8B1A0A", flexShrink: 0 }}>{t.time}</div>
                </motion.div>
              ))}
            </div>
            <div style={{ padding: "10px 24px 16px", borderTop: "1px solid rgba(194,91,47,0.1)" }}>
              <p className="font-sans text-xs italic" style={{ color: "#8B1A0A" }}>* Temple closes at 9:00 PM</p>
            </div>
          </motion.div>
        </div>

        {/* 3D Temple — full width warm frame */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
          style={{ background: "#FFFFFF", boxShadow: "0 4px 40px rgba(180,80,0,0.1)", overflow: "hidden", marginBottom: 24 }}>
          <div style={{ borderTop: "4px solid #E07B39" }}>
            <div className="h-72 md:h-80 relative">
              <div style={{ position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at center, rgba(255,200,100,0.12) 0%, transparent 65%)" }} />
              <TempleModel3D height="100%" rotationY={0} />
            </div>
            <div style={{ padding: "12px 24px 16px", borderTop: "1px solid rgba(224,123,57,0.12)", textAlign: "center" }}>
              <p className="font-cinzel font-bold text-xl" style={{ color: "#C25B2F", marginBottom: 2 }}>जय श्री राम</p>
              <p className="font-cinzel text-xs tracking-[0.4em]" style={{ color: "#D46A30" }}>JAI SHRI RAM</p>
            </div>
          </div>
        </motion.div>

        {/* Festival note — warm saffron banner */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            background: "linear-gradient(135deg, #FFF0D8, #FFE5C0)",
            border: "1px solid rgba(224,123,57,0.3)",
            borderLeft: "4px solid #E07B39",
            padding: "16px 24px",
          }}>
          <p className="font-cinzel text-sm font-semibold" style={{ color: "#7B1E14" }}>
            ✦ &nbsp; Special Aarti timings on festivals and auspicious occasions &nbsp; ✦
          </p>
          <p className="font-sans text-xs mt-1" style={{ color: "#8B4513" }}>
            Please contact the temple office for special ceremony bookings
          </p>
        </motion.div>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4,
        background: "linear-gradient(to right, transparent, #D46A30 20%, #E07B39 50%, #D46A30 80%, transparent)" }} />
    </section>
  );
}

/* ─── Dark Mode (original) ─── */
export default function PujaTimings() {
  const ref = useRef(null);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (isLight) return <LightTimingsSection inView={inView} />;

  return (
    <section id="timings" className="relative min-h-screen py-20 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #1a0303, #0d0101)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" style={{
        width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div ref={ref} className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <p className="font-cinzel text-xs tracking-[0.5em] text-[#D4AF37]/70 uppercase mb-3">❋ Daily Schedule ❋</p>
          <h2 className="font-cinzel font-bold text-3xl md:text-5xl text-[#D4AF37] gold-glow mb-4">Puja Timings</h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <div className="text-[#D4AF37] text-xl">🪔</div>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>
          <p className="font-sans font-light text-[#F5F5DC]/60 max-w-2xl mx-auto">
            Come experience the divine energy of our daily aartis. Each ceremony is a sacred offering,
            performed with unwavering devotion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <motion.div initial={{ opacity: 0, x: -60 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }} className="relative order-1 lg:order-1">
            <div className="border border-[#D4AF37]/20 p-6 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(26,3,3,0.6) 100%)" }}>
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/40" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]/40" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/40" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/40" />
              <div className="text-center mb-6">
                <div className="text-3xl mb-2">🌅</div>
                <h3 className="font-cinzel font-bold text-xl text-[#D4AF37]">Morning Aarti</h3>
                <p className="font-cinzel text-xs text-[#F5F5DC]/50 tracking-widest mt-1">PRABHAT PUJA</p>
                <div className="h-px w-16 bg-[#D4AF37]/30 mx-auto mt-3" />
              </div>
              <div className="space-y-1">
                {morningTimings.map((t, i) => <TimingCard key={t.name} {...t} delay={0.1 * i} />)}
              </div>
              <div className="mt-4 text-center">
                <p className="font-sans text-xs text-[#F5F5DC]/40 italic">* Temple opens at 4:00 AM</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }} className="flex flex-col items-center order-3 lg:order-2">
            <div className="w-full h-72 md:h-96 relative rounded-sm overflow-hidden mb-6"
              style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.1) 0%, transparent 70%)", boxShadow: "0 0 80px rgba(212,175,55,0.2), inset 0 0 80px rgba(0,0,0,0.5)" }}>
              <TempleModel3D height="100%" rotationY={0} />
            </div>
            <div className="text-center">
              <p className="font-cinzel text-lg text-[#D4AF37]/80 tracking-wider mb-1">जय श्री राम</p>
              <p className="font-cinzel text-xs text-[#F5F5DC]/40 tracking-[0.3em]">JAI SHRI RAM</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 60 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }} className="relative order-2 lg:order-3">
            <div className="border border-[#D4AF37]/20 p-6 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(26,3,3,0.6) 100%)" }}>
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/40" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]/40" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/40" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/40" />
              <div className="text-center mb-6">
                <div className="text-3xl mb-2">🌙</div>
                <h3 className="font-cinzel font-bold text-xl text-[#D4AF37]">Evening Aarti</h3>
                <p className="font-cinzel text-xs text-[#F5F5DC]/50 tracking-widest mt-1">SANDHYA PUJA</p>
                <div className="h-px w-16 bg-[#D4AF37]/30 mx-auto mt-3" />
              </div>
              <div className="space-y-1">
                {eveningTimings.map((t, i) => <TimingCard key={t.name} {...t} delay={0.1 * i} />)}
              </div>
              <div className="mt-4 text-center">
                <p className="font-sans text-xs text-[#F5F5DC]/40 italic">* Temple closes at 9:00 PM</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div className="mt-12 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}>
          <div className="inline-block border border-[#D4AF37]/20 px-8 py-4"
            style={{ background: "rgba(212,175,55,0.04)" }}>
            <p className="font-cinzel text-sm text-[#D4AF37]/80">
              ✦ &nbsp; Special Aarti timings on festivals and auspicious occasions &nbsp; ✦
            </p>
            <p className="font-sans text-xs text-[#F5F5DC]/50 mt-1">
              Please contact the temple office for special ceremony bookings
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
