# Shri Ram Mandir — Temple Website

A premium, immersive temple website with interactive 3D model, animated door sequences, donation form with Supabase storage, and automated temple-themed thank-you emails.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 6
- **Hosting:** Vercel (with serverless API functions)
- **Database:** Supabase (donation storage)
- **3D Graphics:** Three.js, @react-three/fiber, @react-three/drei
- **Styling:** Tailwind CSS v4, Shadcn UI
- **Animations:** Framer Motion, GSAP
- **Email:** Nodemailer via Gmail SMTP
- **Routing:** Wouter
- **Package Manager:** npm

## Project Layout

```
/
├── api/
│   └── send-donation-email.js   # Vercel serverless function (email sending)
├── server/
│   ├── index.js                 # Local dev Express server (port 3001)
│   └── emailTemplate.js        # Shared HTML email template (used by both)
├── public/models/temple.glb    # 3D temple model
├── src/
│   ├── components/              # Navbar, Hero, 3D scene, etc.
│   ├── pages/DonatePage.tsx     # Donation form
│   └── lib/supabase.ts
├── .env.example                 # Template — copy to .env locally
├── vercel.json                  # Vercel build + routing config
└── vite.config.ts               # Proxies /api → localhost:3001 in dev
```

## How the Email Feature Works

1. User submits donation form → stored in Supabase
2. Frontend calls `POST /api/send-donation-email`
   - **On Vercel:** handled by `api/send-donation-email.js` (serverless function)
   - **Locally:** proxied by Vite to Express server on port 3001
3. Nodemailer sends a beautiful temple-themed HTML email via Gmail SMTP
4. Email failure is non-blocking — donation still succeeds

## Local Development

```bash
# 1. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 2. Install dependencies
npm install

# 3. Start frontend (port 5000) — in one terminal
npm run dev

# 4. Start email backend (port 3001) — in another terminal
npm run server
```

## Vercel Deployment

The site deploys automatically from Git. To enable email sending:

1. Go to **Vercel Dashboard → Project → Settings → Environment Variables**
2. Add these variables:

| Variable | Value |
|---|---|
| `GMAIL_USER` | your Gmail address |
| `GMAIL_APP_PASSWORD` | Gmail App Password (see below) |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |

3. **Redeploy** the project for env vars to take effect

### Gmail App Password Setup

1. Enable 2-Step Verification: myaccount.google.com/security
2. Create App Password: myaccount.google.com/apppasswords
3. Select "Mail" → generate → copy the 16-character password

## Environment Variables

See `.env.example` for the full list with descriptions.
