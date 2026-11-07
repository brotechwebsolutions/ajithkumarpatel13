# 3D Portfolio (Next.js + React Three Fiber + Gemini chatbot)

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env.local` and add your free key from https://aistudio.google.com/apikey
3. `npm run dev` → http://localhost:3000

## Deploy on Vercel
1. Push this folder to a GitHub repo and import it at vercel.com/new (framework: Next.js, no changes needed).
2. In Project Settings → Environment Variables add `GEMINI_API_KEY` (optional: `GEMINI_MODEL`).
3. Deploy. Edit your content in `lib/data.ts`.

## Hero portrait
Put your photo at `public/profile.jpg` (square, ~800x800). If it is missing, the site shows "AK" initials instead.
