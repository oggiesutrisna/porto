# 🚀 Oggie Sutrisna - 3D Isometric Portfolio

A modern, visually stunning **3D Isometric Interactive Portfolio** built with **Vite**, **Three.js**, **TypeScript**, and **Tailwind CSS**. It features a Balinese-inspired dark sunset archipelago theme with modular structures reflecting professional projects, skill pedestals, biography, and contact kiosks.

[![Portfolio Status](https://img.shields.io/badge/Status-Live-brightgreen)](#) [![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)](#) [![Three.js](https://img.shields.io/badge/Three.js-0.184.0-000000?logo=three.js&logoColor=white)](#) [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript)](#)

---

## ✨ Core Highlights & Features

- **🎮 Playable Avatar & Physics**: Explore the islands in real-time as a fully-animated 3D avatar using **W, A, S, D** or **Arrow Keys**, complete with a clicking jump Easter egg!
- **💥 Solid Collision Hitboxes & Sliding**: Custom Circular (pedestals & signposts) and Rectangular 2D Box2 (buildings) collision system. Enables the character to slide smoothly along walls and corners without clipping or getting stuck!
- **⚡ Proximity Interactions**: Approach houses or pedestals to trigger sleek, responsive, glassmorphic bottom-center HUD prompts showing object titles. Tap **E** or click the prompt to open dialogs!
- **🔥 Snapped Box3Helper Highlights**: Solid-geometry outline frames that automatically filter out floating text sprites and light sources, wrapping physical assets inside custom-offset neon frames.
- **✨ Premium Modal Transitions**: Modern `@starting-style` CSS animations coupled with discrete transitions (`allow-discrete`) for native hardware-accelerated modal entry/exit and blurred backdrops.
- **🔒 Secure Tokenless Integration**: Exclusively utilizes safe public GitHub REST endpoints and raw document fallbacks, preventing credential exposure or Vite-compiled token leaks.
- **📱 Fully Responsive Layout**: Responsive canvas layout resizing, complete with a flat-grid repository card list overlay fallback for non-WebGL browsers.

---

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| **Core Framework** | Vite 6.x |
| **3D Rendering** | Three.js (WebGL) |
| **Logic & Engine** | Strict TypeScript |
| **Styling & UI** | Tailwind CSS & Vanilla CSS Variables |
| **Asset Modules** | Kenney Low-Poly Suburban & Roads packages |
| **Fonts** | Outfit, Inter (Google Fonts) |
| **Deployment** | Vercel Static deployment |

---

## 📁 Project Structure

```text
/
├── public/
│   ├── assets/           # Low-poly GLB models & textures
│   └── i-putu-oggie-sutrisna-ady_20260227_2116.pdf
├── src/
│   ├── data/             # Static profile data & local fallbacks
│   │   ├── projects.ts
│   │   └── skills.ts
│   ├── lib/              # GitHub API fetchers & utilities
│   │   └── github.ts
│   ├── three/            # Core Three.js implementation
│   │   ├── camera.ts
│   │   ├── character.ts  # Animated WASD Character class
│   │   ├── interactions.ts
│   │   ├── scene.ts
│   │   └── world.ts      # Procedural modular road & island placement
│   ├── styles/
│   │   └── global.css    # Balinese dark sunset variables & modals
│   ├── main.ts           # Game loop ticker & overlay bindings
│   └── types/
│       └── github.ts
├── index.html            # Main viewport structure & HUD modal overlays
├── vite.config.ts
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- bun or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/oggiesutrisna/porto.git

# Navigate to directory
cd porto

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will launch at **`http://localhost:4321`** (Locked ports for custom servers).

---

## 📝 Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production bundle to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run format` | Format files with Prettier |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Oggie Sutrisna**  
Senior Software Engineer

- GitHub: [@oggiesutrisna](https://github.com/oggiesutrisna)
- LinkedIn: [oggiesutrisna](https://linkedin.com/in/oggiesutrisna)
- Twitter: [@oggiesutrisna](https://twitter.com/oggiesutrisna)

---

⭐ If you like this 3D town explorer portfolio, give it a star!
