import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef7ff',
          100: '#d8ecff',
          200: '#b5dcff',
          500: '#1d6fd8',
          600: '#1458ae',
          700: '#11498e',
          900: '#0d2b52',
        },
        accent: {
          100: '#d9f7f2',
          500: '#14b8a6',
          600: '#0d9488',
        },
        surface: {
          50: '#f7fafc',
          100: '#eef3f8',
          200: '#dde7f1',
          700: '#35506b',
          900: '#102033',
        },
        success: '#15803d',
        warning: '#ca8a04',
        danger: '#dc2626',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        panel: '0 18px 50px -24px rgba(16, 32, 51, 0.28)',
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgba(17, 73, 142, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(17, 73, 142, 0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '28px 28px',
      },
    },
  },
  plugins: [],
} satisfies Config;
