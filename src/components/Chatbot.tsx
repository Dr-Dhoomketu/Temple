import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

type Message = {
  id: number;
  from: "bot" | "user";
  text: string;
};

type Stage = "ask_name" | "chatting";

let msgId = 0;
const makeMsg = (from: Message["from"], text: string): Message => ({ id: ++msgId, from, text });

const INTRO: Message = makeMsg(
  "bot",
  "🙏 Jai Shri Ram! Namaste, welcome to Shri Ram Mandir.\n\nI'm Saathi, your temple guide. May I know your name so I can serve you better?"
);

const QUICK_TOPICS = ["Puja timings", "How to donate?", "About Lord Ram", "Festival info", "Contact details"];

export default function Chatbot() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("ask_name");
  const [visitorName, setVisitorName] = useState("");
  const [messages, setMessages] = useState<Message[]>([INTRO]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  const appendBot = (text: string) => {
    setMessages((prev) => [...prev, makeMsg("bot", text)]);
    setTyping(false);
  };

  const sendUserMessage = async (text: string) => {
    if (!text.trim() || typing) return;
    const trimmed = text.trim();
    setMessages((prev) => [...prev, makeMsg("user", trimmed)]);
    setInput("");
    setTyping(true);

    if (stage === "ask_name") {
      const firstName = trimmed.split(" ")[0];
      const name = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      setVisitorName(name);
      setStage("chatting");
      setTimeout(() => {
        appendBot(`🌸 Namaste, ${name}! So lovely to have you here.\n\nI'm Saathi — your guide at Shri Ram Mandir, powered by AI. You can ask me anything — about the temple, Lord Ram, Hindu traditions, festivals, and more. How may I assist you today? 🙏`);
      }, 600);
      return;
    }

    try {
      const history = messages
        .filter((m) => m.id !== INTRO.id)
        .map((m) => ({ from: m.from, text: m.text }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history, visitorName }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      appendBot(data.reply || "🙏 I'm sorry, I couldn't process that. Please try again.");
    } catch {
      appendBot("🙏 I'm having trouble connecting right now. Please try again in a moment.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendUserMessage(input);
  };

  const c = isLight
    ? {
        bg: "#FFF8F0",
        header: "linear-gradient(135deg, #8B2500, #C25B2F)",
        headerText: "#FFF8E7",
        headerSub: "rgba(255,248,231,0.72)",
        userBubble: "linear-gradient(135deg, #C25B2F, #E07B39)",
        userText: "#FFF8E7",
        botBubble: "#FFFFFF",
        botText: "#4A1A00",
        border: "rgba(180,90,0,0.18)",
        inputBg: "#FFFFFF",
        inputBorder: "rgba(194,91,47,0.3)",
        inputFocus: "#C25B2F",
        inputText: "#4A1A00",
        qrBg: "rgba(194,91,47,0.08)",
        qrBorder: "rgba(194,91,47,0.3)",
        qrText: "#8B2500",
        qrHover: "rgba(194,91,47,0.15)",
        fabBg: "linear-gradient(135deg, #8B2500, #C25B2F)",
        fabShadow: "rgba(140,40,0,0.4)",
        shadow: "0 8px 40px rgba(140,40,0,0.18)",
        typingDot: "#C25B2F",
        scrollbar: "rgba(194,91,47,0.2)",
        sendActive: "linear-gradient(135deg, #8B2500, #C25B2F)",
        sendInactive: "rgba(194,91,47,0.2)",
        sendColor: "#FFF8E7",
        saathiLabel: "#C25B2F",
      }
    : {
        bg: "#0d0101",
        header: "linear-gradient(135deg, #1a0a00, #2a1400)",
        headerText: "#F5E088",
        headerSub: "rgba(245,224,136,0.6)",
        userBubble: "linear-gradient(135deg, #D4AF37, #F5E088)",
        userText: "#1a0500",
        botBubble: "rgba(212,175,55,0.07)",
        botText: "#F5F5DC",
        border: "rgba(212,175,55,0.18)",
        inputBg: "rgba(255,255,255,0.04)",
        inputBorder: "rgba(212,175,55,0.25)",
        inputFocus: "#D4AF37",
        inputText: "#F5F5DC",
        qrBg: "rgba(212,175,55,0.07)",
        qrBorder: "rgba(212,175,55,0.25)",
        qrText: "#D4AF37",
        qrHover: "rgba(212,175,55,0.14)",
        fabBg: "linear-gradient(135deg, #D4AF37, #F5E088)",
        fabShadow: "rgba(212,175,55,0.4)",
        shadow: "0 8px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.12)",
        typingDot: "#D4AF37",
        scrollbar: "rgba(212,175,55,0.15)",
        sendActive: "linear-gradient(135deg, #D4AF37, #F5E088)",
        sendInactive: "rgba(212,175,55,0.18)",
        sendColor: "#1a0500",
        saathiLabel: "#D4AF37",
      };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open Saathi temple guide"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9998,
          width: 58, height: 58, borderRadius: "50%",
          background: c.fabBg, border: "none", cursor: "pointer",
          boxShadow: `0 4px 24px ${c.fabShadow}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ color: isLight ? "#FFF8E7" : "#1a0500", lineHeight: 1, fontSize: "1.1rem" }}>
              ✕
            </motion.span>
          ) : (
            <motion.span key="om" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ lineHeight: 1, fontSize: "1.6rem" }}>
              🙏
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 32, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            style={{
              position: "fixed", bottom: 98, right: 28, zIndex: 9997,
              width: 360, maxWidth: "calc(100vw - 32px)",
              height: 520, maxHeight: "calc(100vh - 130px)",
              borderRadius: 16, background: c.bg,
              boxShadow: c.shadow, border: `1px solid ${c.border}`,
              display: "flex", flexDirection: "column", overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ background: c.header, padding: "14px 18px", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.25rem", flexShrink: 0,
                }}>🛕</div>
                <div>
                  <div className="font-cinzel font-bold text-sm tracking-widest" style={{ color: c.headerText }}>
                    Saathi · AI Temple Guide
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }} />
                    <span className="font-sans text-xs" style={{ color: c.headerSub }}>
                      Powered by Gemini · Jai Shri Ram 🙏
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: "auto", padding: "14px 14px 6px",
              display: "flex", flexDirection: "column", gap: 10,
              scrollbarWidth: "thin",
              scrollbarColor: `${c.scrollbar} transparent`,
            }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.from === "user" ? "flex-end" : "flex-start" }}>
                  {msg.from === "bot" && (
                    <div className="font-cinzel" style={{ fontSize: "0.68rem", color: c.saathiLabel, marginBottom: 3, letterSpacing: "0.06em", opacity: 0.85 }}>
                      Saathi
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.22 }}
                    style={{
                      maxWidth: "84%", padding: "9px 13px",
                      borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                      background: msg.from === "user" ? c.userBubble : c.botBubble,
                      color: msg.from === "user" ? c.userText : c.botText,
                      fontSize: "0.82rem", lineHeight: 1.6,
                      border: msg.from === "bot" ? `1px solid ${c.border}` : "none",
                      whiteSpace: "pre-wrap", wordBreak: "break-word",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {msg.text}
                  </motion.div>
                </div>
              ))}

              {/* Quick topic pills — shown after greeting */}
              {stage === "chatting" && messages.length <= 3 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
                  {QUICK_TOPICS.map((qr) => (
                    <motion.button key={qr} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={() => sendUserMessage(qr)}
                      style={{
                        padding: "5px 12px", borderRadius: 20,
                        background: c.qrBg, border: `1px solid ${c.qrBorder}`,
                        color: c.qrText, fontSize: "0.72rem", cursor: "pointer",
                        fontFamily: "'Cinzel', serif", letterSpacing: "0.04em",
                        transition: "background 0.18s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = c.qrHover; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = c.qrBg; }}
                    >
                      {qr}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Typing indicator */}
              {typing && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="font-cinzel" style={{ fontSize: "0.68rem", color: c.saathiLabel, marginBottom: 3, letterSpacing: "0.06em", opacity: 0.85 }}>
                    Saathi
                  </div>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "9px 14px", borderRadius: "4px 16px 16px 16px",
                    background: c.botBubble, border: `1px solid ${c.border}`,
                  }}>
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        style={{ width: 7, height: 7, borderRadius: "50%", background: c.typingDot }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} style={{
              padding: "10px 12px", flexShrink: 0,
              borderTop: `1px solid ${c.border}`,
              display: "flex", gap: 8, alignItems: "center",
              background: c.bg,
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={stage === "ask_name" ? "Enter your name…" : "Ask Saathi anything…"}
                disabled={typing}
                style={{
                  flex: 1, padding: "9px 14px", borderRadius: 24,
                  border: `1px solid ${c.inputBorder}`,
                  background: c.inputBg, color: c.inputText,
                  fontSize: "0.82rem", fontFamily: "sans-serif",
                  outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = c.inputFocus; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = c.inputBorder; }}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                disabled={!input.trim() || typing}
                style={{
                  width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                  background: (!input.trim() || typing) ? c.sendInactive : c.sendActive,
                  border: "none",
                  cursor: (!input.trim() || typing) ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", transition: "background 0.2s",
                }}
              >
                <span style={{ color: c.sendColor, lineHeight: 1 }}>➤</span>
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
