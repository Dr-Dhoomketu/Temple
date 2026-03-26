export function buildDonationEmail({ name, seva_type, amount, payment_method, donation_id }) {
  const formattedAmount = Number(amount).toLocaleString("en-IN");
  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const paymentLabels = {
    upi: "UPI",
    card: "Credit / Debit Card",
    netbanking: "Net Banking",
    cash: "Cash / Demand Draft",
  };

  const sevaIcons = {
    "Nityaseva": "🪔",
    "Bhog Seva": "🍯",
    "Mahotsav Seva": "🎊",
    "Mandir Nidhi": "🏛️",
    "Annadaan": "🌾",
    "Chikitsa Seva": "🏥",
  };

  const sevaIcon = sevaIcons[seva_type] || "🙏";
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
      background: #0a0101;
      font-family: 'EB Garamond', Georgia, serif;
      color: #F5F5DC;
      -webkit-font-smoothing: antialiased;
    }

    .wrapper {
      max-width: 620px;
      margin: 0 auto;
      background: #0a0101;
    }

    /* ── TOP BORDER STRIP ── */
    .border-strip {
      height: 5px;
      background: linear-gradient(90deg, #6b3a00, #D4AF37, #F5E088, #D4AF37, #6b3a00);
    }

    /* ── HEADER ── */
    .header {
      background: linear-gradient(180deg, #130202 0%, #1c0303 60%, #0a0101 100%);
      padding: 44px 40px 36px;
      text-align: center;
      position: relative;
      border-bottom: 1px solid rgba(212,175,55,0.2);
    }

    .header::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 70% 60% at 50% 20%, rgba(212,175,55,0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    .om-symbol {
      font-size: 52px;
      line-height: 1;
      margin-bottom: 12px;
      display: block;
      filter: drop-shadow(0 0 18px rgba(212,175,55,0.6));
    }

    .temple-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin: 0 0 18px;
    }

    .temple-divider span {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 0.5em;
      color: rgba(212,175,55,0.5);
      text-transform: uppercase;
    }

    .temple-divider::before,
    .temple-divider::after {
      content: '';
      flex: 1;
      max-width: 80px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212,175,55,0.5));
    }

    .temple-divider::after {
      background: linear-gradient(90deg, rgba(212,175,55,0.5), transparent);
    }

    .header-title {
      font-family: 'Cinzel', serif;
      font-size: 28px;
      font-weight: 700;
      color: #D4AF37;
      letter-spacing: 0.08em;
      text-shadow: 0 0 30px rgba(212,175,55,0.4);
      margin-bottom: 6px;
    }

    .header-subtitle {
      font-family: 'Cinzel', serif;
      font-size: 10px;
      letter-spacing: 0.55em;
      color: rgba(212,175,55,0.55);
      text-transform: uppercase;
    }

    /* ── MANTRA STRIP ── */
    .mantra-strip {
      background: rgba(212,175,55,0.07);
      border-top: 1px solid rgba(212,175,55,0.15);
      border-bottom: 1px solid rgba(212,175,55,0.15);
      padding: 14px 24px;
      text-align: center;
      font-style: italic;
      font-size: 15px;
      color: rgba(212,175,55,0.75);
      letter-spacing: 0.04em;
    }

    /* ── MAIN BODY ── */
    .body {
      padding: 36px 40px;
    }

    .greeting {
      font-size: 17px;
      color: rgba(245,245,220,0.85);
      line-height: 1.75;
      margin-bottom: 28px;
    }

    .greeting strong {
      color: #D4AF37;
      font-weight: 600;
    }

    /* ── SEVA HIGHLIGHT BOX ── */
    .seva-box {
      background: linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%);
      border: 1px solid rgba(212,175,55,0.4);
      border-radius: 2px;
      padding: 28px 30px;
      text-align: center;
      margin-bottom: 32px;
      box-shadow: 0 0 40px rgba(212,175,55,0.08), inset 0 1px 0 rgba(212,175,55,0.15);
      position: relative;
    }

    .seva-box::before,
    .seva-box::after {
      content: '✦';
      position: absolute;
      top: 12px;
      font-size: 10px;
      color: rgba(212,175,55,0.4);
    }

    .seva-box::before { left: 14px; }
    .seva-box::after  { right: 14px; }

    .seva-icon {
      font-size: 38px;
      display: block;
      margin-bottom: 10px;
    }

    .seva-label {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 0.55em;
      color: rgba(212,175,55,0.55);
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .seva-name {
      font-family: 'Cinzel', serif;
      font-size: 20px;
      font-weight: 600;
      color: #F5E088;
      margin-bottom: 16px;
      text-shadow: 0 0 20px rgba(212,175,55,0.3);
    }

    .amount-display {
      font-family: 'Cinzel', serif;
      font-size: 38px;
      font-weight: 700;
      color: #D4AF37;
      text-shadow: 0 0 30px rgba(212,175,55,0.5);
      line-height: 1;
    }

    .amount-display sup {
      font-size: 22px;
      font-weight: 400;
      vertical-align: super;
      margin-right: 2px;
    }

    /* ── RECEIPT TABLE ── */
    .section-label {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 0.55em;
      color: rgba(212,175,55,0.5);
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
      background: rgba(212,175,55,0.2);
    }

    .receipt-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }

    .receipt-table tr {
      border-bottom: 1px solid rgba(212,175,55,0.08);
    }

    .receipt-table tr:last-child {
      border-bottom: none;
    }

    .receipt-table td {
      padding: 11px 0;
      font-size: 14px;
      vertical-align: top;
    }

    .receipt-table td:first-child {
      color: rgba(245,245,220,0.4);
      width: 40%;
      font-size: 13px;
    }

    .receipt-table td:last-child {
      color: rgba(245,245,220,0.9);
      font-weight: 500;
      text-align: right;
    }

    .receipt-table .highlight-row td:last-child {
      color: #D4AF37;
      font-family: 'Cinzel', serif;
      font-size: 15px;
      font-weight: 700;
    }

    /* ── DONATION ID BADGE ── */
    .donation-id-wrap {
      text-align: center;
      margin-bottom: 32px;
    }

    .donation-id-badge {
      display: inline-block;
      background: rgba(212,175,55,0.08);
      border: 1px solid rgba(212,175,55,0.35);
      padding: 10px 24px;
      font-family: 'Cinzel', serif;
      font-size: 11px;
      letter-spacing: 0.2em;
      color: rgba(212,175,55,0.8);
    }

    /* ── BLESSING BOX ── */
    .blessing-box {
      background: rgba(212,175,55,0.04);
      border-left: 3px solid rgba(212,175,55,0.4);
      padding: 18px 22px;
      margin-bottom: 32px;
      font-style: italic;
      font-size: 15px;
      line-height: 1.8;
      color: rgba(245,245,220,0.65);
    }

    .blessing-box cite {
      display: block;
      margin-top: 10px;
      font-style: normal;
      font-family: 'Cinzel', serif;
      font-size: 10px;
      letter-spacing: 0.3em;
      color: rgba(212,175,55,0.5);
    }

    /* ── CTA ── */
    .cta-wrap {
      text-align: center;
      margin-bottom: 36px;
    }

    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, #F5E088 0%, #D4AF37 50%, #c8a84b 100%);
      color: #1a0303;
      font-family: 'Cinzel', serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      text-decoration: none;
      padding: 14px 36px;
      border-radius: 1px;
    }

    /* ── SIGNATURE ── */
    .signature {
      border-top: 1px solid rgba(212,175,55,0.15);
      padding-top: 24px;
      font-size: 14px;
      color: rgba(245,245,220,0.5);
      line-height: 1.9;
    }

    .signature strong {
      display: block;
      font-family: 'Cinzel', serif;
      font-size: 13px;
      color: rgba(212,175,55,0.8);
      margin-bottom: 2px;
      font-weight: 600;
    }

    /* ── FOOTER ── */
    .footer {
      background: #060000;
      border-top: 1px solid rgba(212,175,55,0.12);
      padding: 24px 40px;
      text-align: center;
    }

    .footer-om {
      font-size: 22px;
      display: block;
      margin-bottom: 10px;
      opacity: 0.5;
    }

    .footer p {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 0.45em;
      color: rgba(212,175,55,0.35);
      text-transform: uppercase;
      line-height: 2;
    }

    .footer .tax {
      font-family: Georgia, serif;
      font-size: 11px;
      letter-spacing: 0.02em;
      color: rgba(245,245,220,0.2);
      margin-top: 8px;
    }
  </style>
