/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fe1f19",
        accent: "#0f0f0f",
        secondary: "#ffffff",
      },
      fontFamily: {
        sora: ["Sora", "Poppins", "sans-serif"],
        poppins: ["Sora", "Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #fe1f19, 0 0 10px #fe1f19' },
          '100%': { boxShadow: '0 0 20px #fe1f19, 0 0 40px #fe1f19' },
        }
      }
    },
  },
  plugins: [],
}
