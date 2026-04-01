import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

type Message = {
  id: number;
  from: "bot" | "user";
  text: string;
  quickReplies?: string[];
};

type Stage = "ask_name" | "chatting";

const TEMPLE_KB = {
  timings: {
    keywords: ["time", "timing", "aarti", "open", "close", "schedule", "puja", "hours", "when"],
    response: (name: string) =>
      `🪔 Here are our daily Puja timings, ${name}:\n\n🌅 Morning Aarti\n• Mangala Aarti — 4:30 AM\n• Shringar Aarti — 6:00 AM\n• Rajbhog Aarti — 11:30 AM\n\n🌙 Evening Aarti\n• Sandhya Aarti — 5:30 PM\n• Shayan Aarti — 7:00 PM\n• Shayan Bhog — 8:30 PM\n\nTemple is open from 4:00 AM to 9:00 PM daily. 🙏`,
    quickReplies: ["How to donate?", "About Temple", "Contact info"],
  },
  donation: {
    keywords: ["donat", "seva", "contribute", "help", "fund", "money", "pay", "offer"],
    response: (name: string) =>
      `🙏 ${name}, you can support the temple through various Seva options:\n\n• Nit Seva — Daily rituals\n• Abhishek Seva — Sacred bathing ceremony\n• Bhog Prasad Seva — Food offering\n• Diya Seva — Lamp offering\n• Flowers & Decoration Seva\n• Special Puja Booking\n\nClick the 'Donate Now' button at the top of the page to offer your seva. All donations are recorded securely.`,
    quickReplies: ["Puja timings", "Contact info", "About Temple"],
  },
  contact: {
    keywords: ["contact", "address", "location", "phone", "email", "reach", "find", "where", "call"],
    response: (_name: string) =>
      `📍 You can reach us at:\n\n🏛️ Temple Road, Ayodhya, UP 224123\n📞 +91 98765 43210\n✉️ info@shrirammandir.org\n🕐 Open: 4:00 AM – 9:00 PM\n\nFor special ceremony bookings or inquiries, please call or email us directly.`,
    quickReplies: ["Puja timings", "How to donate?", "About Temple"],
  },
  about: {
    keywords: ["about", "history", "temple", "mandir", "lord ram", "ram mandir", "story", "built", "who"],
    response: (_name: string) =>
      `🛕 Shri Ram Mandir is a sacred space dedicated to Lord Ram — a divine abode of peace and devotion.\n\nThe temple has been serving devotees since 1975 and is a centre of spiritual energy, daily worship, and community service. Our team of dedicated Pujaris performs all ceremonies with unwavering devotion.\n\nCome, seek blessings, and experience the eternal grace of Lord Ram. ॐ जय श्री राम`,
    quickReplies: ["Puja timings", "How to donate?", "Contact info"],
  },
  pujari: {
    keywords: ["pujari", "priest", "pandit", "team", "staff", "who performs", "who does"],
    response: (_name: string) =>
      `🙏 Our temple is blessed with a team of learned and devoted Pujaris who perform all daily ceremonies with great reverence.\n\nScroll to the 'Pujaris' section on the homepage to learn more about our priests and their sacred duties.`,
    quickReplies: ["Puja timings", "Contact info", "How to donate?"],
  },
  festival: {
    keywords: ["festival", "special", "occasion", "holiday", "diwali", "navratri", "ram navami", "hanuman"],
    response: (name: string) =>
      `✨ ${name}, on festivals and auspicious occasions we hold special Aarti ceremonies with extended timings.\n\nNotable festivals:\n• Ram Navami — Grand celebration of Lord Ram's birth\n• Diwali — Special Diya ceremony\n• Navratri — Nine nights of devotion\n• Hanuman Jayanti — Special Puja for Hanumanji\n\nPlease contact the temple office for specific festival schedules.`,
    quickReplies: ["Contact info", "Puja timings", "How to donate?"],
  },
  prasad: {
    keywords: ["prasad", "food", "langar", "bhog", "eat", "meal", "prashad"],
    response: (_name: string) =>
      `🍯 Prasad (sacred food offering) is distributed after every Aarti ceremony.\n\nThe Rajbhog Aarti at 11:30 AM includes a special Bhog Seva with abundant prasad. You can also sponsor the Bhog Prasad Seva through our donation page.`,
    quickReplies: ["Puja timings", "How to donate?", "Contact info"],
  },
  greeting: {
    keywords: ["hello", "hi", "hey", "jai", "namaste", "good morning", "good evening", "good afternoon"],
    response: (name: string) =>
      `🙏 Jai Shri Ram, ${name}! How may Saathi assist you today?`,
    quickReplies: ["Puja timings", "How to donate?", "About Temple", "Contact info"],
  },
};

