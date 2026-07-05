# GotoCodes — Heaven for Devs

A full MERN-stack platform for the GotoCodes brand: tiered learning modules, a resource library, announcements, subscription plans (Free / Basic / Premium), student accounts, and an admin panel to control everything — no more auto-DMs.

Built with: **MongoDB, Express, React (Vite), Node.js**, Tailwind CSS, Framer Motion.

---

## 1. What's inside

```
gotocodes/
├── backend/     Express API + MongoDB models (auth, modules, resources, admin)
└── frontend/    React app (Vite) — the actual website
```

**Features implemented:**
- Dark, cinematic UI with a faint animated shooting-stars background, 3D pressable buttons, and "terminal window" styled cards for modules/resources (matches the coding brand)
- Student login/register (JWT-based auth)
- Modules (roadmaps, language/tech notes) split into lessons, each lesson lockable by tier
- Resources library (cheat sheets, templates, question banks) lockable by tier, with optional per-item pricing for one-off sellable resources
- Announcements bar + dashboard feed, with audience targeting (all / basic / premium)
- About section with a video the admin uploads a URL for (see note on video hosting below)
- Pricing section with Free / Basic / Premium tiers, editable prices
- Full **Admin Dashboard** (`/admin`) to:
  - Create/edit/delete modules and lessons, and set each lesson's required tier
  - Create/edit/delete resources, set tier + price
  - Post/edit/delete announcements
  - View all users and manually change any user's tier
  - Edit site settings (about text, about video URL, plan prices)

**Important honest limitation:** there is no real payment gateway wired in (no Stripe/Razorpay keys were provided, and I can't invent real payment credentials for you). Right now, upgrading a user's plan is done manually from the Admin → Users tab. The pricing page and checkout buttons are fully built and ready — plugging in Razorpay or Stripe just means adding their SDK + your API keys to `backend/routes/` and calling `PUT /api/admin/users/:id/tier` (or a new webhook route) after a successful payment. I can wire this up for you if you get API keys from Razorpay (recommended for Indian students, UPI support) or Stripe.

---

## 2. Prerequisites

Install these once on your machine:
1. **Node.js** (v18 or newer) — https://nodejs.org
2. **MongoDB** — either:
   - Install MongoDB Community Server locally: https://www.mongodb.com/try/download/community, or
   - Use a free cloud database at https://www.mongodb.com/cloud/atlas (easier — no local install, just copy a connection string)
3. **VS Code** — https://code.visualstudio.com

---

## 3. Setup (step by step)

### A. Unzip and open in VS Code
Unzip the folder, then open the `gotocodes` folder in VS Code (`File → Open Folder`).

### B. Backend setup
Open a terminal in VS Code (`` Ctrl+` ``) and run:

```bash
cd backend
npm install
cp .env.example .env
```

Now open `backend/.env` and set:
- `MONGO_URI` — if you installed MongoDB locally, the default `mongodb://127.0.0.1:27017/gotocodes` works as-is. If you're using MongoDB Atlas, paste your connection string here instead.
- `JWT_SECRET` — replace with any long random string (e.g. mash your keyboard for 40 characters).

Then seed the database with an admin account and sample content:

```bash
npm run seed
```

This creates:
- An admin login: **admin@gotocodes.dev / admin123** (change this password after logging in — see note below)
- 3 sample modules (DSA Roadmap, C++ Fundamentals, MERN Stack Projects) with lessons at different tiers
- 3 sample resources
- 1 welcome announcement

Start the backend:

```bash
npm run dev
```

You should see `GotoCodes API running on http://localhost:5000`. Keep this terminal running.

### C. Frontend setup
Open a **second terminal** in VS Code (click the `+` in the terminal panel) and run:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

You should see a local URL, typically `http://localhost:5173`. Open that in your browser.

---

## 4. Using it

- Visit the site, click **Join free** to create a student account, or **Log in** with the seeded admin account.
- Log in as admin (`admin@gotocodes.dev` / `admin123`) and go to `/admin` to:
  - Add your real modules, lessons, and resources
  - Set the About video URL (upload your video to something like Cloudinary, YouTube [unlisted], or any file host that gives you a direct video URL, then paste that URL into Admin → Settings)
  - Edit plan prices
  - Grant yourself/testers Basic or Premium tier manually from Admin → Users, to preview what locked content looks like for each plan

**To change the admin password:** log in as admin, and for now update it directly in the database (or I can add a "change password" screen for you — just ask).

---

## 5. Deploying it live (when you're ready)

This runs on your machine for now. To make it public:
- **Backend**: deploy to Render, Railway, or Fly.io (all have free tiers), point `MONGO_URI` at a MongoDB Atlas cluster
- **Frontend**: deploy to Vercel or Netlify, set `VITE_API_URL` to your live backend URL
- Buy a domain (e.g. gotocodes.com / gotocodes.dev) and point it at your frontend deployment

I'm happy to walk through deployment with you when you're ready — just ask.

---

## 6. What to customize first
- `backend/utils/seed.js` — replace sample modules/resources with your real content, or just add everything through the Admin panel instead (easier)
- `frontend/src/components/Footer.jsx` — Instagram link already points to `instagram.com/gotocodes`
- Colors/fonts live in `frontend/tailwind.config.js` if you ever want to tweak the theme
