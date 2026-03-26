import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

const sevaOptions = [
  { label: "Nityaseva", amount: 1001, icon: "🪔", desc: "Daily lamp lighting" },
  { label: "Bhog Seva", amount: 5001, icon: "🍯", desc: "Food offering to deity" },
  { label: "Mahotsav Seva", amount: 11000, icon: "🎊", desc: "Festival sponsorship" },
  { label: "Mandir Nidhi", amount: 0, icon: "🏛️", desc: "Temple development fund" },
  { label: "Annadaan", amount: 2100, icon: "🌾", desc: "Free food for the poor" },
  { label: "Chikitsa Seva", amount: 3100, icon: "🏥", desc: "Medical aid camp" },
];

const paymentMethods = [
  { id: "upi", label: "UPI", icon: "📱" },
  { id: "card", label: "Card", icon: "💳" },
  { id: "netbanking", label: "Net Banking", icon: "🏦" },
  { id: "cash", label: "Cash / DD", icon: "💵" },
];

const particles = Array.from({ length: 20 }, (_, i) => ({
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

export default function DonatePage() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    mobile: "",
    seva_type: "",
    amount: "",
    customAmount: "",
    payment_method: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [donationId, setDonationId] = useState<string>("");

  const selectedSeva = sevaOptions.find((s) => s.label === form.seva_type);
  const effectiveAmount =
    selectedSeva && selectedSeva.amount > 0
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
      const { data, error } = await supabase.from("donations").insert([
        {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          mobile: form.mobile.trim(),
          seva_type: form.seva_type,
          amount: effectiveAmount,
          payment_method: form.payment_method,
        },
      ]).select();

      if (error) throw error;

      const id = data?.[0]?.id
        ? `DON-${String(data[0].id).padStart(6, "0")}`
        : `DON-${Date.now().toString().slice(-6)}`;
      setDonationId(id);

      // Send thank-you email (fire-and-forget — don't block success state)
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

  function field(
    key: keyof FormState,
    label: string,
    placeholder: string,
    type = "text"
  ) {
    return (
      <div>
        <label className="block font-cinzel text-xs tracking-widest text-[#D4AF37]/80 uppercase mb-2">
          {label}
        </label>
        <input
          type={type}
          placeholder={placeholder}
          value={form[key]}
          onChange={(ev) => setForm((f) => ({ ...f, [key]: ev.target.value }))}
          className="w-full bg-transparent border px-4 py-3 font-sans text-sm text-[#F5F5DC] placeholder-[#F5F5DC]/25 outline-none transition-colors duration-200 focus:border-[#D4AF37]/70"
          style={{
            borderColor: errors[key] ? "rgba(220,80,80,0.6)" : "rgba(212,175,55,0.25)",
            background: "rgba(212,175,55,0.03)",
          }}
        />
        {errors[key] && (
          <p className="font-sans text-[10px] text-red-400/80 mt-1">{errors[key]}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#080101" }}>
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              background: "#D4AF37",
              boxShadow: `0 0 ${p.size * 3}px rgba(212,175,55,0.7)`,
            }}
            animate={{ y: [0, -50, 0], opacity: [0, 0.6, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Back button */}
      <div className="relative z-10 pt-8 px-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-cinzel text-xs tracking-widest text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors uppercase"
        >
          ← Back to Temple
        </button>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-20">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-5xl mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🪷
          </motion.div>
          <p className="font-cinzel text-[10px] tracking-[0.6em] text-[#D4AF37]/60 uppercase mb-3">
            ✦ Offer Your Seva ✦
          </p>
          <h1
            className="font-cinzel font-bold text-3xl md:text-4xl text-[#D4AF37] mb-3"
            style={{ textShadow: "0 0 40px rgba(212,175,55,0.35)" }}
          >
            Sacred Donation
          </h1>
          <p className="font-sans font-light text-[#F5F5DC]/40 text-sm leading-relaxed max-w-md mx-auto">
            Every offering lights a lamp in someone's life. Fill in your details and we will record your seva with devotion.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 px-6"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.02))",
                border: "1px solid rgba(212,175,55,0.3)",
              }}
            >
              <motion.div
                className="text-6xl mb-6"
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                🙏
              </motion.div>
              <h2 className="font-cinzel font-bold text-2xl text-[#D4AF37] mb-3">
                Jai Shri Ram!
              </h2>
              <p className="font-sans text-[#F5F5DC]/60 text-sm mb-4 leading-relaxed">
                Your seva has been recorded with gratitude.<br />May the divine bless you and your family.
              </p>
              <div
                className="inline-block px-6 py-3 mb-8 font-cinzel text-xs tracking-widest text-[#D4AF37]"
                style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}
              >
                Donation ID: {donationId}
              </div>
              <div className="flex gap-4 justify-center flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setStatus("idle"); setForm({ name: "", email: "", mobile: "", seva_type: "", amount: "", customAmount: "", payment_method: "" }); setErrors({}); }}
                  className="px-8 py-3 font-cinzel text-xs tracking-widest text-[#1a0303] font-bold"
                  style={{ background: "linear-gradient(135deg, #F5E088, #D4AF37)" }}
                >
                  Donate Again
                </motion.button>
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-3 font-cinzel text-xs tracking-widest text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Personal Details */}
              <div
                className="p-6 space-y-5"
                style={{ background: "rgba(212,175,55,0.03)", border: "1px solid rgba(212,175,55,0.15)" }}
              >
                <p className="font-cinzel text-[10px] tracking-[0.5em] text-[#D4AF37]/60 uppercase">
                  ❋ Your Details
                </p>
                {field("name", "Full Name", "Your full name")}
                {field("email", "Email Address", "your@email.com", "email")}
                {field("mobile", "Mobile Number", "10-digit mobile number", "tel")}
              </div>

              {/* Seva Selection */}
              <div
                className="p-6"
                style={{ background: "rgba(212,175,55,0.03)", border: "1px solid rgba(212,175,55,0.15)" }}
              >
                <p className="font-cinzel text-[10px] tracking-[0.5em] text-[#D4AF37]/60 uppercase mb-4">
                  ❋ Choose Your Seva
                </p>
                {errors.seva_type && (
                  <p className="font-sans text-[10px] text-red-400/80 mb-3">{errors.seva_type}</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  {sevaOptions.map((seva) => (
                    <motion.button
                      type="button"
                      key={seva.label}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setForm((f) => ({ ...f, seva_type: seva.label, customAmount: seva.amount > 0 ? String(seva.amount) : f.customAmount }))}
                      className="relative text-left p-3 transition-all duration-200"
                      style={{
                        background: form.seva_type === seva.label ? "rgba(212,175,55,0.15)" : "rgba(212,175,55,0.03)",
                        border: form.seva_type === seva.label ? "1px solid rgba(212,175,55,0.7)" : "1px solid rgba(212,175,55,0.15)",
                        boxShadow: form.seva_type === seva.label ? "0 0 20px rgba(212,175,55,0.2)" : "none",
                      }}
                    >
                      {form.seva_type === seva.label && (
                        <div className="absolute top-1.5 right-2 text-[#D4AF37] text-[10px]">✦</div>
                      )}
                      <div className="text-xl mb-1">{seva.icon}</div>
                      <div className="font-cinzel text-[11px] text-[#D4AF37] mb-0.5">{seva.label}</div>
                      <div className="font-cinzel text-[10px] text-[#F5F5DC]/50">{seva.desc}</div>
                      {seva.amount > 0 && (
                        <div className="font-cinzel text-xs text-[#D4AF37]/80 mt-1">₹{seva.amount.toLocaleString()}</div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Amount input */}
                <div>
                  <label className="block font-cinzel text-xs tracking-widest text-[#D4AF37]/80 uppercase mb-2">
                    Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-cinzel text-[#D4AF37]/60 text-sm">₹</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Enter amount"
                      value={form.customAmount}
                      onChange={(ev) => setForm((f) => ({ ...f, customAmount: ev.target.value }))}
                      className="w-full bg-transparent border pl-9 pr-4 py-3 font-cinzel text-sm text-[#F5F5DC] placeholder-[#F5F5DC]/25 outline-none transition-colors duration-200 focus:border-[#D4AF37]/70"
                      style={{
                        borderColor: errors.customAmount ? "rgba(220,80,80,0.6)" : "rgba(212,175,55,0.25)",
                        background: "rgba(212,175,55,0.03)",
                      }}
                    />
                  </div>
                  {errors.customAmount && (
                    <p className="font-sans text-[10px] text-red-400/80 mt-1">{errors.customAmount}</p>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div
                className="p-6"
                style={{ background: "rgba(212,175,55,0.03)", border: "1px solid rgba(212,175,55,0.15)" }}
              >
                <p className="font-cinzel text-[10px] tracking-[0.5em] text-[#D4AF37]/60 uppercase mb-4">
                  ❋ Payment Method
                </p>
                {errors.payment_method && (
                  <p className="font-sans text-[10px] text-red-400/80 mb-3">{errors.payment_method}</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {paymentMethods.map((pm) => (
                    <motion.button
                      type="button"
                      key={pm.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setForm((f) => ({ ...f, payment_method: pm.id }))}
                      className="flex flex-col items-center gap-2 py-4 transition-all duration-200"
                      style={{
                        background: form.payment_method === pm.id ? "rgba(212,175,55,0.15)" : "rgba(212,175,55,0.03)",
                        border: form.payment_method === pm.id ? "1px solid rgba(212,175,55,0.7)" : "1px solid rgba(212,175,55,0.15)",
                        boxShadow: form.payment_method === pm.id ? "0 0 20px rgba(212,175,55,0.2)" : "none",
                      }}
                    >
                      <span className="text-2xl">{pm.icon}</span>
                      <span className="font-cinzel text-[11px] text-[#D4AF37]/80">{pm.label}</span>
                    </motion.button>
                  ))}
                </div>
                <p className="font-sans text-[10px] text-[#F5F5DC]/30 mt-4 leading-relaxed">
                  UPI: <span className="text-[#D4AF37]/60">templerams@upi</span> &nbsp;|&nbsp;
                  Bank details available at the temple reception. Your donation will be recorded immediately upon submission.
                </p>
              </div>

              {/* Summary */}
              {form.name && form.seva_type && effectiveAmount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5"
                  style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.03))",
                    border: "1px solid rgba(212,175,55,0.35)",
                    boxShadow: "0 0 30px rgba(212,175,55,0.08)",
                  }}
                >
                  <p className="font-cinzel text-[10px] tracking-[0.5em] text-[#D4AF37]/60 uppercase mb-3">❋ Summary</p>
                  <div className="space-y-2">
                    {[
                      ["Devotee", form.name],
                      ["Seva", form.seva_type],
                      ["Amount", `₹${effectiveAmount.toLocaleString()}`],
                      form.payment_method && ["Payment", paymentMethods.find(p => p.id === form.payment_method)?.label || ""],
                    ].filter(Boolean).map(([k, v]) => (
                      <div key={k as string} className="flex justify-between items-center">
                        <span className="font-sans text-[11px] text-[#F5F5DC]/40">{k}</span>
                        <span className="font-cinzel text-xs text-[#D4AF37]/90">{v as string}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <div className="px-5 py-4 border border-red-400/30 bg-red-900/10">
                  <p className="font-sans text-xs text-red-400/80">
                    Something went wrong. Please try again or contact the temple directly.
                  </p>
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={status === "submitting"}
                whileHover={status !== "submitting" ? { scale: 1.02, boxShadow: "0 0 40px rgba(212,175,55,0.45)" } : {}}
                whileTap={status !== "submitting" ? { scale: 0.98 } : {}}
                className="w-full py-5 font-cinzel font-bold text-sm tracking-[0.4em] uppercase text-[#1a0303] relative overflow-hidden"
                style={{
                  background: status === "submitting"
                    ? "rgba(212,175,55,0.5)"
                    : "linear-gradient(135deg, #F5E088 0%, #D4AF37 50%, #c8a84b 100%)",
                  cursor: status === "submitting" ? "not-allowed" : "pointer",
                }}
              >
                {status === "submitting" ? (
                  <span className="flex items-center justify-center gap-3">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      🪷
                    </motion.span>
                    Recording Your Seva…
                  </span>
                ) : (
                  "🙏  Confirm Seva & Donate"
                )}
              </motion.button>

              <p className="font-sans text-[10px] text-[#F5F5DC]/25 text-center">
                All donations are tax-exempt under Section 80G of the Income Tax Act.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
