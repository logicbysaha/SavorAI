# 🍽️ SavorAi — AI-Powered Pantry & Recipe Engine

> **Turn what's in your fridge into something delicious — before it expires.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff69b4?logo=framer)](https://www.framer.com/motion/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://savor-ai-git-main-logicbysahas-projects.vercel.app)

**Live App →** [savor-ai-git-main-logicbysahas-projects.vercel.app](https://savor-ai-git-main-logicbysahas-projects.vercel.app)

---

## ✨ Overview

SavorAi is a smart kitchen companion app that helps you:

- 📸 **Scan your pantry** using an AR-style vision scanner to detect and log ingredients
- 🍳 **Generate recipes** based on what you already own, prioritizing items about to expire
- 👨‍🍳 **Cook step-by-step** with a guided cooking mode, swap suggestions, and a built-in timer
- 🥫 **Track your inventory** with expiry alerts, quantity controls, and easy item management
- 🛒 **Build a smart grocery list** that auto-fills missing ingredients with prices and swap options
- 🌱 **Measure your impact** — see how many meals you saved, money you saved, and CO₂ you averted

---

## 📱 App Screens

| Screen | Description |
|--------|-------------|
| `/scan` | AR Pantry Vision Scanner with bounding box overlays and a slide-up item sheet |
| `/recipes` | Recipe Engine with match percentages, expiry banners, and filter chips |
| `/cook/[id]` | Step-by-step guided cooking with timer, swap callouts, and progress bar |
| `/pantry` | Inventory tracker grouped by freshness, with add/remove functionality |
| `/grocery` | Smart shopping list with owned vs. missing breakdown, prices, and swap toggles |
| `/profile` | Impact Dashboard with stats grid, tag filters, and a masonry favorites grid |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** (App Router) | Core framework with file-based routing |
| **TypeScript** | Type safety across the entire codebase |
| **Tailwind CSS** | Utility-first styling with custom design tokens |
| **Framer Motion** | Page transitions, drawer animations, and micro-animations |
| **Zustand** | Lightweight global state management |
| **Lucide React** | Clean, consistent icon library |

### Design Tokens
```js
colors: {
  sage:       '#2A4D38'  // Primary brand green
  terracotta: '#E06343'  // Expiry / warning accent
  oatmeal:    '#F0EFEA'  // Light background
  charcoal:   '#141715'  // Dark text / dark background
  cream:      '#FAFA99'  // Callout highlights
  mutedAsh:   '#8A8E8B'  // Muted secondary text
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/logicbysaha/SavorAI.git
cd SavorAI

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── scan/         # AR Pantry Vision Scanner
│   ├── recipes/      # Recipe Engine
│   ├── cook/[id]/    # Step-by-step Cooking Mode
│   ├── pantry/       # Inventory Tracker
│   ├── grocery/      # Smart Grocery List
│   ├── profile/      # Impact Dashboard
│   ├── layout.tsx    # Root layout with Navigation shell
│   └── globals.css   # Global styles and CSS variables
├── components/
│   └── Navigation.tsx  # Persistent bottom nav (mobile) / side dock (desktop)
└── store/
    └── useKitchenStore.ts  # Zustand global state with mock data
```

---

## 🎨 Features

- **Mobile-first, responsive design** — Bottom nav bar on mobile, floating side dock on desktop
- **Framer Motion animations** — Smooth page transitions, spring-physics drawers, and animated toggles
- **Zustand global state** — Real-time updates across all pages (e.g., marking an item as used removes it from pantry and updates impact stats)
- **Dark mode support** — Full dark/light mode via CSS variables

---

## 📦 Deployment

This app is deployed on **Vercel** with automatic deployments on every push to `main`.

To deploy your own instance:
1. Fork this repository
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your forked repo
4. Click **Deploy** — no configuration needed!

---

## 📄 License

MIT License — feel free to use this project however you like.

---

<p align="center">Built with ❤️ using Next.js and deployed on Vercel</p>
