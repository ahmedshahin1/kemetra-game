/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        egypt: {
          gold: "#D4AF37",
          "gold-light": "#F9E076",
          sand: "#C2B280",
          "sand-dark": "#8B7355",
          papyrus: "#F5DEB3",
          night: "#0A0A14",
          "night-light": "#1A1A2E",
          nile: "#003366",
          red: "#8B0000",
        }
      },
      fontFamily: {
        egyptian: ["Cinzel", "serif"],
        modern: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        'sand-texture': "url('/assets/textures/sand-texture.jpg')",
        'papyrus-pattern': "url('/assets/textures/papyrus.png')",
      },
      animation: {
        'sand-float': 'float 20s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-20px) translateX(10px)' },
        },
        glow: {
          'from': { 'box-shadow': '0 0 5px #D4AF37, 0 0 10px #D4AF37' },
          'to': { 'box-shadow': '0 0 20px #D4AF37, 0 0 30px #F9E076' },
        }
      }
    },
  },
  plugins: [],
}
