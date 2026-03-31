import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

const sevaOptions = [
  {
    label: "Nityaseva", amount: 1001, icon: "🪔", desc: "Daily lamp lighting", tag: "Eternal Light",
    accent: "#B8860B", accentLight: "#FFD700",
    bg: "linear-gradient(135deg,#FFFBEA,#FFF3C4,#FFE680)",
    cardBg: "linear-gradient(135deg,#FFFDF0,#FFF8D0)",
    border: "rgba(184,134,11,0.45)", glow: "rgba(255,215,0,0.5)", animationType: "diyas",
  },
  {
    label: "Bhog Seva", amount: 5001, icon: "🍯", desc: "Food offering to deity", tag: "Sacred Offering",
    accent: "#8B4513", accentLight: "#D2691E",
    bg: "linear-gradient(135deg,#FFF8F0,#FFE8CC,#FFD4A0)",
    cardBg: "linear-gradient(135deg,#FFFAF5,#FFF0E0)",
    border: "rgba(139,69,19,0.4)", glow: "rgba(210,105,30,0.4)", animationType: "laddoos",
  },
  {
    label: "Mahotsav Seva", amount: 11000, icon: "🎊", desc: "Festival sponsorship", tag: "Divine Celebration",
    accent: "#7B2D8B", accentLight: "#C084FC",
    bg: "linear-gradient(135deg,#FDF4FF,#F3E8FF,#E9D5FF)",
    cardBg: "linear-gradient(135deg,#FEF9FF,#F5EEFF)",
    border: "rgba(123,45,139,0.4)", glow: "rgba(192,132,252,0.45)", animationType: "fireworks",
  },
  {
    label: "Mandir Nidhi", amount: 0, icon: "🏛️", desc: "Temple development fund", tag: "Build the Temple",
    accent: "#1E40AF", accentLight: "#60A5FA",
    bg: "linear-gradient(135deg,#EFF6FF,#DBEAFE,#BFDBFE)",
    cardBg: "linear-gradient(135deg,#F5F9FF,#EBF4FF)",
    border: "rgba(30,64,175,0.35)", glow: "rgba(96,165,250,0.4)", animationType: "temple",
  },
  {
    label: "Annadaan", amount: 2100, icon: "🌾", desc: "Free food for the poor", tag: "Feed the Hungry",
    accent: "#166534", accentLight: "#4ADE80",
    bg: "linear-gradient(135deg,#F0FDF4,#DCFCE7,#BBF7D0)",
    cardBg: "linear-gradient(135deg,#F5FFF8,#EDFFF3)",
    border: "rgba(22,101,52,0.35)", glow: "rgba(74,222,128,0.4)", animationType: "bowl",
  },
  {
    label: "Chikitsa Seva", amount: 3100, icon: "🏥", desc: "Medical aid camp", tag: "Healing Hands",
    accent: "#0F766E", accentLight: "#2DD4BF",
    bg: "linear-gradient(135deg,#F0FDFA,#CCFBF1,#99F6E4)",
    cardBg: "linear-gradient(135deg,#F5FFFE,#EDFFFE)",
    border: "rgba(15,118,110,0.35)", glow: "rgba(45,212,191,0.4)", animationType: "healing",
  },
];

const paymentMethods = [
  { id: "upi", label: "UPI", icon: "📱" },
  { id: "card", label: "Card", icon: "💳" },
  { id: "netbanking", label: "Net Banking", icon: "🏦" },
  { id: "cash", label: "Cash / DD", icon: "💵" },
];

type FormState = {
  name: string; email: string; mobile: string;
  seva_type: string; amount: string; customAmount: string; payment_method: string;
};
type Status = "idle" | "submitting" | "success" | "error";

const DEFAULT_SEVA = {
  accent: "#B8860B", accentLight: "#FFD700",
  bg: "linear-gradient(135deg,#FFFBEA,#FFF8D0)",
  cardBg: "linear-gradient(135deg,#FFFDF5,#FFF8E0)",
  border: "rgba(184,134,11,0.3)", glow: "rgba(212,175,55,0.3)",
};

