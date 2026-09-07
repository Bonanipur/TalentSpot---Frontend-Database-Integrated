# 🏆 TalentSpot — AI-Powered Sports Talent Identification

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase Ready](https://img.shields.io/badge/Supabase-Ready-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Democratizing sports scouting across India through computer vision, standardized biomechanical assessment protocols, and real-time talent analytics.**

---

## 📖 Overview

In many regions across India, exceptional raw athletic talent in rural and semi-urban communities goes unnoticed due to lack of expensive timing gates, force plates, and formal scouting networks.

**TalentSpot** bridges this divide by transforming standard mobile device cameras into intelligent biomechanical testing stations. By combining computer vision pose tracking with standardized athletic battery protocols (Vertical Jump, Sprint Acceleration, Agility Shuttle), TalentSpot enables grassroots coaches, scouts, and national sports bodies (such as the Sports Authority of India - SAI) to objectively identify, benchmark, and nurture future champions.

---

## ✨ Core Features & Workflows

| Feature | Description | Key Modules |
| :--- | :--- | :--- |
| **👤 Athlete Registration** | Rapid onboarding of emerging talent capturing age, gender, state, district, and sport. Generates unique scout badges (e.g. `TS-1024`). | [`RegisterPage.tsx`](src/pages/RegisterPage.tsx) |
| **🏃 Assessment Protocol Hub** | Standardized testing battery featuring Vertical Jump (Explosive Power), 30m Sprint (Speed), and Agility Shuttle Runs. | [`AssessPage.tsx`](src/pages/AssessPage.tsx) |
| **🤖 AI Pose Tracking** | Live camera pre-check with dynamic SVG human skeleton overlay tracking 14 anatomical joints, knee flexion angles, and apex height. | [`TrialJumpPage.tsx`](src/pages/TrialJumpPage.tsx), [`AthleteViz.tsx`](src/components/AthleteViz.tsx) |
| **📊 Real-time Scoring** | Instant post-trial scorecard calculating explosive power wattage, AI confidence score, and composite talent tier (`High`, `Medium`, `Low`). | [`ResultsPage.tsx`](src/pages/ResultsPage.tsx) |
| **🗺️ Geographic Talent Heatmap** | Interactive SVG map of India illustrating regional scout density, athlete counts, and top regional sports disciplines. | [`DashboardPage.tsx`](src/pages/DashboardPage.tsx) |
| **📋 Athlete Directory** | Searchable roster filterable by Indian state, district, sport, and potential rating with one-click profile access. | [`AthletesPage.tsx`](src/pages/AthletesPage.tsx) |
| **📈 Athlete Biometric Dossier** | Comprehensive talent profile featuring speed, power, and agility metric gauges, historical performance curves, and anthropometric metrics. | [`ProfilePage.tsx`](src/pages/ProfilePage.tsx) |

---

## 🛠️ Technology Stack

- **Frontend Framework**: [React 18](https://react.dev/) with [TypeScript 5.5](https://www.typescriptlang.org/)
- **Build Tool & Bundler**: [Vite 5](https://vitejs.dev/) with Fast Refresh
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with custom sports color palettes (Royal, Gold, Emerald, Purple)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visualization**: Mathematical inline SVG rendering (Skeleton tracking, circular score gauges, India talent map)
- **Backend / Database Client**: [`@supabase/supabase-js`](https://supabase.com/docs/reference/javascript) (prepared for full cloud sync)

---

## 📂 Repository Structure

```
TalentSpot/
├── .gitignore                   # Git exclusion rules (node_modules, dist, env)
├── eslint.config.js             # Code quality & TypeScript linting rules
├── index.html                   # HTML entrypoint
├── package.json                 # Project dependencies & npm scripts
├── package-lock.json            # Deterministic dependency tree
├── postcss.config.js            # PostCSS plugin configuration
├── tailwind.config.js           # Custom design system tokens & colors
├── tsconfig.json                # Root TypeScript configuration
├── tsconfig.app.json            # Client TypeScript options & alias paths (@/*)
├── tsconfig.node.json           # Node configuration for tooling
├── vite.config.ts               # Vite configuration with path aliases
│
├── docs/                        # Deep-dive architecture & engineering docs
│   ├── ARCHITECTURE.md          # Component hierarchy & state routing design
│   ├── DATA_MODELS.md           # TypeScript types & Supabase PostgreSQL DDL
│   └── SYSTEM_SUGGESTIONS.md    # AI/CV, offline PWA, & cloud roadmap
│
└── src/
    ├── App.tsx                  # Root state controller & navigation manager
    ├── main.tsx                 # React application entry point
    ├── index.css                # Global Tailwind directives & animations
    ├── vite-env.d.ts            # Vite client type declarations
    │
    ├── components/              # Reusable UI & visualization components
    │   ├── AthleteViz.tsx       # Custom SVG skeletal pose & kinematic tracker
    │   ├── Footer.tsx           # Standard application footer
    │   ├── Navbar.tsx           # Responsive top navigation header
    │   └── ProgressIndicator.tsx# Multi-stage assessment progress tracker
    │
    ├── data/
    │   └── mockData.ts          # Central data store (Athletes, Trials, Districts)
    │
    ├── hooks/
    │   └── useAnimations.ts     # Physics timers & jump animation loops
    │
    └── pages/                   # Application screens
        ├── AssessPage.tsx       # Assessment protocol hub
        ├── AthletesPage.tsx     # National talent directory
        ├── DashboardPage.tsx    # Scout analytics & India talent map
        ├── HomePage.tsx         # Landing page & platform vision
        ├── ProfilePage.tsx      # Comprehensive athlete dossier
        ├── RegisterPage.tsx     # New athlete intake form
        ├── ResultsPage.tsx      # Assessment scoring & performance report
        ├── TrialJumpPage.tsx    # Live jump trial & pose estimation simulation
        └── TrialSelectPage.tsx  # Assessment configuration & camera guide
```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (version 8 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/NayandG07/TalentSpot.git
cd TalentSpot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Local Development Server
```bash
npm run dev
```
The application will launch locally at `http://localhost:5173/`.

### 4. Build for Production
```bash
npm run build
```
Generates optimized, minified production assets inside the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 📚 Technical Documentation

For in-depth engineering details, consult the dedicated guides in the [`docs/`](docs/) directory:

- ⚡ [**V2 Computer Vision & Kinematics Specification**](docs/V2_SYSTEM_SPECIFICATION.md) — Real-time MediaPipe Pose pipeline, Newtonian flight-time kinematics ($h = gt^2/8$), Sayers power formulas, and persistent DOM video lifecycle.
- 🏛️ [**Architecture & Component Design**](docs/ARCHITECTURE.md) — Comprehensive breakdown of the state-based screen router, component hierarchy, SVG visualization engine, and animation hooks.
- 📊 [**Data Models & Database Schemas**](docs/DATA_MODELS.md) — Complete TypeScript data contracts, assessment scoring formulas, and production-ready Supabase PostgreSQL schemas with Row Level Security (RLS).
- 🚀 [**System Improvement Suggestions**](docs/SYSTEM_SUGGESTIONS.md) — Strategic engineering roadmap covering on-device MediaPipe computer vision, offline-first PWA for rural scouting grounds, and Sports Authority of India (SAI) national benchmarking.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to suggest improvements or add assessment protocols:
1. Fork the project repository.
2. Create a feature branch (`git checkout -b feature/sports-protocol`).
3. Commit your changes (`git commit -m 'feat: Add badminton agility protocol'`).
4. Push to the branch (`git push origin feature/sports-protocol`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
