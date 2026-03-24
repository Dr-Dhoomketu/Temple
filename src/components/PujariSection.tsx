import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import TempleModel3D from "./TempleModel3D";

const pujaris = [
  {
    name: "Pandit Ramesh Sharma",
    role: "Head Priest (Mukhya Pujari)",
    experience: "35 years of devotional service",
    icon: "🙏",
    speciality: "Vedic Rituals & Havan",
  },
  {
    name: "Pandit Suresh Tiwari",
    role: "Morning Aarti Priest",
    experience: "22 years of sacred service",
    icon: "🪔",
    speciality: "Bhagwat Katha & Aarti",
  },
  {
    name: "Pandit Vikram Mishra",
    role: "Evening Ceremony Priest",
    experience: "18 years of devotional practice",
    icon: "⚘",
    speciality: "Sanskrit Shlokas & Puja",
  },
  {
    name: "Pandit Ajay Pandey",
    role: "Festival & Special Puja Priest",
    experience: "15 years of ritual mastery",
    icon: "✦",
    speciality: "Special Occasion Ceremonies",
  },
];

export default function PujariSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="temple" className="relative min-h-screen py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0303] via-[#2d0505] to-[#1a0303]" />

      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-cinzel text-xs tracking-[0.5em] text-[#D4AF37]/70 uppercase mb-3">
            ❋ Our Sacred Home ❋
          </p>
          <h2 className="font-cinzel font-bold text-3xl md:text-5xl text-[#D4AF37] gold-glow mb-4">
            The Divine Temple
          </h2>
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

        {/* Main Content: 3D + Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left: About Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="border-l-2 border-[#D4AF37]/40 pl-6">
              <h3 className="font-cinzel font-semibold text-xl text-[#D4AF37] mb-3">
                A Sacred Abode
              </h3>
              <p className="font-sans font-light text-[#F5F5DC]/70 leading-relaxed">
                Shri Ram Mandir stands as a magnificent tribute to divine architecture, adorned with intricate carvings
                and golden spires that reach toward the heavens. Every stone, every pillar tells the story of devotion
                and spiritual excellence.
              </p>
            </div>

            <div className="border-l-2 border-[#D4AF37]/40 pl-6">
              <h3 className="font-cinzel font-semibold text-xl text-[#D4AF37] mb-3">
                Living Tradition
              </h3>
              <p className="font-sans font-light text-[#F5F5DC]/70 leading-relaxed">
                Our temple has been a center of worship for over five decades, where thousands of devotees find
                solace, peace, and divine blessings. The sacred rituals performed here follow the ancient
                Vedic traditions with uncompromising devotion.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { number: "50+", label: "Years of Service" },
                { number: "5000+", label: "Daily Devotees" },
                { number: "365", label: "Days of Puja" },
              ].map((stat) => (
                <div key={stat.label} className="text-center border border-[#D4AF37]/20 rounded-sm p-4">
                  <div className="font-cinzel font-bold text-2xl text-[#D4AF37]">{stat.number}</div>
                  <div className="font-sans text-xs text-[#F5F5DC]/50 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: 3D Temple */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-80 md:h-96 relative rounded-sm overflow-hidden"
            style={{
              background: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)",
              boxShadow: "0 0 60px rgba(212,175,55,0.15), inset 0 0 60px rgba(0,0,0,0.3)",
            }}
          >
            <TempleModel3D height="100%" rotationY={-0.2} />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="font-cinzel text-xs text-[#D4AF37]/50 tracking-widest">
                ✦ Shri Ram Mandir ✦
              </p>
            </div>
          </motion.div>
        </div>

        {/* Pujaris Section */}
        <div id="pujaris">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-cinzel text-xs tracking-[0.5em] text-[#D4AF37]/70 uppercase mb-3">
              ❋ Sacred Servants ❋
            </p>
            <h2 className="font-cinzel font-bold text-3xl md:text-4xl text-[#D4AF37] gold-glow mb-4">
              Our Revered Pujaris
            </h2>
            <p className="font-sans font-light text-[#F5F5DC]/60 max-w-xl mx-auto">
              Devoted priests who have dedicated their lives to performing sacred rituals and guiding devotees on the spiritual path.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pujaris.map((pujari, i) => (
              <motion.div
                key={pujari.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div
                  className="border border-[#D4AF37]/20 p-6 text-center transition-all duration-300 group-hover:border-[#D4AF37]/60"
                  style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.04) 0%, rgba(74,4,4,0.4) 100%)",
                    boxShadow: "0 0 0 0 rgba(212,175,55,0)",
                  }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[#D4AF37]/40 flex items-center justify-center text-3xl bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 transition-colors">
                    {pujari.icon}
                  </div>
                  <h3 className="font-cinzel font-semibold text-sm text-[#D4AF37] mb-1 leading-tight">
                    {pujari.name}
                  </h3>
                  <p className="font-sans text-xs text-[#F5F5DC]/80 mb-2 font-medium">
                    {pujari.role}
                  </p>
                  <div className="h-px w-12 bg-[#D4AF37]/30 mx-auto mb-3" />
                  <p className="font-sans text-xs text-[#F5F5DC]/50 mb-2">
                    {pujari.experience}
                  </p>
                  <p className="font-sans text-xs text-[#D4AF37]/70 italic">
                    {pujari.speciality}
                  </p>
                </div>

                {/* Corner ornaments */}
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