/* ── Diya Animation: realistic oil diyas arranged in a mandala ── */
function DiyaAnimation() {
  // 3 concentric rings of diyas
  const rings = [
    { count: 6, r: 52, size: 28 },
    { count: 10, r: 88, size: 22 },
    { count: 14, r: 124, size: 18 },
  ];
  const allDiyas = rings.flatMap((ring, ri) =>
    Array.from({ length: ring.count }, (_, i) => ({
      angle: (360 / ring.count) * i + ri * 8,
      r: ring.r, size: ring.size,
      delay: ri * 0.4 + i * (0.8 / ring.count),
      flickerDur: 1.2 + Math.random() * 0.8,
      flickerDelay: Math.random() * 2,
    }))
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ minHeight: 200 }}>
      {/* Warm ambient glow */}
      <div className="absolute rounded-full pointer-events-none" style={{
        width: 180, height: 180,
        background: "radial-gradient(circle, rgba(255,180,0,0.25) 0%, rgba(255,100,0,0.1) 50%, transparent 75%)",
      }} />
      {/* Diyas */}
      {allDiyas.map((d, idx) => {
        const rad = (d.angle * Math.PI) / 180;
        const x = 50 + (Math.cos(rad) * d.r * 100) / 280;
        const y = 50 + (Math.sin(rad) * d.r * 100) / 280;
        return (
          <div key={idx} className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}>
            {/* Flame glow */}
            <motion.div className="absolute rounded-full pointer-events-none"
              style={{
                width: d.size * 1.4, height: d.size * 1.4,
                background: "radial-gradient(circle, rgba(255,200,50,0.7) 0%, rgba(255,100,0,0.3) 50%, transparent 75%)",
                top: "50%", left: "50%", transform: "translate(-50%,-60%)",
              }}
              animate={{ scale: [1, 1.3, 0.9, 1.2, 1], opacity: [0.7, 1, 0.6, 1, 0.7] }}
              transition={{ duration: d.flickerDur, delay: d.flickerDelay, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              style={{ fontSize: d.size, display: "block", lineHeight: 1 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: d.delay, ease: [0.34, 1.56, 0.64, 1] }}
            >🪔</motion.span>
          </div>
        );
      })}
      {/* Center Om */}
      <motion.div className="relative z-10 flex flex-col items-center"
        animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
        <span style={{ fontSize: 32, color: "#B8860B", textShadow: "0 0 20px rgba(255,200,0,0.8), 0 0 40px rgba(255,150,0,0.4)" }}>ॐ</span>
      </motion.div>
      {/* Rising light motes */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div key={`mote-${i}`} className="absolute rounded-full pointer-events-none"
          style={{ width: 3, height: 3, background: "#FFD700", boxShadow: "0 0 6px #FFD700", left: `${30 + i * 6}%`, bottom: "20%" }}
          animate={{ y: [0, -80], opacity: [0, 0.9, 0], scale: [0.5, 1.2, 0] }}
          transition={{ duration: 2.5, delay: i * 0.35, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ── Bhog Seva: thali with items being offered one by one ── */
function LaddooAnimation() {
  const items = ["🟡", "🟠", "🟡", "🟠", "🟡", "🟠", "🟡", "🟠", "🟡", "🟠"];
  const [offered, setOffered] = useState(0);
  const [blessing, setBlessing] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setOffered((o) => {
        if (o >= items.length) { setBlessing(true); setTimeout(() => { setBlessing(false); setOffered(0); }, 1800); return o; }
        return o + 1;
      });
    }, 500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-3 overflow-hidden" style={{ minHeight: 200 }}>
      {/* Thali plate */}
      <div className="relative flex items-center justify-center">
        <div className="rounded-full flex items-center justify-center"
          style={{ width: 110, height: 110, background: "radial-gradient(circle, #FFF8DC, #FFD700, #B8860B)", boxShadow: "0 4px 20px rgba(184,134,11,0.4), inset 0 2px 8px rgba(255,255,255,0.5)" }}>
          {/* Items on thali */}
          <div className="flex flex-wrap gap-1 justify-center items-center" style={{ maxWidth: 80 }}>
            <AnimatePresence>
              {items.slice(0, offered).map((item, i) => (
                <motion.span key={i} style={{ fontSize: 14 }}
                  initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "backOut" }}>
                  {item}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
        {/* Thali rim glow */}
        <motion.div className="absolute rounded-full pointer-events-none"
          style={{ width: 120, height: 120, border: "2px solid rgba(255,215,0,0.6)", boxShadow: "0 0 20px rgba(255,215,0,0.3)" }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      {/* Incense smoke */}
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ left: `${35 + i * 15}%`, bottom: "60%", width: 2, borderRadius: 4, background: "rgba(139,69,19,0.3)" }}
          animate={{ height: [0, 30, 0], opacity: [0, 0.6, 0], x: [0, i % 2 === 0 ? 5 : -5, 0] }}
          transition={{ duration: 2, delay: i * 0.7, repeat: Infinity }}
        />
      ))}
      <AnimatePresence>
        {blessing && (
          <motion.p className="font-cinzel text-xs font-bold tracking-widest absolute bottom-4"
            style={{ color: "#8B4513" }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            🙏 Bhog Accepted
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Mahotsav: realistic fireworks with trails ── */
function FireworksAnimation() {
  const shells = Array.from({ length: 5 }, (_, i) => ({
    id: i, x: 15 + i * 17, peakY: 15 + (i % 3) * 12,
    delay: i * 0.7,
    color: ["#FFD700","#FF4444","#C084FC","#60A5FA","#FF8C00"][i],
    sparks: 12,
  }));

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: 200 }}>
      {shells.map((shell) => (
        <div key={shell.id} className="absolute" style={{ left: `${shell.x}%`, top: `${shell.peakY}%` }}>
          {/* Trail going up */}
          <motion.div className="absolute rounded-full"
            style={{ width: 3, height: 3, background: shell.color, boxShadow: `0 0 6px ${shell.color}`, bottom: 0, left: "50%" }}
            animate={{ y: [60, 0], opacity: [0, 1, 0], scaleY: [1, 2, 0] }}
            transition={{ duration: 0.5, delay: shell.delay, repeat: Infinity, repeatDelay: 2.5 }}
          />
          {/* Burst sparks */}
          {Array.from({ length: shell.sparks }, (_, j) => {
            const angle = (360 / shell.sparks) * j;
            const rad = (angle * Math.PI) / 180;
            const dist = 28 + (j % 3) * 10;
            return (
              <motion.div key={j} className="absolute rounded-full"
                style={{ width: j % 3 === 0 ? 4 : 3, height: j % 3 === 0 ? 4 : 3, background: shell.color, boxShadow: `0 0 ${j % 3 === 0 ? 8 : 5}px ${shell.color}`, top: "50%", left: "50%" }}
                animate={{
                  x: [0, Math.cos(rad) * dist * 0.5, Math.cos(rad) * dist],
                  y: [0, Math.sin(rad) * dist * 0.5, Math.sin(rad) * dist + 15],
                  opacity: [0, 1, 1, 0], scale: [0, 1.5, 1, 0],
                }}
                transition={{ duration: 1.0, delay: shell.delay + 0.5, repeat: Infinity, repeatDelay: 2, ease: [0.2, 0, 0.8, 1] }}
              />
            );
          })}
          {/* Flash */}
          <motion.div className="absolute rounded-full pointer-events-none"
            style={{ width: 20, height: 20, background: shell.color, top: "50%", left: "50%", transform: "translate(-50%,-50%)", filter: "blur(4px)" }}
            animate={{ scale: [0, 2.5, 0], opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.4, delay: shell.delay + 0.5, repeat: Infinity, repeatDelay: 2.6 }}
          />
        </div>
      ))}
      {/* Ground decoration */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3">
        {["🪔","🌸","🪔","🌸","🪔"].map((e, i) => (
          <motion.span key={i} style={{ fontSize: 14 }}
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}>
            {e}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ── Mandir Nidhi: temple silhouette building up brick by brick ── */
function TempleAnimation() {
  const [stage, setStage] = useState(0);
  const totalStages = 5;
  useEffect(() => {
    const t = setInterval(() => setStage((s) => (s >= totalStages ? 0 : s + 1)), 900);
    return () => clearInterval(t);
  }, []);

  const layers = [
    { bricks: 9, color: "#93C5FD", h: 10 },
    { bricks: 7, color: "#60A5FA", h: 11 },
    { bricks: 5, color: "#3B82F6", h: 12 },
    { bricks: 3, color: "#2563EB", h: 14 },
    { bricks: 1, color: "#1D4ED8", h: 20, isSpire: true },
  ];

  return (
    <div className="relative w-full flex flex-col items-center justify-end overflow-hidden" style={{ minHeight: 200, paddingBottom: 12 }}>
      {/* Sky glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(96,165,250,0.15) 0%, transparent 70%)",
      }} />
      <div className="flex flex-col items-center gap-0.5">
        {layers.map((layer, li) => (
          <AnimatePresence key={li}>
            {stage > li && (
              <motion.div className="flex gap-0.5"
                initial={{ opacity: 0, y: 12, scaleX: 0.6 }}
                animate={{ opacity: 1, y: 0, scaleX: 1 }}
                transition={{ duration: 0.4, ease: "backOut" }}>
                {layer.isSpire ? (
                  <motion.div className="flex flex-col items-center"
                    animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <span style={{ fontSize: 18 }}>🔱</span>
                    <div style={{ width: 12, height: layer.h, background: layer.color, borderRadius: "2px 2px 0 0", boxShadow: `0 0 8px ${layer.color}` }} />
                  </motion.div>
                ) : (
                  Array.from({ length: layer.bricks }, (_, bi) => (
                    <motion.div key={bi}
                      style={{ width: 14, height: layer.h, background: layer.color, borderRadius: 2, boxShadow: `0 1px 4px rgba(30,64,175,0.3)` }}
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, delay: bi * 0.1, repeat: Infinity }}
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        ))}
        {/* Base platform */}
        <div style={{ width: 140, height: 8, background: "linear-gradient(to right, #1E40AF, #3B82F6, #1E40AF)", borderRadius: 4, boxShadow: "0 2px 8px rgba(30,64,175,0.4)" }} />
      </div>
      {stage >= totalStages && (
        <motion.p className="font-cinzel text-[10px] tracking-widest text-blue-700 mt-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          🙏 Jai Shri Ram
        </motion.p>
      )}
    </div>
  );
}

/* ── Annadaan: pot of food being served to people ── */
function AnnadaanAnimation() {
  const [serving, setServing] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setServing(true);
      setCount((c) => c + 1);
      setTimeout(() => setServing(false), 600);
    }, 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center justify-center overflow-hidden" style={{ minHeight: 200 }}>
      {/* Steam */}
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ left: `${38 + i * 10}%`, bottom: "58%", width: 4, height: 20, borderRadius: 4, background: "rgba(255,255,255,0.5)", filter: "blur(2px)" }}
          animate={{ y: [0, -25, 0], opacity: [0, 0.7, 0], scaleX: [1, 1.5, 0.8] }}
          transition={{ duration: 1.8, delay: i * 0.6, repeat: Infinity }}
        />
      ))}
      {/* Pot */}
      <motion.div className="text-5xl" animate={{ rotate: serving ? [-5, 5, 0] : 0 }}
        transition={{ duration: 0.3 }}>
        🥘
      </motion.div>
      {/* Serving ladle */}
      <AnimatePresence>
        {serving && (
          <motion.div className="absolute text-2xl"
            style={{ top: "28%", left: "58%" }}
            initial={{ rotate: -40, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 40, opacity: 0 }}
            transition={{ duration: 0.3 }}>
            🥄
          </motion.div>
        )}
      </AnimatePresence>
      {/* People receiving */}
      <div className="flex gap-2 mt-2">
        {["🧑","👩","🧓","👦","👧"].map((p, i) => (
          <motion.div key={i} className="flex flex-col items-center gap-0.5">
            <motion.span style={{ fontSize: 18 }}
              animate={serving && i === count % 5 ? { scale: [1, 1.4, 1], y: [0, -6, 0] } : { scale: 1 }}
              transition={{ duration: 0.4 }}>
              {p}
            </motion.span>
            <AnimatePresence>
              {serving && i === count % 5 && (
                <motion.span style={{ fontSize: 10 }}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  🙏
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <motion.p className="font-cinzel text-[10px] tracking-widest mt-2" style={{ color: "#166534" }}
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
        {count} served today
      </motion.p>
    </div>
  );
}

/* ── Chikitsa Seva: heartbeat + healing ── */
function HealingAnimation() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center overflow-hidden" style={{ minHeight: 200 }}>
      {/* ECG line */}
      <svg width="180" height="50" viewBox="0 0 180 50" className="mb-2">
        <motion.polyline
          points="0,25 20,25 30,5 40,45 50,25 70,25 80,10 90,40 100,25 120,25 130,8 140,42 150,25 180,25"
          fill="none" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      {/* Heart */}
      <div className="relative flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="absolute rounded-full border-2 pointer-events-none"
            style={{ borderColor: "rgba(45,212,191,0.4)", width: 50, height: 50 }}
            animate={{ scale: [1, 2.5 + i * 0.5], opacity: [0.7, 0] }}
            transition={{ duration: 1.8, delay: i * 0.6, repeat: Infinity }}
          />
        ))}
        <motion.span style={{ fontSize: 40 }}
          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
          💚
        </motion.span>
      </div>
      {/* Floating medicine */}
      {["💊","🩺","💉","🌿"].map((item, i) => (
        <motion.div key={i} className="absolute text-lg"
          style={{ left: `${15 + i * 22}%`, bottom: "10%" }}
          animate={{ y: [0, -35, 0], opacity: [0, 1, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 2.5, delay: i * 0.6, repeat: Infinity }}>
          {item}
        </motion.div>
      ))}
    </div>
  );
}

