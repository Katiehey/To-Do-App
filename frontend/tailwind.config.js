/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Enable class-based dark mode so you can toggle it via <html class="dark">
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        // Custom color palette for your dark theme components
        dark: {
          bg: '#0f172a',    // Slate-900
          card: '#1e293b',  // Slate-800
          border: '#334155', // Slate-700
        }
      },
      transitionProperty: {
        // Allows for smooth transitions when switching themes
        'theme': 'background-color, border-color, color',
      },
      transitionDuration: {
        '400': '400ms',
      }
    },
  },
  plugins: [
    // Preserves your existing form styling functionality
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}