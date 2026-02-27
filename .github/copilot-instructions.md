# Copilot Instructions for Porto Portfolio

## Build & Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# TypeScript checking
npm run check

# Linting
npm run lint

# Code formatting
npm run format
```

## Architecture Overview

This is an **Astro 5 static site with server-side rendering** (SSR via Node adapter), featuring dynamic GitHub repository integration using GraphQL API.

### Key Components

1. **GitHub Data Layer** (`src/lib/github.ts`)
   - Fetches user profile and repositories via GitHub GraphQL API
   - Requires `GITHUB_TOKEN` environment variable (personal access token)
   - Handles filtering, sorting, and caching of repository data

2. **Page Structure**
   - `src/pages/index.astro` - Main listing page with featured projects, search, and filters
   - `src/pages/project/[slug].astro` - Dynamic project detail pages for each repository

3. **Repository Filtering & Display** (`src/components/repoFilter.ts`)
   - Client-side search and filtering by topic, language, stars
   - Sorting options: name, stars, updated date, creation date
   - Featured projects override with custom configuration (`src/config/featured.ts`)

4. **Styling**
   - Vanilla CSS with design tokens (custom properties) in `src/styles/global.css`
   - Tailwind CSS for utility classes (configured in `@astrojs/tailwind`)
   - Component-specific styles: `hero.css`, `stack.css`
   - Glassmorphism design with animated gradient orbs and grid overlays

### Data Flow

1. Build time: GitHub API fetches user + repos → filtered/sorted → static HTML
2. Runtime: Client-side search/filter updates DOM without page reload
3. Individual project pages: Generated from repo slug, markdown content from README

## Configuration

### Environment Variables

Create `.env` from `.env.example`:

```bash
GITHUB_TOKEN=ghp_your_token_here  # Required for GitHub API access
# GA_TRACKING_ID=G-XXXXXXXXXX      # Optional: Google Analytics
```

**To create a GitHub Token:**
1. Go to https://github.com/settings/tokens
2. Generate personal access token with `repo` or `public_repo` scope

### Featured Projects

Edit `src/config/featured.ts` to pin projects to the top:

```typescript
export const featuredProjects: FeaturedProject[] = [
    {
        repoName: 'porto',
        title: 'Portfolio Website',
        description: 'Modern portfolio built with Astro',
        badge: 'Featured',
        priority: 1,
    },
];
```

### Tech Stack Display

Edit `src/data/techStack.ts` to customize technology categories (backend, frontend, database, etc).

### Excluded Repositories

Edit the `excludedRepos` array in `src/pages/index.astro` to hide specific repositories from the portfolio.

## Code Conventions

### TypeScript & Astro Components

- **Props**: Use `interface Props` pattern, extract with destructuring
- **Imports**: Group as framework → components → styles → utilities
- **Files**: kebab-case (e.g., `tech-stack.ts`), components in PascalCase
- **CSS**: Use custom properties for colors/spacing, follow BEM-like naming

### Types

See `src/types/github.ts` for TypeScript interfaces:

```typescript
export interface GitHubRepo {
    name: string;
    description: string | null;
    url: string;
    isArchived: boolean;
    // ... other fields
}
```

### CSS Variables

```css
/* Use in src/styles/global.css */
--color-bg-primary: #0a0a0f;
--color-accent-1: #6366f1;
--color-text-primary: #ffffff;
```

### Markdown Rendering

- README content is fetched from repositories and rendered as HTML
- Uses `marked` library with `jsdom` for sanitized parsing
- Security: `dompurify` sanitizes HTML to prevent XSS

## Project Structure

```
src/
├── components/          # Astro components (SearchBar, FilterBar, RepoCard)
├── config/              # Configuration (featured projects)
├── data/                # Static data (tech stack)
├── layouts/             # Base Layout.astro
├── lib/                 # Utilities (github.ts for API calls)
├── pages/               # Routes (index.astro, project/[slug].astro)
├── styles/              # Global CSS and component styles
└── types/               # TypeScript interfaces
```

## Common Tasks

### Add a Repository to Featured Section
1. Edit `src/config/featured.ts`
2. Add entry with `repoName` matching GitHub repo name
3. Set `priority` to control ordering

### Hide a Repository from Portfolio
Edit `src/pages/index.astro` and add repo name to `excludedRepos` array

### Change GitHub Username
Update `GITHUB_USERNAME` constant in:
- `src/pages/index.astro`
- `src/pages/project/[slug].astro`

### Update Profile Info
Edit frontmatter in `src/pages/index.astro`:
- `siteTitle` - Page title
- `siteDescription` - Meta description

### Customize Colors
Edit CSS custom properties in `src/styles/global.css` (--color-* variables)

## CI/CD & Testing

- **CI Workflow**: `.github/workflows/ci.yml` runs TypeScript checks, builds, and Lighthouse performance validation
- **Linting**: ESLint configured for TypeScript and Astro files
- **Formatting**: Prettier configured for consistency
- **No unit tests configured** - add Vitest if needed for component testing

### MCP Servers

The Playwright MCP server is configured for testing interactive components (search, filters, repository cards). Use it to automate browser-based tests and validate UI interactions.

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `astro` | Static site generator with SSR |
| `@astrojs/tailwind` | Tailwind CSS integration |
| `@astrojs/node` | Node adapter for SSR |
| `graphql-request` | GitHub GraphQL API client |
| `marked` | Markdown parser |
| `jsdom` | DOM implementation for markdown |
| `dompurify` | XSS sanitization |
| `eslint`, `prettier` | Code quality & formatting |

## Debugging

- **Type Errors**: Run `npm run check` to validate TypeScript
- **API Issues**: Check `GITHUB_TOKEN` is set and valid, monitor rate limits
- **Build Failures**: Check `npm run build` output, verify no missing dependencies
- **Layout/Styling**: Browser DevTools or local preview with `npm run preview`

## Node & Astro Version

- **Node**: 18+ required
- **Astro**: 5.16.6+
- **TypeScript**: Strict mode enabled (from `astro/tsconfigs/strict`)

## Performance Notes

- Static generation with dynamic routes (project pages generated at build time)
- Lighthouse CI budget configured in `lighthouse-budget.json`
- Assets optimized via Astro's default image & bundling optimization
