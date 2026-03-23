# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
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

## Project Architecture

This is an **Astro 5 portfolio site** with GitHub integration, featuring:
- Static site generation with server-side data fetching
- GitHub GraphQL API for repository/user data
- Client-side search, filtering, and sorting
- Dark/light theme toggle with localStorage persistence
- Dynamic project detail pages at `/project/[slug]`

### GitHub Data Layer (`src/lib/github.ts`)

The site fetches repository data using GitHub's GraphQL API via `graphql-request`:

- **Requires `GITHUB_TOKEN`** environment variable (create at https://github.com/settings/tokens with `repo` or `public_repo` scope)
- `fetchGitHubUser()` - Fetches user profile and up to 50 repos
- `fetchRepoReadme()` - Fetches README markdown for individual repos
- `filterRepos()`, `sortRepos()` - Server-side filtering utilities
- Language colors defined in `src/types/github.ts`

### Data Flow

1. **Build time**: `src/pages/index.astro` calls `fetchGitHubUser()`, filters excluded repos, renders static HTML
2. **Runtime**: Client-side scripts listen for custom events (`repo-search`, `filter-topics`, `repo-sort`) and re-render the repo grid via DOM manipulation
3. **Project pages**: `src/pages/project/[slug].astro` dynamically generates pages, fetches README, renders markdown with `marked` + sanitizes via `dompurify`

### Component Communication Pattern

Components communicate via **custom window events** rather than props:
- `repo-search` - Search input changes (debounced 300ms)
- `filter-topics` - Topic selection changes
- `filter-language` - Language filter changes
- `repo-sort` - Sort option changes
- `filter-clear` - Reset all filters

See `src/pages/index.astro` script block for event listeners.

### Theme Implementation

Theme toggle (`src/components/ThemeToggle.astro`) uses:
- `localStorage` key: `theme` (values: `'dark'` or `'light'`)
- CSS class on `<html>`: `light-mode`
- Inline script in `Layout.astro` prevents flash of wrong theme
- CSS custom properties (`:root` vs `:root.light-mode`) handle color switching

### Styling System

- **Tailwind CSS** via `@astrojs/tailwind` for utility classes
- **Custom CSS variables** in `src/styles/global.css` for theming
- Design tokens follow naming: `--color-bg-primary`, `--font-display`, `--spacing-4`, etc.
- Light mode overrides use `html.light-mode` selector

### Configuration Files

| File | Purpose |
|------|---------|
| `src/config/featured.ts` | Pin repos to top with custom titles/descriptions |
| `src/types/github.ts` | TypeScript interfaces + language color mapping |
| `.env` | `GITHUB_TOKEN` (copy from `.env.example`) |

### Excluding Repositories

Edit `src/pages/index.astro`:

```typescript
const excludedRepos = ['crispylogger'];
repos = repos.filter((repo) => !excludedRepos.includes(repo.name));
```

### Markdown Rendering

Project pages render READMEs with:
- `marked` - Parse markdown to HTML
- `jsdom` - Provide DOM for DOMPurify
- `dompurify` - Sanitize HTML (XSS prevention)

### GitHub Username

To change the GitHub user, update `GITHUB_USERNAME` constant in:
- `src/pages/index.astro`
- `src/pages/project/[slug].astro`

## File Structure

```
src/
├── components/       # Astro components (RepoCard, SearchBar, FilterBar, etc.)
├── config/           # Featured projects configuration
├── data/             # Static data (techStack.ts)
├── layouts/          # Base Layout.astro with SEO meta tags
├── lib/              # GitHub API client (github.ts)
├── pages/
│   ├── index.astro           # Main listing page
│   └── project/[slug].astro  # Dynamic project detail pages
├── styles/           # Global CSS with design tokens
└── types/            # TypeScript interfaces (github.ts)
```

## TypeScript

- Strict mode enabled (`astro/tsconfigs/strict`)
- Use `interface Props` pattern for Astro component props
- Import types from `src/types/github.ts` for GitHub data