</head>
<body>
<div class="wrapper">

  <!-- Border Strip -->
  <div class="border-strip"></div>

  <!-- Header -->
  <div class="header">
    <span class="om-symbol">ॐ</span>
    <div class="temple-divider"><span>Shri Ram Mandir</span></div>
    <h1 class="header-title">Jai Shri Ram</h1>
    <p class="header-subtitle">✦ Your Seva Has Been Received ✦</p>
  </div>

  <!-- Mantra Strip -->
  <div class="mantra-strip">
    "रामो विग्रहवान् धर्मः" — Lord Rama is Dharma Incarnate
  </div>

  <!-- Body -->
  <div class="body">

    <!-- Greeting -->
    <p class="greeting">
      Namaste, <strong>${name}</strong>,<br /><br />
      May the blessings of Lord Shri Ram and Mata Sita shower upon you and your family.
      Your generous offering to the Mandir has been received with great devotion and gratitude.
      Every seva lights a sacred lamp — and yours burns brightly today.
    </p>

    <!-- Seva Highlight -->
    <div class="seva-box">
      <span class="seva-icon">${sevaIcon}</span>
      <p class="seva-label">Seva Chosen</p>
      <p class="seva-name">${seva_type}</p>
      <p class="amount-display"><sup>₹</sup>${formattedAmount}</p>
    </div>

    <!-- Receipt -->
    <p class="section-label">❋ Donation Details</p>
    <table class="receipt-table">
      <tr>
        <td>Devotee Name</td>
        <td>${name}</td>
      </tr>
      <tr>
        <td>Seva Type</td>
        <td>${seva_type}</td>
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

    <!-- Donation ID -->
    <div class="donation-id-wrap">
      <div class="donation-id-badge">Donation Reference: ${donation_id || "—"}</div>
    </div>

    <!-- Blessing -->
    <div class="blessing-box">
      "He who serves the Lord with a pure heart, offering his wealth, his time, or his love —
      the Lord accepts it all with equal grace. Your offering is a prayer in itself."
      <cite>— Inspired by the Ramacharitmanas of Goswami Tulsidas</cite>
    </div>

    <!-- CTA -->
    <div class="cta-wrap">
      <a href="https://temple-opal-pi.vercel.app/" class="cta-btn">Visit the Mandir</a>
    </div>

    <!-- Signature -->
    <div class="signature">
      <strong>Shri Ram Mandir</strong>
      With folded hands and a grateful heart,<br />
      The Seva Samiti thanks you for your generous contribution.<br />
      May Lord Ram bless you with peace, prosperity, and divine grace. 🙏
    </div>

  </div>

  <!-- Footer -->
  <div class="footer">
    <span class="footer-om">ॐ</span>
    <p>Shri Ram Mandir &nbsp;·&nbsp; Temple Trust &nbsp;·&nbsp; Ayodhya</p>
    <p class="tax">All donations are eligible for tax exemption under Section 80G of the Income Tax Act, 1961.</p>
    <p style="margin-top:14px; font-size:9px; color:rgba(212,175,55,0.2);">
      This is an automated receipt. Please retain for your records.
    </p>
  </div>

  <!-- Bottom Border Strip -->
  <div class="border-strip"></div>

</div>
</body>
</html>`;
}
