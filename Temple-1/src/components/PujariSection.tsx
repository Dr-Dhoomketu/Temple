import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import TempleModel3D from "./TempleModel3D";
import { useTheme } from "@/context/ThemeContext";

const pujaris = [
  { name: "Pandit Ramesh Sharma",  role: "Head Priest (Mukhya Pujari)",      experience: "35 years of devotional service",  icon: "🙏", speciality: "Vedic Rituals & Havan" },
  { name: "Pandit Suresh Tiwari",  role: "Morning Aarti Priest",              experience: "22 years of sacred service",       icon: "🪔", speciality: "Bhagwat Katha & Aarti" },
  { name: "Pandit Vikram Mishra",  role: "Evening Ceremony Priest",           experience: "18 years of devotional practice",  icon: "⚘", speciality: "Sanskrit Shlokas & Puja" },
  { name: "Pandit Ajay Pandey",    role: "Festival & Special Puja Priest",    experience: "15 years of ritual mastery",       icon: "✦", speciality: "Special Occasion Ceremonies" },
];

const stats = [
  { number: "50+",   label: "Years of Service" },
  { number: "5000+", label: "Daily Devotees" },
  { number: "365",   label: "Days of Puja" },
];

/* ─── Light Mode: Sacred Parchment ─── */
function LightTempleSection({ inView }: { inView: boolean }) {
  return (
    <section id="temple" className="relative py-20 overflow-hidden" style={{
      background: "linear-gradient(160deg, #FFFBF2 0%, #FFF5E0 50%, #FFFBF2 100%)",
    }}>
      {/* Decorative top border */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: "linear-gradient(to right, transparent, #C25B2F 20%, #E07B39 50%, #C25B2F 80%, transparent)" }} />

      {/* Subtle lotus watermark */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        fontSize: 500, opacity: 0.025, pointerEvents: "none", zIndex: 0, lineHeight: 1, userSelect: "none" }}>
        🪷
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <p className="font-cinzel text-xs tracking-[0.55em] uppercase mb-3" style={{ color: "#C25B2F" }}>
            ❋ Our Sacred Home ❋
          </p>
          <h2 className="font-cinzel font-black text-4xl md:text-6xl mb-5" style={{ color: "#7B1E14" }}>
            The Divine Temple
          </h2>
          <div className="flex items-center justify-center gap-4 mb-5">
            <div style={{ height: 2, width: 80, background: "linear-gradient(to right, transparent, #E07B39)" }} />
            <span style={{ color: "#E07B39", fontSize: "1.4rem" }}>ॐ</span>
            <div style={{ height: 2, width: 80, background: "linear-gradient(to left, transparent, #E07B39)" }} />
          </div>
          <p className="font-sans font-light text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: "#5C2A0E" }}>
            Built in the glorious tradition of ancient Vedic architecture, our temple is a beacon of divine light,
            welcoming all devotees into the presence of Lord Shri Ram.
          </p>
        </motion.div>

        {/* Main Content: About Text + 3D Temple */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }} className="space-y-8">
            {[
              { title: "A Sacred Abode", body: "Shri Ram Mandir stands as a magnificent tribute to divine architecture, adorned with intricate carvings and golden spires that reach toward the heavens. Every stone, every pillar tells the story of devotion and spiritual excellence." },
              { title: "Living Tradition",  body: "Our temple has been a center of worship for over five decades, where thousands of devotees find solace, peace, and divine blessings. The sacred rituals performed here follow the ancient Vedic traditions with uncompromising devotion." },
            ].map(({ title, body }) => (
              <div key={title} style={{ borderLeft: "4px solid #E07B39", paddingLeft: 20 }}>
                <h3 className="font-cinzel font-bold text-xl mb-2" style={{ color: "#7B1E14" }}>{title}</h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: "#5C2A0E" }}>{body}</p>
              </div>
            ))}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {stats.map((s) => (
                <div key={s.label} style={{
                  background: "#FFFFFF", borderTop: "3px solid #E07B39",
                  padding: "16px 8px", textAlign: "center",
                  boxShadow: "0 2px 16px rgba(180,80,0,0.1)",
                }}>
                  <div className="font-cinzel font-black text-2xl" style={{ color: "#C25B2F" }}>{s.number}</div>
                  <div className="font-sans text-xs mt-1" style={{ color: "#8B4513" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 3D Temple — warm bright frame */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-80 md:h-96 relative overflow-hidden"
            style={{ border: "2px solid rgba(224,123,57,0.35)", boxShadow: "0 4px 40px rgba(180,80,0,0.12)" }}>
            <div style={{ position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at center, rgba(255,200,100,0.15) 0%, transparent 70%)" }} />
            <TempleModel3D height="100%" rotationY={-0.2} />
            <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center" }}>
              <span className="font-cinzel text-xs tracking-widest" style={{ color: "#C25B2F" }}>✦ Shri Ram Mandir ✦</span>
            </div>
          </motion.div>
        </div>

        {/* Pujaris — horizontal cards */}
        <div id="pujaris">
          <motion.div className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.7 }}>
            <p className="font-cinzel text-xs tracking-[0.55em] uppercase mb-3" style={{ color: "#C25B2F" }}>
              ❋ Sacred Servants ❋
            </p>
            <h2 className="font-cinzel font-black text-3xl md:text-4xl mb-4" style={{ color: "#7B1E14" }}>
              Our Revered Pujaris
            </h2>
            <div style={{ height: 2, width: 80, background: "linear-gradient(to right, transparent, #E07B39, transparent)", margin: "0 auto 16px" }} />
            <p className="font-sans text-sm max-w-xl mx-auto" style={{ color: "#5C2A0E" }}>
              Devoted priests who have dedicated their lives to performing sacred rituals and guiding devotees on the spiritual path.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {pujaris.map((p, i) => (
              <motion.div key={p.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(180,80,0,0.18)" }}
                style={{
                  background: "#FFFFFF", borderRadius: 2, borderLeft: "5px solid #E07B39",
                  display: "flex", alignItems: "center", gap: 16, padding: 20,
                  boxShadow: "0 2px 16px rgba(180,80,0,0.09)", transition: "all 0.25s ease",
                }}>
                <div style={{
                  width: 60, height: 60, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #FFF0D8, #FFE0C0)",
                  border: "2px solid rgba(224,123,57,0.5)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem",
                }}>
                  {p.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-cinzel font-bold text-sm" style={{ color: "#7B1E14", marginBottom: 2 }}>{p.name}</div>
                  <div className="font-sans text-xs font-semibold" style={{ color: "#C25B2F", marginBottom: 6 }}>{p.role}</div>
                  <div style={{ height: 1, background: "rgba(224,123,57,0.2)", marginBottom: 6 }} />
                  <div className="font-sans text-xs" style={{ color: "#8B4513", marginBottom: 2 }}>{p.experience}</div>
                  <div className="font-sans text-xs italic" style={{ color: "#C25B2F" }}>{p.speciality}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4,
        background: "linear-gradient(to right, transparent, #C25B2F 20%, #E07B39 50%, #C25B2F 80%, transparent)" }} />
    </section>
  );
}

/* ─── Dark Mode (original) ─── */
export default function PujariSection() {
  const ref = useRef(null);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const inView = useInView(ref, { once: true, margin: "-100px" });

  if (isLight) return <LightTempleSection inView={inView} />;

  return (
    <section id="temple" className="relative min-h-screen py-20 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #1a0303, #2d0505, #1a0303)" }} />
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div ref={ref} className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <p className="font-cinzel text-xs tracking-[0.5em] text-[#D4AF37]/70 uppercase mb-3">❋ Our Sacred Home ❋</p>
          <h2 className="font-cinzel font-bold text-3xl md:text-5xl text-[#D4AF37] gold-glow mb-4">The Divine Temple</h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <svg viewBox="0 0 32 32" width="24" height="24" fill="none" aria-label="Om">
              <text x="50%" y="80%" textAnchor="middle" fontSize="22" fontFamily="serif" fill="#D4AF37" fontWeight="bold">ॐ</text>
            </svg>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>
          <p className="font-sans font-light text-[#F5F5DC]/60 max-w-2xl mx-auto leading-relaxed">
            Built in the glorious tradition of ancient Vedic architecture, our temple is a beacon of divine light,
            welcoming all devotees into the presence of Lord Shri Ram.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }} className="space-y-6">
            <div className="border-l-2 border-[#D4AF37]/40 pl-6">
              <h3 className="font-cinzel font-semibold text-xl text-[#D4AF37] mb-3">A Sacred Abode</h3>
              <p className="font-sans font-light text-[#F5F5DC]/70 leading-relaxed">
                Shri Ram Mandir stands as a magnificent tribute to divine architecture, adorned with intricate carvings
                and golden spires that reach toward the heavens. Every stone, every pillar tells the story of devotion
                and spiritual excellence.
              </p>
            </div>
            <div className="border-l-2 border-[#D4AF37]/40 pl-6">
              <h3 className="font-cinzel font-semibold text-xl text-[#D4AF37] mb-3">Living Tradition</h3>
              <p className="font-sans font-light text-[#F5F5DC]/70 leading-relaxed">
                Our temple has been a center of worship for over five decades, where thousands of devotees find
                solace, peace, and divine blessings. The sacred rituals performed here follow the ancient
                Vedic traditions with uncompromising devotion.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center border border-[#D4AF37]/20 rounded-sm p-4">
                  <div className="font-cinzel font-bold text-2xl text-[#D4AF37]">{stat.number}</div>
                  <div className="font-sans text-xs text-[#F5F5DC]/50 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-80 md:h-96 relative rounded-sm overflow-hidden"
            style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)", boxShadow: "0 0 60px rgba(212,175,55,0.15), inset 0 0 60px rgba(0,0,0,0.3)" }}>
            <TempleModel3D height="100%" rotationY={-0.2} />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="font-cinzel text-xs text-[#D4AF37]/50 tracking-widest">✦ Shri Ram Mandir ✦</p>
            </div>
          </motion.div>
        </div>

        <div id="pujaris">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.7 }}>
            <p className="font-cinzel text-xs tracking-[0.5em] text-[#D4AF37]/70 uppercase mb-3">❋ Sacred Servants ❋</p>
            <h2 className="font-cinzel font-bold text-3xl md:text-4xl text-[#D4AF37] gold-glow mb-4">Our Revered Pujaris</h2>
            <p className="font-sans font-light text-[#F5F5DC]/60 max-w-xl mx-auto">
              Devoted priests who have dedicated their lives to performing sacred rituals and guiding devotees on the spiritual path.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pujaris.map((pujari, i) => (
              <motion.div key={pujari.name}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }} className="relative group">
                <div className="border border-[#D4AF37]/20 p-6 text-center transition-all duration-300 group-hover:border-[#D4AF37]/60"
                  style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.04) 0%, rgba(74,4,4,0.4) 100%)" }}>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[#D4AF37]/40 flex items-center justify-center text-3xl bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 transition-colors">
                    {pujari.icon}
                  </div>
                  <h3 className="font-cinzel font-semibold text-sm text-[#D4AF37] mb-1 leading-tight">{pujari.name}</h3>
                  <p className="font-sans text-xs text-[#F5F5DC]/80 mb-2 font-medium">{pujari.role}</p>
                  <div className="h-px w-12 bg-[#D4AF37]/30 mx-auto mb-3" />
                  <p className="font-sans text-xs text-[#F5F5DC]/50 mb-2">{pujari.experience}</p>
                  <p className="font-sans text-xs text-[#D4AF37]/70 italic">{pujari.speciality}</p>
                </div>
                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#D4AF37]/30" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#D4AF37]/30" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#D4AF37]/30" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#D4AF37]/30" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