const QUICK_TOPICS = ["Puja timings", "How to donate?", "About Temple", "Contact info", "Festival info", "Prasad info"];

function matchIntent(text: string): (typeof TEMPLE_KB)[keyof typeof TEMPLE_KB] | null {
  const lower = text.toLowerCase();
  for (const key of Object.keys(TEMPLE_KB) as (keyof typeof TEMPLE_KB)[]) {
    if (TEMPLE_KB[key].keywords.some((kw) => lower.includes(kw))) {
      return TEMPLE_KB[key];
    }
  }
  return null;
}

const FALLBACK = [
  (name: string) => `🙏 ${name}, I'm not sure about that — but I'd be happy to help with puja timings, donations, or contact information!`,
  (name: string) => `🪔 I didn't quite catch that, ${name}. Would you like to know about our temple schedule, seva options, or how to reach us?`,
  (_name: string) => `ॐ I'm best at answering questions about timings, donations, and the temple. Please try one of the quick topics below!`,
];

let msgId = 0;
const makeMsg = (from: Message["from"], text: string, quickReplies?: string[]): Message => ({
  id: ++msgId,
  from,
  text,
  quickReplies,
});

const INTRO_MSG: Message = makeMsg(
  "bot",
  "🙏 Jai Shri Ram! Namaste, welcome to Shri Ram Mandir.\n\nI'm Saathi, your temple guide. May I know your name so I can serve you better?"
);

