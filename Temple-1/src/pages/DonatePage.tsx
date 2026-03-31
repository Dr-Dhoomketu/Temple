import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

const sevaOptions = [
  {
    label: "Nityaseva",
    amount: 1001,
    icon: "🪔",
    desc: "Daily lamp lighting",
    theme: {
      accent: "#FF8C00",
      glow: "rgba(255,140,0,0.35)",
      card: "rgba(255,140,0,0.1)",
      border: "rgba(255,140,0,0.55)",
      bg: "linear-gradient(135deg, rgba(255,140,0,0.08) 0%, rgba(255,80,0,0.04) 100%)",
      tag: "Eternal Light",
    },
  },
  {
    label: "Bhog Seva",
    amount: 5001,
    icon: "🍯",
    desc: "Food offering to deity",
    theme: {
      accent: "#D4AF37",
      glow: "rgba(212,175,55,0.35)",
      card: "rgba(212,175,55,0.1)",
      border: "rgba(212,175,55,0.6)",
      bg: "linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(180,130,20,0.04) 100%)",
      tag: "Sacred Offering",
    },
  },
  {
    label: "Mahotsav Seva",
    amount: 11000,
    icon: "🎊",
    desc: "Festival sponsorship",
    theme: {
      accent: "#C084FC",
      glow: "rgba(192,132,252,0.4)",
      card: "rgba(160,80,255,0.1)",
      border: "rgba(192,132,252,0.6)",
      bg: "linear-gradient(135deg, rgba(160,80,255,0.1) 0%, rgba(100,40,200,0.04) 100%)",
      tag: "Divine Celebration",
    },
  },
  {
    label: "Mandir Nidhi",
    amount: 0,
    icon: "🏛️",
    desc: "Temple development fund",
    theme: {
      accent: "#60A5FA",
      glow: "rgba(96,165,250,0.35)",
      card: "rgba(59,130,246,0.1)",
      border: "rgba(96,165,250,0.55)",
      bg: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(30,80,200,0.04) 100%)",
      tag: "Build the Temple",
    },
  },
  {
    label: "Annadaan",
    amount: 2100,
    icon: "🌾",
    desc: "Free food for the poor",
    theme: {
      accent: "#4ADE80",
      glow: "rgba(74,222,128,0.35)",
      card: "rgba(34,197,94,0.1)",
      border: "rgba(74,222,128,0.55)",
      bg: "linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(20,120,50,0.04) 100%)",
      tag: "Feed the Hungry",
    },
  },
  {
    label: "Chikitsa Seva",
    amount: 3100,
    icon: "🏥",
    desc: "Medical aid camp",
    theme: {
      accent: "#2DD4BF",
      glow: "rgba(45,212,191,0.35)",
      card: "rgba(20,184,166,0.1)",
      border: "rgba(45,212,191,0.55)",
      bg: "linear-gradient(135deg, rgba(20,184,166,0.1) 0%, rgba(10,100,90,0.04) 100%)",
      tag: "Healing Hands",
    },
  },
];

const paymentMethods = [
  { id: "upi", label: "UPI", icon: "📱" },
  { id: "card", label: "Card", icon: "💳" },
  { id: "netbanking", label: "Net Banking", icon: "🏦" },
  { id: "cash", label: "Cash / DD", icon: "💵" },
];

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1.5 + Math.random() * 2.5,
  delay: Math.random() * 5,
  duration: 4 + Math.random() * 4,
}));

type FormState = {
  name: string;
  email: string;
  mobile: string;
  seva_type: string;
  amount: string;
  customAmount: string;
  payment_method: string;
};

type Status = "idle" | "submitting" | "success" | "error";

