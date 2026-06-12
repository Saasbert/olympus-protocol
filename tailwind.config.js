/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mecha: {
          dark: '#0a0a1a',
          steel: '#1a1a3a',
          cyan: '#00d4ff',
          neon: '#00ff88',
          crimson: '#ff2244',
          amber: '#ff8800',
        },
      },
      fontFamily: {
        mecha: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
}
