/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        'bg-card': '#111111',
        primary: '#ff3131',
        'primary-glow': 'rgba(255,49,49,0.3)',
        secondary: '#ff6b00',
        text: '#ffffff',
        'text-muted': '#666666',
        success: '#00ff88',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'red-glow': '0 0 20px rgba(255, 49, 49, 0.3)',
      }
    },
  },
  plugins: [],
}
