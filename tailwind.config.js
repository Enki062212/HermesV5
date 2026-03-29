/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          0: "#06050a",
          1: "#0b0a12", 
          2: "#100f1a",
          3: "#161524",
          4: "#1d1b2e",
        },
        gold: {
          50: "#f4e4bc",
          100: "#e8d6a3",
          200: "#d4b567",
          300: "#c9a84c",
          400: "#b8943a",
          500: "#a07830",
        },
        border: "#1e1c30",
        border2: "#2d2a48",
        text: "#f0ead6",
        muted: "#6b6580",
        dim: "#2e2b45",
      },
      fontFamily: {
        'display': ['Cormorant Garamond', 'serif'],
        'body': ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
