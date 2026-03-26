# Shri Ram Mandir — Temple Website

A premium, immersive temple website with interactive 3D model, animated door sequences, donation form, and automated thank-you email receipts.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 6
- **3D Graphics:** Three.js, @react-three/fiber, @react-three/drei
- **Styling:** Tailwind CSS v4, Shadcn UI
- **Animations:** Framer Motion, GSAP
- **Backend/BaaS:** Supabase (donation storage)
- **Email:** Nodemailer via Gmail SMTP (Express backend)
- **Routing:** Wouter
- **Package Manager:** npm

## Project Layout

```
/
├── public/models/temple.glb   # 3D temple model
├── server/
│   ├── index.js               # Express email server (port 3001)
│   └── emailTemplate.js       # Beautiful HTML temple-themed email
├── src/
│   ├── components/            # Navbar, Hero, 3D scene, etc.
│   ├── context/ThemeContext.tsx
│   ├── lib/supabase.ts
│   ├── pages/DonatePage.tsx   # Donation form (calls /api/send-donation-email)
│   └── App.tsx
├── .env.example               # Copy to .env and fill in values
├── vite.config.ts             # Proxies /api → localhost:3001
└── package.json
```

## Development

```bash
# 1. Copy and fill in environment variables
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Run the frontend (port 5000)
npm run dev

# 4. Run the email backend (port 3001) — separate terminal
npm run server
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `GMAIL_USER` | Your Gmail address (e.g. you@gmail.com) |
| `GMAIL_APP_PASSWORD` | Gmail App Password (from myaccount.google.com/apppasswords) |
| `EMAIL_SERVER_PORT` | Port for email server (default: 3001) |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |

### Gmail App Password Setup
1. Enable 2-Step Verification on your Google account
2. Go to myaccount.google.com/apppasswords
3. Generate a new app password for "Mail"
4. Paste the 16-character password as `GMAIL_APP_PASSWORD`

## How the Email Feature Works

1. User fills in donation form (name, email, seva, amount)
2. Form submits to Supabase → donation stored in DB
3. Frontend calls `POST /api/send-donation-email` (proxied to port 3001)
4. Express server sends a beautiful HTML email via Gmail SMTP
5. User sees the success screen; email arrives in their inbox

The email API call is fire-and-forget — if email fails, the donation still succeeds.

## Deployment (portable — works anywhere)

```bash
# Build frontend
npm run build          # outputs to /dist

# Serve static files + run email server
npm run server         # email API on port 3001
# Serve dist/ with nginx, Apache, or any static host
```

The email server is a plain Node.js Express app — deploy it on any VPS, Railway, Render, Fly.io, etc. Set the env vars there and it works identically.

## Vite Watcher Exclusions

Vite is configured to ignore `.local/`, `.cache/`, `server/`, and `node_modules/` to prevent unwanted hot-reloads from Replit's internal state files.
