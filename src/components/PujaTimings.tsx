import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import TempleModel3D from "./TempleModel3D";

const morningTimings = [
  { name: "Mangala Aarti", time: "4:30 AM", icon: "🌙", description: "Dawn awakening of the deity" },
  { name: "Shringar Aarti", time: "6:00 AM", icon: "🌸", description: "Divine adornment ceremony" },
  { name: "Rajbhog Aarti", time: "11:30 AM", icon: "🍯", description: "Mid-day royal offering" },
];

const eveningTimings = [
  { name: "Sandhya Aarti", time: "5:30 PM", icon: "🌅", description: "Evening twilight prayer" },
  { name: "Shayan Aarti", time: "7:00 PM", icon: "🪔", description: "Special lamp ceremony" },
  { name: "Shayan Bhog", time: "8:30 PM", icon: "✨", description: "Night rest ceremony" },
];

function TimingCard({
  name,
  time,
  icon,
  description,
  delay,
}: {
  name: string;
  time: string;
  icon: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative flex items-center gap-4 p-4 group"
      style={{ borderBottom: "1px solid rgba(212, 175, 55, 0.15)" }}
    >
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

export default function PujaTimings() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="timings" className="relative min-h-screen py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0303] to-[#0d0101]" />

      {/* Glowing center effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
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
            ❋ Daily Schedule ❋
          </p>
          <h2 className="font-cinzel font-bold text-3xl md:text-5xl text-[#D4AF37] gold-glow mb-4">
            Puja Timings
          </h2>
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

        {/* Main Layout: Timings + 3D + Timings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Morning Timings */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-1 lg:order-1"
          >
            <div
              className="border border-[#D4AF37]/20 p-6 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(26,3,3,0.6) 100%)" }}
            >
              {/* Corner ornaments */}
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
                {morningTimings.map((t, i) => (
                  <TimingCard key={t.name} {...t} delay={0.1 * i} />
                ))}
              </div>

              <div className="mt-4 text-center">
                <p className="font-sans text-xs text-[#F5F5DC]/40 italic">
                  * Temple opens at 4:00 AM
                </p>
              </div>
            </div>
          </motion.div>

          {/* Center 3D Temple */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex flex-col items-center order-3 lg:order-2"
          >
            <div
              className="w-full h-72 md:h-96 relative rounded-sm overflow-hidden mb-6"
              style={{
                background: "radial-gradient(ellipse at center, rgba(212,175,55,0.1) 0%, transparent 70%)",
                boxShadow: "0 0 80px rgba(212,175,55,0.2), inset 0 0 80px rgba(0,0,0,0.5)",
              }}
            >
              <TempleModel3D height="100%" rotationY={0} />
            </div>

            {/* Mantra text */}
            <div className="text-center">
              <p className="font-cinzel text-lg text-[#D4AF37]/80 tracking-wider mb-1">
                जय श्री राम
              </p>
              <p className="font-cinzel text-xs text-[#F5F5DC]/40 tracking-[0.3em]">
                JAI SHRI RAM
              </p>
            </div>
          </motion.div>

          {/* Evening Timings */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-2 lg:order-3"
          >
            <div
              className="border border-[#D4AF37]/20 p-6 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(26,3,3,0.6) 100%)" }}
            >
              {/* Corner ornaments */}
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
                {eveningTimings.map((t, i) => (
                  <TimingCard key={t.name} {...t} delay={0.1 * i} />
                ))}
              </div>

              <div className="mt-4 text-center">
                <p className="font-sans text-xs text-[#F5F5DC]/40 italic">
                  * Temple closes at 9:00 PM
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Special note */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div
            className="inline-block border border-[#D4AF37]/20 px-8 py-4"
            style={{ background: "rgba(212,175,55,0.04)" }}
          >
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
