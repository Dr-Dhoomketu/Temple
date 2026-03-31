export function buildDonationEmail({ name, seva_type, amount, payment_method, donation_id }) {
  const formattedAmount = Number(amount).toLocaleString("en-IN");
  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  const paymentLabels = {
    upi: "UPI",
    card: "Credit / Debit Card",
    netbanking: "Net Banking",
    cash: "Cash / Demand Draft",
  };

  const sevaData = {
    "Nityaseva":     { icon: "🪔", color: "#E07000", light: "#FFF3E0", border: "#FFB74D", tagBg: "#FFF8F0", desc: "Eternal Lamp Lighting" },
    "Bhog Seva":     { icon: "🍯", color: "#B8860B", light: "#FFFDE7", border: "#F5D060", tagBg: "#FFFDF0", desc: "Sacred Food Offering" },
    "Mahotsav Seva": { icon: "🎊", color: "#7B3FA0", light: "#F3E8FF", border: "#C084FC", tagBg: "#FAF0FF", desc: "Festival Sponsorship" },
    "Mandir Nidhi":  { icon: "🏛️", color: "#1565C0", light: "#E3F2FD", border: "#64B5F6", tagBg: "#F0F8FF", desc: "Temple Development Fund" },
    "Annadaan":      { icon: "🌾", color: "#2E7D32", light: "#E8F5E9", border: "#66BB6A", tagBg: "#F0FFF2", desc: "Free Food for All" },
    "Chikitsa Seva": { icon: "🏥", color: "#00695C", light: "#E0F2F1", border: "#4DB6AC", tagBg: "#F0FFFD", desc: "Medical Aid Camp" },
  };

  const seva = sevaData[seva_type] || {
    icon: "🙏", color: "#B8860B", light: "#FFFDE7", border: "#F5D060", tagBg: "#FFFDF0", desc: seva_type,
  };
  const paymentLabel = paymentLabels[payment_method] || payment_method || "—";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Jai Shri Ram — Donation Receipt</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: #F5F0E8;
      font-family: 'EB Garamond', Georgia, serif;
      color: #2C1810;
      -webkit-font-smoothing: antialiased;
    }

    .wrapper {
      max-width: 620px;
      margin: 24px auto;
      background: #FFFFFF;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 4px 32px rgba(0,0,0,0.12);
    }

    /* ── TOP BORDER STRIP ── */
    .border-strip {
      height: 6px;
      background: linear-gradient(90deg, #8B1A00, #D4AF37, #FFE680, #D4AF37, #8B1A00);
    }

    /* ── HEADER ── */
    .header {
      background: linear-gradient(170deg, #3D0A00 0%, #5C1500 50%, #3D0A00 100%);
      padding: 44px 40px 36px;
      text-align: center;
      position: relative;
    }

    .header::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 80% 70% at 50% 30%, rgba(212,175,55,0.25) 0%, transparent 65%);
      pointer-events: none;
    }

    .om-symbol {
      font-size: 54px;
      line-height: 1;
      margin-bottom: 12px;
      display: block;
      color: #FFD700;
      filter: drop-shadow(0 0 20px rgba(212,175,55,0.8));
    }

    .temple-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin: 0 0 16px;
    }

    .temple-divider span {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 0.5em;
      color: rgba(212,175,55,0.7);
      text-transform: uppercase;
    }

    .temple-divider::before,
    .temple-divider::after {
      content: '';
      flex: 1;
      max-width: 70px;
      height: 1px;
      background: rgba(212,175,55,0.45);
    }

    .header-title {
      font-family: 'Cinzel', serif;
      font-size: 30px;
      font-weight: 700;
      color: #FFD700;
      letter-spacing: 0.1em;
      text-shadow: 0 0 30px rgba(212,175,55,0.5);
      margin-bottom: 6px;
    }

    .header-subtitle {
      font-family: 'Cinzel', serif;
      font-size: 10px;
      letter-spacing: 0.5em;
      color: rgba(212,175,55,0.65);
      text-transform: uppercase;
    }

    /* ── MANTRA STRIP ── */
    .mantra-strip {
      background: ${seva.light};
      border-top: 2px solid ${seva.border}66;
      border-bottom: 2px solid ${seva.border}66;
      padding: 14px 24px;
      text-align: center;
      font-style: italic;
      font-size: 15px;
      color: ${seva.color};
      letter-spacing: 0.03em;
    }

    /* ── MAIN BODY ── */
    .body {
      padding: 36px 40px;
      background: #FFFFFF;
    }

    .greeting {
      font-size: 17px;
      color: #3C2410;
      line-height: 1.8;
      margin-bottom: 28px;
    }

    .greeting strong {
      color: ${seva.color};
      font-weight: 600;
    }

    /* ── SEVA HIGHLIGHT BOX ── */
    .seva-box {
      background: linear-gradient(135deg, ${seva.light} 0%, #FFFFFF 100%);
      border: 2px solid ${seva.border};
      border-radius: 4px;
      padding: 28px 30px;
      text-align: center;
      margin-bottom: 32px;
      box-shadow: 0 4px 24px ${seva.border}44;
      position: relative;
    }

    .seva-box::before,
    .seva-box::after {
      content: '✦';
      position: absolute;
      top: 12px;
      font-size: 11px;
      color: ${seva.border};
    }
    .seva-box::before { left: 16px; }
    .seva-box::after  { right: 16px; }

    .seva-icon {
      font-size: 44px;
      display: block;
      margin-bottom: 10px;
    }

    .seva-label {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 0.5em;
      color: ${seva.color}99;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .seva-name {
      font-family: 'Cinzel', serif;
      font-size: 22px;
      font-weight: 600;
      color: ${seva.color};
      margin-bottom: 6px;
    }

    .seva-desc {
      font-size: 13px;
      color: ${seva.color}99;
      margin-bottom: 16px;
    }

    .amount-display {
      font-family: 'Cinzel', serif;
      font-size: 42px;
      font-weight: 700;
      color: #2C1810;
      line-height: 1;
    }

    .amount-display sup {
      font-size: 24px;
      font-weight: 400;
      vertical-align: super;
      margin-right: 2px;
      color: ${seva.color};
    }

    /* ── RECEIPT TABLE ── */
    .section-label {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 0.5em;
      color: ${seva.color}bb;
      text-transform: uppercase;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-label::after {
      content: '';
      flex: 1;
      height: 1px;
      background: ${seva.border}66;
    }

    .receipt-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
      background: ${seva.tagBg};
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid ${seva.border}44;
    }

    .receipt-table tr {
      border-bottom: 1px solid ${seva.border}33;
    }

    .receipt-table tr:last-child { border-bottom: none; }

    .receipt-table td {
      padding: 12px 16px;
      font-size: 14px;
      vertical-align: top;
    }

    .receipt-table td:first-child {
      color: #7A5C40;
      width: 42%;
      font-size: 13px;
    }

    .receipt-table td:last-child {
      color: #2C1810;
      font-weight: 500;
      text-align: right;
    }

    .receipt-table .highlight-row { background: ${seva.light}; }
    .receipt-table .highlight-row td:last-child {
      color: ${seva.color};
      font-family: 'Cinzel', serif;
      font-size: 16px;
      font-weight: 700;
    }

    /* ── DONATION ID BADGE ── */
    .donation-id-wrap {
      text-align: center;
      margin-bottom: 28px;
    }

    .donation-id-badge {
      display: inline-block;
      background: ${seva.tagBg};
      border: 1px solid ${seva.border};
      border-radius: 4px;
      padding: 10px 24px;
      font-family: 'Cinzel', serif;
      font-size: 12px;
      letter-spacing: 0.2em;
      color: ${seva.color};
    }

    /* ── BLESSING BOX ── */
    .blessing-box {
      background: #FFFBF3;
      border-left: 4px solid #D4AF37;
      border-radius: 0 4px 4px 0;
      padding: 18px 22px;
      margin-bottom: 28px;
      font-style: italic;
      font-size: 15px;
      line-height: 1.85;
      color: #5C3D20;
    }

    .blessing-box cite {
      display: block;
      margin-top: 10px;
      font-style: normal;
      font-family: 'Cinzel', serif;
      font-size: 10px;
      letter-spacing: 0.28em;
      color: #B8860B;
    }

    /* ── CTA ── */
    .cta-wrap {
      text-align: center;
      margin-bottom: 32px;
    }

    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, ${seva.color}, ${seva.color}cc);
      color: #FFFFFF;
      font-family: 'Cinzel', serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      text-decoration: none;
      padding: 14px 40px;
      border-radius: 3px;
    }

    /* ── SIGNATURE ── */
    .signature {
      border-top: 1px solid #E8D8C0;
      padding-top: 24px;
      font-size: 14px;
      color: #6B4C30;
      line-height: 1.9;
    }

    .signature strong {
      display: block;
      font-family: 'Cinzel', serif;
      font-size: 14px;
      color: #3D0A00;
      margin-bottom: 4px;
      font-weight: 600;
    }

    /* ── FOOTER ── */
    .footer {
      background: #3D0A00;
      padding: 24px 40px;
      text-align: center;
    }

    .footer-om {
      font-size: 24px;
      display: block;
      margin-bottom: 10px;
      color: rgba(212,175,55,0.7);
    }

    .footer p {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 0.4em;
      color: rgba(212,175,55,0.5);
      text-transform: uppercase;
      line-height: 2;
    }

    .footer .tax {
      font-family: Georgia, serif;
      font-size: 11px;
      letter-spacing: 0.02em;
      color: rgba(212,175,55,0.4);
      margin-top: 8px;
    }

    .footer .tiny {
      font-family: Georgia, serif;
      font-size: 10px;
      color: rgba(212,175,55,0.25);
      margin-top: 10px;
    }
  </style>
