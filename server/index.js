import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import { buildDonationEmail } from "./emailTemplate.js";

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

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", gmail: !!process.env.GMAIL_USER });
});

app.listen(PORT, "localhost", () => {
  console.log(`[Server] Email server running on http://localhost:${PORT}`);
});
