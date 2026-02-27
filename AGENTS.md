# AGENTS.md - Agentic Coding Guidelines

This file provides guidelines for agents operating in this repository.

## Project Overview

- **Project Name**: astronautical-azimuth (Portfolio)
- **Type**: Astro SSR with TypeScript + Tailwind CSS
- **Core Functionality**: Dynamic GitHub portfolio with search, filters, and project detail pages
- **Node Version**: 18+

## Build / Lint / Test Commands

### Available Scripts

```bash
# Install dependencies
npm install

# Start development server (http://localhost:4321)
npm run dev

# Build production site to ./dist/
npm run build

# Preview production build locally
npm run preview

# Run TypeScript type checking
npm run check

# Lint code
npm run lint

# Format code
npm run format
```

### Environment Variables

Create a `.env` file (see `.env.example`):

```bash
# Required: GitHub Personal Access Token
GITHUB_TOKEN=ghp_your_token_here

# Optional: Google Analytics
# GA_TRACKING_ID=G-XXXXXXXXXX
```

**To create a GitHub Token:**
1. Go to https://github.com/settings/tokens
2. Generate new token with `repo` scope (for private repos) or `public_repo` (public only)

## Code Style Guidelines

### General Principles

- Use **4 spaces** for indentation (not tabs)
- Use **ES modules** syntax (import/export)
- Enable **strict TypeScript** mode
- Keep files focused and modular

### TypeScript

- Always define **interfaces/types** for data structures
- Use `type` for unions/intersections, `interface` for objects
- Enable strict null checks
- Avoid `any` - use `unknown` when type is uncertain

```typescript
// Good
interface TechItem {
    title: string;
    description: string;
    experience: string;
    tags: string[];
    icon: string;
}

export const techStack: TechItem[] = [...];

// Props interface in Astro components
interface Props {
    title: string;
    description: string;
}
```

### Astro Components

- Use `interface Props` for component props
- Extract props with `const { ... } = Astro.props;`
- Place imports in the frontmatter code fence (between `---`)
- Use semantic HTML elements

```astro
---
import Layout from "../layouts/Layout.astro";

interface Props {
    title: string;
    description: string;
}

const { title, description } = Astro.props;
---

<Layout title={title} description={description}>
    <main>
        <slot />
    </main>
</Layout>
```

### Imports

- Use relative imports (`../styles/global.css`)
- Group imports: first external/framework, then local
- Order: Astro layouts → Components → Styles → Data/Utils

```astro
---
import Layout from "../layouts/Layout.astro";
import Component from "../components/Component.astro";
import "../styles/hero.css";
import { techStack } from "../data/techStack";
---
```

### CSS / Styling

- Use **CSS custom properties** for theming (see `src/styles/global.css`)
- Use Tailwind CSS for utility classes
- Use semantic class names
- Follow BEM-like naming for complex components

```css
/* Example from project */
.hero { }
.hero-title { }
.hero-title--highlighted { }
```

### Naming Conventions

- **Files**: kebab-case (`tech-stack.ts`, `hero-section.astro`)
- **Components**: PascalCase (`Layout.astro`, `TechCard.astro`)
- **Variables/functions**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE or camelCase with prefix
- **Classes**: PascalCase

### HTML / Accessibility

- Always include `alt` attributes on images
- Use semantic HTML (`<main>`, `<section>`, `<header>`, `<footer>`)
- Include `rel="noopener noreferrer"` for external links
- Use ARIA labels for icon-only buttons

```html
<a href="https://github.com/user" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
    <svg aria-hidden="true"></a>
```

###...</svg>
 Error Handling

- Use try/catch for async operations
- Return meaningful error messages
- Handle edge cases gracefully

### Git / Version Control

- Use conventional commits: `feat/`, `fix/`, `chore/`, `docs/`, `test/`, `ci/`
- Keep commits atomic and focused
- Use feature branches for new features

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── RepoCard.astro         # Repository card component
│   │   ├── SearchBar.astro         # Search input
│   │   ├── FilterBar.astro         # Topic/language filters & sort
│   │   └── FeaturedSection.astro   # Featured projects section
│   ├── config/
│   │   └── featured.ts             # Featured projects configuration
│   ├── data/
│   │   └── techStack.ts           # Tech stack data
│   ├── layouts/
│   │   └── Layout.astro           # Base layout with SEO
│   ├── lib/
│   │   └── github.ts              # GitHub API (GraphQL) utilities
│   ├── pages/
│   │   ├── index.astro            # Projects listing page
│   │   └── project/
│   │       └── [slug].astro       # Project detail page
│   └── styles/
│       ├── global.css             # Global styles & CSS variables
│       ├── hero.css               # Hero section
│       └── stack.css              # Tech stack section
├── public/
│   └── oggiesutrisna-cv-2026-damascus.pdf
├── .env.example                   # Environment variables template
├── astro.config.mjs               # Astro configuration
├── tailwind.config.mjs            # Tailwind configuration
├── lighthouse-budget.json          # Lighthouse CI budget
└── package.json
```

## GitHub API Integration

The project uses GitHub GraphQL API for efficient data fetching:

- **API Endpoint**: `https://api.github.com/graphql`
- **Authentication**: Personal Access Token (stored in `GITHUB_TOKEN`)
- **Caching**: Server-side with ISR (revalidates on each request for now)
- **Rate Limits**: Handled with proper error messages

### Excluded Repos

The following repos are excluded from the portfolio:
- `crispylogger` (as requested by user)

### Featured Projects

Edit `src/config/featured.ts` to add pinned/featured projects:

```typescript
export const featuredProjects: FeaturedProject[] = [
    {
        repoName: 'porto',
        title: 'Portfolio Website',
        description: 'Modern portfolio built with Astro and glassmorphism design',
        badge: 'Featured',
        priority: 1,
    },
];
```

## Common Tasks

### Adding New Featured Project

1. Edit `src/config/featured.ts`
2. Add a new entry with `repoName`, `title`, `description`, and `priority`

### Modifying Search/Filter Behavior

The filtering logic is in the inline `<script>` in `src/pages/index.astro`.

### Changing GitHub Username

Update `GITHUB_USERNAME` constant in:
- `src/pages/index.astro`
- `src/pages/project/[slug].astro`

## VS Code Extensions

Recommended extensions (from `.vscode/extensions.json`):
- `astro-build.astro-vscode` - Astro language support
- `esbenp.prettier-vscode` - Code formatting
- `dbaeumer.vscode-eslint` - Linting

Debug configuration is available in `.vscode/launch.json`.

## CI/CD

GitHub Actions workflow at `.github/workflows/ci.yml`:
- TypeScript type checking
- Building
- Lighthouse performance checks (warnings only)
- Auto-deploy to Vercel on main branch