</head>
<body>
<div class="wrapper">

  <div class="border-strip"></div>

  <div class="header">
    <span class="om-symbol">ॐ</span>
    <div class="temple-divider"><span>Shri Ram Mandir</span></div>
    <h1 class="header-title">Jai Shri Ram</h1>
    <p class="header-subtitle">✦ Your Seva Has Been Received ✦</p>
  </div>

  <div class="mantra-strip">
    "रामो विग्रहवान् धर्मः" — Lord Rama is Dharma Incarnate
  </div>

  <div class="body">

    <p class="greeting">
      Namaste, <strong>${name}</strong>,<br /><br />
      May the blessings of Lord Shri Ram and Mata Sita shower upon you and your family.
      Your generous offering to the Mandir has been received with great devotion and gratitude.
      Every seva lights a sacred lamp — and yours burns brightly today.
    </p>

    <div class="seva-box">
      <span class="seva-icon">${seva.icon}</span>
      <p class="seva-label">Seva Chosen</p>
      <p class="seva-name">${seva_type}</p>
      <p class="seva-desc">${seva.desc}</p>
      <p class="amount-display"><sup>₹</sup>${formattedAmount}</p>
    </div>

    <p class="section-label">❋ Donation Details</p>
    <table class="receipt-table">
      <tr>
        <td>Devotee Name</td>
        <td>${name}</td>
      </tr>
      <tr>
        <td>Seva Type</td>
        <td>${seva.icon} ${seva_type}</td>
      </tr>
      <tr class="highlight-row">
        <td>Amount</td>
        <td>₹${formattedAmount}</td>
      </tr>
      <tr>
        <td>Payment Method</td>
        <td>${paymentLabel}</td>
      </tr>
      <tr>
        <td>Date</td>
        <td>${date}</td>
      </tr>
    </table>

    <div class="donation-id-wrap">
      <div class="donation-id-badge">Donation Reference: ${donation_id || "—"}</div>
    </div>

    <div class="blessing-box">
      "He who serves the Lord with a pure heart, offering his wealth, his time, or his love —
      the Lord accepts it all with equal grace. Your offering is a prayer in itself."
      <cite>— Inspired by the Ramacharitmanas of Goswami Tulsidas</cite>
    </div>

    <div class="cta-wrap">
      <a href="https://shrirammandir.replit.app/" class="cta-btn">Visit the Mandir</a>
    </div>

    <div class="signature">
      <strong>Shri Ram Mandir — Seva Samiti</strong>
      With folded hands and a grateful heart,<br />
      the Seva Samiti thanks you for your generous contribution.<br />
      May Lord Ram bless you with peace, prosperity, and divine grace. 🙏
    </div>

  </div>

  <div class="footer">
    <span class="footer-om">ॐ</span>
    <p>Shri Ram Mandir &nbsp;·&nbsp; Temple Trust &nbsp;·&nbsp; Ayodhya</p>
    <p class="tax">All donations may be eligible for tax exemption under Section 80G of the Income Tax Act, 1961.</p>
    <p class="tiny">This is an automated receipt. Please retain for your records.</p>
  </div>

  <div class="border-strip"></div>

</div>
</body>
</html>`;
}