export default function Chatbot() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("ask_name");
  const [visitorName, setVisitorName] = useState("");
  const [messages, setMessages] = useState<Message[]>([INTRO_MSG]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fallbackIdx = useRef(0);

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  const addBotMessage = (text: string, quickReplies?: string[]) => {
    setMessages((prev) => [...prev, makeMsg("bot", text, quickReplies)]);
    setTyping(false);
  };

  const sendUserMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, makeMsg("user", text)]);
    setInput("");
    setTyping(true);

    if (stage === "ask_name") {
      const name = text.trim().split(" ")[0];
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      setVisitorName(capitalized);
      setStage("chatting");
      setTimeout(() => {
        addBotMessage(
          `🌸 Namaste, ${capitalized}! So lovely to have you here.\n\nI'm Saathi — your guide at Shri Ram Mandir. How may I assist you today?`,
          QUICK_TOPICS
        );
      }, 700);
      return;
    }

    setTimeout(() => {
      const match = matchIntent(text);
      if (match) {
        addBotMessage(match.response(visitorName), match.quickReplies);
      } else {
        const fn = FALLBACK[fallbackIdx.current % FALLBACK.length];
        addBotMessage(fn(visitorName), QUICK_TOPICS.slice(0, 4));
        fallbackIdx.current++;
      }
    }, 650 + Math.random() * 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendUserMessage(input);
  };

  const colors = isLight
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
        inputPlaceholder: "rgba(74,26,0,0.4)",
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
        inputPlaceholder: "rgba(245,245,220,0.35)",
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
          background: colors.fabBg, border: "none", cursor: "pointer",
          boxShadow: `0 4px 24px ${colors.fabShadow}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.6rem",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: isLight ? "#FFF8E7" : "#1a0500", lineHeight: 1, fontSize: "1.1rem" }}>
              ✕
            </motion.span>
          ) : (
            <motion.span key="om"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ lineHeight: 1 }}>
              🙏
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 32, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            style={{
              position: "fixed", bottom: 98, right: 28, zIndex: 9997,
              width: 360, maxWidth: "calc(100vw - 32px)",
              height: 520, maxHeight: "calc(100vh - 130px)",
              borderRadius: 16,
              background: colors.bg,
              boxShadow: colors.shadow,
              border: `1px solid ${colors.border}`,
              display: "flex", flexDirection: "column", overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ background: colors.header, padding: "14px 18px", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.25rem", flexShrink: 0,
                }}>🛕</div>
                <div>
                  <div className="font-cinzel font-bold text-sm tracking-widest" style={{ color: colors.headerText }}>
                    Saathi
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }} />
                    <span className="font-sans text-xs" style={{ color: colors.headerSub }}>
                      Your Temple Guide · Jai Shri Ram 🙏
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1, overflowY: "auto", padding: "14px 14px 6px",
                display: "flex", flexDirection: "column", gap: 10,
                scrollbarWidth: "thin",
                scrollbarColor: `${colors.scrollbar} transparent`,
              }}
            >
              {messages.map((msg) => (
                <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.from === "user" ? "flex-end" : "flex-start" }}>
                  {msg.from === "bot" && (
                    <div className="font-cinzel" style={{ fontSize: "0.68rem", color: isLight ? "#C25B2F" : "#D4AF37", marginBottom: 3, letterSpacing: "0.06em", opacity: 0.8 }}>
                      Saathi
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      maxWidth: "84%",
                      padding: "9px 13px",
                      borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                      background: msg.from === "user" ? colors.userBubble : colors.botBubble,
                      color: msg.from === "user" ? colors.userText : colors.botText,
                      fontSize: "0.82rem",
                      lineHeight: 1.6,
                      border: msg.from === "bot" ? `1px solid ${colors.border}` : "none",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {msg.text}
                  </motion.div>

                  {msg.quickReplies && msg.from === "bot" && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 7, maxWidth: "92%" }}>
                      {msg.quickReplies.map((qr) => (
                        <motion.button
                          key={qr}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => sendUserMessage(qr)}
                          style={{
                            padding: "5px 12px", borderRadius: 20,
                            background: colors.qrBg,
                            border: `1px solid ${colors.qrBorder}`,
                            color: colors.qrText,
                            fontSize: "0.72rem", cursor: "pointer",
                            fontFamily: "'Cinzel', serif",
                            letterSpacing: "0.04em",
                            transition: "background 0.18s",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = colors.qrHover; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = colors.qrBg; }}
                        >
                          {qr}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="font-cinzel" style={{ fontSize: "0.68rem", color: isLight ? "#C25B2F" : "#D4AF37", marginBottom: 3, letterSpacing: "0.06em", opacity: 0.8 }}>
                    Saathi
                  </div>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "9px 14px", borderRadius: "4px 16px 16px 16px",
                    background: colors.botBubble,
                    border: `1px solid ${colors.border}`,
                  }}>
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        style={{ width: 7, height: 7, borderRadius: "50%", background: colors.typingDot }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <form
              onSubmit={handleSubmit}
              style={{
                padding: "10px 12px", flexShrink: 0,
                borderTop: `1px solid ${colors.border}`,
                display: "flex", gap: 8, alignItems: "center",
                background: colors.bg,
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={stage === "ask_name" ? "Enter your name…" : "Ask Saathi anything…"}
                disabled={typing}
                style={{
                  flex: 1, padding: "9px 14px", borderRadius: 24,
                  border: `1px solid ${colors.inputBorder}`,
                  background: colors.inputBg,
                  color: colors.inputText,
                  fontSize: "0.82rem",
                  fontFamily: "sans-serif",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = colors.inputFocus; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = colors.inputBorder; }}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                disabled={!input.trim() || typing}
                style={{
                  width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                  background: (!input.trim() || typing) ? colors.sendInactive : colors.sendActive,
                  border: "none",
                  cursor: (!input.trim() || typing) ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem",
                  transition: "background 0.2s",
                }}
              >
                <span style={{ color: colors.sendColor, lineHeight: 1 }}>➤</span>
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
