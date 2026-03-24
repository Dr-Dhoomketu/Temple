import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import TempleModel3D from "./TempleModel3D";

const trustees = [
  {
    name: "Shri Mahesh Kumar Gupta",
    position: "Chairman, Board of Trustees",
    icon: "👑",
    tenure: "Since 1995",
  },
  {
    name: "Shrimati Kamla Devi",
    position: "Secretary General",
    icon: "🌺",
    tenure: "Since 2001",
  },
  {
    name: "Dr. Sunil Kumar Agrawal",
    position: "Treasurer",
    icon: "⚘",
    tenure: "Since 2008",
  },
  {
    name: "Shri Rajesh Sharma",
    position: "Head of Religious Affairs",
    icon: "🕉️",
    tenure: "Since 2010",
  },
  {
    name: "Smt. Priya Bhattacharya",
    position: "Community Relations",
    icon: "🪷",
    tenure: "Since 2015",
  },
  {
    name: "Prof. Arun Tripathi",
    position: "Educational Programs",
    icon: "📚",
    tenure: "Since 2018",
  },
];

const donationCategories = [
  { label: "Nityaseva", amount: "₹1,001", icon: "🪔", desc: "Daily lamp lighting" },
  { label: "Bhog Seva", amount: "₹5,001", icon: "🍯", desc: "Food offering to deity" },
  { label: "Mahotsav Seva", amount: "₹11,000", icon: "🎊", desc: "Festival sponsorship" },
  { label: "Mandir Nidhi", amount: "Any Amount", icon: "🏛️", desc: "Temple development fund" },
];

export default function DonationSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="donate" className="relative min-h-screen py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0101] via-[#1a0303] to-[#0d0101]" />

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
            ❋ Divine Service ❋
          </p>
          <h2 className="font-cinzel font-bold text-3xl md:text-5xl text-[#D4AF37] gold-glow mb-4">
            Seva & Donations
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <div className="text-[#D4AF37] text-xl">🙏</div>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>
        </motion.div>

        {/* Donation + 3D Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Donation Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-8">
              <h3 className="font-cinzel font-bold text-2xl text-[#D4AF37] mb-3">
                Participate in Divine Service
              </h3>
              <p className="font-sans font-light text-[#F5F5DC]/60 leading-relaxed mb-6">
                Your generous contributions help us maintain the sanctity of this divine abode,
                conduct daily rituals, and serve thousands of devotees who come seeking blessings.
                Every offering, big or small, is a step towards divine grace.
              </p>

              {/* Donation Categories */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                {donationCategories.map((cat, i) => (
                  <motion.div
                    key={cat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
                    className="border border-[#D4AF37]/20 p-4 cursor-pointer group hover:border-[#D4AF37]/60 transition-colors"
                    style={{ background: "rgba(212,175,55,0.03)" }}
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
                    <div className="font-cinzel font-semibold text-sm text-[#D4AF37] mb-1">{cat.label}</div>
                    <div className="font-cinzel font-bold text-base text-[#F5F5DC]">{cat.amount}</div>
                    <div className="font-sans text-xs text-[#F5F5DC]/40 mt-1">{cat.desc}</div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-[#D4AF37] text-[#1a0303] font-cinzel font-bold text-sm tracking-[0.3em] uppercase hover:bg-[#F5E088] transition-colors divine-glow"
              >
                🙏 &nbsp; Donate Now &nbsp; 🙏
              </motion.button>

              <p className="font-sans text-xs text-[#F5F5DC]/40 text-center mt-3">
                All donations are tax-exempt under section 80G
              </p>
            </div>

            {/* Donation Box 3D glow */}
            <div
              className="border border-[#D4AF37]/20 p-4 text-center"
              style={{ background: "rgba(212,175,55,0.04)" }}
            >
              <motion.div
                className="text-4xl mb-2"
                animate={{ scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                💰
              </motion.div>
              <p className="font-cinzel text-sm text-[#D4AF37]">UPI: templerams@upi</p>
              <p className="font-sans text-xs text-[#F5F5DC]/40 mt-1">Temple Trust Bank Account details available at reception</p>
            </div>
          </motion.div>

          {/* Right: 3D with donation box */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-80 md:h-96 relative"
          >
            <div
              className="w-full h-full relative rounded-sm overflow-hidden"
              style={{
                background: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)",
                boxShadow: "0 0 80px rgba(212,175,55,0.15)",
              }}
            >
            <TempleModel3D height="100%" rotationY={0.3} />

              {/* Glowing donation box */}
              <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div
                  className="px-4 py-2 border border-[#D4AF37]/60 font-cinzel text-xs text-[#D4AF37] tracking-widest"
                  style={{
                    background: "rgba(212,175,55,0.15)",
                    boxShadow: "0 0 20px rgba(212,175,55,0.4)",
                  }}
                >
                  ✦ DANA PATRA ✦
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Trustees Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <p className="font-cinzel text-xs tracking-[0.5em] text-[#D4AF37]/70 uppercase mb-3">
              ❋ Guardians of Dharma ❋
            </p>
            <h2 className="font-cinzel font-bold text-3xl text-[#D4AF37] gold-glow mb-4">
              Board of Trustees
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {trustees.map((trustee, i) => (
              <motion.div
                key={trustee.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div
                  className="border border-[#D4AF37]/20 p-6 flex gap-4 items-start transition-all duration-300 group-hover:border-[#D4AF37]/50"
                  style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.04) 0%, rgba(26,3,3,0.5) 100%)" }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-2xl bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 transition-colors">
                    {trustee.icon}
                  </div>
                  <div>
                    <h3 className="font-cinzel font-semibold text-sm text-[#D4AF37] leading-tight mb-1">
                      {trustee.name}
                    </h3>
                    <p className="font-sans text-xs text-[#F5F5DC]/70 mb-2">{trustee.position}</p>
                    <p className="font-sans text-xs text-[#D4AF37]/50">{trustee.tenure}</p>
                  </div>
                </div>
                {/* Gold highlight on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ boxShadow: "0 0 20px rgba(212,175,55,0.1)", borderRadius: "inherit" }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
