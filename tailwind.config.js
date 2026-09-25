/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          main: '#5865F2',
          hover: '#4752C4',
          dark: '#313338',
        },
        dark: {
          bg: '#030712',
          card: '#0b0f19',
          input: '#111827',
          border: '#1f293d'
        }
      }
    },
  },
  plugins: [],
}