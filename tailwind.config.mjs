/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,css,html}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "brand-obsidian": "#0F1117",
        "brand-midnight": "#171923",
        "brand-cream": "#FFF9D5",
        "brand-ivory": "#FFFDF5",
        "brand-cream-light": "#FFFDF0",
        "brand-blue": "#2563EB",
        "brand-blue-tech": "#3B82F6",
        "brand-lime": "#D4FF00",
        "brand-orange": "#FF9D50",
        "brand-amber": "#D97706",
        "brand-dark": "#111118",
        "brand-green": "#10B981",
        "brand-emerald": "#059669",
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: 'var(--color-primary-light)',
          500: 'var(--color-primary)',
          600: 'var(--color-primary)',
          700: 'var(--color-primary-dark)',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        dark: {
          bg: 'var(--color-bg-primary)',
          'bg-secondary': 'var(--color-bg-secondary)',
          'bg-card': 'var(--color-bg-card)',
          border: 'var(--color-border)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        }
      },
      fontFamily: {
        heading: ["'Clash Display'", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        display: ["'Clash Display'", "sans-serif"],
      },
      boxShadow: {
        "brutal-sm": "3px 3px 0 0 #111118",
        brutal: "5px 5px 0 0 #111118",
        "brutal-lg": "7px 7px 0 0 #111118",
        "brutal-xl": "10px 10px 0 0 #111118",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "14px",
      },
    },
  },
  plugins: [],
}
