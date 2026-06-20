/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Violet/Purple — warna utama AMBAchamp
        brand: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed', // ← PRIMARY
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Accent amber
        accent: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // Dark landing bg
        dark: {
          950: '#05050f',
          900: '#0a0a1a',
          800: '#0f0f2a',
          700: '#1a1a3e',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
        'dark-gradient': 'linear-gradient(180deg, #05050f 0%, #0a0a1a 100%)',
        'card-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06)',
        'card-hover': '0 8px 24px rgba(124,58,237,.15)',
        'brand': '0 4px 20px rgba(124,58,237,.35)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
