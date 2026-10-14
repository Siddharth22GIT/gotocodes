# GotoCodes — Heaven for Devs 🚀

A modern fullstack web platform for **GotoCodes**: interactive learning modules, multi-category resources, Instagram short videos, gamified student learning, and an instant Admin Quick Studio — built for developers, by developers.

---

## 🎨 Latest Design & Architecture Updates

- **Minimalist Monochrome Dark Aesthetic**: Sleek Obsidian-black (`#050505`), pure crisp whites (`#FFFFFF`), and refined grayscale tones with glowing borders.
- **Solid Clean Button System**: Tactile flat and ghost aesthetic buttons that cleanly invert to solid white on hover with optimal contrast.
- **Headline Tech Logos**: Plain monochrome logos for **LeetCode**, **Python**, **JavaScript**, and **GitHub** directly framing the main headline (*"The Heaven for Developers."*).
- **Gamified Student Experience**:
  - Daily active streak counter (🔥)
  - XP progress bar with level progression (e.g., *Level 4: Syntax Sorcerer*)
  - Achievement badges earned (e.g., *Bug Hunter*, *DSA Pioneer*, *MERN Architect*)
  - Generous top spacing ensuring zero navbar overlap
- **Categorized Resource Library**: Filter by **PDF Documents**, **Ebooks & Guides**, **Handwritten Notes**, or **✨ All Resources**, with dynamic admin category creation and uniform card widths across all rows.
- **Bite-Sized Short Videos**: Compact vertical reel cards with direct Instagram links and upload placeholders.
- **Admin Quick Studio**: Floating bottom-right studio bar with instant item creation modals (`Add Module`, `Add Resource`, `Add Type`, `Short Video`) and a collapsible mini-pill toggle.
- **Experience & Community Stats**: Updated to **5+ Years of Experience** and **11K+ Active Devs / Students**.

---

## 📁 Project Structure

```
gotocodes/
└── nextjs-app/               # Unified Next.js Fullstack Application
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx             # Main Landing Page (Hero, Modules, Resources, Videos, Pricing, About)
    │   │   ├── dashboard/page.tsx   # Gamified Student Dashboard
    │   │   ├── admin/page.tsx       # Comprehensive Admin Hub
    │   │   ├── login/page.tsx       # Auth Login
    │   │   ├── register/page.tsx    # Auth Registration
    │   │   ├── modules/[slug]/      # Interactive Module & Lesson Viewer
    │   │   ├── api/                 # Next.js API Routes (Auth, Modules, Resources, Videos, Settings)
    │   │   └── globals.css          # Cyber-Orange Design Tokens, 3D Buttons & Animations
    │   ├── components/
    │   │   ├── layout/              # Fixed SiteHeader, Navbar & Footer
    │   │   ├── sections/            # Hero, Modules, Resources, ShortVideos, Pricing, About
    │   │   ├── admin/               # AdminQuickBar, ModuleAddModal, ResourceAddModal, ShortVideoAddModal
    │   │   └── ui/                  # Button3D, GlowCard, Modal, ShootingStars
    │   ├── context/                 # AuthContext (JWT & Local State)
    │   ├── lib/                     # Axios Client & MongoDB Connection
    │   └── models/                  # Mongoose Schemas (User, Module, Resource, ResourceType, ShortVideo)
    └── public/
        └── icons/                   # LeetCode, JavaScript, Python, GitHub Tech Logos
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or newer (v20+ recommended)
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/gotocodes`) or MongoDB Atlas cloud URI

### 2. Installation
Open a terminal in the project directory:

```bash
cd nextjs-app
npm install
```

### 3. Environment Variables
Create a `.env` or `.env.local` file inside `nextjs-app/`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/gotocodes
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```

The application will be running at **http://localhost:3000**.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🛡️ Admin Access & Controls
- Click the floating **Admin Studio** pill in the bottom-right corner to open quick-creation modals.
- Or navigate to **`/admin`** for the full management dashboard (content, tiers, pricing, and users).
