/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,css,html}'
  ],
  theme: {
    extend: {
      colors: {
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
      backgroundColor: {
        'dark-bg': 'var(--color-bg-primary)',
        'dark-bg-secondary': 'var(--color-bg-secondary)',
        'dark-bg-card': 'var(--color-bg-card)',
      },
      textColor: {
        'white': 'var(--color-text-primary)',
        'gray-300': 'var(--color-text-secondary)',
        'gray-400': 'var(--color-text-muted)',
      },
      borderColor: {
        'dark-border': 'var(--color-border)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
