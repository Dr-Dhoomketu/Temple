import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildDonationEmail } from "./emailTemplate.js";

process.on("uncaughtException", (err) => {
  console.error("[Server] Uncaught exception (kept alive):", err.message);
});
process.on("unhandledRejection", (reason) => {
  console.error("[Server] Unhandled rejection (kept alive):", reason);
});

const app = express();
const PORT = process.env.EMAIL_SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());

function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "GMAIL_USER and GMAIL_APP_PASSWORD are not set. Add them to your .env file."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

const gmailReady = !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
if (!gmailReady) {
  console.warn("[Server] ⚠️  Gmail credentials not found in environment.");
  console.warn("[Server]    Add GMAIL_USER and GMAIL_APP_PASSWORD to your .env file.");
  console.warn("[Server]    Email sending will return an error until credentials are set.");
}

app.post("/api/send-donation-email", async (req, res) => {
  const { name, email, seva_type, amount, payment_method, donation_id } = req.body;

  if (!email || !name || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transporter = createTransporter();
    const html = buildDonationEmail({ name, email, seva_type, amount, payment_method, donation_id });

    await transporter.sendMail({
      from: `"Shri Ram Mandir" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `🪷 Jai Shri Ram! Your Seva is Recorded — ${seva_type}`,
      html,
    });

    console.log(`[Email] Sent donation receipt to ${email} — ${donation_id}`);
    res.json({ success: true, message: "Thank-you email sent!" });
  } catch (err) {
    console.error("[Email Error]", err.message);
    res.status(500).json({ error: err.message });
  }
});

const TEMPLE_SYSTEM_PROMPT = `You are Saathi, a warm and knowledgeable temple guide chatbot for Shri Ram Mandir — a Hindu temple dedicated to Lord Ram, located in Ayodhya, UP, India.

Temple details you know:
- Address: Temple Road, Ayodhya, UP 224123
- Phone: +91 98765 43210
- Email: info@shrirammandir.org
- Open: 4:00 AM – 9:00 PM daily

Daily Puja timings:
Morning: Mangala Aarti 4:30 AM, Shringar Aarti 6:00 AM, Rajbhog Aarti 11:30 AM
Evening: Sandhya Aarti 5:30 PM, Shayan Aarti 7:00 PM, Shayan Bhog 8:30 PM

Seva/Donation options: Nit Seva, Abhishek Seva, Bhog Prasad Seva, Diya Seva, Flowers & Decoration Seva, Special Puja Booking.

Guidelines:
- Always greet visitors warmly and use their name when you know it
- Speak respectfully, with devotion. Use "🙏" and "Jai Shri Ram" naturally but not excessively
- Answer questions about Hinduism, Lord Ram, temple rituals, festivals, and spirituality with accuracy and reverence
- For questions outside the temple or religion scope, you can answer them helpfully as a knowledgeable guide would
- Keep responses concise — 2-5 sentences unless detail is needed
- Use simple formatting with line breaks where helpful
- Never make up specific facts about this temple that aren't given above`;

const geminiReady = !!process.env.GEMINI_API_KEY;
let genAI, geminiModel;
if (geminiReady) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  geminiModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: TEMPLE_SYSTEM_PROMPT,
  });
} else {
  console.warn("[Server] ⚠️  GEMINI_API_KEY not set — chatbot AI will be unavailable.");
}

app.post("/api/chat", async (req, res) => {
  if (!geminiReady) {
    return res.status(503).json({ error: "AI not configured" });
  }

  const { message, history, visitorName } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing message" });
  }

  try {
    const contextPrefix = visitorName ? `[Visitor's name is ${visitorName}] ` : "";
    const chat = geminiModel.startChat({
      history: (history || []).map((m) => ({
        role: m.from === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })),
    });

    const result = await chat.sendMessage(contextPrefix + message);
    const text = result.response.text();
    res.json({ reply: text });
  } catch (err) {
    console.error("[Gemini Error]", err.message);
    res.status(500).json({ error: "AI response failed" });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", gmail: !!process.env.GMAIL_USER, gemini: geminiReady });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Server] Express server running on port ${PORT}`);
});
