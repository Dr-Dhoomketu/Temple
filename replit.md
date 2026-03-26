# Shri Ram Mandir — Temple Website

A premium, immersive temple website inspired by the Akshardham Temple in New Delhi, featuring an interactive 3D temple model, animated door sequences, and standard temple website sections.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 6
- **3D Graphics:** Three.js, @react-three/fiber, @react-three/drei
- **Styling:** Tailwind CSS v4, Shadcn UI
- **Animations:** Framer Motion, GSAP
- **Backend/BaaS:** Supabase (optional — for donation form data storage)
- **Routing:** Wouter
- **Package Manager:** npm

## Project Layout

```
/
├── public/
│   ├── models/temple.glb     # 3D temple model
│   ├── favicon.svg
│   └── opengraph.jpg
├── src/
│   ├── components/           # React components (Navbar, Hero, 3D, etc.)
│   ├── context/              # ThemeContext
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # supabase.ts, utils.ts
│   ├── pages/                # DonatePage
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts
└── package.json
```

## Development

```bash
npm install
npm run dev   # starts on port 5000
```

## Environment Variables

- `VITE_SUPABASE_URL` — Supabase project URL (optional)
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key (optional)

If Supabase env vars are not set, the donation form will show a warning but the rest of the site functions normally.

## Deployment

Configured as a static site deployment:
- Build command: `npm run build`
- Output directory: `dist`
