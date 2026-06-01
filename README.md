# 🚀 Oggie Sutrisna - Portfolio

A modern, visually stunning portfolio website built with **Astro** featuring glassmorphism design, interactive animations, and a beautiful dark theme.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![Astro](https://img.shields.io/badge/Astro-5.16.6-BC52EE?logo=astro) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript)

## ✨ Features

- **Modern Dark Theme** - Elegant dark palette with purple/violet accent gradients
- **Glassmorphism Design** - Beautiful frosted glass effects with backdrop blur
- **Interactive Tech Stack** - Cards with cursor-following glow effects
- **Smooth Animations** - Fade-in, float, and scale animations throughout
- **Fully Responsive** - Looks great on all devices
- **SEO Optimized** - Proper meta tags, structured data, and semantic HTML
- **Fast Performance** - Built with Astro for optimal loading speed

## 🎨 Design Highlights

### Hero Section
- Animated gradient orbs in background
- Grid overlay with noise texture
- Staggered entrance animations
- Social links with hover effects

### Tech Stack Section
- **Interactive Glow Effect** - Cursor-following spotlight on each card
- **6 Technology Categories**: Backend, Frontend, Database, DevOps, System Design, Tools
- Experience badges that appear on hover
- Technology tags with accent highlighting

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Astro 5.x |
| **Language** | TypeScript |
| **Styling** | Vanilla CSS with custom properties |
| **Fonts** | Inter, Outfit (Google Fonts) |
| **Icons** | Custom SVG icons |
| **Deployment** | Vercel / Netlify ready |

## 📁 Project Structure

```text
/
├── public/
│   └── i-putu-oggie-sutrisna-ady_20260227_2116.pdf
├── src/
│   ├── components/       # Astro Overlay & Modal components
│   ├── data/
│   │   ├── projects.ts   # Unified projects data
│   │   └── skills.ts     # Unified skills data
│   ├── layouts/
│   │   └── Layout.astro  # Base layout with SEO
│   ├── pages/
│   │   └── index.astro   # Main 3D viewport canvas
│   ├── three/            # Three.js engine and island layout logic
│   └── styles/
│       └── global.css    # Global sunset theme & layout variables
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

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

The site will be available at `http://localhost:4321`

## 📝 Customization

### Update Personal Info

Edit the frontmatter in `src/pages/index.astro`:

```javascript
const siteTitle = "Your Name | Your Title";
const siteDescription = "Your description here";
```

### Modify Tech Stack

Edit `src/data/techStack.ts` to update your technologies:

```typescript
export const techStack = [
  {
    title: "Category Name",
    description: "Description of your expertise",
    experience: "X+ years",
    tags: ["Tech1", "Tech2", "Tech3"],
    icon: "iconName" // server, layout, database, cloud, architecture, wrench
  },
  // Add more categories...
];
```

### Update Social Links

Find the social links section in `src/pages/index.astro` and update the URLs:

```html
<a href="https://github.com/yourusername" ...>
<a href="https://linkedin.com/in/yourusername" ...>
<a href="https://twitter.com/yourusername" ...>
```

## 🧞 Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro check` | Run TypeScript checks |

## 🎨 Color Palette

```css
/* Primary Background */
--color-bg-primary: #0a0a0f;
--color-bg-secondary: #12121a;

/* Accent Colors (Gradient) */
--color-accent-1: #6366f1;  /* Indigo */
--color-accent-2: #8b5cf6;  /* Violet */
--color-accent-3: #a855f7;  /* Purple */
--color-accent-4: #ec4899;  /* Pink */

/* Text */
--color-text-primary: #ffffff;
--color-text-secondary: #a1a1aa;
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Oggie Sutrisna**  
Senior Software Engineer

- GitHub: [@oggiesutrisna](https://github.com/oggiesutrisna)
- LinkedIn: [oggiesutrisna](https://linkedin.com/in/oggiesutrisna)
- Twitter: [@oggiesutrisna](https://twitter.com/oggiesutrisna)

---

⭐ If you found this helpful, please give it a star!
