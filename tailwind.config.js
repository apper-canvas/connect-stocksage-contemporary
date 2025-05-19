/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          light: '#93c5fd',
          dark: '#1d4ed8'
        },
        secondary: {
          DEFAULT: '#14b8a6',
          light: '#5eead4',
          dark: '#0f766e'
        },
        accent: '#f97316',
        surface: {
          50: '#f0f9ff',   // Lightest - Sky Blue 50
          100: '#e0f2fe',  // Sky Blue 100
          200: '#bae6fd',  // Sky Blue 200
          300: '#7dd3fc',  // Sky Blue 300
          400: '#38bdf8',  // Sky Blue 400
          500: '#0ea5e9',  // Sky Blue 500
          600: '#0284c7',  // Sky Blue 600
          700: '#0369a1',  // Sky Blue 700
          800: '#075985',  // Sky Blue 800
          900: '#0c4a6e'   // Darkest - Sky Blue 900
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}