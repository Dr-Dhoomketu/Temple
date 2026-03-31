import nodemailer from "nodemailer";
import { buildDonationEmail } from "../server/emailTemplate.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, seva_type, amount, payment_method, donation_id } = req.body;

  if (!email || !name || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    console.warn("[Email] Gmail credentials not set — skipping email.");
    return res.status(503).json({ error: "Email service not configured" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    const html = buildDonationEmail({ name, email, seva_type, amount, payment_method, donation_id });

    await transporter.sendMail({
      from: `"Shri Ram Mandir" <${gmailUser}>`,
      to: email,
      subject: `🪷 Jai Shri Ram! Your Seva is Recorded — ${seva_type}`,
      html,
    });

    console.log(`[Email] Sent receipt to ${email} — ${donation_id}`);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("[Email Error]", err.message);
    res.status(500).json({ error: err.message });
  }
}
