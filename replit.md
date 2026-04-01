# Shri Ram Mandir — Temple Website

## Project Overview
A React + Vite frontend with an Express email backend for the Shri Ram Mandir temple website. Features include a 3D temple model, donation system with Supabase, and email receipts via Gmail.

## Architecture
- **Frontend**: React 18 + Vite, TailwindCSS v4, Three.js / React Three Fiber, Framer Motion, GSAP
- **Backend**: Express server (`server/index.js`) for sending donation emails via Gmail (port 3001)
- **Database**: Supabase (donations table)
- **Routing**: Wouter (client-side)

## Key Files
- `src/` — React app source (pages, components, hooks, context)
- `server/index.js` — Express email server
- `server/emailTemplate.js` — Donation email HTML builder
- `api/send-donation-email.js` — Original Vercel serverless handler (kept for reference)
- `vite.config.ts` — Vite config with proxy `/api → localhost:3001`
- `ram_temple.glb` — 3D model asset

## Environment Variables Required
- `GMAIL_USER` — Gmail address for sending donation receipts
- `GMAIL_APP_PASSWORD` — Gmail App Password (16-char, from myaccount.google.com/apppasswords)
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anonymous key

## Running the App
- `npm run dev` — Starts Express server (port 3001) + Vite dev server (port 5000)
- Vite proxies `/api/*` requests to the Express server

## Replit Configuration
- Workflow: "Start application" → `npm run dev` → port 5000 (webview)
- Package manager: npm