const DEFAULT_THEME = {
  accent: "#D4AF37",
  glow: "rgba(212,175,55,0.25)",
  card: "rgba(212,175,55,0.05)",
  border: "rgba(212,175,55,0.2)",
  bg: "linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.02) 100%)",
  tag: "",
};

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
  const theme = selectedSeva?.theme ?? DEFAULT_THEME;
  const effectiveAmount = selectedSeva && selectedSeva.amount > 0
    ? selectedSeva.amount
    : parseInt(form.customAmount) || 0;

  function validate() {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile)) e.mobile = "10-digit mobile number required";
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
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
        seva_type: form.seva_type,
        amount: effectiveAmount,
        payment_method: form.payment_method,
      }]).select();
      if (error) throw error;
      const id = data?.[0]?.id
        ? `DON-${String(data[0].id).padStart(6, "0")}`
        : `DON-${Date.now().toString().slice(-6)}`;
      setDonationId(id);
      fetch("/api/send-donation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          seva_type: form.seva_type,
          amount: effectiveAmount,
          payment_method: form.payment_method,
          donation_id: id,
        }),
      }).catch((err) => console.warn("Email send failed (non-critical):", err));
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  function field(key: keyof FormState, label: string, placeholder: string, type = "text") {
    return (
      <div>
        <label className="block font-cinzel text-xs tracking-widest uppercase mb-2"
          style={{ color: theme.accent + "cc" }}>
          {label}
        </label>
        <input
          type={type}
          placeholder={placeholder}
          value={form[key]}
          onChange={(ev) => setForm((f) => ({ ...f, [key]: ev.target.value }))}
          className="w-full border px-4 py-3 font-sans text-sm outline-none transition-colors duration-200"
          style={{
            borderColor: errors[key] ? "rgba(220,80,80,0.7)" : theme.border,
            background: "rgba(255,255,255,0.06)",
            color: "#F0EAD6",
            placeholderColor: "rgba(240,234,214,0.3)",
          }}
        />
        {errors[key] && (
          <p className="font-sans text-[10px] text-red-400 mt-1">{errors[key]}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{
      background: selectedSeva
        ? `radial-gradient(ellipse 80% 50% at 50% 0%, ${selectedSeva.theme.glow.replace("0.35", "0.12")} 0%, #100820 40%, #0a0515 100%)`
        : "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(60,20,80,0.4) 0%, #100820 40%, #0a0515 100%)",
      transition: "background 0.8s ease",
    }}>

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              background: theme.accent,
              boxShadow: `0 0 ${p.size * 4}px ${theme.glow}`,
            }}
            animate={{ y: [0, -60, 0], opacity: [0, 0.7, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Back button */}
      <div className="relative z-10 pt-8 px-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase transition-colors"
          style={{ color: theme.accent + "99" }}
          onMouseEnter={e => (e.currentTarget.style.color = theme.accent)}
          onMouseLeave={e => (e.currentTarget.style.color = theme.accent + "99")}
        >
          ← Back to Temple
        </button>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-20">

        {/* Header */}
        <motion.div className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <motion.div className="text-5xl mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}>
            🪷
          </motion.div>
          <p className="font-cinzel text-[10px] tracking-[0.6em] uppercase mb-3"
            style={{ color: theme.accent + "88" }}>
            ✦ Offer Your Seva ✦
          </p>
          <h1 className="font-cinzel font-bold text-3xl md:text-4xl mb-3"
            style={{ color: theme.accent, textShadow: `0 0 40px ${theme.glow}` }}>
            Sacred Donation
          </h1>
          {selectedSeva && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-1.5 rounded-full font-cinzel text-[11px] tracking-widest uppercase mt-1"
              style={{ background: theme.card, border: `1px solid ${theme.border}`, color: theme.accent }}>
              {selectedSeva.icon} {selectedSeva.theme.tag}
            </motion.div>
          )}
          <p className="font-sans font-light text-sm leading-relaxed max-w-md mx-auto mt-4"
            style={{ color: "rgba(224,210,255,0.7)" }}>
            Every offering lights a lamp in someone's life. Fill in your details and we will record your seva with devotion.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="text-center py-16 px-6"
              style={{ background: theme.bg, border: `1px solid ${theme.border}`, boxShadow: `0 0 60px ${theme.glow}` }}>
              <motion.div className="text-6xl mb-6"
                animate={{ scale: [1, 1.18, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}>
                🙏
              </motion.div>
              <h2 className="font-cinzel font-bold text-2xl mb-3" style={{ color: theme.accent }}>
                Jai Shri Ram!
              </h2>
              <p className="font-sans text-sm mb-4 leading-relaxed" style={{ color: "rgba(224,210,255,0.8)" }}>
                Your seva has been recorded with gratitude.<br />May the divine bless you and your family.
              </p>
              <div className="inline-block px-6 py-3 mb-8 font-cinzel text-xs tracking-widest"
                style={{ background: theme.card, border: `1px solid ${theme.border}`, color: theme.accent }}>
                Donation ID: {donationId}
              </div>
              <div className="flex gap-4 justify-center flex-wrap">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setStatus("idle"); setForm({ name: "", email: "", mobile: "", seva_type: "", amount: "", customAmount: "", payment_method: "" }); setErrors({}); }}
                  className="px-8 py-3 font-cinzel text-xs tracking-widest font-bold"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}bb)`, color: "#0a0515" }}>
                  Donate Again
                </motion.button>
                <button onClick={() => navigate("/")}
                  className="px-8 py-3 font-cinzel text-xs tracking-widest transition-colors"
                  style={{ color: theme.accent, border: `1px solid ${theme.border}` }}>
                  Back to Home
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form" onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-7">

              {/* Personal Details */}
              <motion.div className="p-6 space-y-5 rounded-sm"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                layout>
                <p className="font-cinzel text-[10px] tracking-[0.5em] text-purple-300/70 uppercase">
                  ❋ Your Details
                </p>
                {field("name", "Full Name", "Your full name")}
                {field("email", "Email Address", "your@email.com", "email")}
                {field("mobile", "Mobile Number", "10-digit mobile number", "tel")}
              </motion.div>

              {/* Seva Selection */}
              <motion.div className="p-6 rounded-sm"
                style={{
                  background: selectedSeva ? theme.bg : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selectedSeva ? theme.border : "rgba(255,255,255,0.1)"}`,
                  boxShadow: selectedSeva ? `0 0 40px ${theme.glow.replace("0.35", "0.12")}` : "none",
                  transition: "all 0.5s ease",
                }}
                layout>
                <p className="font-cinzel text-[10px] tracking-[0.5em] uppercase mb-4"
                  style={{ color: theme.accent + "99" }}>
                  ❋ Choose Your Seva
                </p>
                {errors.seva_type && (
                  <p className="font-sans text-[10px] text-red-400 mb-3">{errors.seva_type}</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  {sevaOptions.map((seva) => {
                    const isSelected = form.seva_type === seva.label;
                    return (
                      <motion.button
                        type="button" key={seva.label}
                        whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setForm((f) => ({ ...f, seva_type: seva.label, customAmount: seva.amount > 0 ? String(seva.amount) : f.customAmount }))}
                        className="relative text-left p-3 rounded-sm transition-all duration-300"
                        style={{
                          background: isSelected ? seva.theme.card : "rgba(255,255,255,0.04)",
                          border: isSelected ? `1px solid ${seva.theme.border}` : "1px solid rgba(255,255,255,0.1)",
                          boxShadow: isSelected ? `0 0 24px ${seva.theme.glow}` : "none",
                        }}>
                        {isSelected && (
                          <div className="absolute top-1.5 right-2 text-[10px]"
                            style={{ color: seva.theme.accent }}>✦</div>
                        )}
                        <div className="text-xl mb-1">{seva.icon}</div>
                        <div className="font-cinzel text-[11px] mb-0.5"
                          style={{ color: isSelected ? seva.theme.accent : "rgba(224,210,255,0.85)" }}>
                          {seva.label}
                        </div>
                        <div className="font-sans text-[10px]"
                          style={{ color: "rgba(200,185,230,0.6)" }}>
                          {seva.desc}
                        </div>
                        {seva.amount > 0 && (
                          <div className="font-cinzel text-xs mt-1"
                            style={{ color: isSelected ? seva.theme.accent : "rgba(212,175,55,0.7)" }}>
                            ₹{seva.amount.toLocaleString()}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Amount */}
                <div>
                  <label className="block font-cinzel text-xs tracking-widest uppercase mb-2"
                    style={{ color: theme.accent + "cc" }}>
                    Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-cinzel text-sm"
                      style={{ color: theme.accent + "99" }}>₹</span>
                    <input
                      type="number" min="1"
                      placeholder="Enter amount"
                      value={form.customAmount}
                      onChange={(ev) => setForm((f) => ({ ...f, customAmount: ev.target.value }))}
                      className="w-full border pl-9 pr-4 py-3 font-cinzel text-sm outline-none transition-colors duration-200"
                      style={{
                        borderColor: errors.customAmount ? "rgba(220,80,80,0.7)" : theme.border,
                        background: "rgba(255,255,255,0.06)",
                        color: "#F0EAD6",
                      }}
                    />
                  </div>
                  {errors.customAmount && (
                    <p className="font-sans text-[10px] text-red-400 mt-1">{errors.customAmount}</p>
                  )}
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div className="p-6 rounded-sm"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }} layout>
                <p className="font-cinzel text-[10px] tracking-[0.5em] uppercase mb-4"
                  style={{ color: theme.accent + "99" }}>
                  ❋ Payment Method
                </p>
                {errors.payment_method && (
                  <p className="font-sans text-[10px] text-red-400 mb-3">{errors.payment_method}</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {paymentMethods.map((pm) => {
                    const isSelected = form.payment_method === pm.id;
                    return (
                      <motion.button
                        type="button" key={pm.id}
                        whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setForm((f) => ({ ...f, payment_method: pm.id }))}
                        className="flex flex-col items-center gap-2 py-4 rounded-sm transition-all duration-300"
                        style={{
                          background: isSelected ? theme.card : "rgba(255,255,255,0.04)",
                          border: isSelected ? `1px solid ${theme.border}` : "1px solid rgba(255,255,255,0.1)",
                          boxShadow: isSelected ? `0 0 20px ${theme.glow}` : "none",
                        }}>
                        <span className="text-2xl">{pm.icon}</span>
                        <span className="font-cinzel text-[11px]"
                          style={{ color: isSelected ? theme.accent : "rgba(200,185,230,0.8)" }}>
                          {pm.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
                <p className="font-sans text-[11px] mt-4 leading-relaxed" style={{ color: "rgba(200,185,230,0.55)" }}>
                  UPI: <span style={{ color: theme.accent + "99" }}>templerams@upi</span>
                  &nbsp;|&nbsp; Bank details available at the temple reception.
                </p>
              </motion.div>

              {/* Summary */}
              {form.name && form.seva_type && effectiveAmount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-sm"
                  style={{
                    background: theme.bg,
                    border: `1px solid ${theme.border}`,
                    boxShadow: `0 0 40px ${theme.glow.replace("0.35","0.15")}`,
                  }}>
                  <p className="font-cinzel text-[10px] tracking-[0.5em] uppercase mb-3"
                    style={{ color: theme.accent + "99" }}>❋ Summary</p>
                  <div className="space-y-2.5">
                    {[
                      ["Devotee", form.name],
                      ["Seva", `${selectedSeva?.icon ?? ""} ${form.seva_type}`],
                      ["Amount", `₹${effectiveAmount.toLocaleString()}`],
                      form.payment_method ? ["Payment", paymentMethods.find(p => p.id === form.payment_method)?.label || ""] : null,
                    ].filter(Boolean).map(([k, v]) => (
                      <div key={k as string} className="flex justify-between items-center">
                        <span className="font-sans text-[12px]" style={{ color: "rgba(200,185,230,0.6)" }}>{k}</span>
                        <span className="font-cinzel text-xs" style={{ color: theme.accent }}>{v as string}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <div className="px-5 py-4 rounded-sm" style={{ border: "1px solid rgba(220,80,80,0.4)", background: "rgba(200,30,30,0.08)" }}>
                  <p className="font-sans text-xs text-red-400">
                    Something went wrong. Please try again or contact the temple directly.
                  </p>
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={status === "submitting"}
                whileHover={status !== "submitting" ? {
                  scale: 1.02,
                  boxShadow: `0 0 50px ${theme.glow}, 0 0 80px ${theme.glow.replace("0.35","0.12")}`,
                } : {}}
                whileTap={status !== "submitting" ? { scale: 0.98 } : {}}
                className="w-full py-5 font-cinzel font-bold text-sm tracking-[0.4em] uppercase relative overflow-hidden rounded-sm"
                style={{
                  background: status === "submitting"
                    ? `${theme.accent}66`
                    : `linear-gradient(135deg, ${theme.accent}ee, ${theme.accent}bb)`,
                  color: "#0a0515",
                  cursor: status === "submitting" ? "not-allowed" : "pointer",
                  boxShadow: `0 4px 30px ${theme.glow}`,
                }}>
                {status === "submitting" ? (
                  <span className="flex items-center justify-center gap-3">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block">🪷</motion.span>
                    Recording Your Seva…
                  </span>
                ) : (
                  "🙏  Confirm Seva & Donate"
                )}
              </motion.button>

              <p className="font-sans text-[11px] text-center" style={{ color: "rgba(200,185,230,0.35)" }}>
                Your seva is recorded with love and gratitude 🙏
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
