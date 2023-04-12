/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
      backgroundImage: {
        'spots-pattern': "radial-gradient( hsla(215 27.907% 16.863%/0.2) 0.5px, hsla(0 0% 94.902%/0.1) 0.5px)"
      }
      },
  },
  plugins: [],
}