function SevaAnimation({ type }: { type: string }) {
  switch (type) {
    case "diyas": return <DiyaAnimation />;
    case "laddoos": return <LaddooAnimation />;
    case "fireworks": return <FireworksAnimation />;
    case "temple": return <TempleAnimation />;
    case "bowl": return <AnnadaanAnimation />;
    case "healing": return <HealingAnimation />;
    default: return null;
  }
}

export default function DonatePage() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<FormState>({
    name: "", email: "", mobile: "", seva_type: "",
    amount: "", customAmount: "", payment_method: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [donationId, setDonationId] = useState<string>("");

  const selectedSeva = sevaOptions.find((s) => s.label === form.seva_type);
  const seva = selectedSeva ?? DEFAULT_SEVA;
  const effectiveAmount = selectedSeva && selectedSeva.amount > 0
    ? selectedSeva.amount : parseInt(form.customAmount) || 0;

  function validate() {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile)) e.mobile = "10-digit mobile required";
    if (!form.seva_type) e.seva_type = "Please choose a seva";
    if (effectiveAmount <= 0) e.customAmount = "Please enter a valid amount";
    if (!form.payment_method) e.payment_method = "Select a payment method";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    try {
      const { data, error } = await supabase.from("donations").insert([{
        name: form.name.trim(), email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(), seva_type: form.seva_type,
        amount: effectiveAmount, payment_method: form.payment_method,
      }]).select();
      if (error) throw error;
      const id = data?.[0]?.id
        ? `DON-${String(data[0].id).padStart(6, "0")}`
        : `DON-${Date.now().toString().slice(-6)}`;
      setDonationId(id);
      fetch("/api/send-donation-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim().toLowerCase(), seva_type: form.seva_type, amount: effectiveAmount, payment_method: form.payment_method, donation_id: id }),
      }).catch((err) => console.warn("Email send failed:", err));
      setStatus("success");
    } catch (err) { console.error(err); setStatus("error"); }
  }

  function field(key: keyof FormState, label: string, placeholder: string, type = "text") {
    return (
      <div>
        <label className="block font-cinzel text-xs tracking-widest uppercase mb-2" style={{ color: seva.accent }}>{label}</label>
        <input type={type} placeholder={placeholder} value={form[key]}
          onChange={(ev) => setForm((f) => ({ ...f, [key]: ev.target.value }))}
          className="w-full px-4 py-3 font-sans text-sm outline-none transition-all duration-200 rounded-lg"
          style={{ border: `1.5px solid ${errors[key] ? "rgba(220,80,80,0.7)" : seva.border}`, background: "rgba(255,255,255,0.85)", color: "#1a1a1a", boxShadow: `0 2px 8px ${seva.glow.replace("0.4","0.1")}` }}
        />
        {errors[key] && <p className="font-sans text-[10px] text-red-500 mt-1">{errors[key]}</p>}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: seva.bg, transition: "background 0.7s ease" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,255,255,0.6) 0%, transparent 60%)", zIndex: 0 }} />
      <div className="absolute top-0 left-0 right-0 h-1.5 z-10" style={{ background: `linear-gradient(to right, transparent, ${seva.accentLight}, ${seva.accent}, ${seva.accentLight}, transparent)`, transition: "background 0.7s ease" }} />

      {/* Ambient sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 16 }, (_, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ left: `${(i * 6.3) % 100}%`, top: `${(i * 7.7) % 100}%`, width: 3 + (i % 3), height: 3 + (i % 3), background: seva.accentLight, boxShadow: `0 0 6px ${seva.glow}` }}
            animate={{ y: [0, -40, 0], opacity: [0, 0.7, 0] }}
            transition={{ duration: 3 + (i % 4), delay: i * 0.4, repeat: Infinity }}
          />
        ))}
      </div>

      <div className="relative z-10 pt-6 px-6">
        <button onClick={() => navigate("/")}
          className="flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase transition-all px-4 py-2 rounded-full"
          style={{ color: seva.accent, background: "rgba(255,255,255,0.7)", border: `1px solid ${seva.border}`, backdropFilter: "blur(8px)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.95)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.7)")}>
          ← Back to Temple
        </button>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-20">

        {/* Compact header — no animation here */}
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <motion.div className="text-4xl mb-3" animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 3, repeat: Infinity }}>🪷</motion.div>
          <p className="font-cinzel text-[10px] tracking-[0.6em] uppercase mb-2" style={{ color: seva.accent + "99" }}>✦ Offer Your Seva ✦</p>
          <h1 className="font-cinzel font-black text-3xl md:text-4xl mb-2" style={{ color: seva.accent, textShadow: `0 2px 20px ${seva.glow}` }}>
            Sacred Donation
          </h1>
          <p className="font-sans font-light text-sm leading-relaxed max-w-md mx-auto" style={{ color: "rgba(60,40,20,0.65)" }}>
            Every offering lights a lamp in someone's life.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="text-center py-14 px-8 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.92)", border: `2px solid ${seva.border}`, boxShadow: `0 16px 60px ${seva.glow}`, backdropFilter: "blur(12px)" }}>
              <motion.div className="text-6xl mb-5" animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>🙏</motion.div>
              <h2 className="font-cinzel font-bold text-2xl mb-3" style={{ color: seva.accent }}>Jai Shri Ram!</h2>
              <p className="font-sans text-sm mb-4 leading-relaxed" style={{ color: "rgba(60,40,20,0.75)" }}>
                Your seva has been recorded with gratitude.<br />May the divine bless you and your family.
              </p>
              <div className="inline-block px-6 py-3 mb-8 font-cinzel text-xs tracking-widest rounded-lg"
                style={{ background: seva.bg, border: `1px solid ${seva.border}`, color: seva.accent }}>
                Donation ID: {donationId}
              </div>
              <div className="flex gap-4 justify-center flex-wrap">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setStatus("idle"); setForm({ name: "", email: "", mobile: "", seva_type: "", amount: "", customAmount: "", payment_method: "" }); setErrors({}); }}
                  className="px-8 py-3 font-cinzel text-xs tracking-widest font-bold rounded-xl"
                  style={{ background: `linear-gradient(135deg,${seva.accent},${seva.accentLight})`, color: "#fff", boxShadow: `0 4px 20px ${seva.glow}` }}>
                  Donate Again
                </motion.button>
                <button onClick={() => navigate("/")}
                  className="px-8 py-3 font-cinzel text-xs tracking-widest rounded-xl"
                  style={{ color: seva.accent, border: `1.5px solid ${seva.border}`, background: "rgba(255,255,255,0.8)" }}>
                  Back to Home
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="space-y-6">

              {/* Personal Details */}
              <div className="p-6 space-y-5 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.85)", border: `1.5px solid ${seva.border}`, boxShadow: `0 4px 24px ${seva.glow.replace("0.4","0.1")}`, backdropFilter: "blur(12px)" }}>
                <p className="font-cinzel text-[10px] tracking-[0.5em] uppercase" style={{ color: seva.accent + "99" }}>❋ Your Details</p>
                {field("name", "Full Name", "Your full name")}
                {field("email", "Email Address", "your@email.com", "email")}
                {field("mobile", "Mobile Number", "10-digit mobile number", "tel")}
              </div>

              {/* Seva Selection — animation lives INSIDE each card */}
              <div className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.85)", border: `1.5px solid ${seva.border}`, boxShadow: `0 4px 24px ${seva.glow.replace("0.4","0.1")}`, backdropFilter: "blur(12px)" }}>
                <div className="p-6 pb-4">
                  <p className="font-cinzel text-[10px] tracking-[0.5em] uppercase mb-4" style={{ color: seva.accent + "99" }}>❋ Choose Your Seva</p>
                  {errors.seva_type && <p className="font-sans text-[10px] text-red-500 mb-3">{errors.seva_type}</p>}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {sevaOptions.map((s) => {
                      const isSelected = form.seva_type === s.label;
                      return (
                        <div key={s.label}>
                          <motion.button type="button"
                            whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                            onClick={() => setForm((f) => ({ ...f, seva_type: s.label, customAmount: s.amount > 0 ? String(s.amount) : f.customAmount }))}
                            className="relative w-full text-left p-3 rounded-xl transition-all duration-300"
                            style={{
                              background: isSelected ? s.cardBg : "rgba(255,255,255,0.7)",
                              border: isSelected ? `2px solid ${s.border}` : "1.5px solid rgba(0,0,0,0.08)",
                              boxShadow: isSelected ? `0 4px 20px ${s.glow}` : "0 1px 4px rgba(0,0,0,0.05)",
                            }}>
                            {isSelected && (
                              <motion.div className="absolute top-2 right-2 text-[10px] font-bold" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: s.accent }}>✦</motion.div>
                            )}
                            <div className="text-xl mb-1">{s.icon}</div>
                            <div className="font-cinzel text-[11px] font-semibold mb-0.5" style={{ color: isSelected ? s.accent : "#3a2a1a" }}>{s.label}</div>
                            <div className="font-sans text-[10px]" style={{ color: "rgba(80,60,40,0.6)" }}>{s.desc}</div>
                            {s.amount > 0 && (
                              <div className="font-cinzel text-xs mt-1 font-bold" style={{ color: isSelected ? s.accent : "rgba(100,80,40,0.7)" }}>
                                ₹{s.amount.toLocaleString()}
                              </div>
                            )}
                          </motion.button>

                          {/* Animation expands BELOW the selected card, full width spanning the grid */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                className="col-span-2 sm:col-span-3 rounded-xl overflow-hidden mt-2"
                                style={{
                                  background: s.cardBg,
                                  border: `2px solid ${s.border}`,
                                  boxShadow: `0 8px 32px ${s.glow}`,
                                  gridColumn: "1 / -1",
                                }}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                              >
                                <div style={{ padding: "12px 16px 16px" }}>
                                  <p className="font-cinzel text-[9px] tracking-[0.4em] uppercase mb-2 text-center" style={{ color: s.accent + "88" }}>
                                    {s.tag}
                                  </p>
                                  <SevaAnimation type={s.animationType} />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Amount input */}
                <div className="px-6 pb-6">
                  <label className="block font-cinzel text-xs tracking-widest uppercase mb-2" style={{ color: seva.accent }}>Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-cinzel text-sm font-bold" style={{ color: seva.accent }}>₹</span>
                    <input type="number" min="1" placeholder="Enter amount" value={form.customAmount}
                      onChange={(ev) => setForm((f) => ({ ...f, customAmount: ev.target.value }))}
                      className="w-full pl-9 pr-4 py-3 font-cinzel text-sm outline-none transition-all duration-200 rounded-lg"
                      style={{ border: `1.5px solid ${errors.customAmount ? "rgba(220,80,80,0.7)" : seva.border}`, background: "rgba(255,255,255,0.85)", color: "#1a1a1a", boxShadow: `0 2px 8px ${seva.glow.replace("0.4","0.1")}` }}
                    />
                  </div>
                  {errors.customAmount && <p className="font-sans text-[10px] text-red-500 mt-1">{errors.customAmount}</p>}
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-6 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.85)", border: `1.5px solid ${seva.border}`, boxShadow: `0 4px 24px ${seva.glow.replace("0.4","0.1")}`, backdropFilter: "blur(12px)" }}>
                <p className="font-cinzel text-[10px] tracking-[0.5em] uppercase mb-4" style={{ color: seva.accent + "99" }}>❋ Payment Method</p>
                {errors.payment_method && <p className="font-sans text-[10px] text-red-500 mb-3">{errors.payment_method}</p>}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {paymentMethods.map((pm) => {
                    const isSel = form.payment_method === pm.id;
                    return (
                      <motion.button type="button" key={pm.id}
                        whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setForm((f) => ({ ...f, payment_method: pm.id }))}
                        className="flex flex-col items-center gap-2 py-4 rounded-xl transition-all duration-300"
                        style={{ background: isSel ? seva.cardBg : "rgba(255,255,255,0.7)", border: isSel ? `2px solid ${seva.border}` : "1.5px solid rgba(0,0,0,0.08)", boxShadow: isSel ? `0 4px 16px ${seva.glow}` : "0 1px 4px rgba(0,0,0,0.05)" }}>
                        <span className="text-2xl">{pm.icon}</span>
                        <span className="font-cinzel text-[11px] font-semibold" style={{ color: isSel ? seva.accent : "#3a2a1a" }}>{pm.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
                <p className="font-sans text-[11px] mt-4" style={{ color: "rgba(80,60,40,0.5)" }}>
                  UPI: <span style={{ color: seva.accent }}>templerams@upi</span> &nbsp;|&nbsp; Bank details at temple reception.
                </p>
              </div>

              {/* Summary */}
              <AnimatePresence>
                {form.name && form.seva_type && effectiveAmount > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="p-5 rounded-2xl"
                    style={{ background: seva.cardBg, border: `2px solid ${seva.border}`, boxShadow: `0 8px 32px ${seva.glow}` }}>
                    <p className="font-cinzel text-[10px] tracking-[0.5em] uppercase mb-3" style={{ color: seva.accent + "99" }}>❋ Summary</p>
                    <div className="space-y-2.5">
                      {[
                        ["Devotee", form.name],
                        ["Seva", `${selectedSeva?.icon ?? ""} ${form.seva_type}`],
                        ["Amount", `₹${effectiveAmount.toLocaleString()}`],
                        form.payment_method ? ["Payment", paymentMethods.find(p => p.id === form.payment_method)?.label || ""] : null,
                      ].filter(Boolean).map(([k, v]) => (
                        <div key={k as string} className="flex justify-between items-center">
                          <span className="font-sans text-xs" style={{ color: "rgba(80,60,40,0.6)" }}>{k}</span>
                          <span className="font-cinzel text-xs font-bold" style={{ color: seva.accent }}>{v as string}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {status === "error" && (
                <div className="px-5 py-4 rounded-xl" style={{ border: "1.5px solid rgba(220,80,80,0.4)", background: "rgba(255,240,240,0.9)" }}>
                  <p className="font-sans text-xs text-red-600">Something went wrong. Please try again or contact the temple directly.</p>
                </div>
              )}

              {/* Submit */}
              <motion.button type="submit" disabled={status === "submitting"}
                whileHover={status !== "submitting" ? { scale: 1.02, boxShadow: `0 8px 50px ${seva.glow}` } : {}}
                whileTap={status !== "submitting" ? { scale: 0.98 } : {}}
                className="w-full py-5 font-cinzel font-black text-sm tracking-[0.4em] uppercase rounded-2xl relative overflow-hidden"
                style={{
                  background: status === "submitting" ? `${seva.accent}88` : `linear-gradient(135deg,${seva.accent} 0%,${seva.accentLight} 50%,${seva.accent} 100%)`,
                  color: "#fff", cursor: status === "submitting" ? "not-allowed" : "pointer",
                  boxShadow: `0 6px 30px ${seva.glow}`, textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }}>
                {status !== "submitting" && (
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.3) 50%,transparent 60%)" }}
                    animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                  />
                )}
                {status === "submitting" ? (
                  <span className="flex items-center justify-center gap-3">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="inline-block">🪷</motion.span>
                    Recording Your Seva…
                  </span>
                ) : "🙏  Confirm Seva & Donate"}
              </motion.button>

              <p className="font-sans text-[11px] text-center" style={{ color: "rgba(80,60,40,0.4)" }}>
                Your seva is recorded with love and gratitude 🙏
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-1 pointer-events-none z-50"
        style={{ background: `linear-gradient(to right,transparent,${seva.accentLight},${seva.accent},${seva.accentLight},transparent)`, transition: "background 0.7s ease" }} />
    </div>
  );
}
